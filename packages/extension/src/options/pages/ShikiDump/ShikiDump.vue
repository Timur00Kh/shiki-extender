<template>
    <div class="row">
        <div class="col-12">
            <form>
                <div class="form-group" style="margin-bottom: 0px;">
                    <div class="input-group">
                        <input v-model="searchTitle" placeholder="Поиск"
                               class="form-control form-control-lg">
                        <div class="input-group-append">
                            <button @click="startSearch()" type="submit" class="btn btn-primary">
                                <i class="fa fa-search" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <!--<div class="mt-2 col-6 col-md-4 col-lg-4 col-xl-3">-->
        <div class="col-12 mt-2">
            <div class="card-columns">
                <RouterLink v-for="title in computedTitles" :key="title.id" tag="a" :to="title.routerLink">
                    <div class="card">
                        <div>
                            <img :src="title.imageSrc" class="card-img-top">
                        </div>
                        <div class="card-body px-2 py-1">
                            <h6 class="card-title mb-0">
                                {{title.name}}
                            </h6>

                            <small class="text-muted">{{title.russian}}</small>
                            <div class="text-right mt-1">
                                <h6 class="card-title mb-0">
                                    <span class="badge badge-primary">{{title.kind}}</span>
                                    <span class="badge badge-primary">{{title.year}}</span>

                                </h6>
                            </div>
                            <!--<a href="#" class="btn btn-primary">Go somewhere</a>-->
                        </div>
                    </div>
                </RouterLink>
            </div>
        </div>
        <div class="col-12">
            <div class="row justify-content-center mt-4">
                <div class="col-auto">
                    <small class="text-muted">powered by <a href="https://anime.wownik.ru/">anime.wownik.ru</a></small>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    const api = 'https://anime.wownik.ru/ShikimoriRedirect/api/animes?page=1&limit=48&order=ranked';
    import axios from 'axios'


    export default {
        name: "ShikiDump",
        data() {
            return {
                searchTitle: '',
                titles: []
            }
        },
        methods: {
            async search() {
                let {data} = await axios.get(`${api}&search=${this.searchTitle.replace(/ /g, '%2B')}`);
                console.log(data);
                if (Array.isArray(data)) {
                    this.titles = data;
                } else {
                    alert(data);
                }
            },
            startSearch() {
                let query;
                if (this.searchTitle && this.searchTitle.length > 0) {
                    query = {q: this.searchTitle}
                }
                document.title = `поиск | ${this.searchTitle}`;
                this.$router.push({
                    path: '/shikiDump',
                    query: query,
                });
            },
            onPopState() {
                this.searchTitle = this.$route.query.q || '';
                this.search();
            }
        },
        created() {
            window.addEventListener('popstate', this.onPopState);
        },
        destroyed() {
            window.removeEventListener('popstate', this.onPopState);
        },
        beforeMount() {
            this.searchTitle = this.$route.query.q || '';
            this.search();
        },
        computed: {
            computedTitles() {
                return this.titles.map(e => ({
                    ...e,
                    imageSrc: `https://shikimori.one${e.image.preview || e.image.original}`,
                    year: e.released_on && e.released_on.split('-')[0] || e.aired_on && e.aired_on.split('-')[0],
                    routerLink: `/shikiDump/player?id=${e.id}`
                }))
            }
        }
    }
</script>

<style scoped>
    @media (max-width: 575.98px) {
        .card-columns {
            -webkit-column-count: 2 !important;
            -moz-column-count: 2 !important;
            column-count: 2 !important;
        }
    }

    @media (min-width: 576px) {
        .card-columns {
            -webkit-column-count: 3;
            -moz-column-count: 3;
            column-count: 3;
        }
    }

    @media (min-width: 1550px) {
        .card-columns {
            -webkit-column-count: 5;
            -moz-column-count: 5;
            column-count: 5;
        }
    }

    .card-body {
        line-height: 1;
    }
</style>
