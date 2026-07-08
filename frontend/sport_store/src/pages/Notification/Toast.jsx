import React, { useEffect } from 'react';

export default function Toast({ show, title, content, type, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Tự động ẩn sau 5 giây
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-24 right-6 z-[200] w-80 bg-white rounded-2xl border border-outline-variant/60 shadow-2xl overflow-hidden transform transition-all duration-300 translate-y-0 opacity-100 flex animate-in slide-in-from-right-5">
      {/* Cạnh bên trái tô điểm màu primary */}
      <div className="w-1.5 bg-primary-container flex-shrink-0"></div>
      
      <div className="p-4 flex gap-3 items-start flex-grow">
        {/* Icon */}
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
          <span className="material-symbols-outlined text-[20px]">
            {type === 'CART_REMINDER' ? 'shopping_cart_checkout' : 'notifications'}
          </span>
        </div>
        
        {/* Content */}
        <div className="flex-grow min-w-0">
          <h4 className="text-xs font-black text-on-surface uppercase tracking-tight truncate">
            {title}
          </h4>
          <p className="text-[11px] text-on-surface-variant font-medium mt-1 leading-relaxed">
            {content}
          </p>
        </div>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="text-on-surface-variant/40 hover:text-on-surface hover:bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer flex-shrink-0 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  );
}
