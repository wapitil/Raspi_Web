// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import ServoControl from "../components/ServoControl.vue";
import ActionGroup from "../components/ActionGroup.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: ServoControl,
  },
  {
    path: "/action",
    name: "ActionGroup",
    component: ActionGroup,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
