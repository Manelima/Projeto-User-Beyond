<template>
<v-app-bar fixed bottom color="blue">
  <v-text-field v-model="inputText" solo hide-details label="Enviar mensagem..."></v-text-field>
  <v-btn @click="sendMessage()" icon>
    <v-icon color="white">mdi-send</v-icon>
  </v-btn>
</v-app-bar>
</template>

<script>

export default {
  data() {
    return {
      inputText: ''
    }
  },
  methods: {
    sendMessage() {
      if (this.inputText === '') {
        return
      }

      this.$emit('send-message', this.inputText)
      this.inputText = ''
    }
  }
}

</script>