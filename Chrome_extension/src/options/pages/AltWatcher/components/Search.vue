<template>
    <div class="card-body">
        <div class="row justify-content-between">
            <div class="col-auto">
                <h3 class="card-title" id="added">Поиск</h3>
            </div>
        </div>

        <div class="input-group mb-2">
            <input v-model="params.title" @keypress.enter.exact="startSearch" type="text" class="form-control"
                   placeholder="Искать сервисы...">
            <div class="input-group-append">
                <a v-if="loading" class="btn btn-outline-secondary disabled" id="basic-addon2">
                    <div class="lds-facebook">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </a>
                <button v-else @click="startSearch" class="btn btn-outline-secondary">Искать</button>
            </div>
        </div>
        <div class="row justify-content-center tagButtons">
            <div class="col-auto pr-2">
                <div class="btn-group">
                    <button @click="params.anime = params.anime ^ 2"
                            :class="'btn  btn-block ' + (params.anime & 2 ? 'btn-info' : 'btn-outline-info')"
                            style="width: 100%"
                    >
                        Anime {{params.anime}}
                    </button>
                    <button @click="params.anime = params.anime ^ 1"
                            :class="'btn ' + (params.anime & 1 ? 'btn-danger' : 'btn-outline-danger')">
                        Rx
                    </button>
                </div>
            </div>
            <div class="col-auto px-2">
                <div class="btn-group">
                    <button @click="params.manga = params.manga  ^ 2"
                            :class="'btn btn-block ' + (params.manga & 2  ? 'btn-warning' : 'btn-outline-warning')">
                        Manga {{params.manga}}
                    </button>
                    <button @click="params.manga = params.manga ^ 1"
                            :class="'btn ' + (params.manga & 1 ? 'btn-danger' : 'btn-outline-danger')">
                        Rx
                    </button>
                </div>

            </div>
            <div class="col-auto px-2">
                <div class="btn-group ">
                    <button @click="params.ranobe = params.ranobe  ^ 2"
                            :class="'btn btn-block ' + (params.ranobe & 2   ? 'btn-secondary' : 'btn-outline-secondary')">
                        Ranobe {{params.ranobe}}
                    </button>
                    <button @click="params.ranobe = params.ranobe ^ 1"
                            :class="'btn ' + (params.ranobe & 1 ? 'btn-danger' : 'btn-outline-danger')">
                        Rx
                    </button>
                </div>

            </div>
            <div class="col-auto pl-2">
                <button @click="params.approved = !params.approved"
                        class="btn btn-outline-warning"
                        title="Одобрено модератором"
                >
                    <i v-if="params.approved" class="fas fa-star"></i>
                    <i v-else class="far fa-star"></i>
                </button>

            </div>
        </div>

        <transition name="fade">
            <div v-if="computedQuery.length > 0" class="card mt-3 mx-2">
                <ul class="list-group list-group-flush">
                    <li v-for="link in computedQuery" class="list-group-item">
                        <div class="row justify-content-between">
                            <div class="col-8">
                                <div class="row">
                                    <div class="col-auto pr-0">
                                        <h4 class="card-title">
                                            {{link.title}}
                                        </h4>
                                    </div>
                                    <div class="col-auto">
                                        <h4 class="card-title">
                                            <span v-if="link.tags.anime" class="badge badge-primary">Anime</span>
                                            <span v-if="link.tags.manga" class="badge badge-secondary">Manga</span>
                                            <span v-if="link.tags.ranobe" class="badge badge-success">Ranobe</span>
                                            <span v-if="Object.keys(link.tags).reduce((sum, e) => (link.tags[e] & 1) > 0 ? true : sum, false)"
                                                  class="badge badge-danger">Rx</span>
                                            <i v-if="link.approved" title="Одобрено модератором"
                                               class="text-warning fas fa-star"></i>
                                            <a @click="onMoreButtonClick(link.id)" href="#/altWatcher"
                                               class="badge badge-pill badge-light">Ещё
                                                <i v-if="link.more" class="fas fa-angle-up"></i>
                                                <i v-else class="fas fa-angle-down"></i>
                                            </a>
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div class="col-auto ml-auto">
                                <button @click="onSaveButtonClick(link)"
                                        style="margin-top: -5px"
                                        :disabled="link.alreadyAdded"
                                        class="btn btn-primary btn-lg"
                                >
                                    <span v-if="!link.alreadyAdded"><i class="fas fa-plus-square"></i> Добавить</span>
                                    <span v-else><i class="fas fa-check"></i> Добавленно</span>
                                </button>
                            </div>
                        </div>

                        <transition name="fade">
                            <div v-if="link.more">
                                <div class="row">
                                    <div class="col-10">
                                        <p>{{link.description}}</p>
                                    </div>
                                </div>
                                <div class="input-group flex-nowrap mt-2">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="addon-wrapping">link</span>
                                    </div>
                                    <input type="text" :value="link.link" class="form-control" placeholder="URL"
                                           disabled>
                                </div>
                                <div class="row justify-content-between">
                                    <div class="col-auto">
                                        <p class="text-muted mb-0">Кол-во добавлений: {{link.number_of_downloads}}</p>
                                    </div>
                                    <div class="col-auto">
                                        <p class="text-muted mb-0">id: {{link.id}}</p>
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </li>

                </ul>
            </div>
        </transition>
    </div>
</template>

<script>
    import axios from 'axios'
    import {apiDomain} from "../../../config";
    import 'babel-polyfill'

    export default {
        name: "Search",
        props: ['links', 'saveLink'],
        data() {
            return {
                params: {
                    title: '',
                    manga: 0,
                    anime: 0,
                    ranobe: 0,
                    approved: true
                },
                query: [], // результат запроса
                loading: false
            }
        },
        async created() {
            await this.startSearch();
        },
        methods: {
            search(params) {
                return axios.get(`${apiDomain}/altWatcher/link`, {
                    params
                })
            },
            onSaveButtonClick(l) {
                let {id, title, link, tags, description} = l;
                this.saveLink({
                    id,
                    title,
                    link,
                    tags,
                    description,
                });
                axios.get(`${apiDomain}/altWatcher/link/${id}/inc-num-of-downloads`)
            },
            onMoreButtonClick(id) {
                let cur = this.query.find(e => e.id === id);
                cur.more = !cur.more;
            },
            async startSearch() {
                this.loading = true;

                let params = this.params;
                let {data: query} = await this.search(params);
                this.query = query.map(e => ({
                    ...e,
                    more: false // свойство, отвечающее за показ сройлера с описанием
                }));

                setTimeout(() => {
                    this.loading = false;
                }, 500)
            }
        },
        computed: {
            computedQuery() {
                return this.query.map(
                    e => ({
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
                        alreadyAdded: !!this.links.find(el => el.id == e.id),
                        more: e.more
                    })
                )
            }
        }
    }
</script>

<style scoped>
    .tagButtons .btn-group {
        width: 100%;
    }

    /*Loading bar*/
    .lds-facebook {
        display: inline-block;
        position: relative;
        width: 50px;
        height: 10px;
        top: -23px;

    }

    .lds-facebook div {
        display: inline-block;
        position: absolute;
        left: 6px;
        width: 8px;
        background: #6c757d;
        animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
    }

    .lds-facebook div:nth-child(1) {
        left: 11px;
        animation-delay: -0.24s;
    }

    .lds-facebook div:nth-child(2) {
        left: 21px;
        animation-delay: -0.12s;
    }

    .lds-facebook div:nth-child(3) {
        left: 31px;
        animation-delay: 0s;
    }

    @keyframes lds-facebook {
        0% {
            top: 6px;
            height: 37px;
        }
        50%, 100% {
            top: 17px;
            height: 21px;
        }
    }
</style>