import Vue from "vue";
import VueRouter from "vue-router";
import Options from "pages/Options.vue";
import AltWhatcher from "pages/AltWatcher/AltWatcher.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/options", component: Options, meta: { title: "Options" } },
  { path: "/", component: Options, meta: { title: "Options" } },
  {
    path: "/altWatcher",
    component: AltWhatcher,
    meta: { title: "AltWatcher" },
  },
];

export default new VueRouter({
  // mode: 'history',
  routes,
});
