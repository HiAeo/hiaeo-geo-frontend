<template>
  <div class="min-h-screen overflow-x-hidden pb-16 md:pb-0" :data-theme="theme">
    <!-- NavBar -->
    <NavBar :theme="theme" @toggle-theme="toggleTheme" @open-login="showLogin = true" />

    <!-- 板块1: Hero -->
    <HeroSection />

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

    <!-- 板块10: 关于我们 -->
    <AboutSection />

    <!-- 板块11: FAQ -->
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
import AboutSection from './components/AboutSection.vue'
import FAQSection from './components/FAQSection.vue'
import FooterSection from './components/FooterSection.vue'
import BottomNav from './components/BottomNav.vue'
import LoginModal from './components/LoginModal.vue'
import ContactModal from './components/ContactModal.vue'

const theme = ref('dark')
const showLogin = ref(false)
const showContact = ref(false)

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', theme.value)
}

const handleLogin = (data) => {
  console.log('Login:', data)
  // TODO: 调用登录 API
}

const handleSignup = (data) => {
  console.log('Signup:', data)
  // TODO: 调用注册 API
}

const handleContact = (data) => {
  console.log('Contact:', data)
  // TODO: 调用联系表单 API
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
