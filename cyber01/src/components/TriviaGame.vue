<template>
  <div class="mini-game">
    <div class="mini-game-content">
      <div v-if="!started && !gameOver" class="start-section">
        <h2>🎮 Мини игра</h2>
        <p class="high-score">Твојот рекорд: {{ highScore }} поени</p>
        <button @click="startGame" class="start-btn">Започни мини игра</button>
      </div>

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

      <div v-if="gameOver">
        <h2>⏰ Времето истече!</h2>
        <p>Вашиот краен резултат: <strong>{{ score }}</strong></p>
        <button @click="resetGame" class="start-btn">Играј повторно</button>
      </div>
    </div>

    <div class="leaderboard-section">
      <h3>🏆 Лидерборд</h3>
      <ul>
        <li v-for="entry in leaderboard" :key="entry.id" class="leaderboard-entry">
          <img
            class="avatar"
            :src="entry.avatar || defaultAvatar"
            alt="avatar"
          />
          <strong>{{ entry.username }}</strong> — {{ entry.score }} поени
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import questions from '@/assets/questions.js';
import { getAuth } from 'firebase/auth';
import { db } from '@/firebase/firebase.js';
import {
  getDoc,
  getDocs,
  doc,
  setDoc,
  collection,
} from 'firebase/firestore';

export default {
  name: 'TriviaGame',
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
      leaderboard: [],
      defaultAvatar: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=DefaultUser',
    };
  },
  methods: {
    async fetchHighScore() {
      const user = getAuth().currentUser;
      if (!user) return;

      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        this.highScore = snap.data().triviaScore || 0;
      }
    },

    async fetchLeaderboard() {
      const snap = await getDocs(collection(db, 'users'));
      const list = [];

      snap.forEach(docSnap => {
        const data = docSnap.data();
        if (data.triviaScore !== undefined) {
          list.push({
            id: docSnap.id,
            username: data.username || 'Непознат',
            avatar: data.avatar || null,
            score: data.triviaScore,
          });
        }
      });

      this.leaderboard = list.sort((a, b) => b.score - a.score);
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
      }
    },

    submitAnswer(selected) {
      if (selected === this.currentQuestion.correctAnswer) {
        this.score += 5;
      }
      this.nextQuestion();
    },

    startTimer() {
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

      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      const previousScore = snap.exists() ? snap.data().triviaScore || 0 : 0;

      if (!snap.exists() || this.score > previousScore) {
        await setDoc(ref, {
          triviaScore: this.score,
        }, { merge: true });
      }

      this.highScore = Math.max(this.highScore, this.score);
      await this.fetchLeaderboard();
    },
  },
  created() {
    this.fetchHighScore();
    this.fetchLeaderboard();
  },
};
</script>

<style scoped>
.mini-game {
  position: relative;
  z-index: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #0a0f1f;
  padding: 30px;
  font-family: 'Orbitron', sans-serif;
  color: #e0f7ff;
}

.mini-game-content {
  position: relative;
  z-index: 10;
  background: rgba(10, 15, 31, 0.95);
  border: 2px solid #00e5ff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 0 20px #00e5ff55;
  max-width: 700px;
  width: 100%;
  text-align: center;
  margin-bottom: 30px;
}

.start-btn {
  padding: 14px 28px;
  font-size: 18px;
  border-radius: 12px;
  background-color: #00e5ff;
  color: #0a0f1f;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 0 16px #00e5ff;
  transition: 0.2s;
}

.start-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 24px #00e5ff;
}

.info-bar {
  display: flex;
  justify-content: space-between;
  color: #00e5ff;
  margin-bottom: 20px;
}

.question-box {
  background: #101c30;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 0 12px #00e5ff33;
}

.question {
  font-weight: bold;
  font-size: 20px;
  color: #00e5ff;
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
  border-radius: 10px;
  border: 2px solid #00e5ff33;
  color: #e0f7ff;
  cursor: pointer;
}

.option-btn:hover {
  background: #00e5ff;
  color: #101c30;
  box-shadow: 0 0 16px #00e5ff;
}

.high-score {
  color: #00e5ff;
  margin-bottom: 20px;
}

.leaderboard-section {
  position: relative;
  z-index: 10;
  max-width: 700px;
  width: 100%;
  background: rgba(0, 229, 255, 0.05);
  border: 1px solid #00e5ff33;
  border-radius: 12px;
  padding: 20px;
}

.leaderboard-section h3 {
  margin-bottom: 10px;
  color: #00e5ff;
}

.leaderboard-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.leaderboard-entry {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  padding: 6px 10px;
  background: rgba(0, 229, 255, 0.08);
  border-left: 4px solid #00e5ff;
  border-radius: 6px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #00e5ff88;
  background: #0e1b2e;
}
</style>
