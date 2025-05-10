<template>
  <div
    class="island-node"
    @click="$emit('enter-island')"
    :class="{ locked: !isUnlocked }"
  >
    <div class="img-wrapper">
      <v-img
        :src="`/themes/${island.theme}.${getImageExtension(island.theme)}`"
        class="circle-img"
        cover
      />
      <div v-if="!isUnlocked" class="shimmer-lock"></div>
    </div>
    <div class="label">{{ island.title }}</div>
    <v-btn
      class="enter-btn"
      :disabled="!isUnlocked"
      size="x-small"
      color="primary"
      :class="{ 'btn-locked': !isUnlocked }"
    >
      {{ isUnlocked ? '🚀 Start' : '🔒 Locked' }}
    </v-btn>
  </div>
</template>

<script setup>
defineProps({
  island: Object,
  isUnlocked: Boolean
})

const getImageExtension = (theme) => {
  const jpgThemes = ['password-attacks']
  return jpgThemes.includes(theme) ? 'jpg' : 'png'
}
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
}

@keyframes shimmer {
  0% {
    background-position: -100px 0;
  }
  100% {
    background-position: 100px 0;
  }
}

.island-node {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 1rem;
  cursor: pointer;
  animation: float 3s ease-in-out infinite;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}

.island-node:hover {
  transform: scale(1.08);
  box-shadow: 0 0 25px rgba(255, 255, 150, 0.6);
}

.island-node:active {
  transform: scale(0.98);
}

.island-node.locked {
  filter: grayscale(90%);
  opacity: 0.75;
  cursor: not-allowed;
}

.img-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.circle-img {
  border-radius: 50%;
  width: 100%;
  height: 100%;
  border: 4px solid #fff;
  object-fit: cover;
  z-index: 1;
}

.shimmer-lock {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(
    130deg,
    rgba(255, 255, 255, 0) 30%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 70%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  pointer-events: none;
  z-index: 2;
}

.label {
  position: absolute;
  bottom: -30px;
  background: #252537;
  color: #eee;
  font-size: 13px;
  padding: 5px 10px;
  border-radius: 999px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.enter-btn {
  position: absolute;
  bottom: -60px;
  transition: transform 0.2s, box-shadow 0.2s;
  font-weight: bold;
  border-radius: 20px;
}

.enter-btn:hover:not(.btn-locked) {
  transform: scale(1.1);
  box-shadow: 0 0 12px #4fc3f7;
}

.btn-locked {
  background-color: #888 !important;
  color: #fff !important;
  box-shadow: none;
}
</style>
