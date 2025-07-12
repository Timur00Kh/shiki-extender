# 🚀 GitHub Actions для Chrome расширения

Полная настройка автоматической сборки, тестирования и публикации Chrome расширения через GitHub Actions.

## ✅ Что настроено

### 🔄 Автоматические процессы

- **Сборка при push** в main/master ветку
- **Создание релизов** с ZIP архивами
- **Проверка качества кода** (ESLint, security audit)
- **Валидация manifest.json**
- **Автоматическое обновление версии** при создании тегов
- **Публикация в Chrome Web Store** (опционально)

### 📁 Структура файлов

```
.github/workflows/
├── build-and-release.yml    # Основной workflow
├── code-quality.yml         # Проверка качества
├── version-bump.yml         # Обновление версии
└── publish-to-store.yml     # Публикация в Chrome Web Store

scripts/
├── bump-version.js          # Скрипт обновления версии
└── create-release.js        # Скрипт создания релиза

docs/
└── GITHUB_ACTIONS_SETUP.md # Подробная документация

Chrome_extension/src/
├── .eslintrc.js            # Конфигурация ESLint
└── package.json            # Обновленные скрипты
```

## 🚀 Быстрый старт

### 1. Первый запуск

```bash
# Установите зависимости
cd Chrome_extension/src
npm install

# Соберите расширение
npm run build

# Запушьте изменения
git add .
git commit -m "Setup GitHub Actions"
git push origin main
```

### 2. Проверка

1. Перейдите в ваш репозиторий на GitHub
2. Откройте вкладку **Actions**
3. Убедитесь, что workflow запустился успешно

### 3. Создание релиза

```bash
# Обновите версию
npm run bump-version 1.0.3

# Создайте релиз
npm run create-release 1.0.3
```

## 📋 Workflows

### 1. Build and Release (`build-and-release.yml`)

**Триггеры:** Push в main/master, Pull Request, Release

**Что делает:**
- Устанавливает Node.js 18
- Устанавливает зависимости
- Собирает расширение
- Создает ZIP архив
- Загружает артефакты
- Создает GitHub Release

### 2. Code Quality (`code-quality.yml`)

**Триггеры:** Push в main/master/develop, Pull Request

**Что делает:**
- Запускает ESLint
- Проверяет security vulnerabilities
- Валидирует manifest.json
- Проверяет сборку
- Запускает тесты (если настроены)

### 3. Version Bump (`version-bump.yml`)

**Триггеры:** Push тега с версией (v*)

**Что делает:**
- Обновляет версию в manifest.json
- Обновляет версию в package.json
- Коммитит изменения

### 4. Publish to Chrome Web Store (`publish-to-store.yml`)

**Триггеры:** Публикация GitHub Release

**Что делает:**
- Собирает расширение
- Публикует в Chrome Web Store
- Требует настройки секретов

## 🛠️ Полезные команды

```bash
# Разработка
npm run watch          # Сборка в режиме разработки
npm run dev            # Запуск dev сервера

# Сборка
npm run build          # Продакшен сборка
npm run package        # Создание ZIP архива
npm run clean          # Очистка

# Качество кода
npm run lint           # Проверка ESLint
npm run lint:fix       # Автоисправление

# Управление версиями
npm run bump-version   # Обновление версии
npm run create-release # Создание релиза
```

## 🔧 Настройка Chrome Web Store

### 1. Получение API ключей

1. Создайте проект в [Google Cloud Console](https://console.cloud.google.com/)
2. Включите Chrome Web Store API
3. Создайте OAuth2 credentials
4. Получите Refresh Token через [OAuth Playground](https://developers.google.com/oauthplayground/)

### 2. Добавление секретов

В Settings → Secrets and variables → Actions добавьте:

- `EXTENSION_ID` - ID расширения в Chrome Web Store
- `CLIENT_ID` - Client ID из Google Cloud Console
- `CLIENT_SECRET` - Client Secret из Google Cloud Console
- `REFRESH_TOKEN` - Refresh Token для OAuth2

## 📊 Мониторинг

### GitHub Actions

- Проверяйте вкладку Actions после каждого push
- Настройте уведомления о статусе сборки
- Используйте `gh run list` для мониторинга

### Chrome Web Store

- Отслеживайте статистику в Chrome Developer Dashboard
- Настройте уведомления о новых отзывах
- Регулярно проверяйте отчеты о сбоях

## 🐛 Troubleshooting

### Ошибки сборки

```bash
# Проверьте версию Node.js
node --version  # Должна быть 18+

# Очистите кэш
npm cache clean --force

# Переустановите зависимости
rm -rf node_modules package-lock.json
npm install
```

### GitHub Actions не запускаются

1. Проверьте, что файлы в `.github/workflows/` добавлены в git
2. Убедитесь, что ветка называется `main` или `master`
3. Проверьте вкладку Actions в репозитории

### Проблемы с Chrome Web Store

1. Убедитесь, что все секреты правильно настроены
2. Проверьте, что Chrome Web Store API включен
3. Убедитесь, что Refresh Token не истек

## 📚 Документация

- [QUICK_START.md](QUICK_START.md) - Быстрый старт
- [docs/GITHUB_ACTIONS_SETUP.md](docs/GITHUB_ACTIONS_SETUP.md) - Подробная настройка
- [DEPLOYMENT.md](DEPLOYMENT.md) - Инструкции по деплою

## 🎯 Следующие шаги

1. **Настройте Chrome Web Store API** для автоматической публикации
2. **Добавьте тесты** для улучшения качества кода
3. **Настройте уведомления** о статусе сборки
4. **Добавьте changelog** для каждого релиза
5. **Настройте мониторинг** производительности расширения

## 🤝 Поддержка

Если у вас возникли проблемы:

1. Проверьте [Troubleshooting](#-troubleshooting)
2. Изучите логи в GitHub Actions
3. Проверьте документацию в папке `docs/`
4. Создайте issue в репозитории

---

**🎉 Готово!** Ваше Chrome расширение теперь автоматически собирается и публикуется при каждом push в main ветку.