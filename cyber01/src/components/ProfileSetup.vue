<template>
  <div class="setup-wrapper">
    <v-container class="setup-container" fluid>
      <v-card class="setup-card" flat>
        <h2 class="setup-title">Create Your Cyber Identity</h2>

        <v-form @submit.prevent="submitProfile">
          <v-text-field
            v-model="username"
            label="Username"
            required
            variant="outlined"
            class="input"
            hide-details
          />

          <div class="avatar-grid">
            <v-avatar
              v-for="(avatar, index) in avatars"
              :key="index"
              size="80"
              class="avatar-option"
              :class="{ selected: selectedAvatar === avatar }"
              @click="selectedAvatar = avatar"
            >
              <img :src="avatar" alt="avatar" />
            </v-avatar>
          </div>

          <v-btn type="submit" class="glow-button" block>
            Confirm Profile
          </v-btn>
        </v-form>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase.js'

export default {
  setup() {
    const username = ref('')
    const selectedAvatar = ref('')
    const router = useRouter()

    const avatars = [
      'https://api.dicebear.com/7.x/adventurer/svg?seed=CyberWolf',
      'https://api.dicebear.com/7.x/adventurer/svg?seed=GlitchFox',
      'https://api.dicebear.com/7.x/adventurer/svg?seed=ZeroByte',
      'https://api.dicebear.com/7.x/adventurer/svg?seed=ShadowBlade',
    ]

    const submitProfile = async () => {
      try {
        const auth = getAuth()
        const user = auth.currentUser
        if (!user) throw new Error('No authenticated user found.')

        // Update Firestore user document with username and avatar
        const userRef = doc(db, 'users', user.uid)
        await updateDoc(userRef, {
          username: username.value,
          avatar: selectedAvatar.value,
          updatedAt: new Date(),
        })

        router.push('/map')
      } catch (err) {
        console.error('Error saving profile:', err.message)
        alert('Something went wrong while saving your profile.')
      }
    }

    return {
      username,
      selectedAvatar,
      avatars,
      submitProfile,
    }
  },
}
</script>

<style scoped>
.setup-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: 'Orbitron', sans-serif;
  color: #e0f7ff;
  z-index: 10;
  position: relative;
}

.setup-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.setup-card {
  background-color: #141c2b;
  padding: 2rem 2.5rem;
  max-width: 500px;
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 0 20px #00e5ff55, 0 0 40px #00e5ff22;
}

.setup-title {
  text-align: center;
  color: #00e5ff;
  text-shadow: 0 0 12px #00e5ff, 0 0 24px #00e5ff88;
  margin-bottom: 1.5rem;
}

.input {
  margin-bottom: 1.5rem;
  color: #e0f7ff;
}

.avatar-grid {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.avatar-option {
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px transparent;
  background-color: #0e1628;
  padding: 4px;
  border-radius: 50%;
}

.avatar-option:hover {
  transform: scale(1.1);
  box-shadow: 0 0 16px #00e5ff;
}

.avatar-option.selected {
  border-color: #00e5ff;
  box-shadow: 0 0 16px #00e5ff, 0 0 32px #00e5ff88;
}

.glow-button {
  background: #00e5ff;
  color: #101726;
  font-weight: bold;
  padding: 0.8rem;
  font-size: 16px;
  border-radius: 12px;
  box-shadow: 0 0 16px #00e5ff, 0 0 32px #00e5ff66;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.glow-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 24px #00e5ff, 0 0 48px #00e5ffaa;
}
</style>
