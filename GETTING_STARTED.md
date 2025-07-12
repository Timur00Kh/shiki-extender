# 🚀 Запуск GitHub Actions для Chrome расширения

## 📋 Что нужно сделать

### 1. Подготовка (5 минут)

```bash
# Убедитесь, что вы в корне проекта
pwd  # Должно показать путь к вашему проекту

# Проверьте, что у вас есть git репозиторий
git status

# Убедитесь, что ветка называется main или master
git branch
```

### 2. Установка зависимостей (2 минуты)

```bash
# Перейдите в папку с расширением
cd Chrome_extension/src

# Установите зависимости
npm install

# Проверьте, что сборка работает
npm run build
```

### 3. Первый коммит (3 минуты)

```bash
# Вернитесь в корень проекта
cd ../..

# Добавьте все новые файлы в git
git add .

# Создайте коммит
git commit -m "Setup GitHub Actions for Chrome extension

- Added automated build and release workflows
- Added code quality checks with ESLint
- Added version management scripts
- Added Chrome Web Store integration"

# Запушьте изменения
git push origin main
```

### 4. Проверка (2 минуты)

1. Перейдите в ваш репозиторий на GitHub
2. Откройте вкладку **Actions**
3. Вы должны увидеть запущенный workflow "Build and Release Chrome Extension"
4. Дождитесь завершения (зеленые галочки ✅)

### 5. Создание первого релиза (3 минуты)

```bash
# Обновите версию
npm run bump-version 1.0.3

# Создайте релиз
npm run create-release 1.0.3
```

## ✅ Что произойдет

### При первом push:

1. **GitHub Actions запустится автоматически**
2. **Установятся зависимости** (Node.js, npm пакеты)
3. **Соберется расширение** (webpack)
4. **Создастся ZIP архив** для загрузки
5. **Создастся GitHub Release** с тегом версии

### При создании релиза:

1. **Обновится версия** в manifest.json и package.json
2. **Создастся git тег** v1.0.3
3. **Соберется расширение** заново
4. **Создастся ZIP архив** с новой версией
5. **Опубликуется релиз** на GitHub

## 🔧 Настройка Chrome Web Store (опционально)

Если хотите автоматически публиковать в Chrome Web Store:

### 1. Получите API ключи (10 минут)

1. Перейдите на https://console.cloud.google.com/
2. Создайте новый проект
3. Включите Chrome Web Store API
4. Создайте OAuth2 credentials
5. Получите Refresh Token через OAuth Playground

### 2. Добавьте секреты в GitHub (5 минут)

1. Перейдите в ваш репозиторий → Settings → Secrets and variables → Actions
2. Добавьте секреты:
   - `EXTENSION_ID` - ID вашего расширения
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

## 🐛 Возможные проблемы

### Workflow не запускается
```bash
# Проверьте статус git
git status

# Убедитесь, что все файлы добавлены
git add .

# Проверьте название ветки
git branch  # Должно быть main или master
```

### Ошибка сборки
```bash
# Проверьте версию Node.js
node --version  # Должна быть 18+

# Очистите кэш
npm cache clean --force

# Переустановите зависимости
rm -rf node_modules package-lock.json
npm install
```

### ESLint ошибки
```bash
# Автоисправление
npm run lint:fix

# Или установите ESLint
npm install eslint --save-dev
```

## 📚 Полезные команды

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

## 🎯 Следующие шаги

После успешного первого запуска:

1. **Настройте Chrome Web Store API** (если нужно)
2. **Добавьте тесты** для улучшения качества
3. **Настройте уведомления** о статусе сборки
4. **Добавьте changelog** для каждого релиза
5. **Настройте мониторинг** производительности

## 📖 Документация

- `README_GITHUB_ACTIONS.md` - Обзор системы
- `QUICK_START.md` - Быстрый старт
- `docs/GITHUB_ACTIONS_SETUP.md` - Подробная настройка
- `DEPLOYMENT.md` - Инструкции по деплою
- `FIRST_RUN.md` - Первый запуск
- `SUMMARY.md` - Итоговый обзор

## 🤝 Поддержка

Если у вас возникли проблемы:

1. Проверьте логи в GitHub Actions
2. Изучите документацию в папке `docs/`
3. Проверьте troubleshooting секции
4. Создайте issue в репозитории

---

**🎉 Готово!** Ваше Chrome расширение теперь автоматически собирается и публикуется при каждом push в main ветку.

**Время настройки:** ~15 минут  
**Автоматизация:** 100%  
**Качество кода:** ✅ Проверяется  
**Публикация:** 🚀 Автоматическая