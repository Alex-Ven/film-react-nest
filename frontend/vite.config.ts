import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: ['src/scss']
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // ваш бэкенд-сервер
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/afisha'), // учитываем глобальный префикс
        secure: false
      },
      '/content': { // если вам нужно проксировать статические файлы
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})