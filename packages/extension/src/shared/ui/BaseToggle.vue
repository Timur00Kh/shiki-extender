<template>
  <div class="base-toggle">
    <label class="base-toggle__label" v-if="label">
      <span class="base-toggle__label-text">{{ label }}</span>
      <span v-if="description" class="base-toggle__description">{{ description }}</span>
    </label>
    
    <button
      type="button"
      :class="toggleClasses"
      :disabled="disabled"
      @click="handleToggle"
      :aria-checked="modelValue"
      role="switch"
      :aria-label="label || 'Toggle'"
    >
      <span class="base-toggle__track">
        <span class="base-toggle__thumb" />
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ToggleProps } from '../types'

/**
 * BaseToggle component - replacement for MDToggle with TypeScript
 */
interface Props {
  /** Toggle state */
  modelValue: boolean
  /** Toggle label */
  label?: string
  /** Toggle description */
  description?: string
  /** Disabled state */
  disabled?: boolean
  /** Additional CSS classes */
  class?: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<Emits>()

/**
 * Computed toggle classes
 */
const toggleClasses = computed(() => {
  const baseClasses = 'base-toggle__button'
  const stateClasses = props.modelValue ? 'base-toggle__button--checked' : 'base-toggle__button--unchecked'
  const disabledClasses = props.disabled ? 'base-toggle__button--disabled' : ''
  
  return [
    baseClasses,
    stateClasses,
    disabledClasses,
    props.class
  ].filter(Boolean).join(' ')
})

/**
 * Handle toggle click
 */
const handleToggle = () => {
  if (!props.disabled) {
    const newValue = !props.modelValue
    emit('update:modelValue', newValue)
    emit('change', newValue)
  }
}
</script>

<style scoped>
.base-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.base-toggle__label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  cursor: pointer;
}

.base-toggle__label-text {
  font-weight: 500;
  color: #374151;
}

.base-toggle__description {
  font-size: 0.875rem;
  color: #6b7280;
}

.base-toggle__button {
  position: relative;
  width: 3rem;
  height: 1.5rem;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: #d1d5db;
}

.base-toggle__button--checked {
  background-color: #3b82f6;
}

.base-toggle__button--unchecked {
  background-color: #d1d5db;
}

.base-toggle__button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-toggle__track {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: inherit;
}

.base-toggle__thumb {
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  width: 1.25rem;
  height: 1.25rem;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.2s ease-in-out;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.base-toggle__button--checked .base-toggle__thumb {
  transform: translateX(1.5rem);
}

.base-toggle__button--unchecked .base-toggle__thumb {
  transform: translateX(0);
}

.base-toggle__button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.base-toggle__button:hover:not(.base-toggle__button--disabled) {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>