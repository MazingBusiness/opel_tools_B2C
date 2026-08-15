import { useMemo, useState } from 'react'
import { FiPackage } from 'react-icons/fi'
import { mockOrders, ORDER_STATUS_FILTERS } from '../data/mockOrders'
import OrderCard from '../components/OrderCard'

export default function ProfileOrdersPage() {
  const [filter, setFilter] = useState('all')

  const orders = useMemo(() => {
    if (filter === 'all') return mockOrders
    return mockOrders.filter((order) => order.status === filter)
  }, [filter])

  return (
    <div>
      <h2 className="text-xl font-extrabold tracking-tight text-ink">My orders</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Track purchases and reopen past invoices.
      </p>

      <div
        className="mt-4 flex gap-2 overflow-x-auto pb-1"
        role="tablist"
        aria-label="Filter orders"
      >
        {ORDER_STATUS_FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={`shrink-0 rounded-md border px-3 py-1.5 text-sm font-semibold transition ${
              filter === item.id
                ? 'border-brand bg-brand/10 text-brand'
                : 'border-border bg-surface text-ink hover:border-brand/40'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {orders.length ? (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-surface-muted px-6 py-12 text-center">
            <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
              <FiPackage className="size-6" aria-hidden />
            </span>
            <p className="font-semibold text-ink">No orders in this filter</p>
            <p className="mt-1 text-sm text-ink-muted">
              Try another status or browse the catalog.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
