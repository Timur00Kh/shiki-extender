import Vue from 'vue'
import 'babel-polyfill'
import App from './components/App.vue'

function start() {
    if (
        !['/animes/', '/mangas/', '/ranobe/']
            .reduce((sum, e) => ~window.location.pathname.indexOf(e) ? true : sum, false)
    ) {
        return;
    }

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