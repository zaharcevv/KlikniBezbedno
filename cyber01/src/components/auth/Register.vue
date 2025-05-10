<template>
  <div class="register-wrapper">
    <v-container class="register-container" fluid>
      <v-card class="register-card" flat>
        <h2 class="register-title">Register as a Cyber Hero</h2>
        <p class="register-subtext">Create your account to begin your journey</p>
        <v-form @submit.prevent="register">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            required
            hide-details
            variant="outlined"
            class="input"
          />
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            required
            hide-details
            variant="outlined"
            class="input"
          />
          <v-btn type="submit" block class="glow-button">
            Register
          </v-btn>
          <v-alert v-if="error" type="error" class="error-alert" dense>{{ error }}</v-alert>
        </v-form>

        <div class="login-redirect">
          <span>Already have an account?</span>
          <RouterLink to="/login" class="login-link">Login</RouterLink>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../../firebase/firebase.js'

export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const router = useRouter()

    const register = async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
        const user = userCredential.user

        // Save user data to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          createdAt: new Date()
        })

        // Navigate to profile setup
        router.push('/setup')
      } catch (err) {
        error.value = err.message
      }
    }

    return { email, password, error, register }
  },
}
</script>

<style scoped>
.register-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative;
  z-index: 10;
  color: #e0f7ff;
  font-family: 'Orbitron', sans-serif;
}

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.register-card {
  background-color: #141c2b;
  padding: 2rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 0 20px #00e5ff55, 0 0 40px #00e5ff22;
  max-width: 420px;
  width: 100%;
}

.register-title {
  font-size: 28px;
  text-align: center;
  color: #00e5ff;
  text-shadow: 0 0 12px #00e5ff, 0 0 24px #00e5ff88;
  margin-bottom: 8px;
}

.register-subtext {
  text-align: center;
  color: #99dfff;
  font-size: 14px;
  margin-bottom: 24px;
  text-shadow: 0 0 6px #00e5ff33;
}

.input {
  margin-bottom: 16px;
  color: #e0f7ff;
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

.error-alert {
  margin-top: 1rem;
  background-color: #ff0033cc;
  border: 1px solid #ff0033;
  color: white;
  font-weight: bold;
  text-shadow: 0 0 6px red;
}

.login-redirect {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #99dfff;
  text-shadow: 0 0 4px #00e5ff33;
  font-family: 'Orbitron', sans-serif;
}

.login-link {
  display: inline-block;
  margin-left: 8px;
  color: #00e5ff;
  text-decoration: none;
  font-weight: bold;
  text-shadow: 0 0 8px #00e5ff;
  transition: color 0.2s ease;
}

.login-link:hover {
  color: #33f3ff;
  text-shadow: 0 0 12px #00e5ff, 0 0 24px #00e5ff99;
}
</style>
