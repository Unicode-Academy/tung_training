import { createApp } from "vue";
import "./style.css";
import "font-awesome/css/font-awesome.min.css";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./configs/routes";
import { clerkPlugin } from "@clerk/vue";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

const app = createApp(App);

//Routes
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});
app.use(clerkPlugin, { publishableKey: PUBLISHABLE_KEY });
app.use(router);

app.mount("#app");
