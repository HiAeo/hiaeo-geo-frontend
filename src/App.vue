<template>
  <div class="min-h-screen overflow-x-hidden pb-16 md:pb-0" :data-theme="theme">
    
    <!-- 官网首页 -->
    <div v-if="currentPage === 'home'">
      <!-- NavBar -->
      <NavBar :theme="theme" @toggle-theme="toggleTheme" @open-login="showLogin = true" @open-contact="showContact = true" @go-admin="goToAdmin" />

      <!-- 板块1: Hero -->
      <HeroSection @open-contact="showContact = true" />

      <!-- 板块2: 产品价值概览 (Bento Grid) -->
      <BentoGridSection />

      <!-- 板块3: 模镜 MiraSeek -->
      <MiraSeekSection />

      <!-- 板块4: 模豆 MiraMod -->
      <MiraModSection />

      <!-- 板块5: 模法 MiraMag -->
      <MiraMagSection />

      <!-- 板块6: 魔鲸Hub -->
      <HubSection />

      <!-- 板块7: 客户成长路径与案例 -->
      <GrowthSection />

      <!-- 板块8: 详细案例展示 -->
      <CasesDetailSection @open-contact="showContact = true" />

      <!-- 板块9: 定价 -->
      <PricingSection />

      <!-- 板块10: FAQ -->
      <FAQSection />

      <!-- Footer -->
      <FooterSection :theme="theme" />

      <!-- Mobile Bottom Nav -->
      <BottomNav />
    </div>

    <!-- 产品后台页面 -->
    <div v-else>
      <AdminLayout :theme="theme" @back="goToHome" @toggle-theme="toggleTheme" @logout="handleLogout" />
    </div>

    <!-- Login Modal -->
    <LoginModal 
      :show="showLogin" 
      :theme="theme"
      @close="showLogin = false"
      @login="handleLogin"
      @signup="handleSignup"
    />

    <!-- Contact Modal -->
    <ContactModal 
      :show="showContact"
      @close="showContact = false"
      @submit="handleContact"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useApi } from './composables/useApi'

// 组件导入
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import BentoGridSection from './components/BentoGridSection.vue'
import MiraSeekSection from './components/MiraSeekSection.vue'
import MiraModSection from './components/MiraModSection.vue'
import MiraMagSection from './components/MiraMagSection.vue'
import HubSection from './components/HubSection.vue'
import GrowthSection from './components/GrowthSection.vue'
import CasesDetailSection from './components/CasesDetailSection.vue'
import PricingSection from './components/PricingSection.vue'
import FAQSection from './components/FAQSection.vue'
import FooterSection from './components/FooterSection.vue'
import BottomNav from './components/BottomNav.vue'
import LoginModal from './components/LoginModal.vue'
import ContactModal from './components/ContactModal.vue'
import AdminLayout from './components/AdminLayout.vue'

const { loginWithPassword, loginWithSms, register, submitContactForm, logout } = useApi()

// 响应式用户状态
const user = ref(null)

const theme = ref('dark')
const showLogin = ref(false)
const showContact = ref(false)
const currentPage = ref('home') // 当前页面：home 或 admin

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', theme.value)
}

// 跳转到产品后台
const goToAdmin = () => {
  currentPage.value = 'admin'
}

// 跳转到首页
const goToHome = () => {
  currentPage.value = 'home'
}

// 处理登录
const handleLogin = async (data) => {
  console.log('[App] 收到登录事件, data:', data)
  try {
    let result
    
    // 根据数据类型判断登录方式
    if (data.isSms) {
      // 短信登录（模拟）
      result = data
    } else if (data.accessToken || data.token) {
      // 真实 API 响应（兼容 token 和 accessToken）
      result = data
    } else {
      // 调用登录 API
      result = await loginWithPassword(data)
    }
    
    // 确保 user 字段存在
    const userData = result.user || data.user || {
      email: data.email || 'unknown',
      nickname: data.nickname || 'User'
    }
    
    // 保存用户信息
    user.value = userData
    localStorage.setItem('user_info', JSON.stringify(userData))
    
    console.log('[App] 登录成功，准备跳转:', userData)
    
    // 登录成功后跳转到产品后台
    showLogin.value = false  // 先关闭弹窗
    await nextTick()  // 等待 DOM 更新
    
    console.log('[App] showLogin 已设为 false, currentPage:', currentPage.value)
    currentPage.value = 'admin'
    await nextTick()  // 等待页面切换
    console.log('[App] 跳转完成, currentPage:', currentPage.value)
  } catch (error) {
    console.error('[App] 登录失败:', error)
    alert('登录失败: ' + error.message)
  }
}

// 处理注册
const handleSignup = async (data) => {
  console.log('[App] 收到注册事件, data:', data)
  try {
    let result
    
    if (data.accessToken || data.token) {
      // 真实 API 响应（兼容 token 和 accessToken）
      result = data
    } else {
      // 调用注册 API
      result = await register({
        email: data.email,
        password: data.password,
        nickname: data.nickname
      })
    }
    
    // 确保 user 字段存在
    const userData = result.user || {
      email: data.email || 'unknown',
      nickname: data.nickname || 'User'
    }
    
    // 保存用户信息
    user.value = userData
    localStorage.setItem('user_info', JSON.stringify(userData))
    
    console.log('[App] 注册成功，准备跳转:', userData)
    
    // 注册成功后跳转到产品后台
    showLogin.value = false  // 先关闭弹窗
    await nextTick()  // 等待 DOM 更新
    
    console.log('[App] showLogin 已设为 false, currentPage:', currentPage.value)
    currentPage.value = 'admin'
    await nextTick()  // 等待页面切换
    console.log('[App] 跳转完成, currentPage:', currentPage.value)
  } catch (error) {
    console.error('[App] 注册失败:', error)
    alert('注册失败: ' + error.message)
  }
}

// 处理联系表单提交
const handleContact = async (data) => {
  try {
    const result = await submitContactForm(data)
    console.log('表单提交成功:', result)
    alert('提交成功！我们将在24小时内与您联系')
  } catch (error) {
    console.error('表单提交失败:', error.message)
    alert('提交失败: ' + error.message)
  }
}

// 处理退出登录
const handleLogout = async () => {
  try {
    await logout()
  } catch (error) {
    console.error('退出登录失败:', error)
  }
  user.value = null
  localStorage.removeItem('user_info')
  goToHome()
}

// Scroll animation observer
let scrollObserver = null

const initScrollAnimations = () => {
  if (typeof IntersectionObserver === 'undefined') return

  scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
          scrollObserver.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  )

  // Observe all scroll-animate elements
  document.querySelectorAll('.scroll-animate, .stagger-children').forEach((el) => {
    scrollObserver.observe(el)
  })
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    theme.value = savedTheme
  }
  
  // 从 localStorage 恢复用户状态
  const savedUser = localStorage.getItem('user_info')
  if (savedUser) {
    try {
      user.value = JSON.parse(savedUser)
    } catch (e) {
      console.error('Failed to parse saved user:', e)
    }
  }

  // Initialize scroll animations after DOM is ready
  setTimeout(initScrollAnimations, 100)
})

onUnmounted(() => {
  if (scrollObserver) {
    scrollObserver.disconnect()
  }
})
</script>
