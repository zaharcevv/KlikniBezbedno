  <template>
    <v-dialog v-model="internalVisible" max-width="600" persistent transition="dialog-bottom-transition">
      <v-card class="dialog-card animate__animated animate__fadeInUp">
        <div class="dialog-background" :style="{ backgroundImage: `url(${island.image})` }"></div>

        <v-card-title class="title">
          {{ island.scenarioTitle }}
        </v-card-title>

        <v-card-text class="question-layout">
          <transition name="fade" mode="out-in">
            <div v-if="true" key="scenario" class="scenario-box">
              <v-icon class="mb-2 scenario-icon" size="42">mdi-lightbulb-on-outline</v-icon>
              <p class="scenario-text">{{ island.scenario }}</p>
            </div>
          </transition>

          <transition-group name="fade" tag="div" class="options-box">
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
          </transition-group>

          <transition name="fade">
            <div v-if="showExplanation">
              <p class="explanation">{{ explanation }}</p>
              <v-btn
                v-if="answered && explanation.includes('❌')"
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
            :disabled="!answered"
            color="cyan darken-2"
            class="next-btn animate__animated animate__pulse animate__infinite"
          >
            {{ isLastQuestion ? 'Готово' : 'Следно' }}
          </v-btn>
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
  watch(() => props.visible, (val) => { internalVisible.value = val })
  watch(internalVisible, (val) => { emit('update:visible', val) })

  const questionIndex = ref(0)
  const showExplanation = ref(false)
  const explanation = ref('')
  const answered = ref(false)
  const selectedIndex = ref(null)

  const currentQuestion = computed(() => props.island.questions[questionIndex.value])
  const isLastQuestion = computed(() => questionIndex.value === props.island.questions.length - 1)

  watch(() => props.visible, (val) => {
    if (val) resetAll()
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
    if (index === selectedIndex.value && index !== currentQuestion.value.correct) return 'red'
    if (index === selectedIndex.value && index === currentQuestion.value.correct) return 'green'
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
    explanation.value = ''
    answered.value = false
    selectedIndex.value = null
  }

  const resetAnswer = () => {
    answered.value = false
    showExplanation.value = false
    explanation.value = ''
    selectedIndex.value = null
  }
  </script>

  <style scoped>
  @import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';

  .dialog-card {
    position: relative;
    background-color: rgba(6, 14, 22, 0.97);
    color: #e0f7ff;
    border-radius: 40px;
    overflow: hidden;
    box-shadow: 0 0 36px #00ffee88;
    border: 2px solid #00ffee44;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 50vh;
    max-height: 90vh;
    width: 100%;
  }

  .dialog-background {
    background-size: cover;
    background-position: center;
    position: absolute;
    inset: 0;
    z-index: 0;
    filter: brightness(0.25);
  }

  .title {
    z-index: 1;
    position: relative;
    text-align: center;
    font-size: 28px;
    font-weight: 800;
    color: #00ffee;
    text-shadow: 0 0 14px #00ffeeaa;
    padding: 24px 16px 0;
    white-space: normal;
    overflow-wrap: break-word;
    word-break: break-word;
  }

  .question-layout {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;
    gap: 20px;
    padding: 20px;
    position: relative;
    z-index: 1;
  }

  .scenario-box {
    padding: 1.2rem;
    background: rgba(18, 26, 38, 0.94);
    border-radius: 20px;
    text-align: center;
    color: #c6f9ff;
    box-shadow: inset 0 0 16px #00ffee33;
    font-size: 16px;
  }

  .scenario-text {
    white-space: normal;
    overflow: visible;
    text-overflow: unset;
    display: block;
    font-size: 16px;
    line-height: 1.5;
  }

  .scenario-icon {
    color: #00ffee;
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
    transition: transform 0.2s ease, background 0.3s;
  }
  .answer-btn:hover {
    transform: scale(1.05);
  }

  .explanation {
    margin-top: 16px;
    background: rgba(0, 255, 238, 0.1);
    padding: 12px;
    border-radius: 10px;
    text-align: center;
    font-size: 15px;
    color: #ffffff;
    box-shadow: inset 0 0 6px #00ffee55;
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
    z-index: 1;
    position: relative;
  }

  .next-btn {
    border-radius: 12px;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 15px;
    padding: 10px 24px;
    box-shadow: 0 0 14px #00ffeeaa;
  }

  @media (max-width: 600px) {
    .dialog-card {
      border-radius: 20px;
      min-height: 55vh;
      max-width: 95vw;  
    }

    .title {
      font-size: 22px;
      padding: 16px;
    }

    .scenario-box {
      font-size: 15px;
    }

    .answer-btn {
      font-size: 15px;
    }

    .next-btn {
      font-size: 14px;
      padding: 10px 20px;
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: all 0.4s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
  </style>
