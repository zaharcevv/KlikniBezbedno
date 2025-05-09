import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAiDxI1f3JZcpWz9kAkuoJpYzRM0rJLh-M",
  authDomain: "cyber01-28659.firebaseapp.com",
  projectId: "cyber01-28659",
  storageBucket: "cyber01-28659.firebasestorage.app",
  messagingSenderId: "508326630834",
  appId: "1:508326630834:web:c7964d768780d00f7900ab",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }
