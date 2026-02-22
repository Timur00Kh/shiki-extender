<template>
  <div class="">
    <input
      class="toggle_input"
      type="checkbox"
      :id="id"
      style="display: none"
      :checked="checked"
      :disabled="disabled"
      @change="onChange"
    />
    <label :for="id" class="toggle"><span></span></label>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    checked: boolean;
    disabled?: boolean;
    onChange?: () => void;
    label?: string;
  }>(),
  { disabled: false }
);

const id = "cbx" + Math.round(Math.random() * 10000);

function onChange() {
  props.onChange?.();
}
</script>

<style scoped>
.toggle {
  position: relative;
  display: block;
  width: 40px;
  height: 20px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transform: translate3d(0, 0, 0);
}

.toggle::before {
  content: "";
  position: relative;
  top: 3px;
  left: 3px;
  width: 34px;
  height: 14px;
  display: block;
  background: #9a9999;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.toggle span {
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  display: block;
  background: white;
  border-radius: 10px;
  box-shadow: 0 3px 8px rgba(154, 153, 153, 0.5);
  transition: all 0.2s ease;
}

.toggle_input:checked + .toggle::before {
  background: #76e86b;
}

.toggle_input:checked + .toggle span {
  background: #16c173;
  transform: translateX(20px);
  transition: all 0.2s cubic-bezier(0.8, 0.4, 0.3, 1.25), background 0.15s ease;
  box-shadow: 0 3px 8px rgba(79, 46, 220, 0.2);
}
</style>
