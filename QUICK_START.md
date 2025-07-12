# 🚀 Быстрый старт с GitHub Actions

## Что уже настроено

✅ **Автоматическая сборка** при push в main/master  
✅ **Создание релизов** с ZIP архивами  
✅ **Проверка качества кода**  
✅ **Валидация manifest.json**  
✅ **Скрипты для управления версиями**  

## Первые шаги

### 1. Запустите первый билд

```bash
# Перейдите в папку с расширением
cd Chrome_extension/src

# Установите зависимости
npm install

# Соберите расширение
npm run build

# Создайте пакет для загрузки
npm run package
```

### 2. Запушьте изменения

```bash
git add .
git commit -m "Initial setup with GitHub Actions"
git push origin main
```

### 3. Проверьте GitHub Actions

Перейдите в ваш репозиторий на GitHub → Actions и убедитесь, что workflow запустился успешно.

## Управление версиями

### Автоматическое обновление версии

```bash
# Обновить версию в manifest.json и package.json
npm run bump-version 1.0.3

# Создать релиз с тегом
npm run create-release 1.0.3
```

### Ручное создание релиза

```bash
# 1. Обновите версию
npm run bump-version 1.0.3

# 2. Закоммитьте изменения
git add .
git commit -m "Bump version to 1.0.3"

# 3. Создайте тег
git tag v1.0.3

# 4. Запушьте
git push origin main --tags
```

## Полезные команды

```bash
# Сборка для разработки
npm run watch

# Сборка для продакшена
npm run build

# Создание ZIP архива
npm run package

# Очистка
npm run clean

# Запуск dev сервера
npm run dev
```

## Настройка Chrome Web Store (опционально)

Если хотите автоматически публиковать в Chrome Web Store:

1. Следуйте инструкциям в `docs/GITHUB_ACTIONS_SETUP.md`
2. Добавьте секреты в Settings → Secrets and variables → Actions
3. При создании релиза расширение автоматически опубликуется

## Структура файлов

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
```

## Что происходит при push в main

1. 🔄 Запускается сборка
2. ✅ Проверяется качество кода
3. 📦 Создается ZIP архив
4. 🏷️ Создается GitHub Release
5. 📤 Загружается в Chrome Web Store (если настроено)

## Troubleshooting

### Ошибка сборки
```bash
# Очистите кэш
npm cache clean --force

# Переустановите зависимости
rm -rf node_modules package-lock.json
npm install
```

### Проблемы с webpack
```bash
# Проверьте версию Node.js
node --version  # Должна быть 18+

# Пересоберите проект
npm run clean
npm run build
```

### GitHub Actions не запускаются
1. Проверьте, что файлы в `.github/workflows/` добавлены в git
2. Убедитесь, что ветка называется `main` или `master`
3. Проверьте вкладку Actions в репозитории

## Следующие шаги

1. 📖 Прочитайте полную документацию в `docs/GITHUB_ACTIONS_SETUP.md`
2. 🔧 Настройте секреты для Chrome Web Store (опционально)
3. 🧪 Добавьте тесты в проект
4. 📝 Настройте ESLint для лучшего качества кода