import { categoryNavItems } from '../../../app/layout/categoryNavData'
import { categoryCatalog } from '../../category/data/categoryCatalog'

/** @typedef {{ slug: string, label: string, parentSlug?: string, parentLabel?: string, isLeaf: boolean }} ResolvedSlug */

const leafToParent = new Map()
const slugLabels = new Map()
const topLevelSlugs = new Set()

for (const cat of categoryNavItems) {
  topLevelSlugs.add(cat.slug)
  slugLabels.set(cat.slug, cat.label)

  for (const group of cat.groups) {
    for (const link of group.links) {
      leafToParent.set(link.slug, cat.slug)
      slugLabels.set(link.slug, link.label)
    }
  }
}

for (const root of Object.values(categoryCatalog)) {
  slugLabels.set(root.slug, root.title)
  for (const child of root.childrenNodes ? Object.values(root.childrenNodes) : []) {
    slugLabels.set(child.slug, child.title)
    leafToParent.set(child.slug, root.slug)
    for (const leaf of child.children ?? []) {
      slugLabels.set(leaf.slug, leaf.title)
      leafToParent.set(leaf.slug, child.slug)
    }
  }
}

/**
 * Resolve any category/sub slug to taxonomy metadata.
 * @param {string} slug
 * @returns {ResolvedSlug | null}
 */
export function resolveSlug(slug) {
  if (!slug) return null

  const label = slugLabels.get(slug) ?? slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  if (topLevelSlugs.has(slug)) {
    return { slug, label, isLeaf: false }
  }

  const parentSlug = leafToParent.get(slug)
  if (parentSlug) {
    const parentLabel = slugLabels.get(parentSlug)
    const isParentTop = topLevelSlugs.has(parentSlug)
    return {
      slug,
      label,
      parentSlug: isParentTop ? parentSlug : leafToParent.get(parentSlug) ?? parentSlug,
      parentLabel: isParentTop ? parentLabel : slugLabels.get(leafToParent.get(parentSlug) ?? parentSlug),
      isLeaf: true,
    }
  }

  return { slug, label, isLeaf: true }
}

/**
 * Get top-level category slug for a sub slug (walks up to nav root).
 * @param {string} subSlug
 */
export function getTopLevelParentForSub(subSlug) {
  let current = subSlug
  let parent = leafToParent.get(current)

  while (parent && !topLevelSlugs.has(parent)) {
    current = parent
    parent = leafToParent.get(current)
  }

  return topLevelSlugs.has(parent) ? parent : null
}

/**
 * Normalize URL filter params (handles legacy `category=leaf-slug`).
 * @param {{ category?: string | null, sub?: string | null }} raw
 */
export function normalizeFilterParams(raw) {
  let category = raw.category?.trim() || null
  let sub = raw.sub?.trim() || null

  if (category && !sub) {
    const resolved = resolveSlug(category)
    if (resolved?.isLeaf) {
      sub = category
      category = resolved.parentSlug ?? null
    }
  }

  if (sub && !category) {
    const resolved = resolveSlug(sub)
    if (resolved?.parentSlug && topLevelSlugs.has(resolved.parentSlug)) {
      category = resolved.parentSlug
    } else if (resolved?.parentSlug) {
      const parentResolved = resolveSlug(resolved.parentSlug)
      category = parentResolved?.parentSlug ?? parentResolved?.slug ?? null
    }
  }

  return { category, sub }
}

export function getCategoryLabel(slug) {
  return slugLabels.get(slug) ?? slug
}

export function getTopLevelCategories() {
  return categoryNavItems.map((item) => ({
    slug: item.slug,
    label: item.label,
  }))
}

export function getSubCategoriesForParent(parentSlug) {
  if (!parentSlug) {
    return [...leafToParent.entries()].map(([slug, parent]) => ({
      slug,
      label: getCategoryLabel(slug),
      parentSlug: parent,
    }))
  }

  const cat = categoryNavItems.find((item) => item.slug === parentSlug)
  if (!cat) return []

  const subs = []
  for (const group of cat.groups) {
    for (const link of group.links) {
      subs.push({ slug: link.slug, label: link.label, parentSlug })
    }
  }

  const browseRoot = categoryCatalog[parentSlug]
  if (browseRoot?.childrenNodes) {
    for (const node of Object.values(browseRoot.childrenNodes)) {
      for (const leaf of node.children ?? []) {
        subs.push({ slug: leaf.slug, label: leaf.title, parentSlug })
      }
    }
  }

  return subs
}

/**
 * Union of sub-categories for selected parent categories.
 * When none selected, returns all nav subs.
 * @param {string[]} parentSlugs
 */
export function getSubCategoriesForParents(parentSlugs) {
  if (!parentSlugs?.length) {
    return getSubCategoriesForParent(null)
  }

  const seen = new Set()
  /** @type {Array<{ slug: string, label: string, parentSlug: string }>} */
  const subs = []

  for (const parentSlug of parentSlugs) {
    for (const sub of getSubCategoriesForParent(parentSlug)) {
      if (!seen.has(sub.slug)) {
        seen.add(sub.slug)
        subs.push(sub)
      }
    }
  }

  return subs
}

/**
 * Remove sub slugs that don't belong to any selected category.
 * @param {string[]} subs
 * @param {string[]} categories
 */
export function pruneSubsForCategories(subs, categories) {
  if (!categories.length) return subs

  const validSlugs = new Set(
    getSubCategoriesForParents(categories).map((sub) => sub.slug),
  )
  return subs.filter((slug) => validSlugs.has(slug))
}

export function getAllBrandOptions() {
  const brands = new Map()
  const add = (slug, name) => {
    if (!brands.has(slug)) brands.set(slug, name)
  }

  add('forgepro', 'ForgePro')
  add('voltedge', 'VoltEdge')
  add('torquelab', 'TorqueLab')
  add('sparkkit', 'SparkKit')
  add('gripmax', 'GripMax')
  add('steelcraft', 'SteelCraft')
  add('hexora', 'Hexora')
  add('pinion', 'Pinion')
  add('bitforge', 'BitForge')
  add('powercell', 'PowerCell')
  add('chargehub', 'ChargeHub')
  add('bladerun', 'BladeRun')

  return [...brands.entries()].map(([slug, label]) => ({ slug, label }))
}

export { topLevelSlugs, slugLabels, leafToParent }
