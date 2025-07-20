# Рефакторинг AltWatcher.vue

## Проблема
Оригинальный компонент `AltWatcher.vue` содержал 589 строк кода с множественной ответственностью, что затрудняло поддержку и тестирование.

## Решение
Разбил монолитный компонент на мелкие компоненты и composables, следуя принципам Clean Architecture.

## Новая архитектура

### Entities (src/entities/link/model/)
- **types.ts** - TypeScript интерфейсы
- **useLinksDatabase.ts** - работа с IndexedDB
- **useLinkCRUD.ts** - CRUD операции со ссылками
- **useColorPicker.ts** - утилита для цветовой палитры

### Features (src/features/link-management/model/)
- **useLinkModal.ts** - управление модальным окном

### Widgets (src/widgets/link-dashboard/ui/)
- **TabNavigation.vue** - навигация по табам
- **StatsProgressBar.vue** - статистика использования
- **LinksList.vue** - список ссылок
- **LinkCard.vue** - карточка одной ссылки
- **LinkModal.vue** - модал редактирования

## Преимущества новой архитектуры

1. **Разделение ответственности** - каждый компонент отвечает за одну функцию
2. **Переиспользование** - composables можно использовать в других компонентах
3. **Тестируемость** - мелкие компоненты легче тестировать
4. **Читаемость** - код стал более понятным и структурированным
5. **TypeScript** - строгая типизация во всех компонентах

## Использование

```vue
<template>
  <div>
    <TabNavigation :current="current" @update:current="current = $event" />
    <LinksList :links="links" @edit="showModal" />
    <LinkModal :modal="modal" @save="saveLink" />
  </div>
</template>

<script setup>
import { useLinksDatabase, useLinkCRUD } from '@/entities/link/model';
import { useLinkModal } from '@/features/link-management/model';
import { LinksList, LinkModal } from '@/widgets/link-dashboard/ui';

const { links, loading } = useLinksDatabase();
const { saveLink } = useLinkCRUD(database, links);
const { modal, openModal } = useLinkModal();
</script>
```

## Миграция
Для использования нового рефакторенного компонента замените импорт:
```javascript
// Старый
import AltWatcher from './AltWatcher.vue';

// Новый
import AltWatcher from './AltWatcherRefactored.vue';
```

## Структура файлов
```
src/
├── entities/
│   └── link/
│       └── model/
│           ├── types.ts
│           ├── useLinksDatabase.ts
│           ├── useLinkCRUD.ts
│           ├── useColorPicker.ts
│           └── index.ts
├── features/
│   └── link-management/
│       └── model/
│           ├── useLinkModal.ts
│           └── index.ts
├── widgets/
│   └── link-dashboard/
│       └── ui/
│           ├── TabNavigation.vue
│           ├── StatsProgressBar.vue
│           ├── LinksList.vue
│           ├── LinkCard.vue
│           ├── LinkModal.vue
│           └── index.ts
└── options/
    └── pages/
        └── AltWatcher/
            ├── AltWatcher.vue (оригинал)
            ├── AltWatcherRefactored.vue (новый)
            └── REFACTORING.md
```