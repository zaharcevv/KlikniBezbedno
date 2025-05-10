<template>
  <div class="profile-wrapper">
    <v-container class="profile-container" fluid>
      <v-card class="profile-card" flat>
        <h1 class="profile-title">Твојот Сајбер Херој!</h1>

        <v-avatar v-if="userData?.avatar" size="120" class="avatar-glow mb-6">
          <img :src="userData.avatar" alt="avatar" />
        </v-avatar>

        <div class="profile-info">
          <p>{{ userData?.username || 'N/A' }}</p>
          <p>{{ user?.email || 'N/A' }}</p>
        </div>

        <v-btn class="logout-button mt-6" @click="logout" block>
          Logout
        </v-btn>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/firebase'

export default {
  setup() {
    const user = ref(null)
    const userData = ref(null)
    const router = useRouter()

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

    return { user, userData, logout }
  }
}
</script>

<style scoped>
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
