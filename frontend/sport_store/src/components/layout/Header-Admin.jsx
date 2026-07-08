import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function HeaderAdmin({ searchQuery, setSearchQuery, onSearchSubmit, onMenuClick }) {
    const { username, roles, logout } = useAuth();
    const navigate = useNavigate();

    const isEmployee = roles?.includes('ROLE_EMPLOYEE');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (onSearchSubmit) {
            onSearchSubmit(searchQuery);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-14 bg-white border-b border-[#c3c5d9]">
            {/* Khối bên trái: Nút Menu Mobile & Thương hiệu */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick || (() => {})}
                    className="md:hidden p-1.5 text-[#434656] active:scale-95 transition-transform"
                >
                    <span className="material-symbols-outlined text-xl">menu</span>
                </button>
                <h1 className="text-xl font-extrabold text-[#003ec7] italic tracking-tighter">VELOCITY Team</h1>
            </div>

            {/* Khối bên phải: Thanh tìm kiếm & Các nút tương tác */}
            <div className="flex items-center gap-3 md:gap-4">
                {/* Thanh tìm kiếm — ẩn trên Mobile */}
                <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center bg-[#f3f4f5] px-3 py-1.5 rounded-full border border-[#c3c5d9] focus-within:border-[#003ec7] transition-all">
                    <span className="material-symbols-outlined text-base text-[#737688]">search</span>
                    <input
                        className="bg-transparent border-none focus:ring-0 text-xs w-52 outline-none ml-1.5 text-[#191c1d]"
                        placeholder="Tìm kiếm đơn hàng..."
                        type="text"
                        value={searchQuery || ''}
                        onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                    />
                </form>

                {/* Nhóm: Thông báo + Thông tin tài khoản */}
                <div className="flex items-center gap-2">
                    {/* Chuông thông báo */}
                    <button className="p-1.5 text-[#434656] hover:text-[#003ec7] transition-colors relative active:scale-95">
                        <span className="material-symbols-outlined text-xl">notifications</span>
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#ba1a1a] rounded-full border border-white"></span>
                    </button>

                    {/* Divider */}
                    <div className="h-5 w-px bg-[#c3c5d9]"></div>

                    {/* Thông tin tài khoản đăng nhập */}
                    {username ? (
                        <div className="flex items-center gap-2 group relative">
                            {/* Avatar + Tên */}
                            <div className="flex items-center gap-2 cursor-pointer select-none">
                                <div className="h-7 w-7 rounded-full bg-[#003ec7] flex items-center justify-center text-white text-[11px] font-extrabold border border-[#c3c5d9] flex-shrink-0">
                                    {username.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="hidden md:block leading-tight">
                                    <p className="text-xs font-bold text-[#191c1d] truncate max-w-[100px]">{username}</p>
                                    {isEmployee && (
                                        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#003ec7] bg-[#0052ff]/10 px-1.5 py-0.5 rounded">
                                            Nhân viên
                                        </span>
                                    )}
                                </div>
                                <span className="material-symbols-outlined text-sm text-[#434656] hidden md:inline">expand_more</span>
                            </div>

                            {/* Dropdown Menu (hover) */}
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg border border-[#c3c5d9] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                <div className="px-4 py-3 border-b border-[#c3c5d9]">
                                    <p className="text-xs font-bold text-[#191c1d] truncate">{username}</p>
                                    {isEmployee && (
                                        <p className="text-[10px] text-[#434656] mt-0.5">Quyền: Nhân viên</p>
                                    )}
                                </div>
                                <div className="p-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdad6] rounded-md transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-base">logout</span>
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Chưa đăng nhập — hiển thị nút Login */
                        <button
                            onClick={() => navigate('/login')}
                            className="flex items-center gap-1.5 text-xs font-bold text-[#003ec7] hover:text-[#0052ff] transition-colors"
                        >
                            <span className="material-symbols-outlined text-base">login</span>
                            <span className="hidden md:inline">Đăng nhập</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}