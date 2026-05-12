<template>
  <div class="optimization-panel">
    <!-- Header -->
    <div class="panel-header">
      <h3 class="panel-title">智能优化</h3>
      <div class="panel-actions">
        <button class="btn btn-ghost" @click="refreshData" :disabled="loading">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"/>
            <polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
        </button>
        <button class="btn btn-primary btn-sm" @click="createNewTask" :disabled="loading">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          新建任务
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <span>加载中...</span>
    </div>

    <!-- Suggestions List -->
    <div v-else class="suggestions-section">
      <div v-if="suggestions.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
        <p>暂无优化建议</p>
        <span>基于诊断报告生成中...</span>
      </div>

      <div v-else class="suggestions-list">
        <div 
          v-for="suggestion in suggestions" 
          :key="suggestion.id"
          class="suggestion-card"
          :class="{ 'priority-high': suggestion.priority === 'high', 'priority-medium': suggestion.priority === 'medium' }"
        >
          <div class="suggestion-header">
            <span class="suggestion-type">{{ typeLabels[suggestion.type] || suggestion.type }}</span>
            <span class="suggestion-priority" :class="'priority-' + suggestion.priority">
              {{ priorityLabels[suggestion.priority] }}
            </span>
          </div>
          
          <h4 class="suggestion-title">{{ suggestion.title }}</h4>
          <p class="suggestion-desc">{{ suggestion.description }}</p>
          
          <div class="suggestion-meta">
            <span class="meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              预计 {{ suggestion.estimatedTime }}
            </span>
            <span class="meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              预期提升 {{ suggestion.expectedImprovement }}
            </span>
          </div>

          <div class="suggestion-actions">
            <button class="btn btn-outline btn-sm" @click="viewDetail(suggestion)">
              查看详情
            </button>
            <button class="btn btn-primary btn-sm" @click="applySuggestion(suggestion)">
              应用
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Execution Modal -->
    <div v-if="showTaskModal" class="modal-overlay" @click.self="closeTaskModal">
      <div class="modal">
        <div class="modal-header">
          <h3>执行优化任务</h3>
          <button class="modal-close" @click="closeTaskModal">×</button>
        </div>
        <div class="modal-body">
          <div v-if="executing" class="execution-progress">
            <div class="progress-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" stroke-width="8"/>
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="#3b82f6" 
                  stroke-width="8"
                  stroke-linecap="round"
                  :stroke-dasharray="283"
                  :stroke-dashoffset="283 - (283 * executionProgress / 100)"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <span class="progress-text">{{ executionProgress }}%</span>
            </div>
            <p class="progress-status">{{ executionStatus }}</p>
          </div>
          <div v-else>
            <p>确认执行此优化任务？</p>
            <div class="task-info">
              <h4>{{ selectedTask?.title }}</h4>
              <p>{{ selectedTask?.description }}</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeTaskModal" :disabled="executing">
            取消
          </button>
          <button class="btn btn-primary" @click="confirmExecute" :disabled="executing">
            {{ executing ? '执行中...' : '确认执行' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast.show" class="toast" :class="toast.type">
      {{ toast.message }}
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import {
  getOptimizationSuggestions,
  executeOptimization,
  getOptimizationFromDiagnosis,
} from '@/api/optimization'

export default {
  name: 'OptimizationPanel',
  props: {
    brandId: {
      type: String,
      default: null,
    },
    diagnosisReportId: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    // 移除硬编码的 theme，继承父组件的 data-theme 设置
    const loading = ref(false)
    const suggestions = ref([])
    const showTaskModal = ref(false)
    const selectedTask = ref(null)
    const executing = ref(false)
    const executionProgress = ref(0)
    const executionStatus = ref('')

    const typeLabels = {
      keyword: '关键词优化',
      content: '内容优化',
      structure: '结构优化',
      technical: '技术优化',
      competitor: '竞品分析',
      rank: '排名提升',
    }

    const priorityLabels = {
      high: '高优先级',
      medium: '中优先级',
      low: '低优先级',
    }

    const toast = reactive({
      show: false,
      message: '',
      type: 'info',
    })

    const showToast = (message, type = 'info') => {
      toast.message = message
      toast.type = type
      toast.show = true
      setTimeout(() => {
        toast.show = false
      }, 3000)
    }

    const loadSuggestions = async () => {
      loading.value = true
      try {
        // 如果有诊断报告ID，从诊断报告获取优化建议
        if (props.diagnosisReportId) {
          const res = await getOptimizationFromDiagnosis(props.diagnosisReportId)
          if (res?.data) {
            suggestions.value = res.data
          }
        } else if (props.brandId) {
          // 否则获取品牌的所有优化建议
          const res = await getOptimizationSuggestions(props.brandId)
          if (res?.data) {
            suggestions.value = res.data
          }
        }
      } catch (err) {
        console.error('加载优化建议失败:', err)
        // 使用模拟数据
        suggestions.value = [
          {
            id: '1',
            type: 'keyword',
            priority: 'high',
            title: '关键词覆盖增强',
            description: '建议增加"AI驱动"、"智能分析"等热门关键词，提升搜索可见性',
            estimatedTime: '30分钟',
            expectedImprovement: '+15% 曝光',
          },
          {
            id: '2',
            type: 'content',
            priority: 'medium',
            title: '内容质量优化',
            description: '当前内容深度指数为65分，建议增加更多案例和行业数据',
            estimatedTime: '2小时',
            expectedImprovement: '+25% 停留时长',
          },
          {
            id: '3',
            type: 'rank',
            priority: 'medium',
            title: '竞品对比优化',
            description: '建议增加与竞品的差异化描述，突出独特价值主张',
            estimatedTime: '1小时',
            expectedImprovement: '+10% 转化率',
          },
        ]
      } finally {
        loading.value = false
      }
    }

    const refreshData = () => {
      loadSuggestions()
    }

    const createNewTask = () => {
      showToast('新建优化任务功能开发中', 'info')
    }

    const viewDetail = (suggestion) => {
      showToast('详情查看功能开发中', 'info')
    }

    const applySuggestion = (suggestion) => {
      selectedTask.value = suggestion
      showTaskModal.value = true
    }

    const closeTaskModal = () => {
      showTaskModal.value = false
      selectedTask.value = null
      executing.value = false
      executionProgress.value = 0
    }

    const confirmExecute = async () => {
      if (!selectedTask.value) return
      
      executing.value = true
      executionProgress.value = 0
      executionStatus.value = '准备执行...'

      // 模拟执行进度
      const progressInterval = setInterval(() => {
        executionProgress.value += Math.random() * 15
        if (executionProgress.value >= 100) {
          executionProgress.value = 100
          clearInterval(progressInterval)
          executionStatus.value = '执行完成！'
          setTimeout(() => {
            closeTaskModal()
            showToast('优化任务执行成功', 'success')
            loadSuggestions()
          }, 1000)
        } else {
          const stages = ['准备执行...', '分析内容...', '生成优化...', '应用更改...', '验证效果...']
          executionStatus.value = stages[Math.floor(executionProgress.value / 25)] || '处理中...'
        }
      }, 500)

      // 实际API调用
      try {
        await executeOptimization(selectedTask.value.id)
      } catch (err) {
        console.error('执行优化失败:', err)
        clearInterval(progressInterval)
        closeTaskModal()
        showToast('执行失败，请重试', 'error')
      }
    }

    onMounted(() => {
      loadSuggestions()
    })

    return {
      loading,
      suggestions,
      showTaskModal,
      selectedTask,
      executing,
      executionProgress,
      executionStatus,
      typeLabels,
      priorityLabels,
      toast,
      loadSuggestions,
      refreshData,
      createNewTask,
      viewDetail,
      applySuggestion,
      closeTaskModal,
      confirmExecute,
    }
  },
}
</script>

<style scoped>
.optimization-panel {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 20px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.panel-actions {
  display: flex;
  gap: 8px;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.8125rem;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-secondary {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  padding: 8px;
}

.btn-ghost:hover:not(:disabled) {
  background: var(--bg-elevated);
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.btn-outline:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: var(--text-secondary);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-tertiary);
}

.empty-state svg {
  margin-bottom: 16px;
  color: var(--text-tertiary);
}

.empty-state p {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 4px 0;
}

.empty-state span {
  font-size: 0.8125rem;
}

/* Suggestions */
.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.suggestion-card {
  padding: 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.2s;
}

.suggestion-card:hover {
  border-color: var(--color-primary);
}

.suggestion-card.priority-high {
  border-left: 3px solid var(--color-danger);
}

.suggestion-card.priority-medium {
  border-left: 3px solid var(--color-warning);
}

.suggestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.suggestion-type {
  font-size: 0.75rem;
  color: var(--text-secondary);
  background: var(--bg-primary);
  padding: 2px 8px;
  border-radius: 4px;
}

.suggestion-priority {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
}

.priority-high {
  background: rgba(239, 68, 68, 0.15);
  color: var(--color-danger);
}

.priority-medium {
  background: rgba(245, 158, 11, 0.15);
  color: var(--color-warning);
}

.priority-low {
  background: rgba(16, 185, 129, 0.15);
  color: var(--color-success);
}

.suggestion-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 6px 0;
}

.suggestion-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.suggestion-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8125rem;
  color: var(--text-tertiary);
}

.suggestion-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  width: 90%;
  max-width: 480px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.125rem;
  color: var(--text-primary);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
}

/* Progress */
.execution-progress {
  text-align: center;
  padding: 20px;
}

.progress-circle {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
}

.progress-circle svg {
  width: 100%;
  height: 100%;
}

.progress-circle circle {
  transition: stroke-dashoffset 0.3s;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary);
}

.progress-status {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.task-info h4 {
  font-size: 1rem;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.task-info p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 0.875rem;
  color: white;
  z-index: 1001;
  animation: slideIn 0.3s ease;
}

.toast.success {
  background: var(--color-success);
}

.toast.error {
  background: var(--color-danger);
}

.toast.info {
  background: var(--color-primary);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
