import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Vite dev server must use a specific port that matches the Tauri devUrl
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // Tauri expects the Vite server to stay alive
      ignored: ['**/src-tauri/**'],
    },
  },

  // Prevent vite from obscuring Rust errors
  clearScreen: false,

  // Env variables starting with VITE_ are exposed
  envPrefix: ['VITE_', 'TAURI_'],

  build: {
    // Tauri supports es2021
    target: command === 'serve' ? 'esnext' : ['es2021', 'chrome100', 'safari13'],
    // Don't minify for debug builds
    minify: !process.env['TAURI_DEBUG'] ? 'esbuild' : false,
    // Produce sourcemaps for debug builds
    sourcemap: !!process.env['TAURI_DEBUG'],
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          recharts: ['recharts'],
        },
      },
    },
  },
}))
