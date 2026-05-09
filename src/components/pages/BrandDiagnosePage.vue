<template>
  <div class="brand-diagnose" :data-theme="theme">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">模镜 MiraSeek · AI可见度诊断</h1>
          <span class="page-subtitle">实时抓取 DeepSeek、豆包、Kimi 等主流大模型的回答数据，精准量化实体独占率与替代风险指数</span>
        </div>
        <div class="header-actions">
          <button class="primary-btn" @click="showCreateModal = true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            新建诊断
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-section">
      <div class="loading-spinner"></div>
      <p>加载诊断数据...</p>
    </div>

    <!-- Stats -->
    <div v-else class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon total">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.total }}</span>
            <span class="stat-label">总报告数</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon completed">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.completed }}</span>
            <span class="stat-label">已完成</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon running">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.running }}</span>
            <span class="stat-label">进行中</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon score">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ latestScore || '-' }}</span>
            <span class="stat-label">最新得分</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Reports List -->
    <div class="reports-section">
      <div class="reports-header">
        <h2 class="section-title">诊断历史</h2>
        <div class="filter-tabs">
          <button :class="{ active: filter === 'all' }" @click="filter = 'all'">全部</button>
          <button :class="{ active: filter === 'completed' }" @click="filter = 'completed'">已完成</button>
          <button :class="{ active: filter === 'running' }" @click="filter = 'running'">进行中</button>
        </div>
      </div>

      <div class="reports-list">
        <div v-for="report in filteredReports" :key="report.id" class="report-card" @click="viewReport(report)">
          <div class="report-main">
            <div class="report-score-circle" :class="'score-' + getScoreClass(report.score)">
              <span class="score-num">{{ report.score || '-' }}</span>
              <span class="score-label">分</span>
            </div>
            <div class="report-info">
              <div class="report-brand">
                {{ report.brandName }}
                <span v-if="report.engineLogo" class="engine-badge">{{ report.engineLogo }}</span>
              </div>
              <div class="report-meta">
                <span v-if="report.engineName" class="report-engine">{{ report.engineName }}</span>
                <span class="report-type">{{ report.type }}</span>
                <span class="report-date">{{ formatDate(report.date) }}</span>
              </div>
              <div class="report-status" :class="'status-' + report.status">
                {{ getStatusLabel(report.status) }}
              </div>
            </div>
          </div>
          <div class="report-actions">
            <button v-if="report.status === 'completed'" class="action-btn" @click.stop="viewReport(report)">
              查看详情
            </button>
            <button v-else-if="report.status === 'running'" class="action-btn running" @click.stop="checkProgress(report)">
              查看进度
            </button>
          </div>
        </div>

        <div v-if="!loading && filteredReports.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          <p>暂无诊断记录</p>
          <button class="primary-btn" @click="showCreateModal = true">开始第一次诊断</button>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>新建品牌诊断</h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>品牌名称 <span class="required">*</span></label>
            <input v-model="newTask.brandName" type="text" placeholder="输入品牌名称" />
          </div>
          <div class="form-group">
            <label>诊断类型</label>
            <div class="type-options">
              <button :class="{ active: newTask.type === 'full' }" @click="newTask.type = 'full'">
                <strong>完整诊断</strong>
                <span>包含所有维度分析</span>
              </button>
              <button :class="{ active: newTask.type === 'quick' }" @click="newTask.type = 'quick'">
                <strong>快速诊断</strong>
                <span>3分钟快速评估</span>
              </button>
              <button :class="{ active: newTask.type === 'competitor' }" @click="newTask.type = 'competitor'">
                <strong>竞品对比</strong>
                <span>与竞品对比分析</span>
              </button>
            </div>
          </div>
          <div class="form-group">
            <label>选择 AI 引擎</label>
            <div class="engine-grid">
              <button
                v-for="engine in availableEngines"
                :key="engine.id"
                :class="{ active: selectedEngines.includes(engine.id) }"
                @click="toggleEngine(engine.id)"
                class="engine-btn"
              >
                <img v-if="engine.logoUrl" :src="engine.logoUrl" :alt="engine.name" class="engine-logo-img" />
                <span v-else class="engine-logo">{{ engine.logo }}</span>
                <span class="engine-name">{{ engine.name }}</span>
              </button>
            </div>
            <p class="engine-hint" v-if="selectedEngines.length === 0">至少选择一个 AI 引擎</p>
          </div>
          <div class="form-group">
            <label>品牌描述（可选）</label>
            <textarea v-model="newTask.description" placeholder="描述品牌的特点、定位、目标用户等..." rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>品牌官网（可选）</label>
            <input v-model="newTask.website" type="url" placeholder="https://example.com" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="closeModal">取消</button>
          <button
            class="primary-btn"
            @click="createTask"
            :disabled="!canCreateTask || creating"
          >
            <span v-if="creating" class="btn-spinner"></span>
            {{ creating ? '诊断中...' : '开始诊断' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '../../composables/useApi'
import { useTheme } from '../../composables/useTheme'

// 使用全局主题状态
const { theme } = useTheme()

const router = useRouter()
const { getAIEngines, diagnoseWithAI, diagnoseWithMultipleAI } = useApi()

// State
const loading = ref(true)
const creating = ref(false)
const showCreateModal = ref(false)
const filter = ref('all')
const latestScore = ref(null)
const availableEngines = ref([])
const selectedEngines = ref(['deepseek'])

const stats = ref({
  total: 0,
  completed: 0,
  running: 0
})

const reports = ref([])

const newTask = ref({
  brandName: '',
  type: 'full',
  description: '',
  website: ''
})

// Computed
const canCreateTask = computed(() => {
  return newTask.value.brandName.trim() && selectedEngines.value.length > 0
})

const filteredReports = computed(() => {
  if (filter.value === 'all') return reports.value
  if (filter.value === 'completed') return reports.value.filter(r => r.status === 'completed')
  if (filter.value === 'running') return reports.value.filter(r => r.status === 'running')
  return reports.value
})

// Methods
const getScoreClass = (score) => {
  if (!score) return 'none'
  if (score >= 85) return 'high'
  if (score >= 70) return 'mid'
  return 'low'
}

const getStatusLabel = (status) => {
  const labels = { completed: '已完成', running: '进行中', pending: '待处理', failed: '失败' }
  return labels[status] || status
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

const toggleEngine = (engineId) => {
  const index = selectedEngines.value.indexOf(engineId)
  if (index === -1) {
    selectedEngines.value.push(engineId)
  } else if (selectedEngines.value.length > 1) {
    selectedEngines.value.splice(index, 1)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  newTask.value = { brandName: '', type: 'full', description: '', website: '' }
}

const viewReport = (report) => {
  router.push(`/app/diagnose/${report.id}`)
}

const checkProgress = (report) => {
  router.push(`/app/diagnose/${report.id}`)
}

const createTask = async () => {
  if (!canCreateTask.value) return

  creating.value = true
  const brandData = {
    name: newTask.value.brandName,
    description: newTask.value.description,
    website: newTask.value.website,
    type: newTask.value.type,
  }

  try {
    let results = []

    if (selectedEngines.value.length === 1) {
      const result = await diagnoseWithAI(selectedEngines.value[0], brandData)
      results = [result]
    } else {
      results = await diagnoseWithMultipleAI(selectedEngines.value, brandData)
    }

    results.forEach(result => {
      const newReport = {
        id: `local_${Date.now()}_${result.engineId}`,
        brandName: newTask.value.brandName,
        type: newTask.value.type === 'full' ? '完整诊断' : newTask.value.type === 'quick' ? '快速诊断' : '竞品对比',
        engineName: result.engineName,
        engineLogo: result.engineLogo,
        score: result.overallScore,
        status: 'completed',
        date: result.timestamp,
        result: result
      }
      reports.value.unshift(newReport)
    })

    saveReports()
    updateStats()
    closeModal()

    if (results.length === 1) {
      router.push(`/app/diagnose/${reports.value[0].id}`)
    }

  } catch (error) {
    console.error('诊断失败:', error)
    alert('诊断失败，请重试: ' + error.message)
  } finally {
    creating.value = false
  }
}

const saveReports = () => {
  localStorage.setItem('diagnose_reports', JSON.stringify(reports.value))
}

const updateStats = () => {
  stats.value = {
    total: reports.value.length,
    completed: reports.value.filter(r => r.status === 'completed').length,
    running: reports.value.filter(r => r.status === 'running').length
  }

  const completedReports = reports.value.filter(r => r.status === 'completed' && r.score)
  if (completedReports.length > 0) {
    latestScore.value = completedReports[0].score
  }
}

const loadData = async () => {
  loading.value = true
  try {
    const engines = await getAIEngines()
    availableEngines.value = engines.filter(e => e.status === 'available')

    const savedReports = localStorage.getItem('diagnose_reports')
    if (savedReports) {
      reports.value = JSON.parse(savedReports)
      updateStats()
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.brand-diagnose { min-height: 100vh; padding-bottom: 40px; background: var(--bg-primary); }

/* 统一页面头部 */
.page-header {
  position: sticky; top: 0; z-index: 50;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  padding: 20px 24px;
}

.header-content {
  display: flex; align-items: flex-start; justify-content: space-between;
  max-width: 1400px; margin: 0 auto;
}

.header-left { flex: 1; }
.header-actions { display: flex; gap: 12px; align-items: flex-start; }

.page-title { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin: 0; }
.page-subtitle { font-size: 0.875rem; color: var(--text-secondary); margin-top: 4px; line-height: 1.5; }

/* 统一按钮样式 */
.primary-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 18px; background: var(--color-primary); color: white;
  border: none; border-radius: 10px; font-size: 0.875rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s ease;
}
.primary-btn:hover { background: var(--color-primary-hover); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(22, 93, 255, 0.3); }
.primary-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.secondary-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 18px; background: var(--bg-elevated); color: var(--text-primary);
  border: 1px solid var(--border-color); border-radius: 10px; font-size: 0.875rem;
  font-weight: 600; cursor: pointer; transition: all 0.2s ease;
}
.secondary-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }

.btn-sm { padding: 6px 12px; font-size: 0.8125rem; }

.loading-section {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 80px 24px; gap: 16px;
}

.loading-spinner {
  width: 40px; height: 40px; border: 3px solid var(--border-color);
  border-top-color: var(--color-primary); border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.stats-section { max-width: 1400px; margin: 0 auto; padding: 24px; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
@media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }

.stat-card {
  background: var(--bg-elevated); border: 1px solid var(--border-color);
  border-radius: 16px; padding: 20px; display: flex; gap: 16px;
}

.stat-icon {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.stat-icon.total { background: rgba(99, 102, 241, 0.15); color: var(--color-primary); }
.stat-icon.completed { background: rgba(16, 185, 129, 0.15); color: var(--color-success); }
.stat-icon.running { background: rgba(245, 158, 11, 0.15); color: var(--color-warning); }
.stat-icon.score { background: rgba(139, 92, 246, 0.15); color: var(--color-secondary); }

.stat-content { display: flex; flex-direction: column; }
.stat-value { font-size: 1.5rem; font-weight: 700; }
.stat-label { font-size: 0.8125rem; color: var(--text-secondary); margin-top: 2px; }

.reports-section { max-width: 1400px; margin: 0 auto; padding: 0 24px 24px; }
.reports-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.section-title { font-size: 1rem; font-weight: 700; }

.filter-tabs { display: flex; gap: 4px; background: var(--bg-elevated); border: 1px solid var(--border-color); padding: 4px; border-radius: 10px; }
.filter-tabs button { padding: 6px 14px; font-size: 0.8125rem; border: none; background: transparent; color: var(--text-secondary); border-radius: 8px; cursor: pointer; transition: all 0.2s; }
.filter-tabs button.active { background: var(--color-primary); color: white; }

.reports-list { display: flex; flex-direction: column; gap: 12px; }

.report-card {
  background: var(--bg-elevated); border: 1px solid var(--border-color);
  border-radius: 16px; padding: 20px; cursor: pointer;
  display: flex; align-items: center; justify-content: space-between;
  transition: all 0.2s;
}
.report-card:hover { border-color: var(--color-primary); transform: translateY(-1px); }

.report-main { display: flex; align-items: center; gap: 20px; flex: 1; }

.report-score-circle {
  width: 64px; height: 64px; border-radius: 50%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  flex-shrink: 0; border: 3px solid;
}
.report-score-circle.score-high { border-color: var(--color-success); background: rgba(16, 185, 129, 0.1); color: var(--color-success); }
.report-score-circle.score-mid { border-color: var(--color-primary); background: rgba(99, 102, 241, 0.1); color: var(--color-primary); }
.report-score-circle.score-low { border-color: var(--color-warning); background: rgba(245, 158, 11, 0.1); color: var(--color-warning); }
.report-score-circle.score-none { border-color: var(--border-color); color: var(--text-tertiary); }

.score-num { font-size: 1.25rem; font-weight: 800; line-height: 1; }
.score-label { font-size: 0.625rem; }

.report-info { display: flex; flex-direction: column; gap: 4px; }
.report-brand { font-size: 1rem; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 8px; }
.engine-badge { font-size: 0.875rem; }
.report-meta { display: flex; gap: 12px; font-size: 0.8125rem; color: var(--text-secondary); }
.report-engine { color: var(--color-primary); }
.report-status {
  display: inline-flex; padding: 3px 10px; border-radius: 4px; font-size: 0.75rem; width: fit-content;
}
.report-status.status-completed { background: rgba(16, 185, 129, 0.15); color: var(--color-success); }
.report-status.status-running { background: rgba(245, 158, 11, 0.15); color: var(--color-warning); }

.report-actions { display: flex; gap: 8px; }
.action-btn { padding: 8px 16px; border-radius: 8px; font-size: 0.8125rem; font-weight: 600; cursor: pointer; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); transition: all 0.2s; }
.action-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }
.action-btn.running { border-color: var(--color-warning); color: var(--color-warning); }

.empty-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px; color: var(--text-tertiary); text-align: center; }
.empty-state p { font-size: 0.9375rem; color: var(--text-secondary); }

.primary-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 16px; background: var(--color-primary); color: white;
  border: none; border-radius: 10px; font-size: 0.875rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.primary-btn:hover { opacity: 0.9; }
.primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.secondary-btn {
  padding: 10px 16px; background: var(--bg-elevated); color: var(--text-primary);
  border: 1px solid var(--border-color); border-radius: 10px; font-size: 0.875rem;
  font-weight: 600; cursor: pointer;
}

.btn-spinner {
  width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white; border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); padding: 20px; }
.modal-content { background: var(--bg-elevated); border-radius: 20px; width: 560px; max-width: 90vw; max-height: 90vh; display: flex; flex-direction: column; border: 1px solid var(--border-color); }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid var(--border-color); }
.modal-header h3 { font-size: 1rem; font-weight: 700; }
.close-btn { background: none; border: none; font-size: 1.5rem; color: var(--text-secondary); cursor: pointer; }
.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; overflow-y: auto; flex: 1; }
.modal-footer { padding: 16px 24px; border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end; gap: 8px; flex-shrink: 0; }

.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); }
.form-group .required { color: var(--color-danger); }
.form-group input, .form-group textarea { padding: 10px 14px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 10px; font-size: 0.875rem; color: var(--text-primary); outline: none; transition: border-color 0.2s; }
.form-group input:focus, .form-group textarea:focus { border-color: var(--color-primary); }
.form-group textarea { resize: vertical; }

.type-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.type-options button { padding: 12px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 10px; cursor: pointer; display: flex; flex-direction: column; gap: 4px; text-align: left; transition: all 0.2s; }
.type-options button.active { border-color: var(--color-primary); background: rgba(99, 102, 241, 0.1); }
.type-options button strong { font-size: 0.8125rem; color: var(--text-primary); }
.type-options button span { font-size: 0.6875rem; color: var(--text-secondary); }

.engine-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.engine-btn { padding: 12px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 10px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px; transition: all 0.2s; }
.engine-btn.active { border-color: var(--color-primary); background: rgba(99, 102, 241, 0.1); }
.engine-logo { font-size: 1.5rem; }
.engine-logo-img { width: 32px; height: 32px; object-fit: contain; }
.engine-name { font-size: 0.75rem; color: var(--text-secondary); }
.engine-hint { font-size: 0.75rem; color: var(--text-tertiary); margin-top: 4px; }
</style>
