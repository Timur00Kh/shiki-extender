import Vue from 'vue'
import App from 'pages/App.vue'
import router from 'router/router'
import axios from 'axios'
import 'babel-polyfill'
import 'highlight-within-textarea'
import 'highlight-within-textarea/jquery.highlight-within-textarea.css'




router.beforeEach((to, from, next) => {
    console.log('---router.beforeEach', to);
    document.title = to.meta.title;
    next()
});

new Vue({
    el: '#app',
    router,
    // components: {  },
    render: a => a(App),
});