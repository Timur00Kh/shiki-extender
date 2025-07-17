# Shiki Extender - Расширение для Shikimori

## Описание проекта

Shiki Extender - это расширение для браузера Chrome, которое добавляет функциональность для быстрого поиска аниме, манги и ранобе на сайте Shikimori. Проект состоит из двух основных компонентов:

1. **Chrome Extension** - клиентская часть расширения
2. **Node.js Server** - серверная часть для управления базой данных ссылок

## Архитектура проекта (Monorepo)

```
├── packages/
│   ├── extension/            # Chrome Extension
│   │   ├── src/             # Исходный код расширения
│   │   │   ├── manifest.json # Манифест расширения
│   │   │   ├── background.js # Фоновый скрипт
│   │   │   ├── options/     # Страница настроек
│   │   │   ├── public/      # Публичные ресурсы
│   │   │   └── utils/       # Утилиты
│   │   ├── dist/            # Собранные файлы
│   │   ├── webpack.config.js # Конфигурация сборки
│   │   └── package.json     # Зависимости расширения
│   └── server/              # Node.js Server
│       ├── shiki_ex_server.js # Основной серверный файл
│       ├── modules/         # Модули сервера
│       │   └── altWatcher/  # Модуль для работы с ссылками
│       ├── db_backups/      # Резервные копии БД
│       └── package.json     # Зависимости сервера
├── scripts/                 # Скрипты для управления проектом
├── docs/                    # Документация
└── package.json            # Корневой конфигурация (workspaces)
```

## Функциональность

### Основные возможности:
- **Быстрый поиск** аниме, манги и ранобе на различных сервисах
- **Добавление пользовательских ссылок** для поиска
- **Публикация ссылок** для других пользователей
- **Фильтрация по типам контента** (аниме, манга, ранобе)
- **Поддержка различных кодировок** для названий (UTF-8, windows-1251)

### Поддерживаемые переменные в URL:
- `{{title}}` - название тайтла
- `{{id}}` - ID тайтла в базе Shikimori
- `{{episode}}` - следующий эпизод из вашего списка
- `{{title=encoding}}` - название с указанной кодировкой

## Установка и запуск

### Предварительные требования:
- Node.js (версия 14 или выше)
- npm (версия 7 или выше)
- PostgreSQL
- Chrome браузер

### 1. Установка зависимостей

```bash
# Установка зависимостей для всех пакетов
npm install
```

### 2. Настройка базы данных

Создайте базу данных PostgreSQL и выполните SQL скрипт:

```sql
-- Создание таблицы для ссылок
CREATE TABLE altwatcher_link (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    link TEXT NOT NULL,
    description TEXT,
    manga BOOLEAN DEFAULT FALSE,
    anime BOOLEAN DEFAULT FALSE,
    ranobe BOOLEAN DEFAULT FALSE,
    number_of_downloads INTEGER DEFAULT 0,
    approved BOOLEAN DEFAULT FALSE,
    is_default BOOLEAN DEFAULT FALSE
);
```

### 3. Запуск сервера

```bash
npm run start:server
```

Сервер запустится на порту 81 (по умолчанию).

### 4. Сборка и установка расширения

```bash
# Сборка расширения
npm run build:extension

# Или для разработки
npm run dev:extension
```

После сборки:
1. Откройте Chrome
2. Перейдите в `chrome://extensions/`
3. Включите "Режим разработчика"
4. Нажмите "Загрузить распакованное расширение"
5. Выберите папку `packages/extension/dist`

## Команды для разработки

```bash
# Установка зависимостей для всех пакетов
npm run install:all

# Сборка всех пакетов
npm run build

# Очистка всех пакетов
npm run clean

# Запуск сервера
npm run start:server

# Сборка расширения
npm run build:extension

# Разработка расширения
npm run dev:extension

# Линтинг всех пакетов
npm run lint

# Тестирование (если тесты есть)
npm run test
```

## Управление версиями

```bash
# Обновление версии всех пакетов
node scripts/bump-version.js 1.0.3

# Создание релиза
node scripts/create-release.js 1.0.3
```

## API Endpoints

### GET `/altWatcher/link`
Поиск ссылок по параметрам:
- `title` - название для поиска
- `manga` - фильтр по манге (0/1)
- `anime` - фильтр по аниме (0/1)
- `ranobe` - фильтр по ранобе (0/1)
- `approved` - только одобренные ссылки (true/false)

### POST `/altWatcher/link`
Добавление новой ссылки:
```json
{
    "title": "Название сервиса",
    "link": "URL с переменными",
    "description": "Описание",
    "manga": 1,
    "anime": 1,
    "ranobe": 0
}
```

### GET `/altWatcher/link/:id/inc-num-of-downloads`
Увеличение счетчика загрузок для ссылки.

### GET `/altWatcher/defaultLinks`
Получение ссылок по умолчанию.

### GET `/altWatcher/faq`
Получение FAQ в формате Markdown.

## Разработка

### Структура клиентской части

- **background.js** - фоновый скрипт для обработки событий
- **altWatcher.user.js** - основной скрипт расширения
- **options/** - страница настроек (Vue.js приложение)
- **public/** - статические ресурсы

### Структура серверной части

- **shiki_ex_server.js** - основной Express сервер
- **modules/altWatcher/** - модуль для работы с ссылками

### Workspaces

Проект использует npm workspaces для управления зависимостями:

- `@shiki-extender/extension` - расширение Chrome
- `@shiki-extender/server` - Node.js сервер

## Конфигурация

### Настройки расширения

В `packages/extension/src/manifest.json`:
- `permissions` - разрешения расширения
- `content_scripts` - скрипты для внедрения на страницы
- `web_accessible_resources` - доступные ресурсы

### Настройки сервера

В `packages/server/shiki_ex_server.js`:
- Порт сервера (по умолчанию 81)
- CORS настройки
- Подключение к базе данных

## Документация

Подробная документация доступна в папке [`docs/`](docs/):

- **[Руководство разработчика](docs/DEVELOPMENT.md)** - подробная информация для разработчиков
- **[API документация](docs/API.md)** - полное описание API endpoints
- **[Инструкции по установке](docs/INSTALL.md)** - пошаговые руководства по установке
- **[FAQ](docs/FAQ.md)** - часто задаваемые вопросы

## Поддержка

- **Группа ВК:** https://vk.com/shiki_ex
- **FAQ:** Доступен через API endpoint `/altWatcher/faq`

## Лицензия

MIT License - см. файл [LICENSE](LICENSE)

## Авторы

- **Блог автора:** https://t.me/Timur00Blog
- **Аниме канал:** https://www.youtube.com/c/SThorn
- **Группа канала:** https://vk.com/SThorn