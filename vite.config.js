import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules[\\/](react|react-dom)[\\/]/,
              priority: 2,
            },
            {
              name: 'charts-vendor',
              test: /node_modules[\\/](recharts|victory-vendor|d3-[^\\/]+)[\\/]/,
              priority: 1,
            },
          ],
        },
      },
    },
  },
})
