# Kế hoạch điều chỉnh: Tối ưu giao diện Header & Trang Sản phẩm trên Mobile

Nhiệm vụ này tập trung vào việc khắc phục các hạn chế hiển thị trên giao diện mobile (ẩn nút, lỗi vỡ dropdown thông báo, lỗi không thể click nút Profile/thông tin tài khoản trên mobile, và điều chỉnh danh sách sản phẩm).

---

## 🛠️ Giải pháp chi tiết

### 1. Header & Mobile Menu (Drawer)
- **Hamburger Toggler:** Thêm nút Menu Hamburger (`menu` / `close` icon) ở góc trái của Header trên màn hình mobile (`lg:hidden`).
- **Drawer Menu:** Khi click toggler, hiển thị Drawer trượt từ cạnh trái màn hình lên trên nội dung. Drawer này chứa:
  - Thanh tìm kiếm (Search Bar) đồng bộ chức năng với bản Desktop.
  - Danh sách Menu chính: GIÀY, QUẦN ÁO, PHỤ KIỆN (dạng list dọc gọn gàng), ĐƠN HÀNG, BỘ SƯU TẬP.
- **Header Layout:** 
  - Thay đổi padding từ `px-margin-desktop` (40px) thành `px-4 md:px-margin-desktop` để chống tràn.
  - Ẩn đường kẻ dọc (`|`) và rút gọn nút Profile/Login trên mobile (chỉ hiện icon Avatar tròn gọn gàng, ẩn username để tiết kiệm diện tích).

### 2. Sửa lỗi nút Profile/Info không hoạt động trên Mobile
- **Nguyên nhân:** Hiện tại Profile dropdown đang kích hoạt bằng CSS `:hover` (`group-hover:block`). Trên màn hình mobile không có sự kiện hover nên click vào không có tác dụng.
- **Giải pháp:** Sử dụng React State `showProfileDropdown` để quản lý đóng/mở trên sự kiện `onClick`. Đồng thời thêm click-outside-handler để tự động đóng dropdown khi nhấn ra ngoài.

### 3. Sửa lỗi NotificationDropdown vỡ layout trên Mobile
- **Giải pháp:** Sử dụng CSS responsive cho dropdown:
  - Trên mobile: Chuyển vị trí thành `fixed top-20 left-4 right-4 w-auto z-[110]` tạo thành một banner thông báo nổi cân xứng ở giữa màn hình.
  - Trên desktop (từ `md` trở lên): Trả về `md:absolute md:right-0 md:left-auto md:w-96 md:top-12`.

### 4. Tối ưu trang Sản phẩm (`ProductPage.jsx` & `Sidebar.jsx`)
- **Lưới sản phẩm (Grid):** Đổi padding của main container từ `p-[24px]` thành `p-3 md:p-6` trên mobile.
- **Nút hành động trong Card:** Ẩn hoàn toàn 2 nút *"Xem chi tiết"* và *"Thử đồ"* khi hiển thị trên mobile (`hidden sm:flex`).
- **Bộ lọc trên Mobile (Mobile Filter Sidebar):** 
- Thêm nút *"Lọc"* ở phần header trang sản phẩm dành riêng cho di động (`md:hidden`).
- Hỗ trợ truyền prop `isOpenOnMobile` và `onCloseMobile` vào `Sidebar.jsx`.
- Thiết kế Sidebar dạng Drawer trượt từ cạnh trái khi ở trên mobile, đồng thời tích hợp nút *"Đóng (X)"* và bấm ra ngoài backdrop để thoát. Sử dụng chung logic filter và state sẵn có để tránh trùng lặp code.

---

## 📋 Danh sách file thay đổi

| File | Hành động | Mô tả |
| :--- | :--- | :--- |
| `src/components/layout/Header.jsx` | Sửa đổi | Cập nhật cấu trúc Header, tích hợp Drawer, quản lý State đóng/mở Profile dropdown & Mobile menu |
| `src/pages/Notification/NotificationDropdown.jsx` | Sửa đổi | Sửa CSS định vị để dropdown hiển thị đẹp trên mobile |
| `src/pages/Product/ProductPage.jsx` | Sửa đổi | Ẩn 2 nút xem chi tiết/thử đồ trên mobile, thu nhỏ padding |

---

## 📝 Chi tiết thay đổi dự kiến

### Header.jsx
```jsx
// Quản lý trạng thái mở rộng
const [showMobileMenu, setShowMobileMenu] = useState(false);
const [showProfileDropdown, setShowProfileDropdown] = useState(false);

// Tự động đóng các dropdown khi click ra ngoài
useEffect(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest('.profile-dropdown-container')) {
      setShowProfileDropdown(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
```
