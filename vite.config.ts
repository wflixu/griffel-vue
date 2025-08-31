import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vuejsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  root: './playground',
  plugins: [vue(), vuejsx()],
})
