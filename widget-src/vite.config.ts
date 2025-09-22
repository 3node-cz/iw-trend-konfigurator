import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'ConfiguratorWidget',
      fileName: 'configurator-widget',
      formats: ['umd']
    },
    rollupOptions: {
      output: {
        format: 'umd',
        name: 'ConfiguratorWidget'
      }
    },
    outDir: '../extensions/configurator-widget/assets',
    emptyOutDir: false
  },
  define: {
    'process.env.NODE_ENV': '"development"'
  },
  mode: 'development'
})