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
  BITRATE: Number(process.env.BITRATE || 0),
  CROSSFADE_DURATION: Number(process.env.CROSSFADE_DURATION || 3),
  CROSSFADE_ENABLED: process.env.CROSSFADE_ENABLED === 'true',
  DELETE_PODCAST_ON_END: process.env.DELETE_PODCAST_ON_END === 'true',
  ENABLE_QUEUE_SYNC: process.env.ENABLE_QUEUE_SYNC === 'true',
  IMAGE_SIZE: process.env.IMAGE_SIZE || '500',
  LAYOUT: process.env.LAYOUT || 'gridLayout',
  LOAD_SIZE: process.env.LOAD_SIZE || '50',
  MAIN_APP_TITLE: process.env.MAIN_APP_TITLE || 'Music App',
  REPLAY_GAIN_MODE: process.env.REPLAY_GAIN_MODE || 'off',
  SCROBBLE_ENABLED: process.env.SCROBBLE_ENABLED !== 'false',
  SERVER_URL: process.env.SERVER_URL || '',
  SHOW_PODCASTS: process.env.SHOW_PODCASTS !== 'false',
  SHOW_RADIO_STATIONS: process.env.SHOW_RADIO_STATIONS !== 'false',
  SPA_MODE: process.env.SPA_MODE === 'true',
  THEME: process.env.THEME || 'auto',
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
