import { HiStar } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDiscount } from '../../utils/formatCurrency';
import { PLACEHOLDER_IMAGE } from '../../constants';
import { HiOutlineHeart, HiHeart, HiOutlinePlusSm } from 'react-icons/hi';

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart, cartItems } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const toast = useToast();

  if (!product) return null;

  const {
    _id,
    name,
    image,
    price,
    discountPrice,
    rating,
    stock,
    category,
  } = product;

  const discount = formatDiscount(price, discountPrice);
  const effectivePrice = discountPrice > 0 ? discountPrice : price;
  const cartItem = cartItems.find((c) => c.product?._id === _id);
  const inWishlist = isInWishlist(_id);
  const outOfStock = stock === 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    if (outOfStock) return;
    try {
      await addToCart(_id, 1);
      toast.success(`${name} added to cart!`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to use wishlist');
      return;
    }
    try {
      if (inWishlist) {
        await removeFromWishlist(_id);
        toast.info('Removed from wishlist');
      } else {
        await addToWishlist(_id);
        toast.success('Added to wishlist!');
      }
    } catch {
      toast.error('Already in wishlist');
    }
  };

  return (
    <Link to={`/products/${_id}`} className="group block">
      <div className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden h-full flex flex-col">
        {/* Discount badge */}
        {discount && !outOfStock && (
          <span className="absolute top-2 left-2 z-10 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
            {discount}% OFF
          </span>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full shadow-sm hover:scale-110 transition-transform"
        >
          {inWishlist ? (
            <HiHeart className="text-red-500 text-base" />
          ) : (
            <HiOutlineHeart className="text-gray-400 text-base" />
          )}
        </button>

        {/* Image */}
        <div className="relative rounded-xl overflow-hidden bg-gray-50 mb-3 h-40">
          <img
            src={image || PLACEHOLDER_IMAGE}
            alt={name}
            loading="lazy"
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${outOfStock ? 'opacity-50' : ''}`}
            onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
          />
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col">
          <p className="text-xs text-gray-400 mb-0.5 uppercase tracking-wide">{category}</p>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 leading-snug">{name}</h3>

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <HiStar className="text-yellow-400 text-xs" />
              <span className="text-xs text-gray-500">{rating.toFixed(1)}</span>
            </div>
          )}

          {/* Price + CTA */}
          <div className="flex items-center justify-between mt-auto">
            <div>
              <p className="text-base font-bold text-gray-900">{formatCurrency(effectivePrice)}</p>
              {discount && (
                <p className="text-xs text-gray-400 line-through">{formatCurrency(price)}</p>
              )}
            </div>

            {!outOfStock ? (
              <button
                onClick={handleAddToCart}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-bold transition-colors
                  ${cartItem
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-yellow-400 text-black hover:bg-yellow-500'
                  }`}
              >
                <HiOutlinePlusSm className="text-base" />
                {cartItem ? 'Added' : 'Add'}
              </button>
            ) : (
              <button disabled className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-100 text-gray-400 cursor-not-allowed">
                Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
