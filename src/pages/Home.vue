<template>
  <div class="background">
    <v-app-bar color="primary dark">
      <v-toolbar-title>Seja Bem-vindo a Home!!!</v-toolbar-title>
      <v-spacer></v-spacer>
      <div>
      <v-btn @click="navegar('/Cursos')" class="mr-2">Ir para Cursos</v-btn>
      <v-btn @click="navegar('/usuarios')" class="mr-2">Ir para usuários</v-btn>
      <v-btn @click="navegar('/Calendario')" class="mr-2">Ir para Calendário</v-btn>
      <v-btn @click="navegar('/Forum')" class="mr-2">Ir para o Forum</v-btn>
      <v-btn @click="navegar('/Biblioteca')" class="mr-2">ir para Bibliteoca</v-btn>
      <v-btn @click="logout" class="mr-2">Sair</v-btn>
      </div>
    </v-app-bar>

    <v-footer app color="secondary">
      SYS v0.1.0
    </v-footer>
  </div>
</template>

<script>
import { signOut } from "firebase/auth"
import { auth } from "../config"; 

export default {
  methods: {
    navegar(path) {
      this.$router.push(path)
    },
    async logout() { 
      try {
        await signOut(auth);
        this.$router.push("/Login");
      } catch (error) {
        console.error("Erro ao sair:", error);
      }
    },
  },
}
</script>
