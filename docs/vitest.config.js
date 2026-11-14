import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

/**
 * Component specs import .vue files, so they need vitest's Vue transform and
 * live in tests/*.spec.js. The pure release-feed tests live in
 * tests/*.test.js and use node:test instead, so they also run under plain
 * `node --test`. `npm test` runs both runners.
 */
export default defineConfig({
  plugins: [vue()],
  // Vite resolves the default "localhost" server host through DNS, which fails
  // in sandboxes whose hosts file has no loopback entry. A literal address
  // keeps the test runner independent of that lookup.
  server: { host: '127.0.0.1' },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.spec.js'],
  },
})
