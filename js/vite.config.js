import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// ⚠️  'base'를 본인의 GitHub 레포지토리 이름으로 변경하세요.
//     예: 레포 이름이 'stock-manager'라면 '/stock-manager/'
export default defineConfig({
  plugins: [react()],
  base: '/stock-manager/',
})
