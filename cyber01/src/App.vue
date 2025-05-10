<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase/firebase'
import { useUserStore } from '@/stores/user'

const globalParticlesCanvas = ref(null)
const isTransitioning = ref(false)
const route = useRoute()
const userStore = useUserStore()

watch(route, () => {
  isTransitioning.value = true
  setTimeout(() => (isTransitioning.value = false), 600)
})

onMounted(() => {
  // Load user data on auth state change
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await userStore.fetchUserData()
    }
  })

  // Particles setup
  const canvas = globalParticlesCanvas.value
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


<template>
  <v-app>
    <div class="global-background"></div>
    <canvas class="global-particles" ref="globalParticlesCanvas"></canvas>
    <div v-if="isTransitioning" class="transition-overlay"></div>

    <!-- <AppNavbar /> ✅ Good -->
    
    <router-view v-slot="{ Component }">
      <transition name="world" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </v-app>
</template>

<style scoped>
.global-background {
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

.global-particles {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.transition-overlay {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at center, #00ffee33 0%, transparent 80%);
  z-index: 5;
  animation: pulseIn 0.3s ease;
  pointer-events: none;
}

@keyframes pulseIn {
  0% { opacity: 0; transform: scale(0.9); }
  50% { opacity: 0.6; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.2); }
}

.world-enter-active, .world-leave-active {
  transition: all 0.6s ease;
}

.world-enter-from {
  opacity: 0;
  transform: translateY(50px) scale(0.9);
}

.world-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.world-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.world-leave-to {
  opacity: 0;
  transform: translateY(-50px) scale(0.95);
}
</style>