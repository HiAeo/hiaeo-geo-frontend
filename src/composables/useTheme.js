/**
 * 主题管理 Hook
 * 提供全局主题状态管理和切换功能
 */
import { ref, watch, onMounted } from 'vue'

// 全局主题状态
export const theme = ref('dark')

// 初始化主题 - 每次调用都同步 localStorage
export const initTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    theme.value = savedTheme
  } else {
    // 检查系统偏好
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      theme.value = 'light'
    }
  }
  
  // 应用到 document
  document.documentElement.setAttribute('data-theme', theme.value)

  return theme.value
}

// 切换主题
export const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', theme.value)
  document.documentElement.setAttribute('data-theme', theme.value)
}

// 监听其他标签页的主题变化
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme' && e.newValue) {
      theme.value = e.newValue
      document.documentElement.setAttribute('data-theme', e.newValue)
    }
  })
}

// 设置特定主题
export const setTheme = (newTheme) => {
  theme.value = newTheme
  localStorage.setItem('theme', newTheme)
  document.documentElement.setAttribute('data-theme', newTheme)
}

// 获取当前主题
export const getTheme = () => theme.value

// 组合式函数
export const useTheme = () => {
  onMounted(() => {
    initTheme()
  })
  
  watch(theme, (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme)
  })
  
  return {
    theme,
    toggleTheme,
    setTheme,
    getTheme,
    isDark: () => theme.value === 'dark',
    isLight: () => theme.value === 'light'
  }
}

export default useTheme
