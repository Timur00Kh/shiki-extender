import Vue from 'vue'
import App from 'pages/App.vue'
import router from 'router/router'
import axios from 'axios'
import 'babel-polyfill'

new Vue({
    el: '#app',
    router,
    // components: {  },
    render: a => a(App)
});