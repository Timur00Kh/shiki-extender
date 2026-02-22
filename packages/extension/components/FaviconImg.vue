<template>
  <img
    :src="displaySrc"
    class="favicon-img"
    alt=""
    @error="displaySrc = FALLBACK_FAVICON"
  />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const FALLBACK_FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23999' d='M8 1a7 7 0 0 1 7 7 7 7 0 0 1-7 7 7 7 0 0 1-7-7 7 7 0 0 1 7-7zm0 1.5a5.5 5.5 0 0 0-5.5 5.5 5.5 5.5 0 0 0 5.5 5.5 5.5 5.5 0 0 0 5.5-5.5A5.5 5.5 0 0 0 8 2.5z'/%3E%3C/svg%3E";

const props = withDefaults(
  defineProps<{
    src?: string | null;
  }>(),
  { src: undefined }
);

const displaySrc = ref(props.src || FALLBACK_FAVICON);

watch(
  () => props.src,
  (v) => {
    displaySrc.value = v || FALLBACK_FAVICON;
  }
);
</script>

<style scoped>
.favicon-img {
  height: 16px;
  width: 16px;
  vertical-align: middle;
}
</style>
