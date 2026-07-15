# Kế hoạch điều chỉnh: Chỉ hiển thị Loader & Hẹn giờ Reload khi máy chủ ngủ (Cold Start)

Chào bạn, tôi đã đọc kỹ phân tích phản hồi của bạn. Dưới đây là kế hoạch điều chỉnh chi tiết để giải quyết triệt để lỗi reload liên tục và đáp ứng chính xác yêu cầu mới.

---

## 🔍 Phân tích & Thay đổi logic

1. **Khi Server đã Ấm (Warm Start - Lần truy cập cách lần cuối < 15 phút):**
   - **Hoàn toàn KHÔNG can thiệp:** Không hiển thị Toast thông báo tải dữ liệu, không tạo bộ hẹn giờ reload, không đếm số request. Axios hoạt động hoàn toàn bình thường theo cơ chế mặc định của ứng dụng.
2. **Khi Server ngủ (Cold Start - Lần đầu truy cập hoặc cách lần cuối > 15 phút):**
   - Kích hoạt trạng thái **Cold Start Phase**.
   - Hiển thị duy nhất một Toast thông báo: *"Máy chủ đang khởi động (Render free cần 30-50s)..."*.
   - Thiết lập **duy nhất 1 bộ hẹn giờ reload toàn cục là 60 giây**.
   - Ngay khi **bất kỳ request nào nhận được phản hồi đầu tiên** (thành công hoặc lỗi từ server):
     - Ghi nhận server đã thức giấc bằng cách lưu `backend_last_active_time` vào `localStorage`.
     - Tắt Toast thông báo ngay lập tức.
     - Hủy bỏ bộ hẹn giờ reload 60 giây.
     - Kết thúc trạng thái **Cold Start Phase** để các request sau chạy bình thường mà không bị ảnh hưởng.
   - Nếu quá 60 giây mà không nhận được bất kỳ phản hồi nào từ server, trang web mới tự động reload lại để thử kết nối lại.

---

## 📋 Danh sách file thay đổi

| File | Hành động | Mô tả |
| :--- | :--- | :--- |
| `src/api/axiosClient.js` | Sửa đổi | Cập nhật lại cấu trúc interceptor theo logic Cold Start duy nhất, loại bỏ hoàn toàn logic reload 7s khi server warm. |
| `docs/tasks/api-loading-reload-handling.md` | Cập nhật | Đồng bộ tài liệu thiết kế trong project. |

---

## 📝 Chi tiết Code triển khai dự kiến trong `axiosClient.js`

```javascript
// Trạng thái quản lý Cold Start
let isColdStartPhase = false;
let activeColdRequestsCount = 0;
let loadingToastEl = null;
let reloadTimer = null;

const RENDER_IDLE_TIMEOUT = 15 * 60 * 1000; // 15 phút

// Hàm kiểm tra xem server có thực sự đang ngủ (Cold Start) hay không
function checkServerStatus() {
  const lastActive = localStorage.getItem('backend_last_active_time');
  if (!lastActive) {
    return { isCold: true, timeout: 60000 }; // 60 giây cho lần đầu tiên
  }
  const diff = Date.now() - parseInt(lastActive, 10);
  if (diff > RENDER_IDLE_TIMEOUT) {
    return { isCold: true, timeout: 60000 }; // 60 giây nếu đã lâu không hoạt động
  }
  return { isCold: false, timeout: 0 }; // Server đã ấm, không cần timeout reload
}

// Hàm hiển thị Toast thông báo khi máy chủ đang khởi động
function showColdStartToast() {
  if (loadingToastEl) return;

  loadingToastEl = document.createElement('div');
  loadingToastEl.id = 'global-loading-toast';
  loadingToastEl.className = 'fixed top-24 right-6 z-[9999] w-80 bg-white rounded-2xl border border-amber-200 shadow-2xl overflow-hidden flex transform transition-all duration-300 translate-y-0 opacity-100 animate-pulse';
  
  // Thanh trang trí màu cam chỉ thị trạng thái khởi động
  const sideBar = document.createElement('div');
  sideBar.className = 'w-1.5 bg-amber-500 flex-shrink-0';
  loadingToastEl.appendChild(sideBar);

  const content = document.createElement('div');
  content.className = 'p-4 flex gap-3.5 items-start flex-grow';

  // Spinner màu cam
  const spinnerContainer = document.createElement('div');
  spinnerContainer.className = 'w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0';
  
  const spinner = document.createElement('div');
  spinner.className = 'w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin';
  spinnerContainer.appendChild(spinner);
  content.appendChild(spinnerContainer);

  // Nội dung chữ
  const textContainer = document.createElement('div');
  textContainer.className = 'flex-grow min-w-0';

  const title = document.createElement('h4');
  title.className = 'text-xs font-black text-gray-800 uppercase tracking-wider';
  title.innerText = 'Máy chủ đang khởi động';

  const subtitle = document.createElement('p');
  subtitle.className = 'text-[11px] text-gray-500 font-medium mt-1 leading-relaxed';
  subtitle.innerText = 'Render (Free Tier) cần khoảng 30-50s để khởi động lại dịch vụ. Xin vui lòng đợi...';

  textContainer.appendChild(title);
  textContainer.appendChild(subtitle);
  content.appendChild(textContainer);
  loadingToastEl.appendChild(content);

  document.body.appendChild(loadingToastEl);
}

// Hàm ẩn Toast thông báo
function hideColdStartToast() {
  if (loadingToastEl) {
    loadingToastEl.classList.remove('opacity-100');
    loadingToastEl.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => {
      if (loadingToastEl) {
        loadingToastEl.remove();
        loadingToastEl = null;
      }
    }, 300);
  }
}

// Hàm kết thúc hoàn toàn giai đoạn Cold Start
function exitColdStartPhase(success) {
  if (success) {
    localStorage.setItem('backend_last_active_time', Date.now().toString());
  }
  isColdStartPhase = false;
  activeColdRequestsCount = 0;
  hideColdStartToast();
  if (reloadTimer) {
    clearTimeout(reloadTimer);
    reloadTimer = null;
  }
}
```

---

## 🔄 Cập nhật luồng xử lý trong Interceptor

### 1. Request Interceptor:
- Gọi `checkServerStatus()`.
- Nếu xác định là Cold Start:
  - Đặt `isColdStartPhase = true`.
  - Tăng `activeColdRequestsCount`.
  - Hiển thị Toast thông báo khởi động.
  - Đặt duy nhất 1 `reloadTimer` toàn cục chạy trong 60 giây.
- Nếu không phải Cold Start: **Bỏ qua hoàn toàn, không làm gì cả.**

### 2. Response / Error Interceptor:
- Nếu đang ở `isColdStartPhase`:
  - Giảm `activeColdRequestsCount`.
  - Nếu nhận được phản hồi hợp lệ từ server (Thành công hoặc Lỗi có `error.response`):
    - Gọi `exitColdStartPhase(true)` để lưu vết active, hủy timer và tắt Toast.
  - Nếu thất bại hoàn toàn (Lỗi mạng/mất kết nối):
    - Nếu tất cả các request cold start kết thúc (`activeColdRequestsCount === 0`):
      - Gọi `exitColdStartPhase(false)` để tắt Toast và hủy timer (không ép reload khi mạng của người dùng bị rớt).
- Nếu không ở trong `isColdStartPhase`:
  - Chỉ cập nhật `backend_last_active_time` vào `localStorage` khi nhận phản hồi để duy trì trạng thái ấm.
