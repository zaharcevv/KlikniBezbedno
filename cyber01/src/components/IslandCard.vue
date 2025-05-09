<template>
  <div class="island-node" @click="$emit('enter-island')">
    <v-img
      :src="`/themes/${island.theme}.${getImageExtension(island.theme)}`"
      class="circle-img"
      cover
    />
    <div class="label">{{ island.title }}</div>
    <v-btn
      class="enter-btn"
      :disabled="!isUnlocked"
      size="x-small"
      color="primary"
    >
      {{ isUnlocked ? 'Start' : 'Locked' }}
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
  transition: transform 0.2s ease;
}

.island-node:hover {
  transform: scale(1.05);
}

.circle-img {
  border-radius: 50%;
  width: 100%;
  height: 100%;
  border: 3px solid #ccc;
}

.label {
  position: absolute;
  bottom: -30px;
  text-align: center;
  font-size: 12px;
  color: #333;
  width: 100%;
}

.enter-btn {
  position: absolute;
  bottom: -60px;
}
</style>