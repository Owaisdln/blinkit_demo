import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiArrowLeft,
  HiOutlineExclamationCircle,
  HiOutlineXCircle,
  HiOutlineCheckCircle,
} from 'react-icons/hi';
import { getSingleOrder, cancelOrder } from '../services/orderService';
import { ORDER_STATUS_COLORS, ORDER_STATUSES } from '../constants';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { PLACEHOLDER_IMAGE } from '../constants';
import { useToast } from '../context/ToastContext';

// Order timeline step indicator
const StatusTimeline = ({ currentStatus }) => {
  const statuses = ['Placed', 'Packed', 'Out For Delivery', 'Delivered'];
  if (currentStatus === 'Cancelled') {
    return (
      <div className="flex items-center gap-2 text-red-500 font-semibold">
        <HiOutlineXCircle className="text-xl" />
        Order Cancelled
      </div>
    );
  }
  const currentIdx = statuses.indexOf(currentStatus);
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
      {statuses.map((s, i) => (
        <div key={s} className="flex items-center gap-1 shrink-0">
          <div className={`flex flex-col items-center gap-1`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
              ${i <= currentIdx ? 'bg-yellow-400 text-black' : 'bg-gray-100 text-gray-400'}`}>
              {i < currentIdx ? '✓' : i + 1}
            </div>
            <span className={`text-[10px] whitespace-nowrap font-medium ${i <= currentIdx ? 'text-gray-800' : 'text-gray-400'}`}>{s}</span>
          </div>
          {i < statuses.length - 1 && (
            <div className={`h-0.5 w-8 sm:w-12 mb-4 transition-colors ${i < currentIdx ? 'bg-yellow-400' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
};

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(null);

  const fetchOrder = useCallback(async () => {
    try {
      const { data } = await getSingleOrder(id);
      setOrder(data.order);
    } catch {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  // Countdown timer for cancel window (60 seconds)
  useEffect(() => {
    if (!order || order.status === 'Cancelled' || order.status === 'Delivered') return;
    const timeSince = Date.now() - new Date(order.createdAt).getTime();
    const remaining = Math.max(0, 60 - Math.floor(timeSince / 1000));
    setSecondsLeft(remaining);
    if (remaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { clearInterval(interval); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [order]);

  const handleCancel = async () => {
    setCancelling(true);
    setCancelError('');
    try {
      const { data } = await cancelOrder(id);
      setOrder(data.order);
      toast.success('Order cancelled successfully');
    } catch (err) {
      setCancelError(err.response?.data?.message || 'Cancellation failed');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <div className="shimmer h-6 w-1/3 rounded" />
          <div className="shimmer h-4 w-1/2 rounded" />
          <div className="shimmer h-20 rounded-xl" />
          <div className="shimmer h-32 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Order Not Found</h2>
        <Link to="/orders" className="bg-yellow-400 px-6 py-3 rounded-xl font-bold mt-4">Back to Orders</Link>
      </div>
    );
  }

  const canCancel = order.status !== 'Cancelled' && order.status !== 'Delivered' && secondsLeft > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <HiArrowLeft /> My Orders
      </button>

      <div className="space-y-5">
        {/* Order header */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <p className="text-xs text-gray-400 mb-1">Order ID</p>
              <p className="font-mono font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
              <p className="text-xs text-gray-400 mt-1">{formatDate(order.createdAt)}</p>
            </div>
            <span className={`self-start px-4 py-1.5 rounded-full text-sm font-bold ${ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
              {order.status}
            </span>
          </div>

          {/* Timeline */}
          <StatusTimeline currentStatus={order.status} />
        </div>

        {/* Cancel option */}
        {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
          <div className={`rounded-2xl p-4 flex items-center justify-between gap-4 ${secondsLeft > 0 ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <HiOutlineExclamationCircle className={`text-xl shrink-0 ${secondsLeft > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
              <div>
                {secondsLeft > 0 ? (
                  <>
                    <p className="text-sm font-bold text-orange-700">Cancel window open</p>
                    <p className="text-xs text-orange-500">Closes in {secondsLeft}s</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-gray-600">Order is being packed</p>
                    <p className="text-xs text-gray-400">Cannot be cancelled anymore</p>
                  </>
                )}
              </div>
            </div>
            {canCancel && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-70 shrink-0"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        )}

        {cancelError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 flex items-center gap-2">
            <HiOutlineXCircle /> {cancelError}
          </div>
        )}

        {/* Items */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-black text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-3">
            {order.items?.map((item, idx) => {
              const product = item.product || {};
              return (
                <div key={idx} className="flex items-center gap-3">
                  <img
                    src={product.image || PLACEHOLDER_IMAGE}
                    alt={product.name}
                    className="w-14 h-14 rounded-xl object-cover bg-gray-50 border border-gray-100"
                    onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{product.name || 'Product'}</p>
                    <p className="text-xs text-gray-400">{product.category}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 whitespace-nowrap">
                    {formatCurrency((product.price || 0) * item.quantity)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bill */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-black text-gray-900 mb-4">Bill Details</h2>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Items Total</span>
              <span className="font-semibold">{formatCurrency(order.itemsTotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span className={`font-semibold ${order.deliveryFee === 0 ? 'text-green-500' : ''}`}>
                {order.deliveryFee === 0 ? 'FREE' : formatCurrency(order.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Packaging Fee</span>
              <span className="font-semibold">{formatCurrency(order.packagingFee)}</span>
            </div>
            {order.surgeFee > 0 && (
              <div className="flex justify-between text-orange-600">
                <span>Peak Hours Surge</span>
                <span className="font-semibold">{formatCurrency(order.surgeFee)}</span>
              </div>
            )}
            <hr className="border-gray-100" />
            <div className="flex justify-between font-black text-gray-900 text-base">
              <span>Total Paid</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
