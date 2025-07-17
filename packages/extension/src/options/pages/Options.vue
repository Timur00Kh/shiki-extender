<template>
    <div>
        <div class="card">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <div class="row">
                        <div class="col-auto">
                            <h4>altWatcher</h4>
                        </div>
                        <div class="col-auto ml-auto">
                            <MDToggle
                                    class="mt-2"
                                    :checked="altWatcher"
                                    :onChange="() => altWatcher = !altWatcher"
                            />
                        </div>
                        <div class="col-auto">
                            <a v-if="popup" class="btn btn-primary" target="_blank" :href="getChromePath('index.html') + '#/altWatcher'">Настройки</a>
                            <RouterLink v-else class="btn btn-primary" to="/altWatcher">Настройки</RouterLink>
                        </div>
                        </div>
                </li>
                <li class="list-group-item">
                    <div class="row">
                        <div class="col-auto">
                            <h4>shikiDump</h4>
                        </div>
                        <div class="col-auto ml-auto">
                            <MDToggle
                                    class="mt-2"
                                    :checked="false"
                                    :onChange="() => {}"
                                    disabled
                            />
                        </div>
                        <div class="col-auto">
                            <button disabled class="disabled btn btn-primary">Настройки</button>
                        </div>
                        </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import MDToggle from '../components/MDToggle/MDToggle.vue'

    export default {
        name: "options",
        components: {
            MDToggle
        },
        data() {
            console.log(this.$route);
            return {
                altWatcher: isEnabled('altWatcher'),
                shikiDump: isEnabled('shikiDump'),
                popup: this.$route.query.popup
            }
        },
        methods: {
            getChromePath(file) {
                return getChromePath(file)
            }
        },
        watch: {
            altWatcher() {
                localStorage.setItem("altWatcher", this.altWatcher)
            }
        }
    }

    function isEnabled(key, def) {
        let res =  localStorage.getItem(key);
        if (res === null) {
            res = def || true;
        } else {
            res = (res === 'true');
        }
        return res;
    }

    function getChromePath(file) {
        return chrome.runtime.getURL(file)
    }
</script>

<style scoped>

</style>