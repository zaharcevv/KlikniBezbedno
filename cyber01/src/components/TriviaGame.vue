<template>
  <div class="trivia-game">
    <div v-if="!gameOver">
      <h2>⏳ Преостанато време: {{ timeLeft }}s</h2>
      <h3>🎯 Резултат: {{ score }}</h3>

      <div class="question-box">
        <p class="question">{{ currentQuestion.question }}</p>
        <div class="options">
          <button
            v-for="option in currentQuestion.options"
            :key="option"
            @click="submitAnswer(option)"
            class="option-btn"
          >
            {{ option }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="game-over">
      <h2>🎉 Играта заврши!</h2>
      <p>Вашиот резултат: <strong>{{ score }}</strong></p>
      <button @click="startGame">Започни повторно</button>
    </div>
  </div>
</template>

<script>
import questions from '@/assets/questions.json';
import { db, auth } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default {
  name: 'TriviaGame',
  data() {
    return {
      questions: questions,
      currentQuestion: {},
      score: 0,
      timeLeft: 60,
      timer: null,
      gameOver: false,
    };
  },
  methods: {
    pickRandomQuestion() {
      const index = Math.floor(Math.random() * this.questions.length);
      this.currentQuestion = this.questions[index];
    },

    submitAnswer(selectedOption) {
      if (selectedOption === this.currentQuestion.correctAnswer) {
        this.score += 5;
      }
      this.pickRandomQuestion();
    },

    startTimer() {
      this.timeLeft = 60;
      this.timer = setInterval(() => {
        this.timeLeft--;
        if (this.timeLeft <= 0) {
          clearInterval(this.timer);
          this.endGame();
        }
      }, 1000);
    },

    async endGame() {
      this.gameOver = true;
      const user = auth.currentUser;
      if (user) {
        const sessionRef = doc(collection(db, 'triviaScores', user.uid, 'sessions'));
        await setDoc(sessionRef, {
          score: this.score,
          timestamp: serverTimestamp(),
        });
      }
    },

    startGame() {
      this.score = 0;
      this.timeLeft = 60;
      this.gameOver = false;
      this.pickRandomQuestion();
      this.startTimer();
    },
  },
  created() {
    this.startGame();
  },
};
</script>

<style scoped>
.trivia-game {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 30px;
}

.question-box {
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
}

.question {
  font-size: 20px;
  font-weight: bold;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
}

.option-btn {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 8px;
  border: none;
  background-color: #e0e0e0;
  transition: background-color 0.2s;
}

.option-btn:hover {
  background-color: #c8e6c9;
}

.game-over {
  padding-top: 40px;
}
</style>
