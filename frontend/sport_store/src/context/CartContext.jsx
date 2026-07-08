import React, { createContext, useContext, useState, useEffect } from 'react';
import cartApi from '../api/cartApi';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    // Lấy 'isAuthenticated' và mảng 'roles' từ AuthContext của bạn
    const { isAuthenticated, roles } = useAuth();
    const [cart, setCart] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Hàm kiểm tra xem mảng roles có chứa quyền EMPLOYEE hoặc ADMIN không
    const isStaffOrAdmin = () => {
        if (!roles || !Array.isArray(roles)) return false;

        // Vì roles của bạn là mảng (ví dụ: ['EMPLOYEE'] hoặc ['ROLE_EMPLOYEE']), 
        // ta dùng .some() để kiểm tra xem có chứa từ khóa mong muốn không.
        return roles.some(role => role === 'EMPLOYEE' || role === 'ROLE_EMPLOYEE' || role === 'ADMIN' || role === 'ROLE_ADMIN');
    };

    // Lấy thông tin giỏ hàng chi tiết
    const fetchCart = async () => {
        if (isStaffOrAdmin()) {
            setCart(null);
            setCartCount(0);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await cartApi.getCart();
            setCart(data);
            if (data && data.items) {
                const count = data.items.reduce((sum, item) => sum + item.quantity, 0);
                setCartCount(count);
            } else {
                setCartCount(0);
            }
        } catch (err) {
            console.error('Lỗi khi tải giỏ hàng:', err);
            setError('Không thể tải giỏ hàng');
        } finally {
            setLoading(false);
        }
    };

    // Lấy số lượng vật phẩm trong giỏ hàng (chạy nhẹ nhàng ở Header)
    const fetchCartCount = async () => {
        if (isStaffOrAdmin()) {
            setCartCount(0);
            return;
        }

        try {
            const count = await cartApi.getCartCount();
            setCartCount(Number(count) || 0);
        } catch (err) {
            console.error('Lỗi khi tải số lượng giỏ hàng:', err);
        }
    };

    // Thêm sản phẩm vào giỏ hàng
    const addToCart = async (variantID, quantity) => {
        if (isStaffOrAdmin()) return false;
        setError(null);
        try {
            const updatedCart = await cartApi.addToCart(variantID, quantity);
            setCart(updatedCart);
            if (updatedCart && updatedCart.items) {
                const count = updatedCart.items.reduce((sum, item) => sum + item.quantity, 0);
                setCartCount(count);
            }
            return true;
        } catch (err) {
            console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', err);
            setError('Không thể thêm sản phẩm vào giỏ hàng');
            return false;
        }
    };

    // Cập nhật số lượng vật phẩm trong giỏ hàng
    const updateCartItem = async (cartItemID, quantity) => {
        if (isStaffOrAdmin()) return false;
        setError(null);
        try {
            const updatedCart = await cartApi.updateCartItem(cartItemID, quantity);
            setCart(updatedCart);
            if (updatedCart && updatedCart.items) {
                const count = updatedCart.items.reduce((sum, item) => sum + item.quantity, 0);
                setCartCount(count);
            }
            return true;
        } catch (err) {
            console.error('Lỗi khi cập nhật số lượng giỏ hàng:', err);
            setError('Không thể cập nhật số lượng');
            return false;
        }
    };

    // Xóa vật phẩm khỏi giỏ hàng
    const removeFromCart = async (cartItemID) => {
        if (isStaffOrAdmin()) return false;
        setError(null);
        try {
            const updatedCart = await cartApi.removeFromCart(cartItemID);
            setCart(updatedCart);
            if (updatedCart && updatedCart.items) {
                const count = updatedCart.items.reduce((sum, item) => sum + item.quantity, 0);
                setCartCount(count);
            } else {
                setCartCount(0);
            }
            return true;
        } catch (err) {
            console.error('Lỗi khi xóa vật phẩm khỏi giỏ hàng:', err);
            setError('Không thể xóa vật phẩm');
            return false;
        }
    };

    // Xóa sạch toàn bộ giỏ hàng
    const clearCart = async () => {
        if (isStaffOrAdmin()) return false;
        setError(null);
        try {
            const updatedCart = await cartApi.clearCart();
            setCart(updatedCart);
            setCartCount(0);
            return true;
        } catch (err) {
            console.error('Lỗi khi xóa sạch giỏ hàng:', err);
            setError('Không thể xóa sạch giỏ hàng');
            return false;
        }
    };

    // Tự động fetch số lượng giỏ hàng
    useEffect(() => {
        // Chỉ gọi API khi đã đăng nhập và KHÔNG PHẢI nhân viên/admin
        if (isAuthenticated && !isStaffOrAdmin()) {
            fetchCartCount();
        } else {
            setCart(null);
            setCartCount(0);
        }
    }, [isAuthenticated, roles]); // Lắng nghe sự thay đổi của roles

    return (
        <CartContext.Provider value={{
            cart,
            cartCount,
            loading,
            error,
            fetchCart,
            fetchCartCount,
            addToCart,
            updateCartItem,
            removeFromCart,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart phải được sử dụng bên trong CartProvider');
    }
    return context;
};