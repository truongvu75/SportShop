import React, { useState, useEffect, useCallback } from 'react';
import orderApi from '../../api/orderApi';
import { Link } from 'react-router-dom';

// =============================================================
// MAPPING: statusID (Backend) → Thông tin hiển thị (Frontend)
// 1: Chờ xác nhận | 2: Đã duyệt | 3: Đang giao hàng | 4: Đã hoàn thành | 5: Đã hủy
// =============================================================
const STATUS_MAP = {
    1: { label: 'Chờ xác nhận', key: 'PENDING', icon: 'schedule', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200', isDot: true, dotClass: 'bg-blue-500 animate-pulse' },
    2: { label: 'Đã duyệt', key: 'APPROVED', icon: 'task_alt', badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200', isDot: false },
    3: { label: 'Đang giao', key: 'SHIPPING', icon: 'local_shipping', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200', isDot: false },
    4: { label: 'Đã hoàn thành', key: 'DELIVERED', icon: 'verified', badgeClass: 'bg-green-50 text-green-700 border-green-200', isDot: false },
    5: { label: 'Đã hủy', key: 'CANCELLED', icon: 'cancel', badgeClass: 'bg-red-50 text-red-700 border-red-200', isDot: false },
};

const PAGE_SIZE = 10;

// Helpers
const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

const formatCurrency = (amount) => {
    if (amount == null) return '—';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();
};

export default function OrdersManagement() {
    // --- States dữ liệu ---
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // --- Phân trang ---
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    // --- Modal cập nhật trạng thái ---
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(null);
    const [updateError, setUpdateError] = useState('');

    // Fetch danh sách đơn hàng
    const fetchOrders = useCallback(async (page = 1) => {
        setLoading(true);
        setError('');
        try {
            const response = await orderApi.getAllOrders(page, PAGE_SIZE);
            const pageData = response;
            setOrders(pageData.content ?? []);
            setTotalPages(pageData.totalPages ?? 1);
            setTotalElements(pageData.totalElements ?? 0);
            setCurrentPage(page);
        } catch (err) {
            setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders(1);
    }, [fetchOrders]);

    // Handlers
    const handleOpenModal = (order) => {
        // Nếu đơn hàng đã hủy (5) hoặc đã hoàn thành (4) thì tuyệt đối không cho mở modal
        if (order.statusID === 5 || order.statusID === 4) return;
        setSelectedOrder(order);
        setUpdateError('');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
        setUpdateError('');
        setUpdatingStatus(null);
    };

    const handleStatusUpdate = async (statusCode) => {
        if (!selectedOrder) return;
        setUpdatingStatus(statusCode);
        setUpdateError('');

        try {
            const updatedOrder = await orderApi.updateOrderStatus(
                selectedOrder.orderID,
                statusCode
            );

            setOrders(prev =>
                prev.map(o => o.orderID === selectedOrder.orderID ? updatedOrder : o)
            );
            handleCloseModal();
        } catch (err) {
            setUpdateError(err.response?.data?.message || "Cập nhật thất bại");
        } finally {
            setUpdatingStatus(null);
        }
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        fetchOrders(page);
    };

    const renderStatusBadge = (statusID) => {
        const s = STATUS_MAP[statusID];
        if (!s) return <span className="text-xs text-[#434656]">—</span>;
        const baseClass = 'inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border';
        return (
            <span className={`${baseClass} ${s.badgeClass}`}>
                {s.isDot
                    ? <span className={`h-1 w-1 rounded-full ${s.dotClass}`}></span>
                    : <span className="material-symbols-outlined text-[11px]">{s.icon}</span>
                }
                {s.label}
            </span>
        );
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;
        const pages = [];
        const WINDOW = 2;
        const start = Math.max(1, currentPage - WINDOW);
        const end = Math.min(totalPages, currentPage + WINDOW);

        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push('...');
        }
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < totalPages) {
            if (end < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }

        return (
            <div className="px-5 py-3 bg-[#f3f4f5] flex justify-between items-center border-t border-[#c3c5d9]">
                <span className="text-[10px] text-[#434656] font-bold uppercase">
                    Hiển thị {orders.length} / {totalElements} đơn hàng
                </span>
                <div className="flex gap-1 items-center">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-7 w-7 rounded border border-[#c3c5d9] flex items-center justify-center hover:bg-[#edeeef] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>

                    {pages.map((p, idx) =>
                        p === '...' ? (
                            <span key={`ellipsis-${idx}`} className="h-7 px-1 flex items-center text-xs text-[#434656]">…</span>
                        ) : (
                            <button
                                key={p}
                                onClick={() => handlePageChange(p)}
                                className={`h-7 w-7 rounded border font-bold text-xs transition-colors ${p === currentPage
                                    ? 'bg-[#003ec7] text-white border-[#003ec7]'
                                    : 'border-[#c3c5d9] hover:bg-[#edeeef]'
                                    }`}
                            >
                                {p}
                            </button>
                        )
                    )}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-7 w-7 rounded border border-[#c3c5d9] flex items-center justify-center hover:bg-[#edeeef] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div>
            {/* Tiêu đề trang */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-5 mt-2">
                <div>
                    <h2 className="text-2xl font-extrabold text-[#191c1d] tracking-tight">Quản lý Đơn hàng</h2>
                    <p className="text-xs text-[#434656] mt-0.5">Xem xét, theo dõi và quản lý toàn bộ vòng đời giao dịch của khách hàng.</p>
                </div>

                {/* Bộ lọc */}
                <div className="flex flex-wrap gap-3 items-end opacity-60 pointer-events-none select-none" title="Tính năng lọc sẽ được bật khi Backend hỗ trợ">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase text-[#434656] ml-0.5">Lọc theo trạng thái</label>
                        <select className="bg-white border border-[#c3c5d9] text-xs rounded-lg px-3 py-1.5 text-[#191c1d] outline-none cursor-not-allowed">
                            <option>Tất cả</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase text-[#434656] ml-0.5">Ngày đặt hàng</label>
                        <div className="flex items-center bg-white border border-[#c3c5d9] rounded-lg px-2.5 py-1.5">
                            <span className="material-symbols-outlined text-xs text-[#434656] mr-1.5">calendar_today</span>
                            <input className="bg-transparent border-none p-0 text-xs focus:ring-0 outline-none cursor-not-allowed" type="date" readOnly />
                        </div>
                    </div>
                    <button className="bg-[#003ec7] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 cursor-not-allowed shadow-sm">
                        <span className="material-symbols-outlined text-xs">filter_list</span>
                        Lọc
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-xs">
                    <span className="material-symbols-outlined text-base">error</span>
                    <span>{error}</span>
                    <button onClick={() => fetchOrders(currentPage)} className="ml-auto font-bold underline hover:no-underline">Thử lại</button>
                </div>
            )}

            {/* Orders Table */}
            <div className="bg-white border border-[#c3c5d9] rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-[#f3f4f5] text-[#434656] text-[11px] uppercase font-bold tracking-wider border-b border-[#c3c5d9]">
                                <th className="px-5 py-2.5">Mã đơn</th>
                                <th className="px-5 py-2.5">Ngày đặt</th>
                                <th className="px-5 py-2.5">Khách hàng</th>
                                <th className="px-5 py-2.5 text-right">Tổng tiền</th>
                                <th className="px-5 py-2.5">Thanh toán</th>
                                <th className="px-5 py-2.5">Trạng thái</th>
                                <th className="px-5 py-2.5 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#c3c5d9]">
                            {loading && Array.from({ length: 5 }).map((_, i) => (<tr key={`skel-${i}`} className="animate-pulse">
                                {Array.from({ length: 7 }).map((__, j) => (
                                    <td key={j} className="px-5 py-3">
                                        <div className="h-3 bg-[#edeeef] rounded w-full"></div>
                                    </td>
                                ))}
                            </tr>
                            ))}

                            {!loading && orders.map((order) => {
                                // Kiểm tra xem đơn hàng đã đóng (Hủy hoặc Hoàn thành) chưa
                                const isOrderClosed = order.statusID === 4 || order.statusID === 5;

                                return (
                                    <tr key={order.orderID} className={`hover:bg-blue-200 transition-all duration-200 ${order.statusID === 5 ? 'bg-red-100' : 'bg-green-50'}`}>
                                        <td className="px-5 py-3 font-bold text-[#003ec7]">
                                            <Link to={`/employee/order/${order.orderID}`}>#{order.orderID}</Link>
                                        </td>
                                        <td className="px-5 py-3 text-[#434656]">{formatDate(order.orderTime)}</td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-[#c1f100]/30 text-[#546b00] flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                                    {getInitials(order.customerName)}
                                                </div>
                                                <span className="text-[#191c1d] font-semibold">{order.customerName || '—'}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-right font-bold text-[#191c1d]">{formatCurrency(order.totalAmount)}</td>
                                        <td className="px-5 py-3"><span className="px-2 py-0.5 rounded bg-[#edeeef] text-[11px] text-[#434656]">{order.payMethod || '—'}</span></td>
                                        <td className="px-5 py-3">{renderStatusBadge(order.statusID)}</td>
                                        <td className="px-5 py-3 text-right">
                                            <button
                                                onClick={() => handleOpenModal(order)}
                                                disabled={isOrderClosed}
                                                className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase transition-all shadow-sm
                                                    ${isOrderClosed
                                                        ? 'bg-[#edeeef] text-[#a1a3b5] cursor-not-allowed border border-[#c3c5d9]/40 shadow-none active:scale-100'
                                                        : 'bg-[#c3f400] text-[#161e00] hover:brightness-95 active:scale-95'
                                                    }`}
                                            >
                                                {order.statusID === 4 ? 'Hoàn tất' : order.statusID === 5 ? 'Đã hủy' : 'Cập nhật'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}

                            {!loading && orders.length === 0 && !error && (
                                <tr>
                                    <td colSpan={7} className="px-5 py-10 text-center text-[#434656]">
                                        <span className="material-symbols-outlined text-4xl block mb-2 opacity-40">inbox</span>
                                        <p>Không có đơn hàng nào.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {!loading && renderPagination()}
            </div>

            {/* ============================================================
                Update Status Modal - AN TOÀN LAYOUT & CHẶN LOGIC TRẠNG THÁI
                ============================================================ */}
            {isModalOpen && selectedOrder && (
                <div className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal}></div>

                    <div className="relative block w-[90%] max-w-[420px] mx-auto transform overflow-hidden rounded-xl bg-white p-6 text-left shadow-2xl border border-[#c3c5d9] z-10 animate-in fade-in zoom-in-95 duration-150">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-extrabold text-[#191c1d]" id="modal-title">Cập nhật trạng thái</h3>
                            <button
                                className="material-symbols-outlined text-xl text-[#434656] hover:text-red-500 transition-colors"
                                onClick={handleCloseModal}
                                disabled={updatingStatus !== null}
                            >
                                close
                            </button>
                        </div>

                        <p className="text-xs text-[#434656] mb-4 leading-relaxed">
                            Cập nhật tiến trình đơn hàng <span className="font-bold text-[#003ec7]">#{selectedOrder.orderID}</span> của <span className="font-bold text-[#191c1d]">{selectedOrder.customerName}</span>.
                        </p>

                        {/* Trạng thái hiện tại */}
                        <div className="mb-4 flex items-center gap-2 text-xs text-[#434656] bg-[#f3f4f5] p-2 rounded-lg border border-[#edeeef]">
                            <span className="font-medium">Trạng thái hiện tại:</span>
                            {renderStatusBadge(selectedOrder.statusID)}
                        </div>

                        {/* Danh sách các nút option */}
                        <div className="grid grid-cols-1 gap-2">
                            {Object.entries(STATUS_MAP).map(([code, s]) => {
                                const statusCode = parseInt(code);
                                const isCurrent = statusCode === selectedOrder.statusID;
                                const isLoading = updatingStatus === statusCode;
                                const isCancelOption = statusCode === 5;

                                // LOGIC CHẶN CHUYỂN NGƯỢC TRẠNG THÁI:
                                // Một trạng thái bị khóa (disabled) khi:
                                // 1. Nó chính là trạng thái hiện tại.
                                // 2. Nó là một trạng thái trong tiến trình cũ (nhỏ hơn trạng thái hiện tại) 
                                //    Ví dụ: Đang ở Đang Giao (3) thì không thể chọn Chờ Xác Nhận (1) hay Đã Duyệt (2).
                                const isPastStatus = statusCode < selectedOrder.statusID;
                                const isDisableOption = isCurrent || isPastStatus;

                                return (
                                    <button
                                        key={code}
                                        onClick={() => handleStatusUpdate(statusCode)}
                                        disabled={isDisableOption || updatingStatus !== null}
                                        className={`flex items-center justify-between p-3 border rounded-lg transition-all text-xs font-semibold group
                                            ${isDisableOption
                                                ? 'bg-[#f8f9fa] border-[#e3e5eb] text-[#a1a3b5] cursor-not-allowed opacity-50 shadow-none'
                                                : isCancelOption
                                                    ? 'border-[#c3c5d9] hover:bg-red-50 hover:text-red-700 hover:border-red-200 active:bg-red-100'
                                                    : 'border-[#c3c5d9] hover:bg-[#0052ff] hover:text-white hover:border-[#0052ff] active:scale-[0.99]'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            {isLoading ? (
                                                <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                                            ) : (
                                                <span className="material-symbols-outlined text-base">{s.icon}</span>
                                            )}
                                            <span>{s.label}</span>
                                            {isCurrent && <span className="text-[10px] font-normal italic opacity-80">(hiện tại)</span>}
                                            {isPastStatus && !isCurrent && <span className="text-[10px] font-normal italic opacity-60">(đã qua)</span>}
                                        </div>
                                        {!isDisableOption && !isLoading && (
                                            <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0">
                                                chevron_right
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {updateError && (
                            <div className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-xs">
                                <span className="material-symbols-outlined text-sm">error</span>
                                <span className="font-medium">{updateError}</span>
                            </div>
                        )}

                        {/* Footer nút đóng */}
                        <div className="mt-5 pt-3 border-t border-[#c3c5d9]/50 flex justify-end">
                            <button
                                onClick={handleCloseModal}
                                disabled={updatingStatus !== null}
                                className="px-4 py-2 bg-[#edeeef] hover:bg-[#e1e2e4] text-[#434656] font-bold text-xs uppercase rounded-lg transition-colors"
                            >
                                Hủy bỏ
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}