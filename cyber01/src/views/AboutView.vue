<template>
  <v-container class="about-wrapper" fluid>
    <div class="about-content">
      <v-btn class="back-btn" color="cyan lighten-2" @click="goBack" icon>
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <h1 class="title">За Нас</h1>

      <p class="intro">
        Ние сме <span class="highlight">Cyber01</span> – тим што верува дека најдобриот начин да ги едуцираш младите е преку игра што остава трага.
      </p>

      <p>
        Создаваме интерактивна приказна за тинејџери од <strong>12 до 16 години</strong>, каде секој избор води кон откритие:
      </p>

      <ul class="bullet-list">
        <li>Како да препознаеш лажен профил?</li>
        <li>Како да се заштитиш од сајбер-насилство?</li>
        <li>Како да не станеш плен на интернет?</li>
      </ul>

      <p>
        Нашата игра <span class="em">не поучува – предупредува, предизвикува и инспирира</span>.
        Низ реални сценарија, играчите учат како да бидат <strong>паметни</strong>, <strong>сигурни</strong> и <strong>свесни</strong> онлајн.
      </p>

      <p class="impact">
        Ова не е само игра. Ова е <strong>дигитална обука</strong> во маскирана форма – каде што секоја приказна е лекција, а секоја одлука е чекор кон <span class="highlight">дигитална зрелост</span>.
      </p>

      <p class="signature">
        Ние сме <strong>Cyber01</strong>. И ние го правиме интернетот побезбеден – <span class="highlight">едно дете во исто време</span>.
      </p>
    </div>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goBack = () => router.back()
</script>

<style scoped>
@import 'https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800&display=swap';

.about-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(6, 14, 22, 0.96);
  color: #e0f7ff;
  padding: 4rem 2rem;
}

.about-content {
  max-width: 800px;
  padding: 2.5rem;
  background: rgba(18, 26, 38, 0.92);
  border-radius: 20px;
  box-shadow: 0 0 36px #00ffee55;
  animation: fadeInClean 0.6s ease-in-out both;
  position: relative;
}

@keyframes fadeInClean {
  from {
    opacity: 0.1;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.back-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 100;
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

.title {
  font-size: 36px;
  font-weight: 800;
  text-align: center;
  color: #00ffee;
  text-shadow: 0 0 10px #00ffee88;
  margin-bottom: 2rem;
  font-family: 'Orbitron', sans-serif;
  text-transform: uppercase;
}

.intro,
.impact,
.signature {
  font-size: 18px;
  margin-bottom: 1.6rem;
  line-height: 1.6;
}

.bullet-list {
  list-style: disc;
  margin-left: 1.5rem;
  margin-top: 1rem;
  margin-bottom: 1.6rem;
  color: #a8faff;
}

.bullet-list li {
  margin-bottom: 0.5rem;
}

.highlight {
  color: #00ffee;
  font-weight: bold;
  text-shadow: 0 0 6px #00ffee55;
}

.em {
  font-style: italic;
  color: #99e9ff;
}
</style>
