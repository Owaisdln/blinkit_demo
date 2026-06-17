import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  HiOutlineShoppingCart,
  HiOutlineHeart,
  HiOutlineUser,
  HiOutlineSearch,
  HiOutlineLocationMarker,
  HiOutlineChevronDown,
  HiOutlineLogout,
  HiOutlineClipboardList,
  HiMenu,
  HiX,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <span className="text-lg font-black text-black">b</span>
            </div>
            <span className="text-xl font-black text-gray-900 hidden sm:block">blinkit</span>
          </Link>

          {/* Location */}
          <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer shrink-0">
            <HiOutlineLocationMarker className="text-yellow-500 text-lg" />
            <div>
              <p className="text-xs text-gray-500 leading-none">Delivery in</p>
              <p className="text-sm font-bold text-gray-900 flex items-center gap-0.5">
                10 minutes <HiOutlineChevronDown className="text-xs" />
              </p>
            </div>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2.5 gap-2">
              <HiOutlineSearch className="text-gray-400 text-lg shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search "eggs"'
                className="bg-transparent flex-1 text-sm outline-none text-gray-800 placeholder-gray-400"
              />
            </div>
          </form>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <HiOutlineHeart className="text-xl text-gray-700" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded-xl transition-colors"
            >
              <HiOutlineShoppingCart className="text-xl" />
              <span className="text-sm">Cart</span>
              {cartCount > 0 && (
                <span className="bg-black text-yellow-400 text-xs font-black px-1.5 py-0.5 rounded-md min-w-[1.25rem] text-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-black text-black">
                      {user?.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 max-w-[80px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <HiOutlineChevronDown className={`text-sm text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1 z-50">
                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <HiOutlineClipboardList className="text-lg" />
                      My Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <HiOutlineHeart className="text-lg" />
                      Wishlist
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <HiOutlineLogout className="text-lg" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-yellow-400 font-semibold text-sm hover:bg-yellow-50 transition-colors"
              >
                <HiOutlineUser className="text-lg" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2 ml-auto">
            <Link to="/cart" className="relative p-2">
              <HiOutlineShoppingCart className="text-2xl text-gray-800" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-yellow-400 text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMobileMenuOpen((v) => !v)} className="p-2 text-gray-800">
              {mobileMenuOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 pt-2">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2.5 gap-2">
              <HiOutlineSearch className="text-gray-400 text-lg" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search "eggs"'
                className="bg-transparent flex-1 text-sm outline-none"
              />
            </div>
          </form>
          <div className="flex flex-col gap-1">
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 text-sm font-semibold text-gray-500">
                  Hi, {user?.name?.split(' ')[0]} 👋
                </div>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl">
                  <HiOutlineClipboardList /> My Orders
                </Link>
                <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl">
                  <HiOutlineHeart /> Wishlist
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl w-full">
                  <HiOutlineLogout /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 py-3 bg-yellow-400 rounded-xl font-bold text-sm">
                  <HiOutlineUser /> Login
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 py-3 border-2 border-yellow-400 rounded-xl font-bold text-sm">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
