import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfileSidebar from '../../components/layout/ProfileSidebar';
import customerApi from '../../api/customerApi';
import provinceApi from '../../api/provinceApi';

export default function ProfilePage() {
    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        email: '',
        address: '',
        provinceName: ''
    });
    const [provinces, setProvinces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    // Tải thông tin cá nhân & danh sách tỉnh thành song song khi load trang
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [profile, provinceList] = await Promise.all([
                    customerApi.getProfile(),
                    provinceApi.getAllProvinces()
                ]);
                if (profile) {
                    setFormData({
                        customerName: profile.customerName || '',
                        phone: profile.phone || '',
                        email: profile.email || '',
                        address: profile.address || '',
                        provinceName: profile.provinceName || ''
                    });
                }
                if (provinceList) {
                    setProvinces(provinceList);
                }
            } catch (err) {
                setError('Không thể tải thông tin tài khoản. Vui lòng thử lại!');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Two-way binding cho tất cả input/select
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Validate: SĐT gồm đúng 10 chữ số, bắt đầu bằng 0
    const validatePhone = (phone) => {
        return /^0[0-9]{9}$/.test(phone);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setError('');

        if (!formData.customerName.trim()) {
            setError('Họ và tên không được để trống!');
            return;
        }
        if (!validatePhone(formData.phone)) {
            setError('Số điện thoại không hợp lệ! Vui lòng nhập 10 chữ số bắt đầu bằng 0.');
            return;
        }

        try {
            setSaving(true);
            await customerApi.updateProfile({
                customerName: formData.customerName,
                phone: formData.phone,
                address: formData.address,
                provinceName: formData.provinceName,
                email: formData.email
            });
            setSuccessMessage('Đã cập nhật thông tin cá nhân thành công!');
            // Reload sau 1.2s để người dùng thấy thông báo
            setTimeout(() => {
                window.location.reload();
            }, 1200);
        } catch (err) {
            setError(err.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại!');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-10 bg-surface min-h-screen">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] text-on-surface-variant mb-8 font-bold uppercase tracking-widest">
                <Link className="hover:text-primary transition-colors" to="/">Trang chủ</Link>
                <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                <span className="text-primary">Thông tin cá nhân</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Sidebar */}
                <ProfileSidebar />

                {/* Right Column: Profile Form */}
                <section className="lg:col-span-8">
                    <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
                        <div className="mb-6 border-b border-outline-variant pb-5">
                            <h1 className="text-lg font-black text-on-surface tracking-tight mb-0.5 uppercase">Thông tin tài khoản</h1>
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-70">Quản lý hồ sơ cá nhân</p>
                        </div>

                        {/* Alert thông báo lỗi */}
                        {error && (
                            <div className="mb-5 p-3.5 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-[11px] font-bold uppercase tracking-wide flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">error</span>
                                {error}
                            </div>
                        )}
                        {/* Alert thông báo thành công */}
                        {successMessage && (
                            <div className="mb-5 p-3.5 bg-green-50 border-l-4 border-green-500 rounded-xl text-green-700 text-[11px] font-bold uppercase tracking-wide flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                {successMessage}
                            </div>
                        )}

                        {loading ? (
                            /* Skeleton loading */
                            <div className="space-y-4 animate-pulse">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className={i >= 3 ? 'md:col-span-2' : ''}>
                                            <div className="h-3 bg-outline-variant/40 rounded w-1/3 mb-2"></div>
                                            <div className="h-10 bg-outline-variant/30 rounded-xl"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="group">
                                        <label className="block text-[10px] font-black text-on-surface-variant mb-1.5 uppercase tracking-widest">Họ và tên</label>
                                        <input
                                            name="customerName"
                                            value={formData.customerName}
                                            onChange={handleChange}
                                            className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-2 text-[13px] font-medium focus:border-primary outline-none transition-all"
                                            placeholder="Nhập họ và tên..."
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-[10px] font-black text-on-surface-variant mb-1.5 uppercase tracking-widest">Số điện thoại</label>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            maxLength={10}
                                            className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-2 text-[13px] font-medium focus:border-primary outline-none transition-all"
                                            placeholder="0xxxxxxxxx"
                                        />
                                    </div>
                                    <div className="md:col-span-2 group">
                                        <label className="block text-[10px] font-black text-on-surface-variant mb-1.5 uppercase tracking-widest">
                                            Email <span className="text-on-surface-variant/40 normal-case font-medium tracking-normal">(không thể thay đổi)</span>
                                        </label>
                                        <input
                                            name="email"
                                            value={formData.email}
                                            readOnly
                                            className="w-full bg-surface/50 border border-outline-variant rounded-xl px-4 py-2 text-[13px] font-medium opacity-60 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="md:col-span-2 group">
                                        <label className="block text-[10px] font-black text-on-surface-variant mb-1.5 uppercase tracking-widest">Địa chỉ chi tiết</label>
                                        <input
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-2 text-[13px] font-medium focus:border-primary outline-none transition-all"
                                            placeholder="Số nhà, tên đường, phường/xã..."
                                        />
                                    </div>
                                    <div className="md:col-span-2 group">
                                        <label className="block text-[10px] font-black text-on-surface-variant mb-1.5 uppercase tracking-widest">Tỉnh / Thành phố</label>
                                        <select
                                            name="provinceName"
                                            value={formData.provinceName}
                                            onChange={handleChange}
                                            className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-2 text-[13px] font-medium outline-none focus:border-primary transition-all"
                                        >
                                            <option value="">-- Chọn tỉnh/thành phố --</option>
                                            {provinces.map((p) => (
                                                <option key={p.provinceName} value={p.provinceName}>
                                                    {p.provinceName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-outline-variant flex gap-3 justify-end">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-black rounded-lg text-[10px] uppercase tracking-widest shadow-md active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {saving && <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>}
                                        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                    </button>
                                    <Link to="/">
                                        <button
                                            type="button"
                                            className="px-6 py-2.5 bg-surface-container text-on-surface-variant font-black rounded-lg text-[10px] uppercase tracking-widest hover:bg-outline-variant transition-all"
                                        >
                                            Hủy
                                        </button>
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3 mt-4">
                        {[
                            { label: 'Đơn hàng', value: '12', icon: 'shopping_bag' },
                            { label: 'Tích lũy', value: '1.2M', icon: 'payments' },
                            { label: 'Voucher', value: '05', icon: 'sell' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant flex items-center gap-2.5">
                                <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                    <span className="material-symbols-outlined text-sm">{stat.icon}</span>
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[8px] font-black text-on-surface-variant uppercase tracking-tighter truncate">{stat.label}</p>
                                    <p className="text-xs font-black text-on-surface leading-none">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
