import Vue from 'vue'
import VueRouter from 'vue-router'
import Options from 'pages/Options.vue'
import AltWhatcher from 'pages/AltWatcher/AltWatcher.vue'
import ShikiDump from 'pages/ShikiDump/ShikiDump.vue'
import Player from 'pages/ShikiDump/Player.vue'
// import Catalog from 'pages/Catalog.vue'
// import CoursesOnMap from 'pages/CoursesOnMap.vue'

Vue.use(VueRouter)

const routes = [
    { path: "/options", component: Options, meta: { title: 'Options' }},
    { path: "/", component: Options, meta: { title: 'Options' }},
    { path: "/altWatcher", component: AltWhatcher, meta: { title: 'AltWatcher' }},
    { path: "/shikiDump", component: ShikiDump, meta: { title: 'ShikiDump' }},
    { path: "/shikiDump/player", component: Player, meta: { title: 'ShikiDump' }},
    // { path: "/course/:id", component: Course, meta: { title: 'Поиск по карте' }},
    // { path: "/catalog", component: Catalog, meta: { title: 'Каталог' }},
    // { path: "/map", component: CoursesOnMap, meta: { title: 'Поиск по карте' }},
];


export default new VueRouter({
    // mode: 'history',
    routes
})