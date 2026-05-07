<template>
  <nav class="fixed top-0 left-0 right-0 z-50 nav-scrolled" :class="{ 'scrolled': isScrolled }">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

      <!-- Logo -->
      <a href="#" class="flex items-center gap-2 cursor-pointer group">
        <img src="/logo-header.png" alt="HiAeo" class="h-6 w-auto transition-transform duration-300 group-hover:scale-110" />
        <span class="alpha-badge" style="background:rgba(22,93,255,0.1);color:#165DFF;">Alpha</span>
      </a>

      <!-- Desktop nav links -->
      <div class="hidden md:flex items-center gap-8">
        <a v-for="link in navLinks" :key="link.label" :href="link.href"
          class="nav-link">
          {{ link.label }}
        </a>
      </div>

      <!-- CTA buttons -->
      <div class="flex items-center gap-3">

        <!-- Register / Login -->
        <button class="hidden sm:flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer nav-btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
          登录
        </button>

        <!-- Start free -->
        <button class="hidden sm:flex px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer nav-btn-primary">
          免费诊断
        </button>

        <!-- Mobile menu button -->
        <button class="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors" @click="mobileOpen = !mobileOpen">
          <svg v-if="!mobileOpen" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileOpen" class="md:hidden mobile-menu">
      <div class="px-6 py-4 space-y-1">
        <a v-for="link in navLinks" :key="link.label" :href="link.href"
          class="mobile-nav-link"
          @click="mobileOpen = false">
          {{ link.label }}
        </a>
      </div>
      <div class="px-6 py-4 border-t border-white/10 space-y-2">
        <button class="w-full py-2.5 rounded-lg text-sm font-medium mobile-nav-btn-secondary">
          登录
        </button>
        <button class="w-full py-2.5 rounded-lg text-sm font-semibold mobile-nav-btn-primary">
          免费诊断
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const mobileOpen = ref(false)
const isScrolled = ref(false)

const navLinks = [
  { label: '产品功能', href: '#features' },
  { label: '模镜诊断', href: '#miraseek' },
  { label: '模豆策略', href: '#miramod' },
  { label: '模法执行', href: '#miramag' },
  { label: '定价', href: '#pricing' },
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
nav {
  transition: all 0.3s ease;
}

.nav-scrolled {
  background: rgba(10, 10, 15, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.nav-link {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: white;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: #165DFF;
  transition: width 0.2s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-btn-primary {
  background: #165DFF;
  color: white;
}

.nav-btn-primary:hover {
  background: #0040ED;
  box-shadow: 0 0 20px rgba(22, 93, 255, 0.3);
}

.nav-btn-secondary {
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.nav-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.25);
}

.mobile-menu {
  background: rgba(17, 24, 39, 0.98);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.mobile-nav-link {
  display: block;
  padding: 12px 16px;
  font-size: 15px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  transition: all 0.2s ease;
}

.mobile-nav-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.mobile-nav-btn-primary {
  background: #165DFF;
  color: white;
}

.mobile-nav-btn-secondary {
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.15);
}
</style>