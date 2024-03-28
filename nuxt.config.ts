import { resolve } from 'node:path';
import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        {
          content: 'width=device-width, initial-scale=1',
          name: 'viewport',
        },
      ],
      title: process.env.MAIN_APP_TITLE || 'Music App',
    },
  },
  build: {
    transpile: [
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-solid-svg-icons',
      '@fortawesome/free-regular-svg-icons',
      '@fortawesome/vue-fontawesome',
    ],
  },
  compatibilityDate: '2024-04-03',
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    '@/assets/css/main.css',
  ],
  devtools: {
    enabled: true,
  },
  imports: {
    dirs: ['components/**', 'composables/**', 'utils/**'],
  },
  modules: ['@nuxt/eslint'],
  postcss: {
    plugins: {
      '@csstools/postcss-global-data': {
        files: [resolve(__dirname, 'assets/css/breakpoints.css')],
      },
      'postcss-custom-media': {},
      'postcss-mixins': {
        mixinsFiles: [resolve(__dirname, 'assets/css/mixins/**')],
      },
      'postcss-preset-env': {
        stage: 0,
      },
      'postcss-pxtorem': {
        propList: ['*'],
        replace: true,
      },
    },
  },
  runtimeConfig: {
    public: {
      SERVER_URL: process.env.SERVER_URL || '',
      MAIN_APP_TITLE: process.env.MAIN_APP_TITLE || 'Music App',
    },
  },
  typescript: {
    strict: true,
    typeCheck: true,
  },
});
