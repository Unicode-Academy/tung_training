<template>
  <main class="mx-auto">
    <Header v-if="$route.name !== 'meet'" />
    <RouterView />
  </main>
</template>
<script setup lang="ts">
import Header from "./Header.vue";
import { RouterView } from "vue-router";
</script>
