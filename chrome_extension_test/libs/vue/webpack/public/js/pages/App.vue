<template>
    <div>
    <div class="container mt-sm-1 mt-md-1 mb-1 mb-md-5">
        <div class="row justify-content-center">
            <div class="card">
                <div class="card">
                    <img class="card-img-top" src="poster.jpg" alt="Card image cap">

                </div>
                <div class="card-body">

                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
    export default {
        name: "App.vue"
    }
</script>

<style scoped>

</style>