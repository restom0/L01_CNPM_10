import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.js', 'test/**/*.test.js'],
    // mongodb-memory-server downloads a binary on first run; give it room.
    testTimeout: 20000,
    hookTimeout: 60000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.js'],
      exclude: ['src/**/*.test.js']
    }
  }
})
