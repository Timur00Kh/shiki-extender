<template>
    <div>
    <div class="container my-3 mt-md-1 mb-1 mb-md-5" style="min-width: 400px; max-width: 800px">
        <div class="row justify-content-center">
            <div class="col-12">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li v-for="r in routes" :key="r.href" v-show="r.show" class="breadcrumb-item active" aria-current="page">
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
    import { computed } from 'vue'
    import { useRoute } from 'vue-router'
    
    export default {
        name: "App",
        setup() {
            const route = useRoute()
            
            const routes = computed(() => {
                return [
                    {
                        title: 'Главная',
                        active: false,
                        show: route.path.includes('/'),
                        href: "/"
                    },
                    {
                        title: 'AltWatcher',
                        active: true,
                        show: route.path.includes('/altWatcher'),
                        href: "/altWatcher"
                    },
                    {
                        title: 'ShikiDump',
                        active: true,
                        show: route.path.includes('/shikiDump'),
                        href: "/shikiDump"
                    }
                ]
            })
            
            return {
                routes
            }
        }
    }
</script>

<style >

</style>