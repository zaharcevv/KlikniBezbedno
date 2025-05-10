<template>
  <v-dialog v-model="internalVisible" max-width="840" persistent>
    <v-card class="dialog-card">
      <div class="dialog-background" :style="{ backgroundImage: `url(${island.image})` }"></div>

      <v-card-title class="title">
        {{ island.scenarioTitle }}
      </v-card-title>

      <v-card-text class="question-layout">
        <!-- Сценарио -->
        <div class="scenario-box">
          <v-icon class="mb-2 scenario-icon" size="42">mdi-lightbulb-on-outline</v-icon>
          <p class="scenario-text">{{ island.scenario }}</p>
        </div>

        <!-- Прашања -->
        <div class="options-box">
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

          <p v-if="showExplanation" class="explanation">
            {{ explanation }}
          </p>
        </div>
      </v-card-text>

      <v-card-actions class="footer">
        <div class="btn-wrapper">
          <v-btn
            @click="nextQuestion"
            :disabled="!answered"
            color="cyan darken-2"
            class="next-btn"
          >
            {{ isLastQuestion ? 'Готово' : 'Следно' }}
          </v-btn>
        </div>
      </v-card-actions>
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
watch(() => props.visible, (val) => {
  internalVisible.value = val
})
watch(internalVisible, (val) => {
  emit('update:visible', val)
})

const questionIndex = ref(0)
const showExplanation = ref(false)
const explanation = ref('')
const answered = ref(false)
const selectedIndex = ref(null)

const currentQuestion = computed(() => props.island.questions[questionIndex.value])
const isLastQuestion = computed(() => questionIndex.value === props.island.questions.length - 1)

watch(() => props.visible, (val) => {
  if (val) {
    questionIndex.value = 0
    showExplanation.value = false
    explanation.value = ''
    answered.value = false
    selectedIndex.value = null
  }
})

const submitAnswer = (selected) => {
  answered.value = true
  selectedIndex.value = selected
  const correct = selected === currentQuestion.value.correct
  explanation.value = correct
    ? '✅ Точно! ' + currentQuestion.value.explanation
    : '❌ Неточно. ' + currentQuestion.value.explanation
  showExplanation.value = true
}

const getButtonColor = (index) => {
  if (!answered.value) return 'cyan darken-2'
  if (index === currentQuestion.value.correct) return 'green'
  if (index === selectedIndex.value && index !== currentQuestion.value.correct) return 'red'
  return 'grey darken-3'
}

const nextQuestion = () => {
  showExplanation.value = false
  explanation.value = ''
  answered.value = false
  selectedIndex.value = null
  if (isLastQuestion.value) {
    emit('update:visible', false)
    emit('completed')
  } else {
    questionIndex.value++
  }
}
</script>

<style scoped>
.dialog-card {
  position: relative;
  background-color: rgba(8, 18, 28, 0.96);
  color: #e0f7ff;
  border-radius: 36px;
  overflow: hidden;
  box-shadow: 0 0 36px #00ffee55;
  border: 2px solid #00ffee33;
}

.dialog-background {
  background-size: cover;
  background-position: center;
  position: absolute;
  inset: 0;
  z-index: 0;
  filter: brightness(0.4);
}

.title {
  z-index: 1;
  position: relative;
  text-align: center;
  font-size: 36px;
  font-weight: 700;
  color: #00ffee;
  text-shadow: 0 0 12px #00ffeeaa;
  padding-top: 20px;
}

.question-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
  position: relative;
  z-index: 1;
}

.scenario-box {
  padding: 1.5rem;
  background: rgba(18, 26, 38, 0.95);
  border-radius: 30px;
  text-align: center;
  color: #bdefff;
  box-shadow: inset 0 0 16px #00ffee33;
  font-size: 17px;
}

.scenario-icon {
  color: #00ffee;
}

.options-box {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.answer-btn {
  font-weight: 600;
  font-size: 16px;
  border-radius: 18px;
  box-shadow: 0 3px 14px rgba(0, 255, 238, 0.25);
  transition: transform 0.2s ease;
}
.answer-btn:hover {
  transform: scale(1.04);
}

.explanation {
  margin-top: 18px;
  background: rgba(0, 255, 238, 0.12);
  padding: 14px;
  border-radius: 12px;
  text-align: center;
  font-size: 16px;
  color: #ffffff;
  box-shadow: inset 0 0 6px #00ffee44;
}

.footer {
  display: flex;
  justify-content: center;
  padding-bottom: 1.5rem;
  z-index: 1;
  position: relative;
}

.btn-wrapper {
  text-align: center;
}

.next-btn {
  border-radius: 14px;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 16px;
  box-shadow: 0 0 14px #00ffee88;
  padding: 12px 24px;
}
</style>
