import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

 
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),         // soporte para React (JSX, recarga en caliente)
    
  ],
  server: {
    port: 5173,          // puerto de la app
    strictPort: true,    // si el puerto está ocupado, avisa en vez de cambiarlo solo
    proxy: {
      // Todo lo que React pida a /api/... Vite lo reenvía a json-server
      '/api': {
        // 127.0.0.1 y no "localhost": en Windows "localhost" a veces apunta a IPv6 (::1)
        // y json-server escucha en IPv4, entonces no se encuentran (error ECONNREFUSED)
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        // json-server no conoce el prefijo /api: /api/pokemon -> /pokemon
        rewrite: (ruta) => ruta.replace(/^\/api/, ''),
      },
    },
  },
});
