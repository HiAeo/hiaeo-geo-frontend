<template>
  <nav class="fixed top-0 left-0 right-0 z-50" style="background:rgba(247,248,250,0.88);backdrop-filter:blur(16px);">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

      <!-- Logo -->
      <div class="flex items-center gap-3 cursor-pointer" @click="$emit('scrollTo', 'hero')">
        <img src="/logo-hollow.png" alt="HiAeo" class="h-6 w-auto" />
      </div>

      <!-- Desktop nav links -->
      <div class="hidden md:flex items-center gap-8">
        <a v-for="link in navLinks" :key="link.label" :href="link.href"
          class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
          {{ link.label }}
        </a>
      </div>

      <!-- CTA buttons -->
      <div class="flex items-center gap-3">

        <!-- Language toggle -->
        <button class="hidden sm:block px-5 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors bg-white cursor-pointer"
          @click="lang = lang === 'zh' ? 'en' : 'zh'">
          {{ lang === 'zh' ? 'EN' : '中文' }}
        </button>

        <!-- Register / Login -->
        <button class="hidden sm:block px-5 py-2 rounded-lg text-sm font-medium bg-[#111827] text-white hover:bg-gray-800 transition-colors cursor-pointer">
          注册 / 登陆
        </button>

        <!-- Mobile menu button -->
        <button class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" @click="mobileOpen = !mobileOpen">
          <svg v-if="!mobileOpen" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileOpen" class="md:hidden bg-white border-t border-gray-100 px-6 py-5 space-y-3">
      <a v-for="link in navLinks" :key="link.label" :href="link.href"
        class="block text-sm font-medium text-gray-600 hover:text-gray-900 py-2"
        @click="mobileOpen = false">
        {{ link.label }}
      </a>
      <div class="flex flex-col gap-2 pt-3 border-t border-gray-100">
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

defineEmits(['scrollTo'])

const mobileOpen = ref(false)
const lang = ref('zh')

const navLinks = [
  { label: '产品功能', href: '#features' },
  { label: '模镜诊断', href: '#miraseek' },
  { label: '模豆策略', href: '#miramod' },
  { label: '模法执行', href: '#miramag' },
  { label: '定价',     href: '#pricing' },
]
</script>