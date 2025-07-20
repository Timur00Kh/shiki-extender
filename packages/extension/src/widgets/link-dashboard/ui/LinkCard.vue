<template>
  <li class="list-group-item">
    <div class="row justify-content-between">
      <div class="col-auto">
        <h4 class="card-title">
          <img 
            v-if="link.favicon" 
            :src="link.favicon" 
            style="height: 16px; width: 16px;" 
            alt=""
          > 
          {{ link.title }}
          <a 
            @click="$emit('edit', link)" 
            href="#/altWatcher"
            class="badge badge-pill badge-light"
          >
            <i class="far fa-edit"></i>
          </a>
        </h4>
      </div>
      <div class="col-auto">
        <h6 class="mt-2">
          <span v-if="link.tags.anime" class="badge badge-primary">Anime</span>
          <span v-if="link.tags.manga" class="badge badge-secondary">Manga</span>
          <span v-if="link.tags.ranobe" class="badge badge-success">Ranobe</span>
          <span 
            v-if="Object.keys(link.tags).reduce((sum, e) => (link.tags[e] & 1) > 0 ? true : sum, false)"
            class="badge badge-danger"
          >
            Rx
          </span>
        </h6>
      </div>
    </div>

    <div class="input-group flex-nowrap">
      <div class="input-group-prepend">
        <span class="input-group-text" id="addon-wrapping">link</span>
      </div>
      <input 
        type="text" 
        :value="link.link" 
        class="form-control" 
        placeholder="URL"
        disabled
      >
    </div>
  </li>
</template>

<script setup lang="ts">
import type { Link } from '../../../entities/link/model/types';

interface Props {
  link: Link;
}

interface Emits {
  (e: 'edit', link: Link): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>