import { useSearchParams } from 'react-router-dom'

export default function ProductsPage() {
  const [params] = useSearchParams()
  const query = params.get('q')

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold text-ink">Products</h1>
      <p className="mt-2 text-ink-muted">
        {query ? `Search results for “${query}”.` : 'Product listing coming soon.'}
      </p>
    </div>
  )
}
