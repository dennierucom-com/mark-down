# Mark South — Comprehensive QA & Audit Report

**Date:** 2026-09-03
**Scope:** Static Analysis & Runtime QA Session
**Goal:** Master list of all identified issues to be converted into GitHub Issues.

---

## 🔴 Critical / High Priority

### 1. App crashes to white screen on invalid Regex in search bar (XSS/ReDoS vector)
* **File:** `src/components/MarkdownReader/MarkdownComponents.tsx:15`
* **Description:** The `searchTerm` is passed directly into a `new RegExp()` constructor inside `HighlightText` without escaping special characters. If a user types `(`, `[`, or `(?=` into the "Find in page" field, it throws an uncaught `SyntaxError: Invalid regular expression`. Because there is no Error Boundary around the viewer, this crashes the entire React tree and leaves a blank white screen. Maliciously crafted regex patterns could also trigger catastrophic backtracking (ReDoS).
* **Suggested Fix:** Add a regex escaping utility function `str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')` and apply it to the `searchTerm` before instantiating the `RegExp`.

---

## 🟡 Moderate Priority / Bug Fixes

### 2. `files` state initializer ignores saved localStorage data
* **File:** `src/context/FileProvider.tsx:14-18`
* **Description:** The initial state for `files` reads `localStorage.getItem("current_file")` but contains dead code that always returns `defaultFiles` regardless of what was saved. As a result, imported files vanish from the sidebar on page refresh.
* **Suggested Fix:** Parse the saved `currentFile` and append it to the `defaultFiles` array in the state initializer if it doesn't already exist.

### 3. PWA `theme_color` mismatch between manifest and HTML meta tag
* **File:** `vite.config.ts:17` & `index.html:7`
* **Description:** The PWA manifest dictates a `theme_color` of `#6750A4` (M3 Purple), but `index.html` hardcodes `<meta name="theme-color" content="#ffffff" />`. This leads to inconsistent status bar coloring and triggers warnings in Lighthouse PWA audits.
* **Suggested Fix:** Update the `<meta>` tag in `index.html` to `#6750A4`.

### 4. `includeAssets` references a non-existent `mask-icon.svg`
* **File:** `vite.config.ts:12`
* **Description:** The Vite PWA config attempts to precache `mask-icon.svg`, but the `public/` directory contains `icon.svg` instead. The asset fails to cache.
* **Suggested Fix:** Rename the reference in `vite.config.ts` from `mask-icon.svg` to `icon.svg`.

### 5. Dev Service Worker `NavigationRoute` blocks all non-root navigation
* **File:** `vite.config.ts` (affects `dev-dist/sw.js`)
* **Description:** In dev mode, the service worker registers an allowlist `[/^\/$/]` which only matches the exact root path `/`. Because the app runs on `base: '/mark-down/'`, navigating to the app bypasses the cache, completely breaking offline mode during local development.
* **Suggested Fix:** Add `workbox: { navigateFallbackAllowlist: [/^\/mark-down\//] }` to the `VitePWA` config.

### 6. PWA manifest locks orientation to portrait mode
* **File:** `vite.config.ts:22`
* **Description:** The manifest configures `orientation: 'portrait'`. This is highly restrictive for a markdown editor, which is often used in landscape on tablets and foldables.
* **Suggested Fix:** Change to `orientation: 'any'`.

---

## 🔵 Performance & UX Enhancements

### 7. Un-memoized Search Highlights cause rendering lag on large documents
* **Description:** During runtime testing, typing into the active search bar recalculates the `RegExp` pattern and executes `split()` across every single rendered markdown text node on every keystroke. On heavy documents, this blocks the main thread and introduces visible typing lag.
* **Suggested Fix:** Memoize the highlight logic, debounce the search input state, or apply highlights to a virtualized list.

### 8. Heavy multi-line pastes result in massive, slow-rendering blocks
* **Description:** If a user pastes a massive multiline element (like a 500-row markdown table) into the editor, the `markdownLineGrouper` lumps it into a single `MarkdownBlock`. React struggles to re-render this massive block during edits.
* **Suggested Fix:** Refine the chunking algorithm to handle extremely large blocks better, or implement block virtualization.

---

## 🟢 Low Priority / Technical Debt

### 9. Imported workspace file list is completely lost on refresh
* **File:** `src/context/FileProvider.tsx:38-49`
* **Description:** Currently, only the single `currentFile` is persisted to `localStorage`. If a user imports 5 different markdown files into their workspace and refreshes, 4 of them are permanently lost.
* **Suggested Fix:** Serialize and save the entire array of imported files (excluding un-serializable `FileSystemFileHandle` properties) so the workspace survives a refresh.

### 10. No runtime caching strategy for external CDN resources
* **File:** `vite.config.ts`
* **Description:** The app uses custom font families. If they are fetched from external CDNs (like Google Fonts) rather than bundled, they will break in offline mode because the workbox config only precaches internal assets.
* **Suggested Fix:** Add a `runtimeCaching` rule in `vite.config.ts` for external font domains.

### 11. No `rehype-sanitize` plugin in markdown rendering pipeline
* **File:** `src/components/MarkdownReader/MarkdownViewerBlock.tsx`
* **Description:** The app currently strips raw HTML safely by default because `rehype-raw` is omitted. However, if a future developer adds `rehype-raw` to support embedded HTML blocks (a common markdown request), the app immediately becomes vulnerable to XSS.
* **Suggested Fix:** Proactively install and configure `rehype-sanitize` in the pipeline as a defensive measure.

### 12. Missing explicit `lang` property in source manifest config
* **File:** `vite.config.ts`
* **Description:** Best practice is to explicitly declare the `lang: 'en'` attribute in the PWA manifest source config.
* **Suggested Fix:** Add `lang: 'en'` to the `manifest` object in `vite.config.ts`.
