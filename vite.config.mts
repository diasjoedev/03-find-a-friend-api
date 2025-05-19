import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    coverage: { all: false },
    environmentMatchGlobs: [['src/http/controllers/**', 'prisma']],
    dir: 'src',
  },
})
