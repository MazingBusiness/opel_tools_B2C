/** Dummy shipping copy — replace with CMS/API later. */

export const shippingPage = {
  title: 'Shipping Info',
  updated: 'August 2026',
  lead: 'Most orders leave our Delhi-NCR warehouse within one business day. Delivery windows depend on your pincode and the carrier we assign at dispatch.',
  sections: [
    {
      heading: 'Dispatch timeline',
      paragraphs: [
        'In-stock items are typically packed the same day if the order is placed before 2:00 PM IST on a business day. Weekend and public-holiday orders move on the next working day.',
        'Made-to-order or back-ordered SKUs show an estimated dispatch date on the product page. We do not collect payment for items we cannot ship.',
      ],
      bullets: [
        'Metro cities: 2–4 business days after dispatch',
        'Tier-2 cities: 4–6 business days after dispatch',
        'Remote or restricted pincodes: 6–10 business days, or we will tell you before confirming',
      ],
    },
    {
      heading: 'Delivery charges',
      paragraphs: [
        'Standard delivery is free on orders above ₹999. Below that threshold a flat shipping fee is added at checkout. Oversized machines and bulk cartons may carry an extra handling charge, shown before you pay.',
      ],
    },
    {
      heading: 'Serviceable pincodes',
      paragraphs: [
        'We ship to most Indian pincodes through our courier partners. Enter your pincode on the product page to confirm serviceability, estimated delivery, and any cash-on-delivery limits.',
        'If a pincode is not serviceable we will not take the order. International shipping is not available yet.',
      ],
    },
    {
      heading: 'Tracking',
      paragraphs: [
        'A tracking link is emailed and SMS’d once the shipment is handed to the carrier. You can also open Track Order from your account or the footer. Failed delivery attempts are retried twice before the parcel is returned to us.',
      ],
    },
  ],
}
