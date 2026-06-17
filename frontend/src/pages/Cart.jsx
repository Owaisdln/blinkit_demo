import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineTrash, HiMinus, HiPlus, HiOutlineShoppingBag } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/formatCurrency';
import { PLACEHOLDER_IMAGE } from '../constants';

const Cart = () => {
  const { cartItems, cartTotal, loading, updateQuantity, removeFromCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const handleQuantityChange = async (item, delta) => {
    const newQty = item.quantity + delta;
    try {
      await updateQuantity(item._id, item.product._id, newQty);
      if (newQty <= 0) toast.info('Item removed from cart');
    } catch {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async (item) => {
    try {
      await removeFromCart(item._id);
      toast.info('Item removed from cart');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 flex gap-4">
            <div className="shimmer w-20 h-20 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="shimmer h-4 rounded w-2/3" />
              <div className="shimmer h-3 rounded w-1/3" />
              <div className="shimmer h-8 rounded-xl w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <p className="text-8xl mb-4">🛒</p>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything yet</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3.5 rounded-2xl transition-colors">
            <HiOutlineShoppingBag className="text-xl" />
            Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  const deliveryFee = cartTotal >= 99 ? 0 : 20;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-black text-gray-900 mb-6">
        My Cart <span className="text-gray-400 font-normal text-base">({cartItems.length} items)</span>
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="md:col-span-2 space-y-3">
          {cartItems.map((item) => {
            const product = item.product || {};
            const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
            return (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm"
              >
                {/* Image */}
                <Link to={`/products/${product._id}`} className="shrink-0">
                  <img
                    src={product.image || PLACEHOLDER_IMAGE}
                    alt={product.name}
                    loading="lazy"
                    className="w-20 h-20 rounded-xl object-cover bg-gray-50"
                    onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${product._id}`}>
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-yellow-600 transition-colors">{product.name}</h3>
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5">{product.category}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-base font-bold text-gray-900">{formatCurrency(effectivePrice * item.quantity)}</span>
                    <div className="flex items-center gap-2">
                      {/* Quantity */}
                      <div className="flex items-center border-2 border-yellow-400 rounded-xl overflow-hidden">
                        <button
                          onClick={() => handleQuantityChange(item, -1)}
                          className="px-2.5 py-1.5 hover:bg-yellow-50 transition-colors"
                        >
                          <HiMinus className="text-sm" />
                        </button>
                        <span className="px-3 font-bold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item, +1)}
                          className="px-2.5 py-1.5 hover:bg-yellow-50 transition-colors"
                        >
                          <HiPlus className="text-sm" />
                        </button>
                      </div>
                      {/* Remove */}
                      <button
                        onClick={() => handleRemove(item)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Order summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-20">
            <h2 className="font-black text-gray-900 mb-4">Bill Details</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items Total</span>
                <span className="font-semibold">{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-500' : ''}`}>
                  {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                </span>
              </div>
              {deliveryFee === 0 && (
                <p className="text-xs text-green-600 bg-green-50 rounded-lg px-2 py-1">
                  🎉 Free delivery on orders above ₹99
                </p>
              )}
              <hr className="border-gray-100" />
              <div className="flex justify-between font-black text-gray-900 text-base">
                <span>Estimated Total</span>
                <span>{formatCurrency(cartTotal + deliveryFee)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 mb-4">
              * Final amount calculated after checkout
            </p>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-3.5 rounded-xl transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
