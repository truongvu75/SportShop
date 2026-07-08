import React, { useEffect, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import ratingApi from '../../api/ratingApi';

// ==========================================
// COMPONENT CON: RATING CARD
// ==========================================
const RatingCard = ({
    ratingID,
    productName,
    star,
    comment,
    createdTime,
    customerName,
    reply,
    replyTime,
    employeeName,
    replyValue,
    onTextareaChange,
    onSendResponse, //Hàm 
    onEditResponse,
    isEditing
}) => {
    return (
        <div className={`glass-panel rounded-2xl p-6 flex flex-col justify-between gap-4 border transition-all duration-300 shadow-sm ${star <= 2
                ? 'border-red-200 bg-red-50/70 hover:shadow-red-800'
                : 'border-outline-variant bg-white hover:shadow-xl hover:shadow-primary/5'
            }`}>
            <div>
                {/* Header: Thông tin khách hàng & Số sao */}
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary bg-gray-200 flex-shrink-0">
                            <img
                                alt="Customer Profile"
                                className="w-full h-full object-cover"
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(customerName)}`}
                            />
                        </div>
                        <div>
                            <h3 className="font-bold text-on-surface text-base">{customerName}</h3>
                            <p className="text-xs text-on-surface-variant">
                                {new Date(createdTime).toLocaleDateString('vi-VN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Hiển thị số sao đánh giá */}
                    <div className="flex gap-0.5">
                        {[...Array(5)].map((_, index) => {
                            const isFilled = index < star;
                            return (
                                <span
                                    key={index}
                                    className="material-symbols-outlined text-lg select-none"
                                    style={{
                                        fontVariationSettings: `'FILL' ${isFilled ? 1 : 0}`,
                                        color: isFilled ? '#c1f100' : '#c3c5d9'
                                    }}
                                >
                                    star
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* Tag thông tin sản phẩm */}
                <div className="p-3 rounded-xl border mb-3 bg-surface-container-low border-outline-variant/30">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest block mb-0.5 text-primary">
                        Sản phẩm
                    </span>
                    <h4 className="font-bold text-sm text-on-surface">{productName}</h4>
                </div>

                {/* Nội dung đánh giá */}
                <div className="p-4 rounded-xl border bg-surface-container-low border-outline-variant/30 min-h-[70px]">
                    <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-line">
                        {comment || <span className="italic text-gray-400">Khách hàng không để lại bình luận văn bản.</span>}
                    </p>
                </div>
            </div>

            {/* Khu vực phản hồi (Luôn nằm ở đáy Card) */}
            <div>
                {reply && !isEditing ? (
                    /* Trường hợp 1: Đã có phản hồi và không ở chế độ sửa */
                    <div className="p-4 rounded-xl border-l-4 bg-secondary-container/10 border-secondary">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-widest text-secondary">
                                    VELOCITY Support ({employeeName || 'Nhân viên'})
                                </span>
                            </div>
                            {replyTime && (
                                <span className="text-[10px] text-on-surface-variant italic">
                                    {new Date(replyTime).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-on-surface-variant italic whitespace-pre-line">"{reply}"</p>
                        <button
                            onClick={() => onEditResponse(ratingID, reply)}
                            className="mt-3 text-xs font-bold text-primary hover:underline flex items-center gap-1 transition-colors"
                        >
                            Sửa phản hồi
                            <span className="material-symbols-outlined text-xs">edit</span>
                        </button>
                    </div>
                ) : (
                    /* Trường hợp 2: Chưa phản hồi HOẶC Đang trong chế độ Sửa phản hồi */
                    <div className={`pt-2 ${!isEditing ? 'border-t border-outline-variant/20' : ''}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-sm text-primary">
                                {isEditing ? 'edit_note' : 'reply'}
                            </span>
                            <span className="text-xs font-bold uppercase tracking-widest text-primary">
                                {isEditing ? 'Đang chỉnh sửa phản hồi' : 'Chờ phản hồi'}
                            </span>
                        </div>

                        <textarea
                            value={replyValue}
                            onChange={(e) => onTextareaChange(ratingID, e.target.value)}
                            className="w-full bg-surface-container border rounded-xl text-sm p-3 min-h-[100px] font-body focus:ring-1 outline-none transition-all border-outline-variant focus:ring-primary focus:border-primary"
                            placeholder={`Nhập nội dung phản hồi cho ${customerName}...`}
                        />

                        <div className="flex justify-end items-center mt-2">
                            <div className="flex gap-2">
                                {isEditing && (
                                    <button
                                        onClick={() => onEditResponse(ratingID, null)}
                                        className="px-4 py-2 rounded-lg font-bold text-sm text-gray-500 hover:bg-gray-100 transition-all"
                                    >
                                        Hủy
                                    </button>
                                )}
                                <button
                                    onClick={() => onSendResponse(ratingID)}
                                    disabled={!replyValue.trim()}
                                    className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${!replyValue.trim()
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-primary text-white hover:opacity-90 active:scale-95'
                                        }`}
                                >
                                    {isEditing ? 'Cập nhật' : 'Gửi phản hồi'}
                                    <span className="material-symbols-outlined text-sm">send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ==========================================
// COMPONENT CHÍNH: CUSTOMER FEEDBACK
// ==========================================
export default function CustomerFeedback() {
    const context = useOutletContext();
    const globalSearchQuery = context?.searchQuery || '';

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [replyInputs, setReplyInputs] = useState({});
    const [editingReviewId, setEditingReviewId] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const size = parseInt(searchParams.get('size') || '10', 10);
    const currentStatus = searchParams.get('status') || 'ALL';

    const loadRatings = async () => {
        try {
            setLoading(true);
            setError('');

            const params = {
                page: page - 1,
                size: size,
                status: currentStatus
            };

            const response = await ratingApi.getAllRatings(params);

            if (response && response.content) {
                setReviews(response.content);

                const initialInputs = {};
                response.content.forEach(rev => {
                    initialInputs[rev.ratingID] = '';
                });
                setReplyInputs(prev => ({ ...initialInputs, ...prev }));
            } else {
                setReviews([]);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách đánh giá: ", error);
            setError("Không thể kết nối tới máy chủ. Vui lòng thử lại sau!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRatings();
    }, [page, size, currentStatus]);

    const handleTabChange = (statusType) => {
        setSearchParams({
            page: '1',
            size: size.toString(),
            status: statusType
        });
        setEditingReviewId(null);
    };

    const handleTextareaChange = (id, value) => {
        setReplyInputs(prev => ({ ...prev, [id]: value }));
    };

    const handleEditResponse = (id, existingReplyText) => {
        if (existingReplyText === null) {
            setEditingReviewId(null);
        } else {
            setEditingReviewId(id);     //Lấy ID của reply hiện tại đang được edit
            setReplyInputs(prev => ({ ...prev, [id]: existingReplyText }));     //Set nội dung reply vào replyInput
        }
    };

    const handleSendResponse = async (id) => {  //Hàm gửi, cập nhật phản hồi vào state và lưu vào DB
        const textToSubmit = replyInputs[id];   //Lấy nội dung từ ô phản hồi
        if (!textToSubmit || !textToSubmit.trim()) return;

        try {
            const payload = {
                replyText: textToSubmit.trim()
            };

            const response = await ratingApi.replyRating(id, payload.replyText);    //Lưu phản hồi vào DB

            setReviews(prevReviews =>
                prevReviews.map(rev => {
                    if (rev.ratingID === id) {  //Nếu reply gặp đúng reply vừa phản hồi thì set các thuộc tính vừa reply vào!!
                        return {
                            ...rev,
                            reply: textToSubmit.trim(),
                            replyTime: new Date().toISOString(),
                            employeeName: response?.employeeName || 'Bạn (Hệ thống)'
                        };
                    }
                    return rev;
                })
            );

            setReplyInputs(prev => ({ ...prev, [id]: '' }));
            setEditingReviewId(null);

            alert(editingReviewId === id ? "Cập nhật phản hồi thành công!" : "Gửi phản hồi thành công!");
        } catch (error) {
            console.error("Gửi phản hồi thất bại:", error);
            alert("Có lỗi xảy ra trong quá trình gửi phản hồi. Vui lòng thử lại!");
        }
    };

    const filteredReviews = reviews.filter(rev => {
        if (!globalSearchQuery) return true;

        const searchLower = globalSearchQuery.toLowerCase();
        return (
            rev.customerName?.toLowerCase().includes(searchLower) ||
            rev.productName?.toLowerCase().includes(searchLower) ||
            rev.comment?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="w-full max-w-7xl mx-auto px-4 md:px-10 pt-6 pb-16 font-body">
            {/* Header section */}
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-[#191c1d] mb-2">Đánh giá khách hàng</h1>
                    <p className="text-[#434656] text-sm max-w-2xl">
                        Theo dõi chất lượng sản phẩm và tương tác với cộng đồng khách hàng để duy trì tiêu chuẩn chất lượng VELOCITY.
                    </p>
                </div>

                {/* Bộ lọc Tab điều hướng */}
                <div className="flex items-center bg-[#e7e8e9] p-1 rounded-xl w-fit shadow-inner">
                    {[
                        { key: 'ALL', label: 'Tất cả' },
                        { key: 'UNREPLIED', label: 'Chưa phản hồi' },
                        { key: 'REPLIED', label: 'Đã phản hồi' }
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all duration-150 ${currentStatus === tab.key
                                    ? 'bg-white text-[#003ec7] shadow-sm scale-100'
                                    : 'text-[#434656] hover:bg-[#e1e3e4]/70'
                                }`}
                            onClick={() => handleTabChange(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* Khối hiển thị các trạng thái hệ thống: Loading / Error */}
            {loading && (
                <div className="flex flex-col justify-center items-center py-20 text-[#434656] gap-3">
                    <span className="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
                    <p className="font-medium text-sm animate-pulse">Đang đồng bộ dữ liệu hệ thống VELOCITY...</p>
                </div>
            )}

            {!loading && error && (
                <div className="text-center py-12 text-error bg-error-container/20 rounded-xl p-6 border border-error/20 max-w-xl mx-auto">
                    <span className="material-symbols-outlined text-4xl mb-2 text-red-600">cloud_off</span>
                    <p className="font-bold text-red-700">{error}</p>
                    <button onClick={loadRatings} className="mt-4 px-4 py-2 bg-white border border-red-300 rounded-lg text-xs font-bold text-red-700 hover:bg-red-50">
                        Thử kết nối lại
                    </button>
                </div>
            )}

            {/* HIỂN THỊ DANH SÁCH KHÁCH HÀNG ĐÁNH GIÁ */}
            {!loading && !error && filteredReviews.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    {filteredReviews.map(review => (
                        <RatingCard
                            key={review.ratingID}
                            {...review}
                            replyValue={replyInputs[review.ratingID] || ''}
                            isEditing={editingReviewId === review.ratingID}
                            onTextareaChange={handleTextareaChange}
                            onSendResponse={handleSendResponse}
                            onEditResponse={handleEditResponse}
                        />
                    ))}
                </div>
            )}

            {/* Trường hợp không có dữ liệu phù hợp */}
            {!loading && !error && filteredReviews.length === 0 && (
                <div className="text-center py-16 text-[#434656] bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <span className="material-symbols-outlined text-5xl block mb-2 opacity-40">search_off</span>
                    <p className="font-semibold text-base">Không tìm thấy kết quả</p>
                    <p className="text-xs text-on-surface-variant mt-1 max-w-xs mx-auto">
                        {globalSearchQuery
                            ? `Không tìm thấy đánh giá nào có chứa từ khóa "${globalSearchQuery}". Vui lòng thử từ khóa khác.`
                            : 'Danh sách mục phân loại này hiện đang trống.'}
                    </p>
                </div>
            )}
        </div>
    );
}