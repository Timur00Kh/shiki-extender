<template>
  <div v-if="linksUsed.length" class="card mt-3">
    <div class="card-body">
      <div class="row align-content-center">
        <div class="col-10">
          <div class="progress" style="height: 20px;">
            <div
              v-for="link in links"
              v-if="link && link.used"
              class="progress-bar stat"
              role="progressbar"
              :style="`width: ${link.used / linksTotal * 100}%; background-color: ${getNextColor()}; display: inline-block;`"
            >
              {{ link.title }} 
              <span class="badge badge-secondary stat-inner">{{ link.used }}</span>
            </div>
          </div>
        </div>
        <div class="col-2">
          <button class="btn btn-sm btn-danger" @click="$emit('reset')">
            Сбросить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Link } from '../../../entities/link/model/types';
import { useColorPicker } from '../../../entities/link/model/useColorPicker';

interface Props {
  links: Link[];
}

interface Emits {
  (e: 'reset'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { getNextColor } = useColorPicker();

const linksTotal = computed(() => {
  return props.links.reduce((sum, l) => sum + (l.used ? l.used : 0), 0);
});

const linksUsed = computed(() => {
  return props.links.filter(l => l.used);
});
</script>

<style scoped>
.stat {
  display: inline-block;
}

.stat:hover {
  width: 100% !important;
  display: inline-block;
}

.stat .stat-inner {
  animation: animStat linear 0.8s;
}

@keyframes animStat {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.1;
  }
  100% {
    opacity: 1;
  }
}
</style>