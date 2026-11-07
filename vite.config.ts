import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    plugins: [react()],
    esbuild: {
      drop: isProd ? ['console', 'debugger'] : [],
    },
    server: {
      port: 5174,
      host: true,
      open: true
    }
  };
});
