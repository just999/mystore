import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const eslintConfig = [
  ...compat.config({
    plugins: ['jsx-a11y', 'react', 'jsonc'],
    extends: [
      'prettier',
      'next/core-web-vitals',
      'next/typescript',
      'plugin:jsonc/recommended-with-jsonc',
    ],
    env: {
      es2020: true,
      node: true,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
    overrides: [
      {
        files: ['**/settings.json', '*.json', '*.jsonc'],
        rules: {
          '@cspell/spellchecker': ['off'],
          'jsonc/no-comments': 'off',
          'comma-dangle': ['error', 'never'],
        },
      },
    ],
  }),
];

export default eslintConfig;
