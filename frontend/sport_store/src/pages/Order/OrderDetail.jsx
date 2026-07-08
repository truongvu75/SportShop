import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import orderApi from '../../api/orderApi';
import ratingApi from '../../api/ratingApi';
import RatingModal from '../Rating/RatingModal';

export default function OrderDetail() {
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [cancelling, setCancelling] = useState(false);

    // Trạng thái cho modal đánh giá và danh sách product ID đã đánh giá
    const [ratingModal, setRatingModal] = useState({ open: false, productID: null, productName: '' });
    const [ratedProductIDs, setRatedProductIDs] = useState(new Set());

    // Load chi tiết đơn hàng từ Backend
    const loadOrderDetail = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await orderApi.getOrderById(id);
            if (data) {
                setOrder(data);
                // Nếu đơn hàng đã hoàn thành, kiểm tra những sản phẩm nào đã được đánh giá
                if (Number(data.statusID) === 4 && data.items) {
                    const ratedIds = new Set();
                    await Promise.all(
                        data.items.map(async (item) => {
                            try {
                                const eligibility = await ratingApi.checkEligibility(item.productID);
                                if (eligibility && eligibility.status === 2) {
                                    ratedIds.add(item.productID);
                                }
                            } catch (err) {
                                console.error(`Lỗi check eligibility cho sản phẩm ${item.productID}:`, err);
                            }
                        })
                    );
                    setRatedProductIDs(ratedIds);
                }
            } else {
                setError("Không tải được chi tiết đơn hàng.");
            }
        } catch (err) {
            console.error("Lỗi khi tải chi tiết đơn hàng:", err);
            setError(err.response?.data?.message || "Không thể kết nối đến hệ thống máy chủ!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            loadOrderDetail();
        }
    }, [id]);

    // Hủy đơn hàng
    const handleCancelOrder = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy đơn đặt hàng này không?")) {
            return;
        }

        try {
            setCancelling(true);
            setError('');
            setSuccessMessage('');

            const updatedOrder = await orderApi.cancelOrder(id);
            if (updatedOrder) {
                setOrder(updatedOrder);
                setSuccessMessage("Đã hủy đơn hàng thành công! Số lượng sản phẩm đã được hoàn kho.");
            }
        } catch (err) {
            console.error("Lỗi khi hủy đơn hàng:", err);
            setError(err.response?.data?.message || "Hủy đơn hàng thất bại. Vui lòng thử lại!");
        } finally {
            setCancelling(false);
        }
    };

    // Định dạng tiền tệ VNĐ
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Định dạng Ngày
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    // Định dạng Giờ
    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    // Mở modal đánh giá
    const handleOpenRating = (productID, productName) => {
        setRatingModal({ open: true, productID, productName });
    };

    // Đánh giá thành công
    const handleRatingSuccess = () => {
        setRatedProductIDs(prev => {
            const next = new Set(prev);
            next.add(ratingModal.productID);
            return next;
        });
        setSuccessMessage(`Đã gửi đánh giá sản phẩm "${ratingModal.productName}" thành công! Cảm ơn bạn.`);
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    if (loading && !order) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-surface">
                <div className="flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-primary animate-spin">sync</span>
                    <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest animate-pulse">Đang tải thông tin đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (error && !order) {
        return (
            <div className="max-w-[1200px] mx-auto px-6 py-20 text-center">
                <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
                <h2 className="text-xl font-black uppercase text-on-surface mb-2">Đã xảy ra lỗi!</h2>
                <p className="text-sm text-on-surface-variant mb-8">{error}</p>
                <Link to="/order/order-history" className="px-6 py-3 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl">
                    Quay lại lịch sử đơn hàng
                </Link>
            </div>
        );
    }

    // Xây dựng các bước tracking từ trạng thái thật (statusID)
    const statusID = Number(order.statusID);
    const isCancelled = statusID === 5;

    const trackingSteps = [
        {
            title: 'Đặt hàng thành công',
            location: 'Đơn hàng đã được ghi nhận trên hệ thống',
            time: `${formatDate(order.orderTime)} ${formatTime(order.orderTime)}`,
            completed: statusID >= 1 && statusID !== 5,
            active: statusID === 1
        },
        {
            title: 'Đang vận chuyển',
            location: order.shipperName ? `Đơn vị vận chuyển: ${order.shipperName}` : 'Đang bàn giao cho đơn vị vận chuyển',
            time: order.shippedTime ? `${formatDate(order.shippedTime)} ${formatTime(order.shippedTime)}` : 'Đang xử lý...',
            completed: statusID >= 2 && statusID !== 5,
            active: statusID === 2 || statusID === 3,
            pending: statusID < 2
        },
        {
            title: 'Giao hàng thành công',
            location: 'Đã hoàn tất giao nhận hàng',
            time: order.finishedTime ? `${formatDate(order.finishedTime)} ${formatTime(order.finishedTime)}` : 'Dự kiến 2-3 ngày',
            completed: statusID === 4,
            active: statusID === 4,
            pending: statusID < 4
        }
    ];

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-10 bg-surface min-h-screen font-['Lexend']">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] text-on-surface-variant mb-6 font-bold uppercase tracking-widest">
                <Link className="hover:text-primary transition-colors" to="/">Trang chủ</Link>
                <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                <Link className="hover:text-primary transition-colors" to="/order/order-history">Lịch sử mua hàng</Link>
                <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                <span className="text-primary">Chi tiết #{order.orderID}</span>
            </nav>

            {/* Alert thông báo */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-xs font-bold uppercase tracking-wide flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {error}
                </div>
            )}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-xl text-green-700 text-xs font-bold uppercase tracking-wide flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    {successMessage}
                </div>
            )}

            {/* Header Section */}
            <div className="mb-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 ${isCancelled ? 'bg-red-100 text-red-800' : 'bg-secondary-container text-on-secondary-container'
                            }`}>
                            {order.statusDescription}
                        </span>
                        <h1 className="text-3xl font-black text-on-surface tracking-tighter uppercase">Đơn hàng #{order.orderID}</h1>
                        <p className="text-on-surface-variant text-[11px] font-bold mt-1 uppercase tracking-tight">
                            Đặt ngày {formatDate(order.orderTime)} • {formatTime(order.orderTime)}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {/* Nút hủy đơn hàng dành cho khách hàng (chỉ khi đơn hàng đang ở trạng thái Chờ xác nhận - ID 1) */}
                        {order.statusID === 1 && (
                            <button
                                onClick={handleCancelOrder}
                                disabled={cancelling}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all active:scale-95 shadow-sm disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[18px]">cancel</span>
                                {cancelling ? "ĐANG HỦY..." : "HỦY ĐƠN HÀNG"}
                            </button>
                        )}

                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-outline-variant text-on-surface font-black text-[10px] uppercase tracking-widest hover:bg-surface-container transition-all active:scale-95">
                            <span className="material-symbols-outlined text-[18px]">print</span>
                            In hóa đơn
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-400 text-white font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 shadow-sm">
                            Hỗ trợ đơn hàng
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* CỘT TRÁI: TRACKING & PRODUCTS */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Phần hiển thị tiến trình vận chuyển */}
                    <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm">
                        <h2 className="text-base font-black mb-10 flex items-center gap-2 uppercase tracking-tight">
                            <span className="material-symbols-outlined text-primary">local_shipping</span>
                            Tiến trình vận chuyển
                        </h2>

                        {isCancelled ? (
                            <div className="p-8 bg-red-50 rounded-2xl border border-red-200 text-center">
                                <span className="material-symbols-outlined text-red-500 text-5xl mb-3 animate-bounce">cancel</span>
                                <h3 className="text-lg font-black text-red-700 uppercase tracking-wide">Đơn hàng này đã bị hủy bỏ</h3>
                                <p className="text-xs text-red-600 font-medium mt-1">Mọi mặt hàng đã được thu hồi và hoàn trả số lượng tồn kho đầy đủ.</p>
                            </div>
                        ) : (
                            <div className="relative pl-4 md:pl-0">
                                <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-[1.5px] bg-outline-variant/50 md:-translate-x-1/2"></div>
                                <div className="space-y-12">
                                    {trackingSteps.map((step, idx) => (
                                        <div key={idx} className="relative flex items-start md:justify-center">
                                            <div className={`flex flex-col md:items-end md:w-1/2 pr-0 md:pr-12 pl-12 md:pl-0 ${step.pending ? 'opacity-50' : ''}`}>
                                                <h4 className={`text-sm font-black uppercase tracking-tight ${step.active || step.completed ? 'text-primary' : 'text-on-surface-variant'}`}>
                                                    {step.title}
                                                </h4>
                                                <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">{step.location}</p>
                                            </div>
                                            <div className={`absolute left-0 md:left-1/2 -translate-x-0 md:-translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center z-10 border-4 border-surface-container-lowest shadow-sm ${step.completed ? 'bg-primary' :
                                                step.active ? 'bg-primary animate-pulse' :
                                                    'bg-surface-container'
                                                } ${step.pending ? 'opacity-40' : ''}`}>
                                                {step.completed ? (
                                                    <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>
                                                ) : step.active ? (
                                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                                ) : (
                                                    <span className="material-symbols-outlined text-on-surface-variant text-[16px]">schedule</span>
                                                )}
                                            </div>
                                            <div className={`hidden md:block w-1/2 pl-12 ${step.pending ? 'opacity-40' : ''}`}>
                                                <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">{step.time}</p>
                                            </div>
                                            <div className={`md:hidden pl-12 mt-1 ${step.pending ? 'opacity-40' : ''}`}>
                                                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{step.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Danh sách sản phẩm trong đơn hàng */}
                    <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm">
                        <h2 className="text-base font-black mb-8 uppercase tracking-tight">Sản phẩm trong đơn hàng</h2>
                        <div className="divide-y divide-outline-variant/30">
                            {order.items?.map((item) => (
                                <div key={item.orderDetailID} className="flex gap-4 py-6 first:pt-0 last:pb-0 items-center">
                                    <div className="w-20 h-24 bg-surface rounded-xl overflow-hidden flex-shrink-0 border border-outline-variant/30 shadow-sm">
                                        <img src={item.photo || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'} alt={item.productName} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-black text-sm text-on-surface uppercase mb-1">{item.productName}</h3>
                                                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tight">
                                                    Size {item.sizeName || 'N/A'} | Màu sắc: {item.colorName || 'N/A'}
                                                </p>
                                            </div>
                                            <p className="font-black text-primary text-sm">{formatCurrency(item.salePrice)}</p>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                                            <p className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant">
                                                Số lượng: <span className="text-on-surface">{item.quantity}</span>
                                            </p>
                                            <div className="flex items-center gap-3">
                                                {statusID === 4 && (
                                                    ratedProductIDs.has(item.productID) ? (
                                                        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                            Đã đánh giá
                                                        </span>
                                                    ) : (
                                                        <button
                                                            id={`review-btn-${item.productID}`}
                                                            onClick={() => handleOpenRating(item.productID, item.productName)}
                                                            className="text-[10px] font-black text-amber-600 uppercase tracking-widest hover:text-amber-700 flex items-center gap-1.5 border border-amber-300 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-all"
                                                        >
                                                            <span className="material-symbols-outlined text-[14px]">star</span>
                                                            Đánh giá
                                                        </button>
                                                    )
                                                )}
                                                <Link to={`/product/${item.productID}`} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1.5">
                                                    Xem sản phẩm
                                                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* CỘT PHẢI: SUMMARY & OTHERS */}
                <aside className="lg:col-span-4 space-y-8">
                    <section className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
                        <h2 className="text-base font-black mb-6 uppercase tracking-tight border-b border-outline-variant/50 pb-4">Tóm tắt đơn hàng</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                                <span>Tạm tính</span>
                                <span className="text-on-surface font-black">{formatCurrency(order.totalAmount)}</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                                <span>Phí vận chuyển</span>
                                <span className="text-green-600 font-black text-[9px] uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-md">Miễn phí</span>
                            </div>
                            <div className="h-px bg-outline-variant/50 my-2 border-dashed border-t"></div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="font-black text-sm uppercase tracking-tighter">Tổng thanh toán</span>
                                <span className="text-2xl font-black text-primary">{formatCurrency(order.totalAmount)}</span>
                            </div>
                        </div>

                        <div className="mt-8 space-y-6 bg-surface-container-high p-5 rounded-xl border border-outline-variant/30">
                            <div>
                                <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Phương thức thanh toán</p>
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-[20px]">
                                        {order.payMethod === 'VNPAY' ? 'credit_card' : 'local_shipping'}
                                    </span>
                                    <span className="font-black text-xs uppercase tracking-tight text-on-surface">
                                        {order.payMethod === 'VNPAY' ? 'Thẻ tín dụng (VNPAY)' : 'COD (Tiền mặt)'}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-outline-variant/30 pt-4">
                                <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Địa chỉ nhận hàng</p>
                                <p className="text-xs font-black text-on-surface uppercase mb-1">{order.customerName}</p>
                                <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed">
                                    {order.deliveryAddress}, {order.deliveryProvince}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-gray-700 text-white rounded-2xl p-6 shadow-xl border border-white/5">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-black uppercase tracking-tight">Hành động nhanh</h2>
                        </div>
                        <div className="space-y-4">
                            <Link to="/" className="block w-full py-3 text-[10px] font-black border border-white/20 rounded-xl hover:bg-white/5 transition-all text-center uppercase tracking-widest">
                                Tiếp tục mua sắm
                            </Link>
                            <Link to="/" className="block w-full py-3 text-[10px] font-black bg-primary text-white rounded-xl hover:brightness-110 transition-all text-center uppercase tracking-widest">
                                Quay lại trang chủ
                            </Link>
                        </div>
                    </section>
                </aside>
            </div>

            <RatingModal
                isOpen={ratingModal.open}
                productID={ratingModal.productID}
                productName={ratingModal.productName}
                onClose={() => setRatingModal({ open: false, productID: null, productName: '' })}
                onSuccess={handleRatingSuccess}
            />
        </div>
    );
}
