# Shared Layer

Shared слой для Chrome extension с архитектурой Feature-Sliced Design.

## Структура

```
src/shared/
├── ui/           # Базовые UI компоненты
├── lib/          # Утилиты и хелперы
├── api/          # API методы и конфигурация
├── types/        # TypeScript типы и интерфейсы
└── index.ts      # Главный экспорт
```

## Компоненты

### UI Components (`ui/`)

#### BaseButton.vue
Универсальная кнопка с вариантами стилей и размеров.

```vue
<BaseButton 
  variant="primary" 
  size="medium"
  :loading="isLoading"
  @click="handleClick"
>
  Click me
</BaseButton>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
- `size`: 'small' | 'medium' | 'large'
- `disabled`: boolean
- `loading`: boolean

#### BaseToggle.vue
Переключатель с поддержкой v-model.

```vue
<BaseToggle 
  v-model="isEnabled"
  label="Enable feature"
  description="Toggle this feature on/off"
/>
```

**Props:**
- `modelValue`: boolean
- `label`: string
- `description`: string
- `disabled`: boolean

#### BaseModal.vue
Универсальный модальный компонент.

```vue
<BaseModal 
  v-model="isOpen"
  title="Modal Title"
  width="500px"
>
  <p>Modal content</p>
  
  <template #footer>
    <BaseButton @click="close">Close</BaseButton>
  </template>
</BaseModal>
```

**Props:**
- `modelValue`: boolean
- `title`: string
- `width`: string
- `height`: string
- `closeOnOverlay`: boolean
- `showCloseButton`: boolean

## Утилиты

### Storage (`lib/storage.ts`)

#### LocalStorage
```typescript
import { LocalStorage } from '@/shared/lib/storage'

// Сохранение данных
LocalStorage.setItem('key', { data: 'value' })

// Получение данных
const data = LocalStorage.getItem('key')

// Проверка доступности
if (LocalStorage.isAvailable()) {
  // localStorage доступен
}
```

#### IndexedDB
```typescript
import { IndexedDB } from '@/shared/lib/storage'

const db = new IndexedDB('myDatabase', 1)
await db.init()

// Добавление данных
await db.add('links', linkData)

// Получение данных
const links = await db.getAll('links')
```

#### ChromeStorage
```typescript
import { ChromeStorage } from '@/shared/lib/storage'

// Сохранение в Chrome storage
await ChromeStorage.setItem('key', data)

// Получение из Chrome storage
const data = await ChromeStorage.getItem('key')
```

### Colors (`lib/colors.ts`)

```typescript
import { 
  hexToRgb, 
  rgbToHex, 
  isValidHexColor,
  generateRandomColor,
  getContrastColor 
} from '@/shared/lib/colors'

// Конвертация цветов
const rgb = hexToRgb('#FF0000')
const hex = rgbToHex(255, 0, 0)

// Валидация
if (isValidHexColor('#FF0000')) {
  // Валидный hex цвет
}

// Генерация случайного цвета
const randomColor = generateRandomColor()

// Получение контрастного цвета
const contrastColor = getContrastColor('#FF0000')
```

### Validation (`lib/validation.ts`)

```typescript
import { 
  FormValidator, 
  CommonRules,
  validateLink 
} from '@/shared/lib/validation'

// Создание валидатора
const validator = new FormValidator()
  .addRule('email', CommonRules.email())
  .addRule('password', CommonRules.minLength(8))

// Валидация формы
const results = validator.validateForm(formData)

// Валидация ссылки
const linkValidation = validateLink(linkData)
```

### DOM (`lib/dom.ts`)

```typescript
import { DOMUtils } from '@/shared/lib/dom'

// Работа с элементами
const element = DOMUtils.getElement('.my-class')
DOMUtils.addClass(element, 'active')
DOMUtils.setValue(element, 'new value')

// Ожидание появления элемента
const element = await DOMUtils.waitForElement('.dynamic-element')

// Создание элемента
const newElement = DOMUtils.createElement('div', {
  class: 'my-div',
  id: 'unique-id'
}, ['Content'])
```

## API

### Configuration (`api/config.ts`)

```typescript
import { ConfigManager } from '@/shared/api/config'

const config = ConfigManager.getInstance()
const apiConfig = config.getApiConfig()
```

### AltWatcher API (`api/altWatcher.ts`)

```typescript
import { apiService } from '@/shared/api'

// Поиск аниме
const animeResults = await apiService.searchAnime({
  query: 'Naruto',
  limit: 20
})

// Получение аниме по ID
const anime = await apiService.getAnime(123)

// Поиск манги
const mangaResults = await apiService.searchManga({
  query: 'One Piece',
  status: 'ongoing'
})

// Получение профиля пользователя
const userProfile = await apiService.getUserProfile('username')
```

## Типы

### Основные интерфейсы

```typescript
import type { 
  Link, 
  LinkTag, 
  ModalState, 
  SearchParams 
} from '@/shared/types'

// Link - интерфейс для ссылок
interface Link {
  hash_id?: string
  id?: number
  title: string
  link: string
  description: string
  tags: LinkTag
  used?: number
  favicon?: string
  publish?: boolean
  action?: string
}

// LinkTag - типы контента
interface LinkTag {
  anime: number  // bitmap: 0=none, 1=rx, 2=normal, 3=both
  manga: number
  ranobe: number
}

// ModalState - состояние модального окна
interface ModalState {
  isOpen: boolean
  data: Link | null
  mode: 'create' | 'edit' | 'view'
}
```

## Использование

### Импорт компонентов

```vue
<script setup lang="ts">
import { BaseButton, BaseToggle, BaseModal } from '@/shared/ui'
import { LocalStorage, DOMUtils } from '@/shared/lib'
import { apiService } from '@/shared/api'
import type { Link } from '@/shared/types'
</script>
```

### Импорт утилит

```typescript
// Все утилиты
import * as SharedLib from '@/shared/lib'

// Конкретные утилиты
import { LocalStorage, DOMUtils, FormValidator } from '@/shared/lib'

// API
import { apiService, ConfigManager } from '@/shared/api'

// Типы
import type { Link, LinkTag, ModalState } from '@/shared/types'
```

## Совместимость

Все компоненты написаны с использованием:
- Vue 3 Composition API
- TypeScript
- Современные ES6+ возможности
- Совместимость с Chrome Extensions API

## Документация

Каждый файл содержит JSDoc комментарии для всех публичных методов и интерфейсов.