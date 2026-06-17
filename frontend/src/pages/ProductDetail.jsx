import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiStar,
  HiOutlineHeart,
  HiHeart,
  HiOutlineShoppingCart,
  HiArrowLeft,
  HiMinus,
  HiPlus,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';
import { getProduct } from '../services/productService';
import { getProductReviews, addReview } from '../services/reviewService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDiscount } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { PLACEHOLDER_IMAGE } from '../constants';
import ProductCard from '../components/product/ProductCard';

const StarRating = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <button key={s} onClick={() => onChange && onChange(s)} type="button">
        <HiStar className={`text-2xl ${s <= value ? 'text-yellow-400' : 'text-gray-300'} ${onChange ? 'hover:text-yellow-400 cursor-pointer' : ''} transition-colors`} />
      </button>
    ))}
  </div>
);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [substitutes, setSubstitutes] = useState([]);
  const [outOfStock, setOutOfStock] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const cartItem = cartItems.find((c) => c.product?._id === id);
  const inWishlist = isInWishlist(id);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [prodRes, revRes] = await Promise.all([
          getProduct(id),
          getProductReviews(id),
        ]);
        setProduct(prodRes.data.product);
        setOutOfStock(prodRes.data.outOfStock || false);
        setSubstitutes(prodRes.data.substitutes || []);
        setReviews(revRes.data.reviews || []);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error('Please login first'); return; }
    if (outOfStock) return;
    setAddingToCart(true);
    try {
      if (cartItem) {
        await updateQuantity(cartItem._id, id, cartItem.quantity + qty);
      } else {
        await addToCart(id, qty);
      }
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { toast.error('Please login first'); return; }
    try {
      if (inWishlist) {
        await removeFromWishlist(id);
        toast.info('Removed from wishlist');
      } else {
        await addToWishlist(id);
        toast.success('Added to wishlist!');
      }
    } catch {
      toast.error('Already in wishlist');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Login to submit a review'); return; }
    if (!comment.trim()) { toast.error('Please write a comment'); return; }
    setSubmittingReview(true);
    try {
      await addReview(id, { rating, comment });
      toast.success('Review submitted!');
      setComment('');
      setRating(5);
      const { data } = await getProductReviews(id);
      setReviews(data.reviews || []);
    } catch {
      toast.error('You may have already reviewed this product');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="shimmer rounded-2xl h-80" />
          <div className="space-y-4">
            <div className="shimmer h-6 rounded w-3/4" />
            <div className="shimmer h-4 rounded w-1/2" />
            <div className="shimmer h-8 rounded w-1/3" />
            <div className="shimmer h-12 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-6xl mb-4">😕</p>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">This product doesn't exist or has been removed.</p>
        <Link to="/products" className="bg-yellow-400 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  const discount = formatDiscount(product.price, product.discountPrice);
  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <HiArrowLeft /> Back
      </button>

      {/* Out of stock banner */}
      {outOfStock && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3"
        >
          <HiOutlineExclamationCircle className="text-red-500 text-2xl shrink-0" />
          <div>
            <p className="font-bold text-red-700">Currently Out of Stock</p>
            <p className="text-sm text-red-500">Check out similar products below</p>
          </div>
        </motion.div>
      )}

      {/* Main product section */}
      <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-sm p-6 mb-8">
        {/* Image */}
        <div className="relative">
          <div className="rounded-2xl overflow-hidden bg-gray-50 aspect-square">
            <img
              src={product.image || PLACEHOLDER_IMAGE}
              alt={product.name}
              className={`w-full h-full object-cover ${outOfStock ? 'opacity-60 grayscale' : ''}`}
              onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
            />
          </div>
          {discount && !outOfStock && (
            <span className="absolute top-3 left-3 bg-green-500 text-white font-bold text-sm px-2.5 py-1 rounded-lg">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{product.category}</p>
          <h1 className="text-2xl font-black text-gray-900 mb-3">{product.name}</h1>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <StarRating value={Math.round(product.rating)} />
              <span className="text-sm text-gray-500">({product.rating.toFixed(1)})</span>
            </div>
          )}

          <p className="text-gray-600 text-sm leading-relaxed mb-4">{product.description}</p>

          {/* Price */}
          <div className="mb-5">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-gray-900">{formatCurrency(effectivePrice)}</span>
              {discount && (
                <span className="text-lg text-gray-400 line-through">{formatCurrency(product.price)}</span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Stock: {outOfStock ? <span className="text-red-500 font-semibold">Out of Stock</span> : <span className="text-green-600 font-semibold">{product.stock} units available</span>}
            </p>
          </div>

          {!outOfStock && (
            <>
              {/* Quantity selector */}
              <div className="flex items-center gap-3 mb-4">
                <p className="text-sm font-semibold text-gray-700">Qty:</p>
                <div className="flex items-center border-2 border-yellow-400 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 hover:bg-yellow-50 transition-colors"
                  >
                    <HiMinus />
                  </button>
                  <span className="px-4 py-2 font-bold text-gray-900 min-w-[2.5rem] text-center">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-2 hover:bg-yellow-50 transition-colors"
                  >
                    <HiPlus />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl transition-colors disabled:opacity-70"
                >
                  <HiOutlineShoppingCart className="text-xl" />
                  {addingToCart ? 'Adding...' : cartItem ? 'Update Cart' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleWishlist}
                  className="p-3 border-2 border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-colors"
                >
                  {inWishlist
                    ? <HiHeart className="text-xl text-red-500" />
                    : <HiOutlineHeart className="text-xl text-gray-400" />
                  }
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Substitute suggestions */}
      {outOfStock && substitutes.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-black text-gray-900 mb-4">Similar Products You Might Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
            {substitutes.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* Reviews section */}
      <section className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-black text-gray-900 mb-5">
          Customer Reviews {reviews.length > 0 && <span className="text-gray-400 font-normal text-base">({reviews.length})</span>}
        </h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500 text-sm mb-6">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="space-y-4 mb-6">
            {reviews.map((r) => (
              <div key={r._id} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-black">
                      {r.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{r.user?.name}</span>
                  </div>
                  <StarRating value={r.rating} />
                </div>
                <p className="text-sm text-gray-600 ml-9">{r.comment}</p>
                <p className="text-xs text-gray-400 ml-9 mt-1">{formatDate(r.createdAt)}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add review form */}
        {isAuthenticated && (
          <form onSubmit={handleReviewSubmit} className="border-t border-gray-100 pt-5">
            <h3 className="font-bold text-gray-900 mb-3">Write a Review</h3>
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">Your Rating</p>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400 transition-colors resize-none mb-3"
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-70"
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
        {!isAuthenticated && (
          <p className="text-sm text-gray-500 border-t border-gray-100 pt-4">
            <Link to="/login" className="text-yellow-600 font-semibold hover:underline">Login</Link> to write a review.
          </p>
        )}
      </section>
    </div>
  );
};

export default ProductDetail;
