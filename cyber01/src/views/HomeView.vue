<template>
  <v-container class="home-screen" fluid>
    <div class="content">
      <img src="/logo.png" alt="Cyber Hero Logo" class="logo" />
      <h1>Cyber Hero Quest</h1>
      <p>Learn cybersecurity by playing and progressing through levels!</p>
      <v-btn color="primary" large @click="goToMap">
        ▶️ Play the Game
      </v-btn>
    </div>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goToMap = () => router.push('/map')
</script>

<style scoped>
.home-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to bottom, #0e0e1a, #1e1e2f);
  color: white;
  text-align: center;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.logo {
  width: 100px;
}
</style>
