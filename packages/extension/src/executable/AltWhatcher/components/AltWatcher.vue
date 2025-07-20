<template>
    <div :id="ALT_WATCHER_CONTAINER_ID" v-if="computedLinks.length > 0">
        <div class="split-button-group">
            <a 
                v-if="current"
                @click="onCurrentClick"
                :href="computedUrl"
                target="_blank"
                class="main-button" 
                :title="computedUrl"
            >
                {{current.title}}
            </a>
            <button 
                type="button" 
                class="dropdown-toggle" 
                @click="showDropdown = !showDropdown"
                aria-expanded="false"
            >
                <span class="visually-hidden">Toggle Dropdown</span>
            </button>
            <ul v-if="showDropdown" class="dropdown-menu">
                <li v-for="link in computedLinks" :key="'altWatcher_link_' + link.hash_id">
                    <a
                        @click.prevent="setCurrent(link)"
                        :href="computeLink(link.link, { title: titles[lang], id: linkValues.id, episode: linkValues.episode })"
                        class="dropdown-item"
                        :class="{ active: link.hash_id === current.hash_id }"
                    >
                        <img
                            v-if="link.favicon"
                            :src="link.favicon"
                            alt=""
                            class="favicon"
                        >
                        {{link.title}}
                    </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                    <a
                        @click="onLangChange('ru')"
                        class="dropdown-item"
                        :class="{ active: lang === 'ru' }"
                        title="Искать по русскому названию"
                    >
                        [RU] Искать по русскому названию
                    </a>
                </li>
                <li>
                    <a
                        @click="onLangChange('en')"
                        class="dropdown-item"
                        :class="{ active: lang === 'en' }"
                        title="Искать по английскому названию"
                    >
                        [EN] Искать по английскому названию
                    </a>
                </li>
                <li v-if="titles.jp">
                    <a
                        @click="onLangChange('jp')"
                        class="dropdown-item"
                        :class="{ active: lang === 'jp' }"
                        title="Искать по японскому названию"
                    >
                        [JP] Искать по японскому названию
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { sortByUsedTimes } from '../../../utils/utils';
import { computeLink } from '../../../utils/linkPattern';

const ALT_WATCHER_CONTAINER_ID = 'altWatcherContainer';


function getPrefServiceId(pageType) {
    var matches = document.cookie.match(new RegExp('(?:^|; )altWatcherPrefServiceFor' + pageType + '=([^;]*)'));
    return matches ? Number(matches[1]) : null;
}
function setPrefService(pageType, hash_id) {
    let d = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    document.cookie = "altWatcherPrefServiceFor" + pageType + "=" + hash_id + "; path=/; expires=" + d.toUTCString();
}
function getAltWatcherLanguage() {
    var matches = document.cookie.match(new RegExp('(?:^|; )altWatcherLanguage=([^;]*)'));
    if (matches) {
        matches = decodeURIComponent(matches[1]);
        return matches;
    }
    return "en";
}
function setAltWatcherLanguage(value) {
    let d = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    document.cookie = "altWatcherLanguage=" + encodeURIComponent(value) + "; path=/; expires=" + d.toUTCString();
}

// Состояния
const current = ref(null);
const links = ref([]);
const titleType = ref('');
const pageType = ref(0);
const lang = ref(getAltWatcherLanguage() || 'en');
const bar = ref(false);
const showDropdown = ref(false);
const titles = ref({ ru: null, en: null, jp: null });

const linkValues = computed(() => {
    return {
        title: titles.value[lang.value],
        id: window.location.href.split('/')[4].match(/([0-9]+)/g)[0],
        episode: document.querySelector('.current-episodes') ? Number(document.querySelector('.current-episodes').innerText) + 1 : 1,
    }
});

// Логика
function onLinksGet(res) {
    links.value = res;
    setCurrent();
}

function setCurrent(link) {
    let pt = titleType.value + pageType.value;
    if (!link) {
        let hash_id = getPrefServiceId(pt);
        let byHashId = links.value.find(e => e.hash_id === hash_id);
        if (byHashId) {
            link = byHashId;
            current.value = link;
            return;
        } else if (computedLinks.value && computedLinks.value.length) {
            link = computedLinks.value[0];
        } else {
            return;
        }
    }
    current.value = link;
    setPrefService(pt, link.hash_id);
    bar.value = false;
    showDropdown.value = false;
}

function onCurrentClick() {
    chrome.runtime.sendMessage({do: "altWatcherLinkUsed", hash_id: current.value.hash_id});
}

function parseTitles() {
    let en, ru, jp;
    let h1 = document.querySelector('section > div > header > h1').innerText;
    let otherNames = document.querySelector('.other-names');
    if (otherNames) otherNames.addEventListener('click', () => setTimeout(parseTitles, 2000));
    let nameContainers = document.querySelectorAll('.c-info-left  .b-entry-info .line-container');
    nameContainers = Array.prototype.slice.call(nameContainers)
        .filter(e => e.querySelector('.value'))
        .map(e => {
            return {
                key: e.querySelector('.key').innerText,
                value: e.querySelector('.value').innerText,
            }
        });
    if (document.querySelector('a.icon-anime').innerText === "Anime") {
        en = h1.split('/')[0];
        ru = h1.split('/')[1] || h1.split('/')[0];
        let jpTemp = nameContainers.find(e => e.key === 'In Japanese:');
        jp = jpTemp ? jpTemp.value : null;
    } else {
        en = h1.split('/')[1] || h1.split('/')[0];
        ru = h1.split('/')[0];
        let jpTemp = nameContainers.find(e => e.key === 'По-японски:');
        jp = jpTemp ? jpTemp.value : null;
    }
    if (typeof en === 'string') en = en.trim();
    if (typeof ru === 'string') ru = ru.trim();
    if (typeof jp === 'string') jp = jp.trim();
    titles.value.en = en;
    titles.value.ru = ru;
    titles.value.jp = jp;
}

function onLangChange(l) {
    lang.value = l;
    setAltWatcherLanguage(l);
}

const computedLinks = computed(() => {
    let cl = links.value
        .filter(link => link.tags[titleType.value] & pageType.value)
        .map(e => {
            if (e.favicon) {
                return e;
            } else {
                try {
                    let origin = (new URL(e.link)).origin;
                    let favicon = origin + '/favicon.ico';
                    return {
                        ...e,
                        favicon: favicon
                    }
                } catch (error) {
                    return e
                }
            }
        });
    cl.sort(sortByUsedTimes);
    return cl;
});

const computedUrl = computed(() => current.value ? computeLink(current.value.link, { title: titles.value[lang.value], id: linkValues.value.id, episode: linkValues.value.episode }) : '');


onMounted(() => {
    console.log('---', 'AltWatcher mounted');
    chrome.runtime.sendMessage({do: "getAltWatcherLinks"}, onLinksGet);
    pageType.value = !!document.querySelector('a.b-tag[href*="genre/12"]') ? 1 : 2;
    if (~window.location.pathname.indexOf('anime')) {
        titleType.value = 'anime';
    } else if (~window.location.pathname.indexOf('manga')) {
        titleType.value = 'manga';
    } else if (~window.location.pathname.indexOf('ranobe')) {
        titleType.value = 'ranobe';
    }
    parseTitles();
    
    // Add click outside handler to close dropdown
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    console.log('---vue destroyed');
    document.removeEventListener('click', handleClickOutside);
});

function handleClickOutside(event) {
    const container = document.getElementById(ALT_WATCHER_CONTAINER_ID);
    if (container && !container.contains(event.target) && showDropdown.value) {
        showDropdown.value = false;
    }
}
</script>

<style lang="scss">
    #altWatcherContainer {
        margin: 24px 0;

        .split-button-group {
            display: flex;
            width: 100%;
            position: relative;
            text-align: center;
        }

        .main-button {
            flex: 1;
            background: #6c757d;
            color: #fff;
            border: none;
            border-radius: 4px 0 0 4px;
            padding: 12px 16px;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.2s;
            font-weight: 500;
            text-align: center;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .main-button:hover {
            background: #5c636a;
        }

        .dropdown-toggle {
            background: #6c757d;
            color: #fff;
            border: none;
            border-radius: 0 4px 4px 0;
            padding: 12px 8px;
            cursor: pointer;
            transition: background 0.2s;
            position: relative;
            min-width: 40px;
        }

        .dropdown-toggle:hover {
            background: #5c636a;
        }

        .dropdown-toggle::after {
            content: "▼";
            font-size: 10px;
        }

        .dropdown-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            margin-top: 4px;
            padding: 8px 0;
            z-index: 1000;
            list-style: none;
            max-height: 300px;
            overflow-y: auto;
        }

        .dropdown-item {
            display: flex;
            align-items: center;
            padding: 8px 16px;
            color: #333;
            text-decoration: none;
            cursor: pointer;
            transition: background 0.15s;
            font-size: 14px;
        }

        .dropdown-item:hover {
            background: #f5f5f5;
        }

        .dropdown-item.active {
            background: #e3f2fd;
            color: #1976d2;
        }

        .dropdown-divider {
            border: none;
            border-top: 1px solid #eee;
            margin: 4px 0;
        }

        .visually-hidden {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }

        .favicon {
            width: 16px;
            height: 16px;
            margin-right: 8px;
        }
    }
</style>