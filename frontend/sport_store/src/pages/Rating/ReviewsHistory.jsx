import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfileSidebar from '../../components/layout/ProfileSidebar';
import ratingApi from '../../api/ratingApi';

export default function ReviewsHistory() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    //--- Các state cho chức năng Sửa
    const [isEditingId, setIsEditingId] = useState(null); //Id của hàng đang được sửa
    const [editComment, setEditComment] = useState(""); //Nội dung đánh giá mới
    const [editStar, setEditStar] = useState(5); //Số sao mới

    const loadReviews = async () => {
        try {
            //Thiết lập trạng thái loading 
            setLoading(true);
            setError('');

            const data = await ratingApi.getAllRatingsByCustomer();

            if (data) {
                setReviews(data);
                console.log('Nhận dữ liệu thành công!!Số lượng phần tử: ' + data.length);
                data.forEach((e, index) => {
                    console.log(`Phần tử thứ ${index + 1}: `);
                    console.log(`${e.productName}`);
                });
            }
        } catch (error) {
            console.log('Lỗi fetch data: ', error);
            setError('Không thể tải dữ liệu! Hãy thử lại sau!!!')
        } finally {
            setLoading(false);  //Tắt hiệu ứng Loading dù thành công hay thất bại
        }
    };

    //useEffect kích hoạt hàm chạy tự động khi vào trang hay có sự thay đổi của biến được thêm
    useEffect(() => {
        loadReviews();
    }, []);

    const renderStars = (starCount) => {
        return "⭐".repeat(starCount);
    }

    // =================================
    // HÀM XÓA ĐÁNH GIÁ
    // =================================
    const handleDelete = async (ratingID) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này không?')) return;

        try {
            //API Xóa đánh giá
            await ratingApi.deleteRating(ratingID);

            //Cập nhật State tại chỗ: Lọc bỏ phần tử vừa xóa ra khỏi mảng
            setReviews(prevReviews => prevReviews.filter(review => review.ratingID !== ratingID));

            alert('Xóa đánh giá thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa đánh giá: ', error);
            alert('Xóa đánh giá thất bại. Vui lòng thử lại sau!');
        }
    };

    // =============================
    // HÀM LƯU ĐÁNH GIÁ SAU KHI SỬA ĐÁNH GIÁ
    // =============================
    const handleSaveEdit = async (ratingID) => {
        if (!editComment.trim()) {
            alert('Nội dung đánh giá không được để trống!!');
            return;
        }

        try {
            //Gọi API Sửa đánh giá
            await ratingApi.updateRating(ratingID, { star: editStar, comment: editComment });

            //Cập nhật State tại chỗ sử dụng .map()
            setReviews(prevReviews => prevReviews.map(review => review.ratingID === ratingID ? {
                ...review,
                star: editStar,
                comment: editComment,
                createdTime: new Date().toLocaleString()
            } : review));
            setIsEditingId(null);
            alert('Cập nhật đánh giá thành công!');
        } catch (error) {
            console.error("Lỗi khi cập nhật:", err);
            alert("Cập nhật thất bại!");
        }
    };

    //Hàm kích hoạt chế độ sửa khi bấm vào nút Edit
    const startEdit = (review) => {
        setIsEditingId(review.ratingID);
        setEditComment(review.comment);
        setEditStar(review.star);
    };

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-10 bg-surface min-h-screen">
            {/* Breadcrumbs - Compact */}
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-10'>
                <nav className="lg:col-span-4 flex items-center gap-2 text-[10px] text-on-surface-variant mb-8 font-bold uppercase tracking-widest">
                    <Link className="hover:text-primary transition-colors" to="/">Trang chủ</Link>
                    <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                    <Link className="hover:text-primary transition-colors" to="/profile">Hồ sơ</Link>
                    <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                    <span className="text-primary">Lịch sử đánh giá</span>
                </nav>

                <h2 className="lg:col-span-8 text-xl font-bold uppercase text-gray-600 tracking-wide mb-4">
                    Lịch sử đánh giá của bạn
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Sidebar - Component dùng chung */}
                <ProfileSidebar />

                {/* Nội dung chính */}
                <main className="lg:col-span-8 space-y-4">
                    {reviews.length > 0 ? (
                        reviews.map((review) => {
                            const isCurrentEditing = isEditingId === review.ratingID;   //

                            return (
                                <div key={review.ratingID} className='p-5 bg-white border border-gray-200 rounded-xl shadow-sm transition-all hover:shadow-md'>

                                    {/** Hàng đầu: Tên sản phẩm & số sao & Cụm nút chức năng */}
                                    <div className='flex flex-wrap justify-between items-start gap-2 mb-2'>
                                        <h4 className='font-bold text-gray-900 text-base'>
                                            {review.productName}
                                        </h4>

                                        <div className="flex items-center gap-2">
                                            {/* Hiển thị số sao dựa trên trạng thái (Đang sửa hay đang hiển thị) */}
                                            {isCurrentEditing ? (
                                                <select
                                                    value={editStar}
                                                    onChange={(e) => setEditStar(Number(e.target.value))}
                                                    className="text-sm border rounded px-1 py-0.5 bg-amber-50 font-medium text-amber-700"
                                                >
                                                    {[5, 4, 3, 2, 1].map(num => (
                                                        <option key={num} value={num}>{num} ⭐</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className='text-sm px-2 py-0.5 rounded text-amber-700 font-medium bg-amber-50'>
                                                    {renderStars(review.star)}
                                                </span>
                                            )}

                                            {/* Cụm nút điều khiển hành động */}
                                            {isCurrentEditing ? (
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => handleSaveEdit(review.ratingID)} className="text-green-600 hover:text-green-800" title="Lưu">
                                                        <span className='material-symbols-outlined text-xl'>check_circle</span>
                                                    </button>
                                                    <button onClick={() => setIsEditingId(null)} className="text-gray-500 hover:text-gray-700" title="Hủy">
                                                        <span className='material-symbols-outlined text-xl'>cancel</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <button onClick={() => startEdit(review)} className="text-blue-600 hover:text-blue-800" title="Sửa">
                                                        <span className='material-symbols-outlined px-1 text-xl'>edit_square</span>
                                                    </button>
                                                    <button onClick={() => handleDelete(review.ratingID)} className="text-red-600 hover:text-red-800" title="Xóa">
                                                        <span className='material-symbols-outlined text-xl'>delete</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/** Hàng thứ 2: Thời gian đánh giá */}
                                    <div className='text-xs text-gray-400 mb-3 flex items-center gap-1'>
                                        <span>Người đánh giá: <strong>{review.customerName}</strong></span>
                                        <span>•</span>
                                        <span>{review.createdTime}</span>
                                    </div>

                                    {/** Hàng thứ 3: Nội dung đánh giá (Đổi sang textarea nếu đang bật chỉnh sửa) */}
                                    {isCurrentEditing ? (
                                        <textarea
                                            value={editComment}
                                            onChange={(e) => setEditComment(e.target.value)}
                                            className="w-full text-sm p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 italic text-gray-700"
                                            rows="3"
                                        />
                                    ) : (
                                        <p className='text-gray-700 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100 italic'>
                                            "{review.comment}"
                                        </p>
                                    )}

                                    {/** Phản hồi của nhân viên */}
                                    {review.reply ? (
                                        <div className='mt-4 p-3 bg-blue-50/60 border-l-4 border-blue-500 rounded-r-lg space-y-1'>
                                            <div className='flex items-center justify-between text-xs font-semibold text-blue-800'>
                                                <span>Phản hồi bởi nhân viên: {review.employeeName}</span>
                                                <span className='text-gray-400 font-normal'>{review.replyTime}</span>
                                            </div>
                                            <p className='text-xs text-gray-600 font-medium'>{review.reply}</p>
                                        </div>
                                    ) : (
                                        <div className='mt-3 text-xs text-gray-400 italic'>
                                            Chưa có phản hồi về đánh giá này!
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p className='text-center text-gray-600 py-6'>Bạn chưa có đánh giá nào.</p>
                    )}
                </main>
            </div>
        </div>
    );
}