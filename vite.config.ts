import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import wasm from "vite-plugin-wasm";
// import topLevelAwait from "vite-plugin-top-level-await";

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
  plugins: [
    react(),
    wasm()
  ],

  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    },
    port: 5173, // Set the port for the frontend server
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend server URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Remove the '/api' prefix before proxying
      }
    }
  },
  ssr: {
    noExternal: ['@jlongster'],
  },
  // optimizeDeps:{
  //   exclude: ['@jlongster/sql-js'],
  // },
  //optimizeDeps.exclude: ['@jlongster'],


  // resolve: {    
  //   extensions: ['.js', '.jsx', '.ts','.tsx', '.worker.js'] // Add any other extensions you want Vite to treat as modules  }
  // }
});