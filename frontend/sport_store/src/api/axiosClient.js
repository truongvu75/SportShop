// src/api/axiosClient.js
import axios from 'axios';

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
  loadingToastEl.className = 'fixed top-24 right-6 z-[9999] w-80 bg-white rounded-2xl border border-amber-200/60 shadow-2xl overflow-hidden flex transform transition-all duration-300 translate-y-0 opacity-100 animate-pulse';
  
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

// 1. Tạo một instance với các cấu hình cơ bản (Base URL, Timeout)
const axiosClient = axios.create({
  baseURL: 'https://sportshop-03nh.onrender.com/api', // Từ giờ các file khác chỉ cần viết '/products', '/orders'
  timeout: 60000, // Tăng lên 60 giây để hỗ trợ khởi động lại Render (Cold Start)
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Cấu hình Interceptor trước khi gửi request (Request Interceptor)
axiosClient.interceptors.request.use(
  (config) => {
    // Tự động móc Token từ LocalStorage gắn vào Header
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      if (config.headers.set) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    }

    // Kiểm tra trạng thái máy chủ
    const { isCold, timeout } = checkServerStatus();
    
    if (isCold || isColdStartPhase) {
      isColdStartPhase = true;
      activeColdRequestsCount++;
      
      showColdStartToast();
      
      // Khởi tạo duy nhất 1 bộ hẹn giờ reload toàn cục nếu chưa có
      if (!reloadTimer) {
        reloadTimer = setTimeout(() => {
          console.warn(`Máy chủ không phản hồi sau ${timeout}ms khởi động. Tự động tải lại trang.`);
          window.location.reload();
        }, timeout);
      }
    }

    return config;
  },
  (error) => {
    if (isColdStartPhase) {
      activeColdRequestsCount--;
      if (activeColdRequestsCount <= 0) {
        exitColdStartPhase(false);
      }
    }
    return Promise.reject(error);
  }
);

// 3. Cấu hình Interceptor sau khi nhận response (Response Interceptor)
axiosClient.interceptors.response.use(
  (response) => {
    if (isColdStartPhase) {
      // Phản hồi thành công từ server -> Ghi nhận hoạt động, tắt thông báo & hủy timer reload
      exitColdStartPhase(true);
    } else {
      // Cập nhật vết hoạt động thông thường để duy trì trạng thái warm
      localStorage.setItem('backend_last_active_time', Date.now().toString());
    }

    // Chỉ lấy dữ liệu data trả về cho tiện dụng
    return response.data; 
  },
  (error) => {
    if (isColdStartPhase) {
      if (error.response) {
        // Có phản hồi lỗi từ server -> Nghĩa là server đã thức giấc
        exitColdStartPhase(true);
      } else {
        // Lỗi kết nối mạng/treo hoàn toàn
        activeColdRequestsCount--;
        if (activeColdRequestsCount <= 0) {
          exitColdStartPhase(false);
        }
      }
    } else if (error.response) {
      // Cập nhật vết hoạt động thông thường
      localStorage.setItem('backend_last_active_time', Date.now().toString());
    }

    // Xử lý các lỗi hệ thống chung (Global Error Handling)
    // Nếu token hết hạn hoặc không hợp lệ (401/403) và đang có lưu token, tự động logout để dọn sạch session
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('roles');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
