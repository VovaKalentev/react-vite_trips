import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {  
        proxy: {  
            '/api': {  
                target: 'https://script.google.com/macros/s/AKfycbyhFvwnAyfBXCB3HbvObZcrywLlia-KsA_BYbdntIQX2GzjWTHydFR9kTm60XiqHEQ/exec',  
                changeOrigin: true,  
                rewrite: path => path.replace(/^\/api/, '')  
            }  
        }  
    }  
})
