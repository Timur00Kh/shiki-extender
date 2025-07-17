# Устранение неполадок

## Проблемы с npm workspaces

### ❌ "workspaces not supported"

**Причина:** Старая версия Node.js или npm

**Решение:**
```bash
# Проверить версии
node --version  # Должно быть >= 14
npm --version   # Должно быть >= 7

# Обновить npm
npm install -g npm@latest

# Или обновить Node.js
# Скачать с https://nodejs.org/
```

### ❌ "npm ls --workspaces" показывает "(empty)"

**Причина:** Это нормальное поведение для некоторых конфигураций

**Проверка:** Workspaces работают, если команды выполняются успешно:
```bash
npm run build:extension  # Должно работать
npm run start:server     # Должно работать
```

### ❌ "Cannot find workspace"

**Причина:** Неправильная структура папок

**Решение:**
```bash
# Проверить структуру
ls -la packages/
ls -la packages/extension/package.json
ls -la packages/server/package.json

# Переустановить зависимости
rm -rf node_modules package-lock.json
npm install
```

## Проблемы с сервером

### ❌ "Cannot find module '../config/db_config'"

**Причина:** Отсутствует конфигурация базы данных

**Решение:**
```bash
# Проверить файл конфигурации
ls -la packages/server/config/db_config.js

# Создать если отсутствует
cat > packages/server/config/db_config.js << 'EOF'
module.exports = {
  dbConfig: {
    host: 'localhost',
    port: 5432,
    database: 'shiki_extender',
    user: 'postgres',
    password: 'password',
  }
};
EOF
```

### ❌ "connection refused" к PostgreSQL

**Причина:** PostgreSQL не запущен или неправильная конфигурация

**Решение:**
```bash
# Проверить статус PostgreSQL
sudo systemctl status postgresql

# Запустить PostgreSQL
sudo systemctl start postgresql

# Проверить подключение
psql -U postgres -c "SELECT version();"

# Проверить конфигурацию
cat packages/server/config/db_config.js
```

### ❌ "authentication failed"

**Причина:** Неправильные учетные данные

**Решение:**
```bash
# Проверить пользователя
sudo -u postgres psql -c "\du"

# Создать пользователя
sudo -u postgres psql -c "CREATE USER shiki_user WITH PASSWORD 'password';"

# Предоставить права
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE shiki_extender TO shiki_user;"

# Проверить pg_hba.conf
sudo nano /etc/postgresql/*/main/pg_hba.conf
# Должно быть: local all all md5
```

### ❌ "port already in use"

**Причина:** Порт 81 уже используется

**Решение:**
```bash
# Найти процесс
lsof -i :81

# Завершить процесс
kill -9 <PID>

# Или изменить порт
node packages/server/shiki_ex_server.js -p 8081
```

## Проблемы с расширением

### ❌ "webpack command not found"

**Причина:** Webpack не установлен

**Решение:**
```bash
# Переустановить зависимости
npm install

# Или в конкретном пакете
cd packages/extension
npm install
```

### ❌ "Module build failed"

**Причина:** Проблемы с babel-loader или зависимостями

**Решение:**
```bash
# Очистить кэш
npm cache clean --force

# Переустановить зависимости
cd packages/extension
rm -rf node_modules package-lock.json
npm install

# Пересобрать
npm run build
```

### ❌ "Cannot resolve module"

**Причина:** Неправильные пути в webpack.config.js

**Решение:**
```bash
# Проверить пути
cd packages/extension
cat webpack.config.js

# Должно быть:
# entry: path.join(__dirname, 'src', 'options', 'options.js')
# output: path.resolve(__dirname, 'dist')
```

### ❌ Расширение не загружается в Chrome

**Причина:** Неправильный manifest.json или сборка

**Решение:**
```bash
# Проверить dist папку
ls -la packages/extension/dist/

# Проверить manifest.json
cat packages/extension/dist/manifest.json

# Пересобрать
cd packages/extension
npm run build

# Проверить ошибки в Chrome
# chrome://extensions/ -> Developer mode -> Errors
```

## Проблемы с базой данных

### ❌ "database does not exist"

**Причина:** База данных не создана

**Решение:**
```bash
# Создать базу данных
sudo -u postgres psql -c "CREATE DATABASE shiki_extender;"

# Создать пользователя
sudo -u postgres psql -c "CREATE USER shiki_user WITH PASSWORD 'password';"

# Предоставить права
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE shiki_extender TO shiki_user;"
```

### ❌ "relation does not exist"

**Причина:** Таблицы не созданы

**Решение:**
```bash
# Применить схему
psql -U shiki_user -d shiki_extender -f packages/server/db_backups/shiki_ex_public_altwatcher_link.sql

# Или создать таблицу вручную
psql -U shiki_user -d shiki_extender -c "
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
"
```

### ❌ "too many connections"

**Причина:** Превышен лимит подключений

**Решение:**
```bash
# Проверить активные подключения
psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"

# Завершить подключения
psql -U postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'shiki_extender';"

# Настроить пул подключений
# Отредактировать packages/server/config/db_config.js
# max: 5  // Уменьшить количество подключений
```

## Проблемы с зависимостями

### ❌ "Cannot resolve dependency"

**Причина:** Конфликт зависимостей

**Решение:**
```bash
# Очистить все
rm -rf node_modules package-lock.json
rm -rf packages/*/node_modules packages/*/package-lock.json

# Переустановить
npm install
```

### ❌ "peer dependency warnings"

**Причина:** Несовместимые версии пакетов

**Решение:**
```bash
# Обновить package.json
npm update

# Или установить конкретную версию
npm install package@version
```

### ❌ "EACCES permission denied"

**Причина:** Проблемы с правами доступа

**Решение:**
```bash
# Исправить права npm
sudo chown -R $(whoami) ~/.npm

# Или использовать npx
npx npm install
```

## Проблемы с разработкой

### ❌ "Hot reload не работает"

**Причина:** Неправильная конфигурация webpack-dev-server

**Решение:**
```bash
# Проверить конфигурацию
cd packages/extension
cat webpack.config.js

# Запустить dev сервер
npm run start

# Или использовать watch
npm run watch
```

### ❌ "ESLint errors"

**Причина:** Нарушения стиля кода

**Решение:**
```bash
# Автоисправление
npm run lint:fix

# Или отключить для конкретного файла
/* eslint-disable */
```

### ❌ "Cannot read property of undefined"

**Причина:** Ошибка в коде JavaScript

**Решение:**
```bash
# Проверить консоль браузера
# F12 -> Console

# Проверить логи сервера
cd packages/server
npm start
# Посмотреть консоль на ошибки
```

## Проблемы с API

### ❌ "CORS policy error"

**Причина:** Проблемы с Cross-Origin Resource Sharing

**Решение:**
```bash
# Проверить CORS настройки в сервере
cd packages/server
grep -r "cors" .

# Должно быть:
# app.use(cors());
# response.set('Access-Control-Allow-Origin', '*');
```

### ❌ "404 Not Found"

**Причина:** Неправильный URL или маршрут

**Решение:**
```bash
# Проверить маршруты
cd packages/server
grep -r "router\." modules/

# Проверить URL
curl -v http://localhost:81/altWatcher/faq
```

### ❌ "500 Internal Server Error"

**Причина:** Ошибка на сервере

**Решение:**
```bash
# Проверить логи сервера
cd packages/server
npm start
# Посмотреть консоль на ошибки

# Проверить подключение к БД
node -e "
const {dbConfig} = require('./config/db_config');
console.log(dbConfig);
"
```

## Отладка

### Логи сервера
```bash
# Запустить с подробными логами
cd packages/server
DEBUG=* npm start

# Или с nodemon
npm install -g nodemon
nodemon shiki_ex_server.js
```

### Логи расширения
```bash
# Открыть DevTools в Chrome
# F12 -> Console

# Проверить background script
# chrome://extensions/ -> Background page
```

### Логи базы данных
```bash
# Включить логирование в PostgreSQL
sudo nano /etc/postgresql/*/main/postgresql.conf
# log_statement = 'all'

# Перезапустить PostgreSQL
sudo systemctl restart postgresql

# Просмотреть логи
sudo tail -f /var/log/postgresql/postgresql-*.log
```

## Полезные команды для диагностики

```bash
# Проверить версии
node --version
npm --version
psql --version

# Проверить процессы
ps aux | grep node
ps aux | grep postgres

# Проверить порты
netstat -tlnp | grep :81
netstat -tlnp | grep :5432

# Проверить диск
df -h
du -sh node_modules

# Проверить память
free -h
```

## Получение помощи

### Сбор информации для баг-репорта

```bash
# Версии
node --version > debug_info.txt
npm --version >> debug_info.txt
psql --version >> debug_info.txt

# Конфигурация
cat packages/server/config/db_config.js >> debug_info.txt

# Логи
npm run start:server 2>&1 | tee -a debug_info.txt
```

### Где получить помощь

1. **GitHub Issues:** https://github.com/your-repo/issues
2. **Группа ВК:** https://vk.com/shiki_ex
3. **Telegram:** https://t.me/Timur00Blog
4. **FAQ:** [FAQ.md](FAQ.md)

### Создание issue

При создании issue укажите:
- Версии Node.js, npm, PostgreSQL
- Операционную систему
- Шаги для воспроизведения
- Ожидаемое поведение
- Фактическое поведение
- Логи ошибок

---

**Не нашли решение? Создайте issue с подробным описанием проблемы!**
