import React from 'react';
import { Outlet } from 'react-router-dom';
import LeftSide from './LeftSide';

export default function AuthLayout() {
    return (
        <main className="min-h-screen flex flex-col md:flex-row bg-surface font-['Lexend']">
            <LeftSide />

            <section className="flex-1 flex flex-col bg-surface">
                {/* 
                   ĐIỀU CHỈNH TẠI ĐÂY:
                   - pt-8: Khoảng cách từ đỉnh cực thấp (khoảng 32px) trên mobile.
                   - md:pt-16: Khoảng cách cố định trên desktop (không dùng % hay vh nữa).
                   - items-start kết hợp với padding cố định sẽ khóa vị trí form lại.
                */}
                <div className="flex-grow flex items-start justify-center pt-8 md:pt-6 sm:px-12 md:px-10 lg:px-20">
                    <div className="w-full max-w-[440px] mx-auto">
                        <Outlet />
                    </div>
                </div>

                <footer className="p-6 text-center border-t border-surface-container-low bg-surface">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">
                        © 2024 VELOCITY Energy. All rights reserved.
                    </p>
                </footer>
            </section>
        </main>
    );
}