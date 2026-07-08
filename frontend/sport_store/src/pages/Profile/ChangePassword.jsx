import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProfileSidebar from '../../components/layout/ProfileSidebar';
import authApi from '../../api/authApi';

export default function ChangePassword() {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    const toggleVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setError('');

        const { currentPassword, newPassword, confirmPassword } = formData;

        // Validation
        if (!currentPassword) {
            setError('Mật khẩu hiện tại không được để trống!');
            return;
        }
        if (!newPassword) {
            setError('Mật khẩu mới không được để trống!');
            return;
        }
        if (newPassword.length < 6) {
            setError('Mật khẩu mới phải có độ dài tối thiểu 6 ký tự!');
            return;
        }
        if (newPassword === currentPassword) {
            setError('Mật khẩu mới không được trùng với mật khẩu hiện tại!');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Xác nhận mật khẩu mới không khớp!');
            return;
        }

        try {
            setSaving(true);
            await authApi.changePassword({
                currentPassword,
                newPassword
            });
            setSuccessMessage('Đổi mật khẩu thành công!');
            // Reset form fields
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            console.error('Lỗi đổi mật khẩu:', err);
            let errorMsg = 'Đổi mật khẩu thất bại. Vui lòng thử lại!';
            if (err.response) {
                if (typeof err.response.data === 'string') {
                    errorMsg = err.response.data;
                } else if (err.response.data && err.response.data.message) {
                    errorMsg = err.response.data.message;
                } else if (typeof err.response.data === 'object') {
                    errorMsg = JSON.stringify(err.response.data);
                }
            } else if (err.message) {
                errorMsg = err.message;
            }
            setError(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-10 bg-surface min-h-screen">
            {/* Breadcrumbs - Compact */}
            <nav className="flex items-center gap-2 text-[10px] text-on-surface-variant mb-8 font-bold uppercase tracking-widest">
                <Link className="hover:text-primary transition-colors" to="/">Trang chủ</Link>
                <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                <Link className="hover:text-primary transition-colors" to="/profile">Hồ sơ</Link>
                <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                <span className="text-primary">Đổi mật khẩu</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Sidebar - Component dùng chung */}
                <ProfileSidebar />

                {/* Right Column: Change Password Form - Compact */}
                <section className="lg:col-span-8">
                    <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm h-full">
                        {/* Header giữ nguyên */}
                        <div className="mb-6 border-b border-outline-variant pb-5">
                            <h1 className="text-lg font-black text-on-surface tracking-tight mb-0.5 uppercase">Đổi mật khẩu</h1>
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-70">Bảo mật tài khoản của bạn</p>
                        </div>

                        {/* Alert thông báo lỗi */}
                        {error && (
                            <div className="mb-5 p-3.5 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-[11px] font-bold uppercase tracking-wide flex items-center gap-2 max-w-2xl">
                                <span className="material-symbols-outlined text-sm">error</span>
                                {error}
                            </div>
                        )}
                        {/* Alert thông báo thành công */}
                        {successMessage && (
                            <div className="mb-5 p-3.5 bg-green-50 border-l-4 border-green-500 rounded-xl text-green-700 text-[11px] font-bold uppercase tracking-wide flex items-center gap-2 max-w-2xl">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                {successMessage}
                            </div>
                        )}

                        <form className="space-y-5 w-full max-w-2xl" onSubmit={handleSubmit}>
                            {[
                                { key: 'current', label: 'Mật khẩu hiện tại', fieldName: 'currentPassword' },
                                { key: 'new', label: 'Mật khẩu mới', fieldName: 'newPassword' },
                                { key: 'confirm', label: 'Xác nhận mật khẩu mới', fieldName: 'confirmPassword' }
                            ].map((item) => (
                                <div key={item.key} className="flex flex-col">
                                    <label className="text-[10px] font-black text-on-surface-variant mb-2 uppercase tracking-widest block whitespace-nowrap">
                                        {item.label}
                                    </label>
                                    <div className="relative w-full">
                                        <input
                                            name={item.fieldName}
                                            value={formData[item.fieldName]}
                                            onChange={handleChange}
                                            className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-2.5 text-[13px] font-medium focus:border-primary outline-none transition-all"
                                            placeholder="••••••••"
                                            type={showPasswords[item.key] ? 'text' : 'password'}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => toggleVisibility(item.key)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                                        >
                                            <span className="material-symbols-outlined text-lg">
                                                {showPasswords[item.key] ? 'visibility' : 'visibility_off'}
                                            </span>
                                        </button>
                                    </div>
                                    {item.key === 'new' && (
                                        <p className="mt-1.5 text-[10px] text-on-surface-variant font-medium italic opacity-60">
                                            Mật khẩu mới phải có độ dài tối thiểu 6 ký tự.
                                        </p>
                                    )}
                                </div>
                            ))}

                            <div className="pt-4 border-t border-outline-variant flex gap-3 justify-end">
                                <button
                                    className="flex items-center gap-2 px-8 py-2.5 bg-primary text-white font-black rounded-lg text-[10px] uppercase tracking-widest shadow-md active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    type="submit"
                                    disabled={saving}
                                >
                                    {saving && <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>}
                                    {saving ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                                </button>
                                <Link to="/profile">
                                    <button className="px-8 py-2.5 bg-surface-container text-on-surface-variant font-black rounded-lg text-[10px] uppercase tracking-widest hover:bg-outline-variant transition-all" type="button">
                                        Hủy bỏ
                                    </button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
}
