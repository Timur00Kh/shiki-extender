import db from './libs/db';
import axios from 'axios';
import 'babel-polyfill'
import {apiDomain} from "./options/config";

/*DataBases*/
let linksDb;
db.open({
    server: 'linksDb',
    version: 1,
    schema: {
        link: {
            key: {keyPath: 'hash_id', autoIncrement: true, unique: true},
        }
    }
}).then((serv) => {
    let self = this;
    linksDb = serv;
});



chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
    console.log(req);

    switch (req.do) {
        case "getAltWatcherLinks": {
            linksDb.link.query()
                .all()
                .execute()
                .then(results => {
                    sendResponse(results);
                    console.log(results);
                });
            return true;
        }
        case "altWatcherIsEnabled": {
            chrome.storage.local.get(['altWatcher'], function(result) {
                sendResponse(result.altWatcher || null);
            });
            return true;
        }
        case "altWatcherLinkUsed": {
            if (!linksDb) return;
            linksDb.link.get(req.hash_id)
                .then(link => {
                    if (!link) return;
                    link.used = link.used ? link.used + 1 : 1;
                    linksDb.link.put(link);
                });
            return true;
        }
    }
});

chrome.runtime.onInstalled.addListener(onStartup);
async function onStartup() {
    let serv = await db.open({
        server: 'linksDb',
        version: 1,
        schema: {
            link: {
                key: {keyPath: 'hash_id', autoIncrement: true, unique: true},
            }
        }
    });

    let results = await serv.link.query()
        .all()
        .execute();

    if (results && results.length > 0) return;

    let {data} = await axios.get(`${apiDomain}/altWatcher/defaultLinks`);
    data.forEach(e => {
        serv.link.put({
            id: e.id,
            title: e.title,
            link: e.link,
            tags: {
                manga: e.manga,
                anime: e.anime,
                ranobe: e.ranobe,
            },
            approved: e.approved,
            number_of_downloads: e.number_of_downloads,
            description: e.description,
        });
    });
}

