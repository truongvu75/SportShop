import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

import Sidebar from '../../components/layout/Sidebar';
import productApi from '../../api/productApi';
import wishlistApi from '../../api/wishlistApi';
import { useCart } from '../../context/CartContext';


// ================= PRODUCT CARD =================
const ProductCard = ({
    product,
    isFavorite,
    onToggleFavorite,
    onAddToCart
}) => {
    const {
        productID,
        productName,
        basePrice,
        description,
        sold,
        photo,
        brand
    } = product;

    return (
        <div className="group relative bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant hover:shadow-lg hover:-translate-y-1 transition-all duration-300 max-w-[300px] mx-auto flex flex-col">

            {/* IMAGE - Chuyển sang aspect-square đồng bộ với wishlist */}
            <Link className="block" to={`/product/${productID}`}>
                <div className="relative aspect-square w-full bg-stone-50 overflow-hidden flex items-center justify-center border-b border-outline-variant/10">
                    <img
                        alt={productName}
                        className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-110"
                        src={photo || "https://i.postimg.cc/X7X8KZXc/demo.png"}
                        onError={(e) => {
                            e.target.src = "https://i.postimg.cc/X7X8KZXc/demo.png";
                        }}
                    />
                    {brand && (
                        <span className="absolute top-2 left-2 bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm z-10">
                            {brand.brandName || brand}
                        </span>
                    )}
                </div>
            </Link>

            {/* CONTENT - Giữ nguyên layout và màu sắc nút của bạn */}
            <div className="p-3 flex flex-col flex-1 bg-white">
                <div className="flex flex-col mb-1.5">
                    <Link to={`/product/${productID}`}>
                        <h3 className="font-extrabold text-[15px] leading-tight text-on-surface group-hover:text-primary transition-colors line-clamp-1 mb-1 uppercase">
                            {productName}
                        </h3>
                    </Link>
                    <div className="flex items-center justify-between">
                        <span className="text-primary font-black text-base">
                            {Number(basePrice).toLocaleString('vi-VN')}đ
                        </span>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onToggleFavorite(productID);
                            }}
                            className="hover:scale-110 transition-transform active:scale-95 flex items-center justify-center cursor-pointer"
                        >
                            <span className={`material-symbols-outlined text-[20px] transition-colors hover:text-error ${isFavorite ? 'text-error fill-1' : 'text-on-surface-variant'}`}>
                                favorite
                            </span>
                        </button>
                    </div>
                </div>

                {/* Description */}
                <p className="text-on-surface-variant text-[11px] line-clamp-2 mb-2 h-8 leading-snug font-medium">
                    {description}
                </p>

                {/* Info Row */}
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant mb-3 font-bold uppercase mt-auto">
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary fill-1">
                            check_circle
                        </span>
                        <span>Đã bán: {sold || 0}</span>
                    </div>
                    <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary ring-1 ring-offset-1 ring-primary/20"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-on-surface ring-1 ring-offset-1 ring-on-surface/20"></span>
                    </div>
                </div>

                {/* Buttons - ẩn trên mobile, tinh chỉnh cho desktop */}
                <div className="hidden sm:grid grid-cols-2 gap-1.5 mt-auto">
                    <Link
                        to={`/product/${productID}`}
                        className="flex items-center justify-center gap-0.5 bg-primary text-white py-1.5 rounded-lg font-bold text-[9px] uppercase tracking-tight hover:bg-primary-container transition-all active:scale-95 shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[13px]">visibility</span>
                        Chi tiết
                    </Link>
                    <button className="flex items-center justify-center gap-0.5 border border-primary text-primary py-1.5 rounded-lg font-bold text-[9px] uppercase tracking-tight hover:bg-primary/5 transition-all active:scale-95">
                        <span className="material-symbols-outlined text-[13px]">person_check</span>
                        Thử đồ
                    </button>
                </div>
            </div>
        </div>
    );
};

// ================= PRODUCT PAGE =================
export default function ProductPage() {

    // ================= URL PARAMS =================
    //Đọc các tham số từ URL để lọc sản phẩm
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { addToCart } = useCart();

    const categoryId = searchParams.get('categoryId') || '';
    const brandId = searchParams.get('brandId') || '';
    const searchValue = searchParams.get('searchValue') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const size = parseInt(searchParams.get('size') || '8', 10);

    const sizeIdsParam = searchParams.get('sizeIds') || '';
    const colorIdsParam = searchParams.get('colorIds') || '';
    const priceRangeFilter = searchParams.get('priceRange') || '';

    // ================= STATES =================
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1); //Tổng số trang tìm thấy kết quả
    const [totalProducts, setTotalProducts] = useState(0); //Tổng số sản phẩm được tìm thấy
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    // Fetch wishlist items on mount
    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const data = await wishlistApi.getWishlist();
                const ids = new Set(data.map(item => item.productID));
                setWishlistIds(ids);
            } catch (err) {
                console.error("Lỗi khi tải wishlist:", err);
            }
        };
        fetchWishlist();
    }, []);

    const handleToggleFavorite = async (productID) => {
        try {
            const isFav = wishlistIds.has(productID);
            if (isFav) {
                await wishlistApi.removeFromWishlist(productID);
                setWishlistIds(prev => {
                    const next = new Set(prev);
                    next.delete(productID);
                    return next;
                });
            } else {
                await wishlistApi.addToWishlist(productID);
                setWishlistIds(prev => {
                    const next = new Set(prev);
                    next.add(productID);
                    return next;
                });
            }
        } catch (err) {
            console.error("Lỗi khi thay đổi wishlist:", err);
        }
    };

    // ================= ADD TO CART =================
    const handleAddToCart = async (product) => {
        if (!product.variants || product.variants.length === 0) {
            // Nếu không có variants hoặc chưa tải, chuyển sang trang chi tiết
            navigate(`/product/${product.productID}`);
            return;
        }

        // Tìm variant đầu tiên còn hàng
        const availableVariant = product.variants.find(v => v.stock > 0);
        if (!availableVariant) {
            alert("Sản phẩm này đã hết hàng!");
            return;
        }

        try {
            const success = await addToCart(availableVariant.variantID, 1);
            if (success) {
                alert(`Đã thêm ${product.productName} vào giỏ hàng thành công!`);
            }
        } catch (err) {
            console.error("Lỗi khi thêm vào giỏ hàng:", err);
            alert("Không thể thêm sản phẩm vào giỏ hàng.");
        }
    };


    const getPaginationItems = () => {
        const items = [];
        //Trang đầu tiên
        items.push(1);

        if (page > 4) {
            items.push("leftDots");
        }

        //Các trang quanh trang hiện tại
        for (let i = Math.max(2, page - 2); i <= Math.min(totalPages - 1, page + 2); i++) {
            items.push(i);
        }

        //Hiện ... cuối
        if (page < totalPages - 3) {
            items.push("rightDots");
        }

        //Trang cuối
        items.push(totalPages);

        return items;
    };

    // ================= FETCH PRODUCTS =================
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                const apiParams = {
                    page: page,
                    limit: size
                };

                // Gắn các trường cơ bản
                if (categoryId) apiParams.categoryId = parseInt(categoryId, 10);
                if (brandId) apiParams.brandId = parseInt(brandId, 10);
                if (searchValue) apiParams.searchValue = searchValue;

                // ĐỐI CHIẾU CHUẨN DTO BACKEND: Chuyển chuỗi "1,2" thành mảng số [1, 2] gửi đi
                if (sizeIdsParam) {
                    apiParams.sizeIds = sizeIdsParam.split(',').map(Number);
                }
                if (colorIdsParam) {
                    apiParams.colorIds = colorIdsParam.split(',').map(Number);
                }

                // ĐỐI CHIẾU CHUẨN DTO BACKEND: minPrice và maxPrice
                if (priceRangeFilter) {
                    if (priceRangeFilter === 'under500') {
                        apiParams.minPrice = 0;
                        apiParams.maxPrice = 500000;
                    } else if (priceRangeFilter === '500-1500') {
                        apiParams.minPrice = 500000;
                        apiParams.maxPrice = 1500000;
                    } else if (priceRangeFilter === 'above1500') {
                        apiParams.minPrice = 1500000;
                        apiParams.maxPrice = 999999999;
                    }
                }

                const response = await productApi.getAllProducts(apiParams);
                setProducts(response.content || []);
                setTotalPages(response.totalPages || 1);
                setTotalProducts(response.totalElements || 0);
            } catch (err) {
                setError('Không thể tải sản phẩm');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId, brandId, searchValue, page, size, sizeIdsParam, colorIdsParam, priceRangeFilter]); //Tự động refetch khi các tham số thay đổi

    // ================= HÀM XỬ LÝ CHUYỂN TRANG =================
    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;

        const newParams = new URLSearchParams(searchParams); //copy lại url hiện tại
        newParams.set("page", newPage.toString()); //set lại page được chọn vào URL
        setSearchParams(newParams); //Cập nhật lại URL

        window.scrollTo({ top: 0, behavior: 'smooth' }); //Cuộn lên đầu trang
    };

    // ================= RENDER =================
    return (
        <div className="flex flex-1 bg-surface">
            {/* SIDEBAR */}
            <Sidebar 
                isOpenOnMobile={showMobileFilter} 
                onCloseMobile={() => setShowMobileFilter(false)} 
            />

            {/* MAIN CONTENT */}
            <main className="flex-1 p-3 md:p-6 max-w-[1600px] mx-auto">

                {/* HEADER */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        {/* BREADCRUMB */}
                        <nav className="flex items-center gap-2 text-[11px] text-on-surface-variant mb-2 font-bold uppercase tracking-widest">
                            <Link className="hover:text-primary transition-colors" to="/">Trang chủ</Link>
                            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                            <span className="text-primary">Sản phẩm</span>
                        </nav>

                        {/* TITLE */}
                        <h2 className="text-[40px] font-black tracking-tighter leading-tight text-on-surface uppercase mb-1">
                            <span className="text-primary">Bộ sưu tập</span>
                        </h2>

                        {/* PRODUCT COUNT */}
                        {!loading && !error && (
                            <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest">
                                Tìm thấy <span className="text-primary font-black">{totalProducts}</span> sản phẩm phù hợp
                            </p>
                        )}
                    </div>

                    {/* SORT & FILTER ON MOBILE */}
                    <div className="flex items-center gap-2.5">
                        {/* Nút Lọc di động */}
                        <button
                            onClick={() => setShowMobileFilter(true)}
                            className="md:hidden flex items-center gap-1 bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant shadow-sm text-on-surface-variant text-[11px] font-black uppercase tracking-widest cursor-pointer hover:bg-surface-container transition-all active:scale-95"
                        >
                            <span className="material-symbols-outlined text-[16px] text-primary">filter_alt</span>
                            Lọc
                        </button>

                        {/* SORT */}
                        <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant shadow-sm">
                            <span className="text-on-surface-variant text-[11px] font-black uppercase tracking-widest">Sắp xếp:</span>
                            <button className="flex items-center gap-1 font-black text-primary group text-[11px] uppercase tracking-widest">
                                Mới nhất
                                <span className="material-symbols-outlined group-hover:rotate-180 transition-transform text-[18px]">expand_more</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* LOADING */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* ERROR */}
                {error && (
                    <div className="text-center text-error font-bold py-10">{error}</div>
                )}

                {/* EMPTY */}
                {!loading && products.length === 0 && (
                    <div className="text-center text-on-surface-variant font-bold py-20">Không tìm thấy sản phẩm</div>
                )}

                {/* PRODUCT GRID */}
                {!loading && products.length > 0 && (
                    <div className="grid grid-cols-2 min-[480px]:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                        {products.map(product => (
                            <ProductCard
                                key={product.productID}
                                product={product}
                                isFavorite={wishlistIds.has(product.productID)}
                                onToggleFavorite={handleToggleFavorite}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                )}

                {/* THANH PHÂN TRANG HOÀN CHỈNH */}
                {!loading && products.length > 0 && totalPages > 1 && (
                    <div className="mt-16 flex justify-center items-center gap-2">

                        {/* Nút Lùi 1 Trang */}
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant transition-all ${page === 1 ? 'opacity-30 cursor-not-allowed bg-gray-50' : 'hover:bg-surface-container'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                        </button>

                        {/* Danh sách các nút số trang */}
                        {getPaginationItems().map((item, index) => {
                            if (item === "leftDots" || item === "rightDots") {
                                return (
                                    <span key={item} className="px-2 text-gray-500 font-bold">...</span>
                                );
                            }

                            const isActive = item === page;

                            return (
                                <button key={item}
                                    onClick={() => handlePageChange(item)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-black text-xs transition-all ${isActive ? 'bg-primary text-white shadow-md pointer-events-none' : 'border border-outline-variant hover:bg-surface-container'}`}
                                >{item}</button>
                            );
                        })}

                        {/* Nút Tiến 1 Trang */}
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant transition-all ${page === totalPages ? 'opacity-30 cursor-not-allowed bg-gray-50' : 'hover:bg-surface-container'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                        </button>

                    </div>
                )}
            </main>
        </div>
    );
}