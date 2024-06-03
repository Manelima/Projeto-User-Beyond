<template>
  <div>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Área de autenticação</v-toolbar-title>
    </v-app-bar>

    <v-container>
      <v-row justify="center" class="mt-16">
        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <v-card-title>Entrar</v-card-title>
            <v-form @submit.prevent="login">
              <v-text-field
                v-model="loginEmail"
                label="E-mail"
                type="email"
                required
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Senha"
                type="password"
                required
                class="mb-4"
              ></v-text-field>
              <v-btn type="submit" color="primary">Entrar</v-btn>
            </v-form>
          </v-card>
        </v-col>
      </v-row>

      <v-row justify="center" class="mt-16">
        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <v-card-title>Registrar</v-card-title>
            <v-form @submit.prevent="register">
              <v-text-field
                v-model="registerEmail"
                label="E-mail"
                type="email"
                required
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="password2"
                label="Senha"
                type="password"
                required
                class="mb-4"
              ></v-text-field>
              <v-btn type="submit" color="primary">Registrar</v-btn>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginEmail: "",
      registerEmail: "",
      password: "",
      password2: "",
      errorMessage: "",
    };
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch("login", {
          email: this.loginEmail,
          password: this.password,
        });
        this.$router.push("/");
      } catch (error) {
        console.error("Erro ao fazer login:", error);
        if (error.code === "auth/user-disabled") {
          this.errorMessage = "O usuário foi desativado.";
        } else if (error.code === "auth/invalid-email") {
          this.errorMessage = "Por favor, insira um e-mail válido.";
        } else {
          this.errorMessage = error.message;
        }
      }
    },
    async register() {
      try {
        await this.$store.dispatch("create", {
          email: this.registerEmail,
          password: this.password2,
        });
        console.log("usuário criado!");
        this.$router.push("/"); 
      } catch (error) {
        console.error("Erro ao registrar:", error);
        if (error.code === "auth/invalid-email") {
          this.errorMessage = "Por favor, insira um e-mail válido.";
        } else {
          this.errorMessage = error.message;
        }
      }
    },
  },
};
</script>
