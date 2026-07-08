import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authApi from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
    const { login, isAuthenticated, roles } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Lấy vị trí trang trước đó người dùng cố truy cập, hoặc trang chủ
    const from = location.state?.from?.pathname || '/';

    // Nếu đã đăng nhập, chuyển hướng theo role (tránh vào lại trang login)
    useEffect(() => {
        if (isAuthenticated) {
            const isEmployee = roles?.includes('ROLE_EMPLOYEE');
            navigate(isEmployee ? '/employee/dashboard' : from, { replace: true });
        }
    }, [isAuthenticated, roles, navigate, from]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Vui lòng điền đầy đủ tên đăng nhập và mật khẩu.');
            return;
        }

        setLoading(true);
        try {
            const data = await authApi.login({ username: username.trim(), password });
            
            // data trả về: { token, username, roles }
            login(data.token, data.username, data.roles);

            // Chuyển hướng theo role:
            // ROLE_EMPLOYEE → portal nhân viên | ROLE_CUSTOMER → trang trước đó / trang chủ
            const isEmployee = data.roles?.includes('ROLE_EMPLOYEE');
            navigate(isEmployee ? '/employee/dashboard' : from, { replace: true });
        } catch (err) {
            console.error('Lỗi đăng nhập:', err);
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError('Tên đăng nhập hoặc mật khẩu không chính xác.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Tabs */}
            <div className="flex gap-8 border-b border-outline-variant">
                <button className="pb-3 border-b-2 border-primary text-primary font-black text-lg uppercase tracking-tight">
                    Đăng nhập
                </button>
                <Link to="/register" className="pb-3 border-b-2 border-transparent text-on-surface-variant font-bold text-lg uppercase tracking-tight hover:text-on-surface transition-all">
                    Đăng ký
                </Link>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-300">
                    <span className="material-symbols-outlined text-sm flex-shrink-0">error</span>
                    <span>{error}</span>
                </div>
            )}

            {/* Form Login */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest ml-1" htmlFor="login-username">
                        Tên đăng nhập
                    </label>
                    <input
                        className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                        id="login-username"
                        placeholder="Nhập tên đăng nhập của bạn"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest" htmlFor="login-password">
                            Mật khẩu
                        </label>
                        <a className="text-[10px] text-primary font-black uppercase tracking-widest hover:underline" href="#">
                            Quên mật khẩu?
                        </a>
                    </div>
                    <input
                        className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                        id="login-password"
                        placeholder="••••••••"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>

                <div className="pt-4">
                    <button
                        className="w-full bg-primary text-white font-black py-4 rounded-xl hover:bg-primary-container active:scale-[0.98] transition-all shadow-lg shadow-primary/20 uppercase tracking-widest text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Đang xác thực...
                            </>
                        ) : (
                            'Đăng nhập ngay'
                        )}
                    </button>
                </div>
            </form>

            <p className="text-center text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                Chưa có tài khoản? <Link to="/register" className="text-primary hover:underline">Đăng ký ngay</Link>
            </p>
        </div>
    );
}