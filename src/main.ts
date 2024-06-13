import './assets/css/main.css'
import 'primeicons/primeicons.css'
//导入remixicon
import 'remixicon/fonts/remixicon.css'
import Aura from '@/presets/aura' //import preset]
import { zh_CN } from '@/config/locale'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  unstyled: true,
  pt: Aura,
  locale: zh_CN
})
app.use(ToastService)
app.mount('#app')
