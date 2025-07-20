<template>
  <div>
    <TabNavigation 
      :current="current" 
      @update:current="current = $event" 
    />

    <!-- FAQ Tab -->
    <div v-if="current === 'faq'">
      <StatsProgressBar 
        :links="links" 
        @reset="resetLinksUses" 
      />
      <div class="card mt-2">
        <div class="card-body">
          <div v-html="faq"></div>
        </div>
      </div>
    </div>

    <!-- Added Links Tab -->
    <div v-if="current === 'added'">
      <LinksList 
        :links="links" 
        :loading="loading"
        @add="addNewLink"
        @edit="showModal"
        @switch-tab="current = $event"
      />
    </div>

    <!-- Search Tab -->
    <Search 
      v-if="current === 'search'" 
      :links="links" 
      :saveLink="saveLink"
    />

    <!-- Modal -->
    <LinkModal 
      v-if="modal.isOpen"
      :modal="modal"
      @close="closeModal"
      @save="saveLink"
      @delete="deleteLink"
      @insert-text="insertTextAtCursor"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { apiDomain } from "../../config";
import Search from './components/Search.vue';

// Components
import { 
  TabNavigation, 
  StatsProgressBar, 
  LinksList, 
  LinkModal 
} from '../../../widgets/link-dashboard/ui';

// Composables
import { useLinksDatabase, useLinkCRUD } from '../../../entities/link/model';
import { useLinkModal } from '../../../features/link-management/model';

// State
const current = ref("added");
const faq = ref('# Загрузка...');

// Composables
const { linksDb, loading, links, initDatabase, updateLinks, resetLinksUses } = useLinksDatabase();
const { saveLink, deleteLink, addNewLink: createNewLink } = useLinkCRUD(linksDb, links);
const { modal, openModal, closeModal, insertTextAtCursor } = useLinkModal();

// Methods
const addNewLink = () => {
  const newLink = createNewLink();
  openModal(newLink, 'create');
};

const showModal = (link: any) => {
  openModal(link, 'edit');
};

// Lifecycle
onMounted(async () => {
  try {
    await initDatabase();
    await updateLinks();
    
    // Load FAQ
    const response = await axios.get(`${apiDomain}/altWatcher/faq`);
    faq.value = response.data;
  } catch (error) {
    console.error('Failed to initialize:', error);
    faq.value = 'Ошибка загрузки FAQ';
  }
});
</script>

<style>
#altWhatcherModal::-webkit-scrollbar {
  display: none;
}

body::-webkit-scrollbar {
  display: none;
}

.hwt-content mark.blue {
  background-color: #a3daff;
}

.hwt-container {
  display: block !important;
}
</style>