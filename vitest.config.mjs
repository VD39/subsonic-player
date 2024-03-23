import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    globals: true,
    environment: 'nuxt',
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    coverage: {
      enabled: false,
      provider: 'istanbul',
      include: ['**/*.ts', '**/*.vue'],
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
      },
    },
  },
});
