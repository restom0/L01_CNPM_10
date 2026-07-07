import js from '@eslint/js'
import globals from 'globals'

// Flat config (eslint 10 dropped .eslintrc support). Replaces the old
// eslint-config-standard setup, which only supported eslint 8.
export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node }
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  },
  {
    // Vitest injects these globals (globals: true in vitest.config.js).
    files: ['**/*.test.js', 'test/**/*.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        vi: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly'
      }
    }
  }
]
