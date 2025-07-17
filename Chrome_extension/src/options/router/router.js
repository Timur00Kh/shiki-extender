import { createRouter, createWebHashHistory } from 'vue-router'
import Options from 'pages/Options.vue'
import AltWhatcher from 'pages/AltWatcher/AltWatcher.vue'
import ShikiDump from 'pages/ShikiDump/ShikiDump.vue'
import Player from 'pages/ShikiDump/Player.vue'

const routes = [
    { path: "/options", component: Options, meta: { title: 'Options' }},
    { path: "/", component: Options, meta: { title: 'Options' }},
    { path: "/altWatcher", component: AltWhatcher, meta: { title: 'AltWatcher' }},
    { path: "/shikiDump", component: ShikiDump, meta: { title: 'ShikiDump' }},
    { path: "/shikiDump/player", component: Player, meta: { title: 'ShikiDump' }},
];

export default createRouter({
    history: createWebHashHistory(),
    routes
})