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
        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-label">GEO健康分</span>
            <span class="metric-trend positive">↑ 8%</span>
          </div>
          <div class="metric-value">{{ bossStats.geoScore }}</div>
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
            <svg class="trend-chart" viewBox="0 0 760 260" preserveAspectRatio="none">
              <defs>
                <linearGradient id="bossAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="rgba(22, 93, 255, 0.25)"/>
                  <stop offset="100%" stop-color="rgba(22, 93, 255, 0)"/>
                </linearGradient>
                <linearGradient id="industryAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="rgba(107, 114, 128, 0.15)"/>
                  <stop offset="100%" stop-color="rgba(107, 114, 128, 0)"/>
                </linearGradient>
              </defs>

              <!-- Y轴 -->
              <line x1="60" y1="20" x2="60" y2="210" class="axis-line"/>
              <!-- X轴 -->
              <line x1="60" y1="210" x2="720" y2="210" class="axis-line"/>

              <!-- Y轴网格线和标签 -->
              <g v-for="i in 5" :key="'yg'+i">
                <line :x1="60" :y1="20 + (190/4)*(i-1)" :x2="720" :y2="20 + (190/4)*(i-1)" class="grid-line"/>
                <text :x="50" :y="20 + (190/4)*(i-1) + 4" class="axis-label" text-anchor="end">{{ yAxisLabels[i-1] }}</text>
              </g>

              <!-- X轴标签 -->
              <text v-for="(d, i) in visibilityData" :key="'xl'+i"
                :x="60 + (660 / (visibilityData.length - 1)) * i"
                :y="230"
                class="axis-label"
                text-anchor="middle">{{ d.date }}</text>

              <!-- 行业平均线区域 -->
              <path :d="industryAreaPath" fill="url(#industryAreaGrad)"/>
              <!-- 行业平均线 -->
              <path :d="industryLinePath" class="chart-line industry"/>

              <!-- 品牌可见度区域 -->
              <path :d="visibilityAreaPath" fill="url(#bossAreaGrad)"/>
              <!-- 品牌可见度线 -->
              <path :d="visibilityLinePath" class="chart-line blue"/>

              <!-- 数据点 -->
              <circle v-for="(p, i) in visibilityPoints" :key="'c'+i" :cx="p.x" :cy="p.y" r="5" class="chart-point" @mouseenter="showTooltip(i)" @mouseleave="hideTooltip"/>
              <!-- 行业平均数据点 -->
              <circle v-for="(p, i) in industryPoints" :key="'ic'+i" :cx="p.x" :cy="p.y" r="3" class="chart-point industry"/>

              <!-- 数据标签 -->
              <text v-for="(p, i) in visibilityPoints" :key="'tv'+i"
                :x="p.x" :y="p.y - 12"
                class="data-label"
                text-anchor="middle">{{ visibilityData[i].value }}</text>
            </svg>

            <!-- 图例 -->
            <div class="chart-legend">
              <div class="legend-item">
                <span class="legend-dot brand"></span>
                <span class="legend-text">本品牌可见度</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot industry"></span>
                <span class="legend-text">行业平均</span>
              </div>
            </div>

            <!-- 统计摘要 -->
            <div class="chart-summary">
              <div class="summary-item">
                <span class="summary-label">当前分数</span>
                <span class="summary-value">{{ visibilityData[visibilityData.length-1]?.value || 0 }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">较上期</span>
                <span class="summary-value" :class="visibilityTrend >= 0 ? 'up' : 'down'">
                  {{ visibilityTrend >= 0 ? '+' : '' }}{{ visibilityTrend }}%
                </span>
              </div>
              <div class="summary-item">
                <span class="summary-label">最高分</span>
                <span class="summary-value">{{ maxVisibility }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">平均分</span>
                <span class="summary-value">{{ avgVisibility }}</span>
              </div>
            </div>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useApi } from '../../composables/useApi'
import { useTheme } from '../../composables/useTheme'

// 使用全局主题状态
const { theme } = useTheme()

const props = defineProps({
  theme: { type: String, default: 'dark' }
})

const { get } = useApi()
const loading = ref(false)
const error = ref(null)
const activeRole = ref('boss')
const selectedBrandId = ref('')
const bossPeriod = ref('30d')

const roles = [
  { id: 'boss', label: '老板视图', icon: '📊', desc: '数据总览' },
  { id: 'ops', label: '运营视图', icon: '⚡', desc: '内容运营' },
  { id: 'tech', label: '技术视图', icon: '🔧', desc: '系统指引' }
]

// API 数据源
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

// 行业平均数据（模拟）
const industryData = ref([
  { date: '05-01', value: 48 },
  { date: '05-05', value: 50 },
  { date: '05-10', value: 52 },
  { date: '05-15', value: 53 },
  { date: '05-20', value: 55 },
  { date: '05-25', value: 56 },
  { date: '05-28', value: 57 }
])

// Computed
const maxVisibility = computed(() => Math.max(...visibilityData.value.map(d => d.value), 1))
const avgVisibility = computed(() => {
  const sum = visibilityData.value.reduce((acc, d) => acc + d.value, 0)
  return (sum / visibilityData.value.length).toFixed(1)
})
const visibilityTrend = computed(() => {
  if (visibilityData.value.length < 2) return 0
  const last = visibilityData.value[visibilityData.value.length - 1].value
  const prev = visibilityData.value[visibilityData.value.length - 2].value
  return (((last - prev) / prev) * 100).toFixed(1)
})

// Y轴标签（0-100分）
const yAxisLabels = computed(() => {
  return [100, 75, 50, 25, 0]
})

const visibilityPoints = computed(() => {
  const w = 660
  const h = 190
  return visibilityData.value.map((d, i) => ({
    x: 60 + (w / (visibilityData.value.length - 1)) * i,
    y: 20 + h - (d.value / 100) * h
  }))
})

const industryPoints = computed(() => {
  const w = 660
  const h = 190
  return industryData.value.map((d, i) => ({
    x: 60 + (w / (industryData.value.length - 1)) * i,
    y: 20 + h - (d.value / 100) * h
  }))
})

const visibilityLinePath = computed(() => {
  if (visibilityPoints.value.length === 0) return ''
  return visibilityPoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
})

const industryLinePath = computed(() => {
  if (industryPoints.value.length === 0) return ''
  return industryPoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
})

const visibilityAreaPath = computed(() => {
  if (visibilityPoints.value.length === 0) return ''
  const bottomY = 210
  const first = visibilityPoints.value[0]
  const last = visibilityPoints.value[visibilityPoints.value.length - 1]
  return `${visibilityLinePath.value} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`
})

const industryAreaPath = computed(() => {
  if (industryPoints.value.length === 0) return ''
  const bottomY = 210
  const first = industryPoints.value[0]
  const last = industryPoints.value[industryPoints.value.length - 1]
  return `${industryLinePath.value} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`
})

// Methods
const loadBossView = async () => {
  try {
    const res = await get(`/hub/boss-view?brandId=${selectedBrandId.value}`)
    if (res?.success && res.data?.stats) {
      const stats = res.data.stats
      bossStats.value = {
        geoScore: stats.geoScore ?? 72,
        industryAvg: stats.industryAvg ?? 65,
        mentionRate: stats.mentionRate ?? 34,
        mentionTarget: stats.mentionTarget ?? 50,
        competitorSuppression: stats.competitorSuppression ?? 12,
        competitorCount: stats.competitorCount ?? 3,
        roi: stats.roi ?? 23
      }
    }
  } catch (e) {
    console.error('加载老板视图数据失败:', e)
    // 使用默认值，保持页面可展示
  }
}

const loadBrandRanking = async () => {
  try {
    const res = await get('/hub/brand-ranking')
    if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
      brandRanking.value = res.data.map((item, index) => ({
        id: item.id || index + 1,
        name: item.name || `品牌${index + 1}`,
        score: item.score ?? 72,
        mentionRate: item.mentionRate ?? 34,
        trend: item.trend ?? 0,
        isCurrentBrand: item.isCurrentBrand ?? (index === 0)
      }))
    }
  } catch (e) {
    console.error('加载品牌排名失败:', e)
  }
}

const loadVisibilityTrend = async () => {
  try {
    const res = await get(`/hub/visibility-trend?period=${bossPeriod.value}`)
    if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
      visibilityData.value = res.data.map(item => ({
        date: item.date || item.label || '',
        value: item.value || item.score || 0
      }))
    }
  } catch (e) {
    console.error('加载可见度趋势失败:', e)
  }
}

const loadOpsView = async () => {
  try {
    const res = await get(`/hub/ops-view?brandId=${selectedBrandId.value}`)
    if (res?.success && res.data) {
      // 运营统计数据
      if (res.data.stats) {
        opsStats.value = {
          pendingCount: res.data.stats.pendingCount ?? 3,
          totalContent: res.data.stats.totalContent ?? 24,
          publishedContent: res.data.stats.publishedContent ?? 18,
          pendingContent: res.data.stats.pendingContent ?? 6,
          avgEngagement: res.data.stats.avgEngagement ?? 12.5
        }
      }
      // 待审核任务
      if (Array.isArray(res.data.pendingTasks) && res.data.pendingTasks.length > 0) {
        pendingTasks.value = res.data.pendingTasks.map(task => ({
          id: task.id || Date.now(),
          title: task.title || task.name || '未命名任务',
          style: task.style || task.platform || '待定',
          platform: task.platform || '待定',
          impact: task.impact || task.score || 0,
          status: task.status || 'pending'
        }))
      }
      // 运营建议
      if (Array.isArray(res.data.suggestions) && res.data.suggestions.length > 0) {
        suggestions.value = res.data.suggestions.map(sug => ({
          text: sug.text || sug.content || sug.action || '',
          tag: sug.tag || sug.priority || '建议',
          priority: sug.priority === '高' || sug.priority === 'high' ? 'high' : 
                     sug.priority === '中' || sug.priority === 'medium' ? 'medium' : 'low'
        }))
      }
    }
  } catch (e) {
    console.error('加载运营视图数据失败:', e)
  }
}

const loadTechView = async () => {
  try {
    const res = await get(`/hub/tech-view?brandId=${selectedBrandId.value}`)
    if (res?.success && res.data) {
      // 技术统计数据
      if (res.data.stats) {
        techStats.value = {
          pendingTasks: res.data.stats.pendingTasks ?? 2,
          apiHealth: res.data.stats.apiHealth ?? 95,
          crawlerScore: res.data.stats.crawlerScore ?? 88,
          schemaScore: res.data.stats.schemaScore ?? 75,
          performance: res.data.stats.performance ?? 92
        }
      }
      // 技术任务
      if (Array.isArray(res.data.tasks) && res.data.tasks.length > 0) {
        techTasks.value = res.data.tasks.map(task => ({
          id: task.id || Date.now(),
          title: task.title || task.name || '未命名任务',
          description: task.description || task.desc || '',
          status: task.status || 'pending'
        }))
      }
      // 技术参考
      if (Array.isArray(res.data.references) && res.data.references.length > 0) {
        techReferences.value = res.data.references.map(ref => ({
          type: ref.type || 'default',
          icon: ref.icon || '📋',
          title: ref.title || ref.name || '参考',
          description: ref.description || ref.desc || ''
        }))
      }
    }
  } catch (e) {
    console.error('加载技术视图数据失败:', e)
  }
}

const loadAllData = async () => {
  loading.value = true
  error.value = null
  try {
    // 根据角色加载对应视图数据
    switch (activeRole.value) {
      case 'boss':
        await Promise.all([loadBossView(), loadBrandRanking(), loadVisibilityTrend()])
        break
      case 'ops':
        await loadOpsView()
        break
      case 'tech':
        await loadTechView()
        break
    }
  } catch (e) {
    console.error('加载数据失败:', e)
    error.value = e.message || '加载数据失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const refreshData = async () => {
  await loadAllData()
}

const onBrandChange = () => {
  refreshData()
}

// 监听角色切换，重新加载对应视图数据
watch(activeRole, () => {
  loadAllData()
})

// 监听时间周期变化，重新加载可见度趋势
watch(bossPeriod, () => {
  if (activeRole.value === 'boss') {
    loadVisibilityTrend()
  }
})

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
  loadAllData()
})
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
.chart-line.industry { stroke: var(--text-tertiary); stroke-dasharray: 6 4; stroke-width: 2; }

.axis-line {
  stroke: var(--border-color);
  stroke-width: 1;
}

.axis-label {
  fill: var(--text-tertiary);
  font-size: 10px;
}

.data-label {
  fill: var(--color-info);
  font-size: 11px;
  font-weight: 600;
}

.chart-point {
  fill: var(--color-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.chart-point.industry {
  fill: var(--text-tertiary);
}

.chart-point:hover {
  r: 7;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-dot.brand {
  background: var(--color-info);
}

.legend-dot.industry {
  background: var(--text-tertiary);
}

.chart-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 16px;
  padding: 16px;
  background: var(--bg-primary);
  border-radius: 12px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.summary-label {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.summary-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.summary-value.up {
  color: var(--color-success);
}

.summary-value.down {
  color: var(--color-danger);
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
