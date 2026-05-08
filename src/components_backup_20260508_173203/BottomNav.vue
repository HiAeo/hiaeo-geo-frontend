<template>
  <nav class="bottom-nav">
    <a 
      v-for="item in navItems" 
      :key="item.id"
      :href="item.href"
      class="nav-item"
      :class="{ active: activeSection === item.id }"
      @click.prevent="scrollTo(item.href)"
    >
      <component :is="item.icon" class="nav-icon" />
      <span class="nav-label">{{ item.label }}</span>
    </a>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, h } from 'vue'

// Icon components
const HomeIcon = {
  render() {
    return h('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, [
      h('path', { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }),
      h('polyline', { points: '9 22 9 12 15 12 15 22' })
    ])
  }
}

const FeatureIcon = {
  render() {
    return h('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, [
      h('rect', { x: 3, y: 3, width: 7, height: 7 }),
      h('rect', { x: 14, y: 3, width: 7, height: 7 }),
      h('rect', { x: 14, y: 14, width: 7, height: 7 }),
      h('rect', { x: 3, y: 14, width: 7, height: 7 })
    ])
  }
}

const ProductIcon = {
  render() {
    return h('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, [
      h('circle', { cx: 11, cy: 11, r: 8 }),
      h('path', { d: 'm21 21-4.35-4.35' })
    ])
  }
}

const PriceIcon = {
  render() {
    return h('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, [
      h('line', { x1: 12, y1: 1, x2: 12, y2: 23 }),
      h('path', { d: 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' })
    ])
  }
}

const navItems = [
  { id: 'home', label: '首页', href: '#hero', icon: HomeIcon },
  { id: 'features', label: '功能', href: '#features', icon: FeatureIcon },
  { id: 'products', label: '产品', href: '#miraseek', icon: ProductIcon },
  { id: 'pricing', label: '定价', href: '#pricing', icon: PriceIcon },
]

const activeSection = ref('home')

const scrollTo = (href) => {
  const target = document.querySelector(href)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}

const handleScroll = () => {
  const sections = ['hero', 'features', 'miraseek', 'miramod', 'miramag', 'hub', 'pricing', 'faq']
  const scrollY = window.scrollY + 100
  
  for (const section of sections) {
    const el = document.getElementById(section)
    if (el) {
      const { offsetTop, offsetHeight } = el
      if (scrollY >= offsetTop && scrollY < offsetTop + offsetHeight) {
        if (section === 'hero') {
          activeSection.value = 'home'
        } else if (['miraseek', 'miramod', 'miramag'].includes(section)) {
          activeSection.value = 'products'
        } else {
          activeSection.value = section
        }
        break
      }
    }
  }
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
.bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  padding: 8px 0;
  padding-bottom: max(8px, env(safe-area-inset-bottom));
  z-index: 999;
}

@media (max-width: 768px) {
  .bottom-nav {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  text-decoration: none;
  color: var(--text-tertiary);
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.nav-item:active {
  transform: scale(0.95);
}

.nav-item.active {
  color: var(--color-primary);
}

.nav-icon {
  transition: transform 0.2s ease;
}

.nav-item.active .nav-icon {
  transform: scale(1.1);
}

.nav-label {
  font-size: 0.6875rem;
  font-weight: 500;
}
</style>
