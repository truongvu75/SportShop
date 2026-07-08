import axiosClient from './axiosClient';

const ratingApi = {
    /**
     * Lấy danh sách đánh giá của sản phẩm (Công khai - không cần đăng nhập)
     * @param {number} productID
     */
    getRatingsByProduct: (productID) => {
        return axiosClient.get(`/ratings/product/${productID}`);
    },

    /**
     * Lấy danh sách đánh giá sản phẩm của Khách hàng
     * @returns 
     */
    getAllRatingsByCustomer: () => {
        return axiosClient.get(`/ratings/me`);
    },

    /**
     * Lấy toàn bộ danh sách đánh giá, có lọc
     * @param {*} params 
     * @returns 
     */
    getAllRatings: (params) => {
        return axiosClient.get(`/ratings`, {params});
    },

    /**
     * Lấy điểm đánh giá trung bình của sản phẩm
     * @param {number} productID
     */
    getAverageStar: (productID) => {
        return axiosClient.get(`/ratings/product/${productID}/average`);
    },

    /**
     * Kiểm tra khách hàng đang đăng nhập có đủ điều kiện đánh giá không.
     * status: 0 = Chưa mua, 1 = Có thể đánh giá, 2 = Đã đánh giá rồi
     * @param {number} productID
     */
    checkEligibility: (productID) => {
        return axiosClient.get(`/ratings/check-eligibility/${productID}`);
    },

    /**
     * Gửi đánh giá mới (Yêu cầu đăng nhập)
     * @param {{ productID: number, star: number, comment: string }} data
     */
    submitRating: (data) => {
        return axiosClient.post('/ratings', data);
    },

    /**
     * Cập nhật đánh giá đã có (Yêu cầu đăng nhập)
     * @param {number} ratingID
     * @param {{ star: number, comment: string }} data
     */
    updateRating: (ratingID, data) => {
        return axiosClient.put(`/ratings/${ratingID}`, data);
    },

    /**
     * Phản hồi đánh giá của Khách hàng
     * @param {*} ratingID 
     * @param {*} data 
     * @returns 
     */
    replyRating: (ratingID, data) => {
        return axiosClient.post(`/ratings/reply/${ratingID}`, data);
    },

    /**
     * Xóa đánh giá (Yêu cầu đăng nhập)
     * @param {number} ratingID
     */
    deleteRating: (ratingID) => {
        return axiosClient.delete(`/ratings/${ratingID}`);
    },
};

export default ratingApi;
