# Shiki Extender

[![Chrome Web Store users](https://img.shields.io/chrome-web-store/users/omonjfjfonodikianjjfdcdodjndnffe)](https://chrome.google.com/webstore/detail/omonjfjfonodikianjjfdcdodjndnffe)

Расширение для браузера Chrome, которое добавляет быстрые ссылки на альтернативные сайты (аниме, манга, ранобе) на страницах Shikimori.

## Структура репозитория

```
├── packages/
│   ├── extension/       # Расширение (WXT, Vue 3)
│   │   ├── entrypoints/ # background, options, content script
│   │   ├── components/  # общие компоненты
│   │   └── utils/       # IndexedDB, хелперы
│   └── backend/         # Бэкенд API (Node + Drizzle + SQLite)
│       ├── src/         # Express, роуты altWatcher, схема БД
│       ├── drizzle/     # миграции SQLite
│       └── Dockerfile
├── caddy/               # Caddyfile для reverse proxy
├── docker-compose.yml   # api, drizzle-studio, reverse-proxy
└── NodeServer/          # Старая серверная часть (для ориентира)
```

Расширение может работать с локальными данными (IndexedDB) или с API из `packages/backend` (см. раздел «Бэкенд и Docker»).

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

**Сборка под API:** если расширение должно ходить в бэкенд (локальный или прод), задайте при сборке переменную `VITE_API_BASE_URL` (без слэша в конце). Примеры: в `packages/extension` создайте `.env.development` с `VITE_API_BASE_URL=http://localhost:8080` и соберите `npm run build:local`; для прода — `.env.production` с продовым URL и `npm run build`.

## Бэкенд и Docker

API и Drizzle Studio поднимаются через Docker Compose. На хост проброшен только reverse proxy (порты 80/443); запросы к API и к Studio идут через него.

### Запуск

1. Задать пароль для Drizzle Studio (путь `/studio`):

```bash
docker run --rm caddy:2-alpine caddy hash-password --plaintext 'ваш_пароль'
```

2. В корне репозитория создать `.env` (или передать переменные в `docker compose`):

```bash
STUDIO_USER=admin
STUDIO_PASSWORD_HASH=<результат команды hash-password>
```

3. Запустить стек:

```bash
docker compose up -d --build
```

- API: `http://localhost/` (и далее `/altWatcher/...`).
- Drizzle Studio: `http://localhost/studio` (логин/пароль из `STUDIO_USER` и пароль, который хешировали).

### Локальная разработка бэкенда

```bash
cd packages/backend
npm install
npm run build
DB_PATH=./data/db.sqlite npm run start
```

Drizzle Studio локально: `npm run db:studio` (в `packages/backend`).

## Документация

- **[docs/](docs/)** — [FAQ](docs/FAQ.md), [API NodeServer](docs/API.md) (для ориентира при интеграции с бэкендом).
- **[.cursor/AGENTS_WXT.md](.cursor/AGENTS_WXT.md)** — неочевидные решения по WXT для разработчиков и агентов.

## Поддержка

- Группа ВК: https://vk.com/shiki_ex

## Лицензия

MIT License — см. [LICENSE](LICENSE).
