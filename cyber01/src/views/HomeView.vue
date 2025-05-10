<template>
  <div class="home-wrapper">
    <v-container class="home-screen" fluid>
      <div class="content">
        <h1 class="hero-title">
          <span class="glitch" data-text="САЈБЕР ХЕРОЈ">САЈБЕР ХЕРОЈ</span><br />
          <span class="mission">МИСИЈА</span>
        </h1>
        <p class="tagline glow-flicker">
          Совладај ја сајбер безбедноста преку епска, гамифицирана авантура.
        </p>
        <v-btn class="glow-button neon-glow" large @click="goToMap">
          ЗАПОЧНИ АВАНТУРА
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
@import 'https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800&display=swap';

.home-wrapper {
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: inherit;
}

.home-screen {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e0f7ff;
  text-align: center;
  z-index: 2;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  animation: slideUp 1.4s ease forwards;
  padding: 0 1.5rem;
}

@keyframes slideUp {
  from { transform: translateY(40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Hero title */
.hero-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 64px;
  line-height: 1.1;
  font-weight: 800;
  color: #00e5ff;
  text-align: center;
  text-shadow: 0 0 16px #00e5ff, 0 0 30px #00e5ff88;
  text-transform: uppercase;
  margin: 0;
  transform: perspective(300px) rotateX(2deg);
}

.mission {
  display: block;
  font-size: 36px;
  margin-top: 5px;
  color: #33faff;
  letter-spacing: 2px;
  text-shadow: 0 0 6px #33faff, 0 0 10px #33faff55;
}

/* Glitch effect */
.glitch {
  position: relative;
  display: inline-block;
  animation: flicker 2.5s infinite alternate;
}
.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  width: 100%;
  opacity: 0.5;
}
.glitch::before {
  animation: glitchTop 2s infinite linear alternate-reverse;
  color: #0ff;
  top: -2px;
}
.glitch::after {
  animation: glitchBottom 1.8s infinite linear alternate;
  color: #f0f;
  top: 2px;
}

@keyframes glitchTop {
  0% { transform: translateX(0); }
  20% { transform: translateX(-3px); }
  40% { transform: translateX(3px); }
  60% { transform: translateX(-2px); }
  80% { transform: translateX(2px); }
  100% { transform: translateX(0); }
}
@keyframes glitchBottom {
  0% { transform: translateX(0); }
  25% { transform: translateX(2px); }
  50% { transform: translateX(-2px); }
  75% { transform: translateX(1px); }
  100% { transform: translateX(0); }
}
@keyframes flicker {
  0%, 100% { opacity: 1; }
  45% { opacity: 0.8; }
  60% { opacity: 0.4; }
  70% { opacity: 0.9; }
}

.tagline {
  max-width: 680px;
  font-size: 20px;
  margin-top: -20px;
  color: #99dfff;
  font-family: 'Orbitron', sans-serif;
  line-height: 1.6;
  text-shadow: 0 0 6px #00e5ff55;
  animation: flicker 3s infinite ease-in-out;
}

/* Neon Button */
.glow-button {
  background: linear-gradient(145deg, #00e5ff, #26ffff);
  color: #101726;
  font-size: 18px;
  font-weight: bold;
  padding: 1.3rem 3rem;
    margin-top: -20px;
  border-radius: 14px;
  box-shadow: 0 0 18px #00e5ff, 0 0 32px #00e5ff55;
  text-transform: uppercase;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
}

.glow-button:hover {
  transform: scale(1.08);
  box-shadow: 0 0 28px #00e5ff, 0 0 70px #00e5ffaa;
  background: linear-gradient(145deg, #33faff, #00ccff);
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 40px;
  }

  .mission {
    font-size: 24px;
  }

  .tagline {
    font-size: 18px;
  }

  .glow-button {
    font-size: 16px;
    padding: 1rem 2rem;
  }
}
</style>
