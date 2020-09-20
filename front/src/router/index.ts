import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Index from "../views/index.vue";
import { auth } from "../clean_architecture/services/auth";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Index,
    beforeEnter: async (to, from, next) => {
      (await auth.checkAuthentication()) ? next() : next({ name: "Auth" });
    },
  },
  {
    path: "/employees",
    name: "Employees",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "employees" */ "../views/Employees.vue"),
    beforeEnter: async (to, from, next) => {
      (await auth.checkAuthentication()) && auth.isAdmin
        ? next()
        : next({ name: "Auth" });
    },
  },
  {
    path: "/auth",
    name: "Auth",
    component: () => import(/* webpackChunkName: "auth" */ "../views/Auth.vue"),
    beforeEnter: async (to, from, next) => {
      if (await auth.checkAuthentication()) next({ name: "Home" });
      next();
    },
  },
];

const router = new VueRouter({
  routes,
});

export default router;
