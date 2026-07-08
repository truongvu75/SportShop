import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function ProfileSidebar() {
    const location = useLocation();

    const menuItems = [
        { name: 'Lịch sử đơn hàng', icon: 'history', path: '/order/order-history' },
        { name: 'Lịch sử đánh giá', icon: 'history', path: '/profile/reviews-history' },
        { name: 'Thông tin cá nhân', icon: 'person', path: '/profile', exact: true },
        { name: 'Đổi mật khẩu', icon: 'lock', path: '/profile/change-password' }
    ];

    return (
        <aside className="lg:col-span-4 space-y-6">
            {/* User Profile Card - Compact */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant flex flex-col items-center text-center shadow-sm">
                <div className="relative mb-3">
                    <img
                        alt="User Avatar"
                        className="w-20 h-20 rounded-full object-cover border-4 border-secondary-container shadow-md"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDR1Ir5H3cOUC4i5EoaVmiRCIkN9NpJNLb_u_3UDDl5IvuvKVrKtYkFQ6y2II1P0iCTh48V_YrzteJqkjwSqaaoZLaVp5aazasBD3hIpuVBQchIlUC8ix4ETonzCAF3XthktxeUQAlWWN0z0glhdyGfHSOTZASlLRwLnzfcolzJeiBjc6CL14dR9STijWRf0uwhpO5gFHDpSu56RJDHXOJSE8uEAswVbtDnDUQY9UpA84_o0UYDscAarDcYldSzDT3AYwsVRL_kTQo"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm">
                        Platinum
                    </div>
                </div>
                <h2 className="text-base font-black text-on-surface uppercase tracking-tight">Trần Vũ</h2>
                <p className="text-[10px] text-on-surface-variant font-bold opacity-70 uppercase tracking-widest">Thành viên từ 2022</p>
            </div>

            {/* Sidebar Navigation - Compact */}
            <nav className="flex flex-col bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
                {menuItems.map((item) => {
                    const isActive = item.exact
                        ? location.pathname === item.path
                        : location.pathname.startsWith(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-5 py-3.5 transition-all border-l-4 ${isActive
                                ? 'bg-primary/5 text-primary border-l-primary font-black'
                                : 'text-on-surface-variant hover:bg-surface-container border-l-transparent font-bold'
                                }`}
                        >
                            <span className={`material-symbols-outlined text-lg ${isActive ? 'fill-1' : ''}`}>
                                {item.icon}
                            </span>
                            <span className="text-[11px] uppercase tracking-wider">{item.name}</span>
                        </Link>
                    );
                })}
                <button className="flex items-center gap-3 px-5 py-3.5 text-error hover:bg-error/5 transition-all font-bold border-t border-outline-variant/30 border-l-4 border-l-transparent">
                    <span className="material-symbols-outlined text-lg">logout</span>
                    <span className="text-[11px] uppercase tracking-wider">Đăng xuất</span>
                </button>
            </nav>
        </aside>
    );
}
