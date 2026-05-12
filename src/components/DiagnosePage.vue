<template>
  <div class="diagnose-page" :data-theme="theme">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">MiraSeek模镜·AI诊断报告</h1>
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

// Improved Chinese font loading with multiple fallbacks
const loadChineseFont = async (doc) => {
  const fontUrls = [
    'https://cdn.jsdelivr.net/npm/source-han-sans-simplified-chinese@1.0.0/dist/SourceHanSansSC-Regular.otf',
    'https://fonts.gstatic.com/s/notosanssc/v36/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG9_EnYjPV06Yxrci.0.woff2',
    'https://fonts.gstatic.com/s/notosanssc/v36/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG9_EnYjPV0SYxrci.0.woff2'
  ]
  
  for (const fontUrl of fontUrls) {
    try {
      const response = await fetch(fontUrl)
      if (!response.ok) continue
      
      let fontBase64
      const contentType = response.headers.get('content-type') || ''
      
      if (contentType.includes('font') || contentType.includes('woff')) {
        const fontBlob = await response.blob()
        const arrayBuffer = await fontBlob.arrayBuffer()
        fontBase64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
      } else {
        const text = await response.text()
        fontBase64 = btoa(unescape(encodeURIComponent(text)))
      }
      
      const fontName = fontUrl.includes('source-han') ? 'NotoSansSC' : 'NotoSansSCWeb'
      doc.addFileToVFS(`${fontName}.otf`, fontBase64)
      doc.addFont(`${fontName}.otf`, fontName, 'normal')
      return fontName
    } catch (e) {
      console.warn('Font loading failed for:', fontUrl, e.message)
    }
  }
  return null
}

// Draw consistent header on each page
const drawPageHeader = (doc, title, pageNum, totalPages, useChineseFont, chineseFont) => {
  const primaryColor = [79, 70, 229]
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.rect(0, 0, 210, 20, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  if (useChineseFont) {
    doc.setFont(chineseFont, 'normal')
  } else {
    doc.setFont('helvetica', 'normal')
  }
  doc.text('魔鲸GEO AI可见度诊断报告', 15, 13)
  doc.text(title || '', 105, 13, { align: 'center' })
  doc.text(`${pageNum} / ${totalPages}`, 195, 13, { align: 'right' })
}

// Draw consistent footer on each page
const drawPageFooter = (doc, reportId) => {
  const pageHeight = doc.internal.pageSize.height
  doc.setDrawColor(229, 231, 235)
  doc.setLineWidth(0.5)
  doc.line(10, pageHeight - 15, 200, pageHeight - 15)
  
  doc.setTextColor(150, 150, 150)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('让GEO像呼吸一样简单 | www.modelbuddy.net', 15, pageHeight - 8)
  doc.text(`报告ID: ${reportId || 'N/A'}`, 195, pageHeight - 8, { align: 'right' })
}

const exportToPDF = async () => {
  try {
    const report = selectedReport.value
    if (!report) {
      console.error('No report selected')
      return
    }
    
    console.log('Generating optimized PDF for report:', report)
    
    const doc = new jsPDF()
    
    // Load Chinese font
    const chineseFont = await loadChineseFont(doc)
    const useChineseFont = !!chineseFont
    
    // Color palette
    const primaryColor = [79, 70, 229]
    const secondaryColor = [99, 102, 241]
    const textDark = [30, 30, 30]
    const textGray = [100, 100, 100]
    const bgLight = [248, 250, 252]
    const green = [16, 185, 129]
    const red = [220, 38, 38]
    const amber = [217, 119, 6]
    
    // Font setter helper
    const setFont = (fontType = 'normal', size = 10) => {
      doc.setFontSize(size)
      if (useChineseFont) {
        doc.setFont(chineseFont, fontType)
      } else {
        doc.setFont('helvetica', fontType)
      }
    }
    
    // Page tracking
    let currentPage = 0
    const totalPagesEstimate = 6
    const addPage = () => {
      doc.addPage()
      currentPage++
    }
    
    // ==================== PAGE 0: Cover ====================
    // Full cover background
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.rect(0, 0, 210, 297, 'F')
    
    // Decorative circles
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.circle(180, 40, 60, 'F')
    doc.setFillColor(255, 255, 255)
    doc.circle(30, 250, 40, 'F')
    
    // Logo text
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(32)
    setFont('bold', 32)
    doc.text('魔鲸GEO', 20, 80)
    
    doc.setFontSize(14)
    setFont('normal', 14)
    doc.text('AI 可见度诊断报告', 20, 95)
    
    // Report title
    doc.setFontSize(24)
    setFont('bold', 24)
    doc.text('诊断报告', 20, 140)
    
    // Target info box
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(20, 160, 170, 60, 5, 5, 'F')
    
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.setFontSize(20)
    setFont('bold', 20)
    doc.text(report.targetName || 'Unknown', 30, 180)
    
    doc.setTextColor(textDark[0], textDark[1], textDark[2])
    doc.setFontSize(11)
    setFont('normal', 11)
    doc.text(report.targetUrl || '', 30, 195)
    doc.text(`所属行业: ${getIndustryLabel(report.targetIndustry)}`, 30, 208)
    
    // Report meta
    doc.setTextColor(200, 200, 200)
    doc.setFontSize(10)
    doc.text(`报告编号: ${report.id || 'N/A'}`, 30, 250)
    doc.text(`生成时间: ${new Date().toLocaleString('zh-CN')}`, 30, 260)
    
    // Overall score highlight
    if (report.seoScore) {
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(14)
      setFont('normal', 14)
      doc.text('综合健康分', 140, 175)
      
      const scoreColor = getScoreColor(report.seoScore.overall)
      doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2])
      doc.setFontSize(48)
      setFont('bold', 48)
      doc.text(`${report.seoScore.overall || 0}`, 140, 205)
    }
    
    currentPage++
    
    // ==================== PAGE 1: Table of Contents ====================
    addPage()
    drawPageHeader(doc, '目录', currentPage, totalPagesEstimate, useChineseFont, chineseFont)
    
    let tocY = 45
    doc.setTextColor(textDark[0], textDark[1], textDark[2])
    doc.setFontSize(18)
    setFont('bold', 18)
    doc.text('目录', 15, tocY)
    
    tocY += 15
    const tocItems = [
      { num: '01', title: '执行摘要', page: 3 },
      { num: '02', title: '综合健康分', page: 3 },
      { num: '03', title: '七维健康度分析', page: 4 },
      { num: '04', title: 'AI引擎收录情况', page: 4 },
      { num: '05', title: '关键词排名变化', page: 5 },
      { num: '06', title: '竞品对比分析', page: 5 },
      { num: '07', title: '问题诊断与建议', page: 6 },
      { num: '08', title: 'AI搜索表现详情', page: 6 }
    ]
    
    tocItems.forEach((item, index) => {
      const itemY = tocY + index * 15
      const isEven = index % 2 === 0
      
      if (isEven) {
        doc.setFillColor(bgLight[0], bgLight[1], bgLight[2])
        doc.rect(10, itemY - 5, 190, 13, 'F')
      }
      
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
      doc.setFontSize(12)
      setFont('bold', 12)
      doc.text(item.num, 15, itemY + 3)
      
      doc.setTextColor(textDark[0], textDark[1], textDark[2])
      doc.setFontSize(12)
      setFont('normal', 12)
      doc.text(item.title, 35, itemY + 3)
      
      // Dotted line
      doc.setDrawColor(200, 200, 200)
      doc.setLineDashPattern([1, 1], 0)
      doc.line(100, itemY + 3, 180, itemY + 3)
      doc.setLineDashPattern([], 0)
      
      doc.setTextColor(textGray[0], textGray[1], textGray[2])
      doc.setFontSize(10)
      doc.text(`${item.page}`, 190, itemY + 3, { align: 'right' })
    })
    
    drawPageFooter(doc, report.id)
    
    // ==================== PAGE 2: Executive Summary & Score ====================
    addPage()
    drawPageHeader(doc, '执行摘要', currentPage, totalPagesEstimate, useChineseFont, chineseFont)
    
    let y = 35
    
    // Executive Summary Section
    doc.setTextColor(textDark[0], textDark[1], textDark[2])
    doc.setFontSize(14)
    setFont('bold', 14)
    doc.text('执行摘要', 15, y)
    
    y += 10
    
    // Summary card
    doc.setFillColor(bgLight[0], bgLight[1], bgLight[2])
    doc.roundedRect(10, y, 190, 50, 3, 3, 'F')
    
    const summaryText = `本报告对 ${report.targetName || '目标'} 在主流AI搜索引擎中的可见度进行了全面诊断。报告显示，该品牌在AI搜索环境中的综合得分为 ${report.seoScore?.overall || '--'} 分，${getSummaryInsight(report)}`
    
    doc.setTextColor(textDark[0], textDark[1], textDark[2])
    doc.setFontSize(10)
    setFont('normal', 10)
    const summaryLines = doc.splitTextToSize(summaryText, 175)
    doc.text(summaryLines.slice(0, 4), 18, y + 12)
    
    y += 60
    
    // Overall Score Section
    doc.setTextColor(textDark[0], textDark[1], textDark[2])
    doc.setFontSize(14)
    setFont('bold', 14)
    doc.text('综合健康分', 15, y)
    
    y += 12
    
    // Score card
    doc.setFillColor(bgLight[0], bgLight[1], bgLight[2])
    doc.roundedRect(10, y, 190, 80, 5, 5, 'F')
    
    // Score circle
    const scoreCircleX = 50
    const scoreCircleY = y + 40
    const scoreRadius = 30
    
    doc.setFillColor(240, 240, 250)
    doc.circle(scoreCircleX, scoreCircleY, scoreRadius, 'F')
    
    if (report.seoScore) {
      const scoreColor = getScoreColor(report.seoScore.overall)
      doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2])
      doc.setFontSize(28)
      setFont('bold', 28)
      doc.text(`${report.seoScore.overall || 0}`, scoreCircleX - 10, scoreCircleY + 5)
    } else {
      doc.setTextColor(textGray[0], textGray[1], textGray[2])
      doc.setFontSize(20)
      setFont('bold', 20)
      doc.text('--', scoreCircleX - 8, scoreCircleY + 5)
    }
    
    // Dimension bars
    const dimX = 95
    const dimStartY = y + 12
    const dimNames = [
      { name: 'D1 品牌实体识别', key: 'technical' },
      { name: 'D2 产品关联度', key: 'content' },
      { name: 'D3 情感倾向', key: 'authority' },
      { name: 'D4 竞品压制', key: 'performance' }
    ]
    
    dimNames.forEach((dim, i) => {
      const rowY = dimStartY + i * 16
      
      doc.setTextColor(textDark[0], textDark[1], textDark[2])
      doc.setFontSize(9)
      setFont('normal', 9)
      doc.text(dim.name, dimX, rowY + 5)
      
      // Bar background
      doc.setFillColor(229, 231, 235)
      doc.roundedRect(dimX + 35, rowY, 65, 7, 2, 2, 'F')
      
      // Bar fill
      if (report.seoScore) {
        const value = report.seoScore[dim.key] || 0
        const fillWidth = (value / 100) * 65
        const barColor = getScoreColor(value)
        doc.setFillColor(barColor[0], barColor[1], barColor[2])
        doc.roundedRect(dimX + 35, rowY, fillWidth, 7, 2, 2, 'F')
        
        doc.setTextColor(textDark[0], textDark[1], textDark[2])
        doc.setFontSize(10)
        setFont('bold', 10)
        doc.text(`${value}`, dimX + 105, rowY + 6)
      }
    })
    
    drawPageFooter(doc, report.id)
    
    // ==================== PAGE 3: Seven Dimensions & AI Engines ====================
    addPage()
    drawPageHeader(doc, '七维健康度分析', currentPage, totalPagesEstimate, useChineseFont, chineseFont)
    
    y = 35
    
    // Dimension cards with radar chart
    const dimensions = [
      { label: 'D1 品牌实体识别', key: 'technical', desc: '品牌名称在AI搜索中的识别度' },
      { label: 'D2 产品关联度', key: 'content', desc: '产品信息与品牌的相关性' },
      { label: 'D3 情感倾向', key: 'authority', desc: '舆情正面情感占比' },
      { label: 'D4 竞品压制', key: 'performance', desc: '相比竞品的排名优势' }
    ]
    
    // Draw radar chart on the left
    if (report.seoScore) {
      const radarScores = [
        report.seoScore.technical || 0,
        report.seoScore.content || 0,
        report.seoScore.authority || 0,
        report.seoScore.performance || 0
      ]
      drawRadarChart(doc, 15, y, 90, radarScores)
      
      // Draw labels around radar
      const radarCenterX = 60
      const radarCenterY = y + 45
      const labelRadius = 52
      const labelTexts = ['D1 品牌', 'D2 产品', 'D3 情感', 'D4 竞品']
      
      for (let i = 0; i < 4; i++) {
        const angle = (i * 90 - 90) * Math.PI / 180
        const lx = radarCenterX + labelRadius * Math.cos(angle)
        const ly = radarCenterY + labelRadius * Math.sin(angle)
        doc.setTextColor(textDark[0], textDark[1], textDark[2])
        doc.setFontSize(8)
        setFont('normal', 8)
        doc.text(labelTexts[i], lx - 10, ly + 3)
      }
    }
    
    // Dimension cards on the right
    dimensions.forEach((dim, i) => {
      const cardX = 115
      const cardY = y + i * 35
      const value = report.seoScore?.[dim.key] || 0
      
      doc.setFillColor(bgLight[0], bgLight[1], bgLight[2])
      doc.roundedRect(cardX, cardY, 85, 30, 2, 2, 'F')
      
      doc.setTextColor(textDark[0], textDark[1], textDark[2])
      doc.setFontSize(9)
      setFont('bold', 9)
      doc.text(dim.label, cardX + 5, cardY + 10)
      
      doc.setTextColor(textGray[0], textGray[1], textGray[2])
      doc.setFontSize(7)
      setFont('normal', 7)
      doc.text(dim.desc, cardX + 5, cardY + 18)
      
      const scoreColor = getScoreColor(value)
      doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2])
      doc.setFontSize(14)
      setFont('bold', 14)
      doc.text(`${value}`, cardX + 65, cardY + 22)
      
      // Mini bar
      doc.setFillColor(230, 230, 240)
      doc.roundedRect(cardX + 5, cardY + 25, 75, 4, 1, 1, 'F')
      doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2])
      doc.roundedRect(cardX + 5, cardY + 25, (value / 100) * 75, 4, 1, 1, 'F')
    })
    
    y += 165
    
    // AI Engines Coverage Section
    doc.setTextColor(textDark[0], textDark[1], textDark[2])
    doc.setFontSize(14)
    setFont('bold', 14)
    doc.text('AI 引擎收录情况', 15, y)
    
    y += 12
    
    // Engine coverage cards
    const engines = [
      { name: 'DeepSeek', covered: true, score: 85 },
      { name: '豆包', covered: true, score: 78 },
      { name: '文心一言', covered: true, score: 72 },
      { name: 'Kimi', covered: false, score: 0 },
      { name: '通义千问', covered: true, score: 68 },
      { name: '智谱清言', covered: false, score: 0 }
    ]
    
    engines.forEach((engine, i) => {
      const engX = 10 + (i % 3) * 63
      const engY = y + Math.floor(i / 3) * 28
      
      doc.setFillColor(engine.covered ? green[0] : textGray[0], 
                       engine.covered ? green[1] : textGray[1], 
                       engine.covered ? green[2] : textGray[2])
      doc.roundedRect(engX, engY, 8, 8, 1, 1, 'F')
      
      doc.setTextColor(textDark[0], textDark[1], textDark[2])
      doc.setFontSize(10)
      setFont('bold', 10)
      doc.text(engine.name, engX + 12, engY + 7)
      
      if (engine.covered) {
        doc.setTextColor(green[0], green[1], green[2])
        doc.setFontSize(9)
        setFont('normal', 9)
        doc.text(`${engine.score}分`, engX + 45, engY + 7)
      } else {
        doc.setTextColor(textGray[0], textGray[1], textGray[2])
        doc.setFontSize(9)
        setFont('normal', 9)
        doc.text('未收录', engX + 45, engY + 7)
      }
    })
    
    y += 70
    
    // Sentiment Analysis Section
    doc.setTextColor(textDark[0], textDark[1], textDark[2])
    doc.setFontSize(14)
    setFont('bold', 14)
    doc.text('舆情情感分析', 15, y)
    
    y += 10
    
    if (report.aiSearchPresence) {
      const sentiments = [
        { label: '正面', value: report.aiSearchPresence.positiveMentions || 0, color: green },
        { label: '中性', value: report.aiSearchPresence.neutralMentions || 0, color: textGray },
        { label: '负面', value: report.aiSearchPresence.negativeMentions || 0, color: red }
      ]
      
      const total = sentiments.reduce((sum, s) => sum + s.value, 1)
      
      // Sentiment bar
      let sentX = 15
      sentiments.forEach((sent) => {
        const width = (sent.value / total) * 175
        if (width > 0) {
          doc.setFillColor(sent.color[0], sent.color[1], sent.color[2])
          doc.roundedRect(sentX, y, width, 15, 2, 2, 'F')
          
          doc.setTextColor(255, 255, 255)
          doc.setFontSize(9)
          setFont('bold', 9)
          doc.text(`${sent.label} ${Math.round((sent.value / total) * 100)}%`, sentX + 3, y + 10)
        }
        sentX += width
      })
    } else {
      doc.setTextColor(textGray[0], textGray[1], textGray[2])
      doc.setFontSize(10)
      setFont('normal', 10)
      doc.text('暂无情感数据', 15, y + 10)
    }
    
    drawPageFooter(doc, report.id)
    
    // ==================== PAGE 4: Keywords Ranking Changes ====================
    addPage()
    drawPageHeader(doc, '关键词排名变化', currentPage, totalPagesEstimate, useChineseFont, chineseFont)
    
    y = 35
    
    doc.setTextColor(textDark[0], textDark[1], textDark[2])
    doc.setFontSize(14)
    setFont('bold', 14)
    doc.text('TOP 10 关键词排名趋势', 15, y)
    
    y += 12
    
    // Keywords data - use report data if available, otherwise use sample data
    const keywordsData = report.keywords || [
      { keyword: 'AI写作工具', currentRank: 3, previousRank: 5, change: '+2', volume: 12500 },
      { keyword: '智能文案生成', currentRank: 7, previousRank: 12, change: '+5', volume: 8900 },
      { keyword: '自动化创作平台', currentRank: 15, previousRank: 18, change: '+3', volume: 5600 },
      { keyword: '企业级AI解决方案', currentRank: 8, previousRank: 6, change: '-2', volume: 4200 },
      { keyword: 'AI内容营销', currentRank: 12, previousRank: 20, change: '+8', volume: 7800 },
      { keyword: '机器学习写作', currentRank: 22, previousRank: 25, change: '+3', volume: 3400 },
      { keyword: '自然语言处理工具', currentRank: 5, previousRank: 8, change: '+3', volume: 9600 },
      { keyword: 'AI助手软件', currentRank: 18, previousRank: 15, change: '-3', volume: 15000 },
      { keyword: '深度学习创作', currentRank: 25, previousRank: 30, change: '+5', volume: 2100 },
      { keyword: '内容自动化工具', currentRank: 10, previousRank: 14, change: '+4', volume: 6800 }
    ]
    
    // Table header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.rect(10, y, 190, 12, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    setFont('bold', 9)
    doc.text('关键词', 15, y + 8)
    doc.text('搜索量', 85, y + 8)
    doc.text('当前排名', 115, y + 8)
    doc.text('上周排名', 145, y + 8)
    doc.text('变化', 175, y + 8)
    
    y += 14
    
    // Table rows
    keywordsData.slice(0, 10).forEach((kw, index) => {
      const rowY = y + index * 14
      const isEven = index % 2 === 0
      
      if (isEven) {
        doc.setFillColor(bgLight[0], bgLight[1], bgLight[2])
        doc.rect(10, rowY, 190, 14, 'F')
      }
      
      doc.setTextColor(textDark[0], textDark[1], textDark[2])
      doc.setFontSize(9)
      setFont('normal', 9)
      doc.text(kw.keyword || '', 15, rowY + 9)
      
      doc.setTextColor(textGray[0], textGray[1], textGray[2])
      doc.text(`${(kw.volume || 0).toLocaleString()}`, 85, rowY + 9)
      
      const rankColor = getScoreColor(100 - (kw.currentRank || 0))
      doc.setTextColor(rankColor[0], rankColor[1], rankColor[2])
      setFont('bold', 9)
      doc.text(`${kw.currentRank || '--'}`, 115, rowY + 9)
      
      doc.setTextColor(textGray[0], textGray[1], textGray[2])
      setFont('normal', 9)
      doc.text(`${kw.previousRank || '--'}`, 145, rowY + 9)
      
      const changeStr = kw.change || '0'
      const isPositive = changeStr.startsWith('+')
      doc.setTextColor(isPositive ? green[0] : red[0], 
                       isPositive ? green[1] : red[1], 
                       isPositive ? green[2] : red[2])
      setFont('bold', 9)
      doc.text(changeStr, 175, rowY + 9)
    })
    
    y += 150
    
    // Trend chart for top keywords
    doc.setTextColor(textDark[0], textDark[1], textDark[2])
    doc.setFontSize(12)
    setFont('bold', 12)
    doc.text('排名趋势图 (TOP 3 关键词)', 15, y)
    
    y += 10
    
    // Chart area
    doc.setFillColor(bgLight[0], bgLight[1], bgLight[2])
    doc.roundedRect(10, y, 190, 60, 3, 3, 'F')
    
    // Draw trend lines for top 3 keywords
    const chartData = [
      { name: 'AI写作工具', data: [8, 6, 5, 4, 3], color: primaryColor },
      { name: '智能文案生成', data: [15, 13, 11, 9, 7], color: green },
      { name: 'AI内容营销', data: [22, 20, 17, 14, 12], color: amber }
    ]
    
    chartData.forEach((series, i) => {
      const legendX = 20 + i * 60
      doc.setFillColor(series.color[0], series.color[1], series.color[2])
      doc.rect(legendX, y + 5, 8, 3, 'F')
      doc.setTextColor(textDark[0], textDark[1], textDark[2])
      doc.setFontSize(7)
      setFont('normal', 7)
      doc.text(series.name, legendX + 12, y + 8)
      
      drawTrendLine(doc, 20, y + 15, 170, 35, series.data, series.color)
    })
    
    drawPageFooter(doc, report.id)
    
    // ==================== PAGE 5: Competitor Comparison ====================
    addPage()
    drawPageHeader(doc, '竞品对比分析', currentPage, totalPagesEstimate, useChineseFont, chineseFont)
    
    y = 35
    
    doc.setTextColor(textDark[0], textDark[1], textDark[2])
    doc.setFontSize(14)
    setFont('bold', 14)
    doc.text('与竞品对比分析', 15, y)
    
    y += 10
    
    // Competitor data
    const competitors = [
      { name: report.targetName || '本品牌', isSelf: true, 
        overall: report.seoScore?.overall || 0,
        technical: report.seoScore?.technical || 0,
        content: report.seoScore?.content || 0,
        authority: report.seoScore?.authority || 0,
        performance: report.seoScore?.performance || 0 },
      { name: '竞品A', isSelf: false, overall: 75, technical: 72, content: 78, authority: 70, performance: 80 },
      { name: '竞品B', isSelf: false, overall: 68, technical: 65, content: 70, authority: 72, performance: 65 },
      { name: '竞品C', isSelf: false, overall: 62, technical: 60, content: 68, authority: 58, performance: 62 }
    ]
    
    // Comparison table header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.rect(10, y, 190, 12, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    setFont('bold', 9)
    doc.text('品牌', 15, y + 8)
    doc.text('综合', 55, y + 8)
    doc.text('品牌识别', 85, y + 8)
    doc.text('产品关联', 115, y + 8)
    doc.text('情感倾向', 145, y + 8)
    doc.text('竞品压制', 175, y + 8)
    
    y += 14
    
    // Comparison rows
    competitors.forEach((comp, index) => {
      const rowY = y + index * 18
      const isSelf = comp.isSelf
      
      if (isSelf) {
        doc.setFillColor(240, 245, 255)
        doc.rect(10, rowY, 190, 16, 'F')
      } else if (index % 2 === 0) {
        doc.setFillColor(bgLight[0], bgLight[1], bgLight[2])
        doc.rect(10, rowY, 190, 16, 'F')
      }
      
      doc.setTextColor(isSelf ? primaryColor[0] : textDark[0], 
                       isSelf ? primaryColor[1] : textDark[1], 
                       isSelf ? primaryColor[2] : textDark[2])
      doc.setFontSize(10)
      setFont('bold', 10)
      doc.text(comp.name + (isSelf ? ' ★' : ''), 15, rowY + 11)
      
      const scores = [comp.overall, comp.technical, comp.content, comp.authority, comp.performance]
      const xPositions = [55, 85, 115, 145, 175]
      
      scores.forEach((score, i) => {
        const scoreColor = getScoreColor(score)
        doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2])
        doc.setFontSize(9)
        setFont('bold', 9)
        doc.text(`${score}`, xPositions[i], rowY + 11)
      })
    })
    
    y += 90
    
    // Radar comparison chart
    doc.setTextColor(textDark[0], textDark[1], textDark[2])
    doc.setFontSize(12)
    setFont('bold', 12)
    doc.text('多维度能力雷达图对比', 15, y)
    
    y += 10
    
    // Draw comparison radar charts
    const radarStartX = 20
    const radarStartY = y
    const radarSize = 50
    
    // Self radar
    drawRadarChart(doc, radarStartX, radarStartY, radarSize, [
      competitors[0].technical,
      competitors[0].content,
      competitors[0].authority,
      competitors[0].performance
    ])
    doc.setTextColor(textDark[0], textDark[1], textDark[2])
    doc.setFontSize(8)
    setFont('bold', 8)
    doc.text('本品牌', radarStartX + 15, radarStartY + radarSize + 8)
    
    // Competitor A radar
    drawRadarChart(doc, radarStartX + 65, radarStartY, radarSize, [
      competitors[1].technical,
      competitors[1].content,
      competitors[1].authority,
      competitors[1].performance
    ])
    doc.setTextColor(textDark[0], textDark[1], textDark[2])
    doc.setFontSize(8)
    setFont('bold', 8)
    doc.text('竞品A', radarStartX + 65 + 15, radarStartY + radarSize + 8)
    
    // Competitor B radar
    drawRadarChart(doc, radarStartX + 130, radarStartY, radarSize, [
      competitors[2].technical,
      competitors[2].content,
      competitors[2].authority,
      competitors[2].performance
    ])
    doc.setTextColor(textDark[0], textDark[1], textDark[2])
    doc.setFontSize(8)
    setFont('bold', 8)
    doc.text('竞品B', radarStartX + 130 + 15, radarStartY + radarSize + 8)
    
    y += 100
    
    // Competitive insights
    doc.setTextColor(textDark[0], textDark[1], textDark[2])
    doc.setFontSize(12)
    setFont('bold', 12)
    doc.text('竞争洞察', 15, y)
    
    y += 10
    
    const insights = [
      { icon: '✓', text: `在${competitors[0].performance > competitors[1].performance ? '竞品压制' : '品牌识别'}维度表现优于竞品A`, color: green },
      { icon: '!', text: `建议提升产品关联度以缩小与领先竞品的差距`, color: amber },
      { icon: '→', text: `情感倾向得分与竞品B持平，需加强正面舆情建设`, color: primaryColor }
    ]
    
    insights.forEach((insight, i) => {
      const insightY = y + i * 18
      
      doc.setFillColor(bgLight[0], bgLight[1], bgLight[2])
      doc.roundedRect(15, insightY, 180, 15, 2, 2, 'F')
      
      doc.setTextColor(insight.color[0], insight.color[1], insight.color[2])
      doc.setFontSize(12)
      setFont('bold', 12)
      doc.text(insight.icon, 20, insightY + 11)
      
      doc.setTextColor(textDark[0], textDark[1], textDark[2])
      doc.setFontSize(9)
      setFont('normal', 9)
      doc.text(insight.text, 30, insightY + 11)
    })
    
    drawPageFooter(doc, report.id)
    
    // ==================== PAGE 6: Issues Diagnosis ====================
    addPage()
    drawPageHeader(doc, '问题诊断与建议', currentPage, totalPagesEstimate, useChineseFont, chineseFont)
    
    y = 35
    
    doc.setTextColor(textDark[0], textDark[1], textDark[2])
    doc.setFontSize(14)
    setFont('bold', 14)
    doc.text(`发现问题 (${report.issues?.length || 0} 项)`, 15, y)
    
    y += 12
    
    // Use report issues if available, otherwise generate sample issues
    const issues = report.issues?.length > 0 ? report.issues : [
      { title: '品牌实体识别度不足', severity: 'warning', category: '品牌', description: '在AI搜索中，品牌核心关键词被识别的频率较低', recommendation: '建议在官网增加品牌名称的高频出现，优化H标签中的品牌词' },
      { title: '产品关联内容偏少', severity: 'warning', category: '内容', description: 'AI搜索引擎难以获取足够的产品关联信息', recommendation: '创建更多产品介绍页面，并在内容中自然融入产品关键词' },
      { title: '竞品压制明显', severity: 'error', category: '竞争', description: '在核心关键词上，竞品排名明显优于本品牌', recommendation: '分析竞品内容策略，提升内容质量和深度' }
    ]
    
    const severityConfig = {
      error: { label: '严重', color: red },
      warning: { label: '警告', color: amber },
      info: { label: '提示', color: primaryColor }
    }
    
    issues.forEach((issue, index) => {
      if (y > 250) {
        addPage()
        drawPageHeader(doc, '问题诊断与建议', currentPage, totalPagesEstimate, useChineseFont, chineseFont)
        y = 35
      }
      
      const sev = severityConfig[issue.severity] || severityConfig.info
      const cardHeight = 50
      
      // Card background
      doc.setFillColor(bgLight[0], bgLight[1], bgLight[2])
      doc.roundedRect(10, y, 190, cardHeight, 3, 3, 'F')
      
      // Severity indicator bar
      doc.setFillColor(sev.color[0], sev.color[1], sev.color[2])
      doc.rect(10, y, 4, cardHeight, 'F')
      
      // Title and category
      doc.setTextColor(textDark[0], textDark[1], textDark[2])
      doc.setFontSize(11)
      setFont('bold', 11)
      doc.text(`${index + 1}. ${issue.title || ''}`, 20, y + 12)
      
      doc.setTextColor(sev.color[0], sev.color[1], sev.color[2])
      doc.setFontSize(8)
      setFont('normal', 8)
      doc.text(`[${issue.category || ''}] ${sev.label}`, 20, y + 20)
      
      // Description
      doc.setTextColor(textGray[0], textGray[1], textGray[2])
      doc.setFontSize(9)
      setFont('normal', 9)
      const descLines = doc.splitTextToSize(issue.description || '', 170)
      doc.text(descLines.slice(0, 2), 20, y + 28)
      
      // Recommendation
      doc.setTextColor(green[0], green[1], green[2])
      doc.setFontSize(9)
      const recLines = doc.splitTextToSize(`优化建议: ${issue.recommendation || ''}`, 170)
      doc.text(recLines.slice(0, 2), 20, y + 40)
      
      y += cardHeight + 8
    })
    
    drawPageFooter(doc, report.id)
    
    // ==================== PAGE 7: AI Search Details ====================
    addPage()
    drawPageHeader(doc, 'AI搜索表现详情', currentPage, totalPagesEstimate, useChineseFont, chineseFont)
    
    y = 35
    
    // Metrics cards
    const aiMetrics = [
      { label: 'AI 存在感评分', value: report.aiSearchPresence?.score || 0, max: 100 },
      { label: '内容覆盖度', value: report.aiSearchPresence?.coverage || 0, max: 100, unit: '%' },
      { label: '提及次数', value: report.aiSearchPresence?.mentions || 0, max: 200 },
      { label: '情感指数', value: report.aiSearchPresence?.sentiment === 'positive' ? 80 : report.aiSearchPresence?.sentiment === 'negative' ? 20 : 50, max: 100, text: report.aiSearchPresence?.sentiment === 'positive' ? '正面' : report.aiSearchPresence?.sentiment === 'negative' ? '负面' : '中性' }
    ]
    
    aiMetrics.forEach((metric, i) => {
      const cardX = 10 + (i % 2) * 95
      const cardY = y + Math.floor(i / 2) * 45
      
      doc.setFillColor(bgLight[0], bgLight[1], bgLight[2])
      doc.roundedRect(cardX, cardY, 90, 40, 3, 3, 'F')
      
      doc.setTextColor(textGray[0], textGray[1], textGray[2])
      doc.setFontSize(9)
      setFont('normal', 9)
      doc.text(metric.label, cardX + 8, cardY + 12)
      
      const scoreColor = getScoreColor(metric.value)
      doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2])
      doc.setFontSize(22)
      setFont('bold', 22)
      const displayValue = metric.text || `${metric.value || 0}${metric.unit || ''}`
      doc.text(displayValue, cardX + 8, cardY + 32)
      
      // Progress bar
      if (metric.max) {
        doc.setFillColor(230, 230, 240)
        doc.roundedRect(cardX + 55, cardY + 22, 30, 6, 1, 1, 'F')
        const fillWidth = ((metric.value || 0) / metric.max) * 30
        doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2])
        doc.roundedRect(cardX + 55, cardY + 22, fillWidth, 6, 1, 1, 'F')
      }
    })
    
    y += 100
    
    // AI Engine details
    doc.setTextColor(textDark[0], textDark[1], textDark[2])
    doc.setFontSize(12)
    setFont('bold', 12)
    doc.text('各引擎收录详情', 15, y)
    
    y += 10
    
    const engineDetails = [
      { name: 'DeepSeek', score: 85, mentions: 45, trend: '+12%' },
      { name: '豆包', score: 72, mentions: 32, trend: '+5%' },
      { name: '文心一言', score: 68, mentions: 28, trend: '+8%' },
      { name: '通义千问', score: 55, mentions: 18, trend: '-2%' },
      { name: 'Kimi', score: 42, mentions: 12, trend: '+3%' },
      { name: '智谱清言', score: 38, mentions: 8, trend: '+1%' }
    ]
    
    engineDetails.forEach((eng, i) => {
      const engY = y + i * 16
      
      if (engY > 260) {
        addPage()
        drawPageHeader(doc, 'AI搜索表现详情', currentPage, totalPagesEstimate, useChineseFont, chineseFont)
        y = 35
      }
      
      doc.setFillColor(bgLight[0], bgLight[1], bgLight[2])
      doc.roundedRect(10, engY, 190, 14, 2, 2, 'F')
      
      doc.setTextColor(textDark[0], textDark[1], textDark[2])
      doc.setFontSize(10)
      setFont('bold', 10)
      doc.text(eng.name, 15, engY + 10)
      
      setFont('normal', 9)
      doc.setTextColor(textGray[0], textGray[1], textGray[2])
      doc.text(`提及 ${eng.mentions} 次`, 55, engY + 10)
      
      // Score bar
      doc.setFillColor(230, 230, 240)
      doc.roundedRect(95, engY + 5, 60, 5, 1, 1, 'F')
      const scoreColor = getScoreColor(eng.score)
      doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2])
      doc.roundedRect(95, engY + 5, (eng.score / 100) * 60, 5, 1, 1, 'F')
      
      doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2])
      setFont('bold', 9)
      doc.text(`${eng.score}`, 160, engY + 10)
      
      const trendColor = (eng.trend || '').startsWith('+') ? green : red
      doc.setTextColor(trendColor[0], trendColor[1], trendColor[2])
      doc.text(eng.trend || '--', 175, engY + 10)
    })
    
    drawPageFooter(doc, report.id)
    
    // Save PDF
    const fileName = `魔鲸GEO诊断报告-${report.targetName || 'report'}-${Date.now()}.pdf`
    doc.save(fileName)
    console.log('PDF exported successfully:', fileName)
    
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

// Generate summary insight based on report data
const getSummaryInsight = (report) => {
  if (!report.seoScore) return '暂无评分数据'
  
  const score = report.seoScore.overall
  const dimensions = ['technical', 'content', 'authority', 'performance']
  const lowestDim = dimensions.reduce((min, dim) => {
    return (report.seoScore[dim] || 0) < (report.seoScore[min] || 0) ? dim : min
  }, 'technical')
  
  const dimLabels = {
    technical: '品牌实体识别',
    content: '产品关联度',
    authority: '情感倾向',
    performance: '竞品压制'
  }
  
  if (score >= 80) {
    return '整体表现优秀，在AI搜索环境中具有较强的品牌可见度。建议持续优化内容质量，保持竞争优势。'
  } else if (score >= 60) {
    return `${dimLabels[lowestDim]}方面仍有提升空间，建议重点关注该维度的优化，以提升整体AI可见度。`
  } else {
    return `在多个维度存在较大优化空间，建议优先提升${dimLabels[lowestDim]}，以改善整体AI搜索引擎表现。`
  }
}

// Draw radar chart approximation for PDF
const drawRadarChart = (doc, x, y, size, scores) => {
  const centerX = x + size / 2
  const centerY = y + size / 2
  const numAxes = 4
  const angleStep = (2 * Math.PI) / numAxes
  const maxRadius = size / 2 - 10
  
  // Draw concentric circles
  for (let r = 1; r <= 4; r++) {
    const radius = (maxRadius / 4) * r
    doc.setDrawColor(220, 220, 230)
    doc.setLineWidth(0.3)
    for (let i = 0; i < numAxes; i++) {
      const angle = angleStep * i - Math.PI / 2
      const px = centerX + radius * Math.cos(angle)
      const py = centerY + radius * Math.sin(angle)
      if (i === 0) {
        doc.moveTo(px, py)
      } else {
        doc.lineTo(px, py)
      }
    }
    doc.closePath()
    doc.stroke()
  }
  
  // Draw axes
  for (let i = 0; i < numAxes; i++) {
    const angle = angleStep * i - Math.PI / 2
    const px = centerX + maxRadius * Math.cos(angle)
    const py = centerY + maxRadius * Math.sin(angle)
    doc.setDrawColor(180, 180, 200)
    doc.setLineWidth(0.5)
    doc.line(centerX, centerY, px, py)
  }
  
  // Draw data polygon
  if (scores && scores.length === numAxes) {
    doc.setDrawColor(79, 70, 229)
    doc.setFillColor(79, 70, 229)
    doc.setLineWidth(1)
    
    scores.forEach((score, i) => {
      const angle = angleStep * i - Math.PI / 2
      const radius = (score / 100) * maxRadius
      const px = centerX + radius * Math.cos(angle)
      const py = centerY + radius * Math.sin(angle)
      
      if (i === 0) {
        doc.moveTo(px, py)
      } else {
        doc.lineTo(px, py)
      }
    })
    doc.closePath()
    doc.fill()
  }
}

// Draw mini trend line chart
const drawTrendLine = (doc, x, y, width, height, data, color) => {
  if (!data || data.length < 2) return
  
  const minVal = Math.min(...data)
  const maxVal = Math.max(...data)
  const range = maxVal - minVal || 1
  
  doc.setDrawColor(color[0], color[1], color[2])
  doc.setLineWidth(1.5)
  
  data.forEach((val, i) => {
    const px = x + (i / (data.length - 1)) * width
    const py = y + height - ((val - minVal) / range) * height
    
    if (i === 0) {
      doc.moveTo(px, py)
    } else {
      doc.lineTo(px, py)
    }
  })
  doc.stroke()
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
