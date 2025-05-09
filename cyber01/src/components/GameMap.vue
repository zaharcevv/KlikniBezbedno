<template>
  <div class="map-wrapper">
    <div class="vertical-map-wrapper">
      <div class="vertical-map">
        <div
          class="animated-robot"
          :style="{
            top: `${userData.currentIsland * 130}px`,
            left: userData.currentIsland % 2 === 0 ? '60%' : '20%'
          }"
        >
          <div class="robot-body">
            <div class="robot-eyes">
            <div class="robot-eye"></div>
            <div class="robot-eye"></div>
            </div>
            <div class="robot-mouth"></div>
          </div>
        </div>

        <div
          v-for="(island, index) in islands"
          :key="island.id"
          class="map-level"
          :class="{ zigzag: index % 2 !== 0 }"
        >
          <div v-if="index !== 0" class="connector"></div>

          <div
            :class="['level-node', {
              unlocked: index + 1 <= userData.currentIsland,
              current: userData.currentIsland === island.id
            }]"
            @click="openIsland(island)"
          >
            <v-icon v-if="userData.currentIsland > island.id" size="28" color="success">mdi-check-circle</v-icon>
            <v-icon v-else-if="userData.currentIsland === island.id" size="32" color="warning">mdi-star-circle</v-icon>
            <v-icon v-else size="28" color="grey">mdi-lock</v-icon>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
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
</script>

<style scoped>
.map-wrapper {
  padding-top: 120px;
  animation: fadeIn 1s ease;
  position: relative;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
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
  gap: 2rem;
  padding: 2rem;
  border-radius: 16px;
  position: relative;
}

.map-level {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  transition: transform 0.3s;
}

.map-level.zigzag {
  align-self: flex-end;
}

.connector {
  width: 4px;
  height: 60px;
  background: linear-gradient(to bottom, #00ffee, #007777);
  border-radius: 4px;
  box-shadow: 0 0 10px #00ffee66;
}

.level-node {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.4);
}

.level-node:hover {
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
}

.level-node.unlocked {
  background-color: #0e0e1a;
  border: 3px solid #00ffee;
}

.level-node.current {
  background-color: #00ffee;
  color: white;
  animation: bounce 1.2s infinite;
}

.level-label {
  margin-top: 10px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  color: #e0f7ff;
  text-shadow: 0 0 3px #00e5ff66;
}

.animated-robot {
  position: absolute;
  transition: top 0.6s ease, left 0.6s ease;
  z-index: 3;
}

.robot-body {
  width: 40px;
  height: 40px;
  background: #ff00c8;
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 8px #00ffee;
}

.robot-eye {
  width: 6px;
  height: 6px;
  background: black;
  border-radius: 50%;
  margin: 2px;
}

.robot-eyes{
  display: flex;
}
.robot-mouth {
  width: 12px;
  height: 3px;
  background: black;
  margin-top: 4px;
  border-radius: 2px;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>
