<template>
  <div>
    <div
      class="container my-3 mt-md-1 mb-1 mb-md-5"
      style="min-width: 400px; max-width: 800px"
    >
      <div class="row justify-content-center">
        <div class="col-12">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li
                v-for="r in routes"
                v-show="r.show"
                class="breadcrumb-item active"
                aria-current="page"
              >
                <RouterLink :to="r.href">{{ r.title }}</RouterLink>
              </li>
            </ol>
          </nav>
          <router-view class="mt-1" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const routes = computed(() => [
  { title: "Главная", show: true, href: "/" },
  {
    title: "AltWatcher",
    show: route.path.indexOf("/altWatcher") !== -1,
    href: "/altWatcher",
  },
]);
</script>
