import Vue from 'vue'
import VueRouter from 'vue-router'
import Options from 'pages/Options.vue'
// import Catalog from 'pages/Catalog.vue'
// import CoursesOnMap from 'pages/CoursesOnMap.vue'

Vue.use(VueRouter)

const routes = [
    { path: "/options", component: Options, meta: { title: 'Options' }},
    // { path: "/course/:id", component: Course, meta: { title: 'Поиск по карте' }},
    // { path: "/catalog", component: Catalog, meta: { title: 'Каталог' }},
    // { path: "/map", component: CoursesOnMap, meta: { title: 'Поиск по карте' }},
];


export default new VueRouter({
    // mode: 'history',
    routes
})