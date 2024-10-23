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
  builder: 'vite',
  compatibilityDate: '2024-04-03',
  css: ['@/assets/css/main.css'],
  devtools: {
    enabled: true,
  },
  imports: {
    dirs: [
      'components/**',
      'composables/**',
      'utils/**',
      'navigations/**',
      'settings/**',
    ],
  },
  modules: ['@nuxt/eslint', 'nuxt-swiper'],
  postcss: {
    plugins: {
      '@csstools/postcss-global-data': {
        files: [
          resolve(__dirname, 'assets/css/breakpoints.css'),
          resolve(__dirname, 'assets/css/main.css'),
        ],
      },
      autoprefixer: {},
      'postcss-custom-media': {},
      'postcss-extend-rule': {},
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
      IMAGE_SIZE: process.env.IMAGE_SIZE || '500',
      LOAD_SIZE: process.env.LOAD_SIZE || '50',
      MAIN_APP_TITLE: process.env.MAIN_APP_TITLE || 'Music App',
      SERVER_URL: process.env.SERVER_URL || '',
    },
  },
  typescript: {
    strict: true,
    typeCheck: true,
  },
});
