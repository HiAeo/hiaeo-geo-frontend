import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './index.css'
import i18n from './i18n'

// 根据域名设置页面标题
const hostname = window.location.hostname.toLowerCase()
const isXiaoZhi = hostname === 'geobuddy.net' || hostname === 'www.geobuddy.net'

if (isXiaoZhi) {
  document.title = '小智 · 360智见AI智能助手'
} else {
  // 保持原 modelbuddy 标题
  document.title = 'ModelBuddy 魔鲸GEO Claw - 让GEO像呼吸一样简单'
}

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(router)
app.use(i18n)
app.mount('#app')
