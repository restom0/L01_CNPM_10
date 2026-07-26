/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Separate from vite.config.js so the production build stays untouched.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/services/**/*.js', 'src/utils/**/*.js'],
      exclude: ['src/**/*.test.{js,jsx}', 'src/setupTests.js'],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100
      }
    }
  }
})
