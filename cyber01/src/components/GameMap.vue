<template>
  <div class="map-background" aria-hidden="true"></div>
  <canvas class="map-particles" ref="particlesCanvas"></canvas>
  <div class="vertical-map-wrapper">
    <div class="vertical-map">
      <div
        v-for="(island, index) in islands"
        :key="island.id"
        class="map-level"
      >
        <div v-if="index !== 0" class="connector"></div>

        <div
          :class="['level-node', {
            unlocked: index + 1 <= userData.currentIsland,
            current: userData.currentIsland === island.id
          }]"
          @click="openIsland(island)"
        >
          <v-icon v-if="userData.currentIsland > island.id" size="28">mdi-check</v-icon>
          <v-icon v-else-if="userData.currentIsland === island.id" size="28">mdi-star</v-icon>
          <v-icon v-else size="28">mdi-lock</v-icon>
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { islands } from '@/data/islands.js'
import QuestionDialog from './QuestionDialog.vue'

const userStore = useUserStore()
const userData = userStore.userData

const selectedIsland = ref(null)
const showDialog = ref(false)

const openIsland = (island) => {
  if (island.id <= userData.currentIsland) {
    selectedIsland.value = island
    showDialog.value = true
  }
}

const onCompleted = () => {
  if (userData.currentIsland < selectedIsland.value.id + 1) {
    userData.currentIsland++
    userData.xp += 10
  }
}

const particlesCanvas = ref(null)

onMounted(() => {
  const canvas = particlesCanvas.value
  const ctx = canvas.getContext('2d')
  let particles = []

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  const createParticles = () => {
    particles = []
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speedY: Math.random() * 0.3 + 0.2
      })
    }
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach(p => {
      p.y += p.speedY
      if (p.y > canvas.height) p.y = 0
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI)
      ctx.fillStyle = '#00ffee'
      ctx.fill()
    })
    requestAnimationFrame(animate)
  }

  window.addEventListener('resize', () => {
    resize()
    createParticles()
  })

  resize()
  createParticles()
  animate()
})
</script>

<style scoped>
.vertical-map-wrapper {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
  z-index: 1;
  position: relative;
}

.vertical-map {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.map-level {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.connector {
  width: 2px;
  height: 40px;
  background: repeating-linear-gradient(
    to bottom,
    #00ffee,
    #00ffee 5px,
    transparent 5px,
    transparent 10px
  );
}

.level-node {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.2s ease;
  cursor: default;
}

.level-node.unlocked {
  background-color: #ffffff;
  border: 3px solid #00ffee;
  cursor: pointer;
}

.level-node.current {
  background-color: #00ffee;
  color: white;
  animation: bounce 1.2s infinite;
}

.level-label {
  margin-top: 6px;
  font-size: 12px;
  text-align: center;
  color: #ddd;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.map-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    repeating-linear-gradient(0deg, #00ffee10 0, #00ffee10 1px, transparent 1px, transparent 20px),
    repeating-linear-gradient(90deg, #00ffee10 0, #00ffee10 1px, transparent 1px, transparent 20px),
    #0e0e1a;
  animation: scrollGrid 30s linear infinite;
  z-index: 0;
  pointer-events: none;
}

@keyframes scrollGrid {
  from {
    background-position: 0 0, 0 0;
  }
  to {
    background-position: 0 100px, 100px 0;
  }
}

.map-particles {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>