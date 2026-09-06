import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Capacitor ships a modern WebView and the PWA targets evergreen browsers.
    target: 'es2022',
    // The app runs offline from cached assets; sourcemaps would ship ~1MB for nothing.
    sourcemap: false,
    rollupOptions: {
      output: {
        // React changes far less often than app code, so give it a stable chunk
        // that survives cache across releases.
        manualChunks(id: string) {
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) {
            return 'react';
          }
        },
      },
    },
  },
})
