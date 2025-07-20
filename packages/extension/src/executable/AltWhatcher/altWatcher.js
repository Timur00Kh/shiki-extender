import { createApp } from 'vue'
import App from './components/AltWatcher.vue'

console.log("---", 'altWatcher initialized');

let app = null;

async function start() {
    if (
        !['/animes/', '/mangas/', '/ranobe/']
            .reduce((sum, e) => ~window.location.pathname.indexOf(e) ? true : sum, false)
    ) {
        return;
    }

    if (await new Promise(resolve => chrome.runtime.sendMessage({ do: "altWatcherIsEnabled" }, res => resolve(res))) === "false") return;

    console.log("---", 'altWatcher started');

    // Очистка предыдущего экземпляра для HMR
    if (app) {
        try {
            app.unmount();
        } catch (e) {
            console.log('App unmount error:', e);
        }
        app = null;
    }

    // Удаление существующего контейнера
    const existingContainer = document.getElementById('altWatcherContainer');
    if (existingContainer) {
        existingContainer.remove();
    }

    const existingAltWatcher = document.getElementById('altWatcher');
    if (existingAltWatcher) {
        existingAltWatcher.remove();
    }

    const infoRight = document.querySelector('.c-info-right');
    if (infoRight) {
        const altWatcherDiv = document.createElement('div');
        altWatcherDiv.id = 'altWatcher';
        infoRight.appendChild(altWatcherDiv);

        // Создание нового приложения
        app = createApp(App);
        app.mount('#altWatcher');
    }
}

// Hot Module Replacement поддержка
if (import.meta.hot) {
    import.meta.hot.accept('./components/AltWatcher.vue', () => {
        console.log('HMR: App.vue updated, restarting...');
        start();
    });
}

document.addEventListener('DOMContentLoaded', start);
document.addEventListener('page:load', start);
document.addEventListener('turbolinks:load', start);
setTimeout(start, 2000);