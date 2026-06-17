import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timerRef = useRef({});

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timerRef.current[id]);
  }, []);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev.slice(-3), { id, message, type }]);
    timerRef.current[id] = setTimeout(() => removeToast(id), duration);
    return id;
  }, [removeToast]);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => removeToast(t.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg cursor-pointer text-sm font-medium transition-all
              ${t.type === 'success' ? 'bg-green-500 text-white' : ''}
              ${t.type === 'error' ? 'bg-red-500 text-white' : ''}
              ${t.type === 'info' ? 'bg-gray-800 text-white' : ''}
            `}
          >
            <span>
              {t.type === 'success' && '✓'}
              {t.type === 'error' && '✕'}
              {t.type === 'info' && 'ℹ'}
            </span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
