import MainLayout from "../layouts/MainLayout.vue";
import Home from "../pages/Home.vue";
import Meet from "../pages/Meet.vue";

export const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", name: "home", component: Home },
      { path: ":id", name: "meet", component: Meet },
    ],
  },
];
