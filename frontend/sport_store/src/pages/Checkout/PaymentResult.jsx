import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing');
    const [orderId, setOrderId] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const responseCode = queryParams.get('vnp_ResponseCode'); 
        const id = queryParams.get('vnp_TxnRef'); 
        
        if (id) setOrderId(id);

        const timer = setTimeout(() => {
            if (responseCode === '00') {
                setStatus('success');
            } else {
                setStatus('fail');
            }
        }, 1200);

        return () => clearTimeout(timer);
    }, [location]);

    return (
        // Sử dụng block và mx-auto kết hợp py để tự căn đều khoảng cách, không sợ flex của component cha chèn ép
        <div className="block w-full min-h-[70vh] py-12 px-4 font-sans antialiased text-gray-900">
            {/* Thêm min-w-[280px] và max-w-md để ép trình duyệt phải giữ độ rộng tối thiểu, không thể bóp nhỏ hơn nữa */}
            <div className="w-full max-w-md min-w-[290px] sm:min-w-[400px] mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-md border border-gray-100 text-center">
                
                {/* 1. TRẠNG THÁI ĐANG XỬ LÝ */}
                {status === 'processing' && (
                    <div className="block py-6">
                        <div className="w-12 h-12 border-4 border-gray-100 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                        <h2 className="mt-6 text-xl font-bold text-gray-800 whitespace-nowrap">Đang xác thực giao dịch...</h2>
                        <p className="mt-2 text-sm text-gray-400">Vui lòng không đóng hoặc tải lại trang.</p>
                    </div>
                )}
                
                {/* 2. TRẠNG THÁI THÀNH CÔNG */}
                {status === 'success' && (
                    <div className="block">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-5 mx-auto">
                            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        
                        {/* Thêm lớp tracking và sửa khoảng cách chống rớt chữ */}
                        <h1 className="text-2xl font-extrabold text-emerald-600 mb-3 tracking-tight block clear-both">Thanh toán thành công!</h1>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 block">
                            Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đã được ghi nhận thành công trên hệ thống.
                        </p>
                        
                        {orderId && (
                            <div className="w-full flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl mb-6 text-sm border border-gray-100">
                                <span className="text-gray-400 font-medium">Mã đơn hàng</span>
                                <span className="font-bold text-gray-700">#{orderId}</span>
                            </div>
                        )}

                        <div className="w-full flex flex-col gap-3">
                            <button 
                                onClick={() => navigate('/order/order-history')}
                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs transition-colors duration-200"
                            >
                                Lịch sử đơn hàng
                            </button>
                            <button 
                                onClick={() => navigate('/')}
                                className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-600 font-semibold rounded-xl border border-gray-200 transition-colors duration-200"
                            >
                                Tiếp tục mua sắm
                            </button>
                        </div>
                    </div>
                )}

                {/* 3. TRẠNG THÁI THẤT BẠI */}
                {status === 'fail' && (
                    <div className="block">
                        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-5 mx-auto">
                            <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>

                        <h1 className="text-2xl font-extrabold text-rose-600 mb-3 tracking-tight block">Thanh toán thất bại</h1>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 block">
                            Giao dịch không thành công hoặc bạn đã hủy bỏ thanh toán giữa chừng.
                        </p>
                        
                        {orderId && (
                            <div className="w-full flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl mb-6 text-sm border border-gray-100">
                                <span className="text-gray-400 font-medium">Mã đơn hàng</span>
                                <span className="font-bold text-gray-700">#{orderId}</span>
                            </div>
                        )}

                        <div className="w-full flex flex-col gap-3">
                            <button 
                                onClick={() => navigate('/cart/view')}
                                className="w-full py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl shadow-xs transition-colors duration-200"
                            >
                                Quay lại giỏ hàng
                            </button>
                            <button 
                                onClick={() => navigate('/')}
                                className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-600 font-semibold rounded-xl border border-gray-200 transition-colors duration-200"
                            >
                                Về trang chủ
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentResult;