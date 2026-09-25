import { defineConfig } from 'vitest/config'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import tsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    modulePreload: false,
    rollupOptions: {
      output: {
        // Keep cubing's worker modules independent of the renderer entry point.
        manualChunks(id) {
          const modulePath = id.split('/node_modules/cubing/')[1]
          if (modulePath) return `cubing/${modulePath.replace(/\.js$/, '')}`
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    tsConfigPaths(),
    electron({
      main: {
        entry: 'electron/main.ts',
        vite: {
          build: {
            rollupOptions: {
              external: ['better-sqlite3'],
            },
          },
        },
      },
      preload: {
        input: path.join(__dirname, 'electron/preload.ts'),
      },
      renderer: process.env.NODE_ENV === 'test' ? undefined : {},
    }),
  ],
  optimizeDeps: {
    exclude: ['cubing', 'better-sqlite3'],
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
})
