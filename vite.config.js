import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'legacy'
      }
    }
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        // 代理到后端根路径，让后端的全局前缀 'api' 生效
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path // 保持 /api 前缀不变
      }
    }
  }
})
