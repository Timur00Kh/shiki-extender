<template>
  <div class="card mt-3">
    <div class="card-body">
      <div class="row justify-content-between">
        <div class="col-auto">
          <h3 class="card-title" id="added">Добавленное</h3>
        </div>
        <div class="col-auto">
          <button 
            @click="$emit('add')" 
            style="margin-top: -5px" 
            type="button"
            class="btn btn-primary btn-lg"
          >
            <i class="fas fa-plus-square"></i> Добавить
          </button>
        </div>
      </div>

      <transition name="fade">
        <div v-if="links.length > 0" class="card mt-2">
          <ul class="list-group list-group-flush">
            <LinkCard 
              v-for="link in links" 
              :key="link.hash_id" 
              :link="link"
              @edit="$emit('edit', $event)"
            />
          </ul>
        </div>
      </transition>

      <div v-if="links.length === 0" class="card mt-2 text-center">
        <transition name="fade" mode="out-in">
          <div v-if="loading" class="card-header py-5">
            <i class="fas fa-sync fa-5x fa-spin"></i>
          </div>
          <div v-else class="card-header py-5">
            <h5 class="card-title">Тут пусто.</h5>
            <p class="card-text">Добавь ссылки собственоручно, либо перейди на страницу поиска.</p>
            <a href="#" @click="$emit('switch-tab', 'search')" class="btn btn-primary">Поиск</a>
          </div>
        </transition>
      </div>

      <button 
        @click="$emit('add')" 
        type="button" 
        class="btn btn-primary btn-block mt-2"
      >
        <i class="fas fa-plus-square"></i> Добавить
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import LinkCard from './LinkCard.vue';
import type { Link } from '../../../entities/link/model/types';

interface Props {
  links: Link[];
  loading: boolean;
}

interface Emits {
  (e: 'add'): void;
  (e: 'edit', link: Link): void;
  (e: 'switch-tab', tab: string): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>