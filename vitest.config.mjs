import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    globals: true,
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        mock: {
          intersectionObserver: true,
        },
        // domEnvironment: 'jsdom',
      },
    },
    // setupFiles: [path.resolve(__dirname, '/tests/vitest-setup.ts')],
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
  },
});
