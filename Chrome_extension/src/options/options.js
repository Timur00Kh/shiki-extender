import { createApp } from 'vue'
import App from 'pages/App.vue'
import router from 'router/router'
import axios from 'axios'
import 'highlight-within-textarea'
import 'highlight-within-textarea/jquery.highlight-within-textarea.css'

router.beforeEach((to, from, next) => {
    console.log('---router.beforeEach', to);
    document.title = to.meta.title;
    next()
});

const app = createApp(App)
app.use(router)
app.mount('#app')