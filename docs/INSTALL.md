# Инструкции по установке

## Системные требования

### Минимальные требования:
- **Node.js** версии 14.0.0 или выше (для npm workspaces)
- **npm** версии 7.0.0 или выше (для workspaces)
- **PostgreSQL** версии 10.0 или выше
- **Chrome браузер** версии 80 или выше
- **Git** для клонирования репозитория

### Рекомендуемые требования:
- **Node.js** версии 18.0.0 или выше
- **npm** версии 8.0.0 или выше
- **PostgreSQL** версии 13.0 или выше
- **Chrome браузер** версии 90 или выше

## Установка

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd shiki-extender
```

### 2. Установка зависимостей (npm workspaces)

```bash
# Установка зависимостей для всех пакетов
npm install
```

Эта команда установит зависимости для:
- Корневого проекта
- `packages/server/` 
- `packages/extension/`

### 3. Установка PostgreSQL

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

#### CentOS/RHEL:
```bash
sudo yum install postgresql postgresql-server
sudo postgresql-setup initdb
sudo systemctl start postgresql
```

#### macOS (с Homebrew):
```bash
brew install postgresql
brew services start postgresql
```

#### Windows:
Скачайте и установите с официального сайта: https://www.postgresql.org/download/windows/

### 4. Настройка базы данных

#### Создание пользователя и базы данных:

```bash
# Подключение к PostgreSQL
sudo -u postgres psql

# Создание пользователя (замените username и password на ваши)
CREATE USER shiki_user WITH PASSWORD 'your_password';

# Создание базы данных
CREATE DATABASE shiki_extender OWNER shiki_user;

# Предоставление прав
GRANT ALL PRIVILEGES ON DATABASE shiki_extender TO shiki_user;

# Выход из psql
\q
```

#### Применение схемы базы данных:

```bash
# Используйте SQL файл из server пакета
psql -U shiki_user -d shiki_extender -f packages/server/db_backups/shiki_ex_public_altwatcher_link.sql
```

### 5. Настройка сервера

#### Создание конфигурационного файла:

```bash
# Файл конфигурации уже создан в packages/server/config/db_config.js
# Отредактируйте его с вашими настройками:

nano packages/server/config/db_config.js
```

Пример конфигурации:
```javascript
module.exports = {
  dbConfig: {
    host: 'localhost',
    port: 5432,
    database: 'shiki_extender',
    user: 'shiki_user',
    password: 'your_password',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  }
};
```

#### Проверка конфигурации:

```bash
# Тест подключения к базе данных
cd packages/server
node -e "
const {dbConfig} = require('./config/db_config');
const {Pool} = require('pg');
const pg = new Pool(dbConfig);
pg.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Ошибка подключения к БД:', err);
        process.exit(1);
    }
    console.log('Подключение к БД успешно:', res.rows[0]);
    pg.end();
});
"
```

### 6. Запуск сервера

#### Через npm workspaces (рекомендуется):
```bash
# Из корня проекта
npm run start:server
```

#### Напрямую:
```bash
cd packages/server
npm start
```

#### Продакшн:
```bash
# Установка PM2 для управления процессами
npm install -g pm2

# Запуск с PM2
cd packages/server
pm2 start shiki_ex_server.js --name "shiki-server"

# Автозапуск при перезагрузке
pm2 startup
pm2 save
```

#### Проверка работы сервера:

```bash
# Тест API
curl "http://localhost:81/altWatcher/faq"
```

### 7. Сборка и установка расширения

#### Сборка через npm workspaces (рекомендуется):

```bash
# Из корня проекта
npm run build:extension

# Или для разработки
npm run dev:extension
```

#### Напрямую:
```bash
cd packages/extension
npm run build

# Или сборка с отслеживанием изменений
npm run watch
```

#### Установка в Chrome:

1. Откройте Chrome и перейдите в `chrome://extensions/`
2. Включите "Режим разработчика" (переключатель в правом верхнем углу)
3. Нажмите "Загрузить распакованное расширение"
4. Выберите папку `packages/extension/dist`
5. Расширение должно появиться в списке

### 8. Настройка переменных окружения (опционально)

Создайте файл `.env` в `packages/server/`:

```bash
# packages/server/.env
NODE_ENV=development
PORT=81
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shiki_extender
DB_USER=shiki_user
DB_PASSWORD=your_password
```

## Проверка установки

### 1. Проверка сервера

```bash
# Проверка статуса сервера
curl -I http://localhost:81/altWatcher/faq

# Проверка API поиска
curl "http://localhost:81/altWatcher/link?anime=1"
```

### 2. Проверка расширения

1. Откройте сайт Shikimori: https://shikimori.one
2. На любой странице аниме/манги должно появиться расширение
3. Проверьте, что расширение работает корректно

### 3. Проверка workspaces

```bash
# Проверка что workspaces настроены
npm ls --workspaces --depth=0

# Проверка сборки через workspaces
npm run build
```

## Команды для разработки

### Основные команды (из корня проекта):

```bash
# Установка зависимостей
npm install

# Сборка всех пакетов
npm run build

# Запуск сервера
npm run start:server

# Сборка расширения
npm run build:extension

# Разработка расширения
npm run dev:extension

# Линтинг
npm run lint

# Очистка
npm run clean
```

### Управление версиями:

```bash
# Обновить версию всех пакетов
node scripts/bump-version.js 1.0.1

# Создать релиз
node scripts/create-release.js 1.0.1
```

## Устранение неполадок

### Проблемы с workspaces

**Ошибка: "workspaces not supported"**
```bash
# Проверка версий
node --version  # Должно быть >= 14
npm --version   # Должно быть >= 7

# Обновление npm
npm install -g npm@latest
```

### Проблемы с PostgreSQL

**Ошибка: "Cannot find module '../config/db_config'"**
```bash
# Проверка файла конфигурации
ls -la packages/server/config/db_config.js

# Создание файла если отсутствует
cp packages/server/config/db_config.js.example packages/server/config/db_config.js
```

### Проблемы с сборкой

**Ошибка: "webpack command not found"**
```bash
# Переустановка зависимостей
npm install

# Или установка в конкретный пакет
cd packages/extension
npm install
```

## Обновление

### Обновление всего проекта

```bash
# Обновление кода
git pull origin main

# Переустановка зависимостей
npm install

# Пересборка
npm run build
```

### Обновление сервера

```bash
# Остановка сервера
pm2 stop shiki-server

# Обновление
git pull origin main
npm install

# Запуск
pm2 start shiki-server
```

## Структура проекта

```
shiki-extender/
├── packages/
│   ├── server/              # Node.js сервер
│   │   ├── config/         # Конфигурация БД
│   │   ├── modules/        # API модули
│   │   ├── db_backups/     # SQL схемы
│   │   └── package.json
│   └── extension/          # Chrome расширение
│       ├── src/           # Исходный код
│       ├── dist/          # Собранные файлы
│       ├── webpack.config.js
│       └── package.json
├── scripts/                # Скрипты управления
├── docs/                   # Документация
└── package.json           # Root workspaces
```

## Дополнительная документация

- [Руководство разработчика](DEVELOPMENT.md) - подробная информация для разработчиков
- [API документация](API.md) - описание API endpoints
- [FAQ](FAQ.md) - часто задаваемые вопросы
- [Быстрый старт](quick-start.md) - краткое руководство
