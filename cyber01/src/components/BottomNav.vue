<template>
  <v-bottom-navigation
    height="64"
    class="cyber-bottom-nav"
    v-model="activeNav"
  >
    <!-- Map -->
    <v-btn to="/map" value="/map" icon>
      <v-icon>mdi-map</v-icon>
    </v-btn>

    <!-- Profile / Login -->
    <v-btn :to="user ? '/profile' : '/login'" :value="user ? '/profile' : '/login'" icon>
      <v-icon>{{ user ? 'mdi-account-box' : 'mdi-account-circle' }}</v-icon>
    </v-btn>

    <!-- Trivia -->
    <v-btn to="/trivia" value="/trivia" icon>
      <v-icon>mdi-trophy</v-icon>
    </v-btn>

    <!-- About -->
    <v-btn to="/about" value="/about" icon>
      <v-icon>mdi-information</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const route = useRoute()
const router = useRouter()

const activeNav = ref(route.path) // make it writable

// Sync activeNav with route changes
watch(() => route.path, (newPath) => {
  activeNav.value = newPath
})

// Also allow user to navigate via nav buttons
watch(activeNav, (val) => {
  if (val !== route.path) {
    router.push(val)
  }
})

const user = ref(null)
onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, (u) => {
    user.value = u
  })
})
</script>

<style scoped>
.cyber-bottom-nav {
  background: rgba(14, 20, 30, 0.95);
  backdrop-filter: blur(8px);
  border-top: 1px solid #00ffee33;
  box-shadow: 0 -2px 12px #00ffee55;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 999;
  transition: none !important; /* Instant appearance */
}

.v-bottom-navigation .v-btn {
  color: #00ffee !important;
  transition: transform 0.25s ease;
}

.v-bottom-navigation .v-btn:hover {
  transform: scale(1.2);
}
</style>
