<template>
  <div class="min-h-screen overflow-x-hidden pb-16 md:pb-0" :data-theme="theme">
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useApi } from './composables/useApi'

const { loginWithPassword, loginWithSms, register, submitContactForm, logout, isAuthenticated } = useApi()

const theme = ref('dark')
const showLogin = ref(false)
const showContact = ref(false)

// 处理登录
const handleLogin = async (data) => {
  try {
    // 根据数据类型判断登录方式
    const result = data.code 
      ? await loginWithSms({ phone: data.phone, code: data.code })
      : await loginWithPassword(data)
    
    console.log('登录成功:', result.user)
    // TODO: 保存用户信息到全局状态
    // TODO: 跳转到的仪表盘或首页
  } catch (error) {
    console.error('登录失败:', error.message)
    alert('登录失败: ' + error.message)
  }
}

// 处理注册
const handleSignup = async (data) => {
  try {
    const result = await register({
      phone: data.phone,
      code: data.code,
      password: data.password
    })
    
    console.log('注册成功:', result.user)
    // TODO: 保存用户信息到全局状态
    // TODO: 自动登录并跳转
  } catch (error) {
    console.error('注册失败:', error.message)
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

  // Initialize scroll animations after DOM is ready
  setTimeout(initScrollAnimations, 100)
})

onUnmounted(() => {
  if (scrollObserver) {
    scrollObserver.disconnect()
  }
})
</script>
