import axiosClient from './axiosClient';

const provinceApi = {
    /**
     * Lấy danh sách toàn bộ Tỉnh/Thành phố trong hệ thống
     */
    getAllProvinces: () => {
        const url = '/provinces';
        return axiosClient.get(url);
    }
};

export default provinceApi;
