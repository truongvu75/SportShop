import axiosClient from "./axiosClient";

const categoryApi = {

    /**
     * Lấy danh sách loại hàng (Phân trang)
     */
    getAllCategories: (params) => {
        const url = '/categories';
        return axiosClient.get(url, { params });
    },

    /**
     * 
     * @returns Lấy danh sách all loại hàng (Không phân trang)
     */
    getAll: () => {
        const url = '/categories/all';
        return axiosClient.get(url);
    }
};

export default categoryApi;