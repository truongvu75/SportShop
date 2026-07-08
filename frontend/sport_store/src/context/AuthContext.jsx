import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [username, setUsername] = useState(() => localStorage.getItem('username'));
    const [roles, setRoles] = useState(() => {
        const storedRoles = localStorage.getItem('roles');
        try {
            return storedRoles ? JSON.parse(storedRoles) : [];
        } catch (e) {
            console.error('Lỗi phân tích roles từ localStorage:', e);
            return [];
        }
    });

    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));

    // Đồng bộ trạng thái đăng nhập khi token thay đổi
    useEffect(() => {
        setIsAuthenticated(!!token);
    }, [token]);

    /**
     * Lưu thông tin đăng nhập sau khi API gọi thành công
     */
    const login = (jwtToken, user, userRoles) => {
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('username', user);
        localStorage.setItem('roles', JSON.stringify(userRoles));

        setToken(jwtToken);
        setUsername(user);
        setRoles(userRoles);
    };

    /**
     * Đăng xuất và xóa sạch session
     */
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('roles');

        setToken(null);
        setUsername(null);
        setRoles([]);
    };

    return (
        <AuthContext.Provider value={{
            token,
            username,
            roles,
            isAuthenticated,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
    }
    return context;
};
