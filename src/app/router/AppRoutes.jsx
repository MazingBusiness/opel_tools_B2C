import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layout/MainLayout'
import HomePage from '../../features/home/pages/HomePage'
import AboutPage from '../../features/home/pages/AboutPage'
import ContactPage from '../../features/home/pages/ContactPage'
import LoginPage from '../../features/auth/pages/LoginPage'
import CartPage from '../../features/cart/pages/CartPage'
import ProductsPage from '../../features/products/pages/ProductsPage'
import OrdersPage from '../../features/order/pages/OrdersPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Route>
    </Routes>
  )
}
