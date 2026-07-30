import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'pages/about.html'),
        vehicles: resolve(__dirname, 'pages/vehicles.html'),
        contact: resolve(__dirname, 'pages/contact.html'),
        privacy: resolve(__dirname, 'pages/privacy.html'),
        cookies: resolve(__dirname, 'pages/cookies.html'),
        error404: resolve(__dirname, 'pages/404.html'),
        vehicleDetail: resolve(__dirname, 'pages/vehicle-detail.html'),
        adminLogin: resolve(__dirname, 'admin/login.html'),
        admin: resolve(__dirname, 'admin/index.html'),
      }
    },
    outDir: 'dist',
  },
  server: {
    host: true,
    port: 5500,
    strictPort: true,
    open: true,
  },
})
