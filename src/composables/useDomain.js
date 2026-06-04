import { ref, computed } from 'vue'

/**
 * 域名检测工具
 * - geobuddy.net / localhost (dev) → xiaozhi 模式（360智见小智机器人）
 * - modelbuddy.net / www.modelbuddy.net → modelbuddy 模式（魔鲸GEO）
 */

const DOMAIN_CONFIG = {
  xiaozhi: {
    hostnames: ['geobuddy.net', 'www.geobuddy.net'],
    // 开发环境下默认也显示 xiaozhi（需要模拟 geobuddy 效果时）
    devHosts: ['localhost', '127.0.0.1']
  },
  modelbuddy: {
    hostnames: ['modelbuddy.net', 'www.modelbuddy.net']
  }
}

const currentHostname = ref(
  typeof window !== 'undefined' ? window.location.hostname : ''
)

const domain = computed(() => {
  const host = currentHostname.value.toLowerCase()

  // 判断是否为 xiaozhi 域名
  if (DOMAIN_CONFIG.xiaozhi.hostnames.includes(host)) {
    return 'xiaozhi'
  }

  if (DOMAIN_CONFIG.modelbuddy.hostnames.includes(host)) {
    return 'modelbuddy'
  }

  // 开发环境：可以通过 URL 参数 ?mode=xiaozhi 或 ?mode=modelbuddy 手动切换
  if (DOMAIN_CONFIG.xiaozhi.devHosts.includes(host)) {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const mode = params.get('mode')
      if (mode === 'modelbuddy') return 'modelbuddy'
      if (mode === 'xiaozhi') return 'xiaozhi'
      // 默认开发环境下显示 modelbuddy 内容
      return 'modelbuddy'
    }
  }

  // 未知域名默认走 modelbuddy
  return 'modelbuddy'
})

const isXiaoZhi = computed(() => domain.value === 'xiaozhi')
const isModelbuddy = computed(() => domain.value === 'modelbuddy')

/**
 * 更新 hostname（SPA 内通常不需要，但供测试用）
 */
function updateHostname() {
  if (typeof window !== 'undefined') {
    currentHostname.value = window.location.hostname
  }
}

export function useDomain() {
  return {
    domain,
    isXiaoZhi,
    isModelbuddy,
    currentHostname,
    updateHostname,
    xiaozhiHosts: DOMAIN_CONFIG.xiaozhi.hostnames,
    modelbuddyHosts: DOMAIN_CONFIG.modelbuddy.hostnames
  }
}
