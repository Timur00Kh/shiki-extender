<template>
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
                <div v-if="!loading" class="card-header py-5 ">
                    <h5 class="card-title">Тут пусто.</h5>
                    <p class="card-text">Добавь ссылки собственоручно, либо перейди на страницу поиска.</p>
                    <a href="#" @click="current ='search'" class="btn btn-primary">Поиск</a>
                </div>
                <transition name="fade">
                    <div v-if="loading" class="card-header py-5 ">
                        <!--<i class="fas fa-spinner fa-5x fa-spin"></i>-->
                        <i class="fas fa-sync fa-5x fa-spin"></i>
                    </div>
                </transition>
            </div>


            <button @click="addNewLink()" type="button" class="btn btn-primary btn-block mt-2"><i
                    class="fas fa-plus-square"></i> Добавить
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Added",
        props: ['links'],
        data() {
            return {
                loading: true,
                modal: null,
                linksDb: null,
                current: "added",
                links: []
            }
        },
        watch: {
            modal(e) {
                if (e) document.querySelector('body').classList.add("modal-open");
                else document.querySelector('body').classList.remove("modal-open");
            }
        },
        methods: {
            saveLink(l) {
                this.linksDb.link.put(l);
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
                this.modal = JSON.parse(JSON.stringify(l));

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
                                highlight: /\{\{title=?(.*)\}\}/
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
                    title: "",
                    link: "",
                    tags: {
                        manga: 0,
                        anime: 0,
                        ranobe: 0,
                        rx: 0,
                    },
                    description: '',
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

</style>