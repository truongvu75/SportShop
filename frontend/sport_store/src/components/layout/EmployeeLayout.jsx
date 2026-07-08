import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import HeaderAdmin from './Header-Admin';
import SidebarAdmin from './Sidebar-Admin';

export default function EmployeeLayout() {
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();

    // Check active path for mobile bottom navigation highlight
    const isActive = (path) => location.pathname === path;

    return (
        <div className="bg-[#f8f9fa] text-[#191c1d] min-h-screen font-['Lexend'] text-sm">
            {/* Header chung cho Nhân viên */}
            <HeaderAdmin 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                onSearchSubmit={(query) => console.log('Searching for:', query)} 
            />

            {/* Sidebar chung cho Nhân viên (chỉ hiện trên desktop) */}
            <SidebarAdmin />

            {/* Vùng nội dung động cho các trang nghiệp vụ */}
            <main className="pt-14 pb-14 md:pb-6 md:pl-56 min-h-screen">
                <div className="py-4 px-4 md:px-8 max-w-7xl mx-auto">
                    <Outlet context={{ searchQuery, setSearchQuery }} />
                </div>
            </main>

            {/* BottomNavBar chung cho Mobile */}
            <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-14 pb-safe bg-white border-t border-[#c3c5d9] shadow-lg md:hidden z-50">
                <Link 
                    to="/employee/dashboard" 
                    className={`flex flex-col items-center justify-center ${
                        isActive('/employee/dashboard') ? 'text-[#003ec7] font-bold scale-105' : 'text-[#434656]'
                    }`}
                >
                    <span className="material-symbols-outlined text-xl">home</span>
                    <span className="text-[9px] font-bold uppercase tracking-wide">Home</span>
                </Link>
                <Link 
                    to="/employee/orders-management" 
                    className={`flex flex-col items-center justify-center ${
                        isActive('/employee/orders-management') ? 'text-[#003ec7] font-bold scale-105' : 'text-[#434656]'
                    }`}
                >
                    <span className="material-symbols-outlined text-xl">list_alt</span>
                    <span className="text-[9px] font-bold uppercase tracking-wide">Orders</span>
                </Link>
                <Link 
                    to="/employee/reviews" 
                    className={`flex flex-col items-center justify-center ${
                        isActive('/employee/reviews') ? 'text-[#003ec7] font-bold scale-105' : 'text-[#434656]'
                    }`}
                >
                    <span className="material-symbols-outlined text-xl">forum</span>
                    <span className="text-[9px] font-bold uppercase tracking-wide">Reviews</span>
                </Link>
            </nav>
        </div>
    );
}
