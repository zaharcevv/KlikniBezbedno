import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import GameMap from '@/components/GameMap.vue'
import Register from '@/components/auth/Register.vue'
import Login from '@/components/auth/Login.vue'
import ProfileSetup from '@/components/ProfileSetup.vue'
import ProfileView from '@/views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/map',
      name: 'GameMap',
      component: GameMap,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/setup',
      name: 'ProfileSetup',
      component: ProfileSetup
    },
    {
     path: '/profile',
     name: 'Profile',
     component: ProfileView
    }
  ],
})

export default router