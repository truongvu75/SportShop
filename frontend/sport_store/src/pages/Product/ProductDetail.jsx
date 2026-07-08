import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import productApi from '../../api/productApi';
import ratingApi from '../../api/ratingApi';
import { useCart } from '../../context/CartContext';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [colorsList, setColorsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [toast, setToast] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    // Rating states
    const [ratings, setRatings] = useState([]);
    const [avgStar, setAvgStar] = useState(0);
    const [ratingsLoading, setRatingsLoading] = useState(true);

    // Fetch chi tiết sản phẩm và danh sách màu sắc hệ thống song song
    useEffect(() => {
        const fetchDetailData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const [productData, allColors] = await Promise.all([
                    productApi.getProductById(id),
                    productApi.getAllColors()
                ]);

                setProduct(productData);

                // Chuẩn hóa dữ liệu trả về từ API colors
                const extractData = (res) => {
                    if (!res) return [];
                    if (Array.isArray(res)) return res;
                    if (res.content && Array.isArray(res.content)) return res.content;
                    if (res.data && Array.isArray(res.data)) return res.data;
                    if (res.data) {
                        if (res.data.content && Array.isArray(res.data.content)) return res.data.content;
                        if (res.data.data && Array.isArray(res.data.data)) return res.data.data;
                        if (Array.isArray(res.data)) return res.data;
                    }
                    return [];
                };

                const parsedColors = extractData(allColors);
                setColorsList(parsedColors);

                // Cài đặt size và màu mặc định nếu sản phẩm có biến thể
                if (productData && productData.variants && productData.variants.length > 0) {
                    // Ưu tiên chọn biến thể đầu tiên còn hàng, nếu hết sạch hàng thì chọn biến thể đầu tiên
                    const defaultVariant = productData.variants.find(v => v.stock > 0) || productData.variants[0];
                    setSelectedSize(defaultVariant.size);
                    setSelectedColor(defaultVariant.color);
                }
            } catch (err) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", err);
                setError("Không thể tải thông tin chi tiết sản phẩm. Vui lòng thử lại sau!");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDetailData();
        }
    }, [id]);

    // Fetch ratings khi productID thay đổi
    useEffect(() => {
        if (!id) return;
        const fetchRatings = async () => {
            try {
                setRatingsLoading(true);
                const [ratingsData, avgData] = await Promise.all([
                    ratingApi.getRatingsByProduct(id),
                    ratingApi.getAverageStar(id)
                ]);
                setRatings(Array.isArray(ratingsData) ? ratingsData : []);
                setAvgStar(avgData?.averageStar || 0);
            } catch (err) {
                console.error('Lỗi khi tải đánh giá:', err);
            } finally {
                setRatingsLoading(false);
            }
        };
        fetchRatings();
    }, [id]);

    // Trích xuất danh sách kích cỡ duy nhất mà sản phẩm này có trong các biến thể
    const availableSizes = product && product.variants
        ? [...new Set(product.variants.map(v => v.size))].sort((a, b) => {
            if (!isNaN(a) && !isNaN(b)) return Number(a) - Number(b);
            return a.localeCompare(b);
        })
        : [];

    // Trích xuất danh sách màu sắc duy nhất mà sản phẩm này có trong các biến thể
    const availableColors = product && product.variants
        ? [...new Set(product.variants.map(v => v.color))]
        : [];

    // Lấy mã màu hex từ danh sách hệ thống hoặc map cứng dự phòng
    const getColorHex = (colorName) => {
        const matchedColor = colorsList.find(
            c => c.colorName.toLowerCase() === colorName.toLowerCase()
        );
        if (matchedColor && matchedColor.hexCode) {
            return matchedColor.hexCode;
        }

        const fallbackColors = {
            'blue': '#003ec7',
            'black': '#191c1d',
            'red': '#ba1a1a',
            'white': '#ffffff',
            'yellow': '#e6b800',
            'green': '#00875a',
            'orange': '#ff7a00',
            'pink': '#ff69b4',
            'grey': '#8e8e93',
            'gray': '#8e8e93',
            'xanh': '#003ec7',
            'đen': '#191c1d',
            'đỏ': '#ba1a1a',
            'trắng': '#ffffff',
            'vàng': '#e6b800',
            'lục': '#00875a',
            'cam': '#ff7a00',
            'hồng': '#ff69b4',
            'xám': '#8e8e93'
        };
        return fallbackColors[colorName.toLowerCase()] || '#cccccc';
    };

    // Kiểm tra xem màu sắc có sẵn (còn hàng) đối với kích cỡ đang chọn hay không
    const isColorAvailableForSize = (colorName) => {
        if (!selectedSize) return true;
        return product?.variants?.some(
            v => v.size === selectedSize && v.color === colorName && v.stock > 0
        ) || false;
    };

    // Tìm kiếm biến thể đang hoạt động dựa trên size và màu đã chọn
    const activeVariant = product && product.variants
        ? product.variants.find(v => v.size === selectedSize && v.color === selectedColor)
        : null;

    // Tính toán giá tiền hiển thị: theo biến thể đang chọn hoặc giá gốc sản phẩm
    const displayPrice = activeVariant
        ? `${Number(activeVariant.price).toLocaleString('vi-VN')}₫`
        : product
            ? `${Number(product.basePrice).toLocaleString('vi-VN')}₫`
            : '0₫';

    // Các đặc điểm kỹ thuật & Đánh giá demo giữ nguyên tính chất thẩm mỹ cao
    const specs = [
        "Công nghệ tối ưu hóa hiệu suất thể thao",
        "Thiết kế công thái học ôm sát bàn chân",
        "Vải dệt siêu thoáng khí ngăn ngừa mùi",
        "Đế ngoài chống trượt độ bám đường cao"
    ];

    const performance = [
        { label: "Độ êm ái", value: "90%" },
        { label: "Độ ổn định", value: "85%" },
        { label: "Độ thoáng khí", value: "95%" }
    ];

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-surface">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Đang tải chi tiết sản phẩm...</p>
                </div>
            </div>
        );
    }

    const handleAddToCart = async () => {
        if (!activeVariant) return;
        setIsAdding(true);
        const success = await addToCart(activeVariant.variantID, 1);
        setIsAdding(false);
        if (success) {
            setToast(`Đã thêm ${product.productName} (${selectedSize} / ${selectedColor}) vào giỏ hàng!`);
            setTimeout(() => {
                setToast('');
            }, 3000);
        }
    };

    const handleBuyNow = async () => {
        if (!activeVariant) return;
        setIsAdding(true);
        const success = await addToCart(activeVariant.variantID, 1);
        setIsAdding(false);
        if (success) {
            navigate('/cart/view');
        }
    };

    if (error || !product) {
        return (
            <div className="max-w-[1300px] mx-auto px-4 py-20 text-center bg-surface">
                <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
                <h2 className="text-xl font-black uppercase tracking-tight text-on-surface mb-2">Đã xảy ra lỗi</h2>
                <p className="text-xs text-on-surface-variant font-medium mb-6">{error || "Không tìm thấy thông tin sản phẩm."}</p>
                <Link to="/product" className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg hover:scale-105 transition-all">
                    Quay lại danh sách sản phẩm
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-[1300px] mx-auto px-4 py-4 bg-surface relative">
            {/* TOAST NOTIFICATION */}
            {toast && (
                <div className="fixed top-24 right-6 bg-on-surface text-surface px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-bounce border border-outline-variant">
                    <span className="material-symbols-outlined text-success">check_circle</span>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Thành công</span>
                        <span className="text-xs font-bold">{toast}</span>
                    </div>
                </div>
            )}

            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] text-on-surface-variant mb-6 font-bold uppercase tracking-widest">
                <Link className="hover:text-primary transition-colors" to="/">Trang chủ</Link>
                <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                <Link className="hover:text-primary transition-colors" to="/product">Sản phẩm</Link>
                <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                <span className="text-primary line-clamp-1">{product.productName}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-start">
                {/* Image Section */}
                <div className="lg:col-span-6 flex justify-center">
                    <div className="w-full max-w-[480px] aspect-square bg-surface-container-low rounded-2xl overflow-hidden shadow-sm border border-outline-variant/30 flex items-center justify-center p-6">
                        <img 
                            className="max-w-full max-h-full object-contain rounded-xl" 
                            src={product.photo || "https://i.postimg.cc/FRNDTgTH/nophoto.png"} 
                            alt={product.productName} 
                            onError={(e) => {
                                e.target.src = "https://i.postimg.cc/FRNDTgTH/nophoto.png";
                            }}
                        />
                    </div>
                </div>

                {/* Info Section */}
                <div className="lg:col-span-6 flex flex-col pt-4 lg:pt-0">
                    <div className="mb-2">
                        <span className="inline-block px-2.5 py-0.5 bg-secondary-container text-on-secondary-container text-[9px] font-black rounded-full uppercase tracking-widest">
                            {product.category || "Sản phẩm"}
                        </span>
                        {product.brand && (
                            <span className="inline-block ml-2 px-2.5 py-0.5 bg-primary-container text-on-primary-container text-[9px] font-black rounded-full uppercase tracking-widest">
                                {product.brand}
                            </span>
                        )}
                    </div>

                    <h1 className="text-xl font-bold tracking-tight leading-tight mb-2 uppercase text-on-surface">
                        {product.productName}
                    </h1>

                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex text-secondary scale-75 origin-left">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            ))}
                        </div>
                        <span className="text-on-surface-variant font-bold text-[9px] uppercase tracking-wider">4.8 (120 đánh giá)</span>
                    </div>

                    <div className="text-xl font-bold text-primary mb-2">{displayPrice}</div>

                    {/* Hiển thị tồn kho và SKU của biến thể */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4 text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">
                        {activeVariant ? (
                            <>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">barcode</span>
                                    SKU: {activeVariant.sku}
                                </span>
                                <span className="hidden sm:inline h-3 w-[1px] bg-outline-variant"></span>
                                <span className={`flex items-center gap-1 ${activeVariant.stock > 0 ? 'text-success' : 'text-error'}`}>
                                    <span className="material-symbols-outlined text-sm">
                                        {activeVariant.stock > 0 ? 'inventory_2' : 'do_not_disturb_on'}
                                    </span>
                                    {activeVariant.stock > 0 ? `Còn hàng (${activeVariant.stock})` : 'Hết hàng'}
                                </span>
                            </>
                        ) : (
                            <span className="text-error flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">do_not_disturb_on</span>
                                Không sẵn có cho lựa chọn này
                            </span>
                        )}
                    </div>

                    <div className="space-y-4 mb-6 border-t border-outline-variant/60 pt-4">
                        {/* Size Picker */}
                        {availableSizes.length > 0 && (
                            <div className="w-full">
                                <div className="flex justify-between mb-2 text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">
                                    <span>Kích cỡ (Size)</span>
                                    <button className="text-primary underline underline-offset-2">Size Guide</button>
                                </div>
                                <div className="grid grid-cols-6 gap-2">
                                    {availableSizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`py-1.5 rounded-lg font-bold text-[10px] transition-all border ${
                                                selectedSize === size 
                                                    ? 'border-primary bg-primary text-white shadow-sm' 
                                                    : 'border-outline-variant hover:border-primary text-on-surface'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Color Picker */}
                        {availableColors.length > 0 && (
                            <div>
                                <span className="font-bold text-[9px] uppercase block mb-2 tracking-wider text-on-surface-variant">Màu sắc phối bản</span>
                                <div className="flex flex-wrap gap-2.5">
                                    {availableColors.map(color => {
                                        const isAvailable = isColorAvailableForSize(color);
                                        const hexColor = getColorHex(color);
                                        const isSelected = selectedColor === color;

                                        return (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`w-7 h-7 rounded-full border-2 transition-all relative ${
                                                    isSelected ? 'border-primary p-0.5 scale-105' : 'border-transparent'
                                                } ${!isAvailable ? 'opacity-30' : ''}`}
                                                title={color + (!isAvailable ? ' (Hết hàng)' : '')}
                                            >
                                                <div 
                                                    className="w-full h-full rounded-full border border-outline/10 shadow-inner" 
                                                    style={{ backgroundColor: hexColor }} 
                                                />
                                                {!isAvailable && (
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                        <span className="w-[1.5px] h-5 bg-on-surface-variant rotate-45 opacity-60"></span>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2.5 mb-6">
                        {!activeVariant || activeVariant.stock <= 0 ? (
                            <button 
                                disabled
                                className="w-full bg-outline-variant text-on-surface-variant opacity-50 cursor-not-allowed py-2.5 rounded-xl font-bold text-[10px] flex items-center justify-center gap-2 uppercase tracking-wider"
                            >
                                <span className="material-symbols-outlined text-base">do_not_disturb_on</span>
                                Hết hàng / Không có sẵn
                            </button>
                        ) : (
                            <button 
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className="w-full bg-primary text-white py-2.5 rounded-xl font-bold text-[10px] flex items-center justify-center gap-2 hover:bg-primary-container transition-all active:scale-[0.98] shadow-sm uppercase tracking-wider text-center"
                            >
                                <span className="material-symbols-outlined text-base">
                                    {isAdding ? 'sync' : 'shopping_bag'}
                                </span>
                                {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                            </button>
                        )}
                        <button 
                            onClick={handleBuyNow}
                            disabled={!activeVariant || activeVariant.stock <= 0 || isAdding}
                            className={`w-full py-2.5 rounded-xl font-bold text-[10px] transition-all active:scale-[0.98] uppercase tracking-wider border-2 ${
                                !activeVariant || activeVariant.stock <= 0 || isAdding
                                    ? 'border-outline-variant text-on-surface-variant opacity-50 cursor-not-allowed'
                                    : 'border-on-surface text-on-surface hover:bg-on-surface hover:text-white'
                            }`}
                        >
                            Mua ngay
                        </button>
                    </div>

                    <div className="flex gap-6 border-t border-outline-variant/60 pt-4 mt-auto justify-center">
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-primary text-base">local_shipping</span>
                            <span className="text-[9px] font-bold uppercase text-on-surface-variant">Freeship từ 1tr</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-primary text-base">verified</span>
                            <span className="text-[9px] font-bold uppercase text-on-surface-variant">Bảo hành 6 tháng</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section - Specs & Reviews */}
            <div className="flex flex-col gap-12 border-t border-outline-variant pt-10">
                {/* Section 1: Đặc điểm & Hiệu suất */}
                <section className="w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Đặc điểm kỹ thuật */}
                        <div className="lg:col-span-7">
                            <h2 className="text-lg font-black mb-6 uppercase tracking-tighter flex items-center gap-2">
                                <span className="w-8 h-[2px] bg-primary"></span>
                                Đặc điểm sản phẩm
                            </h2>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
                                {specs.map((spec, i) => (
                                    <li key={i} className="flex items-center gap-3 border-b border-outline-variant/30 pb-2">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                        <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-tight">{spec}</span>
                                    </li>
                                ))}
                            </ul>
                            {product.description && (
                                <div className="mt-8">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-on-surface mb-3">Mô tả chi tiết</h3>
                                    <p className="text-xs text-on-surface-variant font-medium leading-relaxed max-w-2xl whitespace-pre-line">
                                        {product.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Chỉ số hiệu suất */}
                        <div className="lg:col-span-5 bg-on-surface p-6 rounded-2xl text-surface shadow-lg">
                            <h3 className="font-bold text-[10px] mb-6 text-secondary-fixed uppercase tracking-widest text-center border-b border-white/10 pb-4">
                                Chỉ số Hiệu suất vận động
                            </h3>
                            <div className="space-y-5">
                                {performance.map((item, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between mb-1.5">
                                            <span className="text-[9px] font-black uppercase tracking-widest opacity-80">{item.label}</span>
                                            <span className="text-[9px] font-black">{item.value}</span>
                                        </div>
                                        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                                            <div
                                                className="bg-primary h-full transition-all duration-1000 shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]"
                                                style={{ width: item.value }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2: Đánh giá thực tế từ API */}
                <section className="w-full border-t border-outline-variant/50 pt-10">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 gap-3">
                        <div>
                            <h2 className="text-lg font-black uppercase tracking-tighter mb-1">Đánh giá từ khách hàng</h2>
                            <div className="flex items-center gap-2">
                                <div className="flex gap-0.5">
                                    {[1,2,3,4,5].map(s => (
                                        <span
                                            key={s}
                                            className={`material-symbols-outlined text-sm ${ s <= Math.round(avgStar) ? 'text-amber-400' : 'text-gray-200'}`}
                                            style={{ fontVariationSettings: s <= Math.round(avgStar) ? "'FILL' 1" : "'FILL' 0" }}
                                        >star</span>
                                    ))}
                                </div>
                                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                                    {avgStar > 0 ? `${avgStar}/5` : 'Chưa có đánh giá'} &bull; {ratings.length} đánh giá
                                </span>
                            </div>
                        </div>
                    </div>

                    {ratingsLoading ? (
                        <div className="flex items-center gap-2 text-xs text-on-surface-variant font-bold uppercase tracking-widest py-6">
                            <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                            Đang tải đánh giá...
                        </div>
                    ) : ratings.length === 0 ? (
                        <div className="text-center py-12 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                            <span className="material-symbols-outlined text-4xl text-gray-300 mb-3 block">star_border</span>
                            <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Chưa có đánh giá nào</p>
                            <p className="text-[10px] text-on-surface-variant/70 mt-1">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {ratings.map(review => (
                                <div key={review.ratingID} className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 hover:border-primary/40 transition-all hover:shadow-md">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center font-black text-on-secondary-container text-[11px] border border-outline-variant uppercase">
                                                {review.customerName ? review.customerName.charAt(0) : '?'}
                                            </div>
                                            <div>
                                                <p className="font-black text-on-surface text-[12px] leading-none mb-1">{review.customerName || 'Ẩn danh'}</p>
                                                <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-tighter">
                                                    {review.createdTime ? new Date(review.createdTime).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Hiển thị sao */}
                                        <div className="flex gap-0.5">
                                            {[1,2,3,4,5].map(s => (
                                                <span
                                                    key={s}
                                                    className={`material-symbols-outlined text-sm ${ s <= review.star ? 'text-amber-400' : 'text-gray-200'}`}
                                                    style={{ fontVariationSettings: s <= review.star ? "'FILL' 1" : "'FILL' 0" }}
                                                >star</span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-[11px] font-medium leading-relaxed text-on-surface-variant pl-12 border-l-2 border-primary/20">
                                        "{review.comment}"
                                    </p>
                                    {/* Phản hồi của cửa hàng nếu có */}
                                    {review.reply && (
                                        <div className="mt-3 ml-12 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[12px]">storefront</span>
                                                Phản hồi từ cửa hàng{review.employeeName ? ` (${review.employeeName})` : ''}
                                            </p>
                                            <p className="text-[11px] font-medium text-gray-700 leading-relaxed">{review.reply}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}