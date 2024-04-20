import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig( {
  preview: {
    port: 3000,
    strictPort: true,
  },
  server: {
    watch: {
      usePolling: true,
    },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    port: 3000, // you can replace this port with any port
  },
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': path.resolve( __dirname, './src' ),
      '@assets': path.resolve( __dirname, './src/assets' ),
      '@router': path.resolve( __dirname, './src/router' ),
      '@schemas': path.resolve( __dirname, './src/schemas' ),
      '@api': path.resolve( __dirname, './src/api' ),
      '@services': path.resolve( __dirname, './src/api/services' ),
      '@pages': path.resolve( __dirname, './src/pages' ),
      '@utils': path.resolve( __dirname, './src/utils' ),
      '@store': path.resolve( __dirname, './src/store' ),
      '@components': path.resolve( __dirname, './src/components' ),
      '@header': path.resolve( __dirname, './src/components/header' ),
      '@modals': path.resolve( __dirname, './src/components/modals' )
    }
  },
  plugins: [ react() ]
} )
