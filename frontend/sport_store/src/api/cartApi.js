import axiosClient from './axiosClient';

const cartApi = {
    /**
     * Lấy chi tiết giỏ hàng của khách hàng hiện tại
     */
    getCart: () => {
        const url = '/cart';
        return axiosClient.get(url);
    },

    /**
     * Lấy tổng số lượng vật phẩm trong giỏ hàng (hiển thị badge ở Header)
     */
    getCartCount: () => {
        const url = '/cart/count';
        return axiosClient.get(url);
    },

    /**
     * Thêm sản phẩm biến thể vào giỏ hàng
     * @param {number} variantID 
     * @param {number} quantity 
     */
    addToCart: (variantID, quantity) => {
        const url = '/cart/items';
        return axiosClient.post(url, { variantID, quantity });
    },

    /**
     * Cập nhật số lượng của vật phẩm trong giỏ hàng
     * @param {number} cartItemID 
     * @param {number} quantity 
     */
    updateCartItem: (cartItemID, quantity) => {
        const url = `/cart/items/${cartItemID}`;
        return axiosClient.put(url, { quantity });
    },

    /**
     * Xóa một vật phẩm ra khỏi giỏ hàng
     * @param {number} cartItemID 
     */
    removeFromCart: (cartItemID) => {
        const url = `/cart/items/${cartItemID}`;
        return axiosClient.delete(url);
    },

    /**
     * Xóa sạch toàn bộ vật phẩm trong giỏ hàng
     */
    clearCart: () => {
        const url = '/cart/clear';
        return axiosClient.delete(url);
    }
};

export default cartApi;
