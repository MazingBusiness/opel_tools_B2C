import { useEffect, useId, useRef, useState } from 'react'
import { FiArrowLeft, FiSearch } from 'react-icons/fi'
import FilterAccordionSection from './FilterAccordionSection'
import FilterOptionsPicker from './FilterOptionsPicker'
import { countProductsForFacet } from '../utils/productFilters'

/**
 * @param {{
 *   filters: import('../utils/productFilters.js').ProductFilterParams,
 *   categories: Array<{ slug: string, label: string }>,
 *   subCategories: Array<{ slug: string, label: string }>,
 *   brands: Array<{ slug: string, label: string }>,
 *   facets: { priceMin: number, priceMax: number },
 *   allProducts: Array<object>,
 *   onToggle: (key: string, slug: string) => void,
 *   onScalarChange: (key: string, value: string | number | null) => void,
 *   onClearAll: () => void,
 *   idPrefix?: string,
 *   pickerVariant?: 'modal' | 'panel',
 * }} props
 */
export default function ProductFiltersPanel({
  filters,
  categories,
  subCategories,
  brands,
  facets,
  allProducts,
  onToggle,
  onScalarChange,
  onClearAll,
  idPrefix = 'filter',
  pickerVariant = 'modal',
}) {
  const priceActive = filters.min != null || filters.max != null
  const ratingActive = filters.ratingMin != null

  const brandItems = brands.map((brand) => ({
    slug: brand.slug,
    label: brand.label,
    count: countProductsForFacet(allProducts, filters, 'brands', brand.slug),
  }))

  const categoryItems = categories.map((cat) => ({
    slug: cat.slug,
    label: cat.label,
    count: countProductsForFacet(allProducts, filters, 'categories', cat.slug),
  }))

  const subCategoryItems = subCategories.map((sub) => ({
    slug: sub.slug,
    label: sub.label,
    count: countProductsForFacet(allProducts, filters, 'subs', sub.slug),
  }))

  return (
    <div className="space-y-1">
      <FilterAccordionSection
        title="Price"
        id={`${idPrefix}-price`}
        activeCount={priceActive ? 1 : 0}
        defaultOpen={priceActive}
      >
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder={`Min (${facets.priceMin})`}
            value={filters.min ?? ''}
            onChange={(e) =>
              onScalarChange('min', e.target.value ? Number(e.target.value) : null)
            }
            className="w-full rounded-md border border-border bg-surface px-2.5 py-2 text-sm text-ink outline-none focus:border-brand"
          />
          <span className="text-ink-muted">–</span>
          <input
            type="number"
            min={0}
            placeholder={`Max (${facets.priceMax})`}
            value={filters.max ?? ''}
            onChange={(e) =>
              onScalarChange('max', e.target.value ? Number(e.target.value) : null)
            }
            className="w-full rounded-md border border-border bg-surface px-2.5 py-2 text-sm text-ink outline-none focus:border-brand"
          />
        </div>
      </FilterAccordionSection>

      <FilterAccordionSection
        title="Brand"
        id={`${idPrefix}-brand`}
        activeCount={filters.brands.length}
      >
        <FilterOptionsPicker
          title="All brands"
          items={brandItems}
          selected={filters.brands}
          onToggle={(slug) => onToggle('brands', slug)}
          variant={pickerVariant}
          renderCheckbox={(props) => <FilterCheckbox {...props} />}
        />
      </FilterAccordionSection>

      <FilterAccordionSection
        title="Rating"
        id={`${idPrefix}-rating`}
        activeCount={ratingActive ? 1 : 0}
        defaultOpen={ratingActive}
      >
        <ul className="space-y-2">
          {[null, 4, 3].map((min) => (
            <li key={min ?? 'all'}>
              <FilterRadio
                name={`${idPrefix}-rating`}
                checked={(filters.ratingMin ?? null) === min}
                onChange={() => onScalarChange('ratingMin', min)}
                label={min ? `${min}+ stars` : 'All ratings'}
              />
            </li>
          ))}
        </ul>
      </FilterAccordionSection>

      <FilterAccordionSection
        title="Category"
        id={`${idPrefix}-category`}
        activeCount={filters.categories.length}
      >
        <FilterOptionsPicker
          title="All categories"
          items={categoryItems}
          selected={filters.categories}
          onToggle={(slug) => onToggle('categories', slug)}
          variant={pickerVariant}
          renderCheckbox={(props) => <FilterCheckbox {...props} />}
        />
      </FilterAccordionSection>

      {subCategories.length > 0 ? (
        <FilterAccordionSection
          title="Sub-category"
          id={`${idPrefix}-sub`}
          activeCount={filters.subs.length}
        >
          <FilterOptionsPicker
            title="All sub-categories"
            items={subCategoryItems}
            selected={filters.subs}
            onToggle={(slug) => onToggle('subs', slug)}
            variant={pickerVariant}
            renderCheckbox={(props) => <FilterCheckbox {...props} />}
          />
        </FilterAccordionSection>
      ) : null}

      <button
        type="button"
        onClick={onClearAll}
        className="mt-4 w-full rounded-md border border-border py-2 text-sm font-semibold text-ink-muted transition hover:border-brand hover:text-brand"
      >
        Clear all filters
      </button>
    </div>
  )
}

function FilterCheckbox({ checked, onChange, label, count }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 shrink-0 rounded accent-brand"
      />
      <span className={checked ? 'font-medium text-brand' : undefined}>{label}</span>
      {count != null ? (
        <span className="ml-auto text-xs text-ink-muted">({count})</span>
      ) : null}
    </label>
  )
}

function FilterRadio({ name, checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="size-4 accent-brand"
      />
      <span className={checked ? 'font-medium text-brand' : undefined}>{label}</span>
    </label>
  )
}
