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
    usuarios: [],
    contents: [] // Adicionei um novo estado para os conteúdos
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setUsuarios(state, usuarios) {
      state.usuarios = usuarios;
    },
    setContents(state, contents) { // Adicionei uma nova mutation para os conteúdos
      state.contents = contents;
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
    },
    // Conteúdos do Firestore
    //eslint-disable-next-line no-unused-vars
    async createContent({ commit }, payload) {
      try {
        const docRef = await addDoc(collection(db, "contents"), payload);
        console.log("Conteúdo criado com ID: ", docRef.id);
      } catch (error) {
        console.error("Erro ao criar conteúdo:", error);
      }
    },
    //eslint-disable-next-line no-unused-vars
    async fetchContents({ commit }) {
      try {
        const querySnapshot = await getDocs(collection(db, "contents"));
        const contents = [];
        querySnapshot.forEach((doc) => {
          contents.push({ id: doc.id, ...doc.data() });
        });
        commit("setContents", contents);
      } catch (error) {
        console.error("Erro ao buscar conteúdos:", error);
      }
    },
    //eslint-disable-next-line no-unused-vars
    async updateContent({ commit }, payload) {
      const { id, ...dadosAtualizados } = payload;
      try {
        await updateDoc(doc(db, "contents", id), dadosAtualizados);
        console.log("Conteúdo atualizado com sucesso");
      } catch (error) {
        console.error("Erro ao atualizar conteúdo:", error);
      }
    },
    //eslint-disable-next-line no-unused-vars
    async deleteContent({ commit }, payload) {
      const contentId = payload.id;
      try {
        await deleteDoc(doc(db, "contents", contentId));
        console.log("Conteúdo deletado com ID: ", contentId);
      } catch (error) {
        console.error("Erro ao deletar conteúdo:", error);
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    authError: (state) => state.error,
    usuarios: (state) => state.usuarios,
    contents: (state) => state.contents // Adicionei um novo getter para os conteúdos
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
