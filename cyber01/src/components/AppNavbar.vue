<template>
  <div class="map-wrapper">
    <canvas ref="confettiCanvas" class="confetti-canvas"></canvas>

    <div class="vertical-map-wrapper">
      <div class="vertical-map">
        <div
          v-for="(island, index) in islands"
          :key="island.id"
          class="map-level"
          :class="{ zigzag: index % 2 !== 0 }"
        >
          <div v-if="index !== 0" class="connector-dots">
            <span v-for="dot in 6" :key="dot" class="dot"></span>
          </div>

          <div
            :title="island.title"
            :class="[
              'level-node',
              {
                unlocked: index + 1 <= userData.currentIsland,
                current: userData.currentIsland === island.id,
                locked: userData.currentIsland < island.id
              }
            ]"
            @click="userData.currentIsland >= island.id && openIsland(island)"
          >
            <v-icon
              :icon="island.icon"
              class="level-icon"
              :color="userData.currentIsland < island.id ? 'grey' : 'cyan'"
              size="48"
            />

            <div v-if="userData.currentIsland < island.id" class="locked-overlay">
              <v-icon size="48" color="#ffffffcc">mdi-lock</v-icon>
            </div>

            <div class="level-overlay">
              <v-icon
                v-if="userData.currentIsland > island.id"
                size="30"
                color="success"
              >mdi-check-circle</v-icon>
              <v-icon
                v-else-if="userData.currentIsland === island.id"
                size="32"
                color="warning"
              >mdi-star-circle</v-icon>
            </div>
          </div>

          <div class="level-label">{{ island.title }}</div>
        </div>
      </div>
    </div>

    <QuestionDialog
      v-if="selectedIsland"
      :island="selectedIsland"
      v-model:visible="showDialog"
      @completed="onCompleted"
    />

    <v-bottom-navigation app height="64" class="cyber-bottom-nav">
      <v-btn to="/map" icon><v-icon>mdi-map</v-icon></v-btn>
      <v-btn to="/achievements" icon><v-icon>mdi-trophy</v-icon></v-btn>
      <v-btn to="/profile" icon><v-icon>mdi-account</v-icon></v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { islands } from '@/data/islands.js'
import QuestionDialog from './QuestionDialog.vue'
import confetti from 'canvas-confetti'

const userStore = useUserStore()
const userData = userStore.userData
const selectedIsland = ref(null)
const showDialog = ref(false)
const confettiCanvas = ref(null)

const openIsland = (island) => {
  if (userData.currentIsland >= island.id) {
    selectedIsland.value = island
    showDialog.value = true
  }
}

const onCompleted = () => {
  if (userData.currentIsland < selectedIsland.value.id + 1) {
    userData.currentIsland++
    userData.xp += 10
    fireConfetti()
  }
}

const fireConfetti = () => {
  const myConfetti = confetti.create(confettiCanvas.value, {
    resize: true,
    useWorker: true,
  })

  myConfetti({
    particleCount: 150,
    spread: 120,
    origin: { y: 0.6 },
    colors: ['#00ffee', '#ff00c8', '#00c8ff', '#ffffff'],
    shapes: ['circle', 'square'],
  })
}
</script>

<style scoped>
.map-wrapper {
  padding-top: 140px;
  animation: fadeIn 1s ease;
  position: relative;
}

.confetti-canvas {
  position: fixed;
  pointer-events: none;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.progress-container {
  width: 90%;
  max-width: 600px;
  margin: 0 auto 2rem auto;
  text-align: center;
}
.progress-text {
  color: #00ffee;
  font-weight: bold;
  margin-bottom: 6px;
}
.progress-bar {
  height: 10px;
  background: #222;
  border-radius: 10px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ffee, #ff00c8);
  transition: width 0.5s ease;
}

.vertical-map-wrapper {
  display: flex;
  justify-content: center;
  z-index: 1;
  position: relative;
}

.vertical-map {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  padding: 2rem;
  border-radius: 16px;
  position: relative;
}

.map-level {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.map-level.zigzag {
  align-self: flex-end;
}

.connector-dots {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 10px 0;
}
.dot {
  width: 8px;
  height: 8px;
  background: #00ffee;
  border-radius: 50%;
  box-shadow: 0 0 6px #00ffeeaa;
}

.level-node {
  width: 110px;
  height: 110px;
  border-radius: 20px;
  background: #111;
  box-shadow: 0 0 15px #00ffeeaa;
  position: relative;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  border: 3px solid #00ffee33;
  display: flex;
  align-items: center;
  justify-content: center;
}
.level-node:hover {
  transform: scale(1.07);
  box-shadow: 0 0 25px #00ffff;
}
.level-node.unlocked {
  border: 3px solid #00ffee;
}
.level-node.current {
  border: 3px solid #ff00c8;
  animation: bounce 1.2s infinite, pulse 3s infinite;
}
.level-node.locked {
  cursor: not-allowed;
}

.level-icon {
  z-index: 1;
  position: relative;
  background: linear-gradient(135deg, #0e0e1a, #1f1f2e);
  border-radius: 50%;
  padding: 12px;
  box-shadow: 0 0 10px #00ffffaa, 0 0 18px #00ffee66 inset;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
}
.level-node:hover .level-icon {
  transform: scale(1.2) rotate(2deg);
}

.locked-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(3px);
  background: rgba(0, 0, 0, 0.5);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.level-overlay {
  position: absolute;
  bottom: 6px;
  right: 6px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 12px;
  padding: 2px 4px;
  z-index: 3;
}

.you-are-here {
  position: absolute;
  top: -22px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #ff00c8;
  background: #0e0e1a;
  border: 1px solid #ff00c8;
  border-radius: 8px;
  padding: 2px 6px;
  box-shadow: 0 0 8px #ff00c8aa;
  z-index: 3;
}

.unlocked-badge {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: #00ffee;
  color: #000;
  font-weight: bold;
  padding: 6px 10px;
  border-radius: 12px;
  font-size: 12px;
  box-shadow: 0 0 12px #00ffeeaa;
  animation: floatUp 2s ease-out;
  z-index: 4;
}

@keyframes floatUp {
  0% { opacity: 0; transform: translate(-50%, 10px); }
  30% { opacity: 1; transform: translate(-50%, 0); }
  100% { opacity: 0; transform: translate(-50%, -30px); }
}

.level-label {
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: #e0f7ff;
  text-shadow: 0 0 5px #00e5ff99;
}

.cyber-bottom-nav {
  background: rgba(14, 20, 30, 0.8);
  backdrop-filter: blur(10px);
  border-top: 1px solid #00ffee33;
  box-shadow: 0 -2px 10px #00ffee55;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 10;
}

.v-bottom-navigation .v-btn {
  color: #00ffee !important;
  transition: transform 0.3s;
}
.v-bottom-navigation .v-btn:hover {
  transform: scale(1.2);
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 15px #00ffeeaa; }
  50% { box-shadow: 0 0 30px #00ffee; }
}
</style>