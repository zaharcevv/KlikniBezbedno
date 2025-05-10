<template>
  <v-dialog v-model="internalVisible" max-width="750" persistent transition="dialog-bottom-transition">
    <v-card class="dialog-card animate__animated animate__fadeInUp">
      
      <!-- СЦЕНАРИО И СЛИКА -->
      <template v-if="!showQuestions">
        <div class="dialog-content">
          <div class="scenario-side">
            <v-card-title class="title">
              {{ island.scenarioTitle }}
            </v-card-title>

            <div class="scenario-box">
              <v-icon class="mb-2 scenario-icon" size="42">mdi-lightbulb-on-outline</v-icon>
              <p class="scenario-text">{{ island.scenario }}</p>
            </div>

            <v-btn
              color="cyan darken-2"
              class="start-btn"
              @click="showQuestions = true"
            >
              Почни со прашања
            </v-btn>
          </div>

          <div class="image-side">
            <div class="dialog-background" :style="{ backgroundImage: `url(${island.image})` }"></div>
          </div>
        </div>
      </template>

      <!-- ПРАШАЊА -->
      <template v-else>
        <v-card-title class="title">{{ currentQuestion.text }}</v-card-title>

        <v-card-text class="question-layout">
          <transition name="fade-scale">
            <div key="answers" class="options-box">
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
            <div v-if="showExplanation" key="retry">
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
  background-color: rgba(6, 14, 22, 0.97);
  color: #e0f7ff;
  border-radius: 24px;
  box-shadow: 0 0 36px #00ffee88;
  border: 2px solid #00ffee44;
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.dialog-content {
  display: flex;
  flex-direction: row;
  height: 340px;
}

.scenario-side {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  background-color: rgba(10, 16, 24, 0.95);
}

.image-side {
  flex: 1;
  position: relative;
}

.dialog-background {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(0.3);
}

.title {
  font-size: 24px;
  font-weight: 800;
  color: #00ffee;
  text-shadow: 0 0 10px #00ffeeaa;
  text-align: center;
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
  word-wrap: break-word;
  word-break: break-word;
  padding: 16px 12px;
}

.scenario-box {
  background: rgba(18, 26, 38, 0.94);
  border-radius: 16px;
  padding: 16px;
  color: #c6f9ff;
  box-shadow: inset 0 0 16px #00ffee33;
  text-align: center;
}

.scenario-text {
  font-size: 16px;
  line-height: 1.5;
}

.scenario-icon {
  color: #00ffee;
}

.start-btn {
  align-self: center;
  font-weight: bold;
  font-size: 14px;
  border-radius: 10px;
  padding: 10px 20px;
  box-shadow: 0 0 10px #00ffeeaa;
}

.question-layout {
  padding: 20px;
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
  font-weight: 600;
  font-size: 16px;
  border-radius: 14px;
  box-shadow: 0 3px 10px rgba(0, 255, 238, 0.25);
  transition: all 0.3s ease;
}
.answer-btn:hover {
  transform: scale(1.04);
  box-shadow: 0 0 16px rgba(0, 255, 238, 0.6);
}

.try-again-btn {
  margin-top: 10px;
  font-weight: bold;
  font-size: 14px;
  border-radius: 10px;
  box-shadow: 0 0 10px #ff0044aa;
}

.footer {
  display: flex;
  justify-content: center;
  padding: 1rem 1.5rem;
}

.next-btn {
  border-radius: 12px;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 15px;
  padding: 10px 24px;
  box-shadow: 0 0 14px #00ffeeaa;
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
  .dialog-content {
    flex-direction: column;
    height: auto;
  }

  .image-side {
    height: 200px;
  }
}
</style>
