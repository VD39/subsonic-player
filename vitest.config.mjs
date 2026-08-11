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
        '**/test/**',
        'components/Molecules/CarouselSwiper.vue',
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
    environmentOptions: {
      nuxt: {
        rootDir: import.meta.dirname,
      },
    },
    exclude: [...configDefaults.exclude, '**/docs/**', '.nuxt/**'],
    globals: true,
    hookTimeout: 60000,
    setupFiles: ['./vitest.setup.ts'],
    testTimeout: 20000,
  },
});
