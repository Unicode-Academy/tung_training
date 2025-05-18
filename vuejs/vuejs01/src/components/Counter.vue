<template>
  <div>
    <h1>Count: {{ count ?? "a" }}</h1>
    <h2>
      <a v-bind:href="url">Google</a>
    </h2>
    <button v-on:click="increment(10)">+</button>
  </div>
</template>
<script>
let a = 0;
export default {
  setup() {
    return { a, url: "https://google.com" };
  },
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    increment(step) {
      this.count += step;
    },
  },
};
</script>
