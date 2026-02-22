# Shiki Extender

Расширение для браузера Chrome, которое добавляет быстрые ссылки на альтернативные сайты (аниме, манга, ранобе) на страницах Shikimori.

## Структура репозитория

```
├── packages/extension/   # Расширение (WXT, Vue 3)
│   ├── entrypoints/     # background, options, content script
│   ├── components/      # общие компоненты
│   └── utils/           # IndexedDB, хелперы
└── NodeServer/          # Серверная часть (для ориентира)
    ├── shiki_ex_server.js
    ├── modules/altWatcher/  # API ссылок, FAQ, схема БД
    └── db_backups/
```

Расширение собирается в `packages/extension` и пока работает с локальными данными (и захардкоженным набором ссылок при первой установке). Интеграция с бэкендом (Convex/Supabase) запланирована; структура NodeServer оставлена для ориентира.

## Функциональность

- **AltWatcher** — на страницах тайтлов (anime/manga/ranobe) на Shikimori показывается панель с быстрыми ссылками на выбранный сервис.
- Поддержка переменных в URL: `{{title}}`, `{{id}}`, `{{episode}}`, `{{title=encoding}}`.
- Настройки: включение/выключение, список ссылок (добавление, редактирование), поиск по каталогу, FAQ.

## Установка расширения

1. Клонируйте репозиторий.
2. Соберите расширение:

```bash
cd packages/extension
npm install
npm run build
```

3. В Chrome откройте `chrome://extensions/`, включите «Режим разработчика», нажмите «Загрузить распакованное расширение» и выберите папку `packages/extension/.output/chrome-mv3`.

Архив для установки: `npm run zip` в `packages/extension` (если нужен .zip).

## Документация

- **[docs/](docs/)** — [FAQ](docs/FAQ.md), [API NodeServer](docs/API.md) (для ориентира при интеграции с бэкендом).
- **[.cursor/AGENTS_WXT.md](.cursor/AGENTS_WXT.md)** — неочевидные решения по WXT для разработчиков и агентов.

## Поддержка

- Группа ВК: https://vk.com/shiki_ex

## Лицензия

MIT License — см. [LICENSE](LICENSE).
