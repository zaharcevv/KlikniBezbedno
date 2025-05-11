<template>
  <v-dialog v-model="internalVisible" max-width="860" persistent transition="dialog-bottom-transition">
    <v-card class="dialog-card animate__animated animate__fadeInUp">
      <!-- СЦЕНАРИО -->
      <template v-if="!showQuestions">
        <div class="dialog-content scenario-mode">
          <div class="scenario-side">
            <v-card-title class="title">
              {{ island.scenarioTitle }}
            </v-card-title>

            <div class="scenario-box">
              <v-icon class="mb-2 scenario-icon" size="44">mdi-lightbulb-on-outline</v-icon>
              <p class="scenario-text">{{ island.scenario }}</p>
            </div>

            <v-btn color="cyan darken-2" class="start-btn glow-btn" @click="showQuestions = true">
              Започни со прашања
            </v-btn>
          </div>

          <div class="image-side">
            <div class="dialog-background" :style="{ backgroundImage: `url(${island.image})` }"></div>
          </div>
        </div>
      </template>

      <!-- ПРАШАЊА -->
      <template v-else>
        <div class="dialog-content question-mode">
          <v-card-title class="title">{{ currentQuestion.text }}</v-card-title>

          <v-card-text class="question-layout">
            <transition name="fade-scale">
              <div v-if="true" class="options-box">
                <v-btn
                  v-for="(option, index) in currentQuestion.options"
                  :key="index"
                  class="answer-btn"
                  :color="getButtonColor(index)"
                  :disabled="answered"
                  @click="submitAnswer(index)"
                  block
                >
                  {{ option }}
                </v-btn>
              </div>
            </transition>

            <transition name="fade-scale">
              <div v-if="showExplanation">
                <v-btn
                  color="red darken-1"
                  class="try-again-btn"
                  @click="resetAnswer"
                >
                  Обиди се повторно
                </v-btn>
              </div>
            </transition>
          </v-card-text>

          <v-card-actions class="footer">
            <v-btn
              @click="nextQuestion"
              :disabled="!answered || selectedIndex !== currentQuestion.correct"
              color="cyan darken-2"
              class="next-btn animate__animated animate__pulse animate__infinite"
            >
              {{ isLastQuestion ? 'Готово' : 'Следно' }}
            </v-btn>
          </v-card-actions>
        </div>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  island: Object,
  visible: Boolean
})
const emit = defineEmits(['update:visible', 'completed'])

const internalVisible = ref(props.visible)
watch(() => props.visible, (val) => { internalVisible.value = val })
watch(internalVisible, (val) => { emit('update:visible', val) })

const questionIndex = ref(0)
const showExplanation = ref(false)
const answered = ref(false)
const selectedIndex = ref(null)
const showQuestions = ref(false)

const currentQuestion = computed(() => props.island.questions[questionIndex.value])
const isLastQuestion = computed(() => questionIndex.value === props.island.questions.length - 1)

watch(() => props.visible, (val) => {
  if (val) {
    showQuestions.value = false
    questionIndex.value = 0  // ← ДОДАДИ ОВА
    resetAll()
  }
})


const submitAnswer = (selected) => {
  answered.value = true
  selectedIndex.value = selected
  const correct = selected === currentQuestion.value.correct
  showExplanation.value = !correct
}

const getButtonColor = (index) => {
  if (!answered.value) return 'cyan darken-2'
  if (index === selectedIndex.value && index === currentQuestion.value.correct) return 'green'
  if (index === selectedIndex.value && index !== currentQuestion.value.correct) return 'red'
  return 'grey darken-3'
}

const nextQuestion = () => {
  if (isLastQuestion.value) {
    emit('update:visible', false)
    emit('completed')
  } else {
    questionIndex.value++
    resetAll()
  }
}


const resetAll = () => {
  showExplanation.value = false
  answered.value = false
  selectedIndex.value = null
}

const resetAnswer = () => {
  answered.value = false
  showExplanation.value = false
  selectedIndex.value = null
}
</script>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';

.dialog-card {
  background-color: rgba(8, 16, 26, 0.97);
  color: #e0f7ff;
  border-radius: 24px;
  border: 2px solid #00ffee55;
  box-shadow: 0 0 36px #00ffee88;
  overflow: hidden;
}

.dialog-content {
  display: flex;
  flex-direction: column;
}

.scenario-mode {
  flex-direction: row;
  height: 360px;
}

.question-mode {
  padding: 32px;
  gap: 20px;
}

.scenario-side {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: rgba(10, 16, 24, 0.95);
}

.image-side {
  flex: 1;
  position: relative;
  overflow: hidden;
  border-left: 2px solid #00ffee44;
}

.dialog-background {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(0.45) contrast(1.1);
  animation: zoomInSlow 20s ease-in-out infinite alternate;
}

@keyframes zoomInSlow {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

.title {
  font-size: 24px;
  font-weight: 800;
  color: #00ffee;
  text-align: center;
  text-shadow: 0 0 10px #00ffeeaa;
  margin-bottom: 1rem;
  white-space: normal;
overflow: visible;
text-overflow: unset;

}

.scenario-box {
  background: rgba(20, 30, 45, 0.9);
  border-radius: 16px;
  padding: 16px;
  box-shadow: inset 0 0 12px #00ffee44;
  text-align: center;
}

.scenario-text {
  font-size: 16px;
  line-height: 1.6;
  color: #c6f9ff;
}

.scenario-icon {
  color: #00ffee;
}

.start-btn,
.try-again-btn,
.next-btn {
  font-weight: bold;
  font-size: 15px;
  border-radius: 12px;
  padding: 12px 24px;
  margin-top: 10px;
  text-transform: uppercase;
  transition: transform 0.3s ease;
}

.glow-btn {
  box-shadow: 0 0 16px #00ffeeaa;
}
.glow-btn:hover {
  transform: scale(1.05);
}

.question-layout {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 600px;
  margin: 0 auto;
}

.options-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.answer-btn {
  display: block;
  width: 100%;
  max-width: 100%;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  border-radius: 14px;
  padding: 16px 20px;
  margin: 0 auto;
  transition: all 0.25s ease;
  box-shadow: 0 3px 12px rgba(0, 255, 238, 0.25);
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  line-height: 1.5;
  min-height: 56px;
  text-transform: none;
}



.answer-btn:hover {
  transform: scale(1.04);
  box-shadow: 0 0 18px rgba(0, 255, 238, 0.6);
}

.footer {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .scenario-mode {
    flex-direction: column;
    height: auto;
  }

  .image-side {
    height: 200px;
  }

  .title {
    font-size: 20px;
  }
}
</style>
