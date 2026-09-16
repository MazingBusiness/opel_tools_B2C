import FilterAccordionSection from './FilterAccordionSection'
import FilterOptionsPicker from './FilterOptionsPicker'

/**
 * @param {{
 *   filters: import('../utils/productFilters.js').ProductFilterParams,
 *   groups: Array<{ slug: string, label: string, count?: number | null }>,
 *   categories: Array<{ slug: string, label: string, count?: number | null }>,
 *   brands: Array<{ slug: string, label: string, count?: number | null }>,
 *   facets: { priceMin: number | null, priceMax: number | null },
 *   onToggle: (key: string, slug: string) => void,
 *   onScalarChange: (key: string, value: string | number | boolean | null) => void,
 *   onClearAll: () => void,
 *   idPrefix?: string,
 *   pickerVariant?: 'modal' | 'panel',
 * }} props
 */
export default function ProductFiltersPanel({
  filters,
  groups,
  categories,
  brands,
  facets,
  onToggle,
  onScalarChange,
  onClearAll,
  idPrefix = 'filter',
  pickerVariant = 'modal',
}) {
  const priceActive = filters.min != null || filters.max != null

  const brandItems = brands.map((brand) => ({
    slug: brand.slug,
    label: brand.label,
    count: brand.count,
  }))

  const groupItems = groups.map((group) => ({
    slug: group.slug,
    label: group.label,
    count: group.count,
  }))

  const categoryItems = categories.map((cat) => ({
    slug: cat.slug,
    label: cat.label,
    count: cat.count,
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
            placeholder={
              facets.priceMin != null ? `Min (${facets.priceMin})` : 'Min'
            }
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
            placeholder={
              facets.priceMax != null ? `Max (${facets.priceMax})` : 'Max'
            }
            value={filters.max ?? ''}
            onChange={(e) =>
              onScalarChange('max', e.target.value ? Number(e.target.value) : null)
            }
            className="w-full rounded-md border border-border bg-surface px-2.5 py-2 text-sm text-ink outline-none focus:border-brand"
          />
        </div>
      </FilterAccordionSection>

      <FilterAccordionSection
        title="Availability"
        id={`${idPrefix}-stock`}
        activeCount={filters.inStock ? 1 : 0}
        defaultOpen={filters.inStock}
      >
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={Boolean(filters.inStock)}
            onChange={(e) => onScalarChange('inStock', e.target.checked)}
            className="size-4 shrink-0 rounded accent-brand"
          />
          <span className={filters.inStock ? 'font-medium text-brand' : undefined}>
            In stock only
          </span>
        </label>
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
        title="Category group"
        id={`${idPrefix}-group`}
        activeCount={filters.groups.length}
      >
        <FilterOptionsPicker
          title="All groups"
          items={groupItems}
          selected={filters.groups}
          onToggle={(slug) => onToggle('groups', slug)}
          variant={pickerVariant}
          renderCheckbox={(props) => <FilterCheckbox {...props} />}
        />
      </FilterAccordionSection>

      {categoryItems.length > 0 ? (
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
