import { useEffect } from 'react'
import { useSeo } from '../hooks/useSeo'

const ALLOWED_META_ATTRS = ['name', 'property', 'content']
const ALLOWED_LINK_RELS = ['canonical']

/**
 * Keeps <head> in sync with the BE SEO payload on client-side navigation.
 *
 * The Netlify edge function injects the same head_html on the first HTML
 * response; this replaces it on every route change. Tags are REBUILT from an
 * allowlist (title, meta name/property/content, link[rel=canonical],
 * script[type=application/ld+json] text) rather than inserting raw HTML.
 */
export default function SeoHead() {
  const seo = useSeo()

  useEffect(() => {
    if (!seo?.head_html || typeof document === 'undefined') return

    const parsed = new DOMParser().parseFromString(
      `<!doctype html><html><head>${seo.head_html}</head><body></body></html>`,
      'text/html',
    )

    /** @type {HTMLElement[]} */
    const next = []
    for (const node of Array.from(parsed.head.children)) {
      const tag = node.tagName.toLowerCase()
      if (tag === 'title') {
        const el = document.createElement('title')
        el.textContent = node.textContent ?? ''
        next.push(el)
      } else if (tag === 'meta') {
        const el = document.createElement('meta')
        for (const attr of ALLOWED_META_ATTRS) {
          const v = node.getAttribute(attr)
          if (v !== null) el.setAttribute(attr, v)
        }
        next.push(el)
      } else if (tag === 'link' && ALLOWED_LINK_RELS.includes(node.getAttribute('rel') ?? '')) {
        const href = node.getAttribute('href') ?? ''
        if (/^https?:\/\//i.test(href)) {
          const el = document.createElement('link')
          el.setAttribute('rel', 'canonical')
          el.setAttribute('href', href)
          next.push(el)
        }
      } else if (tag === 'script' && node.getAttribute('type') === 'application/ld+json') {
        const el = document.createElement('script')
        el.type = 'application/ld+json'
        el.textContent = node.textContent ?? ''
        next.push(el)
      }
    }

    if (next.length === 0) return

    const head = document.head
    head.querySelectorAll('[data-seo]').forEach((el) => el.remove())
    head.querySelectorAll('title').forEach((el) => el.remove())
    for (const el of next) {
      el.setAttribute('data-seo', '')
      head.appendChild(el)
    }
  }, [seo?.head_html])

  return null
}
