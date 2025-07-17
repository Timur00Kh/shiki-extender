# Миграция в monorepo

## Что изменилось

### Старая структура
```
shiki-extender/
├── Chrome_extension/
│   └── src/
│       ├── package.json
│       ├── webpack.config.js
│       └── ...
├── NodeServer/
│   ├── package.json
│   ├── shiki_ex_server.js
│   └── modules/
└── scripts/
```

### Новая структура (monorepo)
```
shiki-extender/
├── packages/
│   ├── extension/          # Chrome_extension → packages/extension
│   │   ├── src/           # Исходный код
│   │   ├── dist/          # Собранные файлы
│   │   ├── package.json   # @shiki-extender/extension
│   │   └── webpack.config.js
│   └── server/            # NodeServer → packages/server
│       ├── config/        # Конфигурация БД
│       ├── modules/       # API модули
│       ├── package.json   # @shiki-extender/server
│       └── shiki_ex_server.js
├── scripts/               # Обновленные скрипты
├── docs/                  # Структурированная документация
└── package.json          # npm workspaces
```

## Преимущества новой структуры

### ✅ npm workspaces
- Единая команда для установки зависимостей
- Централизованное управление версиями
- Автоматическое разрешение зависимостей между пакетами

### ✅ Улучшенная структура
- Четкое разделение frontend и backend
- Лучшая организация кода
- Упрощенная навигация

### ✅ Удобная разработка
- Простые команды для сборки и запуска
- Централизованные скрипты
- Унифицированная документация

## Изменения в командах

### Установка зависимостей

**Старые команды:**
```bash
# Сервер
cd NodeServer
npm install

# Расширение
cd Chrome_extension/src
npm install
```

**Новые команды:**
```bash
# Все пакеты одной командой
npm install
```

### Запуск и сборка

**Старые команды:**
```bash
# Сервер
cd NodeServer
npm start

# Расширение
cd Chrome_extension/src
npm run build
```

**Новые команды:**
```bash
# Из корня проекта
npm run start:server
npm run build:extension

# Или напрямую
cd packages/server && npm start
cd packages/extension && npm run build
```

### Управление версиями

**Старые команды:**
```bash
# Ручное обновление каждого package.json
# Ручное обновление manifest.json
```

**Новые команды:**
```bash
# Обновление всех пакетов одной командой
node scripts/bump-version.js 1.0.1
node scripts/create-release.js 1.0.1
```

## Изменения в путях

### Пути в конфигурации

**Старые пути:**
```javascript
// altWatcher.js
require('../../config/db_config')
```

**Новые пути:**
```javascript
// altWatcher.js
require('../config/db_config')
```

### Пути в webpack

**Старая конфигурация:**
```javascript
// webpack.config.js
entry: {
  'js/main': path.join(__dirname, 'options', 'options.js'),
}
output: {
  path: path.resolve('../dist')
}
```

**Новая конфигурация:**
```javascript
// webpack.config.js
entry: {
  'js/main': path.join(__dirname, 'src', 'options', 'options.js'),
}
output: {
  path: path.resolve(__dirname, 'dist')
}
```

### Пути в скриптах

**Старые пути:**
```javascript
// scripts/bump-version.js
const srcDir = path.join(__dirname, '..', 'Chrome_extension', 'src');
const manifestPath = path.join(srcDir, 'manifest.json');
```

**Новые пути:**
```javascript
// scripts/bump-version.js
const extensionDir = path.join(__dirname, '..', 'packages', 'extension');
const manifestPath = path.join(extensionDir, 'src', 'manifest.json');
```

## Совместимость

### Обратная совместимость
- API endpoints остались те же
- Функциональность не изменилась
- Manifest.json остался совместим

### Что может сломаться
- Локальные ссылки на старые пути
- Кастомные скрипты сборки
- IDE конфигурации

## Миграция существующего проекта

### 1. Резервное копирование
```bash
# Создать резервную копию
cp -r shiki-extender shiki-extender-backup
```

### 2. Обновление Git
```bash
# Получить последние изменения
git pull origin main

# Или переключиться на monorepo ветку
git checkout monorepo
git pull origin monorepo
```

### 3. Переустановка зависимостей
```bash
# Очистить старые зависимости
rm -rf Chrome_extension/src/node_modules
rm -rf NodeServer/node_modules
rm -rf node_modules

# Установить новые зависимости
npm install
```

### 4. Обновление конфигурации
```bash
# Обновить конфигурацию БД
cp packages/server/config/db_config.js.example packages/server/config/db_config.js
# Отредактировать своими настройками
```

### 5. Тестирование
```bash
# Проверить сборку
npm run build

# Проверить сервер
npm run start:server

# Проверить расширение
npm run build:extension
```

## Устранение проблем миграции

### Проблема: "workspaces not supported"
```bash
# Обновить Node.js и npm
node --version  # Должно быть >= 14
npm --version   # Должно быть >= 7

# Обновить npm
npm install -g npm@latest
```

### Проблема: "Cannot find module"
```bash
# Переустановить зависимости
npm install

# Или очистить кэш
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Проблема: "Path not found"
```bash
# Проверить структуру
ls -la packages/
ls -la packages/extension/
ls -la packages/server/

# Проверить конфигурацию
cat packages/server/config/db_config.js
```

### Проблема: "Webpack build fails"
```bash
# Проверить пути в webpack.config.js
cd packages/extension
cat webpack.config.js

# Переустановить зависимости extension
npm install
npm run build
```

## Откат на старую версию

Если что-то пошло не так, можно временно откатиться:

### 1. Вернуться к старой ветке
```bash
git checkout previous-version
# или
git checkout <commit-hash>
```

### 2. Восстановить зависимости
```bash
cd Chrome_extension/src
npm install

cd ../../NodeServer
npm install
```

### 3. Запустить в старом режиме
```bash
# Сервер
cd NodeServer
npm start

# Расширение
cd Chrome_extension/src
npm run build
```

## Преимущества после миграции

### ✅ Упрощенная разработка
- Одна команда для установки зависимостей
- Единый точка входа для всех команд
- Централизованное управление версиями

### ✅ Лучшая организация
- Четкое разделение пакетов
- Структурированная документация
- Упрощенная навигация по проекту

### ✅ Современный стек
- npm workspaces
- Централизованные скрипты
- Единая конфигурация

### ✅ Удобное обновление
- Автоматическое обновление версий
- Синхронизация между пакетами
- Упрощенное создание релизов

## Поддержка

Если у вас возникли проблемы с миграцией:

1. Проверьте [FAQ](FAQ.md)
2. Изучите [документацию по установке](INSTALL.md)
3. Создайте issue в репозитории
4. Обратитесь в группу ВК: https://vk.com/shiki_ex

---

**Добро пожаловать в новую структуру monorepo!** 🎉
