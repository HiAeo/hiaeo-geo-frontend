<template>
  <div class="competitor-tracking-panel">
    <!-- Header -->
    <div class="panel-header">
      <h3 class="panel-title">竞品追踪</h3>
      <div class="panel-actions">
        <button class="btn btn-ghost" @click="refreshData" :disabled="loading">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"/>
            <polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
        </button>
        <button class="btn btn-primary btn-sm" @click="showAddModal = true" :disabled="loading">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          添加竞品
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <span>加载中...</span>
    </div>

    <!-- Competitors List -->
    <div v-else class="competitors-section">
      <div v-if="competitors.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 12h8"/>
          <path d="M12 8v8"/>
        </svg>
        <p>暂无竞品数据</p>
        <span>添加竞品网站开始追踪</span>
      </div>

      <div v-else class="competitors-list">
        <div 
          v-for="competitor in competitors" 
          :key="competitor.id"
          class="competitor-card"
        >
          <div class="competitor-info">
            <div class="competitor-icon">
              {{ competitor.name?.charAt(0) || 'C' }}
            </div>
            <div class="competitor-details">
              <h4 class="competitor-name">{{ competitor.name }}</h4>
              <a :href="competitor.url" target="_blank" class="competitor-url">
                {{ competitor.url }}
              </a>
            </div>
          </div>

          <div class="competitor-metrics">
            <div class="metric">
              <span class="metric-label">关键词覆盖</span>
              <span class="metric-value">{{ competitor.keywordOverlap || 0 }}%</span>
            </div>
            <div class="metric">
              <span class="metric-label">排名差距</span>
              <span class="metric-value" :class="{ positive: competitor.rankDiff > 0, negative: competitor.rankDiff < 0 }">
                {{ competitor.rankDiff > 0 ? '+' : '' }}{{ competitor.rankDiff || 0 }}
              </span>
            </div>
            <div class="metric">
              <span class="metric-label">内容评分</span>
              <span class="metric-value">{{ competitor.contentScore || '-' }}</span>
            </div>
          </div>

          <div class="competitor-actions">
            <button class="btn btn-outline btn-sm" @click="analyzeCompetitor(competitor)">
              分析
            </button>
            <button class="btn btn-outline btn-sm" @click="trackCompetitor(competitor)">
              追踪
            </button>
            <button class="btn btn-ghost btn-sm" @click="removeCompetitor(competitor.id)">
              删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Competitor Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>添加竞品</h3>
          <button class="modal-close" @click="showAddModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>竞品名称</label>
            <input v-model="newCompetitor.name" type="text" placeholder="输入竞品名称" />
          </div>
          <div class="form-group">
            <label>竞品网址</label>
            <input v-model="newCompetitor.url" type="url" placeholder="https://example.com" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showAddModal = false">
            取消
          </button>
          <button class="btn btn-primary" @click="addCompetitor" :disabled="adding">
            {{ adding ? '添加中...' : '添加' }}
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
  getCompetitorList,
  addCompetitor,
  removeCompetitor as apiRemoveCompetitor,
  trackCompetitor as apiTrackCompetitor,
  getCompetitorAnalysis,
} from '@/api/optimization'

export default {
  name: 'CompetitorTrackingPanel',
  props: {
    brandId: {
      type: String,
      default: null,
    },
    brandName: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    // 移除硬编码的 theme，继承父组件的 data-theme 设置
    const loading = ref(false)
    const adding = ref(false)
    const competitors = ref([])
    const showAddModal = ref(false)

    const newCompetitor = reactive({
      name: '',
      url: '',
    })

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

    const loadCompetitors = async () => {
      loading.value = true
      try {
        const name = props.brandName || props.brandId
        if (name) {
          const res = await getCompetitorList(name)
          if (res?.data) {
            competitors.value = res.data
          }
        }
      } catch (err) {
        console.error('加载竞品失败:', err)
        // 使用模拟数据
        competitors.value = []
      } finally {
        loading.value = false
      }
    }

    const refreshData = () => {
      loadCompetitors()
    }

    const addCompetitor = async () => {
      if (!newCompetitor.name || !newCompetitor.url) {
        showToast('请填写完整信息', 'error')
        return
      }

      adding.value = true
      try {
        const name = props.brandName || props.brandId
        await addCompetitor(name, newCompetitor.url)
        showToast('竞品添加成功', 'success')
        showAddModal.value = false
        newCompetitor.name = ''
        newCompetitor.url = ''
        await loadCompetitors()
      } catch (err) {
        console.error('添加竞品失败:', err)
        showToast('添加失败，请重试', 'error')
      } finally {
        adding.value = false
      }
    }

    const removeCompetitor = async (id) => {
      try {
        await apiRemoveCompetitor(id)
        showToast('已删除', 'success')
        await loadCompetitors()
      } catch (err) {
        console.error('删除竞品失败:', err)
        showToast('删除失败', 'error')
      }
    }

    const trackCompetitor = async (competitor) => {
      try {
        const brandName = props.brandName || props.brandId
        await apiTrackCompetitor(competitor.name, brandName)
        showToast('追踪已启动', 'success')
      } catch (err) {
        console.error('追踪失败:', err)
        showToast('追踪失败', 'error')
      }
    }

    const analyzeCompetitor = async (competitor) => {
      try {
        const brandName = props.brandName || props.brandId
        await getCompetitorAnalysis(competitor.name, brandName)
        showToast('分析完成', 'success')
      } catch (err) {
        console.error('分析失败:', err)
        showToast('分析失败', 'error')
      }
    }

    onMounted(() => {
      loadCompetitors()
    })

    return {
      loading,
      adding,
      competitors,
      showAddModal,
      newCompetitor,
      toast,
      loadCompetitors,
      refreshData,
      addCompetitor,
      removeCompetitor,
      trackCompetitor,
      analyzeCompetitor,
    }
  },
}
</script>

<style scoped>
.competitor-tracking-panel {
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

/* Competitors */
.competitors-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.competitor-card {
  padding: 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.2s;
}

.competitor-card:hover {
  border-color: var(--color-primary);
}

.competitor-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.competitor-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
}

.competitor-details {
  flex: 1;
}

.competitor-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.competitor-url {
  font-size: 0.8125rem;
  color: var(--color-primary);
  text-decoration: none;
}

.competitor-url:hover {
  text-decoration: underline;
}

.competitor-metrics {
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
  padding: 12px;
  background: var(--bg-primary);
  border-radius: 8px;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-label {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.metric-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.metric-value.positive {
  color: var(--color-success);
}

.metric-value.negative {
  color: var(--color-danger);
}

.competitor-actions {
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
  max-width: 420px;
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

.form-group {
  margin-bottom: 16px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
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
