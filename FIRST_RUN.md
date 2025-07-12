# 🚀 Первый запуск GitHub Actions

## Шаг 1: Подготовка

Убедитесь, что у вас есть:
- ✅ Git репозиторий на GitHub
- ✅ Node.js 18+ установлен
- ✅ Доступ к репозиторию с правами на создание релизов

## Шаг 2: Установка зависимостей

```bash
# Перейдите в папку с расширением
cd Chrome_extension/src

# Установите зависимости
npm install

# Проверьте, что все работает
npm run build
```

## Шаг 3: Первый коммит

```bash
# Вернитесь в корень проекта
cd ../..

# Добавьте все файлы в git
git add .

# Создайте первый коммит
git commit -m "Setup GitHub Actions for Chrome extension

- Added GitHub Actions workflows
- Added build and release automation
- Added code quality checks
- Added version management scripts"

# Запушьте изменения
git push origin main
```

## Шаг 4: Проверка GitHub Actions

1. Перейдите в ваш репозиторий на GitHub
2. Откройте вкладку **Actions**
3. Вы должны увидеть запущенный workflow "Build and Release Chrome Extension"
4. Дождитесь завершения всех шагов (должно быть ✅ зеленые галочки)

## Шаг 5: Создание первого релиза

```bash
# Обновите версию (если нужно)
npm run bump-version 1.0.3

# Создайте релиз
npm run create-release 1.0.3
```

## Шаг 6: Проверка релиза

1. Перейдите в ваш репозиторий → Releases
2. Вы должны увидеть новый релиз v1.0.3
3. Скачайте ZIP файл и проверьте его содержимое

## Что происходит при первом запуске

### 🔄 Workflow "Build and Release Chrome Extension"

1. **Checkout code** - Клонирует ваш репозиторий
2. **Setup Node.js** - Устанавливает Node.js 18
3. **Install dependencies** - Устанавливает npm пакеты
4. **Build extension** - Собирает расширение через webpack
5. **Create extension package** - Создает ZIP архив
6. **Upload build artifacts** - Загружает артефакты
7. **Create Release** - Создает GitHub Release (только при push в main)

### ✅ Workflow "Code Quality Check"

1. **Lint** - Проверяет код через ESLint
2. **Security audit** - Проверяет уязвимости
3. **Validate manifest.json** - Проверяет корректность manifest
4. **Check build process** - Проверяет сборку
5. **Verify build output** - Проверяет выходные файлы

## Возможные проблемы

### ❌ Workflow не запускается

**Причина:** Файлы не добавлены в git или неправильная ветка

**Решение:**
```bash
# Проверьте статус git
git status

# Убедитесь, что все файлы добавлены
git add .

# Проверьте название ветки
git branch

# Должно быть main или master
```

### ❌ Ошибка сборки

**Причина:** Проблемы с зависимостями или Node.js версией

**Решение:**
```bash
# Проверьте версию Node.js
node --version  # Должна быть 18+

# Очистите кэш
npm cache clean --force

# Переустановите зависимости
rm -rf node_modules package-lock.json
npm install
```

### ❌ Ошибка ESLint

**Причина:** ESLint не настроен или есть ошибки в коде

**Решение:**
```bash
# Установите ESLint
npm install eslint --save-dev

# Запустите линтер
npm run lint

# Автоисправление
npm run lint:fix
```

### ❌ Ошибка создания релиза

**Причина:** Недостаточно прав или неправильная конфигурация

**Решение:**
1. Проверьте права репозитория в Settings → Actions → General
2. Убедитесь, что "Workflow permissions" установлены в "Read and write permissions"
3. Проверьте, что "Allow GitHub Actions to create and approve pull requests" включено

## Проверка работоспособности

### ✅ Успешный запуск

Если все работает правильно, вы увидите:

1. **В GitHub Actions:**
   - ✅ Все шаги завершились успешно
   - 📦 Создан ZIP архив
   - 🏷️ Создан GitHub Release

2. **В Releases:**
   - Новый релиз с тегом версии
   - ZIP файл для загрузки
   - Описание релиза

3. **В коде:**
   - Версия обновлена в manifest.json и package.json
   - Создан git тег

## Следующие шаги

После успешного первого запуска:

1. **Настройте Chrome Web Store API** (опционально)
   - Следуйте инструкциям в `docs/GITHUB_ACTIONS_SETUP.md`

2. **Добавьте тесты**
   - Создайте папку `tests/`
   - Настройте Jest или другой тестовый фреймворк

3. **Настройте уведомления**
   - В Settings → Notifications включите уведомления о Actions

4. **Добавьте changelog**
   - Создайте CHANGELOG.md
   - Ведите историю изменений

## Полезные команды для отладки

```bash
# Проверка локальной сборки
npm run build

# Проверка линтера
npm run lint

# Создание пакета
npm run package

# Очистка
npm run clean

# Проверка git статуса
git status
git log --oneline -5
```

## Поддержка

Если у вас возникли проблемы:

1. Проверьте логи в GitHub Actions
2. Изучите документацию в `docs/`
3. Проверьте [Troubleshooting](#возможные-проблемы)
4. Создайте issue в репозитории

---

**🎉 Поздравляем!** Ваше Chrome расширение теперь автоматически собирается и публикуется при каждом push в main ветку.