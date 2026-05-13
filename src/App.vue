<template>
  <div class="min-h-screen overflow-x-hidden pb-16 md:pb-0" :data-theme="theme">

    <!-- App/Manage 子路由页面 (全屏覆盖官网 NavBar 也隐藏) -->
    <router-view v-if="isSubApp" />

    <!-- 关于我们页面 -->
    <router-view v-else-if="isAboutPage" />

    <!-- 官网首页 -->
    <template v-else>
      <!-- NavBar -->
      <NavBar :theme="theme" @toggle-theme="toggleTheme" @open-login="showLogin = true" @open-contact="showContact = true" />

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

      <!-- Login Modal -->
      <LoginModal
        :show="showLogin"
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
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from './composables/useApi'
import { initTheme, toggleTheme as globalToggleTheme, theme as globalTheme, setTheme } from './composables/useTheme'

// 组件导入 (官网)
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

const route = useRoute()
const router = useRouter()
const { loginWithPassword, register, submitContactForm, logout } = useApi()

// 使用全局主题状态，确保所有组件同步
const theme = globalTheme
const showLogin = ref(false)
const showContact = ref(false)

// 初始化主题
onMounted(() => {
  initTheme()
})

// 监听路由变化，确保子应用页面同步主题到 DOM
watch(() => route.path, () => {
  // 进入后台时强制深色主题
  if (route.path.startsWith('/app') || route.path.startsWith('/manage')) {
    setTheme('dark')
  }
  document.documentElement.setAttribute('data-theme', theme.value)
}, { immediate: false })

// 判断是否在 App/Manage 子路由中
const isSubApp = computed(() => route.path.startsWith('/app') || route.path.startsWith('/manage'))

const isAboutPage = computed(() => route.path === '/about')

// 切换主题 - 使用全局函数
const toggleTheme = () => {
  globalToggleTheme()
}

// 处理登录 - 根据用户名判断角色
const handleLogin = async (data) => {
  console.log('[App] 收到登录事件, data:', data)
  try {
    let result
    if (data.isSms) {
      result = data
    } else if (data.accessToken || data.token) {
      result = data
    } else {
      result = await loginWithPassword(data)
    }

    // 根据用户名判断角色：admin → 管理后台，其他 → 品牌工作台
    const email = data.email || data.username || data.user?.email || ''
    const isAdmin = email.toLowerCase() === 'admin' || email.toLowerCase().startsWith('admin@')
    const userRole = isAdmin ? 'admin' : 'brand'

    const userData = {
      email: email || result?.user?.email || 'unknown',
      nickname: data.nickname || (isAdmin ? '管理员' : '品牌用户'),
      role: userRole,
      ...(result?.user || {})
    }

    localStorage.setItem('user_info', JSON.stringify(userData))
    localStorage.setItem('user_role', userRole)

    console.log('[App] 登录成功，跳转目标, role:', userRole)
    showLogin.value = false

    // 优先跳转到 redirect 参数指定的页面
    const redirectTo = route.query.redirect
    if (redirectTo) {
      router.push(redirectTo)
      return
    }

    if (userRole === 'admin') {
      router.push('/manage/overview')
    } else {
      // 品牌用户默认跳转到品牌智库页
      router.push('/app/knowledge')
    }
  } catch (error) {
    console.error('[App] 登录失败:', error)
    alert('登录失败: ' + error.message)
  }
}

// 处理注册 - 注册用户默认进入品牌工作台
const handleSignup = async (data) => {
  console.log('[App] 收到注册事件, data:', data)
  try {
    let result
    if (data.accessToken || data.token) {
      result = data
    } else {
      result = await register({
        email: data.email,
        password: data.password,
        nickname: data.nickname
      })
    }

    const userData = {
      email: data.email || result?.user?.email || 'unknown',
      nickname: data.nickname || result?.user?.nickname || '品牌用户',
      role: 'brand',
      ...(result?.user || {})
    }

    localStorage.setItem('user_info', JSON.stringify(userData))
    localStorage.setItem('user_role', 'brand')

    showLogin.value = false
    router.push('/app/knowledge')
  } catch (error) {
    console.error('[App] 注册失败:', error)
    alert('注册失败: ' + error.message)
  }
}

// 处理联系表单提交
const handleContact = async (data) => {
  try {
    await submitContactForm(data)
    alert('提交成功！我们将在24小时内与您联系')
  } catch (error) {
    console.error('表单提交失败:', error.message)
    alert('提交失败: ' + error.message)
  }
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
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  )
  document.querySelectorAll('.scroll-animate, .stagger-children').forEach((el) => {
    scrollObserver.observe(el)
  })
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) theme.value = savedTheme

  // 守卫重定向过来的未登录请求，自动弹出登录框
  const redirect = route.query.redirect
  if (redirect) {
    showLogin.value = true
  }

  setTimeout(initScrollAnimations, 100)
})
</script>
