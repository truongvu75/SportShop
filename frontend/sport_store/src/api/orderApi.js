import axiosClient from './axiosClient';

const orderApi = {
    /**
     * Khách hàng đặt mua hàng (Tạo đơn hàng từ giỏ hàng hiện tại)
     * @param {object} orderData { deliveryAddress, deliveryProvince, payMethod, shipperID }
     */
    createOrder: (orderData) => {
        const url = '/orders';
        return axiosClient.post(url, orderData);
    },

    /**
     * Khách hàng xem danh sách đơn hàng của chính mình
     */
    getMyOrders: () => {
        const url = '/orders/my-orders';
        return axiosClient.get(url);
    },

    /**
     * Xem chi tiết một đơn hàng theo mã đơn hàng
     * @param {number} id 
     */
    getOrderById: (id) => {
        const url = `/orders/${id}`;
        return axiosClient.get(url);
    },

    /**
     * Khách hàng tự hủy đơn hàng của mình (Chỉ khi đơn hàng đang ở trạng thái 'Chờ xác nhận')
     * @param {number} id 
     */
    cancelOrder: (id) => {
        const url = `/orders/${id}/cancel`;
        return axiosClient.put(url);
    },

    /**
     * Admin/Employee lấy danh sách toàn bộ đơn hàng (có phân trang, mới nhất lên trước)
     * @param {number} page - Trang hiện tại (bắt đầu từ 1)
     * @param {number} size - Số đơn hàng mỗi trang
     */
    getAllOrders: (page = 1, size = 10) => {
        return axiosClient.get('/orders', { params: { page, size } });
    },

    /**
     * Admin/Employee cập nhật trạng thái đơn hàng
     * PUT /api/orders/{id}/status
     * @param {number} id - Mã đơn hàng (orderID)
     * @param {number} statusCode - Mã trạng thái (1: Chờ xác nhận, 2: Đang giao, 3: Đã giao, 4: Đã hủy)
     */
    updateOrderStatus: (id, statusCode) => {
        return axiosClient.put(`/orders/${id}/status`, { status: statusCode });
    },
};

export default orderApi;
