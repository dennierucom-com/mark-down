# Mark South — PWA Static Analysis Audit Report

**Date:** 2026-09-03  
**Codebase:** `d:\Workspace\mark_down\mark-down`  
**Auditor:** Antigravity Automated Code Review

---

## Executive Summary

The Mark South codebase is a React + Vite PWA markdown editor deployed to GitHub Pages. After scanning all source files, the service worker pipeline, production `dist/` output, web app manifest, rendering layer, and localStorage persistence layer, I identified **10 actionable issues** across the four audit categories.

| Category | Critical | Moderate | Low |
|---|---|---|---|
| 1. Service Worker / Offline | 0 | 2 | 1 |
| 2. Web App Manifest | 0 | 2 | 1 |
| 3. HTML Injection / XSS | 0 | 1 | 1 |
| 4. Local Storage Persistence | 0 | 1 | 1 |

> [!NOTE]
> No uses of `dangerouslySetInnerHTML` or `innerHTML` were found anywhere in the `src/` tree. Markdown rendering is done exclusively through `react-markdown` with its AST-based renderer, which is inherently safe against raw HTML injection. The codebase does **not** use `rehype-raw`, so raw HTML in markdown input is stripped by default. This is a strong security posture.

---

## Category 1 — Service Worker / Offline Mode

### Issue 1.1 (Moderate): Dev service worker `NavigationRoute` allowlist blocks all non-root navigation

| | |
|---|---|
| **File** | [`dev-dist/sw.js`](file:///d:/Workspace/mark_down/mark-down/dev-dist/sw.js#L88-L90) |
| **Line** | 88–89 |
| **Severity** | Moderate |

**What's wrong:**  
The dev service worker registers a `NavigationRoute` with `allowlist: [/^\/$/]`, which only matches the literal root path `/`. Because the app is served at `base: '/mark-down/'`, navigating to `/mark-down/` does **not** match `/^\/$/ `. This means navigation requests in dev mode will not be served from the cache, breaking offline mode entirely during local development.

```js
// Current (dev-dist/sw.js:88-89)
workbox.registerRoute(new workbox.NavigationRoute(
  workbox.createHandlerBoundToURL("index.html"),
  { allowlist: [/^\/$/] }  // ← only matches "/"
));
```

> [!TIP]
> The production `dist/sw.js` does **not** set an `allowlist`, so this is dev-only. However, it makes it impossible to test offline mode locally.

**Suggested fix in** [`vite.config.ts`](file:///d:/Workspace/mark_down/mark-down/vite.config.ts):  
Add a `navigateFallbackAllowlist` under `workbox` options that matches the base path:

```diff
 VitePWA({
   registerType: 'autoUpdate',
   includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
+  workbox: {
+    navigateFallbackAllowlist: [/^\/mark-down\//],
+  },
   manifest: {
```

---

### Issue 1.2 (Moderate): `includeAssets` references non-existent `mask-icon.svg`

| | |
|---|---|
| **File** | [`vite.config.ts`](file:///d:/Workspace/mark_down/mark-down/vite.config.ts#L12) |
| **Line** | 12 |
| **Severity** | Moderate |

**What's wrong:**  
The `includeAssets` array references `'mask-icon.svg'`, but the `public/` directory contains `icon.svg` — there is no file named `mask-icon.svg`. This means vite-plugin-pwa will fail to inject this asset into the precache manifest, and the asset won't be available offline.

```js
// Current (vite.config.ts:12)
includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
//                                                       ^^^^^^^^^^^^^^ does not exist
```

**Available files in `public/`:** `apple-touch-icon.png`, `favicon.ico`, `icon.svg`, `maskable-icon-512x512.png`, `pwa-192x192.png`, `pwa-512x512.png`, `pwa-64x64.png`, `vite.svg`

**Suggested fix:**
```diff
- includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
+ includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
```

---

### Issue 1.3 (Low): No runtime caching strategy for Google Fonts or external CDN resources

| | |
|---|---|
| **File** | [`vite.config.ts`](file:///d:/Workspace/mark_down/mark-down/vite.config.ts#L10-L51) |
| **Line** | 10–51 |
| **Severity** | Low |

**What's wrong:**  
The [`MarkdownComponents.tsx`](file:///d:/Workspace/mark_down/mark-down/src/components/MarkdownReader/MarkdownComponents.tsx#L122) references font families like `JetBrains Mono, Fira Code` in its CSS. If these fonts are loaded from an external CDN (e.g., Google Fonts), there is no `runtimeCaching` rule in the Workbox config to cache them. This means font rendering will break when offline.

**Suggested fix — add runtime caching for font resources:**
```diff
 VitePWA({
   registerType: 'autoUpdate',
+  workbox: {
+    runtimeCaching: [
+      {
+        urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
+        handler: 'CacheFirst',
+        options: {
+          cacheName: 'google-fonts',
+          expiration: { maxEntries: 30, maxAgeSeconds: 365 * 24 * 60 * 60 },
+        },
+      },
+    ],
+  },
```

> [!NOTE]
> If these fonts are only used as CSS `font-family` fallbacks and never explicitly loaded via `@import` or `<link>`, this is cosmetic. Verify your actual font loading strategy.

---

## Category 2 — Web App Manifest

### Issue 2.1 (Moderate): `theme_color` mismatch between manifest and `index.html`

| | |
|---|---|
| **Files** | [`vite.config.ts`](file:///d:/Workspace/mark_down/mark-down/vite.config.ts#L17) and [`index.html`](file:///d:/Workspace/mark_down/mark-down/index.html#L7) |
| **Lines** | `vite.config.ts:17` / `index.html:7` |
| **Severity** | Moderate |

**What's wrong:**  
The manifest defines `theme_color: '#6750A4'` (M3 purple), but `index.html` has `<meta name="theme-color" content="#ffffff">`. Chrome and other browsers will use the `<meta>` tag on initial load and the manifest value after install, resulting in an inconsistent status bar / title bar color. This can also cause Lighthouse PWA audits to flag a mismatch.

```html
<!-- index.html:7 — white -->
<meta name="theme-color" content="#ffffff" />
```
```js
// vite.config.ts:17 — purple
theme_color: '#6750A4',
```

**Suggested fix in** [`index.html`](file:///d:/Workspace/mark_down/mark-down/index.html#L7):
```diff
- <meta name="theme-color" content="#ffffff" />
+ <meta name="theme-color" content="#6750A4" />
```

---

### Issue 2.2 (Moderate): `orientation: 'portrait'` prevents landscape use on tablets/desktop

| | |
|---|---|
| **File** | [`vite.config.ts`](file:///d:/Workspace/mark_down/mark-down/vite.config.ts#L22) |
| **Line** | 22 |
| **Severity** | Moderate |

**What's wrong:**  
The manifest sets `orientation: 'portrait'`. For a markdown editor — which benefits greatly from wide screens — this locks the installed PWA to portrait mode on devices that respect this hint (e.g., Android). Desktop Chrome typically ignores this, but mobile Chrome and Samsung Internet enforce it.

**Suggested fix:**
```diff
- orientation: 'portrait',
+ orientation: 'any',
```

---

### Issue 2.3 (Low): Missing `lang` property in source manifest config

| | |
|---|---|
| **File** | [`vite.config.ts`](file:///d:/Workspace/mark_down/mark-down/vite.config.ts#L13-L46) |
| **Line** | 13–46 |
| **Severity** | Low |

**What's wrong:**  
The manifest config in `vite.config.ts` does not include a `lang` field. The production manifest does include `"lang":"en"` — this appears to be auto-injected by the plugin. However, it's best practice to declare it explicitly in the source to ensure consistency and clarity.

**Suggested fix:**
```diff
 manifest: {
   name: 'Mark South',
   short_name: 'Mark South',
+  lang: 'en',
   description: 'A simple Markdown editor',
```

---

## Category 3 — HTML Injection / XSS Risks

### Issue 3.1 (Moderate): Unsanitized `searchTerm` used in `new RegExp()` — ReDoS and crash vector

| | |
|---|---|
| **File** | [`MarkdownComponents.tsx`](file:///d:/Workspace/mark_down/mark-down/src/components/MarkdownReader/MarkdownComponents.tsx#L15) |
| **Line** | 15 |
| **Severity** | Moderate |

**What's wrong:**  
The `HighlightText` component uses the raw `searchTerm` from user input directly inside `new RegExp(...)` without escaping regex special characters. If a user types a search term like `(`, `[`, `*`, or `(?=`, the `RegExp` constructor will throw a `SyntaxError`, crashing the entire component tree (React error boundary). Certain patterns like `(a+)+$` applied to long text can also cause catastrophic backtracking (ReDoS), freezing the UI.

```tsx
// Current (MarkdownComponents.tsx:15)
const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
//                                    ^^^^^^^^^^^^  raw user input
```

**Suggested fix — escape regex special characters:**
```diff
+ function escapeRegExp(str: string): string {
+   return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
+ }
+
  const HighlightText = ({ text }: { text: string }) => {
    if (!searchTerm || !text) return <>{text}</>;
-   const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
+   const escaped = escapeRegExp(searchTerm);
+   const parts = text.split(new RegExp(`(${escaped})`, "gi"));
```

---

### Issue 3.2 (Low): No `rehype-sanitize` plugin — raw HTML passthrough is not a current risk but is fragile

| | |
|---|---|
| **File** | [`MarkdownViewerBlock.tsx`](file:///d:/Workspace/mark_down/mark-down/src/components/MarkdownReader/MarkdownViewerBlock.tsx#L142-L148) |
| **Line** | 142–148 |
| **Severity** | Low (informational) |

**What's wrong:**  
The `react-markdown` rendering pipeline uses `remarkGfm`, `rehypeHighlight`, and `rehypeSlug`, but does **not** include `rehype-raw`. This means raw HTML in markdown input (e.g., `<script>alert(1)</script>`) is currently stripped by `react-markdown`'s default behavior. **This is correct and safe.**

However, if a future developer adds `rehype-raw` to support embedded HTML (a common feature request for markdown editors), XSS would immediately become possible because there is no `rehype-sanitize` in the plugin chain.

**Suggested defensive fix — add `rehype-sanitize` proactively:**
```bash
npm install rehype-sanitize
```
```diff
 import rehypeHighlight from 'rehype-highlight';
 import rehypeSlug from 'rehype-slug';
+import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

 <ReactMarkdown
   remarkPlugins={[remarkGfm, remarkWikiLink]}
-  rehypePlugins={[rehypeHighlight, rehypeSlug]}
+  rehypePlugins={[rehypeSanitize, rehypeHighlight, rehypeSlug]}
   components={components}
 >
```

> [!IMPORTANT]
> If you add `rehype-sanitize`, make sure it runs **before** `rehypeHighlight` in the pipeline, or it will strip the `class` attributes that highlight.js injects. You may need a custom schema that allows `class` on `code` and `span` elements.

---

## Category 4 — Local Storage Persistence

### Issue 4.1 (Moderate): `files` state initializer reads `localStorage` but always discards the result

| | |
|---|---|
| **File** | [`FileProvider.tsx`](file:///d:/Workspace/mark_down/mark-down/src/context/FileProvider.tsx#L14-L18) |
| **Lines** | 14–18 |
| **Severity** | Moderate |

**What's wrong:**  
The `files` state initializer reads `localStorage.getItem("current_file")` but ignores its value entirely — both branches return the same `defaultFiles`. The saved file is never restored into the `files` array on page load. This means:

1. If a user imports a file, edits it, and refreshes — the `currentFile` is restored (via the separate initializer on line 20), but it won't appear in the sidebar's file list because `files` was reset to defaults only.
2. The `useEffect` on line 38 partially compensates by appending `currentFile` to `files` if it's not already present, but this only runs _after_ the initial render, causing a flash where the sidebar shows only default files.

```tsx
// Current (FileProvider.tsx:14-18)
const [files, setFiles] = useState<MarkdownFile[]>(() => {
  const saved = localStorage.getItem("current_file");
  if (!saved) return defaultFiles;
  return defaultFiles; // ← dead code: same value regardless of `saved`
});
```

**Suggested fix — restore the current file into the initial file list:**
```diff
 const [files, setFiles] = useState<MarkdownFile[]>(() => {
   const saved = localStorage.getItem("current_file");
-  if (!saved) return defaultFiles;
-  return defaultFiles;
+  if (!saved) return defaultFiles;
+  try {
+    const parsed = JSON.parse(saved) as MarkdownFile;
+    // If the saved file is already in defaults, no need to duplicate
+    if (defaultFiles.some((f) => f.name === parsed.name)) {
+      return defaultFiles;
+    }
+    return [...defaultFiles, parsed];
+  } catch {
+    return defaultFiles;
+  }
 });
```

---

### Issue 4.2 (Low): Only `currentFile` is persisted — full file list is lost on refresh

| | |
|---|---|
| **File** | [`FileProvider.tsx`](file:///d:/Workspace/mark_down/mark-down/src/context/FileProvider.tsx#L38-L49) |
| **Lines** | 38–49 |
| **Severity** | Low |

**What's wrong:**  
Only `currentFile` is saved to `localStorage` (line 41). If a user has imported multiple files into the workspace, a browser refresh will lose all of them except the one that was currently selected. The `files` array is never persisted.

This is a design trade-off (keeping things simple), but it means users can lose work if they've opened multiple files via drag & drop or the file picker and then refresh.

**Suggested fix — persist the full imported file list:**
```diff
 useEffect(() => {
   if (currentFile) {
     const { ...fileToSave } = currentFile;
     localStorage.setItem("current_file", JSON.stringify(fileToSave));
+
+    // Persist all imported files so they survive refresh
+    const importedFiles = files.filter((f) => f.isImported && f.name !== "Welcome.md" && f.name !== "Features.md");
+    localStorage.setItem("imported_files", JSON.stringify(importedFiles));
   }
 }, [currentFile]);
```

> [!WARNING]
> `FileSystemFileHandle` objects (stored on `MarkdownFile.handle`) are **not serializable** via `JSON.stringify()`. They will silently be dropped. This means handles cannot survive a refresh. You may want to strip `handle` before persisting to avoid confusion, and inform users that "Save" (via handle) requires re-opening the file after refresh.

---

## Summary of Recommended Actions

| Priority | Issue | Fix Effort |
|---|---|---|
| 🟡 Moderate | 1.1 — Dev SW navigation allowlist too restrictive | Config change |
| 🟡 Moderate | 1.2 — `mask-icon.svg` doesn't exist | Config fix |
| 🟡 Moderate | 2.1 — `theme_color` mismatch (manifest vs. meta tag) | One-line HTML fix |
| 🟡 Moderate | 2.2 — `orientation: 'portrait'` is too restrictive | Config change |
| 🟡 Moderate | 3.1 — Unescaped `searchTerm` in `RegExp` (crash + ReDoS) | Small code fix |
| 🟡 Moderate | 4.1 — `files` initializer ignores saved state (dead code) | Small code fix |
| 🟢 Low | 1.3 — No runtime caching for external fonts | Config addition |
| 🟢 Low | 2.3 — Missing explicit `lang` in manifest source | Config addition |
| 🟢 Low | 3.2 — No `rehype-sanitize` (defensive, not currently exploitable) | npm install + config |
| 🟢 Low | 4.2 — Only `currentFile` persisted, full list lost on refresh | Design decision |

---

> [!TIP]
> **Positive findings:** No `dangerouslySetInnerHTML`, no `innerHTML` writes, no `eval()`, no `rehype-raw`. The `react-markdown` pipeline is configured safely by default. The production service worker correctly precaches all static assets including the JS bundle, icons, and manifest. The IndexedDB graph repository uses proper transactional writes with error recovery.
