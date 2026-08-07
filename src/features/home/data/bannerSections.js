/** Dummy banner strips shown between category sections — replace with API later.
 *  Index N is rendered after categorySections[N] (not after the last category). */

const u = (id, w = 800, h = 400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`

export const bannerSections = [
  {
    id: 'brand-promos',
    banners: [
      {
        id: 'bp-1',
        eyebrow: 'ForgePro',
        title: 'Power tools for every jobsite',
        badge: 'Upto 40% off',
        ctaLabel: 'Shop now',
        href: '/products?brand=forgepro',
        imageUrl: u('photo-1572981779307-38b8cabb2407'),
        tone: 'muted',
      },
      {
        id: 'bp-2',
        eyebrow: 'VoltEdge',
        title: 'Smart workshop gear',
        badge: 'Upto 35% off',
        ctaLabel: 'Shop now',
        href: '/products?brand=voltedge',
        imageUrl: u('photo-1581091226825-a6a2a5aee158'),
        tone: 'sand',
      },
      {
        id: 'bp-3',
        eyebrow: 'TorqueLab',
        title: 'Precision hand tools',
        badge: 'Upto 45% off',
        ctaLabel: 'Shop now',
        href: '/products?brand=torquelab',
        imageUrl: u('photo-1530124566582-a618bc2615dc'),
        tone: 'brand',
      },
      {
        id: 'bp-4',
        eyebrow: 'SparkKit',
        title: 'Safety & accessories',
        badge: 'Upto 30% off',
        ctaLabel: 'Shop now',
        href: '/products?brand=sparkkit',
        imageUrl: u('photo-1504148455328-c376907d081c'),
        tone: 'ink',
      },
    ],
  },
  {
    id: 'service-promos',
    banners: [
      {
        id: 'sp-1',
        eyebrow: 'OPEL Finance',
        title: 'Working capital for your business',
        subtitle: 'Unlock funds against approved invoices — fast and flexible.',
        ctaLabel: 'Learn more',
        href: '/about',
        imageUrl: u('photo-1454165804606-c3d57bc86b40'),
        tone: 'muted',
      },
      {
        id: 'sp-2',
        eyebrow: 'Brand store',
        title: 'One stop for trusted tool brands',
        subtitle: 'Browse curated catalogues from partners you already rely on.',
        ctaLabel: 'Explore store',
        href: '/products',
        imageUrl: u('photo-1581092160562-40aa08e78837'),
        tone: 'surface',
      },
      {
        id: 'sp-3',
        eyebrow: 'Orders',
        title: 'Track your shipment',
        subtitle: 'Live status from dispatch to delivery door.',
        ctaLabel: 'Track now',
        href: '/orders',
        imageUrl: u('photo-1566576912321-d58ddd7a6088'),
        tone: 'sand',
      },
    ],
  },
]
