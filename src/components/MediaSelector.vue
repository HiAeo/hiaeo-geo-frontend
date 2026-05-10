<template>
  <div class="media-selector">
    <!-- 分类标签 -->
    <div class="category-tabs">
      <button
        v-for="category in categories"
        :key="category.id"
        :class="['category-tab', { active: selectedCategory === category.id }]"
        @click="selectedCategory = category.id"
      >
        <span class="tab-icon">{{ category.icon }}</span>
        <span class="tab-name">{{ category.name }}</span>
        <span class="tab-count">{{ getMediaCount(category.id) }}</span>
      </button>
    </div>

    <!-- 媒体网格 -->
    <div class="media-grid">
      <div
        v-for="media in filteredMedia"
        :key="media.id"
        :class="['media-card', { selected: isSelected(media.id) }]"
      >
        <!-- Logo区域 - 点击打开官网 -->
        <a
          :href="media.url"
          target="_blank"
          class="media-logo-link"
          :title="`点击访问${media.name}官网`"
        >
          <div class="media-logo">
            <img v-if="media.logo && !logoError[media.id]" :src="media.logo" :alt="media.name" @error="handleLogoError(media.id)" />
            <span v-else class="media-emoji">{{ getMediaEmoji(media.id) }}</span>
          </div>
          <span class="media-name">{{ media.name }}</span>
        </a>
        
        <!-- 勾选方块 - 点击选择/取消 -->
        <button
          :class="['select-checkbox', { checked: isSelected(media.id) }]"
          @click="toggleMedia(media)"
          :title="isSelected(media.id) ? '取消选择' : '选择该媒体'"
        >
          <svg v-if="isSelected(media.id)" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </button>
        
        <!-- 悬停提示 -->
        <span class="visit-hint">点击访问官网</span>
      </div>
    </div>

    <!-- 已选媒体 -->
    <div v-if="selectedMedia.length > 0" class="selected-section">
      <div class="selected-header">
        <span class="selected-title">已选媒体 ({{ selectedMedia.length }})</span>
        <button class="clear-btn" @click="clearAll">清空</button>
      </div>
      <div class="selected-tags">
        <span
          v-for="mediaId in selectedMedia"
          :key="mediaId"
          class="selected-tag"
        >
          {{ getMediaName(mediaId) }}
          <button class="remove-tag" @click="removeMedia(mediaId)">×</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  mediaCategories,
  topAuthorityMedia,
  officialAuthorityMedia,
  socialPlatformMedia,
  localMedia
} from '../config/mediaConfig'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// 状态
const selectedCategory = ref('top-authority')
const logoError = ref({})

// 媒体数据映射
const mediaMap = computed(() => {
  const map = {}
  ;[...topAuthorityMedia, ...officialAuthorityMedia, ...socialPlatformMedia, ...localMedia].forEach(m => {
    map[m.id] = m
  })
  return map
})

// 选中的媒体
const selectedMedia = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 分类列表
const categories = computed(() => mediaCategories)

// 根据分类获取媒体数量
const getMediaCount = (categoryId) => {
  const counts = {
    'top-authority': topAuthorityMedia.length,
    'official-authority': officialAuthorityMedia.length,
    'social-platforms': socialPlatformMedia.length,
    'local-media': localMedia.length
  }
  return counts[categoryId] || 0
}

// 当前分类的媒体
const filteredMedia = computed(() => {
  const mediaByCategory = {
    'top-authority': topAuthorityMedia,
    'official-authority': officialAuthorityMedia,
    'social-platforms': socialPlatformMedia,
    'local-media': localMedia
  }
  return mediaByCategory[selectedCategory.value] || []
})

// 检查是否选中
const isSelected = (mediaId) => {
  return selectedMedia.value.includes(mediaId)
}

// 获取媒体名称
const getMediaName = (mediaId) => {
  return mediaMap.value[mediaId]?.name || mediaId
}

// 获取媒体 emoji
const getMediaEmoji = (mediaId) => {
  const emojiMap = {
    'xinhuanet': '🏛️',
    'people': '📰',
    'cctv': '📺',
    'guangming': '💡',
    'chinanews': '🌐',
    'chinadaily': '🌍',
    'baidu-baike': '📖',
    'sogou-baike': '📚',
    'tianyancha': '🔍',
    'whitepaper': '📊',
    'weibo': '📱',
    'douyin': '🎵',
    'xiaohongshu': '📕',
    'bilibili': '📺',
    'kuaishou': '🎬',
    'hupu': '🏀',
    'douban': '🎭',
    'toutiao': '📰',
    'dianping': '🍽️'
  }
  return emojiMap[mediaId] || '🌐'
}

// 切换媒体选择状态
const toggleMedia = (media) => {
  if (isSelected(media.id)) {
    selectedMedia.value = selectedMedia.value.filter(id => id !== media.id)
  } else {
    selectedMedia.value = [...selectedMedia.value, media.id]
  }
  emit('change', selectedMedia.value)
}

// 移除媒体
const removeMedia = (mediaId) => {
  selectedMedia.value = selectedMedia.value.filter(id => id !== mediaId)
  emit('change', selectedMedia.value)
}

// 清空所有
const clearAll = () => {
  selectedMedia.value = []
  emit('change', selectedMedia.value)
}

// 处理 logo 加载错误
const handleLogoError = (mediaId) => {
  logoError.value[mediaId] = true
}
</script>

<style scoped>
.media-selector {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 分类标签 */
.category-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.category-tab:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.category-tab.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.tab-icon {
  font-size: 1rem;
}

.tab-name {
  font-weight: 500;
}

.tab-count {
  font-size: 0.75rem;
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.category-tab:not(.active) .tab-count {
  background: var(--bg-elevated);
}

/* 媒体网格 */
.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.media-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.2s ease;
  cursor: default;
}

.media-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.media-card.selected {
  border-color: var(--color-primary);
  background: rgba(22, 93, 255, 0.05);
}

/* Logo链接区域 - 点击打开官网 */
.media-logo-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--text-primary);
  cursor: pointer;
}

.media-logo-link:hover .media-name {
  color: var(--color-primary);
}

.media-logo {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.media-emoji {
  font-size: 2rem;
}

.media-name {
  font-size: 0.8125rem;
  font-weight: 500;
  text-align: center;
}

/* 勾选方块 - 右上角选择按钮 */
.select-checkbox {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 18px;
  height: 18px;
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;
}

.select-checkbox:hover {
  border-color: var(--color-primary);
}

.select-checkbox.checked {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.visit-hint {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 4px;
  background: var(--color-primary);
  color: white;
  font-size: 0.625rem;
  text-align: center;
  border-radius: 0 0 11px 11px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.media-card:hover .visit-hint {
  opacity: 1;
}

/* 已选区域 */
.selected-section {
  padding: 16px;
  background: var(--bg-primary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.selected-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.selected-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.clear-btn {
  padding: 4px 12px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.75rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px 4px 12px;
  background: var(--color-primary);
  color: white;
  border-radius: 16px;
  font-size: 0.8125rem;
}

.remove-tag {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.remove-tag:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>
