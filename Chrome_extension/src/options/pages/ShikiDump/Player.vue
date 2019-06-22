<template>
    <div>
        <div class="card h-100">
            <div v-if="anime" class="card-header text-center">
                {{anime.russian + ' / ' + anime.english }}
            </div>
            <div v-if="!currentVideo" class="card-body text-center py-5">
                <div class="row align-content-center justify-content-center h-100">
                    <div class="col-auto my-5">
                        <h5 class="card-title mt-5">¯\_(ツ)_/¯</h5>
                        <p class="card-text mb-5">Видео не найдено.</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="currentVideo"  class="outer">
            <div class="inner">
                <iframe allowfullscreen :src="currentVideo.url"></iframe>
            </div>
        </div>
        <div class="row justify-content-center mt-2">
            <div class="col-auto mt-2">
                <button @click="curQuery.episode--" class="btn btn-light">
                    <i class="fas fa-backward "></i>
                    Предыдущая
                </button>
            </div>
            <div class="col-2 col-lg-3 col-xl-2  mt-2">
                <div class="input-group">
                    <input v-model="curQuery.episode" type="number" class="form-control" placeholder="#ep">
                    <div class="input-group-append">
                        <span v-if="anime" class="input-group-text">/{{anime.episodes}}</span>
                    </div>
                </div>
            </div>
            <div class="col-auto mt-2">
                <button @click="curQuery.episode++" class="btn btn-light">
                    Следующая
                    <i class="fas fa-forward"></i>
                </button>
            </div>
            <div class="col-auto mt-2">
                <button @click="incShikiRate()"
                        :disabled="!shikimori.user"
                        :class="'btn btn-light ' +
                        (shikimori.userRate && (
                            shikimori.userRate.episodes >= curQuery.episode ? 'text-success' : ''
                        ))">
                    Просмотрено
                    <i class="fas fa-check"></i>
                </button>
            </div>
        </div>
        <div v-if="computedVideos.length > 0" class="row mt-4">
            <div class="col-12">
                <div class="btn-group btn-group-toggle" data-toggle="buttons">

                    <label v-for="vt in videoTypes" @click="onVideoTypeChange(vt)" :class="'btn btn-secondary ' + (videoType === vt && 'active')">
                        <input @click="videoType = vt"  type="radio" :checked="videoType === vt"> {{vt}}
                    </label>
                </div>

                <button class="btn btn-secondary" @click="sortVideos()">{{videoSorter.name}}</button>

            </div>
            <div class="col-12 mt-2">
                <ul class="list-unstyled">
                    <li v-for="video in computedVideos" :key="video.id">

                        <a :href="fullPath" @click="onVideoClick(video)">
                            <component :is="video.id === currentVideo.id ? 'mark' : 'span'">
                                <i class="fas fa-chevron-right"></i>
                                <small class="text-muted">[{{video.language.slice(0, 2)}}]</small>
                                <small class="text-muted"><b>({{video.hostname}})</b></small>
                                {{video.author}}
                            </component>

                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="row justify-content-center mt-4">
            <div class="col-auto">
                <small class="text-muted">powered by <a href="https://anime.wownik.ru/">anime.wownik.ru</a></small>
            </div>
        </div>
    </div>
</template>

<script>
    const api = 'https://anime.wownik.ru/api/videos/get_by_anime_id_and_episode';
    const shikiApiWhoami = 'https://shikimori.one/api/users/whoami';
    import axios from 'axios'

    export default {
        name: "Player",
        data() {
            return {
                fullPath: '#' + this.$route.fullPath,
                curQuery: {
                    id: this.$route.query.id || null,
                    episode: this.$route.query.episode || 1,
                    lastAuthor: localStorage.getItem("shikiDump/lastAuthor"),
                },
                videoType: localStorage.getItem("shikiDump/videoType") || "озвучка",
                currentVideo: {
                    id: 880997,
                    url: "http://smotretanime.ru/translations/embed/2200494",
                    anime_id: 37520,
                    anime_english: "Dororo",
                    anime_russian: " Дороро",
                    episode: 1,
                    kind: "озвучка",
                    language: "russian",
                    quality: "tv",
                    author: "AniStar (Zendos)",
                    watches_count: 29,
                    uploader: "Ruwasu"
                },
                videoSorter: getNextVideoSorter(),
                videos: [{"id":782877,"url":"http://video.sibnet.ru/shell.php?videoid=3389518","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"озвучка","language":"russian","quality":"tv","author":"AniStar (Zendos)","watches_count":2,"uploader":"KoChan"},{"id":782878,"url":"http://smotretanime.ru/translations/embed/1861397","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"озвучка","language":"russian","quality":"tv","author":"AniStar (Zendos)","watches_count":344,"uploader":"KoChan"},{"id":782886,"url":"http://smotretanime.ru/translations/embed/1861393","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"оригинал","language":"original","quality":"tv","author":"Erai-raws","watches_count":49,"uploader":"Qubay"},{"id":782889,"url":"http://video.sibnet.ru/shell.php?videoid=3389584","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"озвучка","language":"russian","quality":"tv","author":"AnimeVost (Zunder)","watches_count":18,"uploader":"sttany"},{"id":782890,"url":"http://video.sibnet.ru/shell.php?videoid=3389600","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"озвучка","language":"russian","quality":"tv","author":"AniStar (Zendos)","watches_count":202,"uploader":"sttany"},{"id":783086,"url":"http://smotretanime.ru/translations/embed/1861381","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"субтитры","language":"english","quality":"tv","author":"Crunchyroll","watches_count":207,"uploader":"Solveus"},{"id":783093,"url":"http://video.sibnet.ru/shell.php?videoid=3389373","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"озвучка","language":"russian","quality":"tv","author":"AnimeVost (Zunder)","watches_count":91,"uploader":"Probni"},{"id":783184,"url":"http://vk.com/video_ext.php?oid=175436626&id=456239224&hash=bc0a2e5237c704ef","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"озвучка","language":"russian","quality":"tv","author":"ColdFilm","watches_count":270,"uploader":"Probni"},{"id":783186,"url":"http://ok.ru/videoembed/1044795165354","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"оригинал","language":"original","quality":"tv","author":"Ohys-Raws","watches_count":3,"uploader":"Probni"},{"id":783294,"url":"http://video.sibnet.ru/shell.php?videoid=3390146","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"озвучка","language":"russian","quality":"tv","author":"AniMaunt (Shachiburi)","watches_count":38,"uploader":"Probni"},{"id":783296,"url":"http://smotretanime.ru/translations/embed/1862353","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"озвучка","language":"russian","quality":"tv","author":"AniMaunt (Shachiburi)","watches_count":743,"uploader":"Nokinal"},{"id":783753,"url":"http://sovetromantica.com/embed/episode_524_1-subtitles","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"субтитры","language":"russian","quality":"tv","author":"SovetRomantica","watches_count":732,"uploader":"GooG2e"},{"id":783793,"url":"http://video.sibnet.ru/shell.php?videoid=3390697","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"субтитры","language":"russian","quality":"tv","author":"Максимов","watches_count":385,"uploader":"Probni"},{"id":784289,"url":"http://smotretanime.ru/translations/embed/1865055","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"озвучка","language":"russian","quality":"tv","author":"Get Smart Group (Persona99)","watches_count":8,"uploader":"Дмитрий Леманн"},{"id":784290,"url":"http://video.sibnet.ru/shell.php?videoid=3391986","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"озвучка","language":"russian","quality":"tv","author":"Get Smart Group (Persona99)","watches_count":12,"uploader":"Дмитрий Леманн"},{"id":784291,"url":"http://vk.com/video_ext.php?oid=-53947445&id=456241380&hash=35bca56ada4d0f77","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"озвучка","language":"russian","quality":"tv","author":"Get Smart Group (Persona99)","watches_count":5,"uploader":"Дмитрий Леманн"},{"id":784619,"url":"http://video.sibnet.ru/shell.php?videoid=3391923","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"озвучка","language":"russian","quality":"tv","author":"AniMaunt (Shachiburi)","watches_count":778,"uploader":"Probni"},{"id":784861,"url":"http://smotretanime.ru/translations/embed/1865770","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"озвучка","language":"russian","quality":"tv","author":"FRONDA","watches_count":10,"uploader":"NerV"},{"id":785464,"url":"http://smotretanime.ru/translations/embed/1866671","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"субтитры","language":"russian","quality":"tv","author":"Максимов","watches_count":33,"uploader":"NerV"},{"id":787939,"url":"http://smotretanime.ru/translations/embed/1868396","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"субтитры","language":"russian","quality":"tv","author":"AniPlay","watches_count":298,"uploader":"NerV"},{"id":788931,"url":"http://ok.ru/videoembed/782264306228","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"озвучка","language":"russian","quality":"tv","author":"SHIZA Project (Dancel & Mamoru & nDrOiDze & AmnesiaMoon & Snowly & Лизавета & Pandora)","watches_count":3,"uploader":"Probni"},{"id":789601,"url":"http://video.sibnet.ru/shell.php?videoid=3395218","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"озвучка","language":"russian","quality":"tv","author":"SHIZA Project (Dancel & Mamoru & nDrOiDze & AmnesiaMoon & Snowly & Лизавета & Pandora)","watches_count":53,"uploader":"Kira157"},{"id":789611,"url":"http://vk.com/video_ext.php?oid=-12323082&id=456247639&hash=6ddccaf87d315a21","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"озвучка","language":"russian","quality":"tv","author":"SHIZA Project (Dancel & Mamoru & nDrOiDze & AmnesiaMoon & Snowly & Лизавета & Pandora)","watches_count":146,"uploader":"Kira157"},{"id":793412,"url":"http://smotretanime.ru/translations/embed/1877183","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"субтитры","language":"russian","quality":"tv","author":"Максимов","watches_count":0,"uploader":"NerV"},{"id":793451,"url":"http://smotretanime.ru/translations/embed/1877205","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"субтитры","language":"russian","quality":"tv","author":"Максимов","watches_count":0,"uploader":"NerV"},{"id":793738,"url":"http://smotretanime.ru/translations/embed/1877635","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"субтитры","language":"russian","quality":"tv","author":"Максимов","watches_count":19,"uploader":"NerV"},{"id":797502,"url":"http://ok.ru/videoembed/921041701578","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"озвучка","language":"russian","quality":"tv","author":"ColdFilm","watches_count":35,"uploader":"Probni"},{"id":801893,"url":"http://smotretanime.ru/translations/embed/1864763","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"оригинал","language":"original","quality":"tv","author":"Leopard-Raws","watches_count":0,"uploader":"AndroMazel"},{"id":801894,"url":"http://smotretanime.ru/translations/embed/1860873","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"оригинал","language":"original","quality":"tv","author":"Ohys-Raws","watches_count":2,"uploader":"AndroMazel"},{"id":802930,"url":"http://vk.com/video_ext.php?oid=-53947445&id=456241764&hash=230420074fc81f28","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"озвучка","language":"russian","quality":"tv","author":"Get Smart Group (Persona99)","watches_count":23,"uploader":"Дмитрий Леманн"},{"id":819609,"url":"http://smotretanime.ru/translations/embed/1922333","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"субтитры","language":"russian","quality":"tv","author":"Максимов","watches_count":1,"uploader":"NerV"},{"id":819653,"url":"http://smotretanime.ru/translations/embed/1922398","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"субтитры","language":"russian","quality":"tv","author":"Максимов","watches_count":123,"uploader":"NerV"},{"id":830831,"url":"http://video.sibnet.ru/shell.php?videoid=3436904","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"озвучка","language":"russian","quality":"tv","author":"ColdFilm","watches_count":15,"uploader":"Probni"},{"id":869202,"url":"http://video.sibnet.ru/shell.php?videoid=3503360","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"озвучка","language":"russian","quality":"tv","author":"KANSAI Studio","watches_count":27,"uploader":"ЗЕФNR"},{"id":881098,"url":"http://vk.com/video_ext.php?oid=-104448771&id=456239111&hash=9bdd570cfbb27f61","anime_id":37491,"anime_english":"Gintama.: Shirogane no Tamashii-hen - Kouhan-sen","anime_russian":"Гинтама 8","episode":1,"kind":"субтитры","language":"russian","quality":"tv","author":"Kotodama","watches_count":130,"uploader":"Probni"}].map(e => ({
                    ...e,
                    hostname: (new URL(e.url)).hostname
                })),
                shikimori: {
                    user: null,
                    userRate: null
                },
                anime: null
            }
        },
        methods: {
            async getLinks() {
                let {id, episode} = this.curQuery;
                let {data: {videos}} = await axios.get(`${api}?anime_id=${id}&episode=${episode}`);
                console.table(videos);
                if (Array.isArray(videos)) {
                    this.videos = videos.map(e => ({
                        ...e,
                        hostname: (new URL(e.url, 'http://www.example.com')).hostname
                    }));
                } else {
                    alert(data);
                }
            },
            async startSearch() {
                try {
                    await this.getLinks();
                } catch (e) {
                    console.error(e);
                }

                let [videoType, lastAuthor, hostname, videoId, lang] = [
                    localStorage.getItem("shikiDump/videoType"),
                    localStorage.getItem("shikiDump/lastAuthor"),
                    localStorage.getItem("shikiDump/hostname"),
                    Number(localStorage.getItem("shikiDump/videoId")),
                    localStorage.getItem("shikiDump/lang"),
                ];

                let sorted = this.videos.slice().sort((a, b) => {
                    if (a.kind === videoType &&
                        b.kind !== videoType) {
                        return -1
                    }
                    if (b.kind === videoType &&
                        a.kind !== videoType) {
                        return 1
                    }
                    if (a.kind === lang &&
                        b.kind !== lang) {
                        return -1
                    }
                    if (b.kind === lang &&
                        a.kind !== lang) {
                        return 1
                    }
                    if (a.author.toLowerCase() === lastAuthor.toLowerCase() &&
                        b.author.toLowerCase() !== lastAuthor.toLowerCase()) {
                        return -1
                    }
                    if (b.author.toLowerCase() === lastAuthor.toLowerCase() &&
                        a.author.toLowerCase() !== lastAuthor.toLowerCase()) {
                        return 1
                    }
                    if (hostname === a.hostname &&
                        hostname !== b.hostname) {
                        return -1
                    }
                    if (hostname === b.hostname &&
                        hostname !== a.hostname) {
                        return 1
                    }
                    if (videoId === a.id &&
                        videoId !== b.id) {
                        return -1
                    }
                    if (videoId === b.id &&
                        videoId !== a.id) {
                        return 1
                    }
                    return 0
                });

                if (sorted.length > 0) {
                    let c = sorted[0];
                    this.currentVideo = c;
                    this.videoType =  c.kind;
                    document.title = `#${c.episode} / ${c.anime_russian} / ${c.anime_english}`
                } else {
                    this.currentVideo = null;
                }
            },
            sortVideos() {
                this.videoSorter = getNextVideoSorter()
            },
            onVideoClick(video) {
                this.currentVideo = video;
                localStorage.setItem("shikiDump/lastAuthor", video.author);
                localStorage.setItem("shikiDump/hostname", video.hostname);
                localStorage.setItem("shikiDump/videoType", video.kind);
                localStorage.setItem("shikiDump/videoId", video.id);
                localStorage.setItem("shikiDump/lang", video.language);
            },
            onVideoTypeChange(videoType) {
                this.videoType = videoType;
            },
            async incShikiRate() {
                if (this.shikimori.userRate) {
                    const api = `https://shikimori.one/api/v2/user_rates/${this.shikimori.userRate.id}`;
                    await axios.put(api, {
                        episodes: this.curQuery.episode
                    });
                } else {
                    const api = `https://shikimori.one/api/v2/user_rates`;
                    await axios.post(api, {
                        "user_rate": {
                            "episodes": "1",
                            "target_id": this.curQuery.id,
                            "target_type": "Anime",
                            "user_id": this.shikimori.user.id,
                        }
                    })
                }

                this.curQuery.episode++;
            },
            async connectShiki() {
                let {data: user} = await axios.get(shikiApiWhoami);
                this.shikimori.user = user;
                let userRates = [];

                let page = 1;
                do {
                    let {data} = await axios.get(`https://shikimori.one/api/users/${user.id}/anime_rates?limit=5000&page=${page}`);
                    userRates.push(...data);
                    if ([...data].length > 5000) {
                        page++;
                    } else {
                        page = null;
                    }
                } while (page);

                console.log('userRates', userRates);

                let rate = userRates.find(e => e.anime && (e.anime.id === Number(this.curQuery.id)));
                if (rate && rate.id) {
                    this.shikimori.userRate = rate;
                    console.log('rate', rate);
                    if (!this.$route.query.episode) {
                        if (rate.status === "completed") {
                            this.curQuery.episode = 1
                        } else {
                            this.curQuery.episode = rate.episodes + 1;
                        }
                    }
                }
            },
            async getAnime() {
                const shikiAnimeApi = 'https://shikimori.one/api/animes';
                let {data} = await axios.get(`${shikiAnimeApi}/${this.curQuery.id}`);
                this.anime = data;
                console.log(data);
            }
        },
        computed: {
            computedVideos() {
                return this.videos
                    .filter(e => e.kind === this.videoType)
                    .sort(this.videoSorter.sorter)

            },
            videoTypes() {
                return this.videos
                    .map(e => e.kind)
                    .reduce((arr, e) => {
                        if (!arr.find(t => t === e)) arr.push(e);
                        return arr;
                    }, [])
                    .slice()
            }
        },
        watch:{
            "curQuery.episode": async function (newVal, oldVal) {
                this.startSearch();
                this.$router.push({
                    path: '/shikiDump/player',
                    query: {
                        id: this.curQuery.id,
                        episode: newVal,
                    },
                })
            }
        },
        async created() {
            this.getAnime();
            await this.connectShiki();
            this.startSearch();
        }
    }

    let getNextVideoSorter = (() => {
        let cur = 0;

        let videoSorters = [
            {
                name: 'Не сортируется',
                sorter: () => 0
            },
            {
                name: 'Сортировка по hostname',
                sorter: (a, b) => {
                    if (a.hostname > b.hostname) {
                        return 1;
                    }
                    if (a.hostname < b.hostname) {
                        return -1;
                    }
                    if (a.author > b.author) {
                        return 1;
                    }
                    if (a.author < b.author) {
                        return -1;
                    }
                    return 0;
                }
            },
            {
                name: 'Сортировака по автору',
                sorter: (a, b) => {
                    if (a.author > b.author) {
                        return 1;
                    }
                    if (a.author < b.author) {
                        return -1;
                    }
                    if (a.hostname > b.hostname) {
                        return 1;
                    }
                    if (a.hostname < b.hostname) {
                        return -1;
                    }
                    return 0;
                }
            }
        ];


        return () => {
            console.log('---getNextVideoSorter')
            console.log(videoSorters[cur++])
            if (cur >= videoSorters.length) cur = 0;
            return videoSorters[cur];
        }
    })();


</script>

<style scoped>
    iframe {
        min-width: 400px;
        width: 100%;
        height: 100%;
        border: 0
    }

    .outer {
        position: relative; }
    .outer:before {
        display: block;
        content: "";
        width: 100%;
        padding-top: 56.25%; }
    .outer > .inner {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0; }
</style>