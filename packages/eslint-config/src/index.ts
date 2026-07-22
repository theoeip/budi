// @budi/eslint-config — Shared ESLint configuration preset
// This file provides a base ESLint flat config for all BUDI packages.

import type { Linter } from 'eslint';

const budiConfig: Linter.Config[] = [
  {
    ignores: ['dist/**', '.turbo/**', 'node_modules/**'],
  },
  {
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
    },
  },
];

export default budiConfig;

