import { defineVitestConfig } from '@nuxt/test-utils/config';
import { coverageConfigDefaults } from 'vitest/config';

export default defineVitestConfig({
  test: {
    coverage: {
      enabled: true,
      exclude: [
        'app.vue',
        'error.vue',
        '**/config/**',
        '**/plugins/**',
        'navigations',
        'pages',
        'components/Molecules/CarouselSwiper.vue',
        'composables/useAudioPlayer/player.ts',
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
