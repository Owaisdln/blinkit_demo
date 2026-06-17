import { useState, useEffect } from 'react';
import {
  HiOutlineUsers,
  HiOutlineCube,
  HiOutlineClipboardList,
  HiOutlineCurrencyRupee,
  HiOutlineRefresh,
  HiOutlineLogout,
  HiOutlinePlus,
} from 'react-icons/hi';
import { getDashboard, updateOrderStatus } from '../services/adminService';
import { createProduct } from '../services/productService';
import { ORDER_STATUS_COLORS, ORDER_STATUSES } from '../constants';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { PLACEHOLDER_IMAGE } from '../constants';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className={`${color} rounded-2xl p-5`}>
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm font-semibold text-white/80">{label}</p>
      <Icon className="text-white/70 text-2xl" />
    </div>
    <p className="text-3xl font-black text-white">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [showProductModal, setShowProductModal] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discountPrice: '0',
    stock: '',
    image: '',
  });

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.description || !productForm.category || !productForm.price || !productForm.stock) {
      toast.error('Please fill all required fields');
      return;
    }
    setAddingProduct(true);
    try {
      await createProduct({
        ...productForm,
        price: Number(productForm.price),
        discountPrice: Number(productForm.discountPrice || 0),
        stock: Number(productForm.stock),
      });
      toast.success('Product added successfully!');
      setShowProductModal(false);
      setProductForm({
        name: '',
        description: '',
        category: '',
        price: '',
        discountPrice: '0',
        stock: '',
        image: '',
      });
      await fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product');
    } finally {
      setAddingProduct(false);
    }
  };

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const { data: res } = await getDashboard();
      setData(res);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []); // eslint-disable-line

  const handleStatusUpdate = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, status);
      toast.success(`Order status updated to ${status}`);
      await fetchDashboard();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-lg font-black text-black">b</span>
          </div>
          <div>
            <p className="font-black text-white text-lg">Admin Panel</p>
            <p className="text-xs text-gray-400">Management Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowProductModal(true)}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            <HiOutlinePlus /> Add Product
          </button>
          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
          >
            <HiOutlineRefresh className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <Link to="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <HiOutlineLogout /> Exit
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Array(4).fill(0).map((_, i) => <div key={i} className="shimmer rounded-2xl h-28" />)}
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={HiOutlineUsers} label="Total Users" value={data?.totalUsers ?? 0} color="bg-blue-600" />
              <StatCard icon={HiOutlineCube} label="Products" value={data?.totalProducts ?? 0} color="bg-purple-600" />
              <StatCard icon={HiOutlineClipboardList} label="Total Orders" value={data?.totalOrders ?? 0} color="bg-orange-500" />
              <StatCard icon={HiOutlineCurrencyRupee} label="Revenue" value={formatCurrency(data?.totalRevenue ?? 0)} color="bg-green-600" />
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-black text-gray-900">Recent Orders</h2>
                <p className="text-xs text-gray-400 mt-0.5">Last 5 orders across all users</p>
              </div>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Order ID', 'Customer', 'Date', 'Amount', 'Items', 'Status'].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data?.recentOrders?.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-mono text-sm font-semibold text-gray-800">#{order._id.slice(-6).toUpperCase()}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-gray-800">{order.user?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-400">{order.user?.email}</p>
                        </td>
                        <td className="px-5 py-4 text-xs text-gray-500">{formatDate(order.createdAt)}</td>
                        <td className="px-5 py-4 text-sm font-bold text-gray-900">{formatCurrency(order.totalAmount)}</td>
                        <td className="px-5 py-4 text-sm text-gray-600">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</td>
                        <td className="px-5 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            disabled={updatingId === order._id}
                            className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 outline-none cursor-pointer transition-all ${ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}
                          >
                            {ORDER_STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {data?.recentOrders?.map((order) => (
                  <div key={order._id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-mono text-sm font-bold">#{order._id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-gray-500">{order.user?.name}</p>
                      </div>
                      <p className="font-black text-gray-900">{formatCurrency(order.totalAmount)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                        className={`text-xs font-bold px-2 py-1 rounded-full border-0 outline-none ${ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {(!data?.recentOrders || data.recentOrders.length === 0) && (
                <div className="text-center py-12 text-gray-400">
                  <HiOutlineClipboardList className="text-4xl mx-auto mb-2" />
                  <p className="text-sm">No orders yet</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Product Creation Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <h2 className="text-xl font-black text-gray-900 mb-4">Add New Product</h2>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Bananas"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-yellow-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Describe the product..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-yellow-400 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fruits"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-yellow-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 50"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-yellow-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Regular Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 80"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-yellow-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 60 (0 if none)"
                    value={productForm.discountPrice}
                    onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-yellow-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg (optional)"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-yellow-400 transition-colors"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingProduct}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
                >
                  {addingProduct ? 'Adding Product...' : 'Add Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
