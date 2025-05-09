<script setup>
import { onMounted, ref } from 'vue'

const globalParticlesCanvas = ref(null)

onMounted(() => {
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
  <div class="global-background" aria-hidden="true"></div>
  <canvas class="global-particles" ref="globalParticlesCanvas"></canvas>

  <router-view />
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

.global-particles {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
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
</style>
