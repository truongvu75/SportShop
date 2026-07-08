import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ChatBox from '../../pages/ChatBox/ChatBox';

export default function MainLayout() {
  // Trạng thái đóng/mở chatbox (lưu trong sessionStorage)
  const [isOpen, setIsOpen] = useState(() => {
    return sessionStorage.getItem('sportstore_chat_open') === 'true';
  });

  // Lưu trạng thái mở/đóng vào sessionStorage
  useEffect(() => {
    sessionStorage.setItem('sportstore_chat_open', isOpen);
  }, [isOpen]);

  return (
    <div className="min-h-screen flex flex-col w-full bg-surface">
      <Header />

      <main className="flex-grow w-full">
        {/* Outlet sẽ là nơi hiển thị nội dung của các Route con (Home, Product...) */}
        <Outlet />
      </main>

      <Footer />

      {/* Chatbox Widget */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
        {/* Chat Window */}
        <ChatBox isOpen={isOpen} onClose={() => setIsOpen(false)} />

        {/* Chat Toggle Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-primary-container text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative cursor-pointer"
        >
          <span className="material-symbols-outlined text-3xl">
            {isOpen ? 'forum' : 'chat'}
          </span>
          {!isOpen && (
            <>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full border-2 border-white animate-pulse"></span>
              <div className="absolute right-20 bg-white text-on-surface px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-outline-variant pointer-events-none">
                <span className="font-bold text-sm">Hỗ trợ trực tuyến (24/7)</span>
              </div>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
