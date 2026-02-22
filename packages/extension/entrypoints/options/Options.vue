<template>
  <div>
    <div class="card">
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <div class="row">
            <div class="col-auto">
              <h4>altWatcher</h4>
            </div>
            <div class="col-auto ml-auto">
              <MDToggle
                class="mt-2"
                :checked="altWatcher"
                :on-change="toggleAltWatcher"
              />
            </div>
            <div class="col-auto">
              <a
                v-if="isPopup"
                class="btn btn-primary"
                target="_blank"
                :href="optionsUrl"
                >Настройки</a
              >
              <RouterLink v-else class="btn btn-primary" to="/altWatcher"
                >Настройки</RouterLink
              >
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { browser } from "wxt/browser";
import MDToggle from "./components/MDToggle.vue";

const STORAGE_KEY = "altWatcher";

const route = useRoute();
const altWatcher = ref(true);
const isPopup = ref(!!route.query.popup);

const optionsUrl = browser.runtime.getURL("/options.html") + "#/altWatcher";

function loadAltWatcher() {
  browser.storage.local.get(STORAGE_KEY).then((result) => {
    altWatcher.value = result[STORAGE_KEY] !== false;
  });
}

function toggleAltWatcher() {
  altWatcher.value = !altWatcher.value;
}

watch(altWatcher, (val) => {
  browser.storage.local.set({ [STORAGE_KEY]: val });
});

onMounted(loadAltWatcher);
</script>
