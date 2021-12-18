import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import styleImport from 'vite-plugin-style-import';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), styleImport({
    libs: [
      // 如果没有你需要的resolve，可以在lib内直接写，也可以给我们提供PR
      {
        libraryName: 'zarm',
        esModule: true,
        resolveStyle: (name) => {
          return `zarm/es/${name}/style/css`
        },
      },
    ],
  })],
  css: {
    modules: {
      localsConvention: 'dashesOnly'
    },
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        // 当遇到 /api 路径时，将其转换成 target 的值
        target: 'http://api.chennick.wang/api/',
        // target: 'http://127.0.0.1:7001/api',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '') // 将 /api 重写为空
      },
      '/public': {
        // 当遇到 /api 路径时，将其转换成 target 的值
        target: 'http://api.chennick.wang/public/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/public/, '') // 将 /api 重写为空
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // src 路径
      'utils': path.resolve(__dirname, 'src/utils') // src 路径
    }
  },
})
