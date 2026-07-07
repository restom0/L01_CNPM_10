import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

// Flat config (eslint 10 dropped .eslintrc). eslint-plugin-react 7.37 crashes on
// eslint 10 (removed version-detection API), so it's omitted; core JS rules plus
// the hooks/refresh plugins cover the important checks. Legacy baseline kept:
// unused-vars as warnings (PascalCase/React ignored since core eslint can't see
// JSX usage), no-undef stays an error — it caught the missing useNavigate() in
// components/chart.
export default [
  { ignores: ['dist', 'coverage'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }]
    }
  },
  {
    files: ['**/*.test.{js,jsx}', 'src/setupTests.js'],
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
  },
  {
    files: ['**/*.config.js'],
    languageOptions: { globals: { ...globals.node } }
  }
]
