import { includeIgnoreFile } from '@eslint/compat';
import perfectionist from 'eslint-plugin-perfectionist';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import vitest from 'eslint-plugin-vitest';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import withNuxt from './.nuxt/eslint.config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const gitignorePath = resolve(__dirname, '.gitignore');

export default withNuxt(
  includeIgnoreFile(gitignorePath),
  eslintPluginPrettierRecommended,
  perfectionist.configs['recommended-alphabetical'],
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      'dot-notation': 'error',
      'no-undef': 'error',
      'no-unused-vars': 'off',
      'object-shorthand': ['error', 'always'],
      'prefer-const': 'error',
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/no-multiple-template-root': 'off',
    },
  },
  {
    files: ['vitest.setup.ts', '**/*.spec.ts'],
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
  },
);
