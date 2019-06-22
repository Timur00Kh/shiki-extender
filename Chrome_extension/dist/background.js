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
    }
});

chrome.runtime.onInstalled.onStartup(function () {
    db.open({
        server: 'linksDb',
        version: 1,
        schema: {
            link: {
                key: {keyPath: 'hash_id', autoIncrement: true, unique: true},
            }
        }
    }).then((serv) => {
        serv.link.query()
            .all()
            .execute()
            .then(results => {
                if (results) {

                }
            });
    });
})