import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderApi from '../../api/orderApi';
import ProfileSidebar from '../../components/layout/ProfileSidebar';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [totalOrders, setTotalOrders] = useState(0);

    // Trạng thái bộ lọc đơn hàng
    const [activeFilter, setActiveFilter] = useState('Tất cả');
    const filters = ['Tất cả', 'Chờ xác nhận', 'Đang giao hàng', 'Đã hoàn thành', 'Đã hủy'];

    // Load danh sách lịch sử đơn hàng từ Backend
    const fetchMyOrders = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await orderApi.getMyOrders();
            if (data) {
                setOrders(data);
                setTotalOrders(data.length);
            }
        } catch (err) {
            console.error("Lỗi khi tải lịch sử đơn hàng:", err);
            setError("Không thể tải lịch sử đơn hàng. Vui lòng kiểm tra kết nối!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyOrders();
    }, []);

    // Hủy đơn hàng trực tiếp
    const handleCancelOrder = async (orderID) => {
        if (!window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${orderID} không?`)) {
            return;
        }

        try {
            setActionLoadingId(orderID);
            setError('');
            setSuccessMessage('');
            const updated = await orderApi.cancelOrder(orderID);
            if (updated) {
                setSuccessMessage(`Đã hủy đơn hàng #${orderID} thành công!`);
                const data = await orderApi.getMyOrders();
                if (data) setOrders(data);
            }
        } catch (err) {
            console.error("Lỗi khi hủy đơn hàng:", err);
            setError(err.response?.data?.message || `Hủy đơn hàng #${orderID} thất bại!`);
        } finally {
            setActionLoadingId(null);
        }
    };

    // Định dạng tiền tệ VNĐ
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Định dạng ngày hiển thị
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    // Hàm trả về màu sắc của trạng thái tương ứng
    const getStatusColor = (statusID) => {
        const sID = Number(statusID);
        switch (sID) {
            case 1: return 'bg-amber-100 text-amber-800'; // Chờ xác nhận
            case 2: return 'bg-blue-100 text-blue-800';  // Đã duyệt
            case 3: return 'bg-sky-100 text-sky-800';   // Đang giao hàng
            case 4: return 'bg-green-100 text-green-800'; // Đã hoàn thành
            case 5: return 'bg-red-100 text-red-800';   // Đã hủy
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Lọc đơn hàng theo trạng thái
    const filteredOrders = activeFilter === 'Tất cả'
        ? orders
        : orders.filter(order => order.statusDescription === activeFilter);

    if (loading && orders.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-surface">
                <div className="flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-primary animate-spin">sync</span>
                    <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest animate-pulse">Đang tải lịch sử mua hàng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-10 bg-surface min-h-screen">
            {/* Breadcrumbs - Trải dài toàn bộ chiều rộng phía trên */}
            <div className="grid grid-cols-12 gap-4"> 
                <div className="col-span-4">
                    <nav className="flex items-center gap-2 text-[10px] text-on-surface-variant mb-6 font-bold uppercase tracking-widest">
                        <Link className="hover:text-primary transition-colors" to="/">Trang chủ</Link>
                        <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                        <span className="text-on-surface-variant/60">Đơn hàng</span>
                        <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                        <span className="text-primary">Lịch sử mua hàng</span>
                    </nav>
                </div>

                <div className="col-span-8 ">
                    <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest pt-1">
                    Tìm thấy tất cả <span className="text-primary font-black">{totalOrders}</span> đơn hàng
                </p>
                </div>
            </div>

            {/* Layout Grid chính */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                {/* Cột Trái: Sidebar (Chiếm 4 cột trên màn hình lớn) */}
                <ProfileSidebar />

                {/* Cột Phải: Nội dung chính (Chiếm 8 cột trên màn hình lớn) */}
                <main className="lg:col-span-8">


                    {/* Khu vực thông báo phản hồi */}
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

                    {/* Bộ lọc đơn hàng */}
                    <section className="mb-6 flex flex-wrap gap-2 items-center">
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-5 py-2 rounded-full font-bold text-[11px] transition-all uppercase tracking-widest ${activeFilter === filter
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'bg-surface-container-high text-on-surface-variant hover:bg-outline-variant'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </section>

                    {/* Danh sách đơn hàng */}
                    <div className="grid grid-cols-1 gap-4">
                        {filteredOrders.length > 0 ? filteredOrders.map(order => {
                            const isCancelled = Number(order.statusID) === 5;
                            const displayItems = order.items ? order.items.slice(0, 3) : [];
                            const extraItemsCount = order.items && order.items.length > 3 ? order.items.length - 3 : 0;

                            return (
                                <div
                                    key={order.orderID}
                                    className={`bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-md transition-all ${isCancelled ? 'opacity-80' : ''
                                        } ${actionLoadingId === order.orderID ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-black text-primary uppercase tracking-wider">#{order.orderID}</span>
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(order.statusID)}`}>
                                                {order.statusDescription}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-on-surface-variant font-bold">
                                            Ngày đặt: <span className="text-on-surface">{formatDate(order.orderTime)}</span>
                                        </p>
                                        <p className={`text-lg font-black text-on-surface ${isCancelled ? 'line-through opacity-50' : ''}`}>
                                            {formatCurrency(order.totalAmount)}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-6 justify-between sm:justify-end">
                                        <div className="flex -space-x-3 overflow-hidden">
                                            {displayItems.map((item, idx) => (
                                                <img
                                                    key={idx}
                                                    src={item.photo || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'}
                                                    className="inline-block h-10 w-10 rounded-lg ring-2 ring-surface object-cover border border-outline-variant/30"
                                                    alt={item.productName}
                                                />
                                            ))}
                                            {extraItemsCount > 0 && (
                                                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-surface-container-highest ring-2 ring-surface text-[10px] font-black text-on-surface-variant">
                                                    +{extraItemsCount}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            {order.statusID === 1 && (
                                                <button
                                                    onClick={() => handleCancelOrder(order.orderID)}
                                                    className="px-4 py-2 rounded-xl border-2 border-red-500 text-red-500 font-black text-[10px] hover:bg-red-50 transition-all uppercase tracking-widest active:scale-95"
                                                >
                                                    Hủy đơn
                                                </button>
                                            )}
                                            <Link to={`/order/order-detail/${order.orderID}`}>
                                                <button className="px-4 py-2 rounded-xl bg-primary text-white font-black text-[10px] hover:bg-primary-container transition-all uppercase tracking-widest active:scale-95 shadow-sm">
                                                    Xem chi tiết
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="py-20 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant border-dashed">
                                <span className="material-symbols-outlined text-outline-variant text-5xl mb-4">history_toggle_off</span>
                                <p className="text-on-surface-variant font-black uppercase text-xs tracking-widest">Không có đơn hàng nào trong trạng thái này</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}