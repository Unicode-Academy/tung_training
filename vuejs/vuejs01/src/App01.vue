<script>
import Counter from "./components/Counter.vue";
import Title from "./components/Title.vue";
let title = "ABc";
export default {
  components: {
    Counter,
    Title,
  },
  setup() {
    return { title };
  },
};
</script>

<template>
  <div>
    <h1>Học Vue không khó</h1>
    <!-- <Counter /> -->
    <Title :title="title" animation-name="move" />
  </div>
</template>

<style scoped></style>
