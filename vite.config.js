import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Tự nhận biết: build (lên Github Pages) thì dùng /trungdoan4.online/, chạy dev (local) thì dùng /
  base: command === 'build' ? '/trungdoan4.online/' : '/'
}))
