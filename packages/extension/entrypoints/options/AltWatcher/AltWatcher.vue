<template>
  <div>
    <ul class="nav nav-pills nav-fill">
      <li class="nav-item pr-1">
        <a
          href="#/altWatcher"
          :class="'nav-link ' + (current === 'added' ? 'active' : 'bg-light')"
          @click.prevent="current = 'added'"
        >
          Добавленное
        </a>
      </li>
      <li class="nav-item px-1">
        <a
          href="#/altWatcher"
          :class="'nav-link ' + (current === 'search' ? 'active' : 'bg-light')"
          @click.prevent="current = 'search'"
        >
          Поиск
        </a>
      </li>
      <li class="nav-item pl-1">
        <a
          href="#/altWatcher"
          :class="'nav-link ' + (current === 'faq' ? 'active' : 'bg-light')"
          @click.prevent="current = 'faq'"
        >
          Настройки / FAQ
        </a>
      </li>
    </ul>

    <div v-if="current === 'faq'">
      <div v-if="linksUsed.length" class="card mt-3">
        <div class="card-body">
          <div class="row align-content-center">
            <div class="col-10">
              <div class="progress" style="height: 20px">
                <div
                  v-for="link in links"
                  v-show="link.used"
                  :key="link.hash_id"
                  class="progress-bar stat"
                  role="progressbar"
                  :style="`width: ${
                    ((link.used ?? 0) / linksTotal) * 100
                  }%; background-color: ${getNextColor()}; display: inline-block;`"
                >
                  {{ link.title }}
                  <span class="badge badge-secondary stat-inner">{{
                    link.used
                  }}</span>
                </div>
              </div>
            </div>
            <div class="col-2">
              <button
                type="button"
                class="btn btn-sm btn-danger"
                @click="resetLinksUses"
              >
                Сбросить
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="card mt-2">
        <div class="card-body">
          <div class="faq-content" v-html="faqHtml" />
        </div>
      </div>
    </div>

    <div v-if="current === 'added'" class="card mt-3">
      <div class="card-body">
        <div class="row justify-content-between">
          <div class="col-auto">
            <h3 class="card-title">Добавленное</h3>
          </div>
          <div class="col-auto">
            <button
              type="button"
              class="btn btn-primary btn-lg"
              style="margin-top: -5px"
              @click="addNewLink"
            >
              <i class="fas fa-plus-square" /> Добавить
            </button>
          </div>
        </div>

        <transition name="fade">
          <div v-if="links.length > 0" class="card mt-2">
            <ul class="list-group list-group-flush">
              <li
                v-for="link in links"
                :key="link.hash_id"
                class="list-group-item"
              >
                <div class="row justify-content-between">
                  <div class="col-auto">
                    <h4 class="card-title">
                      <FaviconImg :src="link.favicon" />
                      {{ link.title }}
                      <a
                        href="#/altWatcher"
                        class="badge badge-pill badge-light"
                        @click.prevent="showModal(link)"
                      >
                        <i class="far fa-edit" />
                      </a>
                    </h4>
                  </div>
                  <div class="col-auto">
                    <h6 class="mt-2">
                      <span v-if="link.tags.anime" class="badge badge-primary"
                        >Anime</span
                      >
                      <span v-if="link.tags.manga" class="badge badge-secondary"
                        >Manga</span
                      >
                      <span v-if="link.tags.ranobe" class="badge badge-success"
                        >Ranobe</span
                      >
                    </h6>
                  </div>
                </div>
                <div class="input-group flex-nowrap">
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
              </li>
            </ul>
          </div>
        </transition>

        <div v-if="links.length === 0" class="card mt-2 text-center">
          <transition name="fade" mode="out-in">
            <div v-if="loading" class="card-header py-5">
              <i class="fas fa-sync fa-5x fa-spin" />
            </div>
            <div v-else class="card-header py-5">
              <h5 class="card-title">Тут пусто.</h5>
              <p class="card-text">
                Добавь ссылки вручную или перейди на страницу поиска.
              </p>
              <a
                href="#"
                class="btn btn-primary"
                @click.prevent="current = 'search'"
                >Поиск</a
              >
            </div>
          </transition>
        </div>

        <button
          type="button"
          class="btn btn-primary btn-block mt-2"
          @click="addNewLink"
        >
          <i class="fas fa-plus-square" /> Добавить
        </button>
      </div>
    </div>

    <transition name="fade">
      <div v-if="modal" class="modal-backdrop fade show" />
    </transition>
    <transition name="slide-fade">
      <div
        v-if="modal"
        id="altWhatcherModal"
        class="modal fade show"
        tabindex="-1"
        role="dialog"
        style="padding-right: 17px; display: block"
        aria-modal="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Редактировать ссылку</h4>
              <button
                type="button"
                class="close"
                aria-label="Close"
                @click="modal = null"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div class="modal-body">
              <h5>Название:</h5>
              <div class="input-group flex-nowrap">
                <input
                  v-model="modal.title"
                  type="text"
                  class="form-control"
                  placeholder="Название сервиса"
                />
              </div>
              <h5 class="mt-4">Для чего использовать:</h5>
              <div class="row tagButtons">
                <div class="col-4 pr-2">
                  <div class="btn-group">
                    <button
                      type="button"
                      :class="
                        'btn btn-block ' +
                        (modal.tags.anime & 2 ? 'btn-info' : 'btn-outline-info')
                      "
                      @click="modal.tags.anime = modal.tags.anime ^ 2"
                    >
                      Anime {{ modal.tags.anime }}
                    </button>
                    <button
                      type="button"
                      :class="
                        'btn ' +
                        (modal.tags.anime & 1
                          ? 'btn-danger'
                          : 'btn-outline-danger')
                      "
                      @click="modal.tags.anime = modal.tags.anime ^ 1"
                    >
                      Rx
                    </button>
                  </div>
                </div>
                <div class="col-4 px-2">
                  <div class="btn-group">
                    <button
                      type="button"
                      :class="
                        'btn btn-block ' +
                        (modal.tags.manga & 2
                          ? 'btn-warning'
                          : 'btn-outline-warning')
                      "
                      @click="modal.tags.manga = modal.tags.manga ^ 2"
                    >
                      Manga {{ modal.tags.manga }}
                    </button>
                    <button
                      type="button"
                      :class="
                        'btn ' +
                        (modal.tags.manga & 1
                          ? 'btn-danger'
                          : 'btn-outline-danger')
                      "
                      @click="modal.tags.manga = modal.tags.manga ^ 1"
                    >
                      Rx
                    </button>
                  </div>
                </div>
                <div class="col-4 pl-2">
                  <div class="btn-group">
                    <button
                      type="button"
                      :class="
                        'btn btn-block ' +
                        (modal.tags.ranobe & 2
                          ? 'btn-secondary'
                          : 'btn-outline-secondary')
                      "
                      @click="modal.tags.ranobe = modal.tags.ranobe ^ 2"
                    >
                      Ranobe {{ modal.tags.ranobe }}
                    </button>
                    <button
                      type="button"
                      :class="
                        'btn ' +
                        (modal.tags.ranobe & 1
                          ? 'btn-danger'
                          : 'btn-outline-danger')
                      "
                      @click="modal.tags.ranobe = modal.tags.ranobe ^ 1"
                    >
                      Rx
                    </button>
                  </div>
                </div>
                <div class="col-auto">
                  <p><b>Предлагать для: </b>{{ tagButtonsDesc }}</p>
                </div>
              </div>
              <h5>URL:</h5>
              <textarea
                v-model="modal.link"
                class="form-control"
                style="width: 100%; height: 100px"
              />
              <div class="row justify-content-between mt-2">
                <div class="col-auto">
                  <p><b style="font-size: 0.8rem">Подстановки:</b></p>
                </div>
                <div class="col-auto">
                  <button
                    type="button"
                    class="btn btn-secondary btn-sm"
                    @click="insertTextAtCursor('{{title}}')"
                  >
                    Название тайтла
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary btn-sm"
                    @click="insertTextAtCursor('{{id}}')"
                  >
                    id
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary btn-sm"
                    @click="insertTextAtCursor('{{episode}}')"
                  >
                    след. Эпизод
                  </button>
                </div>
              </div>
              <h5 class="mt-3">Описание:</h5>
              <div class="input-group">
                <textarea
                  v-model="modal.description"
                  class="form-control"
                  aria-label="With textarea"
                />
              </div>
              <p v-if="modal.id" class="text-muted mb-0">id {{ modal.id }}</p>
              <MDCheckbox
                v-if="!modal.hash_id"
                class="mt-2"
                title="Сервис будет опубликован (TODO: бэкенд)."
                label="опубликовать"
                :checked="!!modal.publish"
                :on-change="() => modal && (modal.publish = !modal.publish)"
              />
            </div>
            <div class="modal-footer">
              <button
                v-if="modal.hash_id"
                type="button"
                class="btn btn-danger"
                @click="deleteLink(modal)"
              >
                Delete
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="saveLink(modal)"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <Search v-if="current === 'search'" :links="links" :save-link="saveLink" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import {
  getAllLinks,
  putLink,
  deleteLink as deleteLinkFromDb,
  type LinkRecord,
} from "@/utils/db";
import { sortByUsedTimes } from "@/utils/sort";
import FaviconImg from "@/components/FaviconImg.vue";
import Search from "./components/Search.vue";
import MDCheckbox from "../components/MDCheckbox.vue";

const loading = ref(true);
const current = ref<"added" | "search" | "faq">("added");
const links = ref<LinkRecord[]>([]);
const modal = ref<ModalLink | null>(null);
const faqContent = ref(
  "# FAQ\n\nTODO: интеграция с бэкендом (Convex/Supabase) — загрузка FAQ с API."
);

interface ModalLink extends Partial<LinkRecord> {
  tags: { manga: number; anime: number; ranobe: number };
  publish?: boolean;
  action?: string;
}

const faqHtml = computed(() => {
  const s = faqContent.value;
  return s.replace(/\n/g, "<br>").replace(/^# (.*)$/gm, "<strong>$1</strong>");
});

const linksTotal = computed(() =>
  links.value.reduce((sum, l) => sum + (l.used ?? 0), 0)
);
const linksUsed = computed(() => links.value.filter((l) => l.used));
const tagButtonsDesc = computed(() => {
  if (!modal.value) return "";
  const tags = modal.value.tags;
  const { anime, manga, ranobe } = tags;
  let s = "";
  s =
    (anime & 2 ? "аниме" : "") +
    (anime === 3 ? " и" : "") +
    (anime & 1 ? " Rx аниме" : "") +
    (anime & 3 && manga & 3 ? "," : "") +
    (manga & 2 ? " манги" : "") +
    (manga === 3 ? " и" : "") +
    (manga & 1 ? " Rx манги" : "") +
    (manga & 3 && ranobe & 3 ? "," : "") +
    (ranobe & 2 ? " ранобе" : "") +
    (ranobe === 3 ? " и" : "") +
    (ranobe & 1 ? " Rx ранобе" : "");
  return s;
});

watch(modal, (v) => {
  document.body.classList.toggle("modal-open", !!v);
});

onMounted(async () => {
  await updateLinks();
  // TODO: integrate with backend (Convex/Supabase) — GET /altWatcher/faq
  // try { const res = await fetch(`${apiDomain}/altWatcher/faq`); faqContent.value = await res.text(); } catch {}
});

async function updateLinks() {
  const results = await getAllLinks();
  const withFavicon = (results || []).map((e) => {
    if (e.favicon) return e;
    try {
      return { ...e, favicon: new URL(e.link).origin + "/favicon.ico" };
    } catch {
      return e;
    }
  });
  withFavicon.sort(sortByUsedTimes);
  links.value = withFavicon;
  loading.value = false;
}

async function saveLink(l: ModalLink) {
  const payload = { ...l };
  delete (payload as { publish?: boolean }).publish;
  delete (payload as { action?: string }).action;
  if (l.publish && !l.hash_id) {
    // TODO: integrate with backend (Convex/Supabase) — POST /altWatcher/link
    // const res = await fetch(`${apiDomain}/altWatcher/link`, { method: 'POST', body: JSON.stringify({...}) });
    // const { id } = await res.json(); payload.id = id;
  }
  await putLink(payload as LinkRecord);
  const idx = links.value.findIndex(
    (e) => e.hash_id === (payload as LinkRecord).hash_id
  );
  if (idx >= 0) {
    links.value[idx] = { ...links.value[idx], ...payload };
  } else {
    const all = await getAllLinks();
    all.sort(sortByUsedTimes);
    links.value = all.map((e) =>
      e.favicon
        ? e
        : {
            ...e,
            favicon: (() => {
              try {
                return new URL(e.link).origin + "/favicon.ico";
              } catch {
                return undefined;
              }
            })(),
          }
    );
  }
  modal.value = null;
}

function showModal(l: LinkRecord | ModalLink) {
  modal.value = JSON.parse(
    JSON.stringify({
      ...l,
      tags: l.tags ?? { manga: 0, anime: 2, ranobe: 0 },
      publish: (l as ModalLink).publish ?? false,
    })
  );
}

function addNewLink() {
  showModal({
    action: "addNewLink",
    title: "",
    link: "",
    tags: { manga: 0, anime: 2, ranobe: 0 },
    description: "",
    publish: true,
  });
}

async function deleteLink(l: ModalLink) {
  if (l.hash_id) {
    await deleteLinkFromDb(l.hash_id);
    links.value = links.value.filter((e) => e.hash_id !== l.hash_id);
  }
  modal.value = null;
}

function insertTextAtCursor(text: string) {
  const el = document.querySelector("#altWhatcherModal textarea");
  if (!el || !(el instanceof HTMLTextAreaElement)) return;
  const val = el.value;
  const start = el.selectionStart ?? val.length;
  const end = el.selectionEnd ?? val.length;
  modal.value!.link = val.slice(0, start) + text + val.slice(end);
  el.focus();
  el.selectionStart = el.selectionEnd = start + text.length;
}

const colorPicker = {
  iteration: -1,
  colors: [
    "#ff0000",
    "#ffc107",
    "#28a745",
    "#007bff",
    "#0000ff",
    "#8B008B",
    "#006400",
    "#DAA520",
    "#dc3545",
    "#343a40",
    "#800000",
    "#00008B",
    "#778899",
    "#FF1493",
    "#FF0000",
  ],
};
function getNextColor() {
  colorPicker.iteration++;
  if (colorPicker.iteration >= colorPicker.colors.length)
    colorPicker.iteration = 0;
  return colorPicker.colors[colorPicker.iteration];
}

async function resetLinksUses() {
  if (!confirm("Вы уверены?")) return;
  const results = await getAllLinks();
  for (const e of results) {
    await putLink({ ...e, used: 0 });
  }
  await updateLinks();
}
</script>

<style scoped>
.tagButtons .btn-group {
  width: 100%;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.stat {
  display: inline-block;
}
.stat:hover {
  width: 100% !important;
  display: inline-block;
}
</style>

<style>
#altWhatcherModal::-webkit-scrollbar {
  display: none;
}
.faq-content {
  white-space: pre-wrap;
}
</style>
