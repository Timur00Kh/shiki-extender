# Миграция на Vite + @crxjs/vite-plugin

Миграция Chrome-расширения с Webpack на Vite с поддержкой Vue 3, crxjs, подготовкой к рефакторингу и TypeScript.

## Completed Tasks

- [x] Создан task-list для отслеживания миграции
- [x] Добавить зависимости: vite, @vitejs/plugin-vue, @crxjs/vite-plugin
- [x] Создать vite.config.ts с поддержкой Vue и crxjs
- [x] Создать manifest.config.ts с нужными entry
- [x] Настроить сборку altWatcher.js как content-script (и обновить путь на src/executable/AltWhatcher/altWatcher.js)
- [x] Пометить altWatcher.user.js как deprecated
- [x] Обновить package.json (scripts, deps)
- [x] Настроить index.html для Vite (type="module", правильный entry)
- [x] Настроить структуру src/ под новые entry (SPA, background, content-script)
- [x] Перевести background.js на idb (IndexedDB ESM)
- [x] Удалить db.js из background.js (и все importScripts/import)
- [x] Настроить vite-plugin-static-copy для копирования библиотек в dist/libs
- [x] Настроить index.html на подключение библиотек из dist/libs
- [x] Устранить ошибки CSP и ESM/UMD (jQuery, highlight-within-textarea)
- [x] Мигрировать App.vue (AltWatcher) на Composition API
- [x] Исправить баг с подстановкой {{title}} в computeLink (корректная генерация ссылок)
- [x] Вынести генерацию ссылок и паттернов в отдельный модуль (src/utils/linkPattern.js)
- [x] Интегрировать модуль генерации ссылок и паттернов во все компоненты (App.vue, AltWatcher.vue и др.)
- [x] Почистить шаблоны компонентов от .value (Vue 3 best practices)

## In Progress Tasks

- [ ] Обеспечить SPA для popup, options, вкладки
- [ ] Проверить сборку и работоспособность (npm run dev/build)
- [ ] Вынести вспомогательные функции и логику из App.vue в utils/composables
- [ ] Перепроверить и доработать функцию computeLink для всех кейсов генерации ссылок ({{title}}, {{id}}, {{episode}})

## Future Tasks

- [ ] Перевести JS-файлы и утилиты на TypeScript
- [ ] Перевести компоненты на Composition API
- [ ] Разбить большие файлы на модули
- [ ] Создать папки: src/utils, src/composables, src/components
- [ ] Мигрировать другие части расширения на idb/ESM (если нужно)
- [ ] Удалить db.js из проекта, если больше не используется
- [ ] Следить за форматом сторонних библиотек (UMD vs ESM) при миграции

## Implementation Plan

1. Добавить необходимые зависимости (vite, @vitejs/plugin-vue, @crxjs/vite-plugin).
2. Создать vite.config.ts с поддержкой Vue и crxjs.
3. Создать manifest.config.ts с entry: background, content_scripts, popup, options, web_accessible_resources.
4. Настроить src/: background.js (idb), executable/AltWhatcher/altWatcher.js, options/options.js, index.html.
5. Обеспечить SPA для popup, options, вкладки.
6. Мигрировать крупные компоненты на Composition API (App.vue/AltWatcher — done).
7. Вынести бизнес-логику и утилиты в composables/utils.
8. Проверить сборку и работоспособность.
9. Подготовить к дальнейшему рефакторингу (TS, Composition API, модули).

### Relevant Files

- packages/extension/vite.config.ts — Конфиг Vite + crxjs ✅
- packages/extension/manifest.config.ts — Конфиг manifest для crxjs ✅
- packages/extension/src/background.js — Service worker (idb) ✅
- packages/extension/src/executable/AltWhatcher/altWatcher.js — Content-script ✅
- packages/extension/src/altWatcher.user.js — DEPRECATED, для референса ✅
- packages/extension/index.html — SPA (popup/options/tab) ✅
- packages/extension/package.json — Скрипты, зависимости ✅
- packages/extension/dist/libs/jquery.min.js — Локальная jQuery ✅
- packages/extension/dist/libs/jquery.highlight-within-textarea.js — Локальный плагин ✅
- packages/extension/dist/libs/db.js — Локальная библиотека IndexedDB ✅ 
- packages/extension/src/executable/AltWhatcher/components/App.vue — AltWatcher (Composition API) ✅
- packages/extension/src/utils/linkPattern.js — Генерация ссылок и паттернов ✅ 