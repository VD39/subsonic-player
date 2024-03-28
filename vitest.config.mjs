import { coverageConfigDefaults } from 'vitest/config';
import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    coverage: {
      enabled: true,
      exclude: [
        'app.vue',
        'error.vue',
        '**/config/**',
        '**/plugins/**',
        '**/services/**',
        './components/Loaders',
        ...coverageConfigDefaults.exclude,
      ],
      include: ['**/*.ts', '**/*.vue'],
      provider: 'istanbul',
      thresholds: {
        branches: 85,
        functions: 85,
        lines: 85,
      },
    },
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    environment: 'nuxt',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
