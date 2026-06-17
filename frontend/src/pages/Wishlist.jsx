import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineHeart } from 'react-icons/hi';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/formatCurrency';
import { PLACEHOLDER_IMAGE } from '../constants';

const Wishlist = () => {
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const toast = useToast();

  const handleMoveToCart = async (product) => {
    try {
      await addToCart(product._id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleRemove = async (productId, name) => {
    try {
      await removeFromWishlist(productId);
      toast.info(`${name} removed from wishlist`);
    } catch {
      toast.error('Failed to remove');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 shadow-sm">
              <div className="shimmer h-40 rounded-xl mb-3" />
              <div className="shimmer h-4 rounded w-3/4 mb-2" />
              <div className="shimmer h-3 rounded w-1/2 mb-3" />
              <div className="shimmer h-8 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <HiOutlineHeart className="text-8xl text-gray-200 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save products you love for later</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3.5 rounded-2xl transition-colors"
          >
            Browse Products
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-black text-gray-900 mb-6">
        Wishlist <span className="text-gray-400 font-normal text-base">({wishlistItems.length} items)</span>
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {wishlistItems.map((item) => {
          const product = item.product || {};
          const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
          const outOfStock = product.stock === 0;

          return (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-3 shadow-sm flex flex-col"
            >
              <Link to={`/products/${product._id}`} className="block">
                <div className="rounded-xl overflow-hidden bg-gray-50 h-36 mb-3">
                  <img
                    src={product.image || PLACEHOLDER_IMAGE}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                    onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                  />
                </div>
                <p className="text-xs text-gray-400 mb-0.5">{product.category}</p>
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
              </Link>

              <div className="mt-auto">
                <p className="text-base font-bold text-gray-900 mb-3">{formatCurrency(effectivePrice)}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    disabled={outOfStock}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors
                      ${outOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 text-black'}`}
                  >
                    {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => handleRemove(product._id, product.name)}
                    className="p-2 border border-gray-200 rounded-xl text-red-400 hover:bg-red-50 hover:border-red-200 transition-colors"
                  >
                    <HiOutlineHeart className="text-sm" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
