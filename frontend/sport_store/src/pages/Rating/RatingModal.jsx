import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ratingApi from '../../api/ratingApi';

/**
 * Modal cho phép khách hàng gửi hoặc chỉnh sửa đánh giá sản phẩm
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - productID: number
 * - productName: string
 * - existingRating: object | null (nếu là chế độ sửa)
 * - onSuccess: (rating) => void
 */
export default function RatingModal({ isOpen, onClose, productID, productName, existingRating, onSuccess }) {
    const [star, setStar] = useState(existingRating?.star || 0);
    const [hoverStar, setHoverStar] = useState(0);
    const [comment, setComment] = useState(existingRating?.comment || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const MAX_COMMENT_LENGTH = 500;
    const isEditMode = !!existingRating;

    // Reset form khi modal mở lại
    useEffect(() => {
        if (isOpen) {
            setStar(existingRating?.star || 0);
            setComment(existingRating?.comment || '');
            setError('');
        }
    }, [isOpen, existingRating]);

    if (!isOpen) return null;

    const starLabels = ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Rất tốt'];

    const handleSubmit = async () => {
        setError('');

        if (star === 0) {
            setError('Vui lòng chọn số sao đánh giá!');
            return;
        }
        if (!comment.trim()) {
            setError('Vui lòng nhập nội dung đánh giá!');
            return;
        }
        if (comment.length > MAX_COMMENT_LENGTH) {
            setError(`Nội dung không được vượt quá ${MAX_COMMENT_LENGTH} ký tự!`);
            return;
        }

        try {
            setLoading(true);
            let result;
            if (isEditMode) {
                result = await ratingApi.updateRating(existingRating.ratingID, { star, comment: comment.trim() });
            } else {
                result = await ratingApi.submitRating({ productID, star, comment: comment.trim() });
            }
            onSuccess(result);
            onClose();
        } catch (err) {
            const msg = err.response?.data?.message;
            setError(typeof msg === 'string' ? msg : 'Gửi đánh giá thất bại. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    const displayStar = hoverStar || star;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        >
            {/* SỬA TẠI ĐÂY: 
              - Thêm z-[9999] lên layout bao để đè mọi layout khác.
              - Thay đổi kích thước từ "w-full max-w-lg mx-4" thành "w-[90vw] md:w-[500px] min-w-[320px] md:min-w-[500px]"
              - Thêm "flex flex-col" để đảm bảo ruột bên trong không dính layout inline dòng.
            */}
            <div
                className="bg-white rounded-2xl shadow-2xl w-[90vw] md:w-[500px] min-w-[320px] md:min-w-[500px] overflow-hidden flex flex-col font-['Lexend']"
                onClick={(e) => e.stopPropagation()} // Chống đóng modal nhầm khi nhấn vào vùng trắng
            >

                {/* Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-6 py-5 flex items-center justify-between flex-shrink-0">
                    <div className="min-w-0 flex-1 pr-4">
                        <h2 className="text-white font-black text-sm uppercase tracking-widest block whitespace-nowrap">
                            {isEditMode ? 'Chỉnh sửa đánh giá' : 'Đánh giá sản phẩm'}
                        </h2>
                        <p className="text-gray-300 text-xs mt-0.5 font-medium truncate w-full">{productName}</p>
                    </div>
                    <button
                        id="rating-modal-close-btn"
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0 focus:outline-none"
                    >
                        <span className="material-symbols-outlined text-white text-[18px]">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 flex-1 overflow-y-auto">

                    {/* Chọn số sao */}
                    <div className="text-center">
                        <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
                            Bạn cảm thấy thế nào về sản phẩm này?
                        </p>
                        <div className="flex justify-center gap-2 mb-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                    key={s}
                                    id={`star-btn-${s}`}
                                    type="button"
                                    onClick={() => setStar(s)}
                                    onMouseEnter={() => setHoverStar(s)}
                                    onMouseLeave={() => setHoverStar(0)}
                                    className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                                >
                                    <span
                                        className={`material-symbols-outlined text-4xl transition-colors ${s <= displayStar ? 'text-amber-400' : 'text-gray-200'
                                            }`}
                                        style={{ fontVariationSettings: s <= displayStar ? "'FILL' 1" : "'FILL' 0" }}
                                    >
                                        star
                                    </span>
                                </button>
                            ))}
                        </div>
                        <p className={`text-sm font-black transition-all ${displayStar > 0 ? 'text-amber-500' : 'text-gray-300'}`}>
                            {displayStar > 0 ? `${displayStar}/5 — ${starLabels[displayStar]}` : 'Chưa chọn sao'}
                        </p>
                    </div>

                    {/* Nhập bình luận */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                            Nội dung đánh giá
                        </label>
                        <textarea
                            id="rating-comment-textarea"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Chia sẻ trải nghiệm thực tế của bạn về sản phẩm này..."
                            rows={4}
                            maxLength={MAX_COMMENT_LENGTH}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 focus:outline-none text-sm text-gray-800 resize-none transition-colors font-medium"
                        />
                        <div className="flex justify-end mt-1">
                            <span className={`text-[10px] font-bold ${comment.length > MAX_COMMENT_LENGTH - 50 ? 'text-red-500' : 'text-gray-400'}`}>
                                {comment.length}/{MAX_COMMENT_LENGTH}
                            </span>
                        </div>
                    </div>

                    {/* Thông báo lỗi */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold">
                            <span className="material-symbols-outlined text-[16px]">error</span>
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex gap-3 flex-shrink-0">
                    <button
                        id="rating-cancel-btn"
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors focus:outline-none"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        id="rating-submit-btn"
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl bg-gray-900 text-white font-black text-xs uppercase tracking-widest hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none"
                    >
                        {loading ? (
                            <>
                                <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                                Đang gửi...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[16px]">send</span>
                                {isEditMode ? 'Cập nhật' : 'Gửi đánh giá'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}