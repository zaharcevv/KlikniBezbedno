<template>
  <v-app-bar app color="#101726" dark flat height="80">
    <v-container class="d-flex justify-space-between">
      <div class="d-flex align-center">
        <span class="text-h5 font-weight-bold">Cyber01</span>
      </div>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-sm-none" />
      <v-toolbar-items class="d-none d-sm-flex">
        <v-btn text to="/">Home</v-btn>
        <v-btn text to="/map">Play</v-btn>
        <v-btn text to="/login">Login</v-btn>
        <v-btn text to="/about">About</v-btn>
      </v-toolbar-items>
    </v-container>
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    app
    temporary
    class="d-sm-none"
  >
    <v-list dense>
      <v-list-item to="/">
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>
      <v-list-item to="/map">
        <v-list-item-title>Play</v-list-item-title>
      </v-list-item>
      <v-list-item to="/about">
        <v-list-item-title>About</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
const drawer = ref(false)
</script>

<style scoped>
.logo-small {
  width: 48px;
  height: 48px;
}
</style>