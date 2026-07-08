import React from 'react';
import { Link } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: "Velocity Nitro X1 - Blue",
    price: "2.450k",
    rating: "4.9",
    reviews: "128",
    sold: "1.2k",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDftHjJBF79nzrcwfBZoEipsGuR8bstoedt5fxnOzcL4MC-VMzPEPSSSjUVYGVsTOTQ5_ZK5S9m3CSp2aRqy8Xvcld3UeigXn0n6ii7m1usQ5rJ7J-eSYxMOj2BNEAeY8sc2m3HbY8m22kPoTi6SCEgRwRIk5GKvK1YZXMKtHPLM9AjO4fFVSRFRNW4oWAang12hQQc0eYSxzCV97LZ8wAdRd5srkMi2VQt7hTI3XEwkGx-rkyGkL_Q7pusV2oJYQGYF20pfAFm-V4",
    badge: "NEW",
  },
  {
    id: 2,
    name: "AeroFlow Training Tee",
    price: "890k",
    rating: "4.8",
    reviews: "85",
    sold: "450",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhvURrNV2hIj4TuuUC6xwqRN3Fkr-QPgfzD0Sk7yWn-YNifL_-vfrZde4acqINW5rlclj0qIgez3XtYFGyAAi-Q7Hm8fgC9EwtDHL9tD9VtgXyNa0dnJC6iHOg8CT84F8XGV1Whab1SgrYssmHnhBYRsbHuZu5s5xgFEaUENV904iJfGHCZT-v0mdUjTJsusqgRqMCdeF6lo5XWXwV0DwXyef7T_FZRRGFIaroMomsyFGZkzUAjr4Mu8aWGVGlz2NQgR4OPSsKwPY",
  },
  {
    id: 3,
    name: "Velocity Power Shorts",
    price: "650k",
    rating: "4.7",
    reviews: "210",
    sold: "2.1k",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA7A4Ek8RtnEH_qXgJK0lgP7_EbFuWJPN1wwszxPJZdUlW247fXWFjNsfLxwJ6SPJaPdQNzv_kE0cM9IVXi4yJ1hpqzNIp0ALso64nLdbA27Mmpqp0dR_GClxokGzSEbIKj5NEn6tG8xoCithZ_qIDzhFd6UvZwPmndqRKy55FeNVI6gE2urN-ccGxkpzisKc-rVWvaBO2PAviFCr1kjj1fkxe2TnJbtdsznJoAAPDaCp_MyuljpR-MmvH1YDScgSxlP1vXOHykHc",
  },
  {
    id: 4,
    name: "Elite Stealth Gym Bag",
    price: "1.150k",
    rating: "5.0",
    reviews: "340",
    sold: "890",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhhbVNjCRLYeYk2Frx2UPKibl3B4pNYeJUXVI68dn5ZfsBJoKriU8nsC-zfKq07GEJWePOYuSI0MGDw0RahjlFz-FKCdq08oo16pNGwoGXO-0iXpDIugTmeODm-tEIJdlx5pgBcQbumLyPDvMATtO7wy27BNiNv1H0S7C6d4kDbTY_0cjhaVgovlirvPuOM0nKk_zoghmhg-hChU-WjkurDm98AswkJRLPNoeYz52AdU95tFC51GoZGaz7EoLG1gulGJyrNHEbS9M",
    badge: "BEST SELLER",
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - REDUCED HEIGHT (550px) - STRICT HTML STYLE */}
      <section className="relative h-[800px] w-full flex items-center overflow-hidden bg-[#191c1d]">
        <div className="absolute inset-0 opacity-60">
          <img
            alt="Athlete Motivation"
            className="w-full h-full object-cover object-top"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuADwAwhYH8pWLZbAAhxTU0CYENV9SOSYWNITpqkMPyGGVcfCocigoP0-Kb2zdbu6OxdRip_6wJOkIlTNCIz29JkHSjaCg0xu-o31DB1zsg0JQ7srNjJLWfBOTPs-viHxjRCHSEDBb2voFzr6ho9DBs2_0lElVvu_3OJrf9Ww5u1VJO5j00fXgwOi6Ko46e_hc2nhvpvSFE6My7Lgfc1RjrfvjfjRTCj_FkclfZEK-oUaAHC2s2pDtN9oztQANFWoD6z6_tgtmbDL8U"
          />
        </div>
        <div className="relative z-10 px-[40px] max-w-[1600px] mx-auto w-full text-left">
          <h1 className="text-display-lg text-5xl md:text-7xl text-[#f8f9fa] font-black leading-tight tracking-tighter mb-6">
            BỨT PHÁ <br /><span className="text-[#c1f100]">GIỚI HẠN</span>
          </h1>
          <p className="text-body-lg text-[#f3f4f5] mb-8 max-w-2xl">
            Khám phá dòng sản phẩm hiệu năng cao mới nhất, được thiết kế để tối ưu hóa từng chuyển động của bạn. Công nghệ vải tản nhiệt và trợ lực độc quyền.
          </p>
          <div className="flex gap-6">
            <Link to="/product" className="bg-[#003ec7] text-white px-8 py-4 rounded-lg font-bold text-lg hover:scale-105 active:scale-95 transition-all inline-block text-center">
              MUA NGAY
            </Link>
            <Link to="/product" className="border-2 border-[#c1f100] text-[#c1f100] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#c1f100] hover:text-[#161e00] transition-all inline-block text-center">
              KHÁM PHÁ BỘ SƯU TẬP
            </Link>
          </div>
        </div>
      </section>

      {/* Product Grid Section - STRICT HTML FORMAT */}
      <section className="py-12 px-[40px]">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[#003ec7] font-bold tracking-widest uppercase">Thịnh hành</span>
            <h2 className="text-4xl font-black mt-2">SẢN PHẨM MỚI NHẤT</h2>
          </div>
          <a className="text-[#003ec7] font-bold flex items-center gap-1 hover:underline" href="#">Xem tất cả <span className="material-symbols-outlined">arrow_forward</span></a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group flex flex-col bg-[#f3f4f5] rounded-xl overflow-hidden border border-transparent hover:border-[#c3c5d9] hover:shadow-2xl transition-all">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src={product.image}
                />
                {product.badge && (
                  <span className={`absolute top-4 left-4 ${product.badge === 'NEW' ? 'bg-[#c1f100] text-[#546b00]' : 'bg-[#003ec7] text-white'} text-xs font-bold px-3 py-1 rounded-full uppercase`}>
                    {product.badge}
                  </span>
                )}
                <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform bg-gradient-to-t from-[#191c1d]/80 to-transparent">
                  <button className="w-full bg-white text-[#191c1d] font-bold py-2 rounded-lg flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">dry_cleaning</span>
                    Thử đồ (AR)
                  </button>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow text-left">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
                  <span className="text-[#003ec7] font-black">{product.price}</span>
                </div>
                <div className="mt-auto flex justify-between items-center text-[#434656] text-sm font-medium">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[#abd600] text-[18px] fill-1">star</span>
                    <span>{product.rating} ({product.reviews})</span>
                  </div>
                  <span className="bg-[#e1e3e4] px-2 py-0.5 rounded text-[11px]">Đã bán {product.sold}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid Category Section - REDUCED HEIGHT (550px) - STRICT HTML FORMAT */}
      <section className="py-12 px-[40px] bg-[#edeeef]">
        <h2 className="text-4xl font-black mb-12 text-center">BỘ SƯU TẬP CHUYÊN BIỆT</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[550px]">
          <div className="md:col-span-2 md:row-span-2 relative rounded-xl overflow-hidden group">
            <img alt="Gym" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtBQ8w54JhT4ca6AP5IbVyZqcvzHUq88JkGVLBJwBg6s19ODXDccnjO8eaB4uHfsDnbwYwIQXnuQAxOUtrFH0uUxZ2KzY1_B39dFdOujAN94VvHCUu7mgZHaAiQmlHsOcFKhBj3vN1s8SBL0aWhrekZWQ4aAnwXjCZaVqKcbtAp1lwtrZWNDQi-vEGqBnxegTpLB1wctdcao36qJBChquV_iD9Ao9_eoSk7cMZUtq8DWnVeoMMpx69ZVrTlXjhJ7Ggmx6afeLXdtc" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#191c1d] to-transparent flex flex-col justify-end p-10 text-left">
              <h3 className="text-white font-black text-4xl mb-2">GYM & FITNESS</h3>
              <p className="text-[#e1e3e4] mb-6 max-w-sm">Độ bền cực cao cho các bài tập cường độ nặng.</p>
              <button className="bg-[#c1f100] text-[#546b00] w-fit px-8 py-3 rounded font-bold hover:scale-105 transition-all uppercase">XEM NGAY</button>
            </div>
          </div>
          <div className="md:col-span-2 relative rounded-xl overflow-hidden group text-left">
            <img alt="Running" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9RJZTP9ORYUUJ3d5y1AFpaAnUAlIbcBIyh3sQBNid1IHDFvx9sWt1P_ldNg-gEZQ5jlMCWheRlwS9Iu13zD2dqcqKzohj47iDldHoLiDyaSdb28OcJ5R7-3vgqa1QM7LcNA5KwQ_8uCczXYNKSy23CVPNaaKbJ69T3-gXEqpBPaw95Yfa_JKSFpJ9aGWwbVFbJAIqKbzul45aFxXabg9gOkAaK-TWaIuzvhCyaX-y7JKo1XTBvpNYi5XsZwTtdVN09ymOvEAuGAQ" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#191c1d]/80 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-white font-black text-2xl mb-1 uppercase">PRO RUNNING</h3>
              <button className="text-[#c3f400] font-bold flex items-center gap-1 group-hover:translate-x-2 transition-transform uppercase">KHÁM PHÁ <span className="material-symbols-outlined">arrow_forward</span></button>
            </div>
          </div>
          <div className="md:col-span-1 relative rounded-xl overflow-hidden group text-left">
            <img alt="Yoga" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHycMkA7F_utCC0nN5qpoORRomxABC5v0hQKrWOcx7-GeF3YLB0LdQq8Ybgx8vzs3jiedeR_hKtN5aiZERsZYoIR2qjOSMbiJLyLIbFD3ry7YlmDmMOgVCHEYQ86ktN7sMsapKyE0A8ZOdXlnGnDkcw_kjE4AwBQDRWvW5QwAbHYnrlSS72Tmm23vi8xmFgbMdv36SONWx9q2QZ3OORWUG-gcQOGqH9_ffCr3Mlpi15BQLj2i4E6SxWlPC0lz2ma21lNOO7DB1Ei8" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#191c1d]/80 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white font-black text-xl uppercase">YOGA & FLEX</h3>
            </div>
          </div>
          <div className="md:col-span-1 relative rounded-xl overflow-hidden group text-left">
            <img alt="Street" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYAMZ_bh5tKltKK9Vy5YxA4COlCdzIAXWsx09tOtkrZp85uaudxZ7pyJbjTzeRK5ocButZ-UAQatBV99-_ygSBAyyGtMXb-HaoMGvEgyMa6mWlTUn5uyD3lSRkeuRwABGI5ir11sHcrvhT5v7p9wREzAOsqWJ-8qvK2ayyPdt3pcSCjXf_ZYU0LqOG4cEEatfoBDTbIdTAg3YpIzUlX6X18Oug8z9pavwC_c9iHxUXTHS3QZePlK-KJeQcqwWCCx0mFWkDn9R_T48" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#191c1d]/80 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white font-black text-xl uppercase">STREET ACTIVE</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Chatbox */}

    </div>
  );
}