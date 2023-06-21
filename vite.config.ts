import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { VuetifyResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import path from 'path'

process.env.VITE_APP_VERSION = JSON.stringify(
  process.env.npm_package_version
).replaceAll('"', '')

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 8080,
  },
  plugins: [vue(), Components({ resolvers: [VuetifyResolver()] })],
})
