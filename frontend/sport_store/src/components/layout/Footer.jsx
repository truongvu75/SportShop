import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full pt-16 pb-8 px-margin-desktop bg-[#191c1d] text-[#e5e2e3] border-t border-[#676667]/30">
      <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">

        {/* Cột 1: Brand & Intro - Chiếm 4 cột */}
        <div className="md:col-span-4 space-y-6">
          <Link className="text-3xl font-black tracking-tighter text-white" to="/">
            VELOCITY
          </Link>
          <p className="text-sm text-[#c8c6c7] leading-relaxed max-w-[300px]">
            Chúng tôi cung cấp trang thiết bị thể thao đỉnh cao để giúp bạn vượt qua mọi rào cản và đạt được hiệu suất tối đa.
          </p>
          <div className="flex gap-4">
            {/* Social Icons - Tối ưu lại màu sắc */}
            {[
              { alt: "FB", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAF40ymyp2GtD3kTFLEeZNYwywmdOdoQWFM8yWiCPB6eVO598bFzDexUueArbrcj3AdLRbYuxtj1Y9iY8SXXNAp9yIRuIjEhixK0oST1Lf8f66pNGB-4wudBa0n833m4rimS38USQkPJk90ySDieXp3rvgaeFTpNO2MuZH-xKF9vvd_ZPyV07IAPxgOXXuzaK1F-AB2fs6wm5YcyiJSL4oMqI0Uk3yD5dcFbIJjPAhoSez6iVc0EC3AyS244WpI1K-ZWyG2Rm5y76Q" },
              { alt: "IG", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBPjITslWdzlrn_y8Pn9F6uhr1L-Ldmj0Ltbhfdme3eM9SE0Swz3_K7x0gMEHy9qNG8yEoMJCNc2q05qcHfwBppcMdwLuw9KhJyr7B-f_WEzSNhpSA8BnZUjDrB5MNJCzMrhc5B7PJTvZLOwtinjQ3lvKBmZSz3bV0qfvO5BRLxUDH8zFF-t_p1MJ2fIbCWwVXq_zKsqe_oXupwj26KNxlApeYuZvqAexygBnxTxzruh_AeMtkBG-DaVP1nkQkjJlGJD64x4cuacM" },
              { alt: "TK", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYhqnMDyxIB8JOSYPjTd-QTGzgSkd1qv53BcUda87imVjoKTTuoQMJFejeW4DxfEdqgOE-3PeI23UCQEzQ__ND4SQ-vIO1un2Wcr7SR0oerJz7qXUed8XvO9hTUu3n5vBWNnL9S0IXLi9M8ibt-RE20lI-poDBE3TyiR1I2LeFaub7PccLmIGRxS6ZquwaKO5Ycu4s69N19bogeHxgnQIATVc2epnCLlhmn9OENAKIPRJOZFzJf1zmvS-ATlOnyHdAHCiJibPNtM8" }
            ].map((social, idx) => (
              <a key={idx} className="w-9 h-9 rounded-full border border-[#676667] flex items-center justify-center hover:bg-white hover:border-white transition-all group" href="#">
                <img alt={social.alt} className="w-4 h-4 invert group-hover:invert-0 transition-all" src={social.src} />
              </a>
            ))}
          </div>
        </div>

        {/* Cột 2: Quick Links - Chiếm 4 cột */}
        <div className="md:col-span-4 grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <h4 className="text-white font-bold text-[12px] uppercase tracking-widest">Hỗ trợ</h4>
            <nav className="flex flex-col gap-3 text-[13px] font-medium text-[#c8c6c7]">
              <Link className="hover:text-white transition-colors" to="#">Về chúng tôi</Link>
              <Link className="hover:text-white transition-colors" to="#">Hệ thống cửa hàng</Link>
              <Link className="hover:text-white transition-colors" to="#">Liên hệ</Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-bold text-[12px] uppercase tracking-widest">Chính sách</h4>
            <nav className="flex flex-col gap-3 text-[13px] font-medium text-[#c8c6c7]">
              <Link className="hover:text-white transition-colors" to="#">Đổi trả & Hoàn tiền</Link>
              <Link className="hover:text-white transition-colors" to="#">Điều khoản dịch vụ</Link>
              <Link className="hover:text-white transition-colors" to="#">Chính sách bảo mật</Link>
            </nav>
          </div>
        </div>

        {/* Cột 3: Newsletter - Chiếm 4 cột */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-white font-bold text-[12px] uppercase tracking-widest">Đăng ký nhận tin</h4>
          <p className="text-[12px] text-[#c8c6c7]">Nhận thông báo về các sản phẩm mới và ưu đãi độc quyền.</p>
          <div className="relative flex items-center bg-[#2a2d2e] rounded-xl p-1 border border-[#676667]/30 focus-within:border-white transition-all">
            <input
              type="email"
              placeholder="Email của bạn..."
              className="bg-transparent border-none outline-none pl-3 w-full text-xs text-white placeholder:text-[#676667]"
            />
            <button className="bg-white text-black px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-[#c3f400] transition-colors">
              Gửi
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-8 border-t border-[#676667]/20 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] text-[#676667] font-bold uppercase tracking-widest">
          © 2026 VELOCITY SQUAD. MADE FOR PERFORMANCE.
        </p>
        <div className="flex gap-6 text-[10px] font-bold text-[#676667] uppercase tracking-tighter">
          <span>Vietnam Edition</span>
          <span>Privacy Priority</span>
        </div>
      </div>
    </footer>
  );
}