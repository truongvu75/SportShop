import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
import provinceApi from '../../api/provinceApi';

export default function Register() {
    const navigate = useNavigate();

    // Form states
    const [username, setUsername] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [province, setProvince] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI/UX states
    const [provinces, setProvinces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch danh sách tỉnh thành từ backend
    useEffect(() => {
        const getProvinces = async () => {
            try {
                const data = await provinceApi.getAllProvinces();
                setProvinces(data || []);
            } catch (err) {
                console.error('Không thể lấy danh sách tỉnh/thành phố:', err);
                // Fallback mặc định phòng trường hợp lỗi API
                setProvinces([
                    { provinceName: 'Hồ Chí Minh' },
                    { provinceName: 'Hà Nội' },
                    { provinceName: 'Đà Nẵng' },
                    { provinceName: 'Cần Thơ' },
                    { provinceName: 'Hải Phòng' }
                ]);
            }
        };
        getProvinces();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Client-side validations
        if (!username.trim() || !customerName.trim() || !phone.trim() || !address.trim() || !province || !email.trim() || !password) {
            setError('Vui lòng điền đầy đủ các thông tin bắt buộc.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu và xác nhận mật khẩu không khớp.');
            return;
        }

        if (password.length < 6) {
            setError('Mật khẩu phải có độ dài tối thiểu 6 ký tự.');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError('Địa chỉ email không đúng định dạng.');
            return;
        }

        // Validate phone format (Vn standard)
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        if (!phoneRegex.test(phone.trim().replace(/\s+/g, ''))) {
            setError('Số điện thoại không đúng định dạng (phải có 10 chữ số bắt đầu bằng 03, 05, 07, 08, hoặc 09).');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                username: username.trim(),
                password,
                customerName: customerName.trim(),
                phone: phone.trim(),
                address: address.trim(),
                province,
                email: email.trim()
            };

            await authApi.register(payload);
            setSuccess('Đăng ký tài khoản thành công! Đang chuyển hướng sang trang đăng nhập...');
            
            // Redirect sau 2 giây
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            console.error('Lỗi đăng ký:', err);
            if (err.response && typeof err.response.data === 'string') {
                setError(err.response.data);
            } else if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Đăng ký không thành công. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Tabs */}
            <div className="flex gap-8 border-b border-outline-variant">
                <Link to="/login" className="pb-3 border-b-2 border-transparent text-on-surface-variant font-bold text-lg uppercase tracking-tight hover:text-on-surface transition-all">
                    Đăng nhập
                </Link>
                <button className="pb-3 border-b-2 border-primary text-primary font-black text-lg uppercase tracking-tight">
                    Đăng ký
                </button>
            </div>

            <div className="space-y-1">
                <h2 className="text-xl font-black tracking-tight uppercase">Tạo tài khoản mới</h2>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-300">
                    <span className="material-symbols-outlined text-sm flex-shrink-0">error</span>
                    <span>{error}</span>
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-300">
                    <span className="material-symbols-outlined text-sm flex-shrink-0 text-green-500">check_circle</span>
                    <span>{success}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Tên đăng nhập *</label>
                        <input 
                            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all disabled:opacity-75" 
                            placeholder="username123" 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={loading || !!success}
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Họ và Tên *</label>
                        <input 
                            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all disabled:opacity-75" 
                            placeholder="Nguyễn Văn A" 
                            type="text" 
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            disabled={loading || !!success}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Số điện thoại *</label>
                        <input 
                            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all disabled:opacity-75" 
                            placeholder="0901234567" 
                            type="tel" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={loading || !!success}
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Email *</label>
                        <input 
                            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all disabled:opacity-75" 
                            placeholder="email@example.com" 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading || !!success}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Địa chỉ chi tiết *</label>
                    <input 
                        className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all disabled:opacity-75" 
                        placeholder="Số nhà, tên đường, phường/xã..." 
                        type="text" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        disabled={loading || !!success}
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Tỉnh / Thành phố *</label>
                    <div className="relative">
                        <select 
                            className="w-full appearance-none bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary cursor-pointer disabled:opacity-75"
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            disabled={loading || !!success}
                            required
                        >
                            <option value="">Chọn Tỉnh / Thành phố...</option>
                            {provinces.map((prov) => (
                                <option key={prov.provinceName} value={prov.provinceName}>
                                    {prov.provinceName}
                                </option>
                            ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-sm opacity-60">expand_more</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Mật khẩu *</label>
                        <input 
                            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all disabled:opacity-75" 
                            placeholder="••••••••" 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading || !!success}
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Xác nhận mật khẩu *</label>
                        <input 
                            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all disabled:opacity-75" 
                            placeholder="••••••••" 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading || !!success}
                            required
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button 
                        className="w-full bg-primary text-white font-black py-4 rounded-xl hover:bg-primary-container active:scale-[0.98] transition-all shadow-md uppercase tracking-widest text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed" 
                        type="submit"
                        disabled={loading || !!success}
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Đang xử lý...
                            </>
                        ) : (
                            'Đăng ký ngay'
                        )}
                    </button>
                </div>
            </form>

            <p className="text-center text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                Đã có tài khoản? <Link to="/login" className="text-primary hover:underline">Đăng nhập</Link>
            </p>
        </div>
    );
}