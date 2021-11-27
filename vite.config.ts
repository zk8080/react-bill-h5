import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import styleImport from 'vite-plugin-style-import';

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
  })]
})
