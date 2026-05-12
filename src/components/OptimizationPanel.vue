<template>
  <div class="optimization-panel">
    <div class="panel-header">
      <h3>自动优化建议</h3>
      <div class="header-actions">
        <button class="btn-refresh" @click="analyze" :disabled="loading">
          {{ loading ? '分析中...' : '重新分析' }}
        </button>
      </div>
    </div>

    <!-- 统计概览 -->
    <div v-if="analysis" class="stats-overview">
      <div class="stat-card">
        <div class="stat-value">{{ analysis.suggestions.length }}</div>
        <div class="stat-label">总建议</div>
      </div>
      <div class="stat-card critical">
        <div class="stat-value">{{ analysis.summary.byPriority.critical || 0 }}</div>
        <div class="stat-label">紧急</div>
      </div>
      <div class="stat-card high">
        <div class="stat-value">{{ analysis.summary.byPriority.high || 0 }}</div>
        <div class="stat-label">高优</div>
      </div>
      <div class="stat-card auto">
        <div class="stat-value">{{ analysis.autoExecutableCount }}</div>
        <div class="stat-label">可自动</div>
      </div>
    </div>

    <!-- 筛选 -->
    <div class="filters">
      <select v-model="filterType" class="filter-select">
        <option value="">全部类型</option>
        <option value="keyword">关键词优化</option>
        <option value="content">内容优化</option>
        <option value="technical">技术优化</option>
        <option value="competitor">竞品分析</option>
        <option value="local">本地 SEO</option>
      </select>
      <select v-model="filterPriority" class="filter-select">
        <option value="">全部优先级</option>
        <option value="critical">紧急</option>
        <option value="high">高</option>
        <option value="medium">中</option>
        <option value="low">低</option>
      </select>
      <select v-model="filterStatus" class="filter-select">
        <option value="">全部状态</option>
        <option value="pending">待处理</option>
        <option value="approved">已批准</option>
        <option value="in_progress">执行中</option>
        <option value="completed">已完成</option>
      </select>
    </div>

    <!-- 建议列表 -->
    <div class="suggestions-list">
      <div 
        v-for="suggestion in filteredSuggestions" 
        :key="suggestion.id"
        :class="['suggestion-card', `priority-${suggestion.priority}`, `status-${suggestion.status}`]"
      >
        <div class="suggestion-header">
          <span :class="['priority-badge', suggestion.priority]">
            {{ getPriorityText(suggestion.priority) }}
          </span>
          <span :class="['type-badge', suggestion.type]">
            {{ getTypeText(suggestion.type) }}
          </span>
          <span v-if="suggestion.autoExecutable" class="auto-badge">
            可自动
          </span>
        </div>

        <h4 class="suggestion-title">{{ suggestion.title }}</h4>
        <p class="suggestion-desc">{{ suggestion.description }}</p>

        <div class="suggestion-meta">
          <div class="meta-item">
            <span class="label">预期效果：</span>
            <span class="value">{{ suggestion.expectedImpact }}</span>
          </div>
          <div class="meta-item">
            <span class="label">预估工作量：</span>
            <span class="value">{{ suggestion.estimatedEffort }}</span>
          </div>
        </div>

        <div class="suggestion-actions">
          <button 
            v-if="suggestion.status === 'pending' && suggestion.autoExecutable"
            class="btn-execute"
            @click="handleExecute(suggestion)"
            :disabled="executing === suggestion.id"
          >
            {{ executing === suggestion.id ? '执行中...' : '自动执行' }}
          </button>
          <button 
            v-if="suggestion.status === 'pending'"
            class="btn-approve"
            @click="handleApprove(suggestion)"
          >
            批准
          </button>
          <button 
            class="btn-dismiss"
            @click="handleDismiss(suggestion)"
          >
            忽略
          </button>
          <button 
            class="btn-details"
            @click="showDetails(suggestion)"
          >
            详情
          </button>
        </div>

        <!-- 执行进度 -->
        <div v-if="executing === suggestion.id" class="execution-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: executeProgress + '%' }"></div>
          </div>
          <span class="progress-text">{{ executeProgress }}%</span>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && filteredSuggestions.length === 0" class="empty-state">
        <div class="empty-icon">✨</div>
        <p>暂无优化建议</p>
        <p class="empty-hint">品牌状态良好，或点击上方按钮重新分析</p>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="detailsVisible" class="details-modal-overlay" @click.self="closeDetails">
      <div class="details-modal">
        <div class="modal-header">
          <h3>{{ selectedSuggestion?.title }}</h3>
          <button class="btn-close" @click="closeDetails">×</button>
        </div>
        <div class="modal-body">
          <div class="detail-section">
            <h4>问题描述</h4>
            <p>{{ selectedSuggestion?.description }}</p>
          </div>
          <div class="detail-section">
            <h4>优化依据</h4>
            <p>{{ selectedSuggestion?.rationale }}</p>
          </div>
          <div class="detail-section">
            <h4>预期效果</h4>
            <p>{{ selectedSuggestion?.expectedImpact }}</p>
          </div>
          <div class="detail-section">
            <h4>预估工作量</h4>
            <p>{{ selectedSuggestion?.estimatedEffort }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  analyzeBrand,
  getOptimizationSuggestions,
  updateSuggestionStatus,
  executeSuggestion as executeOptimization
} from '@/api/optimization.js'

const props = defineProps({
  brandId: {
    type: String,
    required: true
  }
})

// 状态
const loading = ref(false)
const analysis = ref(null)
const suggestions = ref([])
const executing = ref(null)
const executeProgress = ref(0)
const detailsVisible = ref(false)
const selectedSuggestion = ref(null)

// 筛选
const filterType = ref('')
const filterPriority = ref('')
const filterStatus = ref('')

// 计算属性
const filteredSuggestions = computed(() => {
  return suggestions.value.filter(s => {
    if (filterType.value && s.type !== filterType.value) return false
    if (filterPriority.value && s.priority !== filterPriority.value) return false
    if (filterStatus.value && s.status !== filterStatus.value) return false
    return true
  })
})

// 方法
async function analyze() {
  loading.value = true
  try {
    const result = await analyzeBrand(props.brandId)
    if (result.suggestions) {
      analysis.value = result
      suggestions.value = result.suggestions
    }
  } catch (error) {
    console.error('分析失败', error)
  } finally {
    loading.value = false
  }
}

async function loadSuggestions() {
  try {
    const result = await getOptimizationSuggestions(props.brandId)
    if (Array.isArray(result)) {
      suggestions.value = result
    }
  } catch (error) {
    console.error('加载建议失败', error)
  }
}

async function handleExecute(suggestion) {
  executing.value = suggestion.id
  executeProgress.value = 0
  
  // 模拟进度
  const interval = setInterval(() => {
    executeProgress.value += 10
    if (executeProgress.value >= 100) {
      clearInterval(interval)
    }
  }, 200)
  
  try {
    const result = await executeOptimization(suggestion.id)
    if (result.success) {
      suggestion.status = 'completed'
    }
  } catch (error) {
    console.error('执行失败', error)
  } finally {
    executing.value = null
    executeProgress.value = 0
  }
}

async function handleApprove(suggestion) {
  try {
    await updateSuggestionStatus(suggestion.id, 'approved')
    suggestion.status = 'approved'
  } catch (error) {
    console.error('批准失败', error)
  }
}

async function handleDismiss(suggestion) {
  try {
    await updateSuggestionStatus(suggestion.id, 'dismissed')
    suggestion.status = 'dismissed'
  } catch (error) {
    console.error('忽略失败', error)
  }
}

function showDetails(suggestion) {
  selectedSuggestion.value = suggestion
  detailsVisible.value = true
}

function closeDetails() {
  detailsVisible.value = false
  selectedSuggestion.value = null
}

function getPriorityText(priority) {
  const texts = {
    critical: '紧急',
    high: '高',
    medium: '中',
    low: '低',
  }
  return texts[priority] || priority
}

function getTypeText(type) {
  const texts = {
    keyword: '关键词',
    content: '内容',
    technical: '技术',
    competitor: '竞品',
    local: '本地',
    link: '链接',
  }
  return texts[type] || type
}

// 初始化
onMounted(async () => {
  await loadSuggestions()
})
</script>

<style scoped>
.optimization-panel {
  padding: 16px;
  background: #fff;
  border-radius: 12px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.panel-header h3 {
  margin: 0;
  font-size: 18px;
}

.btn-refresh {
  padding: 8px 16px;
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-refresh:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat-card {
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  text-align: center;
}

.stat-card.critical .stat-value { color: #ef4444; }
.stat-card.high .stat-value { color: #f59e0b; }
.stat-card.auto .stat-value { color: #10b981; }

.stat-value {
  font-size: 24px;
  font-weight: 600;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
}

.filters {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.filter-select {
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.suggestion-card {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #e2e8f0;
}

.suggestion-card.priority-critical { border-left-color: #ef4444; }
.suggestion-card.priority-high { border-left-color: #f59e0b; }
.suggestion-card.priority-medium { border-left-color: #3b82f6; }
.suggestion-card.priority-low { border-left-color: #94a3b8; }

.suggestion-card.status-completed {
  opacity: 0.6;
}

.suggestion-header {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.priority-badge, .type-badge, .auto-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.priority-badge.critical { background: #fee2e2; color: #dc2626; }
.priority-badge.high { background: #fef3c7; color: #d97706; }
.priority-badge.medium { background: #dbeafe; color: #2563eb; }
.priority-badge.low { background: #f1f5f9; color: #64748b; }

.type-badge { background: #f1f5f9; color: #475569; }
.auto-badge { background: #d1fae5; color: #059669; }

.suggestion-title {
  margin: 0 0 8px;
  font-size: 15px;
}

.suggestion-desc {
  margin: 0 0 12px;
  font-size: 13px;
  color: #64748b;
}

.suggestion-meta {
  margin-bottom: 12px;
}

.meta-item {
  font-size: 12px;
  margin-bottom: 4px;
}

.meta-item .label {
  color: #94a3b8;
}

.suggestion-actions {
  display: flex;
  gap: 8px;
}

.suggestion-actions button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.btn-execute { background: #10b981; color: #fff; }
.btn-approve { background: #3b82f6; color: #fff; }
.btn-dismiss { background: #e2e8f0; color: #64748b; }
.btn-details { background: #f1f5f9; color: #475569; }

.execution-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
}

.progress-fill {
  height: 100%;
  background: #10b981;
  transition: width 0.3s;
}

.progress-text {
  font-size: 12px;
  color: #64748b;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #64748b;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

/* 详情弹窗 */
.details-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.details-modal {
  background: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
}

.btn-close {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
}

.modal-body {
  padding: 16px;
}

.detail-section {
  margin-bottom: 16px;
}

.detail-section h4 {
  margin: 0 0 8px;
  font-size: 13px;
  color: #64748b;
}

.detail-section p {
  margin: 0;
}
</style>
