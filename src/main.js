import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./routes/router";
import Vuex from "vuex";

import { auth, db } from "./config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  doc,
} from "firebase/firestore";

Vue.use(Vuex);

Vue.config.productionTip = false;

let app;

onAuthStateChanged(auth, () => {
  if (!app) {
    app = new Vue({
      vuetify,
      router,
      store,
      render: (h) => h(App),
    }).$mount("#app");
  }
});

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const store = new Vuex.Store({
  state: {
    user: null,
    eventos: [],
    usuarios: [] 
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setUsuarios(state, usuarios) {
      state.usuarios = usuarios;
    }
  },
  actions: {
     //eslint-disable-next-line no-unused-vars
    create({ commit }, payload) {
      const { email, password } = payload;
      if (!email || !validateEmail(email)) {
        alert("Por favor, insira um e-mail válido.");
        return;
      }
      createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          console.log("usuário criado!", result);
          alert("Conta criada com sucesso!");
        })
        .catch((error) => {
          alert(error.message);
        });
    },
    //login
    login({ commit }, payload) {
      const { email, password } = payload;
      if (!email || !validateEmail(email)) {
        alert("Por favor, insira um e-mail válido.");
        return;
      }
      return new Promise((resolve, reject) => {
        signInWithEmailAndPassword(auth, email, password)
          .then((result) => {
            console.log("usuário logado!", result.user);
            commit("setUser", result.user);
            resolve(result);
          })
          .catch((error) => {
            console.error("Erro ao fazer login:", error);
            if (error.code === "auth/user-disabled") {
              alert("O usuário foi desativado.");
            }
            reject(error);
          });
      });
    },
     //eslint-disable-next-line no-unused-vars
    checkAuthState({ commit }) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          commit("setUser", user);
        } else {
          commit("setUser", null);
          console.log("Método de autenticação chamado");
        }
      });
    },
     //eslint-disable-next-line no-unused-vars
    async sendEvent({ commit }, payload) {
      console.log("chamada da action de sendEvent");
      const evento = payload;
      try {
        const DocRef = await addDoc(collection(db, "eventos"), {
          ...evento,
        });
        console.log("Document written with ID: ", DocRef.id);
      } catch (error) {
        console.error("Erro ao enviar evento:", error);
        alert(error.message);
      }
    },
     //eslint-disable-next-line no-unused-vars
    async deleteEvent({ commit }, payload) {
      console.log("chamada da action de deleteEvent");
      const eventoId = payload.id;
      console.log(eventoId);
      try {
        await deleteDoc(doc(db, "eventos", eventoId));
        console.log("Document deleted with ID: ", eventoId);
      } catch (error) {
        console.error("Erro ao deletar evento:", error);
        alert(error.message);
      }
    },
     //eslint-disable-next-line no-unused-vars
    async updateEvent({ commit }, payload) {
      console.log("chamada da action de updateEvent");
      const { id, ...dadosAtualizados } = payload; 
      try {
        await updateDoc(doc(db, "eventos", id), dadosAtualizados); 
        console.log("Evento atualizado com sucesso");
      } catch (error) {
        console.error("Erro ao atualizar evento:", error);
        alert(error.message);
      }
    },
    // Users do Firestore
    async fetchUsuarios({ commit }) {
      try {
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        const usuarios = [];
        querySnapshot.forEach((doc) => {
          usuarios.push({ id: doc.id, ...doc.data() });
        });
        commit("setUsuarios", usuarios);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    authError: (state) => state.error,
    usuarios: (state) => state.usuarios 
  }
});

export default store;

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    store.dispatch("checkAuthState").then(() => {
      if (!store.getters.isAuthenticated) {
        next("/Login");
      } else {
        next();
      }
    });
  } else {
    next();
  }
});
