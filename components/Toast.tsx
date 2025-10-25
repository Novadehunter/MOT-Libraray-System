import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

type ToastType = 'success' | 'error' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
}

const toastConfig = {
  success: {
    icon: CheckCircleIcon,
    bgClass: 'bg-green-500',
  },
  error: {
    icon: XCircleIcon,
    bgClass: 'bg-red-500',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    bgClass: 'bg-amber-500',
  },
};

const Toast: React.FC<ToastProps> = ({ message, type }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { icon: Icon, bgClass } = toastConfig[type];
  
  useEffect(() => {
    // Mount animation
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`relative flex items-center w-full max-w-xs p-4 text-white ${bgClass} rounded-lg shadow-lg transition-all duration-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8">
        <Icon className="w-6 h-6" />
      </div>
      <div className="ml-3 text-sm font-medium">{message}</div>
    </div>
  );
};

export default Toast;
