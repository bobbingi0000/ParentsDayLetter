import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: false, // 프로덕션 빌드 시 소스맵 생성 안 함 (F12에서 소스코드 숨김)
  }
})
