import { getProductById } from '../../products/data/productCatalog'

/**
 * @param {string} productId
 * @param {number} qty
 */
function line(productId, qty) {
  const product = getProductById(productId)
  if (!product) return null
  return {
    productId: product.id,
    title: product.title,
    imageUrl: product.imageUrl,
    unitPrice: product.currentPrice,
    qty,
    href: product.href,
  }
}

/**
 * @param {Array<{ unitPrice: number, qty: number }>} items
 */
export function orderItemsTotal(items) {
  return items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0)
}

const SNAPSHOT_HOME = {
  name: 'OPEL Customer',
  phone: '9876543210',
  line1: '12 Industrial Layout, 3rd Cross',
  line2: 'Near Power Tools Market',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560001',
}

const SNAPSHOT_WORK = {
  name: 'OPEL Customer',
  phone: '9876543210',
  line1: 'Warehouse 4, Peenya Industrial Area',
  line2: '',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560058',
}

/** @type {Array<{
 *   id: string,
 *   placedAt: string,
 *   status: 'processing' | 'shipped' | 'delivered' | 'cancelled',
 *   paymentMethod: string,
 *   shippingAddress: typeof SNAPSHOT_HOME,
 *   items: NonNullable<ReturnType<typeof line>>[],
 *   timeline: Array<{ key: string, label: string, at: string, done: boolean, current: boolean }>,
 * }>} */
export const mockOrders = [
  {
    id: 'OPL-26091',
    placedAt: '2026-08-12T16:40:00+05:30',
    status: 'processing',
    paymentMethod: 'UPI',
    shippingAddress: SNAPSHOT_HOME,
    items: [line('pt-1', 1), line('ac-1', 2)].filter(Boolean),
    timeline: [
      { key: 'placed', label: 'Order placed', at: '12 Aug, 4:40 pm', done: true, current: false },
      { key: 'packed', label: 'Packed', at: '', done: false, current: true },
      { key: 'shipped', label: 'Shipped', at: '', done: false, current: false },
      { key: 'delivered', label: 'Delivered', at: '', done: false, current: false },
    ],
  },
  {
    id: 'OPL-26090',
    placedAt: '2026-08-11T09:15:00+05:30',
    status: 'processing',
    paymentMethod: 'Credit card',
    shippingAddress: SNAPSHOT_WORK,
    items: [line('pt-4', 1)].filter(Boolean),
    timeline: [
      { key: 'placed', label: 'Order placed', at: '11 Aug, 9:15 am', done: true, current: false },
      { key: 'packed', label: 'Packed', at: '11 Aug, 6:20 pm', done: true, current: true },
      { key: 'shipped', label: 'Shipped', at: '', done: false, current: false },
      { key: 'delivered', label: 'Delivered', at: '', done: false, current: false },
    ],
  },
  {
    id: 'OPL-26087',
    placedAt: '2026-08-08T11:05:00+05:30',
    status: 'shipped',
    paymentMethod: 'UPI',
    shippingAddress: SNAPSHOT_HOME,
    items: [line('ht-1', 1), line('sg-1', 1)].filter(Boolean),
    timeline: [
      { key: 'placed', label: 'Order placed', at: '8 Aug, 11:05 am', done: true, current: false },
      { key: 'packed', label: 'Packed', at: '8 Aug, 5:40 pm', done: true, current: false },
      { key: 'shipped', label: 'Shipped', at: '9 Aug, 10:12 am', done: true, current: true },
      { key: 'delivered', label: 'Delivered', at: '', done: false, current: false },
    ],
  },
  {
    id: 'OPL-26081',
    placedAt: '2026-08-02T10:20:00+05:30',
    status: 'delivered',
    paymentMethod: 'Net banking',
    shippingAddress: SNAPSHOT_HOME,
    items: [line('pt-2', 1), line('ac-3', 1)].filter(Boolean),
    timeline: [
      { key: 'placed', label: 'Order placed', at: '2 Aug, 10:20 am', done: true, current: false },
      { key: 'packed', label: 'Packed', at: '2 Aug, 4:10 pm', done: true, current: false },
      { key: 'shipped', label: 'Shipped', at: '3 Aug, 9:00 am', done: true, current: false },
      { key: 'delivered', label: 'Delivered', at: '5 Aug, 2:18 pm', done: true, current: true },
    ],
  },
  {
    id: 'OPL-26072',
    placedAt: '2026-07-20T14:55:00+05:30',
    status: 'delivered',
    paymentMethod: 'UPI',
    shippingAddress: SNAPSHOT_WORK,
    items: [line('pt-14', 1)].filter(Boolean),
    timeline: [
      { key: 'placed', label: 'Order placed', at: '20 Jul, 2:55 pm', done: true, current: false },
      { key: 'packed', label: 'Packed', at: '20 Jul, 7:30 pm', done: true, current: false },
      { key: 'shipped', label: 'Shipped', at: '21 Jul, 11:00 am', done: true, current: false },
      { key: 'delivered', label: 'Delivered', at: '24 Jul, 1:42 pm', done: true, current: true },
    ],
  },
  {
    id: 'OPL-26065',
    placedAt: '2026-07-12T18:08:00+05:30',
    status: 'cancelled',
    paymentMethod: 'UPI',
    shippingAddress: SNAPSHOT_HOME,
    items: [line('ms-1', 1)].filter(Boolean),
    timeline: [
      { key: 'placed', label: 'Order placed', at: '12 Jul, 6:08 pm', done: true, current: false },
      { key: 'cancelled', label: 'Cancelled', at: '12 Jul, 6:22 pm', done: true, current: true },
    ],
  },
]

/**
 * @param {string} orderId
 */
export function getMockOrderById(orderId) {
  return mockOrders.find((order) => order.id === orderId) ?? null
}

export const ORDER_STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
]

export const ORDER_STATUS_STYLES = {
  processing: 'bg-brand/10 text-brand',
  shipped: 'bg-highlight/20 text-ink',
  delivered: 'bg-success/10 text-success',
  cancelled: 'bg-red-50 text-red-600',
}

export const ORDER_STATUS_LABELS = {
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}
