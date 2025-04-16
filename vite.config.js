import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  // Optimization settings for dependencies
  optimizeDeps: {
    exclude: ['pdfjs-dist']
  },
  
  // Resolve path aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Build settings
  build: {
    minify: 'esbuild',  // Enable CSS and JS minification
    cssCodeSplit: true,  // Ensure that CSS is split into separate files
    sourcemap: false,  // Optionally, disable source maps in production
    target: 'esnext',  // Ensure compatibility with modern browsers
  },
});
