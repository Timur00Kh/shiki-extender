<template>
  <div
    v-if="computedLinks.length > 0"
    id="altWatcherContainer"
    class="altwatcher-bar"
  >
    <div class="altwatcher-btn-group">
      <a
        v-if="current"
        :href="computedUrl"
        target="_blank"
        rel="noopener"
        class="altwatcher-main-btn"
        @click="onCurrentClick"
      >
        {{ current.title }}
      </a>
      <div class="altwatcher-dropdown">
        <button
          type="button"
          class="altwatcher-dropdown-toggle"
          :title="dropdownOpen ? 'Свернуть' : 'Развернуть'"
          @click="dropdownOpen = !dropdownOpen"
        >
          {{ dropdownOpen ? "▼" : "▶" }}
        </button>
        <div v-show="dropdownOpen" class="altwatcher-dropdown-menu">
          <a
            v-for="link in computedLinks"
            :key="link.stable_id ?? link.hash_id ?? link.id ?? link.link"
            :href="computeLink(link.link)"
            target="_blank"
            rel="noopener"
            class="altwatcher-dropdown-item"
            :class="{
              active:
                (link.stable_id != null &&
                  link.stable_id === current?.stable_id) ||
                (link.hash_id != null && link.hash_id === current?.hash_id) ||
                (link.id != null && link.id === current?.id),
            }"
            @click.prevent="
              setCurrent(link);
              dropdownOpen = false;
            "
          >
            <FaviconImg :src="link.favicon" class="altwatcher-favicon" />
            {{ link.title }}
          </a>
          <div class="altwatcher-dropdown-divider" />
          <button
            type="button"
            class="altwatcher-dropdown-item"
            :class="{ active: lang === 'ru' }"
            @click="onLangChange('ru')"
          >
            [RU] Искать по русскому названию
          </button>
          <button
            type="button"
            class="altwatcher-dropdown-item"
            :class="{ active: lang === 'en' }"
            @click="onLangChange('en')"
          >
            [EN] Искать по английскому названию
          </button>
          <button
            v-if="titles.jp"
            type="button"
            class="altwatcher-dropdown-item"
            :class="{ active: lang === 'jp' }"
            @click="lang = 'jp'"
          >
            [JP] Искать по японскому названию
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { browser } from "wxt/browser";
import FaviconImg from "@/components/FaviconImg.vue";
import { getStableId } from "@/utils/stableId";

interface LinkItem {
  hash_id?: number;
  id?: number;
  stable_id?: string;
  title: string;
  link: string;
  tags: { manga: number; anime: number; ranobe: number };
  description?: string;
  favicon?: string;
}

const current = ref<LinkItem | null>(null);
const links = ref<LinkItem[]>([]);
const titleType = ref("");
const pageType = ref(0);
const lang = ref(getAltWatcherLanguage() || "en");
const dropdownOpen = ref(false);
const titles = ref<{ ru: string | null; en: string | null; jp: string | null }>(
  {
    ru: null,
    en: null,
    jp: null,
  }
);

function getPrefServiceStableId(pageTypeKey: string): string | null {
  const m = document.cookie.match(
    new RegExp("(?:^|; )altWatcherPrefServiceFor" + pageTypeKey + "=([^;]*)")
  );
  if (!m) return null;
  try {
    const v = decodeURIComponent(m[1].trim());
    return v.length > 0 ? v : null;
  } catch {
    return m[1].trim() || null;
  }
}

function setPrefService(pageTypeKey: string, value: string) {
  const d = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  document.cookie = `altWatcherPrefServiceFor${pageTypeKey}=${encodeURIComponent(
    value
  )}; path=/; expires=${d.toUTCString()}`;
}

function getAltWatcherLanguage(): string {
  const m = document.cookie.match(/(?:^|; )altWatcherLanguage=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : "en";
}

function setAltWatcherLanguage(value: string) {
  const d = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  document.cookie = `altWatcherLanguage=${encodeURIComponent(
    value
  )}; path=/; expires=${d.toUTCString()}`;
}

function encodeName(name: string | null, encoding: string): string {
  if (!name) return "";
  if (
    encoding === "1251" ||
    encoding === "windows1251" ||
    encoding === "windows-1251"
  ) {
    return unicodeToWin1251UrlEncoded(name);
  }
  return encodeURIComponent(name);
}

const DMap: Record<number, number> = {
  1027: 129,
  8225: 135,
  1046: 198,
  8222: 132,
  1047: 199,
  1168: 165,
  1048: 200,
  1113: 154,
  1049: 201,
  1045: 197,
  1050: 202,
  1028: 170,
  160: 160,
  1040: 192,
  1051: 203,
  164: 164,
  166: 166,
  167: 167,
  169: 169,
  171: 171,
  172: 172,
  173: 173,
  174: 174,
  1053: 205,
  176: 176,
  177: 177,
  1114: 156,
  181: 181,
  182: 182,
  183: 183,
  8221: 148,
  187: 187,
  1029: 189,
  1056: 208,
  1057: 209,
  1058: 210,
  8364: 136,
  1112: 188,
  1115: 158,
  1059: 211,
  1060: 212,
  1030: 178,
  1061: 213,
  1062: 214,
  1063: 215,
  1116: 157,
  1064: 216,
  1065: 217,
  1031: 175,
  1066: 218,
  1067: 219,
  1068: 220,
  1069: 221,
  1070: 222,
  1032: 163,
  8226: 149,
  1071: 223,
  1072: 224,
  8482: 153,
  1073: 225,
  8240: 137,
  1118: 162,
  1074: 226,
  1110: 179,
  8230: 133,
  1075: 227,
  1033: 138,
  1076: 228,
  1077: 229,
  8211: 150,
  1078: 230,
  1119: 159,
  1079: 231,
  1042: 194,
  1080: 232,
  1034: 140,
  1025: 168,
  1081: 233,
  1082: 234,
  8212: 151,
  1083: 235,
  1169: 180,
  1084: 236,
  1052: 204,
  1085: 237,
  1035: 142,
  1086: 238,
  1087: 239,
  1088: 240,
  1089: 241,
  1090: 242,
  1036: 141,
  1041: 193,
  1091: 243,
  1092: 244,
  8224: 134,
  1093: 245,
  8470: 185,
  1094: 246,
  1054: 206,
  1095: 247,
  1096: 248,
  8249: 139,
  1097: 249,
  1098: 250,
  1044: 196,
  1099: 251,
  1111: 191,
  1055: 207,
  1100: 252,
  1038: 161,
  8220: 147,
  1101: 253,
  8250: 155,
  1102: 254,
  8216: 145,
  1103: 255,
  1043: 195,
  1105: 184,
  1039: 143,
  1026: 128,
  1106: 144,
  8218: 130,
  1107: 131,
  8217: 146,
  1108: 186,
  1109: 190,
};

function unicodeToWin1251UrlEncoded(s: string): string {
  const L: string[] = [];
  for (let i = 0; i < s.length; i++) {
    const ord = s.charCodeAt(i);
    if (ord in DMap)
      L.push("%" + (DMap[ord] as number).toString(16).toUpperCase());
  }
  return L.join("");
}

function sortByUsed(a: LinkItem, b: LinkItem): number {
  const au = (a as { used?: number }).used ?? 0;
  const bu = (b as { used?: number }).used ?? 0;
  return bu - au;
}

const computedLinks = computed(() => {
  const type = titleType.value;
  const pType = pageType.value;
  let list = links.value.filter(
    (link) => link.tags[type as keyof typeof link.tags] & pType
  );
  list = list.map((e) => {
    if (e.favicon) return e;
    try {
      return { ...e, favicon: new URL(e.link).origin + "/favicon.ico" };
    } catch {
      return e;
    }
  });
  list.sort(sortByUsed);
  return list;
});

const computedUrl = computed(() =>
  current.value ? computeLink(current.value.link) : ""
);

function computeLink(link: string): string {
  let idMatch = link.indexOf("{{id}}") !== -1;
  let epMatch = link.indexOf("{{episode}}") !== -1;

  if (idMatch) {
    const id =
      window.location.href.split("/")[4]?.match(/([0-9]+)/g)?.[0] ?? "";
    link = link.replace("{{id}}", id);
  }
  if (epMatch) {
    const epEl = document.querySelector(".current-episodes");
    const ep = epEl ? Number((epEl as HTMLElement).innerText) + 1 : 1;
    link = link.replace("{{episode}}", String(ep));
  }
  const titleNameMatch = link.match(/\{\{title=?(.*?)\}\}/);
  const titleName = encodeName(
    titles.value[lang.value as keyof typeof titles.value],
    titleNameMatch ? titleNameMatch[1] : ""
  );
  if (titleNameMatch) {
    link = link.replace(/\{\{title=?(.*?)\}\}/g, titleName);
  }
  if (!idMatch && !epMatch && !titleNameMatch) {
    link += titleName;
  }
  return link;
}

async function onLinksGet(res: LinkItem[]) {
  const list = res || [];
  links.value = await Promise.all(
    list.map(async (l) => ({
      ...l,
      stable_id: l.stable_id ?? (await getStableId(l)),
    }))
  );
  setCurrent(null);
}

// Восстановить выбор при появлении links или смене pageType/titleType (избегаем гонки:
// ответ мог прийти до установки titleType/pageType, тогда ключ cookie был неверный).
watch(
  () => [links.value.length, titleType.value, pageType.value] as const,
  () => {
    if (links.value.length > 0 && titleType.value && pageType.value) {
      setCurrent(null);
    }
  },
  { immediate: true }
);

function setCurrent(link: LinkItem | null) {
  const pageTypeKey = titleType.value + pageType.value;

  if (!link) {
    const stored = getPrefServiceStableId(pageTypeKey);
    let found: LinkItem | undefined;
    const legacyNum =
      stored != null &&
      Number.isInteger(Number(stored)) &&
      String(Number(stored)) === stored
        ? Number(stored)
        : null;
    if (legacyNum != null) {
      found = links.value.find(
        (e) => e.hash_id === legacyNum || e.id === legacyNum
      );
    } else if (stored) {
      found = links.value.find((e) => e.stable_id === stored);
    }
    const allowed = computedLinks.value;
    const foundInAllowed =
      found &&
      allowed.find(
        (e) =>
          e.stable_id === found.stable_id ||
          (e.hash_id === found.hash_id && e.id === found.id)
      );
    if (foundInAllowed) {
      current.value = foundInAllowed;
      return;
    }
    if (allowed.length) {
      current.value = allowed[0];
    }
    return;
  }
  current.value = link;
  getStableId(link).then((sid) => setPrefService(pageTypeKey, sid));
}

function onCurrentClick() {
  if (current.value) {
    const pageTypeKey = titleType.value + pageType.value;
    getStableId(current.value).then((sid) => setPrefService(pageTypeKey, sid));
    browser.runtime.sendMessage({
      do: "altWatcherLinkUsed",
      hash_id: current.value.hash_id,
      id: current.value.id,
    });
  }
}

function onLangChange(l: string) {
  lang.value = l;
  setAltWatcherLanguage(l);
}

function parseTitles() {
  const h1El = document.querySelector("section > div > header > h1");
  const h1 = h1El ? (h1El as HTMLElement).innerText : "";
  const nameContainers = document.querySelectorAll(
    ".c-info-left .b-entry-info .line-container"
  );
  const nameContainersArr = Array.from(nameContainers)
    .filter((e) => e.querySelector(".value"))
    .map((e) => ({
      key: (e.querySelector(".key") as HTMLElement)?.innerText ?? "",
      value: (e.querySelector(".value") as HTMLElement)?.innerText ?? "",
    }));

  const isAnimeFirst =
    (document.querySelector("a.icon-anime") as HTMLElement)?.innerText ===
    "Anime";
  let en: string, ru: string, jp: string | null;
  if (isAnimeFirst) {
    en = (h1.split("/")[0] ?? "").trim();
    ru = (h1.split("/")[1] ?? h1.split("/")[0] ?? "").trim();
    const jpTemp = nameContainersArr.find((e) => e.key === "In Japanese:");
    jp = jpTemp ? jpTemp.value.trim() : null;
  } else {
    en = (h1.split("/")[1] ?? h1.split("/")[0] ?? "").trim();
    ru = (h1.split("/")[0] ?? "").trim();
    const jpTemp = nameContainersArr.find((e) => e.key === "По-японски:");
    jp = jpTemp ? jpTemp.value.trim() : null;
  }
  titles.value = { en, ru, jp };
}

onMounted(() => {
  browser.runtime.sendMessage({ do: "getAltWatcherLinksLocal" }, onLinksGet);
  pageType.value = document.querySelector('a.b-tag[href*="genre/12"]') ? 1 : 2;
  if (window.location.pathname.includes("anime")) titleType.value = "anime";
  else if (window.location.pathname.includes("manga"))
    titleType.value = "manga";
  else if (window.location.pathname.includes("ranobe"))
    titleType.value = "ranobe";
  parseTitles();
});
</script>

<style scoped>
.altwatcher-bar {
  margin-top: 5px;
  width: 100%;
}
.altwatcher-btn-group {
  display: flex;
  align-items: stretch;
  width: 100%;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  overflow: visible;
}
.altwatcher-main-btn {
  flex: 1;
  padding: 0.5rem 0.75rem;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 88%;
  background: #f8f9fa;
  color: #212529;
  text-decoration: none;
  font-size: 1rem;
}
.altwatcher-main-btn:hover {
  background: #e9ecef;
  color: #212529;
}
.altwatcher-dropdown-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  min-width: 2rem;
  height: 100%;
  min-height: 100%;
  padding: 0;
  background: #f8f9fa;
  border: none;
  border-left: 1px solid #e9ecef;
  cursor: pointer;
  font-size: 0.75rem;
}
.altwatcher-dropdown {
  position: relative;
  display: flex;
  align-items: stretch;
}
.altwatcher-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 2px;
  min-width: 220px;
  max-height: 70vh;
  overflow-y: auto;
  background: #fff;
  border: 2px solid #e9ecef;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 950;
}
.altwatcher-dropdown-item {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  color: #212529;
  text-decoration: none;
  font-size: 0.9rem;
}
.altwatcher-dropdown-item:hover,
.altwatcher-dropdown-item.active {
  background: #e9ecef;
}
.altwatcher-dropdown-divider {
  height: 2px;
  background: #e9ecef;
  margin: 4px 0;
}
.altwatcher-favicon {
  height: 16px;
  width: 16px;
  vertical-align: middle;
  margin-right: 4px;
}
</style>
