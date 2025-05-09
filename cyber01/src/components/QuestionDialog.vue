<template>
  <v-dialog v-model="internalVisible" max-width="600" persistent>
    <v-card v-if="currentQuestion">
      <v-card-title class="text-h6">{{ currentQuestion.text }}</v-card-title>

      <v-card-text>
        <v-btn
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          class="mb-2"
          block
          color="primary"
          @click="submitAnswer(index)"
        >
          {{ option }}
        </v-btn>
        <p v-if="showExplanation" class="mt-2">{{ explanation }}</p>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn @click="nextQuestion">
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
watch(() => props.visible, (val) => {
  internalVisible.value = val
})
watch(internalVisible, (val) => {
  emit('update:visible', val)
})

const questionIndex = ref(0)
const showExplanation = ref(false)
const explanation = ref('')
const currentQuestion = computed(() => props.island.questions[questionIndex.value])
const isLastQuestion = computed(() => questionIndex.value === props.island.questions.length - 1)

watch(() => props.visible, (val) => {
  if (val) {
    questionIndex.value = 0
    showExplanation.value = false
    explanation.value = ''
  }
})

const submitAnswer = (selected) => {
  const correct = selected === currentQuestion.value.correct
  explanation.value = correct
    ? '✅ Точно! ' + currentQuestion.value.explanation
    : '❌ Неточно. ' + currentQuestion.value.explanation
  showExplanation.value = true
}

const nextQuestion = () => {
  showExplanation.value = false
  explanation.value = ''
  if (isLastQuestion.value) {
    emit('update:visible', false)
    emit('completed')
  } else {
    questionIndex.value++
  }
}
</script>
