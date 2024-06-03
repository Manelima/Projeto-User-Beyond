import Vue from "vue";
import VueRouter from "vue-router";
import Cursos from "@/pages/Cursos.vue";
import usuarios from "@/pages/usuarios.vue";
import Calendario from "@/pages/Calendario.vue";
import Forum from "@/pages/Forum.vue";
import Biblioteca from "@/pages/Biblioteca.vue";
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import store from '../main'; 

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/Cursos",
    component: Cursos,
  },
  {
    path: "/usuarios",
    component: usuarios,
    meta: { requiresAuth: true },
  },
  {
    path: "/Calendario",
    component: Calendario,
  },
  {
    path: "/Forum",
    component: Forum,
  },
  {
    path: "/Biblioteca",
    component: Biblioteca,
  },
  {
    path: "/Login",
    component: Login,
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = store.getters.isAuthenticated;

  console.log(`Navigating to ${to.path}, requiresAuth: ${requiresAuth}, isAuthenticated: ${isAuthenticated}`);

  if (requiresAuth && !isAuthenticated) {
    console.log('Redirecting to /Login');
    next('/Login');
  } else {
    next();
  }
});

export default router;
