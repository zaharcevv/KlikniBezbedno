import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAudioStore = defineStore('audio', () => {
  const isMuted = ref(false)
  const audio = new Audio('public/audio/audio.mp3')
  audio.loop = true
  audio.volume = 0.5

  const toggleAudio = () => {
    isMuted.value = !isMuted.value
    audio.muted = isMuted.value
  }

  const startAudio = () => {
    if (!audio.paused) return
    audio.play().catch(() => {}) // prevent autoplay block error
  }

  return { isMuted, toggleAudio, startAudio }
})
