import axiosClient from './axiosClient';

const authApi = {
    /**
     * Đăng nhập tài khoản
     * @param {Object} credentials { username, password }
     * @returns {Promise} response { token, username, roles }
     */
    login: (credentials) => {
        const url = '/auth/login';
        return axiosClient.post(url, credentials);
    },

    /**
     * Đăng ký tài khoản mới kèm theo thông tin Khách hàng (Customer)
     * @param {Object} userData 
     * @returns {Promise}
     */
    register: (userData) => {
        const url = '/auth/register';
        return axiosClient.post(url, userData);
    },

    /**
     * Đổi mật khẩu tài khoản đang đăng nhập
     * @param {Object} passwordData - { currentPassword, newPassword }
     * @returns {Promise}
     */
    changePassword: (passwordData) => {
        const url = '/auth/change-password';
        return axiosClient.post(url, passwordData);
    }
};

export default authApi;
