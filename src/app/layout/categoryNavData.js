import {
  FiBatteryCharging,
  FiCpu,
  FiCrosshair,
  FiSettings,
  FiShield,
  FiTool,
} from 'react-icons/fi'

/** Static category nav + mega-menu data (swap for API later). */
export const categoryNavItems = [
  {
    id: 'power-tools',
    label: 'Power Tools',
    icon: FiTool,
    slug: 'power-tools',
    groups: [
      {
        title: 'Drills',
        links: [
          { label: 'Cordless Drills', slug: 'cordless-drills' },
          { label: 'Hammer Drills', slug: 'hammer-drills' },
          { label: 'Impact Drivers', slug: 'impact-drivers' },
          { label: 'Drill Kits', slug: 'drill-kits' },
        ],
      },
      {
        title: 'Grinders',
        links: [
          { label: 'Angle Grinders', slug: 'angle-grinders' },
          { label: 'Die Grinders', slug: 'die-grinders' },
          { label: 'Bench Grinders', slug: 'bench-grinders' },
        ],
      },
      {
        title: 'Saws',
        links: [
          { label: 'Circular Saws', slug: 'circular-saws' },
          { label: 'Jigsaws', slug: 'jigsaws' },
          { label: 'Reciprocating Saws', slug: 'reciprocating-saws' },
          { label: 'Cut-off Saws', slug: 'cut-off-saws' },
        ],
      },
    ],
  },
  {
    id: 'hand-tools',
    label: 'Hand Tools',
    icon: FiSettings,
    slug: 'hand-tools',
    groups: [
      {
        title: 'Wrenches',
        links: [
          { label: 'Combination Wrenches', slug: 'combination-wrenches' },
          { label: 'Adjustable Wrenches', slug: 'adjustable-wrenches' },
          { label: 'Socket Sets', slug: 'socket-sets' },
        ],
      },
      {
        title: 'Screwdrivers',
        links: [
          { label: 'Phillips Sets', slug: 'phillips-sets' },
          { label: 'Flathead Sets', slug: 'flathead-sets' },
          { label: 'Precision Kits', slug: 'precision-kits' },
          { label: 'Insulated Drivers', slug: 'insulated-drivers' },
        ],
      },
      {
        title: 'Pliers',
        links: [
          { label: 'Needle-Nose Pliers', slug: 'needle-nose-pliers' },
          { label: 'Locking Pliers', slug: 'locking-pliers' },
          { label: 'Cutting Pliers', slug: 'cutting-pliers' },
        ],
      },
    ],
  },
  {
    id: 'accessories',
    label: 'Accessories',
    icon: FiBatteryCharging,
    slug: 'accessories',
    groups: [
      {
        title: 'Bits & Blades',
        links: [
          { label: 'Drill Bits', slug: 'drill-bits' },
          { label: 'Saw Blades', slug: 'saw-blades' },
          { label: 'Grinding Discs', slug: 'grinding-discs' },
          { label: 'Driver Bits', slug: 'driver-bits' },
        ],
      },
      {
        title: 'Batteries',
        links: [
          { label: '18V Packs', slug: '18v-packs' },
          { label: '12V Packs', slug: '12v-packs' },
          { label: 'Battery Kits', slug: 'battery-kits' },
        ],
      },
      {
        title: 'Chargers',
        links: [
          { label: 'Fast Chargers', slug: 'fast-chargers' },
          { label: 'Dual Chargers', slug: 'dual-chargers' },
          { label: 'Car Chargers', slug: 'car-chargers' },
        ],
      },
    ],
  },
  {
    id: 'safety-gear',
    label: 'Safety Gear',
    icon: FiShield,
    slug: 'safety-gear',
    groups: [
      {
        title: 'Eye Protection',
        links: [
          { label: 'Safety Glasses', slug: 'safety-glasses' },
          { label: 'Goggles', slug: 'goggles' },
          { label: 'Face Shields', slug: 'face-shields' },
        ],
      },
      {
        title: 'Gloves',
        links: [
          { label: 'Cut-Resistant', slug: 'cut-resistant' },
          { label: 'Impact Gloves', slug: 'impact-gloves' },
          { label: 'General Purpose', slug: 'general-purpose-gloves' },
        ],
      },
      {
        title: 'Hearing',
        links: [
          { label: 'Ear Muffs', slug: 'ear-muffs' },
          { label: 'Ear Plugs', slug: 'ear-plugs' },
          { label: 'Communication Headsets', slug: 'communication-headsets' },
        ],
      },
    ],
  },
  {
    id: 'measuring',
    label: 'Measuring',
    icon: FiCrosshair,
    slug: 'measuring',
    groups: [
      {
        title: 'Levels',
        links: [
          { label: 'Spirit Levels', slug: 'spirit-levels' },
          { label: 'Laser Levels', slug: 'laser-levels' },
          { label: 'Digital Levels', slug: 'digital-levels' },
        ],
      },
      {
        title: 'Tape Measures',
        links: [
          { label: '5m Tapes', slug: '5m-tapes' },
          { label: '8m Tapes', slug: '8m-tapes' },
          { label: 'Long Tapes', slug: 'long-tapes' },
        ],
      },
      {
        title: 'Multimeters',
        links: [
          { label: 'Digital Multimeters', slug: 'digital-multimeters' },
          { label: 'Clamp Meters', slug: 'clamp-meters' },
          { label: 'Test Kits', slug: 'test-kits' },
        ],
      },
    ],
  },
  {
    id: 'spare-parts',
    label: 'Spare Parts',
    icon: FiCpu,
    slug: 'spare-parts',
    groups: [
      {
        title: 'Brushes',
        links: [
          { label: 'Carbon Brushes', slug: 'carbon-brushes' },
          { label: 'Brush Sets', slug: 'brush-sets' },
          { label: 'Brush Holders', slug: 'brush-holders' },
        ],
      },
      {
        title: 'Chucks',
        links: [
          { label: 'Keyless Chucks', slug: 'keyless-chucks' },
          { label: 'Keyed Chucks', slug: 'keyed-chucks' },
          { label: 'SDS Chucks', slug: 'sds-chucks' },
        ],
      },
      {
        title: 'Switches',
        links: [
          { label: 'Trigger Switches', slug: 'trigger-switches' },
          { label: 'Speed Controls', slug: 'speed-controls' },
          { label: 'Lock-On Switches', slug: 'lock-on-switches' },
        ],
      },
    ],
  },
]
