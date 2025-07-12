# API Документация

## Общая информация

**Базовый URL:** `http://localhost:8081` (или ваш сервер)

**Content-Type:** `application/json`

**CORS:** Поддерживается для всех доменов (`Access-Control-Allow-Origin: *`)

## Аутентификация

В текущей версии API не требует аутентификации. Все endpoints публично доступны.

## Endpoints

### 1. Поиск ссылок

#### GET `/altWatcher/link`

Поиск ссылок с фильтрацией по различным параметрам.

**Параметры запроса:**

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `title` | string | Нет | Название для поиска (частичное совпадение) |
| `manga` | integer | Нет | Фильтр по манге (0 или 1) |
| `anime` | integer | Нет | Фильтр по аниме (0 или 1) |
| `ranobe` | integer | Нет | Фильтр по ранобе (0 или 1) |
| `approved` | boolean | Нет | Только одобренные ссылки (true/false) |

**Пример запроса:**
```bash
curl "http://localhost:8081/altWatcher/link?title=naruto&anime=1&approved=true"
```

**Пример ответа:**
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
  },
  {
    "id": 2,
    "title": "Sibnet",
    "link": "https://video.sibnet.ru/search.php?&text={{title=windows-1251}}",
    "description": "Поиск видео на Sibnet",
    "manga": false,
    "anime": true,
    "ranobe": false,
    "number_of_downloads": 89,
    "approved": true,
    "is_default": false
  }
]
```

**Коды ответов:**
- `200 OK` - успешный поиск
- `500 Internal Server Error` - ошибка сервера

### 2. Добавление ссылки

#### POST `/altWatcher/link`

Добавление новой ссылки в базу данных.

**Тело запроса:**

| Поле | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| `title` | string | Да | Название сервиса |
| `link` | string | Да | URL с переменными |
| `description` | string | Нет | Описание сервиса |
| `manga` | integer | Нет | Для манги (0 или 1, по умолчанию 0) |
| `anime` | integer | Нет | Для аниме (0 или 1, по умолчанию 0) |
| `ranobe` | integer | Нет | Для ранобе (0 или 1, по умолчанию 0) |

**Пример запроса:**
```bash
curl -X POST http://localhost:8081/altWatcher/link \
  -H "Content-Type: application/json" \
  -d '{
    "title": "MyAnimeList",
    "link": "https://myanimelist.net/search/all?q={{title}}",
    "description": "Поиск на MyAnimeList",
    "anime": 1,
    "manga": 1,
    "ranobe": 0
  }'
```

**Пример ответа:**
```json
{
  "id": 123
}
```

**Коды ответов:**
- `200 OK` - ссылка успешно добавлена
- `400 Bad Request` - отсутствуют обязательные поля
- `500 Internal Server Error` - ошибка сервера

**Ошибки валидации:**
```json
{
  "error": "title is not present"
}
```
или
```json
{
  "error": "link is not present"
}
```

### 3. Увеличение счетчика использований

#### GET `/altWatcher/link/:id/inc-num-of-downloads`

Увеличение счетчика использований ссылки на 1.

**Параметры пути:**
- `id` (integer) - ID ссылки

**Пример запроса:**
```bash
curl "http://localhost:8081/altWatcher/link/123/inc-num-of-downloads"
```

**Коды ответов:**
- `200 OK` - счетчик успешно увеличен
- `500 Internal Server Error` - ошибка сервера

### 4. Получение ссылок по умолчанию

#### GET `/altWatcher/defaultLinks`

Получение всех ссылок, помеченных как ссылки по умолчанию.

**Пример запроса:**
```bash
curl "http://localhost:8081/altWatcher/defaultLinks"
```

**Пример ответа:**
```json
[
  {
    "id": 5,
    "title": "Default Anime Site",
    "link": "https://default-anime.com/search?q={{title}}",
    "description": "Сайт по умолчанию для аниме",
    "manga": false,
    "anime": true,
    "ranobe": false,
    "number_of_downloads": 500,
    "approved": true,
    "is_default": true
  }
]
```

**Коды ответов:**
- `200 OK` - успешное получение
- `500 Internal Server Error` - ошибка сервера

### 5. Получение FAQ

#### GET `/altWatcher/faq`

Получение FAQ в формате Markdown.

**Пример запроса:**
```bash
curl "http://localhost:8081/altWatcher/faq"
```

**Пример ответа:**
```markdown
# Описание

Расширение добавляет функционал для быстрого поиска аниме, манги и ранобе на сайт shikimori.
Быстро переходи на любимые сайты.
Добавляй и ищи новые сервисы.

### Как пользоваться
...
```

**Коды ответов:**
- `200 OK` - успешное получение
- `500 Internal Server Error` - ошибка сервера

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

| Кодировка | Алиасы |
|-----------|--------|
| UTF-8 | UTF-8, UTF8 |
| windows-1251 | windows-1251, windows1251, 1251 |

## Примеры использования

### Поиск ссылок для аниме

```bash
# Поиск всех ссылок для аниме
curl "http://localhost:8081/altWatcher/link?anime=1"

# Поиск ссылок для конкретного аниме
curl "http://localhost:8081/altWatcher/link?title=naruto&anime=1"

# Поиск только одобренных ссылок
curl "http://localhost:8081/altWatcher/link?anime=1&approved=true"
```

### Поиск ссылок для манги

```bash
# Поиск всех ссылок для манги
curl "http://localhost:8081/altWatcher/link?manga=1"

# Поиск ссылок для конкретной манги
curl "http://localhost:8081/altWatcher/link?title=one%20piece&manga=1"
```

### Добавление новой ссылки

```bash
# Добавление ссылки для аниме
curl -X POST http://localhost:8081/altWatcher/link \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Crunchyroll",
    "link": "https://www.crunchyroll.com/search?q={{title}}",
    "description": "Официальный стриминг аниме",
    "anime": 1
  }'

# Добавление ссылки для манги
curl -X POST http://localhost:8081/altWatcher/link \
  -H "Content-Type: application/json" \
  -d '{
    "title": "MangaDex",
    "link": "https://mangadex.org/search?q={{title}}",
    "description": "Читалка манги",
    "manga": 1
  }'
```

## Обработка ошибок

### Общие ошибки

**500 Internal Server Error**
```json
{
  "error": "Internal server error"
}
```

**400 Bad Request**
```json
{
  "error": "title is not present"
}
```

### Рекомендации по обработке ошибок

1. **Проверяйте HTTP статус код** перед обработкой ответа
2. **Обрабатывайте сетевые ошибки** (таймауты, недоступность сервера)
3. **Валидируйте данные** на клиентской стороне
4. **Используйте retry логику** для временных ошибок

## Ограничения

### Rate Limiting

В текущей версии API не имеет встроенных ограничений на количество запросов. Рекомендуется:

- Не делать более 100 запросов в минуту с одного IP
- Использовать кэширование на клиентской стороне
- Группировать запросы где возможно

### Размер данных

- Максимальный размер тела запроса: 1MB
- Максимальная длина названия: 255 символов
- Максимальная длина URL: 2048 символов
- Максимальная длина описания: 1000 символов

## Версионирование

Текущая версия API: `v1`

В будущих версиях API может измениться. Рекомендуется:

1. Использовать версионирование в URL: `/api/v1/altWatcher/`
2. Добавить заголовок версии: `API-Version: 1`
3. Поддерживать обратную совместимость

## Мониторинг

### Логирование

Сервер логирует все запросы в консоль:

```
---/link [naruto, 0, 1, 0, true]
---res [{ id: 123 }]
/link/123/inc-num-of-downloads
```

### Метрики

Рекомендуется отслеживать:

- Количество запросов в минуту
- Время ответа API
- Количество ошибок
- Популярные ссылки (по `number_of_downloads`)