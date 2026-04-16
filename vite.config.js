import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Đặt base trùng với tên repository của bạn trên GitHub
  base: '/trungdoan4.online/'
})
