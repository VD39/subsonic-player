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
        '**/services/**',
        './components/Loaders',
        ...coverageConfigDefaults.exclude,
      ],
      include: ['**/*.ts', '**/*.vue'],
      provider: 'istanbul',
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
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
