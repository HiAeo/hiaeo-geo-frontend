<template>
  <div class="hub-page" :data-theme="theme">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div>
          <h1 class="page-title">魔鲸Hub·AI协同驾驶仓</h1>
          <p class="page-subtitle">老板看结果，运营管执行，技术看指引 — 三方同舱不打架</p>
        </div>
        <div class="header-actions">
          <select v-model="selectedBrandId" class="brand-select" @change="onBrandChange">
            <option value="">全部品牌</option>
            <option v-for="brand in brands" :key="brand.id" :value="brand.id">
              {{ brand.name }}
            </option>
          </select>
          <button class="refresh-btn" @click="refreshData" :class="{ spinning: loading }">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Role View Tabs -->
    <div class="role-tabs">
      <button
        v-for="role in roles"
        :key="role.id"
        @click="activeRole = role.id"
        class="role-tab"
        :class="{ active: activeRole === role.id }"
      >
        <span class="role-icon">{{ role.icon }}</span>
        <span class="role-label">{{ role.label }}</span>
        <span class="role-desc">{{ role.desc }}</span>
      </button>
    </div>

    <!-- Boss View -->
    <div v-if="activeRole === 'boss'" class="role-content">
      <!-- Key Metrics -->
      <div class="metrics-grid">
        <div class="metric-card primary">
          <div class="metric-header">
            <span class="metric-label">GEO健康分</span>
            <span class="metric-trend positive">↑ 8%</span>
          </div>
          <div class="metric-value primary">{{ bossStats.geoScore }}</div>
          <div class="metric-bar">
            <div class="metric-bar-fill" :style="{ width: bossStats.geoScore + '%' }"></div>
          </div>
          <div class="metric-footer">
            <span class="metric-compare">行业平均: {{ bossStats.industryAvg }}</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-label">DeepSeek提及率</span>
            <span class="metric-trend positive">↑ {{ bossStats.mentionRate }}%</span>
          </div>
          <div class="metric-value accent">+{{ bossStats.mentionRate }}%</div>
          <div class="metric-bar">
            <div class="metric-bar-fill blue" :style="{ width: Math.min(bossStats.mentionRate * 2, 100) + '%' }"></div>
          </div>
          <div class="metric-footer">
            <span class="metric-compare">目标: {{ bossStats.mentionTarget }}%</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-label">竞品压制率</span>
            <span class="metric-trend positive">↑ {{ bossStats.competitorSuppression }}%</span>
          </div>
          <div class="metric-value purple">+{{ bossStats.competitorSuppression }}%</div>
          <div class="metric-bar">
            <div class="metric-bar-fill purple" :style="{ width: Math.min(bossStats.competitorSuppression * 2, 100) + '%' }"></div>
          </div>
          <div class="metric-footer">
            <span class="metric-compare">击败竞品: {{ bossStats.competitorCount }}家</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-label">ROI预估</span>
            <span class="metric-trend positive">↑ {{ bossStats.roi }}%</span>
          </div>
          <div class="metric-value green">+{{ bossStats.roi }}%</div>
          <div class="metric-bar">
            <div class="metric-bar-fill green" :style="{ width: Math.min(bossStats.roi * 2, 100) + '%' }"></div>
          </div>
          <div class="metric-footer">
            <span class="metric-compare">投入产出比 1:{{ (bossStats.roi / 100 + 1).toFixed(1) }}</span>
          </div>
        </div>
      </div>

      <!-- Revenue & Growth -->
      <div class="charts-row">
        <div class="chart-card full">
          <div class="chart-header">
            <h3>品牌可见度趋势</h3>
            <div class="chart-actions">
              <select v-model="bossPeriod" class="period-select">
                <option value="7d">近7天</option>
                <option value="30d">近30天</option>
                <option value="90d">近90天</option>
              </select>
            </div>
          </div>
          <div class="chart-container">
            <svg class="trend-chart" viewBox="0 0 700 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="bossAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="rgba(22, 93, 255, 0.3)"/>
                  <stop offset="100%" stop-color="rgba(22, 93, 255, 0)"/>
                </linearGradient>
              </defs>
              <line v-for="i in 4" :key="'g'+i" :x1="50" :y1="20 + (160/3)*(i-1)" :x2="680" :y2="20 + (160/3)*(i-1)" class="grid-line"/>
              <path :d="visibilityAreaPath" fill="url(#bossAreaGrad)"/>
              <path :d="visibilityLinePath" class="chart-line blue"/>
              <circle v-for="(p, i) in visibilityPoints" :key="'c'+i" :cx="p.x" :cy="p.y" r="4" class="chart-point" @mouseenter="showTooltip(i)" @mouseleave="hideTooltip"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Brand Comparison -->
      <div class="comparison-section">
        <h3 class="section-title">品牌排名对比</h3>
        <div class="comparison-table">
          <div class="table-header">
            <span>排名</span>
            <span>品牌</span>
            <span>GEO健康分</span>
            <span>提及率</span>
            <span>趋势</span>
          </div>
          <div v-for="(item, index) in brandRanking" :key="item.id" class="table-row" :class="{ highlight: item.isCurrentBrand }">
            <span class="rank" :class="getRankClass(index)">{{ index + 1 }}</span>
            <span class="brand-name">{{ item.name }}</span>
            <span class="score">{{ item.score }}</span>
            <span class="rate">{{ item.mentionRate }}%</span>
            <span class="trend" :class="item.trend > 0 ? 'up' : 'down'">
              {{ item.trend > 0 ? '↑' : '↓' }} {{ Math.abs(item.trend) }}%
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Ops View -->
    <div v-if="activeRole === 'ops'" class="role-content">
      <!-- Task Queue -->
      <div class="ops-grid">
        <div class="ops-card pending-tasks">
          <div class="card-header">
            <h3>待审核内容</h3>
            <span class="badge warning">{{ opsStats.pendingCount }} 篇待审</span>
          </div>
          <div class="task-list">
            <div v-for="task in pendingTasks" :key="task.id" class="task-item">
              <div class="task-status" :style="{ background: getStatusColor(task.status) }"></div>
              <div class="task-info">
                <div class="task-title">{{ task.title }}</div>
                <div class="task-meta">
                  <span class="task-style">{{ task.style }}</span>
                  <span class="task-platform">{{ task.platform }}</span>
                  <span class="task-impact">预计提升 {{ task.impact }}%</span>
                </div>
              </div>
              <div class="task-actions">
                <button class="task-btn approve" @click="approveTask(task.id)">通过</button>
                <button class="task-btn reject" @click="rejectTask(task.id)">拒绝</button>
              </div>
            </div>
          </div>
        </div>

        <div class="ops-card suggestions">
          <div class="card-header">
            <h3>下一步建议</h3>
          </div>
          <div class="suggestion-list">
            <div v-for="(suggestion, index) in suggestions" :key="index" class="suggestion-item">
              <span class="step-num">{{ index + 1 }}</span>
              <div class="suggestion-content">
                <p>{{ suggestion.text }}</p>
                <span class="suggestion-tag" :class="suggestion.priority">{{ suggestion.tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Stats -->
      <div class="content-stats">
        <h3 class="section-title">内容发布统计</h3>
        <div class="stats-row">
          <div class="mini-stat">
            <span class="mini-value">{{ opsStats.totalContent }}</span>
            <span class="mini-label">总内容</span>
          </div>
          <div class="mini-stat">
            <span class="mini-value success">{{ opsStats.publishedContent }}</span>
            <span class="mini-label">已发布</span>
          </div>
          <div class="mini-stat">
            <span class="mini-value warning">{{ opsStats.pendingContent }}</span>
            <span class="mini-label">待发布</span>
          </div>
          <div class="mini-stat">
            <span class="mini-value">{{ opsStats.avgEngagement }}%</span>
            <span class="mini-label">平均互动</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tech View -->
    <div v-if="activeRole === 'tech'" class="role-content">
      <div class="tech-grid">
        <!-- Task Queue -->
        <div class="tech-card tasks">
          <div class="card-header">
            <h3>技术任务队列</h3>
            <span class="badge" :class="techStats.pendingTasks > 0 ? 'warning' : 'success'">
              {{ techStats.pendingTasks > 0 ? `${techStats.pendingTasks} 项待处理` : '全部完成' }}
            </span>
          </div>
          <div class="tech-task-list">
            <div v-for="task in techTasks" :key="task.id" class="tech-task-item">
              <div class="task-icon" :class="task.status">
                <svg v-if="task.status === 'completed'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <svg v-else-if="task.status === 'pending'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div class="task-info">
                <div class="task-title">{{ task.title }}</div>
                <div class="task-desc">{{ task.description }}</div>
              </div>
              <span class="task-status-badge" :class="task.status">{{ getTaskStatusText(task.status) }}</span>
            </div>
          </div>
        </div>

        <!-- System Health -->
        <div class="tech-card system-health">
          <div class="card-header">
            <h3>系统健康度</h3>
          </div>
          <div class="health-metrics">
            <div class="health-item">
              <div class="health-label">API响应</div>
              <div class="health-bar">
                <div class="health-bar-fill green" :style="{ width: techStats.apiHealth + '%' }"></div>
              </div>
              <span class="health-value">{{ techStats.apiHealth }}ms</span>
            </div>
            <div class="health-item">
              <div class="health-label">爬虫友好度</div>
              <div class="health-bar">
                <div class="health-bar-fill blue" :style="{ width: techStats.crawlerScore + '%' }"></div>
              </div>
              <span class="health-value">{{ techStats.crawlerScore }}%</span>
            </div>
            <div class="health-item">
              <div class="health-label">结构化数据</div>
              <div class="health-bar">
                <div class="health-bar-fill purple" :style="{ width: techStats.schemaScore + '%' }"></div>
              </div>
              <span class="health-value">{{ techStats.schemaScore }}%</span>
            </div>
            <div class="health-item">
              <div class="health-label">页面性能</div>
              <div class="health-bar">
                <div class="health-bar-fill" :class="[techStats.performance > 80 ? 'green' : 'yellow']" :style="{ width: techStats.performance + '%' }"></div>
              </div>
              <span class="health-value">{{ techStats.performance }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tech References -->
      <div class="tech-references">
        <h3 class="section-title">技术参考</h3>
        <div class="reference-grid">
          <div v-for="ref in techReferences" :key="ref.type" class="reference-card">
            <div class="ref-icon">{{ ref.icon }}</div>
            <div class="ref-info">
              <div class="ref-title">{{ ref.title }}</div>
              <div class="ref-desc">{{ ref.description }}</div>
            </div>
            <button class="ref-action" @click="copyReference(ref)">复制</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '../../composables/useApi'
import { useTheme } from '../../composables/useTheme'

// 使用全局主题状态
const { theme } = useTheme()

const props = defineProps({
  theme: { type: String, default: 'dark' }
})

const { get } = useApi()
const loading = ref(false)
const activeRole = ref('boss')
const selectedBrandId = ref('')
const bossPeriod = ref('30d')

const roles = [
  { id: 'boss', label: '老板视图', icon: '📊', desc: '数据总览' },
  { id: 'ops', label: '运营视图', icon: '⚡', desc: '内容运营' },
  { id: 'tech', label: '技术视图', icon: '🔧', desc: '系统指引' }
]

// Mock data - would come from API
const brands = ref([
  { id: 1, name: '示例品牌' }
])

const bossStats = ref({
  geoScore: 72,
  industryAvg: 65,
  mentionRate: 34,
  mentionTarget: 50,
  competitorSuppression: 12,
  competitorCount: 3,
  roi: 23
})

const brandRanking = ref([
  { id: 1, name: '示例品牌', score: 72, mentionRate: 34, trend: 8, isCurrentBrand: true },
  { id: 2, name: '竞品A', score: 68, mentionRate: 28, trend: 3, isCurrentBrand: false },
  { id: 3, name: '竞品B', score: 65, mentionRate: 22, trend: -2, isCurrentBrand: false },
  { id: 4, name: '竞品C', score: 58, mentionRate: 18, trend: 5, isCurrentBrand: false }
])

const visibilityData = ref([
  { date: '05-01', value: 55 },
  { date: '05-05', value: 58 },
  { date: '05-10', value: 62 },
  { date: '05-15', value: 65 },
  { date: '05-20', value: 68 },
  { date: '05-25', value: 70 },
  { date: '05-28', value: 72 }
])

const opsStats = ref({
  pendingCount: 3,
  totalContent: 24,
  publishedContent: 18,
  pendingContent: 6,
  avgEngagement: 12.5
})

const pendingTasks = ref([
  { id: 1, title: '《中小企业如何选客服系统》', style: 'DeepSeek风格', platform: '小红书', impact: 12, status: 'pending' },
  { id: 2, title: 'JSON-LD结构化数据配置', style: '官网部署', platform: '官网', impact: 8, status: 'pending' },
  { id: 3, title: '竞品对比页FAQ扩展', style: 'Kimi风格', platform: '官网', impact: 6, status: 'pending' }
])

const suggestions = ref([
  { text: '豆包提及率仍低于行业平均，建议补充2篇豆包风格的短视频脚本，适配生活化种草场景', tag: '高优先级', priority: 'high' },
  { text: '本周已发布3篇DeepSeek风格内容，建议下周切换豆包/Kimi风格内容进行A/B测试', tag: '建议', priority: 'medium' },
  { text: '官网「关于我们」页缺少核心优势关键词，建议更新为AI人设定位版本', tag: '优化', priority: 'low' }
])

const techStats = ref({
  pendingTasks: 2,
  apiHealth: 95,
  crawlerScore: 88,
  schemaScore: 75,
  performance: 92
})

const techTasks = ref([
  { id: 1, title: '部署JSON-LD结构化数据', description: '参考模法生成代码片段，部署至官网<head>标签内', status: 'completed' },
  { id: 2, title: '完善sitemap.xml', description: '建议新增「解决方案」「行业案例」等栏目 sitemap', status: 'completed' },
  { id: 3, title: '添加客服核心页面Meta标签', description: 'title/description 需包含品牌核心关键词', status: 'pending' },
  { id: 4, title: '提交Bing Webmaster Tools', description: '全站提交索引，提升 Bing/ChatGPT 爬虫友好度', status: 'pending' }
])

const techReferences = ref([
  { type: 'jsonld', icon: '📋', title: 'JSON-LD代码', description: '复制结构化数据代码' },
  { type: 'meta', icon: '🏷️', title: 'Meta标签', description: '复制SEO优化标签' },
  { type: 'sitemap', icon: '🗺️', title: 'Sitemap', description: '生成站点地图' }
])

// Computed
const maxVisibility = computed(() => Math.max(...visibilityData.value.map(d => d.value), 1))

const visibilityPoints = computed(() => {
  const w = 630
  const h = 160
  return visibilityData.value.map((d, i) => ({
    x: 50 + (w / (visibilityData.value.length - 1)) * i,
    y: 20 + h - (d.value / maxVisibility.value) * h
  }))
})

const visibilityLinePath = computed(() => {
  if (visibilityPoints.value.length === 0) return ''
  return visibilityPoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
})

const visibilityAreaPath = computed(() => {
  if (visibilityPoints.value.length === 0) return ''
  const bottomY = 180
  const first = visibilityPoints.value[0]
  const last = visibilityPoints.value[visibilityPoints.value.length - 1]
  return `${visibilityLinePath.value} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`
})

// Methods
const refreshData = async () => {
  loading.value = true
  try {
    // Fetch from API
    // const data = await get('/hub/stats')
  } catch (error) {
    console.error('Failed to refresh:', error)
  } finally {
    loading.value = false
  }
}

const onBrandChange = () => {
  refreshData()
}

const getRankClass = (index) => {
  if (index === 0) return 'gold'
  if (index === 1) return 'silver'
  if (index === 2) return 'bronze'
  return ''
}

const getStatusColor = (status) => {
  const colors = { 
    pending: 'var(--color-info)', 
    draft: 'var(--color-secondary)', 
    published: 'var(--color-success)' 
  }
  return colors[status] || 'var(--color-primary)'
}

const getTaskStatusText = (status) => {
  const texts = { completed: '已完成', pending: '待处理', inProgress: '进行中' }
  return texts[status] || status
}

const approveTask = (id) => {
  console.log('Approve task:', id)
}

const rejectTask = (id) => {
  console.log('Reject task:', id)
}

const copyReference = (ref) => {
  console.log('Copy reference:', ref)
}

const showTooltip = (index) => {
  // Tooltip logic
}

const hideTooltip = () => {
  // Hide tooltip
}

onMounted(() => {
  refreshData()
  loadReportData() // 加载诊断报告数据
})

// 从诊断报告加载数据到Hub驾驶舱
const loadReportData = () => {
  try {
    const savedReports = localStorage.getItem('diagnose_reports')
    if (savedReports) {
      const reportsList = JSON.parse(savedReports)
      if (reportsList.length > 0) {
        const latestReport = reportsList[0]
        const aiResult = latestReport.result
        
        if (aiResult) {
          // 更新老板视图的GEO健康分
          bossStats.value.geoScore = aiResult.overallScore || 72
          
          // 从竞品分析中获取提及率
          if (aiResult.competitorAnalysis) {
            bossStats.value.mentionRate = Math.round(aiResult.competitorAnalysis.overallMentionRate || 34)
          }
          
          // 从诊断建议中生成运营建议
          if (aiResult.dimensions) {
            const suggestionsList = []
            aiResult.dimensions.forEach(dim => {
              if (dim.suggestions) {
                dim.suggestions.forEach(sug => {
                  if (sug.priority === '高') {
                    suggestionsList.push({
                      text: sug.action,
                      tag: '高优先级',
                      priority: 'high'
                    })
                  }
                })
              }
            })
            
            if (suggestionsList.length > 0) {
              suggestions.value = suggestionsList.slice(0, 5)
            }
          }
          
          // 更新可见度数据趋势
          if (reportsList.length >= 2) {
            const scores = reportsList.map(r => r.result?.overallScore || 0).reverse()
            visibilityData.value = scores.map((score, i) => ({
              date: `05-${10 - (scores.length - 1 - i) * 5}`,
              value: score
            }))
          }
          
          // 更新品牌排名数据
          if (aiResult.competitorAnalysis?.mainCompetitors) {
            const competitors = aiResult.competitorAnalysis.mainCompetitors.map((c, i) => ({
              id: i + 2,
              name: c.name,
              score: Math.round(70 + Math.random() * 20),
              mentionRate: c.mentionRate || Math.round(Math.random() * 30),
              trend: Math.round(Math.random() * 10 - 3),
              isCurrentBrand: false
            }))
            
            brandRanking.value = [
              { 
                id: 1, 
                name: latestReport.brandName || '我的品牌', 
                score: aiResult.overallScore || 72, 
                mentionRate: bossStats.value.mentionRate, 
                trend: 5, 
                isCurrentBrand: true 
              },
              ...competitors.slice(0, 3)
            ].sort((a, b) => b.score - a.score)
          }
        }
      }
    }
  } catch (e) {
    console.error('加载诊断报告数据到Hub失败:', e)
  }
}
</script>

<style scoped>
.hub-page {
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

.page-subtitle {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin-top: 4px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.brand-select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-elevated);
  color: var(--text-primary);
  font-size: 0.875rem;
}

.refresh-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.refresh-btn.spinning svg {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Role Tabs */
.role-tabs {
  display: flex;
  gap: 8px;
  padding: 20px 24px;
  max-width: 1400px;
  margin: 0 auto;
  background: var(--bg-elevated);
  border-radius: 12px;
  margin-bottom: 24px;
}

.role-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: var(--text-secondary);
}

.role-tab:hover {
  background: var(--bg-primary);
}

.role-tab.active {
  background: var(--color-primary);
  color: white;
}

.role-icon {
  font-size: 1rem;
}

.role-label {
  font-weight: 600;
  color: inherit;
}

.role-desc {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-left: 4px;
}

.role-tab.active .role-desc {
  color: rgba(255, 255, 255, 0.8);
}

/* Content */
.role-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Boss View - Metrics */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

@media (max-width: 1024px) {
  .metrics-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .metrics-grid { grid-template-columns: 1fr; }
}

.metric-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.metric-card.primary {
  background: rgba(22, 93, 255, 0.1);
  border-color: var(--color-primary);
}

.metric-card.primary .metric-label,
.metric-card.primary .metric-trend,
.metric-card.primary .metric-compare {
  color: var(--color-primary);
}

.metric-card.primary .metric-value {
  color: var(--color-primary);
}

.metric-card.primary .metric-bar-fill {
  background: var(--color-primary);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.metric-label {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.metric-trend {
  font-size: 0.75rem;
  font-weight: 600;
}

.metric-trend.positive { color: var(--color-success); }
.metric-trend.negative { color: var(--color-danger); }

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.metric-value.accent { color: var(--color-info); }
.metric-value.purple { color: var(--color-secondary); }
.metric-value.green { color: var(--color-success); }
.metric-value.primary { color: var(--color-primary); }

.metric-bar {
  height: 6px;
  background: var(--border-color);
  border-radius: 3px;
  margin: 12px 0;
  overflow: hidden;
}

.metric-bar-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.metric-bar-fill.blue { background: var(--color-info); }
.metric-bar-fill.purple { background: var(--color-secondary); }
.metric-bar-fill.green { background: var(--color-success); }

.metric-footer {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

/* Charts */
.charts-row {
  margin-bottom: 24px;
}

.chart-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
}

.chart-card.full {
  width: 100%;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-header h3 {
  font-size: 0.9375rem;
  font-weight: 600;
}

.period-select {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.75rem;
}

.chart-container {
  position: relative;
}

.trend-chart {
  width: 100%;
  height: 200px;
}

.grid-line {
  stroke: var(--border-color);
  stroke-width: 1;
  stroke-dasharray: 4;
}

.chart-line {
  fill: none;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.chart-line.blue { stroke: var(--color-info); }

.chart-point {
  fill: var(--color-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.chart-point:hover {
  r: 6;
}

/* Comparison */
.section-title {
  font-size: 0.9375rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.comparison-section {
  margin-bottom: 24px;
}

.comparison-table {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 60px 1fr 100px 100px 80px;
  padding: 12px 20px;
  background: var(--bg-primary);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.table-row {
  display: grid;
  grid-template-columns: 60px 1fr 100px 100px 80px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
  align-items: center;
  transition: background 0.2s ease;
}

.table-row:hover {
  background: var(--bg-primary);
}

.table-row.highlight {
  background: rgba(22, 93, 255, 0.1);
}

.rank {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  background: var(--bg-primary);
}

.rank.gold { background: rgba(245, 158, 11, 0.2); color: var(--color-warning); }
.rank.silver { background: rgba(156, 163, 175, 0.25); color: var(--text-secondary); }
.rank.bronze { background: rgba(180, 83, 9, 0.2); color: var(--color-warning); }

.brand-name {
  font-weight: 500;
}

.score {
  font-weight: 600;
  color: var(--color-primary);
}

.rate {
  color: var(--text-secondary);
}

.trend.up { color: var(--color-success); }
.trend.down { color: var(--color-danger); }

/* Ops View */
.ops-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

@media (max-width: 1024px) {
  .ops-grid { grid-template-columns: 1fr; }
}

.ops-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header h3 {
  font-size: 0.9375rem;
  font-weight: 600;
}

.badge {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 20px;
}

.badge.warning {
  background: rgba(245, 158, 11, 0.15);
  color: var(--color-warning);
}

.badge.success {
  background: rgba(16, 185, 129, 0.15);
  color: var(--color-success);
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-primary);
  border-radius: 12px;
}

.task-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.task-info {
  flex: 1;
}

.task-title {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 4px;
}

.task-meta {
  display: flex;
  gap: 8px;
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.task-style {
  color: var(--color-info);
}

.task-platform {
  color: var(--color-secondary);
}

.task-actions {
  display: flex;
  gap: 8px;
}

.task-btn {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.task-btn.approve {
  background: rgba(16, 185, 129, 0.15);
  color: var(--color-success);
}

.task-btn.approve:hover {
  background: var(--color-success);
  color: white;
}

.task-btn.reject {
  background: rgba(239, 68, 68, 0.15);
  color: var(--color-danger);
}

.task-btn.reject:hover {
  background: var(--color-danger);
  color: white;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.suggestion-item {
  display: flex;
  gap: 12px;
}

.step-num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.suggestion-content {
  flex: 1;
}

.suggestion-content p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 6px;
}

.suggestion-tag {
  font-size: 0.6875rem;
  padding: 2px 8px;
  border-radius: 4px;
}

.suggestion-tag.high {
  background: rgba(239, 68, 68, 0.15);
  color: var(--color-danger);
}

.suggestion-tag.medium {
  background: rgba(245, 158, 11, 0.15);
  color: var(--color-warning);
}

.suggestion-tag.low {
  background: rgba(107, 114, 128, 0.15);
  color: var(--text-tertiary);
}

/* Content Stats */
.content-stats {
  margin-bottom: 24px;
}

.stats-row {
  display: flex;
  gap: 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
}

.mini-stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.mini-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.mini-value.success { color: var(--color-success); }
.mini-value.warning { color: var(--color-warning); }

.mini-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 4px;
}

/* Tech View */
.tech-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

@media (max-width: 1024px) {
  .tech-grid { grid-template-columns: 1fr; }
}

.tech-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
}

.tech-task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tech-task-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: var(--bg-primary);
  border-radius: 12px;
}

.task-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.task-icon.completed {
  background: rgba(16, 185, 129, 0.15);
  color: var(--color-success);
}

.task-icon.pending {
  background: rgba(245, 158, 11, 0.15);
  color: var(--color-warning);
}

.task-icon.in-progress {
  background: rgba(22, 93, 255, 0.15);
  color: var(--color-info);
}

.tech-task-item .task-title {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 4px;
}

.tech-task-item .task-desc {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.task-status-badge {
  font-size: 0.6875rem;
  padding: 4px 8px;
  border-radius: 4px;
  margin-left: auto;
  flex-shrink: 0;
}

.task-status-badge.completed {
  background: rgba(16, 185, 129, 0.15);
  color: var(--color-success);
}

.task-status-badge.pending {
  background: rgba(245, 158, 11, 0.15);
  color: var(--color-warning);
}

/* Health Metrics */
.health-metrics {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.health-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.health-label {
  width: 80px;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.health-bar {
  flex: 1;
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.health-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.health-bar-fill.green { background: var(--color-success); }
.health-bar-fill.blue { background: var(--color-info); }
.health-bar-fill.purple { background: var(--color-secondary); }
.health-bar-fill.yellow { background: var(--color-warning); }

.health-value {
  width: 50px;
  text-align: right;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* Tech References */
.tech-references {
  margin-bottom: 24px;
}

.reference-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 1024px) {
  .reference-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .reference-grid { grid-template-columns: 1fr; }
}

.reference-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.ref-icon {
  font-size: 1.5rem;
}

.ref-info {
  flex: 1;
}

.ref-title {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 2px;
}

.ref-desc {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.ref-action {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ref-action:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}
</style>
