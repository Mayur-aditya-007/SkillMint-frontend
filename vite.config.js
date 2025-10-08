// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    target: 'es2018', // modern browsers
    sourcemap: false, // don't generate source maps for prod
    minify: 'terser', // minify JS
    terserOptions: {
      compress: {
        drop_console: true, // remove console.log in production
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 1200, // increase warning threshold (KB)
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // split react/react-dom to separate chunk
            if (id.includes('react')) return 'vendor.react';
            // split UI libs (lucide, framer-motion etc.)
            if (id.includes('lucide-react') || id.includes('framer-motion')) return 'vendor.ui';
            return 'vendor';
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      // pre-bundle dependencies that are often imported
      'react',
      'react-dom',
      'react-router-dom',
    ],
  },
  server: {
    port: 5173,
    open: true, // auto open browser on start
  },
});
