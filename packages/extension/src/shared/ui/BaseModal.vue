<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="base-modal-overlay"
        @click="handleOverlayClick"
      >
        <div
          class="base-modal"
          :style="modalStyles"
          @click.stop
        >
          <!-- Header -->
          <div class="base-modal__header">
            <h3 v-if="title" class="base-modal__title">{{ title }}</h3>
            <button
              v-if="showCloseButton"
              type="button"
              class="base-modal__close"
              @click="handleClose"
              aria-label="Close modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="base-modal__content">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="base-modal__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import type { ModalProps } from '../types'

/**
 * BaseModal component - universal modal dialog
 */
interface Props {
  /** Modal visibility */
  modelValue: boolean
  /** Modal title */
  title?: string
  /** Modal width */
  width?: string
  /** Modal height */
  height?: string
  /** Close on overlay click */
  closeOnOverlay?: boolean
  /** Show close button */
  showCloseButton?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Loading state */
  loading?: boolean
  /** Additional CSS classes */
  class?: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  closeOnOverlay: true,
  showCloseButton: true,
  disabled: false,
  loading: false
})

const emit = defineEmits<Emits>()

/**
 * Computed modal styles
 */
const modalStyles = computed(() => {
  const styles: Record<string, string> = {}
  
  if (props.width) {
    styles.width = props.width
  }
  
  if (props.height) {
    styles.height = props.height
  }
  
  return styles
})

/**
 * Handle overlay click
 */
const handleOverlayClick = () => {
  if (props.closeOnOverlay && !props.disabled) {
    handleClose()
  }
}

/**
 * Handle close button click
 */
const handleClose = () => {
  if (!props.disabled) {
    emit('update:modelValue', false)
    emit('close')
  }
}

/**
 * Handle escape key
 */
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.modelValue && !props.disabled) {
    handleClose()
  }
}

/**
 * Prevent body scroll when modal is open
 */
const preventBodyScroll = () => {
  document.body.style.overflow = 'hidden'
}

const restoreBodyScroll = () => {
  document.body.style.overflow = ''
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  restoreBodyScroll()
})

// Watch for modal state changes
import { watch } from 'vue'

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    preventBodyScroll()
  } else {
    restoreBodyScroll()
  }
})
</script>

<style scoped>
.base-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.base-modal {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 300px;
}

.base-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 0;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
}

.base-modal__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.base-modal__close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: #6b7280;
  transition: all 0.2s ease-in-out;
}

.base-modal__close:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.base-modal__content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.base-modal__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 0 1.5rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}

/* Transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>