import axiosClient from './axiosClient';

const customerApi = {
    /**
     * Xem thông tin cá nhân khách hàng
     */
    getProfile: () => {
        const url = '/customers/profile';
        return axiosClient.get(url);
    },

    /**
     * Cập nhật thông tin cá nhân khách hàng
     * @param {Object} profileData - { customerName, phone, address, provinceName }
     */
    updateProfile: (profileData) => {
        const url = '/customers/profile';
        return axiosClient.put(url, profileData);
    }
};

export default customerApi;
