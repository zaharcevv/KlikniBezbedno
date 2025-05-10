import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css' // ✅ MDI CSS for icons
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { mdi } from 'vuetify/iconsets/mdi' // ✅ MDI icon set

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi', // ✅ use MDI
    sets: {
      mdi,
    },
  },
})

createApp(App)
  .use(router)
  .use(createPinia())
  .use(vuetify)
  .mount('#app')
