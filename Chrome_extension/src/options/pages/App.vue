<template>
    <div>
    <div class="container-fluid mt-sm-1 mt-md-1 mb-1 mb-md-5">
        <div class="row justify-content-center">
            <div class="col-sm-12 col-lg-7 col-xl-5">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li v-for="r in routes" v-if="r.show" class="breadcrumb-item active" aria-current="page">
                            <RouterLink :to="r.href">{{r.title}}</RouterLink>
                        </li>
                    </ol>
                </nav>
                <router-view class="mt-1"></router-view>
            </div>



        </div>
    </div>
    </div>
</template>

<script>
    export default {
        name: "App.vue",
        data() {
            return {
                route: this.$route,
            }
        },
        computed: {
            routes() {
                return [
                    {
                        title: 'Главная',
                        active: false,
                        show: ~this.$route.path.indexOf('/'),
                        href: "/"
                    },
                    {
                        title: 'AltWatcher',
                        active: true,
                        show: ~this.$route.path.indexOf('/altWatcher'),
                        href: "/altWatcher"
                    },
                    {
                        title: 'ShikiDump',
                        active: true,
                        show: ~this.$route.path.indexOf('/shikiDump'),
                        href: "/shikiDump"
                    }
                ]
            }
        }
    }
</script>

<style >

</style>