# Инструкции по установке

## Системные требования

### Минимальные требования:
- **Node.js** версии 12.0.0 или выше
- **PostgreSQL** версии 10.0 или выше
- **Chrome браузер** версии 80 или выше
- **Git** для клонирования репозитория

### Рекомендуемые требования:
- **Node.js** версии 16.0.0 или выше
- **PostgreSQL** версии 13.0 или выше
- **Chrome браузер** версии 90 или выше
- **npm** версии 6.0.0 или выше

## Установка

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd shiki-extender
```

### 2. Установка PostgreSQL

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

### 3. Настройка базы данных

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
# Подключение к базе данных и выполнение SQL скрипта
psql -U shiki_user -d shiki_extender -f NodeServer/modules/altWatcher/link_table.sql
```

### 4. Настройка сервера

#### Установка зависимостей:

```bash
cd NodeServer
npm install
```

#### Создание конфигурационного файла:

```bash
# Создание директории для конфигурации
mkdir -p config

# Создание файла конфигурации
cat > config/db_config.js << EOF
module.exports = {
    dbConfig: {
        host: 'localhost',
        port: 5432,
        database: 'shiki_extender',
        user: 'shiki_user',
        password: 'your_password',
        max: 20, // максимальное количество соединений
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    }
};
EOF
```

**Важно:** Замените `your_password` на пароль, который вы указали при создании пользователя PostgreSQL.

#### Проверка конфигурации:

```bash
# Тест подключения к базе данных
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

### 5. Запуск сервера

#### Разработка:
```bash
npm start
```

#### Продакшн:
```bash
# Установка PM2 для управления процессами
npm install -g pm2

# Запуск с PM2
pm2 start shiki_ex_server.js --name "shiki-server"

# Автозапуск при перезагрузке
pm2 startup
pm2 save
```

#### Проверка работы сервера:

```bash
# Тест API
curl "http://localhost:8081/altWatcher/faq"
```

### 6. Сборка и установка расширения

#### Установка зависимостей:

```bash
cd Chrome_extension/src
npm install
```

#### Сборка расширения:

```bash
# Сборка для разработки
npm run build

# Или сборка с отслеживанием изменений
npm run watch
```

#### Установка в Chrome:

1. Откройте Chrome и перейдите в `chrome://extensions/`
2. Включите "Режим разработчика" (переключатель в правом верхнем углу)
3. Нажмите "Загрузить распакованное расширение"
4. Выберите папку `Chrome_extension/dist`
5. Расширение должно появиться в списке

### 7. Настройка переменных окружения (опционально)

Создайте файл `.env` в корне проекта:

```bash
# .env
NODE_ENV=development
PORT=8081
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
curl -I http://localhost:8081/altWatcher/faq

# Проверка API поиска
curl "http://localhost:8081/altWatcher/link?anime=1"
```

### 2. Проверка расширения

1. Откройте сайт Shikimori: https://shikimori.one
2. На любой странице аниме/манги должно появиться расширение
3. Проверьте, что расширение работает корректно

### 3. Проверка базы данных

```bash
# Подключение к БД
psql -U shiki_user -d shiki_extender

# Проверка таблицы
\dt altwatcher_link

# Проверка данных
SELECT * FROM altwatcher_link LIMIT 5;

# Выход
\q
```

## Устранение неполадок

### Проблемы с PostgreSQL

**Ошибка: "connection refused"**
```bash
# Проверка статуса PostgreSQL
sudo systemctl status postgresql

# Запуск PostgreSQL
sudo systemctl start postgresql
```

**Ошибка: "authentication failed"**
```bash
# Проверка файла pg_hba.conf
sudo nano /etc/postgresql/*/main/pg_hba.conf

# Изменение метода аутентификации на md5
# local   all             all                                     md5
```

### Проблемы с Node.js

**Ошибка: "module not found"**
```bash
# Переустановка зависимостей
rm -rf node_modules package-lock.json
npm install
```

**Ошибка: "port already in use"**
```bash
# Поиск процесса, использующего порт
lsof -i :8081

# Завершение процесса
kill -9 <PID>
```

### Проблемы с расширением

**Расширение не загружается:**
1. Проверьте консоль браузера на ошибки
2. Убедитесь, что сервер запущен
3. Проверьте CORS настройки

**Расширение не работает на Shikimori:**
1. Проверьте manifest.json - правильные ли домены указаны
2. Убедитесь, что content script загружается
3. Проверьте консоль на странице Shikimori

## Обновление

### Обновление сервера

```bash
# Остановка сервера
pm2 stop shiki-server

# Обновление кода
git pull origin main

# Переустановка зависимостей
cd NodeServer
npm install

# Запуск сервера
pm2 start shiki-server
```

### Обновление расширения

```bash
# Обновление кода
git pull origin main

# Пересборка расширения
cd Chrome_extension/src
npm run build

# Обновление в Chrome
# Перейдите в chrome://extensions/ и нажмите "Обновить"
```

## Резервное копирование

### База данных

```bash
# Создание резервной копии
pg_dump -U shiki_user shiki_extender > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановление из резервной копии
psql -U shiki_user -d shiki_extender < backup_file.sql
```

### Конфигурация

```bash
# Резервное копирование конфигурации
cp NodeServer/config/db_config.js backup_db_config.js

# Восстановление конфигурации
cp backup_db_config.js NodeServer/config/db_config.js
```

## Безопасность

### Рекомендации по безопасности

1. **Измените пароль по умолчанию** для пользователя PostgreSQL
2. **Ограничьте доступ к базе данных** только с нужных IP адресов
3. **Используйте HTTPS** в продакшене
4. **Регулярно обновляйте** зависимости
5. **Мониторьте логи** на подозрительную активность

### Настройка файрвола

```bash
# Ubuntu/Debian
sudo ufw allow 8081/tcp

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=8081/tcp
sudo firewall-cmd --reload
```

## Мониторинг

### Логи сервера

```bash
# Просмотр логов PM2
pm2 logs shiki-server

# Просмотр логов PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-*.log
```

### Метрики

```bash
# Статус PM2 процессов
pm2 status

# Использование ресурсов
pm2 monit
```

## Дополнительная документация

- [Руководство разработчика](DEVELOPMENT.md) - подробная информация для разработчиков
- [API документация](API.md) - описание API endpoints
- [FAQ](FAQ.md) - часто задаваемые вопросы