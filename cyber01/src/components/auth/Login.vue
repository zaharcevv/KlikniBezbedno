<template>
  <div class="login-wrapper">
    <v-container class="login-container" fluid>
<v-card class="login-card" flat>
  <h2 class="login-title">Welcome Back, Cyber Hero</h2>
  <p class="login-subtext">Log in to continue your mission</p>
  <v-form @submit.prevent="login" class="form-body">
    <v-text-field
      v-model="email"
      label="Email"
      type="email"
      hide-details
      variant="outlined"
      class="input"
    />
    <v-text-field
      v-model="password"
      label="Password"
      type="password"
      hide-details
      variant="outlined"
      class="input"
    />
    <v-btn type="submit" block class="glow-button">
      Login
    </v-btn>
    <v-alert v-if="error" type="error" class="error-alert" dense>{{ error }}</v-alert>
  </v-form>

  <!-- Register Redirect -->
  <div class="register-redirect">
    <span>Don't have an account?</span>
    <RouterLink to="/register" class="register-link">Register</RouterLink>
  </div>
</v-card>
    </v-container>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase/firebase.js'

export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const router = useRouter()

    const login = async () => {
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value)
        router.push('/dashboard') // or wherever your app goes after login
      } catch (err) {
        error.value = err.message
      }
    }

    return { email, password, error, login }
  },
}
</script>

<style scoped>
.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative;
  z-index: 10;
  color: #e0f7ff;
  font-family: 'Orbitron', sans-serif;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  background-color: #141c2b;
  padding: 2rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 0 20px #00e5ff55, 0 0 40px #00e5ff22;
  max-width: 420px;
  width: 100%;
}

.login-title {
  font-size: 28px;
  text-align: center;
  color: #00e5ff;
  text-shadow: 0 0 12px #00e5ff, 0 0 24px #00e5ff88;
  margin-bottom: 8px;
}

.login-subtext {
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

.register-redirect {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #99dfff;
  text-shadow: 0 0 4px #00e5ff33;
  font-family: 'Orbitron', sans-serif;
}

.register-link {
  display: inline-block;
  margin-left: 8px;
  color: #00e5ff;
  text-decoration: none;
  font-weight: bold;
  text-shadow: 0 0 8px #00e5ff;
  transition: color 0.2s ease;
}

.register-link:hover {
  color: #33f3ff;
  text-shadow: 0 0 12px #00e5ff, 0 0 24px #00e5ff99;
}

</style>
