import './assets/css/main.css'
import 'primeicons/primeicons.css'
//导入remixicon
import 'remixicon/fonts/remixicon.css'
import Aura from '@/presets/aura' //import preset

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  unstyled: true,
  pt: Aura
})

app.mount('#app')
