<template>
  <div class="min-h-screen overflow-x-hidden" :data-theme="theme">
    <!-- NavBar -->
    <NavBar :theme="theme" @toggle-theme="toggleTheme" />

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

    <!-- 板块8: 定价 -->
    <PricingSection />

    <!-- Footer -->
    <FooterSection />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import BentoGridSection from './components/BentoGridSection.vue'
import MiraSeekSection from './components/MiraSeekSection.vue'
import MiraModSection from './components/MiraModSection.vue'
import MiraMagSection from './components/MiraMagSection.vue'
import HubSection from './components/HubSection.vue'
import GrowthSection from './components/GrowthSection.vue'
import PricingSection from './components/PricingSection.vue'
import FooterSection from './components/FooterSection.vue'

const theme = ref('dark')

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  // Save preference to localStorage
  localStorage.setItem('theme', theme.value)
}

onMounted(() => {
  // Load saved preference
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    theme.value = savedTheme
  }
})
</script>