import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    global: 'globalThis', // Ensure global context is available
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
    },
  },
  build: {
    rollupOptions: {
      external: ['crypto', 'stream'], // Externalize these modules
      plugins: [
        {
          name: 'node-polyfills',
          resolveId(source) {
            if (source === 'crypto') {
              return require.resolve('crypto-browserify')
            }
            if (source === 'stream') {
              return require.resolve('stream-browserify')
            }
            return null
          },
        },
      ],
    },
  },
})
