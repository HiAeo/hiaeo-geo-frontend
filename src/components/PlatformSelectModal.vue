<template>
  <div class="platform-select-modal">
    <div class="modal-header">
      <h3>选择发布平台</h3>
      <button class="close-btn" @click="$emit('close')">&times;</button>
    </div>
    
    <div class="modal-body">
      <!-- 快速选择 -->
      <div class="quick-select" v-if="quickSelectPlatforms.length > 0">
        <div class="section-label">快速发布到所有已配置平台</div>
        <button class="quick-deploy-btn" @click="handleQuickDeploy">
          <span class="icon">🚀</span>
          <span>一键发布到 {{ quickSelectPlatforms.length }} 个平台</span>
        </button>
      </div>
      
      <!-- 平台列表 -->
      <div class="section-label">或选择单个平台</div>
      <div class="platform-grid">
        <div 
          v-for="p in platforms.filter(p => p.connected)"
          :key="p.id"
          class="platform-card"
          :class="{ selected: selectedPlatforms.includes(p.id) }"
          @click="togglePlatform(p.id)"
        >
          <div class="platform-icon" :style="{ background: getPlatformColor(p.type) }">
            {{ getPlatformIcon(p.type) }}
          </div>
          <div class="platform-info">
            <span class="platform-name">{{ getPlatformName(p.type) }}</span>
            <span class="platform-desc">{{ p.config?.description || '已配置' }}</span>
          </div>
          <div class="check-indicator" v-if="selectedPlatforms.includes(p.id)">✓</div>
        </div>
      </div>
      
      <!-- 未配置平台提示 -->
      <div class="empty-tip" v-if="platforms.filter(p => p.connected).length === 0">
        <p>暂无已配置的平台</p>
        <button class="add-btn" @click="$emit('add-platform')">添加平台配置</button>
      </div>
    </div>
    
    <div class="modal-footer">
      <button class="btn secondary" @click="$emit('close')">取消</button>
      <button 
        class="btn primary" 
        :disabled="selectedPlatforms.length === 0"
        @click="handleDeploy"
      >
        立即发布 ({{ selectedPlatforms.length }})
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { PLATFORM_TYPES, PLATFORM_TEMPLATES } from '@/api/deploy'

const props = defineProps({
  platforms: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'deploy', 'quick-deploy', 'add-platform'])

const selectedPlatforms = ref([])

// 快速发布的平台列表（所有已连接平台）
const quickSelectPlatforms = computed(() => 
  props.platforms.filter(p => p.connected)
)

const togglePlatform = (id) => {
  const idx = selectedPlatforms.value.indexOf(id)
  if (idx > -1) {
    selectedPlatforms.value.splice(idx, 1)
  } else {
    selectedPlatforms.value.push(id)
  }
}

const handleDeploy = () => {
  emit('deploy', selectedPlatforms.value)
}

const handleQuickDeploy = () => {
  emit('quick-deploy', quickSelectPlatforms.value.map(p => p.id))
}

const getPlatformIcon = (type) => PLATFORM_TEMPLATES[type]?.icon || '⚙'
const getPlatformName = (type) => PLATFORM_TEMPLATES[type]?.name || '未知平台'
const getPlatformColor = (type) => PLATFORM_TEMPLATES[type]?.color || '#6366f1'
</script>

<style scoped>
.platform-select-modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 560px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
}

.close-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: #f1f5f9;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.25rem;
  color: #64748b;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

.quick-select {
  margin-bottom: 24px;
}

.quick-deploy-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.quick-deploy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
}

.quick-deploy-btn .icon {
  font-size: 1.25rem;
}

.platform-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (max-width: 480px) {
  .platform-grid { grid-template-columns: 1fr; }
}

.platform-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.platform-card:hover {
  border-color: #cbd5e1;
  background: #f1f5f9;
}

.platform-card.selected {
  border-color: #4f46e5;
  background: #eef2ff;
}

.platform-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.platform-info {
  flex: 1;
  min-width: 0;
}

.platform-name {
  display: block;
  font-weight: 600;
  font-size: 0.875rem;
  color: #1e293b;
  margin-bottom: 2px;
}

.platform-desc {
  font-size: 0.6875rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.check-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: #4f46e5;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 700;
}

.empty-tip {
  text-align: center;
  padding: 40px 20px;
}

.empty-tip p {
  color: #64748b;
  margin-bottom: 16px;
}

.add-btn {
  padding: 10px 20px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #e2e8f0;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn.primary {
  background: #4f46e5;
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background: #4338ca;
}

.btn.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn.secondary {
  background: #f1f5f9;
  color: #1e293b;
  border: 1px solid #e2e8f0;
}

.btn.secondary:hover {
  background: #e2e8f0;
}
</style>
