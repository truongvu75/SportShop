import axiosClient from './axiosClient';

const wishlistApi = {
    /**
     * Lấy danh sách sản phẩm trong wishlist của khách hàng hiện tại
     */
    getWishlist: () => {
        const url = '/wishlist';
        return axiosClient.get(url);
    },

    /**
     * Thêm một sản phẩm vào wishlist
     * @param {number} productId 
     */
    addToWishlist: (productId) => {
        const url = `/wishlist/${productId}`;
        return axiosClient.post(url);
    },

    /**
     * Xóa một sản phẩm khỏi wishlist
     * @param {number} productId 
     */
    removeFromWishlist: (productId) => {
        const url = `/wishlist/${productId}`;
        return axiosClient.delete(url);
    }
};

export default wishlistApi;
