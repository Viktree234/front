import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default {
  server: {
    proxy: {
      '/start-session': 'http://localhost:3000',
      '/session': 'http://localhost:3000',
    }
  }
}
