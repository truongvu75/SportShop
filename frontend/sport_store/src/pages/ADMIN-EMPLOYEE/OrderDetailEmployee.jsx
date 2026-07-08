import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'; // Thêm Link và useNavigate nếu cần điều hướng nút bấm
import orderApi from '../../api/orderApi';

export default function OrderDetailEmployee() {
  const navigate = useNavigate();

  const { id } = useParams();
  const [order, setOrder] = useState([]);

  const fetchOrder = async () => {
    //Gọi API lấy thông tin order
    try {
      const response = await orderApi.getOrderById(id);
      setOrder(response);
      // response.items.forEach(element => {
      //   console.log(`Mã sản phẩm ${element.orderDetailID}`)
      // });
    } catch (error) {
      console.log(error, "Không tải được chi tiết đơn hàng!");
    }
  };

  useEffect(() => {
    console.log(`Mã của đơn hàng ${id}`);
    fetchOrder();
  }, []);


  // Helper định dạng tiền tệ VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getInitials = (name) => {
    if (!name) return "";

    // Tách tên thành mảng các từ (ví dụ: ["Trường", "Vũ"])
    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase(); // Nếu chỉ có 1 từ -> lấy 1 chữ đầu
    }

    // Nếu có nhiều từ -> lấy chữ đầu của từ đầu và từ cuối (ví dụ: "Nguyễn Trường Vũ" -> "NV")
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
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
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#191c1d] tracking-tight">Đơn hàng #{order.orderID}</h2>
            <span className={`px-4 py-1.5 ${order.statusID === 4 ? 'bg-green-500' : 'bg-gray-500'} text-black text-xs font-bold rounded-full tracking-wider`}>{order.statusDescription}</span>
          </div>
          <p className="text-[#434656] text-sm">Ngày đặt hàng {order.orderTime}</p>
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
              {getInitials(order.customerName)}
            </div>
            <div className="space-y-1">
              <p className="text-base font-bold">{order.customerName}</p>
              <p className="flex items-center gap-2 text-[#434656] text-sm">
                <span className="material-symbols-outlined text-sm">location_on</span> {order.deliveryProvince}
              </p>
              <p className="flex items-center gap-2 text-[#434656] text-sm">
                <span className="material-symbols-outlined text-sm">call</span> ###
              </p>
              <p className="text-base text-sm text-[#434656]">Mã khách hàng: {order.customerID}</p>
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
                <p className="text-[#191c1d] font-bold">{order.deliveryAddress}</p>
                <p>{order.deliveryProvince}</p>
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
                <th className="px-4 py-4">Mã sản phẩm</th>
                <th className="px-4 py-4">Kích cỡ</th>
                <th className="px-4 py-4">Màu sắc</th>
                <th className="px-4 py-4">Số lượng</th>
                <th className="px-4 py-4">Đơn giá</th>
                <th className="px-4 py-4 text-right">Tổng cộng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c3c5d9]">
              {order && order.items && order.items.map((item) => (
                /* Giải pháp Link cho toàn bộ dòng không dùng onClick:
                  1. Đặt thuộc tính `relative` cho thẻ <tr> để làm mốc tọa độ.
                  2. Dùng class `hover:bg-[#0052ff]/5` để người dùng biết dòng này có thể click.
                */
                <tr key={item.orderDetailID} className="relative hover:bg-[#0052ff]/5 transition-colors group">

                  <td className="px-4 py-4">
                    {/* Thẻ Link ẩn tuyệt đối này sẽ kéo giãn phủ kín 100% diện tích của thẻ <tr> */}
                    {/* <Link
                      to={`/product/${item.orderDetailID}`}
                      className="absolute inset-0 z-0 select-none"
                      aria-label={`Xem chi tiết ${item.productName}`}
                    /> */}

                    {/* Các nội dung hiển thị bên dưới cần bọc hoặc có layout để nổi lên trên link nền nếu cần tương tác phụ */}
                    <div className="flex items-center gap-4 relative z-10 pointer-events-none">
                      <div className="w-16 h-16 bg-[#edeeef] rounded-lg overflow-hidden border border-[#c3c5d9] flex-shrink-0">
                        <img alt={item.productName} className="w-full h-full object-cover" src={item.photo} />
                      </div>
                      <span className="font-bold text-[#191c1d] group-hover:text-[#003ec7] group-hover:underline transition-colors">
                        {item.productName}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4 font-bold text-sm text-[#434656]">#{item.productID}</td>
                  <td className="px-4 py-4">
                    <span className="px-4 py-1 bg-[#e7e8e9] rounded text-xs font-bold">{item.sizeName}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span style={{ backgroundColor: item.hexCode ? item.hexCode : '#e7e8e9' }} className={`px-4 py-1 rounded text-xs ${item.hexCode === '#000000' ? 'text-gray-200' : 'text-[#191c1d]'} font-bold`}>{item.colorName}</span>
                  </td>
                  <td className="px-4 py-4 font-medium">{item.quantity}</td>
                  <td className="px-4 py-4">{formatCurrency(item.salePrice)}</td>
                  <td className="px-4 py-4 text-right font-bold text-[#003ec7]">
                    {formatCurrency(item.salePrice * item.quantity)}
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
                    <span className="text-[10px] text-white font-extrabold italic">{order.payMethod}</span>
                  </div>
                  <div>
                    {/* <p className="font-bold">{order.payment.type} đuôi {order.payment.last4}</p> */}
                    {/* <p className="text-xs text-[#434656]">Hết hạn {order.payment.expiry}</p> */}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm text-[#434656]">
                  <span>Tạm tính</span>
                  <span className="font-bold text-[#191c1d]">{formatCurrency(order.totalAmount)}</span>
                </div>
                {/* <div className="flex justify-between text-sm text-[#434656]">
                  <span>Phí vận chuyển</span>
                  <span className="font-bold text-[#191c1d]">{formatCurrency(order.summary.shipping)}</span>
                </div> */}
                {/* <div className="flex justify-between text-sm text-[#434656]">
                  <span>Thuế (VAT)</span>
                  <span className="font-bold text-[#191c1d]">{formatCurrency(order.summary.tax)}</span>
                </div> */}
                <div className="h-[1px] bg-[#c3c5d9] my-4"></div>
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold">Tổng tiền đơn hàng</span>
                  <span className="text-xl font-extrabold text-[#003ec7]">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>

              <div className="w-max">
                <h3 className="text-xs font-bold uppercase text-[#434656]">Thông tin thêm</h3>
                <div className="grid grid-cols-1">
                  <p className="text-sm font-medium text-gray-700">Nhân viên giao hàng: <span className='font-bold uppercase'>{order.shipperName !== null ? order.shipperName : "Chưa có thông tin.."}</span></p>
                  <p className="text-sm font-medium text-gray-700">Nhân viên xử lý đơn hàng: <span className='font-bold uppercase'>{order.employeeName !== null ? order.employeeName : "Chưa có thông tin.."}</span></p>
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
                <p className="font-bold text-[#191c1d]">Thời gian đặt hàng</p>
                <p className="text-xs text-[#434656] font-medium">{order.orderTime}</p>
              </div>
            </div>
            <div className="relative flex gap-4 pl-8">
              <div className={`absolute left-0 top-1 w-6 h-6 rounded-full ${order.acceptTime ? 'bg-[#003ec7]' : 'bg-[#c3c5d9]'} flex items-center justify-center z-10`}>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <p className={`font-bold ${order.acceptTime ? 'text-[#191c1d]' : 'text-[#434656]'}`}>Thời gian duyệt đơn hàng</p>
                <p className="text-xs text-[#434656] font-medium">{order.acceptTime}</p>
              </div>
            </div>

            <div className="relative flex gap-4 pl-8">
              <div className={`absolute left-0 top-1 w-6 h-6 rounded-full ${order.shippedTime ? 'bg-[#003ec7]' : 'bg-[#c3c5d9]'} flex items-center justify-center z-10`}>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <p className={`font-bold ${order.shippedTime ? 'text-[#191c1d]' : 'text-[#434656]'}`}>Thời gian giao cho đơn vị vận chuyển</p>
                <p className="text-xs text-[#434656] font-medium">{order.shippedTime}</p>
              </div>
            </div>

            <div className="relative flex gap-4 pl-8">
              <div className={`absolute left-0 top-1 w-6 h-6 rounded-full ${order.finishedTime ? 'bg-[#003ec7]' : 'bg-[#c3c5d9]'} flex items-center justify-center z-10`}>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <p className={`font-bold ${order.finishedTime ? 'text-[#191c1d]' : 'text-[#434656]'}`}>Thời gian nhận hàng</p>
                <p className="text-xs text-[#434656] font-medium">{order.finishedTime}</p>
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