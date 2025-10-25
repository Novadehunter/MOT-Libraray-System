import React, { useState, useEffect } from 'react';

interface ConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  confirmButtonClass?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  confirmButtonClass = 'bg-red-600 hover:bg-red-700',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleCancel = () => {
    setIsVisible(false);
    setTimeout(onCancel, 300); // Animation duration
  };

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(onConfirm, 300); // Animation duration
  };

  return (
    <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded-2xl shadow-xl p-8 w-full max-w-md m-4 transition-all duration-300 transform ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <h2 className="text-2xl font-bold mb-4 text-slate-800">{title}</h2>
        <p className="text-slate-600 mb-8">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={handleCancel} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold">Cancel</button>
          <button onClick={handleConfirm} className={`px-4 py-2 text-white rounded-lg font-semibold shadow-md ${confirmButtonClass}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
