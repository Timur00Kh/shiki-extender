import { createApp } from 'vue'
import App from './components/App.vue'

console.log("---", 'altWatcher initialized');

async function start() {


    if (
        !['/animes/', '/mangas/', '/ranobe/']
            .reduce((sum, e) => ~window.location.pathname.indexOf(e) ? true : sum, false)
    ) {
        return;
    }

    if (await new Promise(resolve => chrome.runtime.sendMessage({ do: "altWatcherIsEnabled" }, res => resolve(res))) === "false") return;

    console.log("---", 'altWatcher started');

    const existingContainer = document.getElementById('altWatcherContainer');
    if (existingContainer) {
        existingContainer.remove();
    }

    const infoRight = document.querySelector('.c-info-right');
    if (infoRight) {
        const altWatcherDiv = document.createElement('div');
        altWatcherDiv.id = 'altWatcher';
        infoRight.appendChild(altWatcherDiv);
    }

    const app = createApp(App)
    app.mount('#altWatcher')
}

document.addEventListener('DOMContentLoaded', start);
document.addEventListener('page:load', start);
document.addEventListener('turbolinks:load', start);
setTimeout(start, 2000);