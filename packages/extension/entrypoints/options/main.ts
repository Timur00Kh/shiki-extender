import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

router.beforeEach((to) => {
  const title = to.meta?.title as string | undefined;
  if (title) document.title = title;
});

const app = createApp(App);
app.use(router);
app.mount("#app");
