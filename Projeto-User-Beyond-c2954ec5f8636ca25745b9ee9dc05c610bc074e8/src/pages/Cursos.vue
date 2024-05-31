<template>
  <div>
    <v-app-bar color="blue">
      <v-toolbar-title>Seja Bem-vindo aos nossos Cursos!!!</v-toolbar-title>
      <v-spacer></v-spacer>
      <div>
      <v-btn @click="navegar('/')" class="mr-2">Retornar a Home</v-btn>
      <v-btn @click="navegar('/usuarios')" class="mr-2">Ir para Usuários</v-btn>
      <v-btn @click="navegar('/Calendario')" class="mr-2">Ir para Calendário</v-btn>
      <v-btn @click="navegar('/Forum')" class="mr-2">Ir para o Forum</v-btn>
      <v-btn @click="navegar('/Biblioteca')" class="mr-2">ir para Bibliteoca</v-btn>
      </div>
    
    </v-app-bar>
 
    <v-footer app color="blue">
      SYS v0.1.0
    </v-footer>
  </div>
</template>

<script>


export default {
  methods: {
    navegar(path) {
      this.$router.push(path)
    }
  }
}


</script>