import { QueryProvider } from './query/QueryProvider'
import AppRoutes from './router/AppRoutes'

function App() {
  return (
    <QueryProvider>
      <AppRoutes />
    </QueryProvider>
  )
}

export default App
