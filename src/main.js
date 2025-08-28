import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import 'lib-flexible/flexible'

import './assets/main.scss'
import './assets/iconfont/iconfont.css';
import './assets/iconfont/iconfont.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 全局过滤器
app.config.globalProperties.$filters = {
  prefix(url) {
    if (url && url.startsWith('http')) {
      return url
    } else {
      // 使用环境变量作为图片资源前缀，适配 eap-mall 后端
      const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:48080'
      url = `${baseUrl}${url}`
      return url
    }
  }
}

app.mount('#app')
