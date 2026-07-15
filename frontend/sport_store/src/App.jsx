import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import EmployeeLayout from './components/layout/EmployeeLayout';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import EmployeeRoute from './components/Auth/EmployeeRoute';
import ScrollToTop from './components/layout/ScrollToTop';

// Sử dụng lazy loading
const HomePage = lazy(() => import('./pages/Home/HomePage'));
const ProductPage = lazy(() => import('./pages/Product/ProductPage'));
const ProductDetail = lazy(() => import('./pages/Product/ProductDetail'));
const Wishlist = lazy(() => import('./pages/Product/Wishlist'));
const CartPage = lazy(() => import('./pages/Cart/CartPage'));
const CheckoutPage = lazy(() => import('./pages/Checkout/CheckoutPage'));
const OrderHistory = lazy(() => import('./pages/Order/OrderHistory'));
const OrderDetail = lazy(() => import('./pages/Order/OrderDetail'));
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage'));
const ChangePassword = lazy(() => import('./pages/Profile/ChangePassword'));
const AuthLayout = lazy(() => import('./components/Auth/AuthLayout'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const ReviewsHistory = lazy(() => import('./pages/Rating/ReviewsHistory'));
const PaymentResult = lazy(() => import('./pages/Checkout/PaymentResult'));

// Employee portal pages (lazy loaded)
const EmployeeDashboard = lazy(() => import('./pages/ADMIN-EMPLOYEE/EmployeeDashboard'));
const OrdersManagement = lazy(() => import('./pages/ADMIN-EMPLOYEE/OrdersManagement'));
const CustomerFeedback = lazy(() => import('./pages/ADMIN-EMPLOYEE/CustomerFeedback'));
const OrderDetailEmployee = lazy(() => import('./pages/ADMIN-EMPLOYEE/OrderDetailEmployee'));
const CategoriesManagement = lazy(() => import('./pages/ADMIN-EMPLOYEE/categories/CategoriesPage'));
const ProductsManagement = lazy(() => import('./pages/ADMIN-EMPLOYEE/products/ProductsPage'));
const CustomersManagement = lazy(() => import('./pages/ADMIN-EMPLOYEE/customers/CustomersPage'));
const EmployeesManagement = lazy(() => import('./pages/ADMIN-EMPLOYEE/employees/EmployeesPage'));
const AddProduct = lazy(() => import('./pages/ADMIN-EMPLOYEE/products/AddProduct'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Employee Portal Routes — chỉ cho phép ROLE_EMPLOYEE */}
              <Route element={<EmployeeRoute />}>
                <Route path="employee" element={<EmployeeLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<EmployeeDashboard />} />
                  <Route path="orders-management" element={<OrdersManagement />} />
                  <Route path="order/:id" element={<OrderDetailEmployee />} />
                  <Route path="reviews" element={<CustomerFeedback />} />
                  <Route path="categories" element={<CategoriesManagement />} />
                  <Route path="products" element={<ProductsManagement />} />
                  <Route path="products/add-product" element={<AddProduct />} />
                  <Route path="customers" element={<CustomersManagement />} />
                  <Route path="employees" element={<EmployeesManagement />} />
                </Route>
              </Route>

              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="product" element={<ProductPage />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="cart">
                  {/* Protected cart & checkout routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="view" element={<CartPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                  </Route>
                </Route>

                {/* Protected routes under MainLayout */}
                <Route element={<ProtectedRoute />}>
                  <Route path="wishlist" element={<Wishlist />} />
                  <Route path="/payment-result" element={<PaymentResult />} />
                  <Route path="order">
                    <Route path="order-history" element={<OrderHistory />} />
                    <Route path="order-detail/:id" element={<OrderDetail />} />
                  </Route>

                  <Route path="profile">
                    <Route index element={<ProfilePage />} />
                    <Route path="change-password" element={<ChangePassword />} />
                    <Route path="reviews-history" element={<ReviewsHistory />} />
                  </Route>
                </Route>

              </Route>

              {/* Auth Routes - Outside MainLayout */}
              <Route element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>

              <Route path="*" element={
                <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-surface">
                  <h1 className="text-9xl font-black text-outline-variant">404</h1>
                  <p className="text-2xl font-bold mt-4 uppercase tracking-tighter text-on-surface">Trang không tồn tại</p>
                  <Link to="/" className="mt-8 bg-primary text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg hover:scale-105 transition-all">Quay lại trang chủ</Link>
                </div>
              } />
            </Routes>

          </Suspense>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;