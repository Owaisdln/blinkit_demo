import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getWishlist, addToWishlist as addApi, removeFromWishlist as removeApi } from '../services/wishlistService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const wishlistIds = new Set(wishlistItems.map((w) => w.product?._id));

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await getWishlist();
      setWishlistItems(data.wishlist || []);
    } catch {
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = useCallback(async (productId) => {
    const { data } = await addApi(productId);
    await fetchWishlist();
    return data;
  }, [fetchWishlist]);

  const removeFromWishlist = useCallback(async (productId) => {
    await removeApi(productId);
    await fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = useCallback((productId) => wishlistIds.has(productId), [wishlistIds]);

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      wishlistCount: wishlistItems.length,
      loading,
      fetchWishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
