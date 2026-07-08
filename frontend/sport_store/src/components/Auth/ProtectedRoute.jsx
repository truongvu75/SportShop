import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Lưu lại vị trí trang hiện tại để sau khi login thành công có thể redirect ngược lại
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}
