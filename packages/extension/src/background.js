import { openDB } from 'idb';
import axios from 'axios';
import { apiDomain } from "./options/config";

// Открытие базы данных
const dbPromise = openDB('linksDb', 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains('link')) {
            db.createObjectStore('link', { keyPath: 'hash_id', autoIncrement: true });
        }
    },
});

// Получить все ссылки
async function getAllLinks() {
    const db = await dbPromise;
    return db.getAll('link');
}

// Получить одну ссылку по hash_id
async function getLink(hash_id) {
    const db = await dbPromise;
    return db.get('link', hash_id);
}

// Обновить/добавить ссылку
async function putLink(link) {
    const db = await dbPromise;
    return db.put('link', link);
}

// onMessage обработчик
chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
    switch (req.do) {
        case "getAltWatcherLinks": {
            getAllLinks().then(results => {
                sendResponse(results);
            });
            return true;
        }
        case "altWatcherIsEnabled": {
            chrome.storage.local.get(['altWatcher'], function (result) {
                sendResponse(result.altWatcher || null);
            });
            return true;
        }
        case "altWatcherLinkUsed": {
            if (!req.hash_id) return;
            getLink(req.hash_id).then(link => {
                if (!link) return;
                link.used = link.used ? link.used + 1 : 1;
                putLink(link);
            });
            return true;
        }
    }
});

chrome.runtime.onInstalled.addListener(onStartup);
async function onStartup() {
    const db = await dbPromise;
    const count = await db.count('link');
    if (count > 0) return;

    // let { data } = await axios.get(`${apiDomain}/altWatcher/defaultLinks`);
    // for (const e of data) {
    //     await db.put('link', {
    //         id: e.id,
    //         title: e.title,
    //         link: e.link,
    //         tags: {
    //             manga: e.manga,
    //             anime: e.anime,
    //             ranobe: e.ranobe,
    //         },
    //         approved: e.approved,
    //         number_of_downloads: e.number_of_downloads,
    //         description: e.description,
    //         hash_id: e.hash_id || e.id // если есть hash_id, иначе id
    //     });
    // }
}

