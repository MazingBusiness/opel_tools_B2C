import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import AuthModal from '../../features/auth/components/AuthModal'
import CartDrawer from '../../features/cart/components/CartDrawer'
import WishlistDrawer from '../../features/wishlist/components/WishlistDrawer'

export default function MainLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AuthModal />
      <CartDrawer />
      <WishlistDrawer />
    </div>
  )
}
