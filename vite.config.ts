import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          vendor: ['react', 'react-dom'],
          // React Router
          router: ['react-router-dom'],
          // UI library
          ui: [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-dropdown-menu', 
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip'
          ],
          // Charts and visualization
          charts: ['chart.js', 'recharts', 'react-chartjs-2'],
          // Maps
          maps: ['leaflet', 'mapbox-gl', 'react-leaflet'],
          // Animations
          animations: ['framer-motion', 'gsap', 'animejs'],
          // Forms and validation
          forms: ['react-hook-form', 'zod', '@hookform/resolvers'],
          // Data fetching
          query: ['@tanstack/react-query'],
          // Utilities
          utils: ['date-fns', 'clsx', 'tailwind-merge', 'class-variance-authority']
        },
        // Optimize chunk names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId;
          if (facadeModuleId) {
            const fileName = facadeModuleId.split('/').pop() || 'chunk';
            return `chunks/${fileName.replace('.tsx', '').replace('.ts', '')}-[hash].js`;
          }
          return 'chunks/[name]-[hash].js';
        },
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },
  define: {
    __DEV__: mode === 'development'
  }
}));
