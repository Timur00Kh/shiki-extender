# WXT: неочевидные решения для агентов

Краткий справочник по решениям в проекте Shiki extender (WXT в `packages/extension`), чтобы агенты не повторяли уже принятые подходы и не ломали работающее.

---

## API расширения: `browser`, не `chrome`

- **Проблема:** TypeScript не видит глобальный `chrome` → "Cannot find name 'chrome'".
- **Решение:** везде использовать `browser` из `wxt/browser`:  
  `import { browser } from "wxt/browser"` и вызовы `browser.runtime.*`, `browser.storage.*`.
- **Где:** background, content script, options (все места, где нужен доступ к API расширения).

---

## IndexedDB и Vue: только «плоские» объекты

- **Проблема:** `DataCloneError: ... could not be cloned` при `put()` в IDB — Vue 3 оборачивает данные в Proxy, а Proxy не участвует в structured clone.
- **Решение:** перед записью в IndexedDB превращать объект в обычный: в [utils/db.ts](packages/extension/utils/db.ts) используется `toPlainLink(link)` = `JSON.parse(JSON.stringify(link))`. Все вызовы `put`/`putLinks` должны класть в store уже «расплющенный» объект.
- **Не делать:** передавать в `db.put()` / `putLinks()` реактивные объекты (ref.value, объекты из computed/реактивного state) без превращения в plain object.

---

## Options entrypoint: папка, не два файла

- **Проблема:** WXT ругается "Multiple entrypoints with the same name" если есть и `options.html`, и `options.ts` в корне entrypoints.
- **Решение:** options — один entrypoint-каталог: [entrypoints/options/index.html](packages/extension/entrypoints/options/index.html) + [entrypoints/options/main.ts](packages/extension/entrypoints/options/main.ts). В HTML подключается `./main.ts`. Не создавать отдельно `options.html` и `options.ts` в корне entrypoints.

---

## Background: обязательно `defineBackground`

- **Проблема:** "Default export not found, did you forget to call export default defineBackground(...)?"
- **Решение:** в [entrypoints/background.ts](packages/extension/entrypoints/background.ts) весь код обёрнут в  
  `export default defineBackground({ main() { ... } })`. Логику (onMessage, onInstalled) держать внутри `main()`.

---

## Контент-скрипт: дропдаун и overflow

- **Проблема:** выпадающее меню не видно или обрезано.
- **Решение:** у контейнера кнопок (`.altwatcher-btn-group`) не должно быть `overflow: hidden` — иначе меню (position: absolute) обрезается. Использовать `overflow: visible`; при необходимости `overflow: hidden` оставить только у элемента с текстом кнопки (ellipsis).

---

## Общие компоненты: content script и options

- Компоненты в [components/](packages/extension/components/) (например, [FaviconImg.vue](packages/extension/components/FaviconImg.vue)) импортируются и из контент-скрипта, и из options через алиас `@`: `import X from "@/components/X.vue"`.
- Алиас `@` настроен в [wxt.config.ts](packages/extension/wxt.config.ts) (`resolve.alias`) и в [tsconfig.json](packages/extension/tsconfig.json) (`paths`).

---

## Сборка и артефакты

- Сборка: `npm run build` в `packages/extension`; выход — `.output/chrome-mv3/`.
- В корневом [.gitignore](.gitignore) игнорируются `.output`, `output`, `*.zip`, чтобы артефакты WXT не коммитились.

---

## Домены контент-скрипта

- AltWatcher инжектится на: `shikimori.one`, `shikimori.org`, `shikimori.io`, `shiki.one`. Список в [entrypoints/altwatcher.content.ts](packages/extension/entrypoints/altwatcher.content.ts) в `matches`.

---

## TypeScript и typecheck

### Конфиг tsconfig

- Корневой [tsconfig.json](packages/extension/tsconfig.json) **не расширяет** `.wxt/tsconfig.json`. При `extends: ".wxt/tsconfig.json"` typecheck падает, если папки `.wxt` ещё нет (до первого `wxt build`/`wxt prepare`), и появляются ошибки про `moduleResolution` в node_modules.
- В **include** явно указан **`.wxt/wxt.d.ts`**. Этот файл подключает сгенерированные типы (paths.d.ts, i18n.d.ts и др.). Без него `browser.runtime.getURL` и типы путей не видны.
- **moduleResolution: "bundler"** — нужен, чтобы резолвились подпути пакета `wxt` (`wxt/browser`, `wxt/utils/define-background` и т.д.). При других настройках — ошибки «could not be resolved under your current moduleResolution».
- **Не использовать** `"types": ["wxt/client-types", "wxt/browser-types"]` в tsconfig — таких экспортов в пакете `wxt` нет, typecheck падает с «Cannot find type definition file».

### Сгенерированные типы (.wxt/)

- Папка **`.wxt/`** создаётся при `wxt prepare` или при первой сборке/запуске. В ней:
  - **wxt.d.ts** — точка входа, подключает `types/paths.d.ts`, `types/i18n.d.ts` и др.
  - [types/paths.d.ts](packages/extension/.wxt/types/paths.d.ts) — дополняет модуль `wxt/browser`: объявляет `WxtRuntime.getURL(path: PublicPath)` и тип `PublicPath` (список путей из entrypoints: `/options.html`, `/background.js` и т.д.).
- **browser.runtime.getURL** типизирован только при подключённом `.wxt/wxt.d.ts`. Аргумент должен входить в `PublicPath`; в коде используется **`/options.html`** (с ведущим слэшем), иначе ошибка типов.

### Typecheck в CI и локально

- **Перед typecheck** нужно сгенерировать `.wxt`: выполнить **`npx wxt prepare`** в `packages/extension`. Иначе `.wxt/wxt.d.ts` отсутствует и typecheck может падать или не видеть `getURL`.
- В [code-quality.yml](.github/workflows/code-quality.yml) шаг «Prepare WXT (generate .wxt types)» уже стоит перед «Typecheck».
- Локально: при первом запуске `npm run typecheck` после клона — сначала выполнить `npx wxt prepare` в `packages/extension`, либо однажды запустить `npm run build`.

### Версия из package.json

- В [wxt.config.ts](packages/extension/wxt.config.ts) версия манифеста берётся из package.json:  
  `import pkg from "./package.json" with { type: "json" };` и `manifest.version: pkg.version`.  
  Единственный источник правды для версии — package.json; вручную версию в wxt.config не дублировать.
