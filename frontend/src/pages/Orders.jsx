import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineClipboardList, HiArrowRight } from 'react-icons/hi';
import { getMyOrders } from '../services/orderService';
import { ORDER_STATUS_COLORS } from '../constants';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDateShort } from '../utils/formatDate';
import { PLACEHOLDER_IMAGE } from '../constants';
import { SkeletonOrder } from '../components/common/Skeletons';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(({ data }) => setOrders(data.orders || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {Array(3).fill(0).map((_, i) => <SkeletonOrder key={i} />)}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <HiOutlineClipboardList className="text-8xl text-gray-200 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-gray-900 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-6">When you place an order, it will appear here.</p>
        <Link to="/products" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3.5 rounded-2xl transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-black text-gray-900 mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order, i) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={`/orders/${order._id}`}
              className="block bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Order #{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-gray-400">{formatDateShort(order.createdAt)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                  {order.status}
                </span>
              </div>

              {/* Product thumbnails */}
              <div className="flex gap-2 mb-3 overflow-hidden">
                {order.items?.slice(0, 4).map((item, idx) => (
                  <img
                    key={idx}
                    src={item.product?.image || PLACEHOLDER_IMAGE}
                    alt={item.product?.name}
                    loading="lazy"
                    className="w-12 h-12 rounded-xl object-cover bg-gray-50 border border-gray-100"
                    onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                  />
                ))}
                {order.items?.length > 4 && (
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                    +{order.items.length - 4}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
                  <p className="text-base font-black text-gray-900">{formatCurrency(order.totalAmount)}</p>
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold text-yellow-600">
                  View Details <HiArrowRight />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
