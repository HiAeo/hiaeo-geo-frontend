<template>
  <div class="ai-logos-field" :style="{ width: width + 'px', height: height + 'px' }">
    <a
      v-for="(model, i) in models"
      :key="model.label"
      :href="model.url"
      target="_blank"
      :style="getStyle(i)"
      class="ai-logo-bubble"
      :class="{ hovered: hovered === i }"
      @mouseenter="hovered = i"
      @mouseleave="hovered = -1"
      :title="model.label"
    >
      <img
        :src="`https://unpkg.com/@lobehub/icons-static-svg@latest/icons/${model.svgFile}`"
        :alt="model.label"
        class="ai-logo-img"
        loading="lazy"
      />
      <span class="ai-logo-tip" :style="{ color: model.color }">{{ model.label }}</span>
    </a>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  width: { type: Number, default: 280 },
  height: { type: Number, default: 220 },
})

const hovered = ref(-1)

// 10 个 AI 模型 Logo 数据（使用 @lobehub/icons-static-svg CDN）
const models = [
  { label: 'DeepSeek', svgFile: 'deepseek.svg', url: 'https://chat.deepseek.com', color: '#165DFF' },
  { label: '豆包',     svgFile: 'doubao.svg',    url: 'https://www.doubao.com',     color: '#F59E0B' },
  { label: '通义千问', svgFile: 'qwen.svg',     url: 'https://tongyi.aliyun.com/qianwen', color: '#165DFF' },
  { label: 'Kimi',    svgFile: 'kimi.svg',     url: 'https://kimi.moonshot.cn',   color: '#8B5CF6' },
  { label: '元宝',     svgFile: 'yuanbao.svg',   url: 'https://yuanbao.tencent.com', color: '#F97316' },
  { label: 'ChatGPT', svgFile: 'openai.svg',    url: 'https://chat.openai.com',   color: '#10A37F' },
  { label: 'Gemini',  svgFile: 'gemini.svg',    url: 'https://gemini.google.com',  color: '#8E8E91' },
  { label: 'Claude',  svgFile: 'anthropic.svg', url: 'https://claude.ai',          color: '#D4A574' },
  { label: 'Grok',    svgFile: 'grok.svg',      url: 'https://grok.com',           color: '#F97316' },
  { label: 'Llama 3', svgFile: 'llamaindex.svg',url: 'https://llama.meta.com',     color: '#8B5CF6' },
]

// 基于索引的确定性位置分布（围绕中心）
const positions = [
  // 外圈 - 左上
  { x: -45, y: -30, scale: 1.1, delay: '0s' },
  { x: -55, y: 40,  scale: 0.95, delay: '0.4s' },
  { x: -20, y: 70,  scale: 1.0, delay: '0.8s' },
  // 外圈 - 右上
  { x: 55,  y: -40, scale: 1.15, delay: '0.2s' },
  { x: 65,  y: 20,  scale: 0.9, delay: '1.2s' },
  { x: 30,  y: 65,  scale: 1.0, delay: '0.6s' },
  // 外圈 - 上中
  { x: -5,  y: -55, scale: 1.2, delay: '1.0s' },
  // 外圈 - 下中
  { x: 10,  y: 80,  scale: 0.85, delay: '1.4s' },
  // 外圈 - 左中
  { x: -60, y: -5,  scale: 1.05, delay: '0.3s' },
  // 外圈 - 右中
  { x: 60,  y: -10, scale: 0.95, delay: '0.9s' },
]

function getStyle(i) {
  const p = positions[i]
  const isHovered = hovered.value === i
  return {
    left: `calc(50% + ${p.x}px)`,
    top: `calc(50% + ${p.y}px)`,
    transform: `translate(-50%, -50%) scale(${isHovered ? p.scale * 1.25 : p.scale})`,
    animationDelay: p.delay,
    transition: 'transform 0.25s ease, filter 0.25s ease',
    zIndex: isHovered ? 10 : 1,
    '--logo-color': models[i].color,
  }
}
</script>

<style scoped>
.ai-logos-field {
  position: relative;
  pointer-events: none;
}

.ai-logo-bubble {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  pointer-events: all;
  cursor: pointer;
  animation: logoFloat 3s ease-in-out infinite;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.15));
}

.ai-logo-img {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--bg-elevated);
  padding: 4px;
  box-sizing: border-box;
  border: 1.5px solid rgba(128,128,128,0.15);
  transition: border-color 0.25s, box-shadow 0.25s;
}

.ai-logo-bubble:hover .ai-logo-img {
  border-color: var(--logo-color);
  box-shadow: 0 0 12px rgba(0,0,0,0.12), 0 0 0 2px var(--logo-color, #165DFF);
}

.ai-logo-tip {
  font-size: 9px;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 0.2s, transform 0.2s;
  background: var(--bg-elevated);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(128,128,128,0.12);
  pointer-events: none;
}

.ai-logo-bubble.hovered .ai-logo-tip {
  opacity: 1;
  transform: translateY(0);
}

@keyframes logoFloat {
  0%, 100% { margin-top: 0; }
  50% { margin-top: -6px; }
}
</style>
