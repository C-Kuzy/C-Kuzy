import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Base public path
  base: './',
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    
    // Enable minification
    minify: 'terser',
    
    // Terser options for aggressive minification & security
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true, // Remove debugger statements
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2, // Multiple passes for better compression
      },
      mangle: {
        toplevel: true, // Mangle top-level variable names
        keep_classnames: false,
        keep_fnames: false,
      },
      format: {
        comments: false, // Strip all comments
      },
    },
    
    // No sourcemaps in production for security
    sourcemap: false,
    
    // Rollup configuration with entry point and output options
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'CKGHub.html')
      },
      output: {
        // Content-based hashing for cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        
        // Manual chunk splitting for better caching
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
      plugins: [
        {
          name: 'rename-index',
          generateBundle(options, bundle) {
            // Rename CKGHub.html to index.html for Vercel
            const indexHtml = bundle['CKGHub.html'];
            if (indexHtml) {
              indexHtml.fileName = 'index.html';
            }
          }
        }
      ]
    },
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Asset inline threshold (smaller assets will be inlined as base64)
    assetsInlineLimit: 4096,
    
    // Clear output directory before building
    emptyOutDir: true,
  },
  
  // Server configuration for local development
  server: {
    port: 3000,
    open: true,
  },
  
  // Preview configuration
  preview: {
    port: 8080,
  },
});
