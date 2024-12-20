import type { StorybookConfig } from '@storybook-vue/nuxt';

import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: {
    name: '@storybook-vue/nuxt',
    options: {},
  },
  stories: ['../stories/**/*.stories.ts'],

  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          vue: 'vue/dist/vue.esm-bundler',
        },
      },
    });
  },
};
export default config;
