import Vue from 'vue'
import 'babel-polyfill'
import App from './components/App.vue'
import BootstrapVue from 'bootstrap-vue'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue);
console.log("---", 'altWatcher initialized');

async function start() {


    if (
        !['/animes/', '/mangas/', '/ranobe/']
            .reduce((sum, e) => ~window.location.pathname.indexOf(e) ? true : sum, false)
    ) {
        return;
    }

    if (await new Promise(resolve => chrome.runtime.sendMessage({do: "altWatcherIsEnabled"}, res => resolve(res))) === "false") return;

    console.log("---", 'altWatcher started');

    $('#altWatcherContainer').remove();

    $('.c-info-right').append(
        $('<div id="altWatcher"/>')
    );

    new Vue({
        el: '#altWatcher',
        render: a => a(App)
    });
}

$(document).ready(start);
$(document).on('page:load', start);
$(document).on('turbolinks:load', start);