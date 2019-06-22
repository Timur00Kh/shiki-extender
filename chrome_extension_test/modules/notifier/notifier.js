function getNotifier() {
    let notifier = {
        getUpdates: getUpdates
    };

    async function getUpdates(page) {
        if (typeof page !== "number") page = 0;
        let url = 'https://shikimori.org/moderations/anime_video_reports/page/' + page;
        let videoData;

        try {
            let response = await axios.get(url);
            videoData = Array.prototype.slice.call((new DOMParser()).parseFromString(response.data, "text/html").querySelectorAll('.b-log_entry.video')).filter(e => e.querySelector('.kind.uploaded'));
            console.log(videoData);

            function parseVideoElements(nodeArr) {
                return nodeArr.map(function (value, index, array) {
                    let changes = Array.prototype.slice.call(value.querySelectorAll('.change'))
                        .reduce(function (c, a) {
                            // c[a.innerText.split(':')[0]] = a.innerText.split(':')[1];

                            let property = a.innerText.split(':')[0];
                            let val = a.innerText.split(':')[1];

                            switch (property) {
                                case 'ID': {
                                    let n = val.match(/([0-9]+)/);
                                    c.id = n ? Number(n[0]) : val;
                                    break;
                                }
                                case 'Author':
                                case 'Автор': {
                                    c.author = val;
                                    break;
                                }
                                case 'Video quality':
                                case 'Качество видео': {
                                    c.quality = val;
                                    break;
                                }
                                case 'Video Type':
                                case 'Перевод': {

                                    switch (val) {
                                        case 'subtitles':
                                        case "субтитры": {
                                            c.type = 'SUB';
                                            break;
                                        }
                                        case 'fandub':
                                        case "озвучка": {
                                            c.type = 'DUB';
                                            break;
                                        }
                                        case 'original':
                                        case 'raw':
                                        case "оригинал": {
                                            c.type = 'RAW';
                                            break;
                                        }
                                    }

                                    break;
                                }
                                case 'Episode':
                                case 'Эпизод': {
                                    c.episode = Number(val);
                                    break;
                                }
                                case 'Video dub/sub language':
                                case 'Язык перевода': {

                                    switch (val) {
                                        case 'russian':
                                        case "русский": {
                                            c.lang = 'RU';
                                            break;
                                        }
                                        case 'english':
                                        case "английский": {
                                            c.lang = 'EN';
                                            break;
                                        }
                                        case 'original':
                                        case "оригинал": {
                                            c.lang = 'RAW';
                                            break;
                                        }
                                    }

                                    break;
                                }
                            }

                            return c;
                        }, {});

                    changes.url = value.querySelector('a').href;
                    let titleId = changes.url && changes.url.split('/').length > 4 ? changes.url.split('/')[4].match(/([0-9]+)-?/) : null;
                    changes.titleId = titleId ? Number(titleId[1]) : null;
                    changes.user = {
                        url: value.querySelector('.b-user16 a').href,
                        name: value.querySelector('.b-user16 a').innerText,
                    };

                    // console.log(changes);
                    return changes;
                });
            }

            let pending = parseVideoElements(videoData.filter(e => e.querySelector('.pending')));
            let accepted = parseVideoElements(videoData.filter(e => e.querySelector('.accepted')));


            console.table(accepted);
            console.log({
                pending: pending,
                accepted: accepted
            });
            return {
                pending: pending,
                accepted: accepted
            }
        } catch (e) {
            console.error(e);
        }

    }

    function check(updates) {

    }

    return notifier;
}