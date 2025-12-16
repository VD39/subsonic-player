import type { Asset } from '@vite-pwa/assets-generator/config';

import { resolve } from 'node:path';
import { defineNuxtConfig } from 'nuxt/config';

const PWA_ASSETS_SETTINGS = {
  defaultPreset: {
    padding: 0.1,
    resizeOptions: {
      background: '#6313bc',
      fit: 'contain',
    },
  } as Partial<Asset>,
  sizes: [64, 144, 192, 512],
};

const IMPORT_DIRECTORIES = [
  'components/**',
  'composables/**',
  'navigations/**',
  'settings/**',
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
  pwa: {
    devOptions: {
      enabled: false,
      type: 'module',
    },
    includeAssets: ['*.svg', '*.png'],
    injectRegister: 'inline',
    manifest: {
      background_color: '#6316bc',
      categories: ['music', 'podcast', 'radio stations'],
      description:
        'A responsive, modern web-based client designed for Subsonic music servers.',
      display: 'standalone',
      display_override: ['window-controls-overlay'],
      id: 'subsonic-player',
      lang: 'en',
      name: ENVIRONMENT_VARIABLES.MAIN_APP_TITLE,
      orientation: 'any',
      prefer_related_applications: false,
      related_applications: [],
      scope: '/',
      short_name: ENVIRONMENT_VARIABLES.MAIN_APP_TITLE,
      start_url: '/',
      theme_color: '#6313bc',
    },
    pwaAssets: {
      disabled: false,
      includeHtmlHeadLinks: true,
      overrideManifestIcons: true,
      preset: {
        apple: {
          ...PWA_ASSETS_SETTINGS.defaultPreset,
          sizes: [180],
        },
        maskable: {
          ...PWA_ASSETS_SETTINGS.defaultPreset,
          sizes: PWA_ASSETS_SETTINGS.sizes,
        },
        transparent: {
          favicons: [[256, 'favicon.ico']],
          sizes: PWA_ASSETS_SETTINGS.sizes,
        },
      },
    },
    registerWebManifestInRouteRules: true,
    scope: '/',
    selfDestroying: true,
    workbox: {
      globPatterns: ['**/*.{js,css,html,vue,png,svg,ico}'],
      navigateFallback: '/',
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
});
