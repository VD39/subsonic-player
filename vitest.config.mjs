import { defineVitestConfig } from '@nuxt/test-utils/config';
import { configDefaults, coverageConfigDefaults } from 'vitest/config';

export default defineVitestConfig({
  test: {
    coverage: {
      enabled: true,
      exclude: [
        ...coverageConfigDefaults.exclude,
        '**/navigations/**',
        '**/plugins/**',
        '**/previews/**',
        '**/stories/**',
        'app.vue',
        'components/Molecules/CarouselSwiper.vue',
        'composables/useAudioPlayer/player.ts',
        'error.vue',
        'nuxt.config.ts',
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
    exclude: [...configDefaults.exclude, '**/previews/**'],
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
