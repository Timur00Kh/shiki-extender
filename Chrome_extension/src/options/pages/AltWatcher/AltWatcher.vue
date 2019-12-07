<template>
    <div>
        <ul class="nav nav-pills nav-fill">
            <li class="nav-item pr-1">
                <a @click="current = 'added'" :class="'nav-link ' + (current === 'added' ? 'active' : 'bg-light')"
                   href="#/altWatcher">Добавленное</a>
            </li>
            <li class="nav-item px-1">
                <a @click="current = 'search'" :class="'nav-link ' + (current === 'search' ? 'active' : 'bg-light')"
                   href="#/altWatcher">Поиск</a>
            </li>
            <li class="nav-item pl-1">
                <a @click="current = 'faq'" :class="'nav-link ' + (current === 'faq' ? 'active' : 'bg-light')"
                   href="#/altWatcher">Настройки / FAQ</a>
            </li>
        </ul>

        <div v-if="current === 'faq'" class="card mt-3">
            <div class="card-body">
                <vue-markdown :source="faq"></vue-markdown>
            </div>
        </div>

        <div v-if="current === 'added'" class="card mt-3">
            <div class="card-body">
                <div class="row justify-content-between">
                    <div class="col-auto">
                        <h3 class="card-title" id="added">Добавленное</h3>
                    </div>
                    <div class="col-auto">
                        <button @click="addNewLink()" style="margin-top: -5px" type="button"
                                class="btn btn-primary btn-lg"><i class="fas fa-plus-square"></i> Добавить
                        </button>
                    </div>
                </div>

                <transition name="fade">
                    <div v-if="links.length > 0" class="card mt-2">
                        <ul class="list-group list-group-flush">
                            <li v-for="link in links" class="list-group-item">
                                <div class="row justify-content-between">
                                    <div class="col-auto">
                                        <h4 class="card-title">
                                            {{link.title}}
                                            <a @click="showModal(link)" href="#/altWatcher"
                                               class="badge badge-pill badge-light">
                                                <i class="far fa-edit"></i>
                                            </a>
                                        </h4>
                                    </div>
                                    <div class="col-auto">
                                        <h6 class="mt-2">
                                            <span v-if="link.tags.anime" class="badge badge-primary">Anime</span>
                                            <span v-if="link.tags.manga" class="badge badge-secondary">Manga</span>
                                            <span v-if="link.tags.ranobe" class="badge badge-success">Ranobe</span>
                                            <span v-if="Object.keys(link.tags).reduce((sum, e) => (link.tags[e] & 1) > 0 ? true : sum, false)"
                                                  class="badge badge-danger">Rx</span>
                                        </h6>
                                    </div>
                                </div>

                                <div class="input-group flex-nowrap">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="addon-wrapping">link</span>
                                    </div>
                                    <input type="text" :value="link.link" class="form-control" placeholder="URL"
                                           disabled>
                                </div>
                            </li>

                        </ul>
                    </div>
                </transition>


                <div v-if="links.length === 0" class="card mt-2 text-center">
                    <transition name="fade" mode="out-in">
                        <div v-if="loading" class="card-header py-5 ">
                            <!--<i class="fas fa-spinner fa-5x fa-spin"></i>-->
                            <i class="fas fa-sync fa-5x fa-spin"></i>
                        </div>
                        <div v-else class="card-header py-5 ">
                            <h5 class="card-title">Тут пусто.</h5>
                            <p class="card-text">Добавь ссылки собственоручно, либо перейди на страницу поиска.</p>
                            <a href="#" @click="current ='search'" class="btn btn-primary">Поиск</a>
                        </div>
                    </transition>
                </div>


                <button @click="addNewLink()" type="button" class="btn btn-primary btn-block mt-2"><i
                        class="fas fa-plus-square"></i> Добавить
                </button>
            </div>
        </div>

        <transition name="fade">
            <div v-if="modal" class="modal-backdrop fade show"></div>
        </transition>
        <transition name="slide-fade">
            <div @keypress.enter.exact="saveLink(modal)" v-if="modal" id="altWhatcherModal" class="modal fade show"
                 tabindex="-1" role="dialog"
                 aria-labelledby="altWhatcherModalLabel" style="padding-right: 17px; display: block;" aria-modal="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title" id="altWhatcherModalLabel">Редактировать ссылку</h4>
                            <button @click="modal = false" type="button" class="close" data-dismiss="modal"
                                    aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <h5>Название:</h5>
                            <div class="input-group flex-nowrap">
                                <!--<div class="input-group-prepend">-->
                                <!--<span class="input-group-text">Название</span>-->
                                <!--</div>-->
                                <input v-model="modal.title" type="text" class="form-control"
                                       placeholder="Название сервиса">
                            </div>
                            <h5 class="mt-4">Для чего использовать:</h5>
                            <!--bitmap (0 - all, 1 - hentai)-->
                            <div class="row tagButtons">
                                <div class="col-4 pr-2">
                                    <div class="btn-group">
                                        <button @click="modal.tags.anime = modal.tags.anime ^ 2"
                                                :class="'btn  btn-block ' + (modal.tags.anime & 2 ? 'btn-info' : 'btn-outline-info')"
                                                style="width: 100%"
                                        >
                                            Anime {{modal.tags.anime}}
                                        </button>
                                        <button @click="modal.tags.anime = modal.tags.anime ^ 1"
                                                :class="'btn ' + (modal.tags.anime & 1 ? 'btn-danger' : 'btn-outline-danger')">
                                            Rx
                                        </button>
                                    </div>
                                </div>
                                <div class="col-4 px-2">
                                    <div class="btn-group">
                                        <button @click="modal.tags.manga = modal.tags.manga  ^ 2"
                                                :class="'btn btn-block ' + (modal.tags.manga & 2  ? 'btn-warning' : 'btn-outline-warning')">
                                            Manga {{modal.tags.manga}}
                                        </button>
                                        <button @click="modal.tags.manga = modal.tags.manga ^ 1"
                                                :class="'btn ' + (modal.tags.manga & 1 ? 'btn-danger' : 'btn-outline-danger')">
                                            Rx
                                        </button>
                                    </div>

                                </div>
                                <div class="col-4 pl-2">
                                    <div class="btn-group ">
                                        <button @click="modal.tags.ranobe = modal.tags.ranobe  ^ 2"
                                                :class="'btn btn-block ' + (modal.tags.ranobe & 2   ? 'btn-secondary' : 'btn-outline-secondary')">
                                            Ranobe {{modal.tags.ranobe}}
                                        </button>
                                        <button @click="modal.tags.ranobe = modal.tags.ranobe ^ 1"
                                                :class="'btn ' + (modal.tags.ranobe & 1 ? 'btn-danger' : 'btn-outline-danger')">
                                            Rx
                                        </button>
                                    </div>

                                </div>
                                <div class="col-auto">
                                    <p><b>Используется для: </b>{{tagButtonsDesc}}</p>
                                </div>
                            </div>
                            <h5 class="">URL:</h5>
                            <textarea v-model="modal.link" class="form-control" id="highlight"
                                      style="width: 100%; height: 100px"></textarea>
                            <div class="row justify-content-between mt-2">
                                <div class="col-auto">
                                    <p><b style="font-size: .8rem">Добавить ингредиенты:</b></p>
                                </div>
                                <div class="col-auto">
                                    <button @click="insertTextAtCursor('{{title}}')" type="button"
                                            class="btn btn-secondary btn-sm">Название тайтла
                                    </button>
                                    <button @click="insertTextAtCursor('{{id}}')" type="button"
                                            class="btn btn-secondary btn-sm">id
                                    </button>
                                    <button @click="insertTextAtCursor('{{episode}}')" type="button"
                                            class="btn btn-secondary btn-sm">след. Эпизод
                                    </button>
                                </div>
                            </div>

                            <h5 class="mt-3">Описание:</h5>
                            <div class="input-group">
                                <textarea v-model="modal.description" class="form-control"
                                          aria-label="With textarea"></textarea>
                            </div>
                            <p v-if="modal.id" class="text-muted mb-0">id {{modal.id}}</p>
                            <MDCheckbox v-if="!modal.id"
                                        class="mt-2"
                                        title="Сервис будет опубликован и доступен для поиска всем пользователям."
                                        :label="'опубликовать'"
                                        :checked="modal.publish"
                                        :onChange="() => {modal.publish = !modal.publish}"/>
                        </div>
                        <div class="modal-footer">
                            <button v-if="modal.action !== 'addNewLink'" @click="deleteLink(modal)" type="button"
                                    class="btn btn-danger">Delete
                            </button>
                            <button @click="saveLink(modal)" type="button" class="btn btn-primary">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <Search v-if="current === 'search'" :links="links" :saveLink="saveLink">

        </Search>

    </div>
</template>

<script>
    import db from '../../../libs/db.js'
    import axios from 'axios'
    import {apiDomain} from "../../config";
    import Search from './components/Search.vue'
    import MDCheckbox from '../../components/MDCheckbox/MDCheckbox.vue'
    import 'babel-polyfill'
    import VueMarkdown from 'vue-markdown'




    export default {
        name: "AltWatcher",
        data() {
            return {
                loading: true,
                linksDb: null,
                current: "added",
                // current: "search",
                links: [],
                modal: null,
                faq: '# Загрузка...'
            }
        },
        components: {
            Search,
            MDCheckbox,
            VueMarkdown
        },
        mounted() {
            db.open({
                server: 'linksDb',
                version: 1,
                schema: {
                    link: {
                        key: {keyPath: 'hash_id', autoIncrement: true, unique: true},
                    }
                }
            }).then(serv => {
                let self = this;
                this.linksDb = serv;
                this.linksDb.link.query()
                    .all()
                    .execute()
                    .then(results => {
                        setTimeout(() => {
                            self.links = results;
                            self.loading = false;
                        }, 300);
                    })

            });
            axios.get(`${apiDomain}/altWatcher/faq`)
                .then(res => this.faq = res.data)
                .catch(err => this.faq = err)
        },
        watch: {
            modal(e) {
                if (e) document.querySelector('body').classList.add("modal-open");
                else document.querySelector('body').classList.remove("modal-open");
            }
        },
        methods: {
            async saveLink(l) {
                let linksDb = this.linksDb;
                l = JSON.parse(JSON.stringify(l));

                /*Приводим данные в порядок, публикуем*/
                if (l.action === 'addNewLink') delete l.action;


                if ('publish' in l) {
                    let publish = l.publish;

                    delete l.publish;

                    if (publish) {
                        try {
                            let {data: {id}} = await axios.post(`${apiDomain}/altWatcher/link`, {
                                title: l.title,
                                link: l.link,
                                description: l.description,
                                manga: l.tags.manga,
                                anime: l.tags.anime,
                                ranobe: l.tags.ranobe
                            });
                            l.id = id;
                        } catch (e) {
                            console.error(e.response);
                            alert(e.response && e.response.data && e.response.data.error || 'Что-то пошло не так');
                            return;
                        }
                    }
                }
                /*Добавляем в локал БД*/
                linksDb.link.put(l);

                /*Синхронизируем данные с представлением */
                if (l.hash_id && this.links.find(e => e.hash_id === l.hash_id)) {
                    this.links[
                        this.links.findIndex(e => e.hash_id === l.hash_id)
                        ] = l;
                } else {
                    this.links.push(l);
                }
                this.modal = null;
            },
            showModal(l) {
                this.modal = JSON.parse(JSON.stringify({
                    ...l,
                    publish: l.publish || false
                }));

                /*Гениальный костыль за 2 сек*/
                setTimeout(() => {
                    $('#highlight').highlightWithinTextarea({
                        highlight: [
                            {
                                highlight: '{{id}}',
                                className: 'blue'
                            },
                            {
                                className: 'blue',
                                highlight: /\{\{title=?(.*?)\}\}/g
                            },
                            {
                                highlight: "{{episode}}",
                                className: 'blue'
                            }
                        ]
                    });
                }, 300);

            },
            addNewLink() {
                this.showModal({
                    action: "addNewLink",
                    title: "",
                    link: "",
                    tags: {
                        manga: 0,
                        anime: 0,
                        ranobe: 0,
                    },
                    description: '',
                    publish: true
                });
            },
            deleteLink(l) {
                if (l.hash_id && this.links.find(e => e.hash_id === l.hash_id)) {
                    this.linksDb.link.delete(l.hash_id);
                    let i = this.links.findIndex(e => e.hash_id === l.hash_id);
                    this.links.splice(i, 1)
                }
                this.modal = null;
            },
            insertTextAtCursor(text, offset) {
                let el = document.getElementById("highlight");
                let val = el.value, endIndex, range, doc = el.ownerDocument;
                if (typeof el.selectionStart === "number"
                    && typeof el.selectionEnd === "number") {
                    endIndex = el.selectionEnd;
                    this.modal.link = val.slice(0, endIndex) + text + val.slice(endIndex);
                    el.focus();
                    el.selectionStart = el.selectionEnd = endIndex + text.length + (offset ? offset : 0);
                } else if (doc.selection !== "undefined" && doc.selection.createRange) {
                    el.focus();
                    range = doc.selection.createRange();
                    range.collapse(false);
                    range.text = text;
                    range.select();
                }

                setTimeout(() => {
                    $(el).highlightWithinTextarea('update');
                }, 10);
            }
        },
        computed: {
            tagButtonsDesc() {
                const tags = this.modal.tags;
                const {anime, manga, ranobe} = tags;
                const count = Object.keys(tags).reduce((sum, e) => (tags[e] & 3) > 0 ? ++sum : sum, 0);
                let s = '';
                s = (anime & 2 ? "аниме" : '') +
                    (anime === 3 ? ' и' : '') +
                    (anime & 1 ? ' Rx аниме' : '') +
                    ((((anime & 3) > 0) && ((manga & 3) > 0)) ? ',' : '') +
                    (manga & 2 ? ' манги' : '') +
                    (manga === 3 ? ' и' : '') +
                    (manga & 1 ? ' Rx манги' : '') +
                    ((((manga & 3) > 0) && ((ranobe & 3) > 0)) ? ',' : '') +
                    (ranobe & 2 ? ' ранобе' : '') +
                    (ranobe === 3 ? ' и' : '') +
                    (ranobe & 1 ? ' Rx ранобе' : '');

                return s;

            }
        }
    }
</script>

<style scoped>

    .tagButtons .btn-group {
        width: 100%;
    }

    .hwt-content {
        border: 1px solid #ced4da;
        width: 498px;
    }

    .slide-fade-enter-active {
        transition: all .3s ease;
    }

    .slide-fade-leave-active {
        transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter, .slide-fade-leave-to {
        transform: translateY(10px);
        opacity: 0;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>

<style>
    #altWhatcherModal::-webkit-scrollbar {
        display: none;
    }

    body::-webkit-scrollbar {
        display: none;
    }

    .hwt-content mark.blue {
        background-color: #a3daff;
    }

    .hwt-container {
        display: block !important;
    }


</style>