# WXT Migration Implementation

Migration of Shiki extender from Webpack to WXT; AltWatcher retained with backend stubs; ShikiDump removed.

## Completed Tasks

- [x] Initialize WXT project in packages/extension (wxt.config.ts, package.json, tsconfig)
- [x] Migrate background: IndexedDB (idb), messages, onInstalled stub + TODO
- [x] Migrate content script AltWatcher (Vue 3, links, cookies, messages)
- [x] Migrate options SPA: router, Options.vue, AltWatcher page, API stubs
- [x] Remove ShikiDump (files, routes, Options block) from Chrome_extension
- [x] Fix altWatcher on/off storage (chrome.storage.local only)
- [x] Verify build and manifest

## Relevant Files

- `packages/extension/wxt.config.ts` - WXT and Vite config, manifest overrides
- `packages/extension/entrypoints/background.ts` - Service worker, messages, onInstalled
- `packages/extension/entrypoints/options/` - Options/popup SPA (Vue 3, router)
- `packages/extension/entrypoints/altwatcher.content.ts` - Content script for Shikimori
- `packages/extension/entrypoints/altwatcher/AltWatcherApp.vue` - Content script UI
- `packages/extension/utils/db.ts` - IndexedDB (idb) wrapper for linksDb
- `packages/extension/utils/sort.ts` - sortByUsedTimes

## Notes

- Backend API calls replaced with stubs and `//TODO: integrate with backend (Convex/Supabase)` in background, options AltWatcher (FAQ, publish link), and Search (list/inc-num).
- Options and popup use the same page; popup opens with `?popup=true`.
- Build output: `.output/chrome-mv3/`. Run `npm run build` in `packages/extension`.
