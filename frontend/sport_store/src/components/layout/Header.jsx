import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Bổ sung useNavigate
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import NotificationDropdown from '../../pages/Notification/NotificationDropdown';
import Toast from '../../pages/Notification/Toast';

// Helper component viết bằng JS thuần
function MenuLink({ icon, label, to = "#" }) {
  return (
    <Link
      className="flex items-center gap-3 px-5 py-3 hover:bg-surface-container transition-colors font-bold text-sm text-on-surface"
      to={to}
    >
      <span className="material-symbols-outlined text-[22px] text-on-surface-variant">
        {icon}
      </span>
      {label}
    </Link>
  );
}

export default function Header() {
  const { cartCount } = useCart();
  const { isAuthenticated, username, logout } = useAuth();
  // 1. Khai báo state quản lý từ khóa tìm kiếm và hook điều hướng
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  // State cho thông báo (Notifications)
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState({ title: '', content: '', type: '' });

  // 1. Đồng bộ danh sách thông báo từ localStorage
  useEffect(() => {
    if (isAuthenticated && username) {
      const saved = localStorage.getItem(`sportstore_notifications_${username}`);
      if (saved) {
        try {
          setNotifications(JSON.parse(saved));
        } catch (e) {
          setNotifications([]);
        }
      } else {
        setNotifications([]);
      }
    } else {
      setNotifications([]);
      setShowDropdown(false);
    }
  }, [isAuthenticated, username]);

  // 2. Logic Kích hoạt/Tự động sinh thông báo nhắc nhở mua hàng
  useEffect(() => {
    // Chỉ kích hoạt khi đã đăng nhập và giỏ hàng có hàng
    if (isAuthenticated && username && cartCount > 0) {
      const sessionKey = `sportstore_reminder_shown_${username}`;
      const isReminderShownThisSession = sessionStorage.getItem(sessionKey);

      // Nếu trong phiên làm việc hiện tại chưa hiển thị thông báo nhắc nhở
      if (!isReminderShownThisSession) {
        const storageKey = `sportstore_notifications_${username}`;
        const saved = localStorage.getItem(storageKey);
        let currentNotifications = [];
        try {
          currentNotifications = saved ? JSON.parse(saved) : [];
        } catch (e) {
          currentNotifications = [];
        }

        const now = new Date();
        const formattedDate = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

        const newNotif = {
          id: `cart_reminder_${Date.now()}`,
          type: 'CART_REMINDER',
          title: 'Giỏ hàng đang chờ bạn',
          content: 'Bạn đang có hàng trong giỏ? Hãy đặt hàng ngay nào!!!',
          isRead: false,
          createdAt: formattedDate
        };

        const updated = [newNotif, ...currentNotifications];
        setNotifications(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));

        // Đánh dấu là đã hiển thị thông báo trong phiên này (tránh spam khi chuyển trang/reload)
        sessionStorage.setItem(sessionKey, 'true');

        // Kích hoạt Toast Popup hiển thị góc phải
        setToastData({
          title: newNotif.title,
          content: 'Bạn đang có sản phẩm trong giỏ hàng. Đừng bỏ lỡ nhé!',
          type: 'CART_REMINDER'
        });
        setShowToast(true);
      }
    }
  }, [isAuthenticated, username, cartCount]);

  // 3. Xử lý mở/tắt dropdown thông báo và đánh dấu đã đọc
  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
    // Khi bấm mở xem chuông thông báo -> Tự động đánh dấu tất cả đã đọc
    if (!showDropdown && notifications.length > 0) {
      const updated = notifications.map(n => ({ ...n, isRead: true }));
      setNotifications(updated);
      if (isAuthenticated && username) {
        localStorage.setItem(`sportstore_notifications_${username}`, JSON.stringify(updated));
      }
      // TODO: Sau này gọi API PATCH/PUT `/api/notifications/read-all` để đồng bộ DB
    }
  };

  // Đánh dấu tất cả đã đọc khi click button trong dropdown
  const handleMarkAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    if (isAuthenticated && username) {
      localStorage.setItem(`sportstore_notifications_${username}`, JSON.stringify(updated));
    }
  };

  // Click vào từng thông báo đơn lẻ
  const handleNotificationClick = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    setNotifications(updated);
    if (isAuthenticated && username) {
      localStorage.setItem(`sportstore_notifications_${username}`, JSON.stringify(updated));
    }
  };

  // Check xem có thông báo nào chưa đọc không để bật dấu chấm đỏ
  const hasUnread = notifications.some(n => !n.isRead);

  // 2. Hàm xử lý khi người dùng thực hiện tìm kiếm
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Chặn hành vi reload lại trang của thẻ form
    if (searchKeyword.trim()) {
      // Điều hướng sang trang danh sách sản phẩm kèm theo query parameter
      // Lưu ý: Thay đổi '/products' thành đúng route cấu hình trong App.jsx của bạn (ví dụ: /product/list)
      navigate(`/product?searchValue=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  return (
    <header className="flex justify-between items-center w-full px-margin-desktop h-20 z-50 sticky top-0 bg-white/70 backdrop-blur-md border-b border-outline-variant font-['Lexend']">

      {/* LEFT: Logo & Navigation */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <Link className="text-2xl font-black tracking-tighter text-primary whitespace-nowrap" to="/">
          VELOCITY
        </Link>

        <nav className="hidden lg:flex items-center gap-2 h-full uppercase">
          {/* Cập nhật đường dẫn đồng bộ với trang sản phẩm (Ví dụ sử dụng /products) */}
          <Link className="text-on-surface-variant hover:text-primary transition-colors font-semibold py-7 px-2 flex items-center gap-1 whitespace-nowrap text-[13px]" to="/product?categoryId=23">
            <span className="material-symbols-outlined text-[18px]">steps</span>
            GIÀY
          </Link>
          <Link className="text-on-surface-variant hover:text-primary transition-colors font-semibold py-7 px-2 flex items-center gap-1 whitespace-nowrap text-[13px]" to="/product?categoryId=24">
            <span className="material-symbols-outlined text-[18px]">checkroom</span>
            QUẦN ÁO
          </Link>

          {/* MEGA MENU: PHỤ KIỆN */}
          <div className="group h-full flex items-center">
            <button className="text-on-surface-variant hover:text-primary transition-colors font-semibold py-7 px-2 flex items-center gap-1 whitespace-nowrap text-[13px]">
              PHỤ KIỆN
              <span className="material-symbols-outlined text-[18px] group-hover:rotate-180 transition-transform">
                keyboard_arrow_down
              </span>
            </button>
            <div className="hidden group-hover:grid absolute top-20 left-0 w-full bg-surface-container-lowest shadow-lg border-b border-outline-variant p-lg grid-cols-6 gap-md z-[60]">
              {[
                { name: "Tất", icon: "checkroom", id: 25 },
                { name: "Mũ", icon: "sports_score", id: 26 },
                { name: "Balo", icon: "backpack", id: 27 },
                { name: "Bình nước", icon: "water_drop", id: 29 },
                { name: "Găng tay", icon: "sports_mma", id: 28 },
                { name: "Túi tập gym", icon: "fitness_center", id: 30 },
              ].map((item) => (
                <Link
                  key={item.name}
                  className="flex flex-col items-center gap-2 p-md hover:bg-surface-container transition-all rounded-lg"
                  // Bấm vào phụ kiện nào thì tìm kiếm đích danh phụ kiện đó
                  to={`/product?categoryId=${item.id}`}
                >
                  <span className="material-symbols-outlined text-primary text-3xl">
                    {item.icon}
                  </span>
                  <span className="font-bold text-sm normal-case">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* DROPDOWN: ĐƠN HÀNG */}
          <div className="group h-full flex items-center relative">
            <button className="text-on-surface-variant hover:text-primary transition-colors font-semibold py-7 px-2 flex items-center gap-1 whitespace-nowrap text-[13px]">
              ĐƠN HÀNG
              <span className="material-symbols-outlined text-[18px] group-hover:rotate-180 transition-transform">
                expand_more
              </span>
            </button>
            <div className="absolute top-20 left-0 w-56 bg-surface border border-outline-variant rounded-b-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[60] py-2">
              <Link to="/order/order-history" className="block px-4 py-3 text-sm font-bold text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors normal-case">
                Lịch sử mua hàng
              </Link>
              <Link to="/order/order-history" className="block px-4 py-3 text-sm font-bold text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors normal-case">
                Đơn hàng đang giao
              </Link>
            </div>
          </div>

          <Link className="text-on-surface-variant hover:text-primary transition-colors font-semibold py-7 px-2 whitespace-nowrap text-[13px]" to="/wishlist">
            <span className="material-symbols-outlined text-[18px]">collections </span>
            BỘ SƯU TẬP
          </Link>
        </nav>
      </div>

      {/* CENTER: Search Bar (ĐÃ SỬA: Bọc form để nhấn Enter là tìm kiếm) */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex-1 max-w-[500px] min-w-[280px] mx-4 hidden xl:block z-10"
      >
        <div className="relative flex items-center bg-surface-container-low rounded-full pl-5 pr-1.5 py-1.5 border border-transparent focus-within:border-primary focus-within:bg-surface-container-lowest transition-all group/search shadow-sm">
          <span className="material-symbols-outlined text-on-surface-variant group-focus-within/search:text-primary text-[22px]">search</span>
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            className="bg-transparent border-none outline-none ml-2 w-full text-sm font-medium text-on-surface placeholder:text-on-surface-variant/60 focus:ring-0"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-primary text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-blue-700 active:scale-95 transition-all flex-shrink-0 uppercase tracking-widest"
          >
            Tìm
          </button>
        </div>
      </form>

      {/* RIGHT: Action Icons & Profile */}
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">

        {/* NOTIFICATION BUTTON & DROPDOWN */}
        <div className="relative">
          <button
            onClick={handleBellClick}
            className="text-on-surface-variant hover:text-primary transition-colors p-2 relative cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
            {hasUnread && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>

          {showDropdown && (
            <NotificationDropdown
              notifications={notifications}
              onMarkAllAsRead={handleMarkAllAsRead}
              onClose={() => setShowDropdown(false)}
              onNotificationClick={handleNotificationClick}
            />
          )}
        </div>

        <Link to="/cart/view" className="text-on-surface-variant hover:text-primary transition-colors p-2 relative">
          <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
          {cartCount > 0 && (
            <span className="absolute top-2 right-2 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-surface animate-pulse">
              {cartCount}
            </span>
          )}
        </Link>

        <div className="w-[1px] h-6 bg-outline-variant mx-2"></div>

        {/* PROFILE DROPDOWN / LOGIN BUTTON */}
        {isAuthenticated ? (
          <div className="group relative">
            <button className="flex items-center gap-1.5 p-1 pl-2 rounded-full border border-outline-variant hover:bg-surface-container-low transition-all">
              <span className="material-symbols-outlined text-[28px] text-on-surface-variant">account_circle</span>
              <span className="text-xs font-bold text-on-surface max-w-[80px] truncate">{username}</span>
              <span className="material-symbols-outlined text-[18px] group-hover:rotate-180 transition-transform">expand_more</span>
            </button>

            <div className="hidden group-hover:block absolute right-0 top-[110%] w-64 bg-white border border-outline-variant shadow-2xl rounded-2xl py-3 z-50 overflow-hidden">
              <div className="px-5 py-2 mb-2">
                <p className="text-[12px] text-on-surface-variant uppercase font-bold tracking-wider">Xin chào, {username}</p>
              </div>

              <MenuLink icon="person" label="Hồ sơ cá nhân" to="/profile" />
              <MenuLink icon="history" label="Lịch sử mua hàng" to="/order/order-history" />
              <MenuLink icon="confirmation_number" label="Mã giảm giá của tôi" to="/coupons" />
              <MenuLink icon="sell" label="Ưu đãi & Khuyến mãi" to="/offers" />
              <MenuLink icon="favorite" label="Danh sách yêu thích" to="/wishlist" />

              <hr className="my-2 border-outline-variant" />

              <button
                onClick={() => {
                  // Dọn dẹp dữ liệu thông báo trong localStorage và sessionStorage của user khi logout
                  if (username) {
                    localStorage.removeItem(`sportstore_notifications_${username}`);
                    sessionStorage.removeItem(`sportstore_reminder_shown_${username}`);
                  }
                  // Reset state về rỗng
                  setNotifications([]);
                  setShowDropdown(false);
                  setShowToast(false);

                  logout();
                  navigate('/login');
                }}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-red-600 transition-colors font-bold text-sm text-left cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">logout</span>
                Đăng xuất
              </button>
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-all text-xs font-black uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-[18px]">login</span>
            Đăng nhập
          </Link>
        )}
      </div>

      {/* Custom Toast popup */}
      <Toast
        show={showToast}
        title={toastData.title}
        content={toastData.content}
        type={toastData.type}
        onClose={() => setShowToast(false)}
      />

    </header>
  );
}