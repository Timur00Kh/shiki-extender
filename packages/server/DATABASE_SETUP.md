# Настройка базы данных

## Быстрый старт без базы данных

Для тестирования сервера без базы данных, создайте файл `config/db_config.js` с моковыми данными:

```javascript
module.exports = {
  dbConfig: {
    host: 'localhost',
    port: 5432,
    database: 'test',
    user: 'test',
    password: 'test',
  }
};
```

## Настройка PostgreSQL

1. Установите PostgreSQL
2. Создайте базу данных:
   ```sql
   CREATE DATABASE shiki_extender;
   ```

3. Создайте таблицу:
   ```sql
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

4. Настройте `config/db_config.js` с вашими данными

## Переменные окружения

Создайте файл `.env` (скопируйте из `.env.example`):

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shiki_extender
DB_USER=postgres
DB_PASSWORD=your_password
```

## Запуск

```bash
npm start
```

Сервер запустится на порту 81.
