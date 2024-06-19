import './assets/css/main.css'
import 'primeicons/primeicons.css'
//导入remixicon
import 'remixicon/fonts/remixicon.css'
// @ts-ignore
import { zh_CN } from '@/config/locale'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

import App from './App.vue'
import router from './router'
import { MyPreset } from '@/presets/MyPreset'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  locale: zh_CN,
  theme: {
    preset: MyPreset,
    options: {
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue, tailwind-utilities'
      }
    }
  },
  pt: {
    datatable: {
      mask: {
        class: '!absolute'
      }
    }
  }
})
app.use(ToastService)
app.use(ConfirmationService)

app.mount('#app')
