import { useState } from 'react'
import ProductSpecsTable from './ProductSpecsTable'
import ProductReviewsSection from './ProductReviewsSection'

const TABS = [
  { id: 'description', label: 'Description' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'reviews', label: 'Reviews' },
]

/**
 * @param {{ product: object }} props
 */
export default function ProductDetailTabs({ product }) {
  const [activeTab, setActiveTab] = useState('description')

  return (
    <section className="rounded-lg border border-border bg-surface">
      <div
        role="tablist"
        aria-label="Product information"
        className="flex overflow-x-auto border-b border-border"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 px-4 py-3 text-sm font-semibold transition sm:px-6 ${
              activeTab === tab.id
                ? 'border-b-2 border-brand text-brand'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {tab.label}
            {tab.id === 'reviews' ? ` (${product.reviewCount})` : null}
          </button>
        ))}
      </div>

      <div className="p-4 sm:p-6">
        {activeTab === 'description' ? (
          <div
            role="tabpanel"
            id="panel-description"
            aria-labelledby="tab-description"
            className="space-y-4"
          >
            <p className="text-sm leading-relaxed text-ink-muted sm:text-base">
              {product.longDescription}
            </p>
            {product.highlights?.length ? (
              <ul className="list-disc space-y-2 pl-5 text-sm text-ink-muted">
                {product.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {activeTab === 'specifications' ? (
          <div
            role="tabpanel"
            id="panel-specifications"
            aria-labelledby="tab-specifications"
          >
            <ProductSpecsTable specs={product.specs} />
          </div>
        ) : null}

        {activeTab === 'reviews' ? (
          <div role="tabpanel" id="panel-reviews" aria-labelledby="tab-reviews">
            <ProductReviewsSection product={product} />
          </div>
        ) : null}
      </div>
    </section>
  )
}
