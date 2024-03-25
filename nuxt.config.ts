import { resolve } from 'node:path';
import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
      ],
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
  typescript: {
    strict: true,
    typeCheck: true,
  },
});
