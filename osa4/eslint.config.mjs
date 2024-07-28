import globals from 'globals'
import stylisticJs from '@stylistic/eslint-plugin-js'
import eslintJs from '@eslint/js'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
  eslintJs.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@stylistic/js': stylisticJs,
      prettier: prettierPlugin,
    },
    ignores: ['**/dist/**/*.js'],
    rules: {
      'prettier/prettier': 'error',
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 0,
      'no-empty': 'error',
      'no-extra-semi': 'error',
      'no-undef': 'error',
      'no-unexpected-multiline': 'error',
      'no-unreachable': 'error',
      'newline-per-chained-call': ['error', { ignoreChainWithDepth: 3 }],
    },
  },
  {
    files: ['.eslintrc.{js,cjs}'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        ...globals.node,
      },
    },
  },
]
