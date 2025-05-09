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

  return {
    userData,
    resetHearts,
    loseHeart,
    addXP
  }
})
