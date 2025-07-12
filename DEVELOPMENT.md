# Руководство разработчика

## Обзор архитектуры

### Клиент-серверная архитектура

Проект использует классическую клиент-серверную архитектуру:

```
┌─────────────────┐    HTTP API    ┌─────────────────┐
│ Chrome Extension │ ◄────────────► │ Node.js Server  │
│                 │                │                 │
│ - Content Script│                │ - Express API   │
│ - Background    │                │ - PostgreSQL    │
│ - Options Page  │                │ - Link Manager  │
└─────────────────┘                └─────────────────┘
```

### Компоненты системы

#### 1. Chrome Extension (`Chrome_extension/`)

**Основные файлы:**
- `manifest.json` - конфигурация расширения
- `background.js` - фоновый скрипт
- `altWatcher.user.js` - основной content script
- `options/` - страница настроек (Vue.js)

**Технологии:**
- Vue.js 2.6.9
- Bootstrap Vue
- Webpack
- SCSS/Stylus

#### 2. Node.js Server (`NodeServer/`)

**Основные файлы:**
- `shiki_ex_server.js` - Express сервер
- `modules/altWatcher/altWatcher.js` - API модуль
- `modules/altWatcher/faq.md` - документация

**Технологии:**
- Express.js
- PostgreSQL (pg)
- CORS middleware

## API Документация

### База данных

#### Таблица `altwatcher_link`

```sql
CREATE TABLE altwatcher_link (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,           -- Название сервиса
    link TEXT NOT NULL,                    -- URL с переменными
    description TEXT,                      -- Описание сервиса
    manga BOOLEAN DEFAULT FALSE,           -- Для манги
    anime BOOLEAN DEFAULT FALSE,           -- Для аниме
    ranobe BOOLEAN DEFAULT FALSE,          -- Для ранобе
    number_of_downloads INTEGER DEFAULT 0, -- Счетчик использований
    approved BOOLEAN DEFAULT FALSE,        -- Одобрено модератором
    is_default BOOLEAN DEFAULT FALSE       -- Ссылка по умолчанию
);
```

### REST API Endpoints

#### GET `/altWatcher/link`

Поиск ссылок с фильтрацией.

**Параметры запроса:**
- `title` (string) - название для поиска
- `manga` (0/1) - фильтр по манге
- `anime` (0/1) - фильтр по аниме  
- `ranobe` (0/1) - фильтр по ранобе
- `approved` (true/false) - только одобренные

**Пример запроса:**
```bash
GET /altWatcher/link?title=naruto&anime=1&approved=true
```

**Ответ:**
```json
[
  {
    "id": 1,
    "title": "Anime365",
    "link": "https://anime365.ru/search?q={{title}}",
    "description": "Поиск аниме на Anime365",
    "manga": false,
    "anime": true,
    "ranobe": false,
    "number_of_downloads": 150,
    "approved": true,
    "is_default": false
  }
]
```

#### POST `/altWatcher/link`

Добавление новой ссылки.

**Тело запроса:**
```json
{
  "title": "Название сервиса",
  "link": "https://example.com/search?q={{title}}",
  "description": "Описание сервиса",
  "manga": 1,
  "anime": 0,
  "ranobe": 0
}
```

**Ответ:**
```json
{
  "id": 123
}
```

#### GET `/altWatcher/link/:id/inc-num-of-downloads`

Увеличение счетчика использований ссылки.

**Параметры пути:**
- `id` (integer) - ID ссылки

**Ответ:** HTTP 200

#### GET `/altWatcher/defaultLinks`

Получение ссылок по умолчанию.

**Ответ:** Массив ссылок с `is_default = true`

#### GET `/altWatcher/faq`

Получение FAQ в формате Markdown.

**Ответ:** Markdown текст

## Переменные в URL

### Поддерживаемые переменные

1. **`{{title}}`** - название тайтла
   ```
   https://example.com/search?q={{title}}
   ```

2. **`{{id}}`** - ID тайтла в Shikimori
   ```
   https://example.com/anime/{{id}}
   ```

3. **`{{episode}}`** - следующий эпизод из списка пользователя
   ```
   https://example.com/watch?episode={{episode}}
   ```

4. **`{{title=encoding}}`** - название с указанной кодировкой
   ```
   https://example.com/search?q={{title=windows-1251}}
   ```

### Поддерживаемые кодировки

- `UTF-8` (по умолчанию)
- `windows-1251`

## Процесс разработки

### Настройка окружения

1. **Клонирование репозитория:**
   ```bash
   git clone <repository-url>
   cd shiki-extender
   ```

2. **Настройка базы данных:**
   ```bash
   # Создание БД
   createdb shiki_extender
   
   # Применение схемы
   psql -d shiki_extender -f NodeServer/modules/altWatcher/link_table.sql
   ```

3. **Настройка конфигурации:**
   ```bash
   # Создание файла конфигурации БД
   mkdir -p NodeServer/config
   cp NodeServer/config/db_config.example.js NodeServer/config/db_config.js
   # Отредактируйте файл с вашими настройками БД
   ```

### Команды разработки

#### Серверная часть
```bash
cd NodeServer
npm install
npm start          # Запуск сервера
npm run dev        # Запуск в режиме разработки
```

#### Клиентская часть
```bash
cd Chrome_extension/src
npm install
npm run watch      # Сборка с отслеживанием изменений
npm run build      # Продакшн сборка
npm run dev        # Запуск dev сервера
```

### Тестирование

#### API тестирование
```bash
# Тест поиска ссылок
curl "http://localhost:8081/altWatcher/link?title=test&anime=1"

# Тест добавления ссылки
curl -X POST http://localhost:8081/altWatcher/link \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","link":"https://test.com","anime":1}'
```

#### Расширение
1. Соберите расширение: `npm run build`
2. Загрузите в Chrome: `chrome://extensions/`
3. Включите режим разработчика
4. Загрузите распакованное расширение из папки `dist/`

## Структура кода

### Серверная часть

```javascript
// shiki_ex_server.js
const express = require('express');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/altWatcher', require('./modules/altWatcher/altWatcher.js'));
```

```javascript
// modules/altWatcher/altWatcher.js
const router = express.Router();

// SQL queries
const SQL_SELECT_LINK = `SELECT * FROM altwatcher_link WHERE ...`;

// API endpoints
router.get('/link', async (request, response) => {
  // Логика поиска ссылок
});

router.post('/link', async (request, response) => {
  // Логика добавления ссылки
});
```

### Клиентская часть

```javascript
// background.js
chrome.runtime.onInstalled.addListener(() => {
  // Инициализация расширения
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Обработка сообщений
});
```

```javascript
// altWatcher.user.js
class AltWatcher {
  constructor() {
    this.init();
  }
  
  async init() {
    // Инициализация на странице Shikimori
  }
  
  async searchLinks(title, filters) {
    // Поиск ссылок через API
  }
}
```

## Отладка

### Серверная отладка

```bash
# Запуск с отладкой
node --inspect shiki_ex_server.js

# Или с nodemon для автоперезапуска
nodemon --inspect shiki_ex_server.js
```

### Клиентская отладка

1. **Content Script:**
   - Откройте DevTools на странице Shikimori
   - Проверьте консоль на ошибки

2. **Background Script:**
   - Перейдите в `chrome://extensions/`
   - Нажмите "background page" для вашего расширения

3. **Options Page:**
   - Откройте страницу настроек расширения
   - Используйте DevTools как обычно

## Развертывание

### Продакшн сборка

```bash
# Сервер
cd NodeServer
npm install --production
npm start

# Клиент
cd Chrome_extension/src
npm run build
```

### Мониторинг

- Логи сервера: `tail -f NodeServer/logs/server.log`
- Мониторинг БД: `pg_stat_statements`
- Мониторинг расширения: Chrome DevTools

## Безопасность

### Рекомендации

1. **CORS настройки** - ограничьте доступ только с нужных доменов
2. **SQL Injection** - используйте параметризованные запросы (уже реализовано)
3. **Rate Limiting** - добавьте ограничения на API запросы
4. **Валидация данных** - проверяйте входные данные

### Пример улучшений безопасности

```javascript
// Добавление rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100 // максимум 100 запросов
});

app.use('/altWatcher/', limiter);
```

## Контрибьюция

### Процесс разработки

1. Создайте feature branch
2. Внесите изменения
3. Протестируйте локально
4. Создайте Pull Request

### Стандарты кода

- Используйте ESLint для JavaScript
- Следуйте стандартам Vue.js для клиентской части
- Добавляйте комментарии к сложной логике
- Пишите тесты для критической функциональности
