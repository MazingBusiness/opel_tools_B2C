import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { QueryProvider } from './query/QueryProvider'
import AppRoutes from './router/AppRoutes'
import ScrollToTop from './router/ScrollToTop'

function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
        <Toaster
          position="top-center"
          toastOptions={{
            className: 'text-sm',
            duration: 3000,
          }}
        />
      </BrowserRouter>
    </QueryProvider>
  )
}

export default App
