/** Category browse catalog — replace with API later.
 *  Free Unsplash images (tools / workshop / industrial). */

const u = (id, w = 600, h = 600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`

const IMG = {
  drill: 'photo-1572981779307-38b8cabb2407',
  grinder: 'photo-1504328345606-18bbc8c9d7d1',
  saw: 'photo-1589939705384-5185137a7f0f',
  impact: 'photo-1597484662317-9bd7bdda2907',
  workshop: 'photo-1504148455328-c376907d081c',
  bench: 'photo-1581091226825-a6a2a5aee158',
  industrial: 'photo-1581092160562-40aa08e78837',
  toolbox: 'photo-1530124566582-a618bc2615dc',
  multi: 'photo-1558618666-fcd25c85f82e',
  battery: 'photo-1597872200969-2b65d56bd16b',
}

function brand(id, name, photo, brandSlug, categorySlug = 'power-tools', subSlug = null) {
  const params = new URLSearchParams({ category: categorySlug, brand: brandSlug })
  if (subSlug) params.set('sub', subSlug)
  return {
    id,
    name,
    logoUrl: u(photo, 160, 160),
    href: `/products?${params.toString()}`,
  }
}

function product(id, title, photo, rating, reviewCount, current, original) {
  const discountPercentage = Math.round(((original - current) / original) * 100)
  return {
    id,
    title,
    imageUrl: u(photo),
    rating,
    reviewCount,
    currentPrice: current,
    originalPrice: original,
    discountPercentage,
    href: '/products',
  }
}

function hero(id, photo, linkUrl) {
  return {
    id,
    imageUrl: u(photo, 1600, 600),
    linkUrl,
  }
}

function powerToolBrands(subSlug = null) {
  return [
    brand('pt-b1', 'ForgePro', IMG.workshop, 'forgepro', 'power-tools', subSlug),
    brand('pt-b2', 'VoltEdge', IMG.bench, 'voltedge', 'power-tools', subSlug),
    brand('pt-b3', 'TorqueLab', IMG.industrial, 'torquelab', 'power-tools', subSlug),
    brand('pt-b4', 'SparkKit', IMG.toolbox, 'sparkkit', 'power-tools', subSlug),
  ]
}

const powerToolsProducts = [
  product('pt-p1', '18V Brushless Cordless Drill Kit with 2 Batteries', IMG.drill, 4.7, 251, 4699, 7999),
  product('pt-p2', 'Heavy-Duty Angle Grinder 850W', IMG.grinder, 4.5, 128, 2499, 3999),
  product('pt-p3', 'Compact Circular Saw 1400W with Laser Guide', IMG.saw, 4.6, 89, 5899, 8499),
  product('pt-p4', 'Impact Driver Set 12V with Bits Case', IMG.impact, 4.8, 312, 3299, 5499),
  product('pt-p5', 'Rotary Hammer Drill SDS-Plus 800W', IMG.workshop, 4.4, 76, 6799, 9999),
  product('pt-p6', 'Jigsaw with Variable Speed & LED Light', IMG.bench, 4.3, 54, 2199, 3499),
  product('pt-p7', 'Bench Grinder Dual Wheel 150mm', IMG.industrial, 4.5, 41, 2899, 4199),
  product('pt-p8', 'Reciprocating Saw Corded 850W', IMG.toolbox, 4.2, 33, 3599, 5299),
  product('pt-p9', 'Multi-Tool Oscillating Kit 300W', IMG.multi, 4.6, 97, 4199, 6499),
  product('pt-p10', '18V Compact Drill Driver Soft Grip', IMG.drill, 4.5, 184, 2899, 4499),
  product('pt-p11', 'Die Grinder 25,000 RPM Corded', IMG.grinder, 4.3, 62, 1999, 3199),
  product('pt-p12', 'Cut-off Saw 355mm Abrasive', IMG.saw, 4.4, 48, 8999, 12999),
  product('pt-p13', 'Brushless Impact Wrench 1/2-Inch', IMG.impact, 4.7, 203, 5499, 7999),
  product('pt-p14', 'Cordless Combo Kit 4-Tool 18V', IMG.workshop, 4.8, 410, 12999, 18999),
  product('pt-p15', 'Planer Corded 82mm Depth Gauge', IMG.bench, 4.2, 29, 4599, 6999),
  product('pt-p16', 'Orbital Sander 125mm Dust Port', IMG.industrial, 4.5, 117, 1899, 2999),
  product('pt-p17', 'Heat Gun Dual Temp Kit', IMG.toolbox, 4.3, 88, 1499, 2499),
  product('pt-p18', 'Router Plunge Base 1200W', IMG.multi, 4.6, 71, 6299, 8999),
  product('pt-p19', 'Cordless Nailer Framing 18V', IMG.battery, 4.4, 95, 7899, 11499),
  product('pt-p20', 'Shop Vacuum Wet Dry 20L', IMG.workshop, 4.5, 143, 3999, 5999),
]

const cordlessDrillProducts = [
  product('cd-p1', '18V Brushless Compact Drill 2×2.0Ah', IMG.drill, 4.8, 320, 4299, 6999),
  product('cd-p2', '12V Pocket Drill Driver Kit', IMG.impact, 4.6, 198, 2799, 4299),
  product('cd-p3', '20V Max Hammer Drill SDS Lite', IMG.workshop, 4.7, 156, 5999, 8999),
  product('cd-p4', 'Brushless Drill + Impact Combo', IMG.bench, 4.9, 445, 8499, 12999),
  product('cd-p5', 'Heavy-Duty 18V Drill 80Nm Torque', IMG.industrial, 4.5, 112, 5199, 7799),
  product('cd-p6', 'Compact Drill Soft Case Single Battery', IMG.toolbox, 4.4, 87, 2499, 3999),
  product('cd-p7', 'Hammer Cordless 18V Masonry Ready', IMG.grinder, 4.6, 134, 6499, 9499),
  product('cd-p8', 'Pro Brushless Drill Bare Tool', IMG.saw, 4.7, 201, 3599, 5499),
  product('cd-p9', 'Drill Kit 100-Piece Accessory Pack', IMG.multi, 4.5, 267, 1899, 2999),
  product('cd-p10', 'Right-Angle Compact Drill 12V', IMG.battery, 4.3, 54, 3999, 5999),
  product('cd-p11', '18V Drill Driver LED Work Light', IMG.drill, 4.6, 173, 3099, 4799),
  product('cd-p12', 'Brushless Twin Pack Drill & Driver', IMG.impact, 4.8, 298, 9999, 14999),
  product('cd-p13', 'Starter Cordless Drill 10mm Chuck', IMG.workshop, 4.2, 91, 1699, 2799),
  product('cd-p14', 'Pro Hammer Drill Dual Speed', IMG.bench, 4.7, 142, 7299, 10999),
  product('cd-p15', 'Compact Brushless 40Nm Kit', IMG.industrial, 4.5, 119, 4599, 6999),
  product('cd-p16', 'Jobsite Drill Combo Soft Bag', IMG.toolbox, 4.6, 188, 7899, 11499),
  product('cd-p17', 'Keyless Chuck Upgrade Drill 18V', IMG.grinder, 4.4, 66, 3399, 5199),
  product('cd-p18', 'All-Terrain Cordless Drill IP54', IMG.saw, 4.5, 78, 5699, 8499),
  product('cd-p19', '18V Drill with Extra Battery & Charger', IMG.battery, 4.6, 164, 5499, 8299),
  product('cd-p20', 'Brushless Compact Drill Soft Bag Kit', IMG.multi, 4.7, 211, 6299, 9499),
]

/** Fully wired browse nodes. Only Power Tools (+ Cordless Drills child) are complete. */
export const categoryCatalog = {
  'power-tools': {
    slug: 'power-tools',
    title: 'Power Tools',
    description:
      'Professional drills, grinders, saws, and drivers for jobsite and workshop use. Shop trusted brands with fast delivery across India. Compare brushless kits, corded workhorses, and battery platforms in one place — built for contractors, fabricators, and serious DIY projects every day.',
    heroSlides: [
      hero('pt-h1', IMG.workshop, '/category/power-tools/cordless-drills'),
      hero('pt-h2', IMG.drill, '/category/power-tools/cordless-drills'),
      hero('pt-h3', IMG.grinder, '/products?category=angle-grinders'),
      hero('pt-h4', IMG.saw, '/products?category=circular-saws'),
    ],
    children: [
      {
        slug: 'cordless-drills',
        title: 'Cordless Drills',
        imageUrl: u(IMG.drill, 400, 400),
        description: 'Brushless and compact cordless drills',
        href: '/category/power-tools/cordless-drills',
      },
      {
        slug: 'angle-grinders',
        title: 'Angle Grinders',
        imageUrl: u(IMG.grinder, 400, 400),
        description: 'Cutting and grinding for metal & masonry',
        href: '/products?category=angle-grinders',
      },
      {
        slug: 'circular-saws',
        title: 'Circular Saws',
        imageUrl: u(IMG.saw, 400, 400),
        description: 'Rip and crosscut with laser guides',
        href: '/products?category=circular-saws',
      },
      {
        slug: 'impact-drivers',
        title: 'Impact Drivers',
        imageUrl: u(IMG.impact, 400, 400),
        description: 'High-torque fastening for pros',
        href: '/products?category=impact-drivers',
      },
      {
        slug: 'hammer-drills',
        title: 'Hammer Drills',
        imageUrl: u(IMG.workshop, 400, 400),
        description: 'Masonry-ready rotary hammers',
        href: '/products?category=hammer-drills',
      },
      {
        slug: 'jigsaws',
        title: 'Jigsaws',
        imageUrl: u(IMG.bench, 400, 400),
        description: 'Curve cutting with variable speed',
        href: '/products?category=jigsaws',
      },
    ],
    childSpotlights: [
      {
        childSlug: 'cordless-drills',
        title: 'Cordless Drills',
        viewAllHref: '/category/power-tools/cordless-drills',
        brands: powerToolBrands('cordless-drills'),
        products: cordlessDrillProducts.slice(0, 8),
      },
      {
        childSlug: 'angle-grinders',
        title: 'Angle Grinders',
        viewAllHref: '/products?category=angle-grinders',
        brands: powerToolBrands('angle-grinders'),
        products: [
          product('ag-sp1', 'Heavy-Duty Angle Grinder 850W', IMG.grinder, 4.5, 128, 2499, 3999),
          product('ag-sp2', 'Slim Body Grinder 115mm', IMG.workshop, 4.4, 92, 1899, 2999),
          product('ag-sp3', 'Brushless Grinder 18V Bare', IMG.bench, 4.6, 74, 4299, 6499),
          product('ag-sp4', 'Grinder Kit with Discs Pack', IMG.industrial, 4.3, 61, 3199, 4799),
          product('ag-sp5', 'Corded Angle Grinder 1000W', IMG.toolbox, 4.4, 88, 2799, 4199),
          product('ag-sp6', 'Mini Grinder 4-Inch Compact', IMG.drill, 4.2, 52, 1599, 2499),
          product('ag-sp7', 'Grinder with Side Handle Soft Start', IMG.saw, 4.5, 71, 3499, 5299),
          product('ag-sp8', 'Pro Angle Grinder Guard Kit', IMG.multi, 4.3, 44, 2299, 3599),
        ],
      },
      {
        childSlug: 'impact-drivers',
        title: 'Impact Drivers',
        viewAllHref: '/products?category=impact-drivers',
        brands: powerToolBrands('impact-drivers'),
        products: [
          product('id-sp1', 'Impact Driver Set 12V with Bits Case', IMG.impact, 4.8, 312, 3299, 5499),
          product('id-sp2', 'Brushless Impact 18V High Torque', IMG.drill, 4.7, 188, 4999, 7499),
          product('id-sp3', 'Compact Impact Driver Soft Grip', IMG.bench, 4.5, 104, 2799, 4199),
          product('id-sp4', 'Impact + Bit Assortment Kit', IMG.toolbox, 4.6, 156, 3599, 5499),
          product('id-sp5', '18V Impact Driver Bare Tool', IMG.workshop, 4.4, 97, 2999, 4599),
          product('id-sp6', 'Impact Driver Hex Chuck Kit', IMG.industrial, 4.5, 83, 3899, 5799),
          product('id-sp7', 'Twin Pack Impact & Drill', IMG.saw, 4.7, 201, 8999, 12999),
          product('id-sp8', 'Jobsite Impact Driver Soft Case', IMG.multi, 4.3, 66, 4199, 6299),
        ],
      },
    ],
    products: powerToolsProducts,
    productsHref: '/products?category=power-tools',
    childrenNodes: {
      'cordless-drills': {
        slug: 'cordless-drills',
        title: 'Cordless Drills',
        description:
          'From compact pocket drivers to brushless hammer drills — find the right cordless drill for every job. Explore compact, brushless, hammer, and combo kits with batteries and chargers included. Built for fastening, drilling into wood, metal, and masonry with the runtime and torque you need on site.',
        heroSlides: [
          hero('cd-h1', IMG.drill, '/products?category=brushless-drills'),
          hero('cd-h2', IMG.workshop, '/products?category=compact-cordless'),
          hero('cd-h3', IMG.impact, '/products?category=drill-combo-kits'),
        ],
        children: [
          {
            slug: 'compact-cordless',
            title: 'Compact Cordless',
            imageUrl: u(IMG.drill, 400, 400),
            description: 'Lightweight drills for tight spaces',
            href: '/products?category=compact-cordless',
          },
          {
            slug: 'brushless-drills',
            title: 'Brushless Drills',
            imageUrl: u(IMG.workshop, 400, 400),
            description: 'Longer runtime and higher torque',
            href: '/products?category=brushless-drills',
          },
          {
            slug: 'hammer-cordless',
            title: 'Hammer Cordless',
            imageUrl: u(IMG.industrial, 400, 400),
            description: 'Masonry and concrete ready',
            href: '/products?category=hammer-cordless',
          },
          {
            slug: 'drill-combo-kits',
            title: 'Drill Combo Kits',
            imageUrl: u(IMG.toolbox, 400, 400),
            description: 'Drill + driver sets with batteries',
            href: '/products?category=drill-combo-kits',
          },
        ],
        childSpotlights: [
          {
            childSlug: 'brushless-drills',
            title: 'Brushless Drills',
            viewAllHref: '/products?category=brushless-drills',
            brands: powerToolBrands('brushless-drills'),
            products: cordlessDrillProducts.slice(0, 8),
          },
          {
            childSlug: 'compact-cordless',
            title: 'Compact Cordless',
            viewAllHref: '/products?category=compact-cordless',
            brands: powerToolBrands('compact-cordless'),
            products: cordlessDrillProducts.slice(1, 9),
          },
          {
            childSlug: 'drill-combo-kits',
            title: 'Drill Combo Kits',
            viewAllHref: '/products?category=drill-combo-kits',
            brands: powerToolBrands('drill-combo-kits'),
            products: [
              cordlessDrillProducts[3],
              cordlessDrillProducts[11],
              cordlessDrillProducts[15],
              cordlessDrillProducts[7],
              cordlessDrillProducts[4],
              cordlessDrillProducts[12],
              cordlessDrillProducts[16],
              cordlessDrillProducts[19],
            ],
          },
        ],
        products: cordlessDrillProducts,
        productsHref: '/products?category=cordless-drills',
      },
    },
  },
}

/**
 * Resolve a category browse node and breadcrumb trail.
 * @param {string} categorySlug
 * @param {string} [subSlug]
 * @returns {{ node: object, breadcrumbs: Array<{ label: string, href?: string }> } | null}
 */
export function getCategoryNode(categorySlug, subSlug) {
  const root = categoryCatalog[categorySlug]
  if (!root) return null

  const rootHref = `/category/${categorySlug}`

  if (!subSlug) {
    return {
      node: root,
      breadcrumbs: [{ label: 'Home', href: '/' }, { label: root.title }],
    }
  }

  const child = root.childrenNodes?.[subSlug]
  if (!child) return null

  return {
    node: child,
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: root.title, href: rootHref },
      { label: child.title },
    ],
  }
}
