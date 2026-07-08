import React from 'react';

export default function LeftSide() {
    return (
        <section className="relative w-full md:w-[45%] lg:w-[55%] min-h-[400px] md:h-screen md:sticky md:top-0 overflow-hidden bg-inverse-surface flex-shrink-0">
            {/* Gradient Overlay - Tăng độ đậm ở dưới để nổi bật chữ */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-inverse-surface via-transparent to-transparent opacity-80"></div>

            {/* Brand Background Image */}
            <img
                alt="Velocity Energy Background"
                className="w-full h-full object-cover grayscale contrast-125 opacity-60"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQ1CnDj60_-W4gdhxgKYeeb-fbqx0RdSrE9o_KzrQglaSxLe_UachrJmPm90OieOXrJKrMfCIYOsbBCZstR8G8CaUlSXzQIHhBKCzpmjeiO5s-GEc6cjZddEmXfmc6aNbpTGj6hQmmexLaSS6cM0139EidhzOfLfzkM1PFO9HeEj1sYWkIPCIzN2LJqiOGXxNz3xyXdIh6AcE0Z9hJwp2tfbhRJSCS7ObgxjdhQ31O_cizvMmMhw1T8B36qStzfM2q1zgVLLx6-wI"
            />

            {/* Brand Overlay Content */}
            <div className="absolute inset-0 z-20 flex flex-col justify-between p-8 md:p-12 lg:p-16">
                <div className="flex items-center gap-2">
                    <span className="text-2xl lg:text-3xl font-black tracking-tighter text-secondary-fixed uppercase">VELOCITY</span>
                </div>

                <div className="max-w-xl mb-4 md:mb-0">
                    {/* 
                      ADJUSTED: 
                      - Đổi leading-[1.1] thành leading-tight để tránh mất chân chữ.
                      - Thêm padding-bottom nhỏ (pb-2) để các chữ có dấu tiếng Việt không bị cắt.
                    */}
                    <h1 className="text-on-primary font-black text-4xl md:text-5xl lg:text-7xl leading-tight mb-4 tracking-tighter uppercase italic pb-2">
                        BÙNG NỔ<br />NĂNG LƯỢNG
                    </h1>

                </div>
            </div>

            {/* Decorative Floating Element */}
            <div className="absolute top-1/2 right-6 -translate-y-1/2 hidden xl:block opacity-10 select-none pointer-events-none">
                <span className="text-[120px] font-black text-white leading-none vertical-text tracking-tighter uppercase italic">SPEED</span>
            </div>
        </section>
    );
}