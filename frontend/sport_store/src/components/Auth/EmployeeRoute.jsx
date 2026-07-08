import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
/**
 * EmployeeRoute — Route guard dành riêng cho nhân viên.
 * Kiểm tra 2 điều kiện:
 *   1. Người dùng đã đăng nhập (isAuthenticated)
 *   2. Tài khoản có quyền ROLE_EMPLOYEE
 * Nếu chưa đăng nhập → chuyển về /login (lưu lại trang hiện tại để redirect sau khi login)
 * Nếu đã đăng nhập nhưng không có quyền EMPLOYEE → chuyển về trang chủ (403 implicit)
 */
export default function EmployeeRoute() {
    const { isAuthenticated, roles } = useAuth();
    const location = useLocation();
    // Chưa đăng nhập → redirect về login, lưu lại path để quay lại sau
    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
    // Đã đăng nhập nhưng không phải nhân viên → redirect về trang chủ
    const isEmployee = roles?.includes('ROLE_EMPLOYEE');
    if (!isEmployee) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
}