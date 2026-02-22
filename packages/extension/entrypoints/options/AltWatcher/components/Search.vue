<template>
  <div class="card-body">
    <div class="row justify-content-between">
      <div class="col-auto">
        <h3 class="card-title">Поиск</h3>
      </div>
    </div>

    <div class="input-group mb-2">
      <input
        v-model="params.title"
        type="text"
        class="form-control"
        placeholder="Искать сервисы..."
        @keydown.enter="startSearch"
      />
      <div class="input-group-append">
        <button
          v-if="loading"
          class="btn btn-outline-secondary disabled"
          type="button"
        >
          <span class="spinner-border spinner-border-sm" role="status" />
        </button>
        <button
          v-else
          class="btn btn-outline-secondary"
          type="button"
          @click="startSearch"
        >
          Искать
        </button>
      </div>
    </div>
    <div class="row justify-content-center tagButtons">
      <div class="col-auto pr-2">
        <div class="btn-group">
          <button
            type="button"
            :class="
              'btn btn-block ' +
              (params.anime & 2 ? 'btn-info' : 'btn-outline-info')
            "
            @click="params.anime = params.anime ^ 2"
          >
            Anime {{ params.anime }}
          </button>
          <button
            type="button"
            :class="
              'btn ' + (params.anime & 1 ? 'btn-danger' : 'btn-outline-danger')
            "
            @click="params.anime = params.anime ^ 1"
          >
            Rx
          </button>
        </div>
      </div>
      <div class="col-auto px-2">
        <div class="btn-group">
          <button
            type="button"
            :class="
              'btn btn-block ' +
              (params.manga & 2 ? 'btn-warning' : 'btn-outline-warning')
            "
            @click="params.manga = params.manga ^ 2"
          >
            Manga {{ params.manga }}
          </button>
          <button
            type="button"
            :class="
              'btn ' + (params.manga & 1 ? 'btn-danger' : 'btn-outline-danger')
            "
            @click="params.manga = params.manga ^ 1"
          >
            Rx
          </button>
        </div>
      </div>
      <div class="col-auto px-2">
        <div class="btn-group">
          <button
            type="button"
            :class="
              'btn btn-block ' +
              (params.ranobe & 2 ? 'btn-secondary' : 'btn-outline-secondary')
            "
            @click="params.ranobe = params.ranobe ^ 2"
          >
            Ranobe {{ params.ranobe }}
          </button>
          <button
            type="button"
            :class="
              'btn ' + (params.ranobe & 1 ? 'btn-danger' : 'btn-outline-danger')
            "
            @click="params.ranobe = params.ranobe ^ 1"
          >
            Rx
          </button>
        </div>
      </div>
      <div class="col-auto pl-2">
        <button
          type="button"
          class="btn btn-outline-warning"
          title="Одобрено модератором"
          @click="params.approved = !params.approved"
        >
          <i v-if="params.approved" class="fas fa-star" />
          <i v-else class="far fa-star" />
        </button>
      </div>
    </div>

    <transition name="fade">
      <div v-if="computedQuery.length > 0" class="card mt-3 mx-2">
        <ul class="list-group list-group-flush">
          <li
            v-for="link in computedQuery"
            :key="link.id"
            class="list-group-item"
          >
            <div class="row justify-content-between">
              <div class="col-8">
                <div class="row">
                  <div class="col-auto pr-0">
                    <h4 class="card-title">
                      <FaviconImg :src="link.favicon" />
                      {{ link.title }}
                    </h4>
                  </div>
                  <div class="col-auto">
                    <h4 class="card-title">
                      <span v-if="link.tags.anime" class="badge badge-primary"
                        >Anime</span
                      >
                      <span v-if="link.tags.manga" class="badge badge-secondary"
                        >Manga</span
                      >
                      <span v-if="link.tags.ranobe" class="badge badge-success"
                        >Ranobe</span
                      >
                      <span
                        v-if="
                          Object.keys(link.tags).reduce(
                            (sum, e) => (link.tags[e] & (1 > 0) ? true : sum),
                            false
                          )
                        "
                        class="badge badge-danger"
                      >
                        Rx
                      </span>
                      <a
                        href="#/altWatcher"
                        class="badge badge-pill badge-light"
                        @click.prevent="onMoreButtonClick(link.id)"
                      >
                        Ещё
                        <i v-if="link.more" class="fas fa-angle-up" />
                        <i v-else class="fas fa-angle-down" />
                      </a>
                    </h4>
                  </div>
                </div>
              </div>
              <div class="col-auto ml-auto">
                <button
                  type="button"
                  class="btn btn-primary btn-lg"
                  style="margin-top: -5px"
                  :disabled="link.alreadyAdded"
                  @click="onSaveButtonClick(link)"
                >
                  <span v-if="!link.alreadyAdded"
                    ><i class="fas fa-plus-square" /> Добавить</span
                  >
                  <span v-else><i class="fas fa-check" /> Добавлено</span>
                </button>
              </div>
            </div>

            <transition name="fade">
              <div v-if="link.more">
                <div class="row">
                  <div class="col-10">
                    <p>{{ link.description }}</p>
                  </div>
                </div>
                <div class="input-group flex-nowrap mt-2">
                  <div class="input-group-prepend">
                    <span class="input-group-text">link</span>
                  </div>
                  <input
                    type="text"
                    :value="link.link"
                    class="form-control"
                    placeholder="URL"
                    disabled
                  />
                </div>
                <div class="row justify-content-between">
                  <div class="col-auto">
                    <p class="text-muted mb-0">
                      Кол-во добавлений: {{ link.number_of_downloads }}
                    </p>
                  </div>
                  <div class="col-auto">
                    <p class="text-muted mb-0">id: {{ link.id }}</p>
                  </div>
                </div>
              </div>
            </transition>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { LinkRecord } from "@/utils/db";
import FaviconImg from "@/components/FaviconImg.vue";
import linksDump from "./altwatcher_links_dump.json";

const props = defineProps<{
  links: LinkRecord[];
  saveLink: (
    l: Partial<LinkRecord> & {
      tags: { manga: number; anime: number; ranobe: number };
    }
  ) => void;
}>();

const params = ref({
  title: "",
  manga: 0,
  anime: 0,
  ranobe: 0,
  approved: true,
});
const query = ref<Array<Record<string, unknown> & { more?: boolean }>>([]);
const loading = ref(false);

// TODO: integrate with backend (Convex/Supabase) — fetch link list from API instead of local dump
const dump = linksDump as Array<{
  id: number;
  title: string;
  link: string;
  description?: string;
  manga: number;
  anime: number;
  ranobe: number;
  approved: boolean;
  number_of_downloads?: number;
}>;

function onSaveButtonClick(l: {
  id?: number;
  title: string;
  link: string;
  tags: { manga: number; anime: number; ranobe: number };
  description?: string;
}) {
  props.saveLink({
    id: l.id,
    title: l.title,
    link: l.link,
    tags: l.tags,
    description: l.description,
  });
  // TODO: inc-num-of-downloads on backend
}

function onMoreButtonClick(id: number) {
  const cur = query.value.find((e) => e.id === id);
  if (cur) cur.more = !cur.more;
}

async function startSearch() {
  loading.value = true;
  const p = params.value;
  query.value = dump
    .filter((e) => {
      let match = true;
      if (p.title && !e.title.toLowerCase().includes(p.title.toLowerCase()))
        match = false;
      if (p.manga && !(e.manga & p.manga)) match = false;
      if (p.anime && !(e.anime & p.anime)) match = false;
      if (p.ranobe && !(e.ranobe & p.ranobe)) match = false;
      if (p.approved && !e.approved) match = false;
      return match;
    })
    .map((e) => ({ ...e, more: false }));
  setTimeout(() => {
    loading.value = false;
  }, 300);
}

const computedQuery = computed(() =>
  query.value.map((e) => {
    const link = {
      id: e.id,
      title: e.title,
      link: e.link,
      tags: { manga: e.manga, anime: e.anime, ranobe: e.ranobe },
      approved: e.approved,
      number_of_downloads: e.number_of_downloads,
      description: e.description,
      alreadyAdded: !!props.links.find((el) => el.id == e.id),
      more: e.more,
      favicon: (e as { favicon?: string }).favicon,
    };
    if (!link.favicon) {
      try {
        link.favicon = new URL(link.link).origin + "/favicon.ico";
      } catch {
        // ignore
      }
    }
    return link;
  })
);

onMounted(startSearch);
</script>

<style scoped>
.tagButtons .btn-group {
  width: 100%;
}
</style>
