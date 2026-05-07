<template>
  <div class="min-h-screen bg-[#F7F8FA] overflow-x-hidden">
    <!-- NavBar -->
    <NavBar />

    <!-- 板块1: Hero -->
    <HeroSection />

    <!-- 板块2: 模镜 MiraSeek -->
    <MiraSeekSection />

    <!-- 板块3: 模豆 MiraMod -->
    <MiraModSection />

    <!-- 板块4: 模法 MiraMag -->
    <MiraMagSection />

    <!-- 板块5: 魔鲸Hub -->
    <HubSection />

    <!-- 板块6: 客户成长路径与案例 -->
    <GrowthSection />

    <!-- Footer -->
    <FooterSection />
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import MiraSeekSection from './components/MiraSeekSection.vue'
import MiraModSection from './components/MiraModSection.vue'
import MiraMagSection from './components/MiraMagSection.vue'
import HubSection from './components/HubSection.vue'
import GrowthSection from './components/GrowthSection.vue'
import FooterSection from './components/FooterSection.vue'
</script>