/**
 * Build-time data handed to the app by scripts/prerender.mjs.
 *
 * During prerendering, effects never run, so a page that loads its data in
 * useEffect would render a spinner into the static HTML — exactly the content a
 * crawler reads. The prerender script fetches the data, exposes it here, and
 * embeds it in the page as `window.__IFOA_PRELOAD__` so the browser hydrates
 * with content already on screen instead of flashing a loader.
 *
 * Values are a snapshot from build time; pages still refetch to pick up edits
 * made since the last deploy.
 */
const store = () => (typeof window !== 'undefined' ? window.__IFOA_PRELOAD__ : globalThis.__IFOA_PRELOAD__)

export function readPreload(key) {
  try {
    const value = store()?.[key]
    return value === undefined ? null : value
  } catch {
    return null
  }
}
