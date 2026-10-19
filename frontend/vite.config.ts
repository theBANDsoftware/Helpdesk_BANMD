import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Anrop till /api skickas vidare till Spring Boot. Då behövs ingen CORS-inställning
    // i backend medan vi utvecklar.
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
});
