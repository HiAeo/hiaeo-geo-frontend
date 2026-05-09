<template>
  <div class="diagnose-page" :data-theme="theme">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">诊断报告</h1>
        <div class="header-actions">
          <button class="primary-btn" @click="showCreateModal = true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            新建诊断
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon total">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
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
          <div class="stat-icon avg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.avgScore }}</span>
            <span class="stat-label">平均评分</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="search-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索目标 URL 或名称..."
        />
      </div>
      <div class="filter-group">
        <select v-model="statusFilter">
          <option value="">全部状态</option>
          <option value="completed">已完成</option>
          <option value="running">进行中</option>
          <option value="pending">等待中</option>
          <option value="failed">失败</option>
        </select>
        <select v-model="sortBy">
          <option value="newest">最新优先</option>
          <option value="oldest">最旧优先</option>
          <option value="score">评分优先</option>
        </select>
      </div>
    </div>

    <!-- Reports Table -->
    <div class="table-section">
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>目标</th>
              <th>行业</th>
              <th>评分</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in filteredReports" :key="report.id">
              <td>
                <div class="target-cell">
                  <span class="target-name">{{ report.targetName }}</span>
                  <span class="target-url">{{ report.targetUrl }}</span>
                </div>
              </td>
              <td>
                <span class="industry-tag">{{ report.targetIndustry }}</span>
              </td>
              <td>
                <div class="score-cell">
                  <span class="score-value" :class="getScoreClass(report.seoScore?.overall)">
                    {{ report.seoScore?.overall || '--' }}
                  </span>
                  <span class="score-max">/100</span>
                </div>
              </td>
              <td>
                <span class="status-badge" :class="report.status">
                  {{ getStatusLabel(report.status) }}
                </span>
              </td>
              <td>
                <span class="time-text">{{ formatDate(report.createdAt) }}</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    class="action-btn view" 
                    @click="viewReport(report)"
                    :disabled="report.status === 'pending'"
                    title="查看详情"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                  <button 
                    class="action-btn refresh" 
                    @click="refreshReport(report)"
                    title="重新诊断"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="23 4 23 10 17 10"/>
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                    </svg>
                  </button>
                  <button 
                    class="action-btn delete" 
                    @click="deleteReport(report)"
                    title="删除"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="filteredReports.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <p>暂无诊断报告</p>
          <button class="primary-btn" @click="showCreateModal = true">创建第一个诊断</button>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal create-modal">
        <div class="modal-header">
          <h2>新建诊断</h2>
          <button class="close-btn" @click="showCreateModal = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>目标网站 URL</label>
            <input 
              type="url" 
              v-model="newReport.targetUrl" 
              placeholder="https://example.com"
              :class="{ error: formErrors.targetUrl }"
            />
            <span v-if="formErrors.targetUrl" class="error-text">{{ formErrors.targetUrl }}</span>
          </div>
          <div class="form-group">
            <label>目标名称</label>
            <input 
              type="text" 
              v-model="newReport.targetName" 
              placeholder="我的网站"
            />
          </div>
          <div class="form-group">
            <label>所属行业</label>
            <select v-model="newReport.targetIndustry">
              <option value="">请选择行业</option>
              <option value="technology">科技/软件</option>
              <option value="ecommerce">电子商务</option>
              <option value="education">教育</option>
              <option value="healthcare">医疗健康</option>
              <option value="finance">金融/保险</option>
              <option value="realestate">房地产</option>
              <option value="travel">旅游</option>
              <option value="food">餐饮</option>
              <option value="blog">博客/资讯</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div class="form-group">
            <label>积分消耗</label>
            <div class="credits-hint">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              本次诊断将消耗 50 积分
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="showCreateModal = false">取消</button>
          <button class="primary-btn" @click="createReport" :disabled="creating">
            {{ creating ? '创建中...' : '开始诊断' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetailModal" class="modal-overlay" @click.self="showDetailModal = false">
      <div class="modal detail-modal">
        <div class="modal-header">
          <h2>诊断报告详情</h2>
          <button class="close-btn" @click="showDetailModal = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body" v-if="selectedReport" ref="reportModalBody">
          <!-- Target Info -->
          <div class="report-target">
            <div class="target-info">
              <h3>{{ selectedReport.targetName }}</h3>
              <a :href="selectedReport.targetUrl" target="_blank" class="target-link">
                {{ selectedReport.targetUrl }}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </div>
            <span class="industry-tag">{{ selectedReport.targetIndustry }}</span>
          </div>

          <!-- Overall Score -->
          <div class="score-overview" v-if="selectedReport.seoScore">
            <div class="score-circle" :class="getScoreClass(selectedReport.seoScore.overall)">
              <span class="score-number">{{ selectedReport.seoScore.overall }}</span>
              <span class="score-label">综合评分</span>
            </div>
            <div class="score-breakdown">
              <div class="score-item">
                <span class="score-item-label">技术优化</span>
                <div class="score-bar">
                  <div class="score-bar-fill" :style="{ width: selectedReport.seoScore.technical + '%' }"></div>
                </div>
                <span class="score-item-value">{{ selectedReport.seoScore.technical }}</span>
              </div>
              <div class="score-item">
                <span class="score-item-label">内容质量</span>
                <div class="score-bar">
                  <div class="score-bar-fill" :style="{ width: selectedReport.seoScore.content + '%' }"></div>
                </div>
                <span class="score-item-value">{{ selectedReport.seoScore.content }}</span>
              </div>
              <div class="score-item">
                <span class="score-item-label">权威性</span>
                <div class="score-bar">
                  <div class="score-bar-fill" :style="{ width: selectedReport.seoScore.authority + '%' }"></div>
                </div>
                <span class="score-item-value">{{ selectedReport.seoScore.authority }}</span>
              </div>
              <div class="score-item">
                <span class="score-item-label">性能表现</span>
                <div class="score-bar">
                  <div class="score-bar-fill" :style="{ width: selectedReport.seoScore.performance + '%' }"></div>
                </div>
                <span class="score-item-value">{{ selectedReport.seoScore.performance }}</span>
              </div>
            </div>
          </div>

          <!-- Issues -->
          <div class="issues-section" v-if="selectedReport.issues?.length">
            <h4>发现问题 ({{ selectedReport.issues.length }})</h4>
            <div class="issues-list">
              <div v-for="(issue, index) in selectedReport.issues" :key="index" class="issue-item" :class="issue.severity">
                <div class="issue-header">
                  <span class="issue-severity">{{ getSeverityLabel(issue.severity) }}</span>
                  <span class="issue-category">{{ issue.category }}</span>
                </div>
                <h5 class="issue-title">{{ issue.title }}</h5>
                <p class="issue-description">{{ issue.description }}</p>
                <div class="issue-recommendation">
                  <strong>建议：</strong>{{ issue.recommendation }}
                </div>
              </div>
            </div>
          </div>

          <!-- AI Search Presence -->
          <div class="ai-presence-section" v-if="selectedReport.aiSearchPresence">
            <h4>AI 搜索表现</h4>
            <div class="ai-presence-grid">
              <div class="ai-presence-item">
                <span class="ai-presence-label">AI 存在感评分</span>
                <span class="ai-presence-value">{{ selectedReport.aiSearchPresence.score }}/100</span>
              </div>
              <div class="ai-presence-item">
                <span class="ai-presence-label">内容覆盖度</span>
                <span class="ai-presence-value">{{ selectedReport.aiSearchPresence.coverage }}%</span>
              </div>
              <div class="ai-presence-item">
                <span class="ai-presence-label">提及次数</span>
                <span class="ai-presence-value">{{ selectedReport.aiSearchPresence.mentions }}</span>
              </div>
              <div class="ai-presence-item">
                <span class="ai-presence-label">情感倾向</span>
                <span class="ai-presence-value" :class="selectedReport.aiSearchPresence.sentiment">
                  {{ getSentimentLabel(selectedReport.aiSearchPresence.sentiment) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="showDetailModal = false">关闭</button>
          <div class="export-dropdown" @click.stop>
            <button class="primary-btn" @click="showExportMenu = !showExportMenu">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              导出
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <div v-if="showExportMenu" class="export-menu">
              <button @click="exportReport('pdf')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                导出 PDF
              </button>
              <button @click="exportReport('json')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="16 18 22 12 16 6"/>
                  <polyline points="8 6 2 12 8 18"/>
                </svg>
                导出 JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import jsPDF from 'jspdf'
import { useTheme } from '../composables/useTheme'

// 获取主题
const { theme, initTheme } = useTheme()

// Stats
const stats = ref({
  total: 12,
  completed: 9,
  running: 2,
  avgScore: 72
})

// Filters
const searchQuery = ref('')
const statusFilter = ref('')
const sortBy = ref('newest')

// Mock data
const reports = ref([
  {
    id: 1,
    userId: 'user_001',
    targetUrl: 'https://techsite.example.com',
    targetName: '科技资讯网',
    targetIndustry: 'technology',
    seoScore: { overall: 85, technical: 82, content: 88, authority: 80, performance: 90 },
    issues: [
      { severity: 'warning', category: '技术', title: '缺少 Meta 描述', description: '首页缺少 meta description 标签，影响搜索展示。', recommendation: '添加 150-160 字符的 meta description。' },
      { severity: 'info', category: '内容', title: '图片缺少 Alt 文本', description: '部分产品图片缺少 alt 属性。', recommendation: '为所有图片添加描述性 alt 文本。' }
    ],
    aiSearchPresence: { score: 75, coverage: 68, mentions: 23, sentiment: 'positive' },
    status: 'completed',
    completedAt: '2026-05-08T10:30:00Z',
    createdAt: '2026-05-08T10:00:00Z'
  },
  {
    id: 2,
    targetUrl: 'https://ecommerceshop.example.com',
    targetName: '精品电商',
    targetIndustry: 'ecommerce',
    seoScore: { overall: 68, technical: 65, content: 70, authority: 60, performance: 77 },
    issues: [
      { severity: 'error', category: '技术', title: '网站加载速度过慢', description: '首页加载时间超过 3 秒，影响用户体验和 SEO。', recommendation: '压缩图片、启用缓存、优化代码。' },
      { severity: 'warning', category: '内容', title: '关键词密度不足', description: '核心产品关键词密度低于推荐值。', recommendation: '在产品描述中自然融入核心关键词。' }
    ],
    aiSearchPresence: { score: 55, coverage: 45, mentions: 12, sentiment: 'neutral' },
    status: 'completed',
    completedAt: '2026-05-07T15:20:00Z',
    createdAt: '2026-05-07T14:30:00Z'
  },
  {
    id: 3,
    targetUrl: 'https://eduplatform.example.com',
    targetName: '在线教育平台',
    targetIndustry: 'education',
    seoScore: { overall: 78, technical: 75, content: 82, authority: 72, performance: 83 },
    issues: [],
    aiSearchPresence: { score: 62, coverage: 58, mentions: 18, sentiment: 'positive' },
    status: 'completed',
    completedAt: '2026-05-06T09:00:00Z',
    createdAt: '2026-05-06T08:00:00Z'
  },
  {
    id: 4,
    targetUrl: 'https://healthblog.example.com',
    targetName: '健康生活博客',
    targetIndustry: 'blog',
    seoScore: null,
    issues: [],
    status: 'running'
  },
  {
    id: 5,
    targetUrl: 'https://financeguide.example.com',
    targetName: '金融指南',
    targetIndustry: 'finance',
    seoScore: null,
    issues: [],
    status: 'pending'
  },
  {
    id: 6,
    targetUrl: 'https://failedsite.example.com',
    targetName: '测试失败网站',
    targetIndustry: 'other',
    seoScore: null,
    issues: [],
    status: 'failed',
    errorMessage: '无法访问目标网站'
  }
])

// Create modal
const showCreateModal = ref(false)
const creating = ref(false)
const newReport = ref({
  targetUrl: '',
  targetName: '',
  targetIndustry: ''
})
const formErrors = ref({})

// Detail modal
const showDetailModal = ref(false)
const selectedReport = ref(null)
const showExportMenu = ref(false)
const reportModalBody = ref(null)

// Computed
const filteredReports = computed(() => {
  let result = [...reports.value]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(r => 
      r.targetUrl.toLowerCase().includes(query) ||
      r.targetName.toLowerCase().includes(query)
    )
  }
  
  if (statusFilter.value) {
    result = result.filter(r => r.status === statusFilter.value)
  }
  
  if (sortBy.value === 'newest') {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else if (sortBy.value === 'oldest') {
    result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  } else if (sortBy.value === 'score') {
    result.sort((a, b) => (b.seoScore?.overall || 0) - (a.seoScore?.overall || 0))
  }
  
  return result
})

// Methods
const getScoreClass = (score) => {
  if (!score) return ''
  if (score >= 80) return 'excellent'
  if (score >= 60) return 'good'
  if (score >= 40) return 'warning'
  return 'poor'
}

const getStatusLabel = (status) => {
  const labels = {
    pending: '等待中',
    running: '进行中',
    completed: '已完成',
    failed: '失败'
  }
  return labels[status] || status
}

const getSeverityLabel = (severity) => {
  const labels = {
    error: '严重',
    warning: '警告',
    info: '提示'
  }
  return labels[severity] || severity
}

const getSentimentLabel = (sentiment) => {
  const labels = {
    positive: '正面',
    neutral: '中性',
    negative: '负面'
  }
  return labels[sentiment] || sentiment
}

const formatDate = (date) => {
  if (!date) return '--'
  return new Date(date).toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const viewReport = (report) => {
  selectedReport.value = report
  showDetailModal.value = true
}

const refreshReport = (report) => {
  report.status = 'running'
  report.seoScore = null
  // 模拟完成后更新
  setTimeout(() => {
    report.status = 'completed'
    report.seoScore = {
      overall: Math.floor(Math.random() * 30) + 60,
      technical: Math.floor(Math.random() * 30) + 60,
      content: Math.floor(Math.random() * 30) + 60,
      authority: Math.floor(Math.random() * 30) + 60,
      performance: Math.floor(Math.random() * 30) + 60
    }
  }, 2000)
}

const deleteReport = (report) => {
  if (confirm(`确定要删除 "${report.targetName}" 的诊断报告吗？`)) {
    const index = reports.value.findIndex(r => r.id === report.id)
    if (index > -1) {
      reports.value.splice(index, 1)
      stats.value.total--
      if (report.status === 'completed') stats.value.completed--
      else if (report.status === 'running') stats.value.running--
    }
  }
}

const createReport = () => {
  formErrors.value = {}
  
  if (!newReport.value.targetUrl) {
    formErrors.value.targetUrl = '请输入目标网站 URL'
    return
  }
  
  try {
    new URL(newReport.value.targetUrl)
  } catch {
    formErrors.value.targetUrl = '请输入有效的 URL'
    return
  }
  
  creating.value = true
  
  setTimeout(() => {
    const report = {
      id: Date.now(),
      targetUrl: newReport.value.targetUrl,
      targetName: newReport.value.targetName || newReport.value.targetUrl,
      targetIndustry: newReport.value.targetIndustry || 'other',
      seoScore: null,
      issues: [],
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    
    reports.value.unshift(report)
    stats.value.total++
    stats.value.pending++
    
    showCreateModal.value = false
    creating.value = false
    newReport.value = { targetUrl: '', targetName: '', targetIndustry: '' }
    
    // 模拟开始诊断
    setTimeout(() => {
      report.status = 'running'
      stats.value.pending--
      stats.value.running++
    }, 1000)
    
    // 模拟完成
    setTimeout(() => {
      report.status = 'completed'
      report.seoScore = {
        overall: Math.floor(Math.random() * 30) + 60,
        technical: Math.floor(Math.random() * 30) + 60,
        content: Math.floor(Math.random() * 30) + 60,
        authority: Math.floor(Math.random() * 30) + 60,
        performance: Math.floor(Math.random() * 30) + 60
      }
      stats.value.running--
      stats.value.completed++
    }, 3000)
  }, 500)
}

const exportReport = (format) => {
  if (!selectedReport.value) return
  showExportMenu.value = false
  
  if (format === 'json') {
    const data = JSON.stringify(selectedReport.value, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `seo-report-${selectedReport.value.targetName}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  } else if (format === 'pdf') {
    exportToPDF()
  }
}

// Helper functions for safe PDF generation
const rgb = (color) => color && color.length >= 3 ? color : [100, 100, 100]

// Chinese font loading for jsPDF
const loadChineseFont = async (doc) => {
  try {
    // Try to load Noto Sans SC font from CDN
    const fontUrl = 'https://cdn.jsdelivr.net/npm/source-han-sans-simplified-chinese@1.0.0/dist/SourceHanSansSC-Regular.otf'
    
    try {
      const response = await fetch(fontUrl)
      if (!response.ok) throw new Error('Font fetch failed')
      const fontBlob = await response.blob()
      const arrayBuffer = await fontBlob.arrayBuffer()
      const fontBase64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
      
      // Add font to VFS and register it
      doc.addFileToVFS('NotoSansSC-Regular.otf', fontBase64)
      doc.addFont('NotoSansSC-Regular.otf', 'NotoSansSC', 'normal')
      return 'NotoSansSC'
    } catch (e) {
      console.warn('Could not load Chinese font from CDN:', e.message)
      return null
    }
  } catch (error) {
    console.warn('Font loading failed:', error)
    return null
  }
}

const exportToPDF = async () => {
  try {
    const report = selectedReport.value
    if (!report) {
      console.error('No report selected')
      return
    }
    
    console.log('Generating PDF for report:', report)
    
    const doc = new jsPDF()
    
    // Load Chinese font
    const chineseFont = await loadChineseFont(doc)
    const useChineseFont = !!chineseFont
    
    // Safe color values
    const primaryR = 79, primaryG = 70, primaryB = 229
    const textDarkR = 30, textDarkG = 30, textDarkB = 30
    const textGrayR = 100, textGrayG = 100, textGrayB = 100
    const bgLightR = 248, bgLightG = 250, bgLightB = 252
  
  // Colors
  const primaryColor = [79, 70, 229]    // #4f46e5
  const secondaryColor = [99, 102, 241] // #6366f1
  const textDark = [30, 30, 30]
  const textGray = [100, 100, 100]
  const bgLight = [248, 250, 252]
  
  // Font helper
  const setDocFont = (fontType = 'normal') => {
    if (useChineseFont) {
      doc.setFont(chineseFont, fontType)
    } else {
      doc.setFont('helvetica', fontType)
    }
  }
  
  // ==================== PAGE 1 ====================
  
  // Header Background
  doc.setFillColor(primaryR, primaryG, primaryB)
  doc.rect(0, 0, 210, 45, 'F')
  
  // Logo area
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  setDocFont('bold')
  doc.text('魔鲸GEO', 15, 22)
  
  doc.setFontSize(11)
  setDocFont('normal')
  doc.text('AI 可见度诊断报告', 15, 32)
  
  // Report info - right side
  doc.setFontSize(10)
  doc.text(`报告编号: ${report.id || 'N/A'}`, 140, 18)
  doc.text(`生成时间: ${new Date().toLocaleString('zh-CN')}`, 140, 28)
  doc.text(`诊断目标: ${report.targetIndustry || 'N/A'}`, 140, 38)
  
  // Target Info Section
  let y = 55
  
  // Company card
  doc.setFillColor(bgLightR, bgLightG, bgLightB)
  doc.roundedRect(10, y, 190, 35, 3, 3, 'F')
  
  doc.setTextColor(textDarkR, textDarkG, textDarkB)
  doc.setFontSize(16)
  setDocFont('bold')
  doc.text(report.targetName || 'Unknown', 20, y + 14)
  
  doc.setFontSize(10)
  setDocFont('normal')
  doc.setTextColor(textGrayR, textGrayG, textGrayB)
  doc.text(report.targetUrl || '', 20, y + 24)
  doc.text(`所属行业: ${getIndustryLabel(report.targetIndustry)}`, 20, y + 32)
  
  // Overall Score Section
  y += 45
  doc.setTextColor(textDarkR, textDarkG, textDarkB)
  doc.setFontSize(14)
  setDocFont('bold')
  doc.text('综合健康分', 15, y)
  
  y += 8
  
  // Score circle background
  doc.setFillColor(bgLightR, bgLightG, bgLightB)
  doc.circle(45, y + 25, 28, 'F')
  
  // Score number
  if (report.seoScore) {
    const scoreColor = getScoreColor(report.seoScore.overall)
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2])
    doc.setFontSize(36)
    setDocFont('bold')
    doc.text(`${report.seoScore.overall || 0}`, 38, y + 32)
  } else {
    doc.setTextColor(textGrayR, textGrayG, textGrayB)
    doc.setFontSize(24)
    setDocFont('bold')
    doc.text('--', 38, y + 32)
  }
  
  doc.setTextColor(textGrayR, textGrayG, textGrayB)
  doc.setFontSize(10)
  setDocFont('normal')
  doc.text('综合评分', 33, y + 42)
  
  // Dimension scores - right side
  const dimX = 85
  const dimStartY = y
  const dimNames = [
    { name: 'D1 品牌实体识别', key: 'technical' },
    { name: 'D2 产品关联度', key: 'content' },
    { name: 'D3 正面情感占比', key: 'authority' },
    { name: 'D4 竞品压制指数', key: 'performance' }
  ]
  
  doc.setFontSize(9)
  doc.setTextColor(textDarkR, textDarkG, textDarkB)
  dimNames.forEach((dim, i) => {
    const rowY = dimStartY + i * 14
    setDocFont('normal')
    doc.text(dim.name, dimX, rowY + 4)
    
    // Bar background
    doc.setFillColor(229, 231, 235)
    doc.roundedRect(dimX + 40, rowY, 65, 6, 1, 1, 'F')
    
    // Bar fill
    if (report.seoScore) {
      const value = report.seoScore[dim.key] || 0
      const fillWidth = (value / 100) * 65
      const barColor = getScoreColor(value)
      doc.setFillColor(barColor[0], barColor[1], barColor[2])
      doc.roundedRect(dimX + 40, rowY, fillWidth, 6, 1, 1, 'F')
      
      doc.setTextColor(textDarkR, textDarkG, textDarkB)
      setDocFont('bold')
      doc.text(`${value}`, dimX + 110, rowY + 5)
    }
  })
  
  // 7 Dimensions Section
  y += 65
  doc.setTextColor(textDarkR, textDarkG, textDarkB)
  doc.setFontSize(14)
  setDocFont('bold')
  doc.text('七维健康度分析', 15, y)
  
  y += 8
  
  // Dimension cards
  const dimensions = [
    { label: 'D1 品牌实体识别', value: report.seoScore?.technical || 0, weight: '15%' },
    { label: 'D2 产品关联度', value: report.seoScore?.content || 0, weight: '15%' },
    { label: 'D3 情感倾向', value: report.seoScore?.authority || 0, weight: '10%' },
    { label: 'D4 竞品压制', value: report.seoScore?.performance || 0, weight: '15%' }
  ]
  
  dimensions.forEach((dim, i) => {
    const cardX = 10 + (i % 2) * 95
    const cardY = y + Math.floor(i / 2) * 28
    
    doc.setFillColor(bgLightR, bgLightG, bgLightB)
    doc.roundedRect(cardX, cardY, 90, 24, 2, 2, 'F')
    
    doc.setTextColor(textDarkR, textDarkG, textDarkB)
    doc.setFontSize(8)
    setDocFont('normal')
    doc.text(dim.label, cardX + 5, cardY + 8)
    doc.text(`权重 ${dim.weight}`, cardX + 65, cardY + 8)
    
    const scoreColor = getScoreColor(dim.value)
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2])
    doc.setFontSize(14)
    setDocFont('bold')
    doc.text(`${dim.value}`, cardX + 5, cardY + 20)
    
    // Mini bar
    doc.setFillColor(229, 231, 235)
    doc.roundedRect(cardX + 25, cardY + 13, 60, 5, 1, 1, 'F')
    doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2])
    doc.roundedRect(cardX + 25, cardY + 13, (dim.value / 100) * 60, 5, 1, 1, 'F')
  })
  
  // AI Engines Coverage
  y += 75
  doc.setTextColor(textDarkR, textDarkG, textDarkB)
  doc.setFontSize(14)
  setDocFont('bold')
  doc.text('AI 引擎收录情况', 15, y)
  
  y += 10
  
  const engines = [
    { name: 'DeepSeek', covered: true },
    { name: '豆包', covered: true },
    { name: '文心一言', covered: true },
    { name: 'Kimi', covered: false },
    { name: '通义千问', covered: true },
    { name: '智谱清言', covered: false }
  ]
  
  engines.forEach((engine, i) => {
    const engX = 15 + (i % 3) * 62
    const engY = y + Math.floor(i / 3) * 12
    
    // Badge
    const engColor = engine.covered ? [16, 185, 129] : [156, 163, 175]
    doc.setFillColor(engColor[0], engColor[1], engColor[2])
    doc.roundedRect(engX, engY, 8, 8, 1, 1, 'F')
    
    doc.setTextColor(textDarkR, textDarkG, textDarkB)
    doc.setFontSize(9)
    setDocFont('normal')
    doc.text(engine.name, engX + 12, engY + 6)
  })
  
  // Sentiment Analysis
  y += 35
  doc.setTextColor(textDarkR, textDarkG, textDarkB)
  doc.setFontSize(14)
  setDocFont('bold')
  doc.text('舆情情感分析', 15, y)
  
  y += 8
  
  if (report.aiSearchPresence) {
    // Sentiment cards
    const sentiments = [
      { label: '正面', value: report.aiSearchPresence.positiveMentions || 0, color: [16, 185, 129] },
      { label: '中性', value: report.aiSearchPresence.neutralMentions || 0, color: [107, 114, 128] },
      { label: '负面', value: report.aiSearchPresence.negativeMentions || 0, color: [220, 38, 38] }
    ]
    
    const total = (report.aiSearchPresence.positiveMentions || 0) + 
                 (report.aiSearchPresence.neutralMentions || 0) + 
                 (report.aiSearchPresence.negativeMentions || 0) || 1
    
    let sentX = 15
    sentiments.forEach((sent) => {
      const width = (sent.value / total) * 120
      const sentColor = sent.color
      
      doc.setFillColor(sentColor[0], sentColor[1], sentColor[2])
      doc.roundedRect(sentX, y, width, 12, 2, 2, 'F')
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(9)
      setDocFont('bold')
      doc.text(`${sent.label} ${Math.round((sent.value / total) * 100)}%`, sentX + 3, y + 8)
      
      sentX += width
    })
  } else {
    doc.setTextColor(textGrayR, textGrayG, textGrayB)
    doc.setFontSize(10)
    setDocFont('normal')
    doc.text('暂无情感数据', 15, y + 8)
  }
  
  // Footer
  const pageHeight = doc.internal.pageSize.height
  doc.setDrawColor(229, 231, 235)
  doc.setLineWidth(0.5)
  doc.line(10, pageHeight - 20, 200, pageHeight - 20)
  
  doc.setTextColor(textGrayR, textGrayG, textGrayB)
  doc.setFontSize(8)
  setDocFont('normal')
  doc.text('魔鲸GEO - 让GEO像呼吸一样简单', 15, pageHeight - 12)
  doc.text(`报告 ID: ${report.id || 'N/A'} | 官网: www.modelbuddy.net`, 15, pageHeight - 7)
  
  // ==================== PAGE 2: Issues ====================
  if (report.issues && report.issues.length > 0) {
    doc.addPage()
    
    // Header
    doc.setFillColor(primaryR, primaryG, primaryB)
    doc.rect(0, 0, 210, 25, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    setDocFont('bold')
    doc.text('问题诊断与优化建议', 15, 17)
    
    y = 40
    doc.setTextColor(textDarkR, textDarkG, textDarkB)
    doc.setFontSize(12)
    setDocFont('bold')
    doc.text(`发现问题 (${report.issues.length} 项)`, 15, y)
    
    y += 10
    
    report.issues.forEach((issue, index) => {
      if (y > 260) {
        doc.addPage()
        y = 20
      }
      
      // Issue card
      doc.setFillColor(bgLightR, bgLightG, bgLightB)
      const cardHeight = 45
      doc.roundedRect(10, y, 190, cardHeight, 3, 3, 'F')
      
      // Severity indicator
      const severityColors = {
        error: [220, 38, 38],
        warning: [245, 158, 11],
        info: [59, 130, 246]
      }
      const sevColor = severityColors[issue.severity] || severityColors.info
      
      doc.setFillColor(sevColor[0], sevColor[1], sevColor[2])
      doc.rect(10, y, 4, cardHeight, 'F')
      
      // Issue content
      doc.setTextColor(textDarkR, textDarkG, textDarkB)
      doc.setFontSize(11)
      setDocFont('bold')
      doc.text(`${index + 1}. ${issue.title || ''}`, 20, y + 10)
      
      doc.setFontSize(9)
      setDocFont('normal')
      doc.setTextColor(textGrayR, textGrayG, textGrayB)
      doc.text(`[${issue.category || ''}] ${(issue.severity || '').toUpperCase()}`, 20, y + 18)
      
      const descLines = doc.splitTextToSize(issue.description || '', 175)
      doc.text(descLines.slice(0, 2), 20, y + 26)
      
      // Recommendation
      doc.setTextColor(16, 185, 129)
      doc.setFontSize(9)
      const recLines = doc.splitTextToSize(`优化建议: ${issue.recommendation || ''}`, 175)
      doc.text(recLines.slice(0, 2), 20, y + 36)
      
      y += cardHeight + 8
    })
  }
  
  // ==================== PAGE 3: AI Search Details ====================
  if (report.aiSearchPresence) {
    doc.addPage()
    
    // Header
    doc.setFillColor(primaryR, primaryG, primaryB)
    doc.rect(0, 0, 210, 25, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    setDocFont('bold')
    doc.text('AI 搜索表现详情', 15, 17)
    
    y = 40
    
    // Metrics cards
    const metrics = [
      { label: 'AI 存在感评分', value: report.aiSearchPresence.score || 0, max: 100 },
      { label: '内容覆盖度', value: report.aiSearchPresence.coverage || 0, max: 100, unit: '%' },
      { label: '提及次数', value: report.aiSearchPresence.mentions || 0, max: 100 },
      { label: '情感倾向', value: report.aiSearchPresence.sentiment === 'positive' ? 80 : report.aiSearchPresence.sentiment === 'negative' ? 20 : 50, max: 100, text: report.aiSearchPresence.sentiment }
    ]
    
    metrics.forEach((metric, i) => {
      const cardX = 10 + (i % 2) * 95
      const cardY = y + Math.floor(i / 2) * 40
      
      doc.setFillColor(bgLightR, bgLightG, bgLightB)
      doc.roundedRect(cardX, cardY, 90, 36, 3, 3, 'F')
      
      doc.setTextColor(textGrayR, textGrayG, textGrayB)
      doc.setFontSize(9)
      setDocFont('normal')
      doc.text(metric.label, cardX + 8, cardY + 12)
      
      doc.setTextColor(textDarkR, textDarkG, textDarkB)
      doc.setFontSize(20)
      setDocFont('bold')
      const displayValue = metric.text || `${metric.value || 0}${metric.unit || ''}`
      doc.text(`${displayValue}`, cardX + 8, cardY + 30)
      
      // Progress bar
      if (metric.max) {
        doc.setFillColor(229, 231, 235)
        doc.roundedRect(cardX + 50, cardY + 20, 35, 6, 1, 1, 'F')
        const fillWidth = ((metric.value || 0) / metric.max) * 35
        const barColor = getScoreColor(metric.value || 0)
        doc.setFillColor(barColor[0], barColor[1], barColor[2])
        doc.roundedRect(cardX + 50, cardY + 20, fillWidth, 6, 1, 1, 'F')
      }
    })
    
    y += 95
    
    // AI Engine details
    doc.setTextColor(textDarkR, textDarkG, textDarkB)
    doc.setFontSize(12)
    setDocFont('bold')
    doc.text('各引擎收录详情', 15, y)
    
    y += 10
    
    const engineDetails = [
      { name: 'DeepSeek', score: 85, mentions: 45, trend: '+12%' },
      { name: '豆包', score: 72, mentions: 32, trend: '+5%' },
      { name: '文心一言', score: 68, mentions: 28, trend: '+8%' },
      { name: '通义千问', score: 55, mentions: 18, trend: '-2%' }
    ]
    
    engineDetails.forEach((eng, i) => {
      const engY = y + i * 18
      
      doc.setFillColor(bgLightR, bgLightG, bgLightB)
      doc.roundedRect(10, engY, 190, 14, 2, 2, 'F')
      
      doc.setTextColor(textDarkR, textDarkG, textDarkB)
      doc.setFontSize(10)
      setDocFont('bold')
      doc.text(eng.name, 15, engY + 10)
      
      setDocFont('normal')
      doc.setFontSize(9)
      doc.text(`提及 ${eng.mentions} 次`, 60, engY + 10)
      
      // Score bar
      doc.setFillColor(229, 231, 235)
      doc.roundedRect(100, engY + 5, 60, 5, 1, 1, 'F')
      const scoreColor = getScoreColor(eng.score)
      doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2])
      doc.roundedRect(100, engY + 5, (eng.score / 100) * 60, 5, 1, 1, 'F')
      
      doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2])
      setDocFont('bold')
      doc.text(`${eng.score}`, 165, engY + 10)
      
      const trendColor = (eng.trend || '').startsWith('+') ? [16, 185, 129] : [220, 38, 38]
      doc.setTextColor(trendColor[0], trendColor[1], trendColor[2])
      doc.text(eng.trend || '--', 175, engY + 10)
    })
  }
  
  // Save
  doc.save(`魔鲸GEO诊断报告-${report.targetName || 'report'}-${Date.now()}.pdf`)
  } catch (error) {
    console.error('PDF export failed:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    alert('PDF 导出失败，请重试')
  }
}
const getScoreColor = (score) => {
  if (score >= 80) return [5, 150, 105] // green
  if (score >= 60) return [79, 70, 229] // indigo
  if (score >= 40) return [217, 119, 6] // amber
  return [220, 38, 38] // red
}

const getIndustryLabel = (industry) => {
  const labels = {
    technology: '科技/软件',
    ecommerce: '电子商务',
    education: '教育',
    healthcare: '医疗健康',
    finance: '金融/保险',
    realestate: '房地产',
    travel: '旅游',
    food: '餐饮',
    blog: '博客/资讯',
    other: '其他'
  }
  return labels[industry] || industry
}
</script>

<style scoped>
.diagnose-page {
  min-height: 100vh;
  padding-bottom: 40px;
  background: var(--bg-primary);
}

/* Header */
.page-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  padding: 16px 24px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 700;
}

.primary-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--color-primary);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.secondary-btn {
  padding: 10px 16px;
  background: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.secondary-btn:hover {
  background: var(--bg-primary);
}

/* Stats */
.stats-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 1024px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .stats-grid { grid-template-columns: 1fr; }
}

.stat-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.total { background: rgba(99, 102, 241, 0.15); color: #4f46e5; }
.stat-icon.completed { background: rgba(16, 185, 129, 0.15); color: #059669; }
.stat-icon.running { background: rgba(245, 158, 11, 0.15); color: #d97706; }
.stat-icon.avg { background: rgba(139, 92, 246, 0.15); color: #7c3aed; }

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

/* Filters */
.filters-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px 16px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 280px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-secondary);
}

.search-box input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.search-box input::placeholder {
  color: var(--text-tertiary);
}

.filter-group {
  display: flex;
  gap: 8px;
}

.filter-group select {
  padding: 10px 14px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
  outline: none;
}

/* Table */
.table-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.table-container {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  padding: 14px 16px;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
}

.data-table td {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tr:hover {
  background: var(--bg-primary);
}

.target-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.target-name {
  font-weight: 600;
  color: var(--text-primary);
}

.target-url {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.industry-tag {
  display: inline-block;
  padding: 4px 10px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--color-primary);
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.score-cell {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.score-value {
  font-size: 1.125rem;
  font-weight: 700;
}

.score-value.excellent { color: #059669; }
.score-value.good { color: #4f46e5; }
.score-value.warning { color: #d97706; }
.score-value.poor { color: #dc2626; }

.score-max {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.completed { background: rgba(16, 185, 129, 0.1); color: #059669; }
.status-badge.running { background: rgba(245, 158, 11, 0.1); color: #d97706; }
.status-badge.pending { background: rgba(156, 163, 175, 0.1); color: #6b7280; }
.status-badge.failed { background: rgba(220, 38, 38, 0.1); color: #dc2626; }

.time-text {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.view { background: rgba(99, 102, 241, 0.1); color: var(--color-primary); }
.action-btn.view:hover { background: var(--color-primary); color: #ffffff; }
.action-btn.view:disabled { opacity: 0.4; cursor: not-allowed; }

.action-btn.refresh { background: rgba(16, 185, 129, 0.1); color: #059669; }
.action-btn.refresh:hover { background: #059669; color: #ffffff; }

.action-btn.delete { background: rgba(220, 38, 38, 0.1); color: #dc2626; }
.action-btn.delete:hover { background: #dc2626; color: #ffffff; }

.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: var(--text-tertiary);
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  margin-bottom: 20px;
  font-size: 0.9375rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.create-modal {
  max-width: 480px;
}

.detail-modal {
  max-width: 720px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  font-size: 1.125rem;
  font-weight: 700;
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
}

/* Form */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 14px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: var(--color-primary);
}

.form-group input.error {
  border-color: #dc2626;
}

.error-text {
  display: block;
  margin-top: 6px;
  font-size: 0.75rem;
  color: #dc2626;
}

.credits-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 10px;
  font-size: 0.8125rem;
  color: var(--color-primary);
}

/* Report Detail */
.report-target {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.target-info h3 {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.target-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  color: var(--color-primary);
  text-decoration: none;
}

.target-link:hover {
  text-decoration: underline;
}

.score-overview {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-color);
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.score-circle.excellent { background: rgba(16, 185, 129, 0.1); color: #059669; }
.score-circle.good { background: rgba(99, 102, 241, 0.1); color: #4f46e5; }
.score-circle.warning { background: rgba(245, 158, 11, 0.1); color: #d97706; }
.score-circle.poor { background: rgba(220, 38, 38, 0.1); color: #dc2626; }

.score-circle .score-number {
  font-size: 2rem;
  font-weight: 700;
}

.score-circle .score-label {
  font-size: 0.75rem;
  margin-top: 4px;
}

.score-breakdown {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.score-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.score-item-label {
  width: 80px;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.score-bar {
  flex: 1;
  height: 8px;
  background: var(--bg-primary);
  border-radius: 4px;
  overflow: hidden;
}

.score-bar-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.score-item-value {
  width: 36px;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: right;
}

.issues-section h4,
.ai-presence-section h4 {
  font-size: 0.9375rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.issues-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.issue-item {
  padding: 16px;
  background: var(--bg-primary);
  border-radius: 12px;
  border-left: 4px solid;
}

.issue-item.error { border-left-color: #dc2626; }
.issue-item.warning { border-left-color: #d97706; }
.issue-item.info { border-left-color: var(--color-primary); }

.issue-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.issue-severity {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 600;
}

.issue-item.error .issue-severity { background: rgba(220, 38, 38, 0.1); color: #dc2626; }
.issue-item.warning .issue-severity { background: rgba(245, 158, 11, 0.1); color: #d97706; }
.issue-item.info .issue-severity { background: rgba(99, 102, 241, 0.1); color: var(--color-primary); }

.issue-category {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.issue-title {
  font-size: 0.9375rem;
  font-weight: 600;
  margin-bottom: 6px;
}

.issue-description {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin-bottom: 10px;
  line-height: 1.5;
}

.issue-recommendation {
  font-size: 0.8125rem;
  color: var(--text-primary);
  line-height: 1.5;
}

.issue-recommendation strong {
  color: #059669;
}

.ai-presence-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.ai-presence-item {
  padding: 16px;
  background: var(--bg-primary);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ai-presence-label {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.ai-presence-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.ai-presence-value.positive { color: #059669; }
.ai-presence-value.negative { color: #dc2626; }

/* Light mode fixes */
[data-theme="light"] .status-badge.pending,
[data-theme="light"] .stat-icon.running {
  color: #b45309;
}

[data-theme="light"] .stat-icon.running {
  background: rgba(245, 158, 11, 0.15);
}

/* Export Dropdown */
.export-dropdown {
  position: relative;
}

.export-dropdown .primary-btn svg:last-child {
  margin-left: 2px;
  transition: transform 0.2s ease;
}

.export-dropdown .primary-btn:hover svg:last-child {
  transform: rotate(180deg);
}

.export-menu {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 8px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  min-width: 140px;
}

.export-menu button {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s ease;
  text-align: left;
}

.export-menu button:hover {
  background: var(--bg-primary);
}

.export-menu button svg {
  color: var(--text-secondary);
}

.export-menu button:first-child {
  border-bottom: 1px solid var(--border-color);
}
</style>
