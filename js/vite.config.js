import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ✅ 반드시 GitHub Pages 저장소 이름과 일치해야 합니다
  base: '/LNG_INVESTMENT/',
})
