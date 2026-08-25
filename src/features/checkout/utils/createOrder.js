/**
 * @param {{
 *   items: Array<{
 *     productId: string,
 *     title: string,
 *     imageUrl: string,
 *     href: string,
 *     unitPrice: number,
 *     qty: number,
 *   }>,
 *   address: {
 *     name: string,
 *     phone: string,
 *     line1: string,
 *     line2: string,
 *     city: string,
 *     state: string,
 *     pincode: string,
 *   },
 *   paymentMethod: string,
 *   paymentRef?: string,
 * }} params
 */
export function createOrder({ items, address, paymentMethod, paymentRef }) {
  const now = new Date()
  const placedAt = now.toISOString()
  const placedLabel = now.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })

  const orderItems = items.map((item) => ({
    productId: item.productId,
    title: item.title,
    imageUrl: item.imageUrl,
    unitPrice: item.unitPrice,
    qty: item.qty,
    href: item.href,
  }))

  return {
    id: `OPL-${now.getTime().toString().slice(-5)}`,
    placedAt,
    status: 'processing',
    paymentMethod,
    paymentRef: paymentRef ?? null,
    shippingAddress: {
      name: address.name,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    },
    items: orderItems,
    timeline: [
      {
        key: 'placed',
        label: 'Order placed',
        at: placedLabel,
        done: true,
        current: false,
      },
      {
        key: 'packed',
        label: 'Packed',
        at: '',
        done: false,
        current: true,
      },
      {
        key: 'shipped',
        label: 'Shipped',
        at: '',
        done: false,
        current: false,
      },
      {
        key: 'delivered',
        label: 'Delivered',
        at: '',
        done: false,
        current: false,
      },
    ],
  }
}
