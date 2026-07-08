import axiosClient from './axiosClient';

const chatboxApi = {
    /**
     * Gửi tin nhắn đến trợ lý ảo tư vấn mua hàng
     * @param {string} message
     * @param {number|null} customerId
     */
    sendMessage: (message, customerId) => {
        return axiosClient.post('/chat', {
            message,
            customerId: customerId || null
        });
    }
};

export default chatboxApi;
