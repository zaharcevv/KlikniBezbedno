<template>
  <div class="mini-game">
    <div class="mini-game-content">
      <!-- Start Screen -->
      <div v-if="!started && !gameOver">
        <h2>🎮 Мини игра</h2>
        <p class="high-score">🎖 Твојот рекорд: {{ highScore }} поени</p>
        <button @click="startGame" class="start-btn">Започни мини игра</button>
      </div>

      <!-- Game Screen -->
      <div v-if="started && !gameOver">
        <div class="info-bar">
          <h3>⏳ Време: {{ timeLeft }}s</h3>
          <h3>🎯 Резултат: {{ score }}</h3>
        </div>

        <div class="question-box" v-if="currentQuestion">
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

      <!-- Game Over Screen -->
      <div v-if="gameOver">
        <h2>⏰ Времето истече!</h2>
        <p>Вашиот краен резултат: <strong>{{ score }}</strong></p>
        <button @click="resetGame" class="start-btn">Играј повторно</button>
      </div>
    </div>
  </div>
</template>

<script>
import questions from '@/assets/questions.js';
import { getAuth } from 'firebase/auth';
import { db } from '@/firebase/firebase.js';
import { getDoc, doc, setDoc } from 'firebase/firestore';

export default {
  name: 'MiniGame',
  data() {
    return {
      allQuestions: [...questions],
      availableQuestions: [],
      currentQuestion: null,
      score: 0,
      timeLeft: 60,
      timer: null,
      started: false,
      gameOver: false,
      highScore: 0,
    };
  },
  methods: {
    async fetchHighScore() {
      const user = getAuth().currentUser;
      if (!user) return;

      const highscoreRef = doc(db, 'users', user.uid, 'trivia', 'highscore');
      try {
        const snapshot = await getDoc(highscoreRef);
        if (snapshot.exists()) {
          this.highScore = snapshot.data().score || 0;
        }
      } catch (err) {
        console.error('Failed to fetch high score:', err);
      }
    },

    startGame() {
      this.resetGame();
      this.started = true;
      this.availableQuestions = this.shuffle([...this.allQuestions]);
      this.nextQuestion();
      this.startTimer();
    },

    resetGame() {
      clearInterval(this.timer);
      this.score = 0;
      this.timeLeft = 60;
      this.started = false;
      this.gameOver = false;
      this.availableQuestions = [];
      this.currentQuestion = null;
    },

    shuffle(array) {
      return array.sort(() => Math.random() - 0.5);
    },

    nextQuestion() {
      if (this.availableQuestions.length > 0) {
        const question = this.availableQuestions.pop();
        question.options = this.shuffle([...question.options]);
        this.currentQuestion = question;
      } else {
        this.availableQuestions = this.shuffle([...this.allQuestions]);
        this.nextQuestion();
      }
    },

    submitAnswer(selected) {
      if (selected === this.currentQuestion.correctAnswer) {
        this.score += 5;
      }
      this.nextQuestion();
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
      this.started = false;
      this.gameOver = true;

      const user = getAuth().currentUser;
      if (!user) return;

      const highscoreRef = doc(db, 'users', user.uid, 'trivia', 'highscore');
      try {
        const snapshot = await getDoc(highscoreRef);
        const previousHigh = snapshot.exists() ? snapshot.data().score : 0;

        if (!snapshot.exists() || this.score > previousHigh) {
          await setDoc(highscoreRef, {
            score: this.score,
            updatedAt: new Date(),
          });
          this.highScore = this.score;
        }
      } catch (err) {
        console.error('Error saving high score:', err);
      }
    },
  },
  created() {
    this.fetchHighScore();
  },
};
</script>

<style scoped>
.mini-game {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  background: #0a0f1f;
  font-family: 'Orbitron', sans-serif;
  color: #e0f7ff;
}

.mini-game-content {
  position: relative;
  z-index: 2;
  max-width: 700px;
  width: 100%;
  text-align: center;
  background: rgba(10, 15, 31, 0.95);
  padding: 40px;
  border-radius: 16px;
  border: 2px solid #00e5ff;
  box-shadow: 0 0 20px #00e5ff55, 0 0 40px #00e5ff22;
}

.start-btn {
  padding: 14px 28px;
  font-size: 18px;
  border: none;
  border-radius: 12px;
  background-color: #00e5ff;
  color: #0a0f1f;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 0 16px #00e5ff, 0 0 32px #00e5ff66;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.start-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 24px #00e5ff, 0 0 48px #00e5ffaa;
}

.info-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  color: #00e5ff;
  text-shadow: 0 0 8px #00e5ff;
  font-weight: bold;
}

.question-box {
  margin-top: 20px;
  padding: 24px;
  background: #101c30;
  border-radius: 12px;
  box-shadow: 0 0 12px #00e5ff33;
}

.question {
  font-weight: bold;
  font-size: 20px;
  color: #00e5ff;
  text-shadow: 0 0 10px #00e5ff88;
}

.options {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-btn {
  padding: 12px;
  font-size: 16px;
  background: #132238;
  color: #e0f7ff;
  border: 2px solid #00e5ff33;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 0 10px #00e5ff11;
  transition: background 0.2s ease, box-shadow 0.2s ease;
}

.option-btn:hover {
  background: #00e5ff;
  color: #101c30;
  box-shadow: 0 0 16px #00e5ff, 0 0 32px #00e5ff88;
}

.high-score {
  color: #00e5ff;
  text-shadow: 0 0 10px #00e5ff88;
  font-size: 18px;
  margin-bottom: 20px;
}
</style>
