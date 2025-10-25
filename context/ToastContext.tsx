
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import Toast from '../components/Toast';

type ToastType = 'success' | 'error' | 'warning';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// This is a bit of a hack to get the container to re-render, as the provider value doesn't change
// A more robust solution might involve a different state management pattern or library.
const ToastContainerContext = createContext<{toasts: ToastMessage[]}>({toasts: []});

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      <ToastContainerContext.Provider value={{toasts}}>
        {children}
      </ToastContainerContext.Provider>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastContainer: React.FC = () => {
    const { toasts } = useContext(ToastContainerContext);
    return (
        <div className="fixed top-5 right-5 z-[100] space-y-2">
            {toasts.map((toast) => (
                <Toast key={toast.id} message={toast.message} type={toast.type} />
            ))}
        </div>
    );
};
