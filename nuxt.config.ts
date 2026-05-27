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
  APP_GITHUB_URL: 'https://github.com/VD39/subsonic-player',
  APP_RELEASE_DATE: process.env.APP_RELEASE_DATE || '',
  APP_VERSION: process.env.APP_VERSION || 'dev',
  ENABLE_QUEUE_SYNC: process.env.ENABLE_QUEUE_SYNC === 'true',
  IMAGE_SIZE: process.env.IMAGE_SIZE || '500',
  LOAD_SIZE: process.env.LOAD_SIZE || '50',
  MAIN_APP_TITLE: process.env.MAIN_APP_TITLE || 'Music App',
  SERVER_URL: process.env.SERVER_URL || '',
  SPA_MODE: process.env.SPA_MODE === 'true',
};

export default defineNuxtConfig({
  builder: 'vite',
  compatibilityDate: '2024-04-03',
  css: ['@/assets/css/main.css'],
  devtools: {
    enabled: false,
  },
  future: {
    compatibilityVersion: 5,
  },
  ignore: ['coverage/**', 'docs/**', '**/*.spec.ts'],
  imports: {
    dirs: IMPORT_DIRECTORIES,
  },
  modules: ['@nuxt/eslint', '@vite-pwa/nuxt', 'nuxt-swiper'],
  nitro: {
    imports: {
      dirs: IMPORT_DIRECTORIES,
    },
    ...(ENVIRONMENT_VARIABLES.SPA_MODE && {
      prerender: {
        routes: ['/'],
      },
    }),
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
  ssr: !ENVIRONMENT_VARIABLES.SPA_MODE,
  typescript: {
    strict: true,
    tsConfig: {
      compilerOptions: {
        noUncheckedIndexedAccess: false,
      },
    },
    typeCheck: 'build',
  },
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        '@phosphor-icons/vue',
        'crypto-js/md5',
      ],
    },
  },
  ...createPWAConfig(
    ENVIRONMENT_VARIABLES.MAIN_APP_TITLE,
    ENVIRONMENT_VARIABLES.SPA_MODE,
  ),
});
