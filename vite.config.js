import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 用相对路径，这样部署到 GitHub Pages 的子目录也能正常工作
  base: './',
})
