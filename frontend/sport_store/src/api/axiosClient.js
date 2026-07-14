// src/api/axiosClient.js
import axios from 'axios';

// 1. Tạo một instance với các cấu hình cơ bản (Base URL, Timeout)
const axiosClient = axios.create({
  baseURL: 'https://sportshop-03nh.onrender.com/api', // Từ giờ các file khác chỉ cần viết '/products', '/orders'
  timeout: 10000, // Quá 10 giây không phản hồi thì tự động ngắt (tránh treo app)
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Cấu hình Interceptor trước khi gửi request (Request Interceptor)
// Tự động móc Token từ LocalStorage gắn vào Header
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Đảm bảo tương thích với cả các phiên bản Axios cũ và mới sử dụng AxiosHeaders
      config.headers['Authorization'] = `Bearer ${token}`;
      if (config.headers.set) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Cấu hình Interceptor sau khi nhận response (Response Interceptor)
// Tự động bóc tách dữ liệu hoặc xử lý lỗi tập trung
axiosClient.interceptors.response.use(
  (response) => {
    // Chỉ lấy dữ liệu data trả về cho tiện dụng
    return response.data; 
  },
  (error) => {
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
