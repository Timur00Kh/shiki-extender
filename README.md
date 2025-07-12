# Shiki Extender - Расширение для Shikimori

## Описание проекта

Shiki Extender - это расширение для браузера Chrome, которое добавляет функциональность для быстрого поиска аниме, манги и ранобе на сайте Shikimori. Проект состоит из двух основных компонентов:

1. **Chrome Extension** - клиентская часть расширения
2. **Node.js Server** - серверная часть для управления базой данных ссылок

## Архитектура проекта

```
├── Chrome_extension/          # Клиентская часть (Chrome Extension)
│   ├── src/                  # Исходный код расширения
│   │   ├── manifest.json     # Манифест расширения
│   │   ├── background.js     # Фоновый скрипт
│   │   ├── altWatcher.user.js # Основной скрипт расширения
│   │   ├── options/          # Страница настроек
│   │   ├── public/           # Публичные ресурсы
│   │   └── utils/            # Утилиты
│   └── dist/                 # Собранные файлы
└── NodeServer/               # Серверная часть
    ├── shiki_ex_server.js    # Основной серверный файл
    ├── modules/              # Модули сервера
    │   └── altWatcher/       # Модуль для работы с ссылками
    │       ├── altWatcher.js # API для работы с ссылками
    │       ├── faq.md        # FAQ
    │       └── link_table.sql # Схема базы данных
    └── db_backups/           # Резервные копии БД
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
- Node.js (версия 12 или выше)
- PostgreSQL
- Chrome браузер

### 1. Настройка базы данных

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

### 2. Настройка сервера

```bash
cd NodeServer
npm install
```

Создайте файл конфигурации базы данных `config/db_config.js`:

```javascript
module.exports = {
    dbConfig: {
        host: 'localhost',
        port: 5432,
        database: 'your_database_name',
        user: 'your_username',
        password: 'your_password'
    }
};
```

Запустите сервер:

```bash
npm start
```

Сервер запустится на порту 8081 (по умолчанию).

### 3. Сборка и установка расширения

```bash
cd Chrome_extension/src
npm install
npm run build
```

После сборки:
1. Откройте Chrome
2. Перейдите в `chrome://extensions/`
3. Включите "Режим разработчика"
4. Нажмите "Загрузить распакованное расширение"
5. Выберите папку `Chrome_extension/dist`

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

### Команды для разработки

```bash
# Сборка расширения в режиме разработки
npm run watch

# Запуск dev сервера
npm run dev

# Сборка для продакшена
npm run build
```

## Конфигурация

### Настройки расширения

В `manifest.json`:
- `permissions` - разрешения расширения
- `content_scripts` - скрипты для внедрения на страницы
- `web_accessible_resources` - доступные ресурсы

### Настройки сервера

В `shiki_ex_server.js`:
- Порт сервера (по умолчанию 8081)
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