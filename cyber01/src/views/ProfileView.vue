<template>
  <div class="profile-wrapper">
    <v-container class="profile-container" fluid>
      <v-card class="profile-card" flat>
        <!-- BACK BUTTON -->
        <v-btn class="back-btn" color="cyan lighten-2" @click="goBack" icon>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <h1 class="profile-title">Твојот Cyber Профил</h1>

        <v-avatar v-if="userData?.avatar" size="120" class="avatar-glow mb-6">
          <img :src="userData.avatar" alt="avatar" />
        </v-avatar>

        <div class="profile-info">
          <p><strong>Корисничко име:</strong> {{ userData?.username || 'N/A' }}</p>
          <p><strong>Email:</strong> {{ user?.email || 'N/A' }}</p>
          <p><strong>Ниво:</strong> <span class="level-tag">Стигнува наскоро...</span></p>
        </div>

        <v-btn class="logout-button mt-6" @click="logout" block>
          Одјави се
        </v-btn>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/firebase'

const router = useRouter()
const user = ref(null)
const userData = ref(null)

const auth = getAuth()

onMounted(() => {
  onAuthStateChanged(auth, async (currentUser) => {
    if (!currentUser) return
    user.value = currentUser

    try {
      const docRef = doc(db, 'users', currentUser.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        userData.value = docSnap.data()
      }
    } catch (err) {
      console.error('Error fetching user data:', err)
    }
  })
})

const logout = async () => {
  try {
    await signOut(auth)
    router.push('/login')
  } catch (err) {
    console.error('Logout failed:', err)
  }
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
@import 'https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800&display=swap';

.profile-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Orbitron', sans-serif;
  background: transparent;
  color: #e0f7ff;
  position: relative;
  z-index: 10;
}

.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-card {
  background-color: rgba(20, 28, 43, 0.95);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 0 24px #00e5ff44, 0 0 48px #00e5ff22;
  text-align: center;
  max-width: 500px;
  width: 100%;
  animation: fadeIn 0.8s ease-out;
  position: relative;
}

.back-btn {
  position: absolute;
  top: 9px;
  left: 9px;
  z-index:1 20;
  background-color: rgba(0, 255, 238, 0.08);
  backdrop-filter: blur(6px);
  border-radius: 50%;
  box-shadow: 0 0 12px #00ffee55;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.back-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 0 18px #00ffeeaa;
}

.profile-title {
  color: #00e5ff;
  font-size: 32px;
  margin-bottom: 2rem;
  text-shadow: 0 0 12px #00e5ff, 0 0 24px #00e5ff88;
}

.avatar-glow {
  box-shadow: 0 0 24px #00e5ff88, 0 0 48px #00e5ff55;
  border: 2px solid #00e5ff;
  margin: 0 auto;
}

.profile-info {
  font-size: 18px;
  line-height: 2;
  text-shadow: 0 0 6px #00e5ff33;
  color: white;
}

.level-tag {
  color: #00ffee;
  font-weight: bold;
  text-shadow: 0 0 8px #00ffee99;
}

.logout-button {
  background: #ff1744;
  color: #ffffff;
  font-weight: bold;
  font-family: 'Orbitron', sans-serif;
  text-transform: uppercase;
  box-shadow: 0 0 16px #ff1744cc, 0 0 32px #ff174499;
  transition: all 0.3s ease;
}

.logout-button:hover {
  background: #ff5252;
  box-shadow: 0 0 24px #ff5252cc, 0 0 48px #ff525288;
  transform: scale(1.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
