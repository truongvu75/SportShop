import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import chatboxApi from '../../api/chatboxApi';
import customerApi from '../../api/customerApi';
import { useAuth } from '../../context/AuthContext';

const getFormattedTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const DEFAULT_MESSAGES = [
  { 
    sender: 'bot', 
    text: 'Xin chào! Tôi là trợ lý ảo của SportStore. Tôi có thể giúp gì cho bạn hôm nay? Bạn có thể yêu cầu tôi tìm kiếm sản phẩm hoặc xem danh sách bán chạy.',
    timestamp: getFormattedTime()
  }
];

const isGreeting = (text) => {
  const normalized = text.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"");
  const greetings = [
    'chào', 'xin chào', 'hello', 'hi', 'alo', 'helo', 'chao', 'xin chao', 
    'chào bạn', 'chào ad', 'chào shop', 'chào bot', 'chào robot', 'hey'
  ];
  return greetings.includes(normalized);
};

export default function ChatBox({ isOpen, onClose }) {
  const { isAuthenticated } = useAuth();
  const [customerId, setCustomerId] = useState(null);
  const prevAuthRef = useRef(isAuthenticated);

  // Lịch sử tin nhắn (lưu trong sessionStorage)
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('sportstore_chat_messages');
    try {
      return saved ? JSON.parse(saved) : DEFAULT_MESSAGES;
    } catch (e) {
      return DEFAULT_MESSAGES;
    }
  });

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Reset cuộc trò chuyện khi có sự thay đổi trạng thái đăng nhập (đăng nhập hoặc đăng xuất)
  useEffect(() => {
    if (prevAuthRef.current !== isAuthenticated) {
      setMessages(DEFAULT_MESSAGES);
      sessionStorage.removeItem('sportstore_chat_messages');
      prevAuthRef.current = isAuthenticated;
    }
  }, [isAuthenticated]);

  // Lấy customerId khi đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      customerApi.getProfile()
        .then(profile => {
          if (profile && profile.customerID) {
            setCustomerId(profile.customerID);
          }
        })
        .catch(err => {
          console.error("Lỗi khi lấy profile cho Chatbox:", err);
        });
    } else {
      setCustomerId(null);
    }
  }, [isAuthenticated]);

  // Lưu lịch sử tin nhắn vào sessionStorage
  useEffect(() => {
    sessionStorage.setItem('sportstore_chat_messages', JSON.stringify(messages));
  }, [messages]);

  // Tự động cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, sending, isOpen]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessageText = input.trim();
    setInput('');
    const time = getFormattedTime();
    
    // Thêm tin nhắn của User kèm timestamp
    const updatedMessages = [...messages, { sender: 'user', text: userMessageText, timestamp: time }];
    setMessages(updatedMessages);
    setSending(true);

    // Xử lý chào hỏi ở client-side
    if (isGreeting(userMessageText)) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: 'Xin chào! Rất vui được hỗ trợ bạn. Tôi là trợ lý ảo của SportStore, tôi có thể giúp bạn tìm kiếm sản phẩm (ví dụ: "tìm giày chạy bộ") hoặc xem các sản phẩm bán chạy nhất hiện nay (ví dụ: "sản phẩm bán chạy nhất").',
            timestamp: getFormattedTime()
          }
        ]);
        setSending(false);
      }, 600);
      return;
    }

    try {
      const response = await chatboxApi.sendMessage(userMessageText, customerId);
      if (response) {
        setMessages(prev => [
          ...prev, 
          { 
            sender: 'bot', 
            text: response.message || 'Tôi đã xử lý yêu cầu của bạn.',
            products: response.products || [],
            timestamp: getFormattedTime()
          }
        ]);
      }
    } catch (err) {
      console.error("Lỗi khi gửi tin nhắn chatbox:", err);
      setMessages(prev => [
        ...prev,
        { 
          sender: 'bot', 
          text: 'Xin lỗi, hệ thống tư vấn đang bận hoặc gặp sự cố kết nối. Vui lòng thử lại sau!',
          timestamp: getFormattedTime()
        }
      ]);
    } finally {
      setSending(false);
    }
  };

  // Định dạng tiền tệ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  if (!isOpen) return null;

  return (
    <div className="w-[330px] md:w-[370px] h-[460px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-outline-variant mb-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-4 py-3 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">smart_toy</span>
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-gray-900 animate-pulse"></span>
          </div>
          <div>
            <h3 className="font-extrabold text-xs uppercase tracking-wider">Trợ lý ảo SportStore</h3>
            <p className="text-[9px] text-green-400 font-bold uppercase tracking-widest mt-0.5">Trực tuyến 24/7</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-white text-base">close</span>
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4 bg-gray-50 flex flex-col">
        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={index} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}>
              <div 
                className={`px-3.5 py-2 rounded-2xl text-xs max-w-[85%] break-words ${
                  isUser 
                    ? 'bg-primary-container text-white rounded-tr-none shadow-sm' 
                    : 'bg-white text-on-surface border border-outline-variant/30 rounded-tl-none shadow-sm'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>

              {/* Timestamp */}
              <span className={`text-[9px] text-on-surface-variant/60 mt-1 ${isUser ? 'mr-1' : 'ml-1'} font-bold`}>
                {msg.timestamp || 'N/A'}
              </span>

              {/* Products suggestion carousel */}
              {!isUser && msg.products && msg.products.length > 0 && (
                <div className="w-full mt-2.5 overflow-hidden">
                  <div className="flex gap-2.5 overflow-x-auto pb-2.5 pt-1 scrollbar-thin scroll-smooth select-none max-w-full">
                    {msg.products.map((prod) => (
                      <div 
                        key={prod.productID}
                        className="w-36 flex-shrink-0 bg-white rounded-xl border border-outline-variant/40 shadow-sm overflow-hidden hover:shadow transition-shadow flex flex-col"
                      >
                        {/* Product Photo */}
                        <Link 
                          to={`/product/${prod.productID}`}
                          className="h-20 bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100 p-1.5"
                        >
                          <img 
                            src={prod.photo || 'https://i.postimg.cc/X7X8KZXc/demo.png'} 
                            alt={prod.productName}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.src = 'https://i.postimg.cc/X7X8KZXc/demo.png';
                            }}
                          />
                        </Link>
                        
                        {/* Product Details */}
                        <div className="p-2 flex flex-col flex-1">
                          <span className="text-[7.5px] font-black uppercase text-primary tracking-widest truncate block">
                            {prod.brand || 'SPORTSTORE'}
                          </span>
                          <h4 className="text-[10px] font-extrabold text-on-surface line-clamp-1 mb-0.5 uppercase tracking-tight">
                            {prod.productName}
                          </h4>
                          <p className="text-[10px] font-black text-primary-container mt-auto">
                            {formatCurrency(prod.basePrice)}
                          </p>
                          <Link 
                            to={`/product/${prod.productID}`}
                            className="mt-1.5 text-center bg-gray-900 text-white py-1 rounded-lg text-[8px] font-black uppercase tracking-wider hover:bg-gray-700 transition-colors"
                          >
                            Xem ngay
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Bot typing loading state */}
        {sending && (
          <div className="flex items-center gap-1 bg-white border border-outline-variant/30 px-3 py-2 rounded-2xl rounded-tl-none self-start shadow-sm">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-outline-variant/40 flex items-center gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập câu hỏi tư vấn sản phẩm..."
          disabled={sending}
          className="flex-grow bg-gray-50 border border-outline-variant/60 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-container transition-all disabled:opacity-50 text-on-surface"
        />
        <button 
          type="submit"
          disabled={sending || !input.trim()}
          className="w-9 h-9 rounded-xl bg-primary-container text-white flex items-center justify-center hover:bg-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
        >
          <span className="material-symbols-outlined text-base">send</span>
        </button>
      </form>
    </div>
  );
}
