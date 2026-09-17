import React from 'react'
import { renderToString } from 'react-dom/server'
// React Router v7 exports StaticRouter from the root package;
// react-router-dom/server no longer exists.
import { StaticRouter } from 'react-router'
import { AppRoutes } from './App'

// Consumed by scripts/prerender.mjs. Effects do not run here, so any data a
// route needs must already be on globalThis.__IFOA_PRELOAD__ (see lib/preload.js).
export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>
  )
}
