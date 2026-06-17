import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as loginApi, register as registerApi, getProfile } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('blinkit_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('blinkit_token') || null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  // On mount, re-validate token with /profile
  useEffect(() => {
    const validate = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await getProfile();
        setUser(data.user);
        localStorage.setItem('blinkit_user', JSON.stringify(data.user));
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    validate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for global 401 dispatch from api interceptor
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await loginApi({ email, password });
    localStorage.setItem('blinkit_token', data.token);
    localStorage.setItem('blinkit_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await registerApi({ name, email, password });
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('blinkit_token');
    localStorage.removeItem('blinkit_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
