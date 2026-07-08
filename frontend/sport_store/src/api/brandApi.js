import axiosClient from "./axiosClient";


const brandApi = {
    /**
     * Lấy tất cả hãng của sản phẩm
     */
    getAll: () => {
        const url = '/brands/all';
        return axiosClient.get(url);
    }
};

export default brandApi;