import { createNuxtPersistedState } from 'pinia-plugin-persistedstate/nuxt'
import { useCookie } from '#app' // optional import as Nuxt will auto-import it

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$pinia.use(createNuxtPersistedState(useCookie))
})
