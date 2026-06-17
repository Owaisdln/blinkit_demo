import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart, addToCart as addToCartApi, removeCartItem } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + ((item.product?.discountPrice || item.product?.price || 0) * item.quantity),
    0
  );

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await getCart();
      setCartItems(data.cart || []);
    } catch {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    const { data } = await addToCartApi(productId, quantity);
    await fetchCart();
    return data;
  }, [fetchCart]);

  // Quantity update: delete existing item, re-add with new quantity
  const updateQuantity = useCallback(async (cartItemId, productId, newQty) => {
    if (newQty <= 0) {
      await removeCartItem(cartItemId);
    } else {
      await removeCartItem(cartItemId);
      await addToCartApi(productId, newQty);
    }
    await fetchCart();
  }, [fetchCart]);

  const removeFromCart = useCallback(async (cartItemId) => {
    await removeCartItem(cartItemId);
    await fetchCart();
  }, [fetchCart]);

  const clearCart = useCallback(async () => {
    try {
      await Promise.all(cartItems.map((item) => removeCartItem(item._id)));
    } catch (err) {
      console.error('Failed to clear cart in backend:', err);
    } finally {
      setCartItems([]);
    }
  }, [cartItems]);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartTotal,
      loading,
      fetchCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
