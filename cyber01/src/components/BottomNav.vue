<template>
  <v-bottom-navigation
    app
    height="64"
    class="cyber-bottom-nav"
    v-model="activeNav"
  >
    <v-btn to="/map" value="/map" icon>
      <v-icon>mdi-map</v-icon>
    </v-btn>
    <v-btn to="/profile" value="/profile" icon>
      <v-icon>mdi-account-circle</v-icon>
    </v-btn>
    <v-btn to="/about" value="/about" icon>
      <v-icon>mdi-information</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeNav = computed(() => route.path)
</script>

<style scoped>
.cyber-bottom-nav {
  background: rgba(14, 20, 30, 0.85);
  backdrop-filter: blur(10px);
  border-top: 1px solid #00ffee33;
  box-shadow: 0 -2px 10px #00ffee55;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 1000;
}

.v-bottom-navigation .v-btn {
  color: #00ffee !important;
  transition: transform 0.3s;
}
.v-bottom-navigation .v-btn:hover {
  transform: scale(1.2);
}
</style>
