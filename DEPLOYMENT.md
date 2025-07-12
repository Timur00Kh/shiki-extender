# 🚀 Инструкции по деплою Chrome расширения

## Автоматический деплой через GitHub Actions

### 1. Первый запуск

```bash
# Убедитесь, что все файлы добавлены в git
git add .
git commit -m "Setup GitHub Actions for Chrome extension"
git push origin main
```

### 2. Проверка workflow

1. Перейдите в ваш репозиторий на GitHub
2. Откройте вкладку **Actions**
3. Убедитесь, что workflow `Build and Release Chrome Extension` запустился
4. Проверьте, что все шаги выполнились успешно

### 3. Создание первого релиза

```bash
# Обновите версию
npm run bump-version 1.0.3

# Создайте релиз
npm run create-release 1.0.3
```

## Ручной деплой

### 1. Сборка расширения

```bash
cd Chrome_extension/src
npm install
npm run build
```

### 2. Создание пакета

```bash
# Создать ZIP архив
npm run package

# Или вручную
cd ../dist
zip -r ../shiki-extension.zip . -x "*.map"
```

### 3. Загрузка в Chrome Web Store

1. Перейдите на [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Создайте новый элемент или обновите существующий
3. Загрузите ZIP файл `shiki-extension.zip`
4. Заполните описание, скриншоты и другую информацию
5. Опубликуйте расширение

## Тестирование перед деплоем

### 1. Локальное тестирование

```bash
# Соберите расширение
npm run build

# Загрузите в Chrome для тестирования
# 1. Откройте chrome://extensions/
# 2. Включите "Developer mode"
# 3. Нажмите "Load unpacked"
# 4. Выберите папку Chrome_extension/dist
```

### 2. Проверка качества кода

```bash
# Запустите линтер
npm run lint

# Исправьте ошибки автоматически
npm run lint:fix
```

### 3. Проверка сборки

```bash
# Очистите и пересоберите
npm run clean
npm run build

# Проверьте содержимое dist/
ls -la ../dist/
```

## Настройка автоматической публикации в Chrome Web Store

### 1. Получение API ключей

1. **Создайте проект в Google Cloud Console:**
   - Перейдите на https://console.cloud.google.com/
   - Создайте новый проект
   - Включите Chrome Web Store API

2. **Создайте OAuth2 credentials:**
   - В разделе "APIs & Services" → "Credentials"
   - Создайте OAuth 2.0 Client ID
   - Тип: Web application
   - Авторизованные URI перенаправления: `https://developers.google.com/oauthplayground`

3. **Получите Refresh Token:**
   - Перейдите на https://developers.google.com/oauthplayground/
   - В настройках введите ваш Client ID и Client Secret
   - Выберите "Chrome Web Store API v1"
   - Нажмите "Authorize APIs" → "Exchange authorization code for tokens"
   - Скопируйте Refresh Token

### 2. Добавление секретов в GitHub

1. Перейдите в ваш репозиторий → Settings → Secrets and variables → Actions
2. Добавьте следующие секреты:
   - `EXTENSION_ID` - ID вашего расширения в Chrome Web Store
   - `CLIENT_ID` - Client ID из Google Cloud Console
   - `CLIENT_SECRET` - Client Secret из Google Cloud Console
   - `REFRESH_TOKEN` - Refresh Token для OAuth2

### 3. Активация автоматической публикации

После настройки секретов, при создании GitHub Release расширение автоматически опубликуется в Chrome Web Store.

## Troubleshooting

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

### Проблемы с webpack

```bash
# Проверьте конфигурацию
cat webpack.config.js

# Запустите в режиме разработки
npm run watch
```

### Ошибки в Chrome Web Store

1. **Manifest validation failed:**
   - Проверьте `manifest.json` на соответствие Manifest V3
   - Убедитесь, что все обязательные поля заполнены

2. **Extension package is invalid:**
   - Убедитесь, что ZIP файл содержит все необходимые файлы
   - Проверьте, что `manifest.json` находится в корне архива

3. **API errors:**
   - Проверьте правильность секретов в GitHub
   - Убедитесь, что Chrome Web Store API включен в Google Cloud Console

### GitHub Actions не запускаются

1. Проверьте, что файлы в `.github/workflows/` добавлены в git
2. Убедитесь, что ветка называется `main` или `master`
3. Проверьте вкладку Actions в репозитории
4. Убедитесь, что у репозитория есть права на создание релизов

## Мониторинг

### GitHub Actions

- Проверяйте вкладку Actions после каждого push
- Настройте уведомления о статусе сборки
- Используйте GitHub CLI для мониторинга: `gh run list`

### Chrome Web Store

- Отслеживайте статистику в Chrome Developer Dashboard
- Настройте уведомления о новых отзывах
- Регулярно проверяйте отчеты о сбоях

## Лучшие практики

### Версионирование

- Используйте семантическое версионирование (MAJOR.MINOR.PATCH)
- Обновляйте версию при каждом значительном изменении
- Ведите changelog для каждого релиза

### Тестирование

- Тестируйте расширение на разных версиях Chrome
- Проверяйте совместимость с различными сайтами
- Используйте автоматические тесты

### Безопасность

- Регулярно обновляйте зависимости
- Проверяйте код на уязвимости
- Используйте минимальные необходимые разрешения

### Производительность

- Оптимизируйте размер бандла
- Используйте lazy loading где возможно
- Минимизируйте количество запросов к API