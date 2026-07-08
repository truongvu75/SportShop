import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const { cart, loading, error, fetchCart, updateCartItem, removeFromCart } = useCart();
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Tải chi tiết giỏ hàng thực tế từ API khi mở trang
  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (cartItemID, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;

    setActionLoadingId(cartItemID);
    await updateCartItem(cartItemID, newQty);
    setActionLoadingId(null);
  };

  const handleRemoveItem = async (cartItemID) => {
    setActionLoadingId(cartItemID);
    await removeFromCart(cartItemID);
    setActionLoadingId(null);
  };

  const cartItems = cart?.items || [];
  const rawSubtotal = cart?.totalPrice || 0;
  const tax = rawSubtotal * 0.08; // Thuế 8%
  const shippingFee = rawSubtotal >= 1000000 || rawSubtotal === 0 ? 0 : 30000; // Miễn phí vận chuyển từ 1 triệu đồng
  const total = rawSubtotal + tax + shippingFee;

  if (loading && !cart) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-surface">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Đang tải giỏ hàng...</p>
      </div>
    );
  }

  if (error && !cart) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-surface p-6 text-center">
        <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
        <h2 className="text-xl font-black uppercase tracking-tight text-on-surface mb-2">Đã xảy ra lỗi</h2>
        <p className="text-xs text-on-surface-variant font-medium mb-6">{error}</p>
        <button onClick={fetchCart} className="bg-primary text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg hover:scale-105 transition-all">
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 bg-surface min-h-screen">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] text-on-surface-variant mb-6 font-bold uppercase tracking-widest">
        <Link className="hover:text-primary transition-colors" to="/">Trang chủ</Link>
        <span className="material-symbols-outlined text-[12px]">chevron_right</span>
        <span className="text-primary">Giỏ hàng</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* LEFT: DANH SÁCH GIỎ HÀNG */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-end border-b border-outline-variant pb-4">
            <h1 className="text-2xl font-black uppercase tracking-tighter">Giỏ hàng</h1>
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">{cartItems.length} sản phẩm</span>
          </div>

          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.cartItemID} className={`flex gap-4 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 hover:shadow-sm transition-all ${actionLoadingId === item.cartItemID ? 'opacity-60 pointer-events-none' : ''}`}>
                <div className="w-20 h-24 bg-surface rounded-xl overflow-hidden flex-shrink-0 border border-outline-variant/30 relative">
                  <img 
                    src={item.photo || "https://i.postimg.cc/FRNDTgTH/nophoto.png"} 
                    alt={item.productName} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.target.src = "https://i.postimg.cc/FRNDTgTH/nophoto.png";
                    }}
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-sm text-on-surface uppercase mb-0.5 line-clamp-1">{item.productName}</h3>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tight">
                        {item.colorName || 'Mặc định'} | {item.sizeName || 'Mặc định'}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleRemoveItem(item.cartItemID)} 
                      disabled={actionLoadingId === item.cartItemID}
                      className="text-on-surface-variant hover:text-error transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-1.5 bg-surface-container p-1 rounded-lg border border-outline-variant/50">
                      <button 
                        onClick={() => handleUpdateQuantity(item.cartItemID, item.quantity, -1)} 
                        disabled={item.quantity <= 1 || actionLoadingId === item.cartItemID}
                        className={`w-6 h-6 flex items-center justify-center hover:bg-surface rounded-md transition-colors ${item.quantity <= 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        <span className="material-symbols-outlined text-[14px]">remove</span>
                      </button>
                      <span className="w-6 text-center text-xs font-black">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.cartItemID, item.quantity, 1)} 
                        disabled={actionLoadingId === item.cartItemID}
                        className="w-6 h-6 flex items-center justify-center hover:bg-surface rounded-md transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">add</span>
                      </button>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="font-black text-primary text-sm">
                        {Number(item.totalPrice).toLocaleString('vi-VN')}đ
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider">
                          Đơn giá: {Number(item.unitPrice).toLocaleString('vi-VN')}đ
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {cartItems.length === 0 && (
            <div className="py-20 text-center">
              <span className="material-symbols-outlined text-outline-variant text-6xl mb-4">shopping_cart_off</span>
              <p className="text-on-surface-variant font-bold mb-6">Giỏ hàng của bạn đang trống</p>
              <Link to="/product" className="bg-primary text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs inline-block">Mua sắm ngay</Link>
            </div>
          )}
        </div>

        {/* RIGHT: TÓM TẮT ĐƠN HÀNG */}
        {cartItems.length > 0 && (
          <aside className="w-full lg:w-[380px] sticky top-24">
            <div className="bg-surface-container-high p-6 rounded-2xl border border-outline-variant shadow-sm">
              <h2 className="text-lg font-black mb-6 uppercase tracking-tighter border-b border-outline-variant pb-4">Tóm tắt đơn hàng</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[12px] font-bold text-on-surface-variant uppercase">
                  <span>Tạm tính</span>
                  <span className="text-on-surface">{Number(rawSubtotal).toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-[12px] font-bold text-on-surface-variant uppercase">
                  <span>Phí vận chuyển</span>
                  <span className={shippingFee === 0 ? 'text-secondary' : 'text-on-surface'}>
                    {shippingFee === 0 ? 'Miễn phí' : `${Number(shippingFee).toLocaleString('vi-VN')}đ`}
                  </span>
                </div>
                <div className="flex justify-between text-[12px] font-bold text-on-surface-variant uppercase">
                  <span>Thuế (8%)</span>
                  <span className="text-on-surface">{Number(tax).toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="h-[1px] bg-outline-variant my-4 border-dashed border-t"></div>
                <div className="flex justify-between items-center">
                  <span className="font-black text-base uppercase tracking-tighter">Tổng cộng</span>
                  <span className="text-2xl font-black text-primary">{Number(total).toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link to="/cart/checkout" className="w-full">
                  <button className="w-full bg-primary text-white font-black py-3.5 rounded-xl uppercase tracking-widest hover:bg-primary-container active:scale-95 transition-all shadow-lg shadow-primary/20 text-sm">
                    Thanh toán ngay
                  </button>
                </Link>
                <Link
                  to="/product"
                  className="w-full border-2 border-outline text-on-surface font-black py-3 rounded-xl uppercase tracking-widest hover:bg-surface-container transition-all text-center text-[10px] inline-block"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>

              <div className="mt-6 flex items-center gap-3 p-3 bg-surface-container rounded-xl border border-outline-variant border-dashed">
                <span className="material-symbols-outlined text-primary text-[20px]">local_shipping</span>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase leading-tight">
                  Miễn phí vận chuyển cho đơn hàng từ <span className="text-primary font-black">1.000.000đ</span>
                </p>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
