import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

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
      Components({ resolvers: [VantResolver()] }),
      ElementPlus({
        useSource: true,
      }),
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
