import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:3000',
//         changeOrigin: true,
//       },
//     }
//   }
// })

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Set the port for the frontend server
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend server URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Remove the '/api' prefix before proxying
      }
    }
  }
});