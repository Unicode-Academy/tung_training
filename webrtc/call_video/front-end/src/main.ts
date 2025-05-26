import { createApp } from "vue";
import "./style.css";
import "font-awesome/css/font-awesome.min.css";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./configs/routes";
const app = createApp(App);

//Routes
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

app.use(router);

app.mount("#app");
