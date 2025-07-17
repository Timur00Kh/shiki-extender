# Быстрый старт

## ⚡ Быстрая установка (5 минут)

### 1. Клонирование и установка зависимостей

```bash
git clone <repository-url>
cd shiki-extender
npm install
```

### 2. Настройка базы данных

```bash
# Создать БД PostgreSQL
sudo -u postgres psql -c "CREATE DATABASE shiki_extender;"
sudo -u postgres psql -c "CREATE USER shiki_user WITH PASSWORD 'password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE shiki_extender TO shiki_user;"

# Применить схему
psql -U shiki_user -d shiki_extender -f packages/server/db_backups/shiki_ex_public_altwatcher_link.sql
```

### 3. Настройка конфигурации

```bash
# Отредактировать конфигурацию БД
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
    password: 'password',
  }
};
```

### 4. Запуск сервера

```bash
npm run start:server
```

Сервер запустится на http://localhost:81

### 5. Сборка расширения

```bash
npm run build:extension
```

### 6. Установка в Chrome

1. Откройте `chrome://extensions/`
2. Включите "Режим разработчика"
3. Нажмите "Загрузить распакованное расширение"
4. Выберите папку `packages/extension/dist`

### 7. Проверка работы

1. Откройте https://shikimori.one
2. Перейдите на любую страницу аниме/манги
3. Должно появиться расширение для поиска

## 🛠️ Основные команды

```bash
# Управление проектом
npm run start:server        # Запуск сервера
npm run build:extension     # Сборка расширения
npm run dev:extension       # Разработка расширения
npm run build              # Сборка всех пакетов

# Управление версиями
node scripts/bump-version.js 1.0.1
node scripts/create-release.js 1.0.1
```

## 🔍 Тестирование

```bash
# Проверка API
curl "http://localhost:81/altWatcher/faq"
curl "http://localhost:81/altWatcher/link?anime=1"

# Проверка workspaces
npm ls --workspaces --depth=0
```

## 🚨 Решение проблем

### Сервер не запускается

```bash
# Проверить конфигурацию БД
cd packages/server
node -e "console.log(require('./config/db_config'))"

# Проверить подключение к БД
psql -U shiki_user -d shiki_extender -c "SELECT NOW();"
```

### Расширение не собирается

```bash
# Переустановить зависимости
npm install

# Или в конкретном пакете
cd packages/extension
npm install
npm run build
```

### Workspaces не работают

```bash
# Проверить версии
node --version  # Должно быть >= 14
npm --version   # Должно быть >= 7

# Обновить npm
npm install -g npm@latest
```

## 📚 Что дальше?

- **[Полная установка](INSTALL.md)** - Подробные инструкции
- **[Руководство разработчика](DEVELOPMENT.md)** - Архитектура и разработка
- **[API документация](API.md)** - Описание API
- **[FAQ](FAQ.md)** - Часто задаваемые вопросы

## 🎯 Основные особенности

### npm workspaces
Проект использует npm workspaces для управления зависимостями:
- `@shiki-extender/server` - Node.js сервер
- `@shiki-extender/extension` - Chrome расширение

### Современный стек
- **Backend:** Node.js + Express + PostgreSQL
- **Frontend:** Vue.js 3 + Webpack 5 + Bootstrap
- **Tooling:** ESLint, Babel, npm workspaces

### Удобная разработка
- Единая команда для установки зависимостей
- Централизованное управление версиями
- Простые скрипты для сборки и запуска

---

**Готово!** Теперь у вас работает полнофункциональное расширение для поиска аниме, манги и ранобе на Shikimori.
