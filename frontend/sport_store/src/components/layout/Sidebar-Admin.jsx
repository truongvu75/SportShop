import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function SidebarAdmin() {
    const location = useLocation();

    // Định nghĩa cấu trúc danh sách Menu chính
    const menuItems = [
        { name: 'Trang chủ', path: '/employee/dashboard', icon: 'dashboard' },
        { name: 'Đơn hàng', path: '/employee/orders-management', icon: 'shopping_cart' },
        { name: 'Đánh giá', path: '/employee/reviews', icon: 'rate_review' },
        { name: 'Quản lý sản phẩm', path: '/employee/products', icon: 'inventory_2' },
        { name: 'Quản lý loại hàng', path: '/employee/categories', icon: 'category' },
        { name: 'Quản lý khách hàng', path: '/employee/customers', icon: 'people' },
        { name: 'Quản lý nhân viên', path: '/employee/employees', icon: 'person' }
    ];

    // Định nghĩa danh sách Menu phụ ở dưới cùng
    const bottomItems = [
        { name: 'Support', path: '/employee/support', icon: 'help' },
        { name: 'Logout', path: '/auth/logout', icon: 'logout' },
    ];

    // Hàm kiểm tra xem Link hiện tại có đang được truy cập hay không
    const isActive = (path) => location.pathname === path;

    return (
        <aside className="fixed left-0 top-0 h-full w-56 hidden md:flex flex-col bg-[#edeeef] py-4 gap-1 z-40">
            {/* Brand Logo & Title */}
            <div className="px-5 mb-5 mt-10">
                <h2 className="text-lg font-extrabold text-[#003ec7] italic">VELOCITY</h2>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#434656] opacity-70">Staff Portal</p>
            </div>

            {/* Navigation Menu Chính */}
            <nav className="flex-1 px-1.5 space-y-0.5">
                {menuItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-2.5 rounded-md px-3 py-2 mx-1.5 transition-all duration-150 ${active
                                ? 'bg-[#0052ff] text-white scale-95 shadow-md font-bold'
                                : 'text-[#434656] hover:bg-[#e1e3e4] active:scale-95'
                                }`}
                        >
                            <span
                                className="material-symbols-outlined text-lg"
                                style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
                            >
                                {item.icon}
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wide">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Menu (Support & Logout) */}
            <div className="mt-auto px-1.5 space-y-0.5 border-t border-[#c3c5d9] pt-3">
                {bottomItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-2.5 rounded-md px-3 py-2 mx-1.5 transition-all duration-150 ${active
                                ? 'bg-[#0052ff] text-white scale-95 shadow-md font-bold'
                                : 'text-[#434656] hover:bg-[#e1e3e4] active:scale-95'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">{item.icon}</span>
                            <span className="text-xs font-bold uppercase tracking-wide">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </aside>
    );
}