<template>
  <div class="home-wrapper">
    <v-container class="home-screen" fluid>
      <div class="content">
        <h1 class="hero-title">Cyber Hero Quest</h1>
        <p class="tagline">Master cybersecurity through an epic gamified journey.</p>
        <v-btn color="cyan lighten-2" large elevation="10" class="glow-button" @click="goToMap">
          START ADVENTURE
        </v-btn>
      </div>
    </v-container>
  </div>
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
  color: #e0f7ff;
  text-align: center;
  padding-top: 64px;

}


.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  animation: slideUp 1.2s ease forwards;
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.logo {
  width: 140px;
  filter: drop-shadow(0 0 6px #00e5ff);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.85; }
}

.hero-title {
  font-size: 72px;
  color: #00e5ff;
  font-family: 'Orbitron', sans-serif;
  text-shadow: 0 0 12px #00e5ff, 0 0 24px #00e5ff88;
  margin: 0;
}

.tagline {
  max-width: 600px;
  font-size: 20px;
  color: #99dfff;
  text-shadow: 0 0 4px #00e5ff88;
  font-family: 'Orbitron', sans-serif;
  line-height: 1.6;
}

.glow-button {
  color: #101726;
  font-size: 20px;
  font-weight: bold;
  padding: 1.5rem 3.5rem;
  display: flex;
  text-transform: uppercase;
  border-radius: 12px;
  box-shadow: 0 0 20px #00e5ff, 0 0 40px #00e5ff66;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.glow-button:hover {
  transform: scale(1.08);
  box-shadow: 0 0 30px #00e5ff, 0 0 60px #00e5ff99;
}
</style>
