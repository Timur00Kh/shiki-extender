<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
    type="button"
  >
    <span v-if="loading" class="loading-spinner"></span>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonVariant, ButtonSize } from '../types'

/**
 * BaseButton component with variants and sizes
 */
interface Props {
  /** Button variant */
  variant?: ButtonVariant
  /** Button size */
  size?: ButtonSize
  /** Disabled state */
  disabled?: boolean
  /** Loading state */
  loading?: boolean
  /** Additional CSS classes */
  class?: string
}

interface Emits {
  (e: 'click', event: MouseEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  disabled: false,
  loading: false
})

const emit = defineEmits<Emits>()

/**
 * Computed button classes based on variant and size
 */
const buttonClasses = computed(() => {
  const baseClasses = 'base-button'
  const variantClasses = {
    primary: 'base-button--primary',
    secondary: 'base-button--secondary',
    danger: 'base-button--danger',
    success: 'base-button--success',
    warning: 'base-button--warning'
  }
  const sizeClasses = {
    small: 'base-button--small',
    medium: 'base-button--medium',
    large: 'base-button--large'
  }
  
  return [
    baseClasses,
    variantClasses[props.variant],
    sizeClasses[props.size],
    props.class
  ].filter(Boolean).join(' ')
})

/**
 * Handle button click event
 */
const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
}

.base-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Variants */
.base-button--primary {
  background-color: #3b82f6;
  color: white;
}

.base-button--primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.base-button--secondary {
  background-color: #6b7280;
  color: white;
}

.base-button--secondary:hover:not(:disabled) {
  background-color: #4b5563;
}

.base-button--danger {
  background-color: #ef4444;
  color: white;
}

.base-button--danger:hover:not(:disabled) {
  background-color: #dc2626;
}

.base-button--success {
  background-color: #10b981;
  color: white;
}

.base-button--success:hover:not(:disabled) {
  background-color: #059669;
}

.base-button--warning {
  background-color: #f59e0b;
  color: white;
}

.base-button--warning:hover:not(:disabled) {
  background-color: #d97706;
}

/* Sizes */
.base-button--small {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.base-button--medium {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.base-button--large {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}

/* Loading spinner */
.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>