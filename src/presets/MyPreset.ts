import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'

export const MyPreset = definePreset(Aura, {
  components: {
    datatable: {
      colorScheme: {
        light: {},
        dark: {}
      }
    }
  }
})
