import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Thêm Link và useNavigate nếu cần điều hướng nút bấm

export default function OrderDetailEmployee() {
  const navigate = useNavigate();

  // Giả lập dữ liệu để đổ vào giao diện
  const orderInfo = {
    id: "VLC-9283",
    status: "ĐANG XỬ LÝ", // Đã Việt hóa status gốc PROCESSING
    date: "24 Th10, 2023 lúc 10:15 AM",
    customer: {
      name: "Marcus Kage",
      initials: "MK",
      email: "mkage@email.com",
      phone: "+84 901 234 567"
    },
    shipping: {
      name: "Marcus Kage",
      address: "123 Lê Lợi, Quận 1, TP. Hồ Chí Minh",
      country: "Việt Nam, 70000"
    },
    items: [
      {
        id: 1,
        name: "Velocity Nitro X1 - Xanh dương",
        sku: "VEL-NX1-BL",
        size: "42",
        qty: 1,
        price: 3000000, // Đổi sang định dạng tiền Việt nếu cần
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop"
      },
      {
        id: 2,
        name: "Áo thun tập luyện AeroFlow - Đen",
        sku: "VEL-AFT-BK",
        size: "L",
        qty: 2,
        price: 800000,
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=200&auto=format&fit=crop"
      }
    ],
    payment: {
      type: "Visa",
      last4: "44",
      expiry: "12/26"
    },
    summary: {
      subtotal: 4600000,
      shipping: 30000,
      tax: 460000,
      total: 5090000
    }
  };

  // Helper định dạng tiền tệ VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] min-h-screen font-['Lexend'] antialiased p-4 md:p-6 space-y-6">

      {/* Thanh hành động tiêu đề đơn hàng */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-3 text-[#434656] hover:text-[#003ec7] transition-colors cursor-pointer group"
          >
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="text-sm font-bold">Quay lại danh sách</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#191c1d] tracking-tight">Đơn hàng #{orderInfo.id}</h2>
            <span className="px-4 py-1.5 bg-[#0052ff] text-[#dfe3ff] text-xs font-bold rounded-full tracking-wider">{orderInfo.status}</span>
          </div>
          <p className="text-[#434656] text-sm">Đặt ngày {orderInfo.date}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="px-6 py-2.5 bg-[#e7e8e9] text-[#191c1d] font-bold rounded-lg flex items-center gap-2 hover:bg-[#e1e3e4] transition-all active:scale-95">
            <span className="material-symbols-outlined text-lg">print</span> In hóa đơn
          </button>
          <button className="px-6 py-2.5 bg-[#003ec7] text-white font-bold rounded-lg flex items-center gap-2 hover:opacity-90 transition-all active:scale-95">
            Cập nhật trạng thái <span className="material-symbols-outlined text-lg">expand_more</span>
          </button>
        </div>
      </section>

      {/* Lưới thông tin chi tiết */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chi tiết khách hàng */}
        <div className="bg-white border border-[#c3c5d9] p-6 rounded-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-[#c3c5d9] pb-4">
            <span className="material-symbols-outlined text-[#003ec7]">person</span>
            <h3 className="text-lg font-bold">Thông tin khách hàng</h3>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-[#b7c4ff] flex items-center justify-center text-[#001452] font-bold text-xl flex-shrink-0">
              {orderInfo.customer.initials}
            </div>
            <div className="space-y-1">
              <p className="text-base font-bold">{orderInfo.customer.name}</p>
              <p className="flex items-center gap-2 text-[#434656] text-sm">
                <span className="material-symbols-outlined text-sm">mail</span> {orderInfo.customer.email}
              </p>
              <p className="flex items-center gap-2 text-[#434656] text-sm">
                <span className="material-symbols-outlined text-sm">call</span> {orderInfo.customer.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Địa chỉ giao hàng */}
        <div className="bg-white border border-[#c3c5d9] p-6 rounded-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-[#c3c5d9] pb-4">
            <span className="material-symbols-outlined text-[#003ec7]">local_shipping</span>
            <h3 className="text-lg font-bold">Địa chỉ giao hàng</h3>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-[#434656] mt-1">location_on</span>
              <div className="text-sm text-[#434656] leading-relaxed">
                <p className="text-[#191c1d] font-bold">{orderInfo.shipping.name}</p>
                <p>{orderInfo.shipping.address}</p>
                <p>{orderInfo.shipping.country}</p>
              </div>
            </div>
            <div className="p-3 bg-[#f3f4f5] rounded-lg text-xs font-bold text-[#506600] flex items-center gap-2">
              <span className="material-symbols-outlined text-sm mr-2">verified</span> ĐỊA CHỈ ĐÃ XÁC MINH
            </div>
          </div>
        </div>
      </section>

      {/* Bảng sản phẩm đơn hàng */}
      <section className="bg-white border border-[#c3c5d9] rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#c3c5d9]">
          <h3 className="text-lg font-bold">Danh sách sản phẩm</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f3f4f5] text-[#434656] uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Sản phẩm</th>
                <th className="px-6 py-4">Mã SKU</th>
                <th className="px-6 py-4">Kích cỡ</th>
                <th className="px-6 py-4">Số lượng</th>
                <th className="px-6 py-4">Đơn giá</th>
                <th className="px-6 py-4 text-right">Tổng cộng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c3c5d9]">
              {orderInfo.items.map((item) => (
                /* Giải pháp Link cho toàn bộ dòng không dùng onClick:
                  1. Đặt thuộc tính `relative` cho thẻ <tr> để làm mốc tọa độ.
                  2. Dùng class `hover:bg-[#0052ff]/5` để người dùng biết dòng này có thể click.
                */
                <tr key={item.id} className="relative hover:bg-[#0052ff]/5 transition-colors group">
                  
                  <td className="px-6 py-4">
                    {/* Thẻ Link ẩn tuyệt đối này sẽ kéo giãn phủ kín 100% diện tích của thẻ <tr> */}
                    <Link 
                      to={`/product/${item.id}`} 
                      className="absolute inset-0 z-0 select-none"
                      aria-label={`Xem chi tiết ${item.name}`}
                    />
                    
                    {/* Các nội dung hiển thị bên dưới cần bọc hoặc có layout để nổi lên trên link nền nếu cần tương tác phụ */}
                    <div className="flex items-center gap-4 relative z-10 pointer-events-none">
                      <div className="w-16 h-16 bg-[#edeeef] rounded-lg overflow-hidden border border-[#c3c5d9] flex-shrink-0">
                        <img alt={item.name} className="w-full h-full object-cover" src={item.image} />
                      </div>
                      <span className="font-bold text-[#191c1d] group-hover:text-[#003ec7] group-hover:underline transition-colors">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 font-mono text-sm text-[#434656]">{item.sku}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-[#e7e8e9] rounded text-xs font-bold">{item.size}</span>
                  </td>
                  <td className="px-6 py-4 font-medium">{item.qty}</td>
                  <td className="px-6 py-4">{formatCurrency(item.price)}</td>
                  <td className="px-6 py-4 text-right font-bold text-[#003ec7]">
                    {formatCurrency(item.price * item.qty)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bố cục bên dưới: Thanh toán & Lịch sử đơn hàng */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tổng kết thanh toán */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#c3c5d9] p-6 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#434656]">Phương thức thanh toán</h3>
                <div className="flex items-center gap-4 p-4 border border-[#c3c5d9] rounded-xl bg-[#f3f4f5]">
                  <div className="w-12 h-8 bg-[#2e3132] rounded flex items-center justify-center">
                    <span className="text-[10px] text-white font-extrabold italic">{orderInfo.payment.type.toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-bold">{orderInfo.payment.type} đuôi {orderInfo.payment.last4}</p>
                    <p className="text-xs text-[#434656]">Hết hạn {orderInfo.payment.expiry}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm text-[#434656]">
                  <span>Tạm tính</span>
                  <span className="font-bold text-[#191c1d]">{formatCurrency(orderInfo.summary.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#434656]">
                  <span>Phí vận chuyển</span>
                  <span className="font-bold text-[#191c1d]">{formatCurrency(orderInfo.summary.shipping)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#434656]">
                  <span>Thuế (VAT)</span>
                  <span className="font-bold text-[#191c1d]">{formatCurrency(orderInfo.summary.tax)}</span>
                </div>
                <div className="h-[1px] bg-[#c3c5d9] my-4"></div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-extrabold">Tổng tiền đơn hàng</span>
                  <span className="text-xl font-extrabold text-[#003ec7]">{formatCurrency(orderInfo.summary.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trạng thái vòng đời hoạt động của đơn hàng */}
        <div className="bg-white border border-[#c3c5d9] p-6 rounded-xl">
          <h3 className="text-lg font-bold mb-6">Lịch sử đơn hàng</h3>
          <div className="relative space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#c3c5d9]">
            <div className="relative flex gap-4 pl-8">
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[#003ec7] flex items-center justify-center z-10">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="font-bold text-[#191c1d]">Đang xử lý</p>
                <p className="text-xs text-[#434656] font-medium">24 Th10, 2023 - 11:30 AM</p>
              </div>
            </div>
            <div className="relative flex gap-4 pl-8">
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[#c3c5d9] flex items-center justify-center z-10">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="font-bold text-[#434656]">Đã xác minh thanh toán</p>
                <p className="text-xs text-[#434656] font-medium">24 Th10, 2023 - 10:20 AM</p>
              </div>
            </div>
            <div className="relative flex gap-4 pl-8">
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[#c3c5d9] flex items-center justify-center z-10">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="font-bold text-[#434656]">Đã đặt đơn hàng thành công</p>
                <p className="text-xs text-[#434656] font-medium">24 Th10, 2023 - 10:15 AM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-20 md:hidden"></div>

      {/* Thanh Menu điều hướng phía dưới dành cho phiên bản Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#c3c5d9] flex justify-around items-center py-2 px-4 z-50 md:hidden">
        <button className="flex flex-col items-center gap-1 p-2 text-[#434656]">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-bold">Tổng quan</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-[#003ec7]">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
          <span className="text-[10px] font-bold">Đơn hàng</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-[#434656]">
          <span className="material-symbols-outlined">inventory_2</span>
          <span className="text-[10px] font-bold">Kho hàng</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-[#434656]">
          <span className="material-symbols-outlined">group</span>
          <span className="text-[10px] font-bold">Tài khoản</span>
        </button>
      </nav>
    </div>
  );
}