import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function EmployeeDashboard() {
    // --- States quản lý dữ liệu ---
    const [stats, setStats] = useState({
        newOrders: 24,
        pendingOrders: 12,
        unaddressedReviews: 8
    });

    const [orders, setOrders] = useState([
        { id: '#VLC-9082', customer: 'Trần Anh Tuấn', status: 'SHIPPING' },
        { id: '#VLC-9081', customer: 'Lê Minh Trang', status: 'PENDING' },
        { id: '#VLC-9080', customer: 'Nguyễn Hoàng Nam', status: 'SHIPPING' }
    ]);

    const [reviews, setReviews] = useState([
        {
            id: 1,
            productName: 'Giày Chạy Bộ Velocity X',
            rating: 5,
            content: '"Giày rất nhẹ, êm chân và thoáng khí. Rất hài lòng với dịch vụ giao hàng nhanh của shop!"',
            timeAgo: '2 giờ trước'
        },
        {
            id: 2,
            productName: 'Áo Khoác Gió Pro-Tech',
            rating: 4,
            content: '"Màu sắc bên ngoài hơi đậm hơn ảnh một chút nhưng chất liệu vải rất tốt."',
            timeAgo: '5 giờ trước'
        }
    ]);

    useEffect(() => {
        // TODO: Gọi API Backend để lấy dữ liệu thực tế
        // axios.get(`${API_BASE_URL}/employee/stats`).then(res => setStats(res.data))
        // axios.get(`${API_BASE_URL}/employee/recent-orders`).then(res => setOrders(res.data))
        // axios.get(`${API_BASE_URL}/employee/new-reviews`).then(res => setReviews(res.data))
    }, []);

    // --- Handlers ---
    const handleUpdateOrder = (orderId) => {
        alert(`Cập nhật đơn hàng: ${orderId}`);
    };

    const handleReplyReview = (reviewId) => {
        alert(`Phản hồi đánh giá ID: ${reviewId}`);
    };

    // --- Helper hiển thị trạng thái ---
    const renderStatusBadge = (status) => {
        if (status === 'SHIPPING') {
            return (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#003ec7] px-2 py-0.5 rounded-full bg-[#0052ff]/10 border border-[#003ec7]/20">
                    <span className="w-1 h-1 bg-[#003ec7] rounded-full"></span>
                    Đang vận chuyển
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3c4d00] px-2 py-0.5 rounded-full bg-[#c1f100]/20 border border-[#abd600]/40">
                <span className="w-1 h-1 bg-[#506600] rounded-full"></span>
                Đang xử lý
            </span>
        );
    };

    return (
        <div>
            {/* Welcome Header */}
            <header className="mb-5 mt-2">
                <h2 className="text-2xl font-extrabold text-[#191c1d] tracking-tight">Chào buổi sáng, Nam!</h2>
                <p className="text-xs text-[#434656]">Cùng hoàn thành mục tiêu hôm nay nhé.</p>
            </header>

            {/* Thống kê nhanh */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Card 1 - Đơn hàng mới */}
                <div className="bg-white p-4 rounded-lg border border-[#c3c5d9] hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-[#0052ff]/10 rounded-md">
                            <span className="material-symbols-outlined text-lg text-[#003ec7]">add_shopping_cart</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#003ec7] uppercase bg-[#0052ff]/20 px-1.5 py-0.5 rounded">Hôm nay</span>
                    </div>
                    <p className="text-[#434656] font-bold uppercase text-[11px]">Đơn hàng mới</p>
                    <h3 className="text-2xl font-extrabold text-[#191c1d] mt-0.5">{stats.newOrders}</h3>
                </div>

                {/* Card 2 - Đang xử lý */}
                <div className="bg-white p-4 rounded-lg border border-[#c3c5d9] hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-[#c1f100]/20 rounded-md">
                            <span className="material-symbols-outlined text-lg text-[#506600]">pending_actions</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#506600] uppercase bg-[#c1f100]/40 px-1.5 py-0.5 rounded">Cần xử lý</span>
                    </div>
                    <p className="text-[#434656] font-bold uppercase text-[11px]">Đang xử lý</p>
                    <h3 className="text-2xl font-extrabold text-[#191c1d] mt-0.5">{stats.pendingOrders}</h3>
                </div>

                {/* Card 3 - Đánh giá chưa phản hồi */}
                <div className="bg-white p-4 rounded-lg border border-[#c3c5d9] hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-[#ffdad6] rounded-md">
                            <span className="material-symbols-outlined text-lg text-[#ba1a1a]">notification_important</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#ba1a1a] uppercase bg-[#ffdad6]/50 px-1.5 py-0.5 rounded">Ưu tiên</span>
                    </div>
                    <p className="text-[#434656] font-bold uppercase text-[11px]">Đánh giá chưa phản hồi</p>
                    <h3 className="text-2xl font-extrabold text-[#191c1d] mt-0.5">{stats.unaddressedReviews}</h3>
                </div>
            </section>

            {/* Khu vực làm việc chính */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Recent Orders Section */}
                <section className="lg:col-span-2 bg-white rounded-lg border border-[#c3c5d9] overflow-hidden">
                    <div className="p-4 flex justify-between items-center border-b border-[#c3c5d9]">
                        <h3 className="text-base font-extrabold text-[#191c1d]">Đơn hàng gần đây</h3>
                        <Link to="/employee/orders-management" className="text-[#003ec7] font-bold text-xs hover:underline">
                            Xem tất cả
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="bg-[#f3f4f5] text-[#434656] text-[11px] uppercase font-bold tracking-wider">
                                    <th className="px-4 py-2.5">Mã Đơn</th>
                                    <th className="px-4 py-2.5">Khách hàng</th>
                                    <th className="px-4 py-2.5">Trạng thái</th>
                                    <th className="px-4 py-2.5 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#c3c5d9]">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-[#f3f4f5] transition-colors">
                                        <td className="px-4 py-2.5 font-bold text-[#003ec7]">{order.id}</td>
                                        <td className="px-4 py-2.5 font-medium">{order.customer}</td>
                                        <td className="px-4 py-2.5">{renderStatusBadge(order.status)}</td>
                                        <td className="px-4 py-2.5 text-right">
                                            <button
                                                onClick={() => handleUpdateOrder(order.id)}
                                                className="text-[11px] font-bold bg-[#003ec7] text-white px-3 py-1.5 rounded hover:bg-[#0052ff] transition-all shadow-sm active:scale-95"
                                            >
                                                Cập nhật
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* New Reviews List Section */}
                <section className="bg-white rounded-lg border border-[#c3c5d9] flex flex-col">
                    <div className="p-4 border-b border-[#c3c5d9] flex justify-between items-center">
                        <h3 className="text-base font-extrabold text-[#191c1d]">Đánh giá mới</h3>
                        <Link to="/employee/reviews" className="text-[#003ec7] font-bold text-xs hover:underline">
                            Xem tất cả
                        </Link>
                    </div>
                    <div className="flex-1 overflow-y-auto max-h-[360px] p-3 space-y-3 scrollbar-thin scrollbar-thumb-[#c3c5d9] scrollbar-track-transparent">
                        {reviews.map((review) => (
                            <div key={review.id} className="p-3 bg-[#f3f4f5] rounded-md border border-[#c3c5d9]/50 text-xs">
                                <div className="flex justify-between items-start mb-1.5">
                                    <span className="text-xs font-bold text-[#434656] truncate w-2/3">{review.productName}</span>
                                    <div className="flex text-[#506600] bg-[#c1f100]/10 p-0.5 rounded">
                                        {[...Array(5)].map((_, i) => (
                                            <span
                                                key={i}
                                                className="material-symbols-outlined text-[12px]"
                                                style={i < review.rating ? { fontVariationSettings: "'FILL' 1" } : {}}
                                            >
                                                star
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-[#191c1d] leading-relaxed mb-2 text-[13px]">{review.content}</p>
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-[#434656] italic">{review.timeAgo}</span>
                                    <button
                                        onClick={() => handleReplyReview(review.id)}
                                        className="flex items-center gap-0.5 font-bold text-[#003ec7] hover:text-[#0052ff] transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-xs">reply</span> Phản hồi
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}