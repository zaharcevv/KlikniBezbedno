import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const userData = ref({
    currentIsland: 1,
    hearts: 5,
    xp: 0
  })

  function resetHearts() {
    userData.value.hearts = 5
  }

  function loseHeart() {
    if (userData.value.hearts > 0) {
      userData.value.hearts--
    }
  }

  function addXP(amount) {
    userData.value.xp += amount
  }

  async function fetchUserData() {
    // Пример симулација — тука можеш да ставиш повик од API или Firebase
    userData.value = {
      currentIsland: 2,
      hearts: 4,
      xp: 150
    }
  }

  return {
    userData,
    resetHearts,
    loseHeart,
    addXP,
    fetchUserData // важно: додадено во return
  }
})
