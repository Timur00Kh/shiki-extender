<template>
  <ul class="nav nav-pills nav-fill">
    <li class="nav-item pr-1">
      <a 
        @click="$emit('update:current', 'added')" 
        :class="'nav-link ' + (current === 'added' ? 'active' : 'bg-light')"
        href="#/altWatcher"
      >
        Добавленное
      </a>
    </li>
    <li class="nav-item px-1">
      <a 
        @click="$emit('update:current', 'search')" 
        :class="'nav-link ' + (current === 'search' ? 'active' : 'bg-light')"
        href="#/altWatcher"
      >
        Поиск
      </a>
    </li>
    <li class="nav-item pl-1">
      <a 
        @click="$emit('update:current', 'faq')" 
        :class="'nav-link ' + (current === 'faq' ? 'active' : 'bg-light')"
        href="#/altWatcher"
      >
        Настройки / FAQ
      </a>
    </li>
  </ul>
</template>

<script setup lang="ts">
interface Props {
  current: string;
}

interface Emits {
  (e: 'update:current', value: string): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>