// src/api/productApi.js
import axiosClient from './axiosClient';

const productApi = {
    /**
     * Lấy danh sách sản phẩm (Hỗ trợ phân trang, tìm kiếm, lọc theo danh mục, giá...)
     * @param {Object} params - Các tham số lọc ví dụ: { page: 1, limit: 10, category: 'shoes', search: 'nike' }
     */
    getAllProducts: (params) => {
        const url = '/products/list';
        return axiosClient.get(url, { params });
    },

    /**
     * Xem chi tiết một sản phẩm theo ID
     * @param {string|number} id - ID của sản phẩm cần lấy
     */
    getProductById: (id) => {
        const url = `/products/${id}`;
        return axiosClient.get(url);
    },

    /**
     * [ADMIN] Thêm mới một sản phẩm
     * @param {Object} productData - Thông tin sản phẩm mới (name, price, stock, description...)
     */
    createProduct: (productData) => {
        const url = '/products';
        return axiosClient.post(url, productData);
    },

    /**
     * [ADMIN] Cập nhật thông tin sản phẩm
     * @param {string|number} id - ID sản phẩm cần sửa
     * @param {Object} productData - Dữ liệu cập nhật mới
     */
    updateProduct: (id, productData) => {
        const url = `/products/${id}`;
        return axiosClient.put(url, productData);
    },

    /**
     * [ADMIN] Xóa sản phẩm (Xóa mềm hoặc xóa cứng tùy thuộc vào thiết kế Backend của bạn)
     * @param {string|number} id - ID sản phẩm cần xóa
     */
    deleteProduct: (id) => {
        const url = `/products/${id}`;
        return axiosClient.delete(url);
    },

    /**
     * Lấy danh sách các sản phẩm nổi bật / bán chạy (Hiển thị ở trang chủ)
     */
    getFeaturedProducts: () => {
        const url = '/products/featured';
        return axiosClient.get(url);
    },

    /**
     * Lấy danh sách tất cả kích cỡ và màu sắc (DÙng để hiển thị cho bộ lọc)
     * @returns 
     */
    getAllSizes: () => { return axiosClient.get('/products/sizes'); },
    getAllColors: () => { return axiosClient.get('/products/colors') }
};

export default productApi;