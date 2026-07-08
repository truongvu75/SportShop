import React from 'react';

export default function NotificationDropdown({ 
  notifications, 
  onMarkAllAsRead, 
  onClose,
  onNotificationClick
}) {
  return (
    <div className="absolute right-0 top-12 w-80 md:w-96 bg-white border border-outline-variant shadow-2xl rounded-2xl py-3 z-[110] overflow-hidden text-left font-['Lexend'] animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="px-4 pb-2.5 border-b border-outline-variant/60 flex items-center justify-between">
        <h3 className="text-xs font-black uppercase text-on-surface tracking-wider">Thông báo</h3>
        
        {/* Nút Đánh dấu đọc tất cả (mock / chuẩn bị cho API sau này) */}
        <button 
          onClick={() => {
            onMarkAllAsRead();
            // TODO: Sau này bạn có thể gọi API PUT `/api/notifications/read-all` tại đây
          }}
          className="text-[10px] font-bold text-primary hover:text-blue-700 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-xs">done_all</span>
          Đọc tất cả
        </button>
      </div>

      {/* Body List */}
      <div className="max-h-[320px] overflow-y-auto divide-y divide-outline-variant/40">
        {notifications.length === 0 ? (
          <div className="py-10 px-4 text-center flex flex-col items-center justify-center text-on-surface-variant/50">
            <span className="material-symbols-outlined text-4xl mb-2 text-outline-variant">notifications_off</span>
            <p className="text-xs font-bold">Không có thông báo nào mới</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id}
              onClick={() => onNotificationClick(notif.id)}
              className={`p-3.5 flex gap-3 transition-colors cursor-pointer relative ${
                notif.isRead ? 'bg-white hover:bg-gray-50' : 'bg-primary/5 hover:bg-primary/10'
              }`}
            >
              {/* Dot xanh biểu thị chưa đọc */}
              {!notif.isRead && (
                <span className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full"></span>
              )}

              {/* Icon loại thông báo */}
              <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">
                  {notif.type === 'CART_REMINDER' ? 'shopping_cart' : 'info'}
                </span>
              </div>

              {/* Chi tiết nội dung */}
              <div className="flex-grow min-w-0">
                <h4 className={`text-xs font-bold text-on-surface truncate ${!notif.isRead ? 'font-black' : 'font-semibold'}`}>
                  {notif.title}
                </h4>
                <p className="text-[10.5px] text-on-surface-variant/90 mt-0.5 leading-relaxed break-words">
                  {notif.content}
                </p>
                <span className="text-[9px] font-semibold text-on-surface-variant/60 block mt-1.5">
                  {notif.createdAt}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pt-2.5 border-t border-outline-variant/60 text-center">
        <button 
          onClick={onClose}
          className="text-[10px] font-black uppercase text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer tracking-wider"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
