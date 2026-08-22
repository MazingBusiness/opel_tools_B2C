import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layout/MainLayout'
import RequireAuth from './RequireAuth'
import HomePage from '../../features/home/pages/HomePage'
import AboutPage from '../../features/home/pages/AboutPage'
import ContactPage from '../../features/home/pages/ContactPage'
import LoginPage from '../../features/auth/pages/LoginPage'
import CartPage from '../../features/cart/pages/CartPage'
import WishlistPage from '../../features/wishlist/pages/WishlistPage'
import ProductsPage from '../../features/products/pages/ProductsPage'
import ProductDetailPage from '../../features/products/pages/ProductDetailPage'
import OrdersPage from '../../features/order/pages/OrdersPage'
import CategoryBrowsePage from '../../features/category/pages/CategoryBrowsePage'
import ProfileLayout from '../../features/user/pages/ProfileLayout'
import ProfileOverviewPage from '../../features/user/pages/ProfileOverviewPage'
import ProfileDetailsPage from '../../features/user/pages/ProfileDetailsPage'
import ProfileAddressesPage from '../../features/user/pages/ProfileAddressesPage'
import ProfileOrdersPage from '../../features/user/pages/ProfileOrdersPage'
import ProfileOrderDetailPage from '../../features/user/pages/ProfileOrderDetailPage'
import ProfileSecurityPage from '../../features/user/pages/ProfileSecurityPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/category/:categorySlug" element={<CategoryBrowsePage />} />
        <Route
          path="/category/:categorySlug/:subSlug"
          element={<CategoryBrowsePage />}
        />
        <Route element={<RequireAuth />}>
          <Route path="/profile" element={<ProfileLayout />}>
            <Route index element={<ProfileOverviewPage />} />
            <Route path="details" element={<ProfileDetailsPage />} />
            <Route path="addresses" element={<ProfileAddressesPage />} />
            <Route path="orders" element={<ProfileOrdersPage />} />
            <Route path="orders/:orderId" element={<ProfileOrderDetailPage />} />
            <Route path="security" element={<ProfileSecurityPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
