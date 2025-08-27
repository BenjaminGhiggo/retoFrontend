// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  //configuracion para Pinia
  modules: ['@pinia/nuxt', '@nuxt/eslint', '@nuxt/fonts', '@nuxt/test-utils'],

  //configuramos plugins
  plugins: [
    '../plugins/firebase.client.ts'
  ],

  //configuramos Typescript estricto
  typescript: {
    strict: true,
    typeCheck: true,
    includeWorkspace: true,
  },
  css: ['../assets/styles/main.scss'],

  // Configuramos Sass
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '',
        },
      },
    },
  },
});
