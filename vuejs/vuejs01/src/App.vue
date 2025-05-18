<template>
  <div>
    <h1>Học Vuejs miễn phí</h1>
    <!-- <Message message="Học Vuejs miễn phí" /> -->
    <!-- <Login /> -->
    <Title />
  </div>
</template>
<script setup>
import { provide } from "vue";
const fullname = "Hoàng An";
import Title from "./components/Title.vue";
// import Message from "./components/Message.vue";
// import Login from "./components/Login.vue";
provide("fullname", fullname);
</script>
