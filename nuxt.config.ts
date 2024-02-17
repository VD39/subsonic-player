import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: [
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-solid-svg-icons',
      '@fortawesome/free-regular-svg-icons',
      '@fortawesome/vue-fontawesome',
    ],
  },
  compatibilityDate: '2024-04-03',
  css: ['@fortawesome/fontawesome-svg-core/styles.css'],
  devtools: {
    enabled: true,
  },
  modules: ['@nuxt/eslint'],
});
