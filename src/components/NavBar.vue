<template>
  <nav class="fixed top-0 left-0 right-0 z-50 nav-scrolled" :class="{ 'scrolled': isScrolled }">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

      <!-- Logo -->
      <a href="#" class="flex items-center gap-2 cursor-pointer group">
        <img :src="theme === 'dark' ? '/logo-white.png' : '/logo-header.png'" alt="HiAeo" class="h-6 w-auto transition-transform duration-300 group-hover:scale-110" />
        <span class="alpha-badge" :style="theme === 'dark' ? 'background:rgba(22,93,255,0.15);color:#165DFF;' : 'background:rgba(22,93,255,0.1);color:#165DFF;'">Alpha</span>
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

        <!-- Theme toggle -->
        <button class="p-2 rounded-lg transition-all duration-200 cursor-pointer theme-toggle" @click="$emit('toggle-theme')" :title="theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'">
          <!-- Sun icon (show in dark mode) -->
          <svg v-if="theme === 'dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="transition-transform duration-200 hover:scale-110">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <!-- Moon icon (show in light mode) -->
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="transition-transform duration-200 hover:scale-110">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>

        <!-- Register / Login -->
        <button class="hidden sm:flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer nav-btn-secondary" @click="$emit('open-login')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
          登录
        </button>

        <!-- Start free -->
        <button @click="$emit('openContact')" class="hidden sm:flex px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer nav-btn-primary">
          预约咨询
        </button>

        <!-- Mobile menu button -->
        <button class="md:hidden p-2 rounded-lg transition-colors" @click="mobileOpen = !mobileOpen">
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
      <div class="px-6 py-4 border-t mobile-menu-divider space-y-2">
        <button class="w-full py-2.5 rounded-lg text-sm font-medium mobile-nav-btn-secondary" @click="$emit('openLogin'); mobileOpen = false">
          登录
        </button>
        <button class="w-full py-2.5 rounded-lg text-sm font-semibold mobile-nav-btn-primary" @click="$emit('openContact'); mobileOpen = false">
          预约咨询
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  theme: {
    type: String,
    default: 'dark'
  }
})

defineEmits(['toggleTheme', 'openLogin'])

const mobileOpen = ref(false)
const isScrolled = ref(false)

const theme = computed(() => props.theme)

const navLinks = [
  { label: '产品功能', href: '#features' },
  { label: '模镜诊断', href: '#miraseek' },
  { label: '模豆策略', href: '#miramod' },
  { label: '模法执行', href: '#miramag' },
  { label: '案例', href: '#cases-detail' },
  { label: '定价', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
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
  background: rgba(10, 10, 15, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

[data-theme="light"] .nav-scrolled {
  background: rgba(247, 248, 250, 0.95);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.theme-toggle {
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.theme-toggle:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

[data-theme="light"] .theme-toggle {
  color: #4B5563;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

[data-theme="light"] .theme-toggle:hover {
  color: #111827;
  background: rgba(0, 0, 0, 0.08);
}

.nav-link {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease;
  position: relative;
}

[data-theme="light"] .nav-link {
  color: #4B5563;
}

.nav-link:hover {
  color: white;
}

[data-theme="light"] .nav-link:hover {
  color: #111827;
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

[data-theme="light"] .nav-btn-secondary {
  color: #4B5563;
  border: 1px solid rgba(0, 0, 0, 0.15);
}

[data-theme="light"] .nav-btn-secondary:hover {
  background: rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.25);
  color: #111827;
}

.mobile-menu {
  background: rgba(17, 24, 39, 0.98);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

[data-theme="light"] .mobile-menu {
  background: rgba(247, 248, 250, 0.98);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.mobile-menu-divider {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

[data-theme="light"] .mobile-menu-divider {
  border-top-color: rgba(0, 0, 0, 0.08);
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

[data-theme="light"] .mobile-nav-link {
  color: #4B5563;
}

.mobile-nav-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

[data-theme="light"] .mobile-nav-link:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #111827;
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

[data-theme="light"] .mobile-nav-btn-secondary {
  color: #4B5563;
  border: 1px solid rgba(0, 0, 0, 0.15);
}
</style>