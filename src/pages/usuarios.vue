<template>
  <div>
    <v-app-bar color="red lighten-1 text-center">
      <v-toolbar-title>Seja Bem-vindo a Área de Usuários!!!</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="navegar('/')" class="mr-2">Retornar a Home</v-btn>
      <v-btn @click="navegar('/Cursos')" class="mr-2">Ir para Cursos</v-btn>
      <v-btn @click="navegar('/Calendario')" class="mr-2">Ir para Calendário</v-btn>
      <v-btn @click="navegar('/Forum')" class="mr-2">Ir para o Fórum</v-btn>
      <v-btn @click="navegar('/Biblioteca')" class="mr-2">Ir para Biblioteca</v-btn>
    </v-app-bar>

    <v-row display="flex" pa="2em" justify="center">
      <v-card class="pa-2 align-self-center mt-16">
        <v-btn
          color="orange"
          dark
          v-bind="attrs"
          v-on="on"
          @click="dialog = true"
        >Adicionar Usuário</v-btn>
      </v-card>
    </v-row>

    <v-row display="flex" pa="2em" justify="center">
      <v-col cols="12">
        <v-card
          v-for="(usuario, index) in usuarios"
          :key="index"
          class="pa-2 align-self-center mt-16"
        >
          <v-card-text>
            <div>{{ usuario.nome }}</div>
            <div>{{ usuario.email }}</div>
            <div>{{ usuario.curso }}</div>
            <div>{{ usuario.funcao }}</div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" @click="editItem(usuario)">Editar</v-btn>
            <v-btn color="red darken-1" @click="deleteItem(usuario)">Remover</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editedItem.nome" label="Nome"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select v-model="editedItem.curso" :items="cursos" label="Curso"></v-select>
              </v-col>
              <v-col cols="12">
                <v-select v-model="editedItem.funcao" :items="funcoes" label="Função"></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="save">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card height="400px">
      <v-footer padless fixed>
        <v-card flat tile width="100%" class="red lighten-1 text-center">
          <v-card-text>
            <v-btn v-for="icon in icons" :key="icon" class="mx-4" icon>
              <v-icon size="24px">{{ icon }}</v-icon>
            </v-btn>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-text class="white--text">
            {{ new Date().getFullYear() }} —
            <strong>℗ Powered by Emanuel Lima Tomaz de Aquino ℗</strong>
          </v-card-text>
        </v-card>
      </v-footer>
    </v-card>
  </div>
</template>

<script>
//eslint-disable-next-line no-unused-vars
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
//eslint-disable-next-line no-unused-vars
import { db } from "../config";

export default {
  data() {
    return {
      dialog: false,
      editedIndex: -1,
      editedItem: {
        nome: "",
        email: "",
        curso: "",
        funcao: "",
      },
      cursos: [
        "Análise e Desenvolvimento de Sistemas",
        "Direito",
        "Sistemas para Internet",
        "Psicologia",
        "Enfermagem",
        "Administração",
        "Nenhum",
      ],
      funcoes: ["Aluno", "Professor", "Coordenador", "Funcionário"],
      usuarios: [],
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Novo Usuário" : "Editar Usuário";
    }
  },
  created() {
    this.fetchUsuarios();
  },
  methods: {
    navegar(path) {
      this.$router.push(path);
    },
    async fetchUsuarios() {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      this.usuarios = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    editItem(item) {
      this.editedIndex = this.usuarios.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      this.itemID = item.id;
    },
    async deleteItem(item) {
      const index = this.usuarios.indexOf(item);
      if (confirm("Tem certeza que deseja excluir este item?")) {
        await deleteDoc(doc(db, "usuarios", item.id));
        this.usuarios.splice(index, 1);
      }
    },
    async save() {
      if (this.editedIndex > -1) {
        const userDoc = doc(db, "usuarios", this.editedItem.id);
        await updateDoc(userDoc, this.editedItem);
      } else {
        const docRef = await addDoc(collection(db, "usuarios"), this.editedItem);
        this.editedItem.id = docRef.id;
        this.usuarios.push(this.editedItem);
      }
      this.close();
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = {
          nome: "",
          email: "",
          curso: "",
          funcao: "",
        };
        this.editedIndex = -1;
      }, 300);
    },
  },
};
</script>
