<template>
  <transition name="fade">
    <div v-if="modal.isOpen" class="modal-backdrop fade show"></div>
  </transition>
  
  <transition name="slide-fade">
    <div 
      v-if="modal.isOpen" 
      id="altWhatcherModal" 
      class="modal fade show"
      tabindex="-1" 
      role="dialog"
      aria-labelledby="altWhatcherModalLabel" 
      style="padding-right: 17px; display: block;" 
      aria-modal="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="altWhatcherModalLabel">Редактировать ссылку</h4>
            <button @click="$emit('close')" type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          
          <div class="modal-body">
            <h5>Название:</h5>
            <div class="input-group flex-nowrap">
              <input 
                v-model="modal.data.title" 
                type="text" 
                class="form-control"
                placeholder="Название сервиса"
              >
            </div>
            
            <h5 class="mt-4">Для чего использовать:</h5>
            <div class="row tagButtons">
              <div class="col-4 pr-2">
                <div class="btn-group">
                  <button 
                    @click="modal.data.tags.anime = modal.data.tags.anime ^ 2"
                    :class="'btn btn-block ' + (modal.data.tags.anime & 2 ? 'btn-info' : 'btn-outline-info')"
                    style="width: 100%"
                  >
                    Anime {{ modal.data.tags.anime }}
                  </button>
                  <button 
                    @click="modal.data.tags.anime = modal.data.tags.anime ^ 1"
                    :class="'btn ' + (modal.data.tags.anime & 1 ? 'btn-danger' : 'btn-outline-danger')"
                  >
                    Rx
                  </button>
                </div>
              </div>
              
              <div class="col-4 px-2">
                <div class="btn-group">
                  <button 
                    @click="modal.data.tags.manga = modal.data.tags.manga ^ 2"
                    :class="'btn btn-block ' + (modal.data.tags.manga & 2 ? 'btn-warning' : 'btn-outline-warning')"
                  >
                    Manga {{ modal.data.tags.manga }}
                  </button>
                  <button 
                    @click="modal.data.tags.manga = modal.data.tags.manga ^ 1"
                    :class="'btn ' + (modal.data.tags.manga & 1 ? 'btn-danger' : 'btn-outline-danger')"
                  >
                    Rx
                  </button>
                </div>
              </div>
              
              <div class="col-4 pl-2">
                <div class="btn-group">
                  <button 
                    @click="modal.data.tags.ranobe = modal.data.tags.ranobe ^ 2"
                    :class="'btn btn-block ' + (modal.data.tags.ranobe & 2 ? 'btn-secondary' : 'btn-outline-secondary')"
                  >
                    Ranobe {{ modal.data.tags.ranobe }}
                  </button>
                  <button 
                    @click="modal.data.tags.ranobe = modal.data.tags.ranobe ^ 1"
                    :class="'btn ' + (modal.data.tags.ranobe & 1 ? 'btn-danger' : 'btn-outline-danger')"
                  >
                    Rx
                  </button>
                </div>
              </div>
              
              <div class="col-auto">
                <p><b>Предлагать для: </b>{{ tagButtonsDesc }}</p>
              </div>
            </div>
            
            <h5 class="">URL:</h5>
            <textarea 
              v-model="modal.data.link" 
              class="form-control" 
              id="highlight"
              style="width: 100%; height: 100px"
            ></textarea>
            
            <div class="row justify-content-between mt-2">
              <div class="col-auto">
                <p><b style="font-size: .8rem">Добавить ингредиенты:</b></p>
              </div>
              <div class="col-auto">
                <button @click="$emit('insert-text', '{{title}}')" type="button" class="btn btn-secondary btn-sm">
                  Название тайтла
                </button>
                <button @click="$emit('insert-text', '{{id}}')" type="button" class="btn btn-secondary btn-sm">
                  id
                </button>
                <button @click="$emit('insert-text', '{{episode}}')" type="button" class="btn btn-secondary btn-sm">
                  след. Эпизод
                </button>
              </div>
            </div>

            <h5 class="mt-3">Описание:</h5>
            <div class="input-group">
              <textarea 
                v-model="modal.data.description" 
                class="form-control"
                aria-label="With textarea"
              ></textarea>
            </div>
            
            <p v-if="modal.data.id" class="text-muted mb-0">id {{ modal.data.id }}</p>
            
            <MDCheckbox 
              v-if="!modal.data.id"
              class="mt-2"
              title="Сервис будет опубликован и доступен для поиска всем пользователям."
              :label="'опубликовать'"
              :checked="modal.data.publish"
              :onChange="() => { modal.data.publish = !modal.data.publish }"
            />
          </div>
          
          <div class="modal-footer">
            <button 
              v-if="modal.data.action !== 'addNewLink'" 
              @click="$emit('delete', modal.data)" 
              type="button"
              class="btn btn-danger"
            >
              Delete
            </button>
            <button @click="$emit('save', modal.data)" type="button" class="btn btn-primary">Save</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MDCheckbox from '../../../components/MDCheckbox/MDCheckbox.vue';
import type { ModalState } from '../../../entities/link/model/types';

interface Props {
  modal: ModalState;
}

interface Emits {
  (e: 'close'): void;
  (e: 'save', link: any): void;
  (e: 'delete', link: any): void;
  (e: 'insert-text', text: string): void;
}

const props = defineProps<Props>();
defineEmits<Emits>();

const tagButtonsDesc = computed(() => {
  if (!props.modal.data) return '';
  
  const tags = props.modal.data.tags;
  const { anime, manga, ranobe } = tags;
  const count = Object.keys(tags).reduce((sum, e) => (tags[e] & 3) > 0 ? ++sum : sum, 0);
  let s = '';
  s = (anime & 2 ? "аниме" : '') +
      (anime === 3 ? ' и' : '') +
      (anime & 1 ? ' Rx аниме' : '') +
      ((((anime & 3) > 0) && ((manga & 3) > 0)) ? ',' : '') +
      (manga & 2 ? ' манги' : '') +
      (manga === 3 ? ' и' : '') +
      (manga & 1 ? ' Rx манги' : '') +
      ((((manga & 3) > 0) && ((ranobe & 3) > 0)) ? ',' : '') +
      (ranobe & 2 ? ' ранобе' : '') +
      (ranobe === 3 ? ' и' : '') +
      (ranobe & 1 ? ' Rx ранобе' : '');

  return s;
});
</script>

<style scoped>
.tagButtons .btn-group {
  width: 100%;
}

.slide-fade-enter-active {
  transition: all .3s ease;
}

.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>