import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cartApi from '../../api/cartApi';
import orderApi from '../../api/orderApi';
import provinceApi from '../../api/provinceApi';
import customerApi from '../../api/customerApi';

export default function CheckoutPage() {
    const navigate = useNavigate();

    // State cho giỏ hàng
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);

    // State cho thông tin vận chuyển
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [provinces, setProvinces] = useState([]);

    // State cho phương thức thanh toán
    const [paymentMethod, setPaymentMethod] = useState('cod');

    // State cho Coupon
    const [couponInput, setCouponInput] = useState('');
    const [couponApplied, setCouponApplied] = useState(null);
    const [discount, setDiscount] = useState(0);

    // State phụ trợ
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Danh sách Coupon Demo dựa trên thực thể Coupon.java
    const DEMO_COUPONS = [
        { code: 'VELOCITY10', discountPercent: 10 },
        { code: 'WELCOME20', discountPercent: 20 }
    ];

    // Load dữ liệu khi trang mount
    useEffect(() => {
        const loadCheckoutData = async () => {
            try {
                setLoading(true);
                
                // 1. Lấy thông tin giỏ hàng
                const cartData = await cartApi.getCart();
                if (cartData && cartData.items) {
                    setCartItems(cartData.items);
                    setSubtotal(cartData.totalPrice || 0);
                }

                // 2. Lấy thông tin khách hàng từ DB để điền sẵn
                const profile = await customerApi.getProfile();
                if (profile) {
                    setFullName(profile.customerName || '');
                    setPhone(profile.phone || '');
                    setShippingAddress(profile.address || '');
                    if (profile.province) {
                        setSelectedProvince(profile.province.provinceName || '');
                    }
                }

                // 3. Lấy danh sách Tỉnh/Thành phố từ DB
                const provincesList = await provinceApi.getAllProvinces();
                if (provincesList) {
                    setProvinces(provincesList);
                    // Nếu chưa chọn tỉnh và danh sách không rỗng, chọn tỉnh đầu tiên làm mặc định
                    if (!selectedProvince && provincesList.length > 0) {
                        setSelectedProvince(provincesList[0].provinceName);
                    }
                }

            } catch (err) {
                console.error("Lỗi khi tải thông tin thanh toán:", err);
                setError("Không thể kết nối với hệ thống. Vui lòng kiểm tra lại backend!");
            } finally {
                setLoading(false);
            }
        };

        loadCheckoutData();
    }, []);

    // Xử lý áp dụng mã giảm giá
    const handleApplyCoupon = (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!couponInput.trim()) {
            setError("Vui lòng nhập mã giảm giá!");
            return;
        }

        const foundCoupon = DEMO_COUPONS.find(c => c.code.toUpperCase() === couponInput.trim().toUpperCase());
        if (foundCoupon) {
            setCouponApplied(foundCoupon);
            const calculatedDiscount = (subtotal * foundCoupon.discountPercent) / 100;
            setDiscount(calculatedDiscount);
            setSuccessMessage(`Áp dụng thành công mã ${foundCoupon.code}! Giảm giá ${foundCoupon.discountPercent}%`);
        } else {
            setError("Mã giảm giá không hợp lệ hoặc đã hết hạn!");
            setCouponApplied(null);
            setDiscount(0);
        }
    };

    // Định dạng số thành VNĐ
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Xử lý Hoàn tất đặt hàng
    const handlePlaceOrder = async () => {
        setError('');
        setSuccessMessage('');

        // Validate đầu vào
        if (!fullName.trim()) {
            setError("Vui lòng nhập Họ và tên khách hàng!");
            return;
        }
        if (!phone.trim()) {
            setError("Vui lòng nhập Số điện thoại liên lạc!");
            return;
        }
        if (!shippingAddress.trim()) {
            setError("Vui lòng nhập Địa chỉ giao hàng chi tiết!");
            return;
        }
        if (!selectedProvince) {
            setError("Vui lòng chọn Tỉnh / Thành phố giao hàng!");
            return;
        }
        if (cartItems.length === 0) {
            setError("Giỏ hàng của bạn đang trống! Không thể đặt hàng.");
            return;
        }

        try {
            setLoading(true);

            // Dữ liệu truyền lên Backend:
            const orderData = {
                deliveryAddress: shippingAddress,
                deliveryProvince: selectedProvince,
                payMethod: paymentMethod === 'credit' ? 'VNPAY' : 'COD',
                shipperID: null // Mặc định tự động gán ở Backend
            };

            // Gọi API lưu đơn hàng
            const createdOrder = await orderApi.createOrder(orderData);

            const dto = createdOrder;

            if (dto.paymentUrl){    //Đơn hàng có phương thức là VNPay
                window.location.href = dto.paymentUrl;
                // console.log(`PaymentUrl ${dto.paymentUrl}`)
            }
            
            else if (createdOrder && createdOrder.orderID) { //Đơn hàng có phương thức là COD
                // Nhảy sang trang chi tiết đơn hàng vừa tạo thành công
                navigate(`/order/order-detail/${createdOrder.orderID}`);
            } else {
                throw new Error("Không nhận được mã đơn hàng phản hồi từ máy chủ.");
            }

        } catch (err) {
            console.error("Lỗi khi đặt hàng:", err);
            setError(err.response?.data?.message || "Đặt hàng thất bại. Vui lòng kiểm tra số lượng tồn kho sản phẩm!");
        } finally {
            setLoading(false);
        }
    };

    if (loading && cartItems.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-surface">
                <div className="flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-primary animate-spin">sync</span>
                    <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest animate-pulse">Đang tải thông tin đặt hàng...</p>
                </div>
            </div>
        );
    }

    const totalToPay = subtotal - discount;

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-10 bg-surface">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] text-on-surface-variant mb-8 font-bold uppercase tracking-widest">
                <Link className="hover:text-primary transition-colors" to="/">Trang chủ</Link>
                <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                <Link className="hover:text-primary transition-colors" to="/cart/view">Giỏ hàng</Link>
                <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                <span className="text-primary">Thanh toán</span>
            </nav>

            {/* Thông báo lỗi & thành công */}
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                {/* CỘT TRÁI: THÔNG TIN VẬN CHUYỂN & THANH TOÁN (CHIẾM 8/12) */}
                <div className="lg:col-span-8 space-y-10">

                    {/* Section 1: Thông tin vận chuyển */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold">1</span>
                            <h2 className="text-lg font-black text-primary uppercase tracking-tight">Thông tin vận chuyển</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
                            <div className="col-span-2">
                                <label className="block text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Họ và tên khách hàng</label>
                                <input
                                    className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium text-on-surface"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                    type="text"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5 col-span-2">
                                <div>
                                    <label className="block text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Số điện thoại liên lạc</label>
                                    <input
                                        className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium text-on-surface"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Ví dụ: 0901234567"
                                        type="tel"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Tỉnh / Thành phố</label>
                                    <select 
                                        className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium cursor-pointer text-on-surface"
                                        value={selectedProvince}
                                        onChange={(e) => setSelectedProvince(e.target.value)}
                                    >
                                        <option value="">-- Chọn Tỉnh / Thành --</option>
                                        {provinces.map((prov) => (
                                            <option key={prov.provinceName} value={prov.provinceName}>
                                                {prov.provinceName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Địa chỉ giao hàng chi tiết</label>
                                <input
                                    className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium text-on-surface"
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    placeholder="Số nhà, tên đường, phường/xã..."
                                    type="text"
                                />
                            </div>

                        </div>
                    </section>

                    {/* Section 2: Phương thức thanh toán */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold">2</span>
                            <h2 className="text-lg font-black text-primary uppercase tracking-tight">Phương thức thanh toán</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label
                                onClick={() => setPaymentMethod('credit')}
                                className={`flex items-center gap-4 p-5 bg-surface-container-lowest border rounded-2xl cursor-pointer transition-all ${paymentMethod === 'credit' ? 'border-primary ring-1 ring-primary shadow-sm' : 'border-outline-variant'}`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'credit' ? 'border-primary' : 'border-outline-variant'}`}>
                                    {paymentMethod === 'credit' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-sm">Thẻ tín dụng / Ghi nợ (Demo)</p>
                                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tight">Visa, Mastercard, JCB</p>
                                </div>
                                <span className="material-symbols-outlined text-lg opacity-60">credit_card</span>
                            </label>

                            <label
                                onClick={() => setPaymentMethod('cod')}
                                className={`flex items-center gap-4 p-5 bg-surface-container-lowest border rounded-2xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary ring-1 ring-primary shadow-sm' : 'border-outline-variant'}`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-primary' : 'border-outline-variant'}`}>
                                    {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-sm">Thanh toán COD</p>
                                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tight">Thanh toán bằng tiền mặt khi nhận hàng</p>
                                </div>
                                <span className="material-symbols-outlined text-lg opacity-60">local_shipping</span>
                            </label>
                        </div>
                    </section>
                </div>

                {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG (CHIẾM 4/12) */}
                <aside className="lg:col-span-4 sticky top-24">
                    <div className="bg-surface-container-high p-6 rounded-2xl border border-outline-variant shadow-sm">
                        <h2 className="text-lg font-black mb-6 uppercase tracking-tighter border-b border-outline-variant pb-4">Tóm tắt đơn hàng</h2>

                        <div className="space-y-4 mb-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                            {cartItems.map(item => (
                                <div key={item.cartItemID} className="flex gap-4 items-center">
                                    <div className="w-16 h-20 bg-surface rounded-lg flex-shrink-0 border border-outline-variant/30 overflow-hidden">
                                        <img className="w-full h-full object-cover" src={item.photo || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'} alt={item.productName} />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-black text-xs text-on-surface uppercase truncate mb-0.5">{item.productName}</p>
                                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tight mb-1">
                                            Size {item.sizeName || 'N/A'} | Màu: {item.colorName || 'N/A'} | Qty: {item.quantity}
                                        </p>
                                        <p className="font-black text-primary text-sm">{formatCurrency(item.unitPrice)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 border-t border-outline-variant pt-5">
                            <div className="flex justify-between text-[12px] font-bold text-on-surface-variant">
                                <span>TẠM TÍNH</span>
                                <span className="text-on-surface font-black">{formatCurrency(subtotal)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-[12px] font-bold text-secondary">
                                    <span>GIẢM GIÁ ({couponApplied?.discountPercent}%)</span>
                                    <span className="font-black">-{formatCurrency(discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-[12px] font-bold text-on-surface-variant">
                                <span>PHÍ VẬN CHUYỂN</span>
                                <span className="text-green-600 font-black uppercase tracking-widest text-[9px] bg-green-50 px-2 py-0.5 rounded-md">Miễn phí</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-dashed border-outline-variant mt-3">
                                <span className="font-black text-base uppercase tracking-tighter">Tổng cộng</span>
                                <span className="text-2xl font-black text-primary">{formatCurrency(totalToPay)}</span>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <form onSubmit={handleApplyCoupon}>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        className="flex-1 bg-surface border border-outline-variant rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-2 focus:ring-primary outline-none transition-all text-on-surface"
                                        placeholder="Mã Demo: WELCOME20, VELOCITY10"
                                        value={couponInput}
                                        onChange={(e) => setCouponInput(e.target.value)}
                                        type="text"
                                    />
                                    <button 
                                        type="submit"
                                        className="bg-on-surface text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all"
                                    >
                                        ÁP DỤNG
                                    </button>
                                </div>
                            </form>
                            <div className="text-[10px] text-on-surface-variant font-medium flex flex-col gap-1 pl-1">
                                <span className="text-primary font-black uppercase tracking-widest">Danh sách mã giảm giá demo:</span>
                                <span>• <strong className="text-secondary font-bold">WELCOME20</strong>: Giảm ngay 20% đơn hàng</span>
                                <span>• <strong className="text-secondary font-bold">VELOCITY10</strong>: Giảm ngay 10% đơn hàng</span>
                            </div>

                            <button 
                                onClick={handlePlaceOrder}
                                disabled={loading || cartItems.length === 0}
                                className="w-full bg-secondary text-white py-4 rounded-2xl font-black text-base hover:brightness-105 active:scale-[0.98] transition-all shadow-lg shadow-secondary/20 uppercase tracking-tighter disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "ĐANG XỬ LÝ..." : "HOÀN TẤT ĐẶT HÀNG"}
                            </button>

                            <Link to="/cart/view" className="w-full flex items-center justify-center gap-2 py-3 text-[10px] font-black text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors border-t border-outline-variant mt-2">
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Quay lại giỏ hàng
                            </Link>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
