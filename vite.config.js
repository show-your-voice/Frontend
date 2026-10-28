import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    // 브라우저가 보내는 Origin 헤더는 프록시를 거쳐도 그대로 전달된다.
    // 백엔드 CORS가 허용하는 localhost:3000에서 띄운다.
    port: 3000,
    strictPort: true,
    // 개발 서버의 /api 요청을 백엔드로 넘긴다. 같은 출처라서 세션 쿠키가 그대로 오간다.
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
