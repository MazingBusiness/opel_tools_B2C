import { useEffect, useMemo, useState } from 'react'
import { FiPackage } from 'react-icons/fi'
import { fetchOrders } from '../../order/api/api'
import { ORDER_STATUS_FILTERS } from '../../order/utils/orderStatus'
import { getErrorMessage } from '../../../shared/api/client'
import OrderCard from '../components/OrderCard'
import { useCurrentProfile } from '../hooks/useCurrentProfile'

export default function ProfileOrdersPage() {
  const { user } = useCurrentProfile()
  const [allOrders, setAllOrders] = useState(/** @type {any[]} */ ([]))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!user) {
      setAllOrders([])
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError('')
    fetchOrders()
      .then(({ orders }) => {
        if (!cancelled) setAllOrders(orders)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getErrorMessage(err, 'Could not load orders.'))
          setAllOrders([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user])

  const orders = useMemo(() => {
    if (filter === 'all') return allOrders
    return allOrders.filter((order) => order.status === filter)
  }, [allOrders, filter])

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
        {loading ? (
          <p className="rounded-lg border border-dashed border-border bg-surface-muted px-6 py-12 text-center text-sm text-ink-muted">
            Loading orders…
          </p>
        ) : error ? (
          <p className="rounded-lg border border-dashed border-red-200 bg-red-50 px-6 py-12 text-center text-sm text-red-600">
            {error}
          </p>
        ) : orders.length ? (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-surface-muted px-6 py-12 text-center">
            <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
              <FiPackage className="size-6" aria-hidden />
            </span>
            <p className="font-semibold text-ink">No orders yet</p>
            <p className="mt-1 text-sm text-ink-muted">
              When you place an order, it will show up here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
