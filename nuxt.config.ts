import { resolve } from 'node:path';
import { defineNuxtConfig } from 'nuxt/config';

import { createPWAConfig } from './config/pwa.config';

const IMPORT_DIRECTORIES = [
  'components/**',
  'composables/**',
  'constants/**',
  'navigations/**',
  'types/**',
  'utils/**',
];

const ENVIRONMENT_VARIABLES = {
  IMAGE_SIZE: process.env.IMAGE_SIZE || '500',
  LOAD_SIZE: process.env.LOAD_SIZE || '50',
  MAIN_APP_TITLE: process.env.MAIN_APP_TITLE || 'Music App',
  SERVER_URL: process.env.SERVER_URL || '',
};

export default defineNuxtConfig({
  builder: 'vite',
  compatibilityDate: '2024-04-03',
  css: ['@/assets/css/main.css'],
  devtools: {
    enabled: true,
  },
  future: {
    compatibilityVersion: 5,
  },
  imports: {
    dirs: IMPORT_DIRECTORIES,
  },
  modules: ['@nuxt/eslint', '@vite-pwa/nuxt', 'nuxt-swiper'],
  nitro: {
    imports: {
      dirs: IMPORT_DIRECTORIES,
    },
  },
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
      ...ENVIRONMENT_VARIABLES,
    },
  },
  typescript: {
    strict: true,
    tsConfig: {
      compilerOptions: {
        noUncheckedIndexedAccess: false,
      },
    },
    typeCheck: 'build',
  },
  ...createPWAConfig(ENVIRONMENT_VARIABLES.MAIN_APP_TITLE),
});
