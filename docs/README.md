# Документация Shiki Extender

Добро пожаловать в документацию Shiki Extender - расширения для Chrome и Node.js сервера для быстрого поиска аниме, манги и ранобе на Shikimori.

## 📚 Содержание

### 🚀 Начало работы
- **[Быстрый старт](quick-start.md)** - Начните здесь! Быстрая установка и настройка
- **[Установка](INSTALL.md)** - Подробные инструкции по установке
- **[FAQ](FAQ.md)** - Часто задаваемые вопросы

### 🔧 Разработка
- **[Руководство разработчика](DEVELOPMENT.md)** - Архитектура и разработка
- **[API документация](API.md)** - Полное описание API endpoints
- **[Устранение неполадок](troubleshooting.md)** - Решение проблем

### 📖 Дополнительно
- **[Миграция в monorepo](migration.md)** - Переход на новую структуру
- **[Развертывание](deployment.md)** - Продакшн развертывание
- **[Вклад в проект](contributing.md)** - Как участвовать в разработке

## 🏗️ Архитектура проекта

```
shiki-extender/
├── packages/
│   ├── extension/          # Chrome расширение
│   │   ├── src/           # Vue.js + Webpack
│   │   ├── dist/          # Собранные файлы
│   │   └── package.json
│   └── server/            # Node.js сервер
│       ├── modules/       # API модули
│       ├── config/        # Конфигурация
│       └── package.json
├── scripts/               # Скрипты управления
├── docs/                  # Документация
└── package.json          # npm workspaces
```

## ⚡ Быстрый старт

1. **Клонирование и установка:**
   ```bash
   git clone <repository-url>
   cd shiki-extender
   npm install
   ```

2. **Настройка базы данных:**
   ```bash
   # Создать БД PostgreSQL
   # Настроить packages/server/config/db_config.js
   ```

3. **Запуск сервера:**
   ```bash
   npm run start:server
   ```

4. **Сборка расширения:**
   ```bash
   npm run build:extension
   ```

5. **Загрузка в Chrome:**
   - Откройте `chrome://extensions/`
   - Включите режим разработчика
   - Загрузите `packages/extension/dist`

## 🛠️ Основные команды

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

# Управление версиями
node scripts/bump-version.js 1.0.1
```

## 🔍 Основные функции

### Chrome расширение:
- Быстрый поиск аниме/манги на различных сайтах
- Добавление пользовательских ссылок
- Публикация ссылок для сообщества
- Фильтрация по типам контента

### Node.js сервер:
- REST API для управления ссылками
- PostgreSQL для хранения данных
- Система одобрения ссылок
- Статистика использования

## 📊 Переменные в URL

- `{{title}}` - название тайтла
- `{{id}}` - ID в Shikimori
- `{{episode}}` - следующий эпизод
- `{{title=encoding}}` - название с кодировкой

Пример: `https://example.com/search?q={{title=windows-1251}}`

## 🌐 API Endpoints

- `GET /altWatcher/link` - Поиск ссылок
- `POST /altWatcher/link` - Добавление ссылки
- `GET /altWatcher/defaultLinks` - Ссылки по умолчанию
- `GET /altWatcher/faq` - FAQ

Подробности в [API документации](API.md).

## 🔧 Требования

- **Node.js** 14+ (для npm workspaces)
- **npm** 7+ (для workspaces)
- **PostgreSQL** 10+
- **Chrome** 80+

## 📞 Поддержка

- **Группа ВК:** https://vk.com/shiki_ex
- **GitHub Issues:** для багов и предложений
- **Telegram:** https://t.me/Timur00Blog

## 📜 Лицензия

MIT License - подробности в файле [LICENSE](../LICENSE).

## 🤝 Участие в проекте

1. Форк репозитория
2. Создание feature branch
3. Внесение изменений
4. Создание Pull Request

См. [руководство по участию](contributing.md) для подробностей.

---

**Начните с [быстрого старта](quick-start.md) или [полной установки](INSTALL.md)!**
