import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr({
    svgrOptions: {
      plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
      svgoConfig: {
        floatPrecision: 2,
      },
    },
  })],
  // base: './'
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  }
})
