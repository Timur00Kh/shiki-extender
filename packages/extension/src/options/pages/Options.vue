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
                                    :onChange="() => altWatcher.value = !altWatcher.value"
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

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import MDToggle from '../components/MDToggle/MDToggle.vue'

const route = useRoute()
const popup = route.query.popup

function isEnabled(key, def) {
    let res = localStorage.getItem(key);
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

const altWatcher = ref(isEnabled('altWatcher'))

watch(altWatcher, (val) => {
    localStorage.setItem('altWatcher', val)
})
</script>

<style scoped>

</style>