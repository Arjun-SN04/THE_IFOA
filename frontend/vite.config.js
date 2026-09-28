import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  // Pre-bundle the PDF renderer at startup. It is only imported lazily (when
  // someone downloads an enrollment PDF), so Vite would otherwise discover it
  // mid-session, re-optimize, and the open page gets "504 Outdated Optimize Dep".
  optimizeDeps: {
    include: ["@react-pdf/renderer"],
  },
  build: {
    outDir: "public_html",
    emptyOutDir: true,
  },
})

