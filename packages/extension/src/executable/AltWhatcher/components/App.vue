<template>
    <div id="altWatcherContainer" v-if="computedLinks.length > 0">
        <div class="button-group">
            <a
                v-if="current"
                :href="computeLink(current.link, { title: titles[lang], id: linkValues.id, episode: linkValues.episode })"
                target="_blank"
                class="main-button"
                @click="onCurrentClick"
                :title="computeLink(current.link, { title: titles[lang], id: linkValues.id, episode: linkValues.episode })"
            >
            {{current.title}}
        </a>
            <div class="dropdown">
                <button @click="showDropdown = !showDropdown" class="dropdown-button">▼</button>
                <div v-if="showDropdown" class="dropdown-menu">
                    <a
                        v-for="link in computedLinks"
                        :key="'altWatcher_link_' + link.hash_id"
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
                        > {{link.title}}
                    </a>
                    <hr class="dropdown-divider">
                    <a
                        @click="onLangChange('ru')"
                        class="dropdown-item"
                        :class="{ active: lang === 'ru' }"
                        title="Искать по русскому названию"
                    >
                        [RU] Искать по русскому названию
                    </a>
                    <a
                        @click="onLangChange('en')"
                        class="dropdown-item"
                        :class="{ active: lang === 'en' }"
                        title="Искать по английскому названию"
                    >
                        [EN] Искать по английскому названию
                    </a>
                    <a
                        v-if="titles.jp"
                        @click="onLangChange('jp')"
                        class="dropdown-item"
                        :class="{ active: lang === 'jp' }"
                        title="Искать по японскому названию"
                    >
                        [JP] Искать по японскому названию
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { sortByUsedTimes } from '../../../utils/utils';
import { computeLink } from '../../../utils/linkPattern';

// Вспомогательные функции (позже вынести в utils)
function encodeName(name, encoding) {
    switch (encoding) {
        case 'UTF8':
        case 'UTF-8': {
            return encodeURIComponent(name);
        }
        case '1251':
        case 'windows1251':
        case 'windows-1251': {
            return unicodeToWin1251_UrlEncoded(name);
        }
        default: {
            return encodeURIComponent(name);
        }
    }
}

const DMap = {0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19, 20: 20, 21: 21, 22: 22, 23: 23, 24: 24, 25: 25, 26: 26, 27: 27, 28: 28, 29: 29, 30: 30, 31: 31, 32: 32, 33: 33, 34: 34, 35: 35, 36: 36, 37: 37, 38: 38, 39: 39, 40: 40, 41: 41, 42: 42, 43: 43, 44: 44, 45: 45, 46: 46, 47: 47, 48: 48, 49: 49, 50: 50, 51: 51, 52: 52, 53: 53, 54: 54, 55: 55, 56: 56, 57: 57, 58: 58, 59: 59, 60: 60, 61: 61, 62: 62, 63: 63, 64: 64, 65: 65, 66: 66, 67: 67, 68: 68, 69: 69, 70: 70, 71: 71, 72: 72, 73: 73, 74: 74, 75: 75, 76: 76, 77: 77, 78: 78, 79: 79, 80: 80, 81: 81, 82: 82, 83: 83, 84: 84, 85: 85, 86: 86, 87: 87, 88: 88, 89: 89, 90: 90, 91: 91, 92: 92, 93: 93, 94: 94, 95: 95, 96: 96, 97: 97, 98: 98, 99: 99, 100: 100, 101: 101, 102: 102, 103: 103, 104: 104, 105: 105, 106: 106, 107: 107, 108: 108, 109: 109, 110: 110, 111: 111, 112: 112, 113: 113, 114: 114, 115: 115, 116: 116, 117: 117, 118: 118, 119: 119, 120: 120, 121: 121, 122: 122, 123: 123, 124: 124, 125: 125, 126: 126, 127: 127, 1027: 129, 8225: 135, 1046: 198, 8222: 132, 1047: 199, 1168: 165, 1048: 200, 1113: 154, 1049: 201, 1045: 197, 1050: 202, 1028: 170, 160: 160, 1040: 192, 1051: 203, 164: 164, 166: 166, 167: 167, 169: 169, 171: 171, 172: 172, 173: 173, 174: 174, 1053: 205, 176: 176, 177: 177, 1114: 156, 181: 181, 182: 182, 183: 183, 8221: 148, 187: 187, 1029: 189, 1056: 208, 1057: 209, 1058: 210, 8364: 136, 1112: 188, 1115: 158, 1059: 211, 1060: 212, 1030: 178, 1061: 213, 1062: 214, 1063: 215, 1116: 157, 1064: 216, 1065: 217, 1031: 175, 1066: 218, 1067: 219, 1068: 220, 1069: 221, 1070: 222, 1032: 163, 8226: 149, 1071: 223, 1072: 224, 8482: 153, 1073: 225, 8240: 137, 1118: 162, 1074: 226, 1110: 179, 8230: 133, 1075: 227, 1033: 138, 1076: 228, 1077: 229, 8211: 150, 1078: 230, 1119: 159, 1079: 231, 1042: 194, 1080: 232, 1034: 140, 1025: 168, 1081: 233, 1082: 234, 8212: 151, 1083: 235, 1169: 180, 1084: 236, 1052: 204, 1085: 237, 1035: 142, 1086: 238, 1087: 239, 1088: 240, 1089: 241, 1090: 242, 1036: 141, 1041: 193, 1091: 243, 1092: 244, 8224: 134, 1093: 245, 8470: 185, 1094: 246, 1054: 206, 1095: 247, 1096: 248, 8249: 139, 1097: 249, 1098: 250, 1044: 196, 1099: 251, 1111: 191, 1055: 207, 1100: 252, 1038: 161, 8220: 147, 1101: 253, 8250: 155, 1102: 254, 8216: 145, 1103: 255, 1043: 195, 1105: 184, 1039: 143, 1026: 128, 1106: 144, 8218: 130, 1107: 131, 8217: 146, 1108: 186, 1109: 190}

function unicodeToWin1251_UrlEncoded(s) {
    var L = [];
    for (var i=0; i<s.length; i++) {
        var ord = s.charCodeAt(i);
        if (!(ord in DMap)) continue;
        L.push('%'+DMap[ord].toString(16));
    }
    return L.join('').toUpperCase();
}
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
function onDropDownShow(e) {
    parseTitles();
    chrome.runtime.sendMessage({do: "getAltWatcherLinks"}, onLinksGet);
}
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
function openInNewTab(link) {
    var win = window.open(computeLink(link.link, { title: titles.value[lang.value], id: linkValues.value.id, episode: linkValues.value.episode }), '_blank');
    win.focus();
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
});
onUnmounted(() => {
    console.log('---vue destroyed');
});
</script>

<style lang="scss">
    #altWatcherContainer {
        /*
        @import "bootstrap/scss/mixins";
        @import "bootstrap/scss/functions";
        @import "bootstrap/scss/variables";
        @import "bootstrap/scss/buttons";
        @import "bootstrap/scss/button-group";
        @import "bootstrap/scss/popover";
        @import "bootstrap/scss/dropdown";
        @import "bootstrap/scss/maps";
        @import "bootstrap/scss/root";
        @import "bootstrap/scss/reboot";
        @import "bootstrap/scss/type";
        */

        /* Fallback styles */
        .button-group {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .main-button {
            background: #4a90e2;
            color: #fff;
            border: none;
            border-radius: 4px;
            padding: 6px 16px;
            font-size: 15px;
            cursor: pointer;
            text-decoration: none;
            transition: background 0.2s;
        }
        .main-button:hover {
            background: #357ab8;
        }
        .dropdown {
            position: relative;
            display: inline-block;
        }
        .dropdown-button {
            background: #eee;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 6px 10px;
            cursor: pointer;
            font-size: 15px;
        }
        .dropdown-menu {
            position: absolute;
            top: 100%;
            left: 0;
            min-width: 220px;
            background: #fff;
            border: 2px #e9ecef solid;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            z-index: 1000;
            margin-top: 4px;
            padding: 4px 0;
        }
        .dropdown-item {
            display: flex;
            align-items: center;
            padding: 6px 14px;
            font-size: 15px;
            color: #222;
            background: none;
            border: none;
            width: 100%;
            text-align: left;
            cursor: pointer;
            transition: background 0.15s;
            text-decoration: none;
        }
        .dropdown-item:hover, .dropdown-item.active, .dropdown-item:active {
            background-color: #f0f4fa !important;
        }
        .dropdown-divider {
            border-top: 2px #e9ecef solid !important;
            margin: 4px 0;
        }
        .favicon {
            width: 16px;
            height: 16px;
            margin-right: 8px;
        }
    }
</style>