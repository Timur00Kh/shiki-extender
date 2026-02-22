import { createRouter, createWebHashHistory } from "vue-router";
import Options from "./Options.vue";
import AltWatcher from "./AltWatcher/AltWatcher.vue";

const routes = [
  { path: "/", component: Options, meta: { title: "Options" } },
  { path: "/options", component: Options, meta: { title: "Options" } },
  { path: "/altWatcher", component: AltWatcher, meta: { title: "AltWatcher" } },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
