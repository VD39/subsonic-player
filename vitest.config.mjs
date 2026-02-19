import { defineVitestConfig } from '@nuxt/test-utils/config';
import { configDefaults, coverageConfigDefaults } from 'vitest/config';

export default defineVitestConfig({
  test: {
    coverage: {
      enabled: true,
      exclude: [
        '.nuxt/**',
        '**/config/**',
        '**/constants/**',
        '**/docs/**',
        '**/navigations/**',
        '**/plugins/**',
        '**/test/**',
        'app.vue',
        'components/Molecules/CarouselSwiper.vue',
        'composables/useAudioPlayer/player.ts',
        'error.vue',
        'nuxt.config.ts',
        ...coverageConfigDefaults.exclude,
      ],
      provider: 'istanbul',
      thresholds: {
        branches: 85,
        functions: 85,
        lines: 85,
        statements: 85,
      },
    },
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    environment: 'nuxt',
    exclude: [...configDefaults.exclude, '**/docs/**', '.nuxt/**'],
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
