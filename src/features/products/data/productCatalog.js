/** Central product catalog — replace with API later. */

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
  wrench: 'photo-1530124566582-a618bc2615dc',
  screw: 'photo-1581092918056-0c4c3faec2a5',
  plier: 'photo-1426927308491-6380b6a9936f',
  safety: 'photo-1581091226825-a6a2a5aee158',
  measure: 'photo-1581092160562-40aa08e78837',
}

const BRANDS_BY_CATEGORY = {
  'power-tools': ['forgepro', 'voltedge', 'torquelab', 'sparkkit'],
  'hand-tools': ['gripmax', 'steelcraft', 'hexora', 'pinion'],
  accessories: ['bitforge', 'powercell', 'chargehub', 'bladerun'],
  'safety-gear': ['forgepro', 'voltedge', 'gripmax', 'steelcraft'],
  measuring: ['hexora', 'pinion', 'torquelab', 'bitforge'],
  'spare-parts': ['sparkkit', 'powercell', 'chargehub', 'bladerun'],
}

/**
 * @param {object} opts
 */
function createProduct(opts) {
  const {
    id,
    title,
    imageUrl,
    rating,
    reviewCount,
    currentPrice,
    originalPrice,
    categorySlug,
    subCategorySlug,
    brandSlug,
  } = opts
  const discountPercentage = Math.round(
    ((originalPrice - currentPrice) / originalPrice) * 100,
  )
  return {
    id,
    title,
    imageUrl,
    rating,
    reviewCount,
    currentPrice,
    originalPrice,
    discountPercentage,
    href: `/products?id=${id}`,
    categorySlug,
    subCategorySlug,
    brandSlug,
  }
}

function seedCategoryProducts(categorySlug, subSlugs, titles, imageKeys, idPrefix) {
  const brands = BRANDS_BY_CATEGORY[categorySlug] ?? BRANDS_BY_CATEGORY['power-tools']
  /** @type {ReturnType<typeof createProduct>[]} */
  const products = []

  titles.forEach((title, index) => {
    const subCategorySlug = subSlugs[index % subSlugs.length]
    const brandSlug = brands[index % brands.length]
    const imageKey = imageKeys[index % imageKeys.length]
    const base = 800 + (index % 12) * 350
    const currentPrice = base + (index % 5) * 199
    const originalPrice = Math.round(currentPrice * (1.4 + (index % 3) * 0.15))
    const rating = 3.8 + (index % 12) * 0.1
    const reviewCount = 30 + index * 17

    products.push(
      createProduct({
        id: `${idPrefix}-${index + 1}`,
        title,
        imageUrl: u(IMG[imageKey] ?? IMG.workshop),
        rating: Math.min(4.9, Math.round(rating * 10) / 10),
        reviewCount,
        currentPrice,
        originalPrice,
        categorySlug,
        subCategorySlug,
        brandSlug,
      }),
    )
  })

  return products
}

const powerToolsTitles = [
  '18V Brushless Cordless Drill Kit with 2 Batteries',
  'Heavy-Duty Angle Grinder 850W',
  'Compact Circular Saw 1400W with Laser Guide',
  'Impact Driver Set 12V with Bits Case',
  'Rotary Hammer Drill SDS-Plus 800W',
  'Jigsaw with Variable Speed & LED Light',
  'Bench Grinder Dual Wheel 150mm',
  'Reciprocating Saw Corded 850W',
  'Multi-Tool Oscillating Kit 300W',
  '18V Compact Drill Driver Soft Grip',
  'Die Grinder 25,000 RPM Corded',
  'Cut-off Saw 355mm Abrasive',
  'Brushless Impact Wrench 1/2-Inch',
  'Cordless Combo Kit 4-Tool 18V',
  'Planer Corded 82mm Depth Gauge',
  'Orbital Sander 125mm Dust Port',
  'Heat Gun Dual Temp Kit',
  'Router Plunge Base 1200W',
  'Cordless Nailer Framing 18V',
  'Shop Vacuum Wet Dry 20L',
  '18V Brushless Compact Drill 2×2.0Ah',
  '12V Pocket Drill Driver Kit',
  '20V Max Hammer Drill SDS Lite',
  'Brushless Drill + Impact Combo',
  'Heavy-Duty 18V Drill 80Nm Torque',
  'Compact Drill Soft Case Single Battery',
  'Hammer Cordless 18V Masonry Ready',
  'Pro Brushless Drill Bare Tool',
  'Drill Kit 100-Piece Accessory Pack',
  'Right-Angle Compact Drill 12V',
]

const powerToolsSubs = [
  'cordless-drills',
  'angle-grinders',
  'circular-saws',
  'impact-drivers',
  'hammer-drills',
  'jigsaws',
  'bench-grinders',
  'reciprocating-saws',
  'cordless-drills',
  'cordless-drills',
  'angle-grinders',
  'cut-off-saws',
  'impact-drivers',
  'cordless-drills',
  'circular-saws',
  'angle-grinders',
  'hammer-drills',
  'circular-saws',
  'impact-drivers',
  'angle-grinders',
  'brushless-drills',
  'compact-cordless',
  'hammer-cordless',
  'drill-combo-kits',
  'brushless-drills',
  'compact-cordless',
  'hammer-cordless',
  'brushless-drills',
  'drill-combo-kits',
  'compact-cordless',
]

const powerToolsImages = [
  'drill', 'grinder', 'saw', 'impact', 'workshop', 'bench', 'industrial',
  'toolbox', 'multi', 'drill', 'grinder', 'saw', 'impact', 'workshop',
  'bench', 'industrial', 'toolbox', 'multi', 'battery', 'workshop',
  'drill', 'impact', 'workshop', 'bench', 'industrial', 'toolbox',
  'grinder', 'saw', 'multi', 'battery',
]

const handToolsTitles = [
  'Combination Wrench Set 12-Piece Chrome Vanadium',
  'Precision Screwdriver Kit 32-in-1 Magnetic Tips',
  'Locking Pliers Set 3-Piece Adjustable',
  'Socket Set 46-Piece Drive Kit with Ratchet',
  'Adjustable Wrench 250mm Soft-Grip Handle',
  'Needle-Nose Pliers Insulated 200mm',
  'Hex Key Set Ball-End Long Arm 9-Piece',
  'Torque Wrench 1/2-Inch Drive 40–200 Nm',
  'Cutting Pliers Diagonal Side Cutters 160mm',
  'Flathead Screwdriver Set Insulated 6-Piece',
  'Socket Set Metric 32-Piece',
  'Combination Pliers 180mm',
  'Ratchet Handle Quick Release 1/2-Inch',
  'Precision Torque Screwdriver Kit',
  'Adjustable Spanner Set 3-Piece',
  'Long Nose Pliers Set 2-Piece',
  'Phillips Screwdriver Set 8-Piece',
  'Insulated Driver Kit VDE Rated',
]

const handToolsSubs = [
  'combination-wrenches', 'phillips-sets', 'locking-pliers', 'socket-sets',
  'adjustable-wrenches', 'needle-nose-pliers', 'socket-sets', 'combination-wrenches',
  'cutting-pliers', 'flathead-sets', 'socket-sets', 'locking-pliers',
  'socket-sets', 'precision-kits', 'adjustable-wrenches', 'needle-nose-pliers',
  'phillips-sets', 'insulated-drivers',
]

const accessoriesTitles = [
  'HSS Drill Bit Set 19-Piece Titanium Coated',
  'Circular Saw Blade 184mm Carbide Tip',
  '18V Li-Ion Battery Pack 5.0Ah',
  'Dual Port Fast Charger Compatible Kit',
  'Grinding Disc Pack 10-Piece 115mm',
  'Driver Bit Set Magnetic 50-Piece Case',
  '12V Compact Battery Pack 2.0Ah',
  'Jigsaw Blade Assortment Wood & Metal 20pc',
  'Car Charger Adapter 12V Tool Battery',
  'SDS Drill Bit Set 5-Piece',
  'Oscillating Blade Multi-Pack 15pc',
  '18V Battery Twin Pack 4.0Ah',
  'Bench Grinder Wire Wheel 150mm',
  'Reciprocating Saw Blade Set 12pc',
  'Impact Socket Adapter Set 3-Piece',
  'Fast Charger Dual Port LED Status',
  'Tungsten Carbide Hole Saw Kit',
  'Magnetic Bit Holder Extension Set',
]

const accessoriesSubs = [
  'drill-bits', 'saw-blades', '18v-packs', 'fast-chargers', 'grinding-discs',
  'driver-bits', '12v-packs', 'saw-blades', 'car-chargers', 'drill-bits',
  'saw-blades', 'battery-kits', 'grinding-discs', 'saw-blades', 'driver-bits',
  'dual-chargers', 'drill-bits', 'driver-bits',
]

const allProducts = [
  ...powerToolsTitles.map((title, index) =>
    createProduct({
      id: `pt-${index + 1}`,
      title,
      imageUrl: u(IMG[powerToolsImages[index]]),
      rating: Math.min(4.9, 4.2 + (index % 8) * 0.1),
      reviewCount: 40 + index * 23,
      currentPrice: [4699, 2499, 5899, 3299, 6799, 2199, 2899, 3599, 4199, 2899, 1999, 8999, 5499, 12999, 4599, 1899, 1499, 6299, 7899, 3999, 4299, 2799, 5999, 8499, 5199, 2499, 6499, 3599, 1899, 3999][index] ?? 2999,
      originalPrice: [7999, 3999, 8499, 5499, 9999, 3499, 4199, 5299, 6499, 4499, 3199, 12999, 7999, 18999, 6999, 2999, 2499, 8999, 11499, 5999, 6999, 4299, 8999, 12999, 7799, 3999, 9499, 5499, 2999, 5999][index] ?? 4999,
      categorySlug: 'power-tools',
      subCategorySlug: powerToolsSubs[index],
      brandSlug: BRANDS_BY_CATEGORY['power-tools'][index % 4],
    }),
  ),
  ...seedCategoryProducts(
    'hand-tools',
    handToolsSubs,
    handToolsTitles,
    ['wrench', 'screw', 'plier', 'toolbox', 'wrench', 'plier', 'toolbox', 'wrench'],
    'ht',
  ),
  ...seedCategoryProducts(
    'accessories',
    accessoriesSubs,
    accessoriesTitles,
    ['grinder', 'saw', 'battery', 'battery', 'grinder', 'screw', 'battery', 'saw'],
    'ac',
  ),
  ...seedCategoryProducts(
    'safety-gear',
    ['safety-glasses', 'goggles', 'cut-resistant', 'ear-muffs', 'face-shields', 'impact-gloves'],
    [
      'Anti-Fog Safety Glasses Clear Lens',
      'Wraparound Goggles Ventilated',
      'Cut-Resistant Gloves Level 5',
      'Ear Muffs SNR 30dB Folding',
      'Face Shield Polycarbonate',
      'Impact Gloves Reinforced Knuckle',
      'Ear Plugs Foam 50-Pair Box',
      'General Purpose Work Gloves Pack',
      'Laser Safety Glasses Shade 3',
      'Communication Headset Bluetooth',
    ],
    ['safety', 'safety', 'toolbox', 'bench'],
    'sg',
  ),
  ...seedCategoryProducts(
    'measuring',
    ['spirit-levels', 'laser-levels', '5m-tapes', 'digital-multimeters', 'clamp-meters'],
    [
      'Spirit Level 600mm Magnetic',
      'Cross-Line Laser Level Self-Leveling',
      'Tape Measure 5m Auto Lock',
      'Digital Multimeter CAT III 600V',
      'Clamp Meter AC/DC 400A',
      'Long Tape Measure 30m Open Reel',
      'Digital Level Inclinometer',
      '8m Tape Measure Wide Blade',
      'Test Kit Electrical Basic',
      'Laser Distance Meter 40m',
    ],
    ['measure', 'measure', 'toolbox', 'industrial'],
    'ms',
  ),
  ...seedCategoryProducts(
    'spare-parts',
    ['carbon-brushes', 'keyless-chucks', 'trigger-switches', 'brush-sets', 'sds-chucks'],
    [
      'Carbon Brush Set Universal 4-Piece',
      'Keyless Chuck 13mm Replacement',
      'Trigger Switch Assembly Compatible',
      'Brush Holder Kit Spare',
      'SDS Chuck Adapter Quick Change',
      'Speed Control Module Replacement',
      'Lock-On Switch Repair Part',
      'Keyed Chuck 1/2-Inch Spare',
    ],
    ['industrial', 'drill', 'toolbox', 'bench'],
    'sp',
  ),
]

/** @type {Map<string, ReturnType<typeof createProduct>>} */
const byId = new Map()
for (const product of allProducts) {
  if (!byId.has(product.id)) byId.set(product.id, product)
}

const catalog = [...byId.values()]

export function getAllProducts() {
  return catalog
}

/**
 * @param {Array} products
 * @param {import('../utils/productFilters.js').ProductFilterParams} filters
 */
export function getFilterFacets(products, filters) {
  void filters
  return {
    priceMin: Math.min(...products.map((p) => p.currentPrice)),
    priceMax: Math.max(...products.map((p) => p.currentPrice)),
  }
}

export { filterAndSortProducts, paginateProducts } from '../utils/productFilters.js'
