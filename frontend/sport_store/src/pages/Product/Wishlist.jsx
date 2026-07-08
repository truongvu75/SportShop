import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import wishlistApi from '../../api/wishlistApi';
import { useCart } from '../../context/CartContext';

export default function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();

    const suggestions = [
        { name: "Quần Shorts Run-Fast", price: "450.000đ", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_HVJ9dDPf4vdIZDb-a0-IRRsRTjFzwo5P7y8iBMldyGM1wd1veJrnVXmt0JARJ7EyKSyzyweS4QMzp5BjjE_cCs9QZoHgU0jkalpf10LQMQ8AzcvTpMcEJob405QLJ3zGdKQiHo6avYmn7KWt8hXvoL0kWhGqFGWsoaIPwVE93mHUgce7WGkajJ3vhuANhyWzcRBONrsduanakX2o9s176Z0asoh291hrie8_dqsXpLl7X0SfyIrD0jP8bGb_bJv2hBwmViST0as" },
        { name: "Vớ nén Compression", price: "180.000đ", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfgCOylPjecVF-yKxMNYHS-xUEtHomVeg2e9npMlLHcNPVOdYnYwQtHMPo03Kg2Wc3H88cqSM9KUAEVP6U7y2zWiZC91kchySt-nmxZ_U78qsnKu2epWW6Me-JPLBw833CJoJvDPYbDTQWJUa2QUDHL82HKPd9zm6pcGxX-qn2TJf2bYW_pvzpIZw4GiWMTjMKOOEmtxOdvZKtAFZKU3PqctD1UaG_NBrPVA9VlY7blh2a9Jgzeqht7k_krDNxXWYm1luKYduoV-M" },
        { name: "Bình Shaker 700ml", price: "290.000đ", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVQHMdvFUQbcKBlJ78FOcQ2WBNEDGdVyetgDoz1ME3v_vjqK2i-p9iv5teP9KkNP2hu39JdCSk7XamfZK2FXPm68yiVVZ1_LtwAE6N-lUUBTZ7KZet6wo5OC0Yf-kicFmk9Y9t_86S3wfNFLC7EP9A8EwUAzOpvgrj7hdWLYaK1R89JwgxAEbTUiL0mc7YHRGSHk-wEQ3Gk3mfEPQalwQxbnTSwuXjnYTxtsaTX4IJpoVaHAnT6t4gw7BTiMhkVmCWUn1uyCD1vfw" },
        { name: "Dây kháng lực Pro", price: "350.000đ", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBx1FRmUhTKZTzdY0LR60eD7RmIqGFA29sDnFaAycg-2hT000MQyRvKO6QNpOVnnNfCOIvCdKzrd13LwX8Il5qCeRXX5zEbI3Koo9NhKIXX_S_NioqkfNqfqpBfmTcdsxTKtFLHYoTusDgNQhpxd0I61scsRoXr5J0KFopFTe0-_F82tnjNU8PeiUupVlmOPZNfV9mSJ3tfuYj41_UCRZQPFhatyufNqg-aa8ihOGe31GL0KwU8qXCPSRV8B3nwQFhY7_vLdoA7mDA" }
    ];

    // Tải danh sách yêu thích
    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const data = await wishlistApi.getWishlist();
            setWishlistItems(data);
        } catch (err) {
            console.error("Lỗi khi tải wishlist:", err);
            setError("Không thể tải danh sách sản phẩm yêu thích.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    // Xóa khỏi wishlist
    const removeFromWishlist = async (productId) => {
        try {
            await wishlistApi.removeFromWishlist(productId);
            setWishlistItems(prev => prev.filter(item => item.productID !== productId));
        } catch (err) {
            console.error("Lỗi khi xóa sản phẩm khỏi wishlist:", err);
        }
    };

    // Thêm vào giỏ hàng từ sản phẩm yêu thích
    const handleAddToCart = async (product) => {
        // Tìm variant đầu tiên còn hàng
        const availableVariant = product.variants?.find(v => v.stock > 0);
        if (!availableVariant) {
            alert("Sản phẩm này đã hết hàng!");
            return;
        }

        try {
            await addToCart(availableVariant.variantID, 1);
            alert(`Đã thêm ${product.productName} vào giỏ hàng thành công!`);
        } catch (err) {
            console.error("Lỗi khi thêm vào giỏ hàng:", err);
            alert("Không thể thêm sản phẩm vào giỏ hàng.");
        }
    };

    // Mua toàn bộ sản phẩm yêu thích còn hàng
    const handleBuyAll = async () => {
        const inStockItems = wishlistItems.filter(item => {
            const inStock = item.variants ? item.variants.some(v => v.stock > 0) : false;
            return inStock;
        });

        if (inStockItems.length === 0) {
            alert("Không có sản phẩm nào còn hàng để mua!");
            return;
        }

        try {
            for (const item of inStockItems) {
                const availableVariant = item.variants.find(v => v.stock > 0);
                if (availableVariant) {
                    await addToCart(availableVariant.variantID, 1);
                }
            }
            alert("Đã thêm toàn bộ sản phẩm còn hàng vào giỏ!");
        } catch (err) {
            console.error("Lỗi khi mua toàn bộ:", err);
            alert("Có lỗi xảy ra khi thêm một số sản phẩm vào giỏ hàng.");
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-10 bg-surface min-h-screen font-['Lexend']">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] text-on-surface-variant mb-6 font-bold uppercase tracking-widest">
                <Link className="hover:text-primary transition-colors" to="/">Trang chủ</Link>
                <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                <Link className="hover:text-primary transition-colors" to="/product">Sản phẩm</Link>
                <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                <span className="text-primary">Yêu thích</span>
            </nav>

            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-outline-variant">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-on-surface uppercase mb-2">Danh sách yêu thích</h1>
                    {!loading && (
                        <p className="text-on-surface-variant text-sm font-medium">Bạn đang có <span className="text-primary font-black">{wishlistItems.length}</span> sản phẩm trong bộ sưu tập yêu thích.</p>
                    )}
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-surface-container-high rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-outline-variant transition-all active:scale-95">
                        <span className="material-symbols-outlined text-[20px]">share</span>
                        CHIA SẺ
                    </button>
                    {wishlistItems.length > 0 && (
                        <button 
                            onClick={handleBuyAll}
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-container transition-all active:scale-95 shadow-md"
                        >
                            <span className="material-symbols-outlined text-[20px]">shopping_cart_checkout</span>
                            MUA TẤT CẢ
                        </button>
                    )}
                </div>
            </header>

            {/* LOADING STATE */}
            {loading && (
                <div className="flex justify-center items-center py-20">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* ERROR STATE */}
            {!loading && error && (
                <div className="text-center text-error font-bold py-10">{error}</div>
            )}

            {/* Wishlist Grid */}
            {!loading && !error && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
                    {wishlistItems.length > 0 ? (
                        wishlistItems.map((item) => {
                            const inStock = item.variants ? item.variants.some(v => v.stock > 0) : false;

                            return (
                                <div
                                    key={item.productID}
                                    className="flex flex-col bg-surface-container-lowest rounded-2xl border border-outline-variant/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                                >
                                    {/* Image Section - aspect-square và object-contain */}
                                    <div className="relative aspect-square w-full bg-stone-50 overflow-hidden flex items-center justify-center border-b border-outline-variant/10">
                                        <img
                                            src={item.photo || "https://i.postimg.cc/X7X8KZXc/demo.png"}
                                            alt={item.productName}
                                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.src = "https://i.postimg.cc/X7X8KZXc/demo.png";
                                            }}
                                        />

                                        {/* Lớp phủ Gradient nhẹ phía trên để nổi bật nút xóa/badge */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        {/* Badge & Status */}
                                        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                                            {item.brand && (
                                                <span className="bg-primary text-white px-2 py-0.5 rounded-lg text-[7px] font-bold uppercase tracking-wider shadow-sm">
                                                    {item.brand}
                                                </span>
                                            )}
                                        </div>

                                        {!inStock && (
                                            <div className="absolute inset-0 bg-surface/40 backdrop-blur-[1px] flex items-center justify-center z-20">
                                                <span className="bg-error/90 text-white px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest shadow-lg">
                                                    Hết hàng
                                                </span>
                                            </div>
                                        )}

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => removeFromWishlist(item.productID)}
                                            className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm hover:bg-error hover:text-white transition-all text-on-surface-variant shadow-sm z-30 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">close</span>
                                        </button>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-3 flex flex-col flex-1 bg-white">
                                        <div className="mb-2">
                                            <h3 className="font-bold text-[13px] text-on-surface uppercase mb-1 line-clamp-2 h-8 leading-tight tracking-tight group-hover:text-primary transition-colors">
                                                {item.productName}
                                            </h3>
                                            <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-tighter line-clamp-1 opacity-60 italic">
                                                {item.description}
                                            </p>
                                        </div>

                                        <div className="flex flex-col mb-4">
                                            <span className="text-sm font-black text-primary">
                                                {Number(item.basePrice).toLocaleString('vi-VN')}đ
                                            </span>
                                        </div>

                                        {/* Actions - Bỏ nút mua ngay, chỉ giữ lại +Giỏ & Chi tiết được cân đối lại */}
                                        <div className="mt-auto grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => handleAddToCart(item)}
                                                disabled={!inStock}
                                                className={`py-2 rounded-lg font-black text-[9px] uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-1 ${inStock
                                                    ? "bg-primary text-white hover:bg-primary-container shadow-sm"
                                                    : "bg-surface-container text-on-surface-variant cursor-not-allowed opacity-50"
                                                    }`}
                                            >
                                                <span className="material-symbols-outlined text-[14px]">shopping_cart</span>
                                                + GIỎ
                                            </button>
                                            <Link
                                                to={`/product/${item.productID}`}
                                                className="py-2 rounded-lg border-2 border-primary text-primary font-black text-[9px] uppercase tracking-wider hover:bg-primary/5 transition-all active:scale-95 flex items-center justify-center gap-1 text-center"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">visibility</span>
                                                Chi tiết
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        /* Empty State */
                        <div className="col-span-full py-20 text-center bg-surface-container-lowest rounded-3xl border-2 border-outline-variant border-dashed">
                            <span className="material-symbols-outlined text-outline-variant text-6xl mb-4">
                                heart_broken
                            </span>
                            <h3 className="text-xl font-black uppercase text-on-surface mb-1">
                                Wishlist đang trống
                            </h3>
                            <p className="text-on-surface-variant font-medium text-sm mb-8">
                                Có vẻ như bạn chưa chọn được món đồ ưng ý nào.
                            </p>
                            <Link
                                to="/product"
                                className="bg-primary text-white px-10 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:brightness-110 hover:-translate-y-0.5 transition-all inline-block"
                            >
                                Khám phá ngay
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* Suggestions Section */}
            <section className="pt-8 border-t border-outline-variant">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                    <span className="w-10 h-1 bg-primary"></span>
                    Có thể bạn sẽ thích
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {suggestions.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl group cursor-pointer hover:bg-surface-container-high transition-all border border-transparent hover:border-outline-variant shadow-sm">
                            <div className="w-16 h-16 rounded-xl bg-white overflow-hidden flex-shrink-0 border border-outline-variant/30">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="text-[11px] font-black uppercase text-on-surface truncate leading-tight mb-1">{item.name}</h4>
                                <p className="text-primary font-black text-xs">{item.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
