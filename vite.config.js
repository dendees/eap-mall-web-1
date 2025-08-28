import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default async function() {
  // 动态导入unplugin-element-plus
  const { default: ElementPlus } = await import('unplugin-element-plus/vite');

  return defineConfig({
    server: {
      port: 8080,
      historyApiFallback: true
    },
    plugins: [
      vue(),
      ElementPlus({
    useSource: true,
  }),
  viteMockServe({
    mockPath: './mock',
    localEnabled: true,
  })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/variables.scss" as *;`
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  });
}
