<template>
<v-card outlined class="ma-3 accent-4" :class="message.name !== 'Eu' ? 'teal' : 'purple'">
  <v-card-subtitle class="font-weight-bold">{{ message.name }}</v-card-subtitle>
  <v-card-text>{{ message.text }}</v-card-text>
</v-card>
</template>

<script>

export default {
  props: {
    message: {
      type: Object,
      required: true
    }
  }
}


</script>