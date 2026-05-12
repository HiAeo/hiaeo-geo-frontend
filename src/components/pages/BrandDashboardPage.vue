<template>
  <div class="brand-dashboard">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">魔鲸GEO·AI品牌可见性数据看板</h1>
          <span class="page-subtitle">实时追踪品牌可见度、SEO效果与搜索引流数据</span>
        </div>
        <div class="header-actions">
          <button class="action-btn" @click="refreshData">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            刷新数据
          </button>
          <button class="action-btn primary" @click="$router.push('/app/diagnose')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            查看诊断报告
          </button>
        </div>
      </div>
    </div>

    <!-- Brand Health Overview -->
    <div class="health-section">
      <div class="health-main">
        <!-- Score Gauge -->
        <div class="health-gauge">
          <svg viewBox="0 0 200 120" class="gauge-svg">
            <defs>
              <linearGradient :id="'gaugeGradient'" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" :stop-color="gaugeColor"/>
                <stop offset="100%" :stop-color="gaugeColorEnd"/>
              </linearGradient>
            </defs>
            <path :d="gaugeBackgroundArc" fill="none" stroke="var(--border-color)" stroke-width="16" stroke-linecap="round"/>
            <path :d="gaugeScoreArc" fill="none" :stroke="'url(#gaugeGradient)'" stroke-width="16" stroke-linecap="round" class="gauge-animate"/>
          </svg>
          <div class="gauge-center">
            <span class="gauge-score">{{ overallScore }}</span>
            <span class="gauge-label">健康分</span>
          </div>
          <div class="gauge-trend" :class="trend >= 0 ? 'positive' : 'negative'">
            <svg v-if="trend >= 0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            {{ Math.abs(trend) }}分
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="health-stats">
          <div class="grade-badge" :class="'grade-' + grade">
            {{ gradeLabel }}
          </div>
          <div class="health-meta">
            <div class="meta-item">
              <span class="meta-label">最新诊断</span>
              <span class="meta-value">{{ latestReportDate }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">诊断次数</span>
              <span class="meta-value">{{ reports.length }}次</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">SEO评分</span>
              <span class="meta-value highlight">{{ seoScore }}</span>
            </div>
          </div>
        </div>

        <!-- Radar Chart -->
        <div class="radar-container">
          <svg viewBox="0 0 200 200" class="radar-svg">
            <!-- Background circles -->
            <circle cx="100" cy="100" r="80" fill="none" stroke="var(--border-color)" stroke-width="1"/>
            <circle cx="100" cy="100" r="60" fill="none" stroke="var(--border-color)" stroke-width="1"/>
            <circle cx="100" cy="100" r="40" fill="none" stroke="var(--border-color)" stroke-width="1"/>
            <circle cx="100" cy="100" r="20" fill="none" stroke="var(--border-color)" stroke-width="1"/>
            <!-- Axis lines -->
            <line v-for="(axis, i) in radarAxes" :key="'axis'+i" :x1="100" :y1="100" :x2="axis.x2" :y2="axis.y2" stroke="var(--border-color)" stroke-width="1"/>
            <!-- Data polygon -->
            <polygon :points="radarPoints" fill="rgba(99, 102, 241, 0.2)" stroke="var(--color-primary)" stroke-width="2"/>
            <!-- Data points -->
            <circle v-for="(point, i) in radarDataPoints" :key="'dp'+i" :cx="point.x" :cy="point.y" r="5" fill="var(--color-primary)" class="radar-point"/>
            <!-- Labels -->
            <text v-for="(axis, i) in radarAxes" :key="'label'+i" :x="axis.lx" :y="axis.ly" text-anchor="middle" class="radar-label">{{ axis.label }}</text>
          </svg>
        </div>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="stats-overview">
      <div class="stat-mini-card">
        <div class="stat-mini-icon organic">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <div class="stat-mini-content">
          <span class="stat-mini-value">{{ formatNumber(brandMetrics.organicTraffic) }}</span>
          <span class="stat-mini-label">自然搜索流量</span>
          <span class="stat-mini-trend positive">+{{ brandMetrics.organicGrowth }}%</span>
        </div>
      </div>
      <div class="stat-mini-card">
        <div class="stat-mini-icon keywords">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <div class="stat-mini-content">
          <span class="stat-mini-value">{{ brandMetrics.keywordsTracked }}</span>
          <span class="stat-mini-label">追踪关键词</span>
          <span class="stat-mini-trend positive">+{{ brandMetrics.keywordsGrowth }}</span>
        </div>
      </div>
      <div class="stat-mini-card">
        <div class="stat-mini-icon mentions">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <div class="stat-mini-content">
          <span class="stat-mini-value">{{ brandMetrics.mentions }}</span>
          <span class="stat-mini-label">品牌提及</span>
          <span class="stat-mini-trend" :class="brandMetrics.mentionsGrowth >= 0 ? 'positive' : 'negative'">
            {{ brandMetrics.mentionsGrowth >= 0 ? '+' : '' }}{{ brandMetrics.mentionsGrowth }}%
          </span>
        </div>
      </div>
      <div class="stat-mini-card">
        <div class="stat-mini-icon visibility">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
        <div class="stat-mini-content">
          <span class="stat-mini-value">{{ brandMetrics.visibility }}%</span>
          <span class="stat-mini-label">品牌可见度</span>
          <span class="stat-mini-trend positive">+{{ brandMetrics.visibilityGrowth }}%</span>
        </div>
      </div>
    </div>

    <!-- SEO Trend Chart -->
    <div class="seo-trend-section">
      <div class="chart-card flex-2">
        <div class="chart-header">
          <div class="chart-title-group">
            <h3>SEO 效果趋势</h3>
            <span class="chart-subtitle">关键词排名与流量变化追踪</span>
          </div>
          <div class="chart-controls">
            <div class="time-selector compact">
              <button :class="{ active: period === '7d' }" @click="period = '7d'">7天</button>
              <button :class="{ active: period === '30d' }" @click="period = '30d'">30天</button>
              <button :class="{ active: period === '90d' }" @click="period = '90d'">90天</button>
            </div>
            <div class="chart-legend">
              <span class="legend-item"><span class="dot purple"></span>排名指数</span>
              <span class="legend-item"><span class="dot green"></span>流量指数</span>
            </div>
          </div>
        </div>
        <div class="chart-container">
          <svg class="chart-svg" viewBox="0 0 500 180" preserveAspectRatio="none">
            <defs>
              <linearGradient id="purpleGradient2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="rgba(139, 92, 246, 0.3)"/>
                <stop offset="100%" stop-color="rgba(139, 92, 246, 0)"/>
              </linearGradient>
              <linearGradient id="greenGradient2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="rgba(16, 185, 129, 0.3)"/>
                <stop offset="100%" stop-color="rgba(16, 185, 129, 0)"/>
              </linearGradient>
            </defs>
            <line v-for="i in 4" :key="'g'+i" :x1="40" :y1="20 + (130/3)*(i-1)" :x2="480" :y2="20 + (130/3)*(i-1)" class="grid-line"/>
            <path :d="rankingAreaPath" fill="url(#purpleGradient2)"/>
            <path :d="rankingLinePath" class="chart-line purple"/>
            <path :d="trafficAreaPath" fill="url(#greenGradient2)"/>
            <path :d="trafficLinePath" class="chart-line green"/>
          </svg>
          <div class="chart-labels">
            <span v-for="(d, i) in filteredSeoTrendData" :key="'l'+i">{{ d.date }}</span>
          </div>
        </div>
      </div>

      <!-- Top Keywords -->
      <div class="chart-card flex-1">
        <div class="chart-header">
          <div class="chart-title-group">
            <h3>关键词 TOP 5</h3>
          </div>
        </div>
        <div class="keyword-ranking-list">
          <div v-for="(kw, index) in topKeywords" :key="kw.word" class="kw-ranking-item">
            <div class="kw-rank" :class="{ top3: index < 3 }">{{ index + 1 }}</div>
            <div class="kw-info">
              <span class="kw-word">{{ kw.word }}</span>
              <div class="kw-bar">
                <div class="kw-fill" :style="{ width: (kw.position / 50 * 100) + '%', background: getKeywordColor(kw.position) }"></div>
              </div>
            </div>
            <div class="kw-stats">
              <span class="kw-pos" :class="kw.trend >= 0 ? 'up' : 'down'">
                <svg v-if="kw.trend >= 0" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="18 15 12 9 6 15"/>
                </svg>
                <svg v-else width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
                {{ Math.abs(kw.trend) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Engines & Subscription -->
    <div class="bottom-section">
      <!-- AI Engines Usage -->
      <div class="engines-card">
        <div class="card-header">
          <h3>AI 引擎使用分布</h3>
        </div>
        <div class="engines-usage">
          <div v-for="engine in engines" :key="engine.name" class="engine-usage-item">
            <div class="engine-info">
              <div class="engine-icon-sm" :style="{ background: engine.color + '20', color: engine.color }">
                <img v-if="engine.logoUrl" :src="engine.logoUrl" :alt="engine.name" class="engine-logo-sm"/>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <span class="engine-name-sm">{{ engine.name }}</span>
            </div>
            <div class="engine-usage-bar">
              <div class="engine-usage-fill" :style="{ width: engine.usage + '%', background: engine.color }"></div>
            </div>
            <span class="engine-usage-pct">{{ engine.usage }}%</span>
          </div>
        </div>
      </div>

      <!-- Recent Reports -->
      <div class="reports-card">
        <div class="card-header">
          <h3>近期诊断报告</h3>
          <router-link to="/app/diagnose" class="view-all">查看全部</router-link>
        </div>
        <div class="reports-list">
          <div v-for="report in reports.slice(0, 5)" :key="report.id" class="report-item" @click="$router.push('/app/diagnose/' + report.id)">
            <div class="report-info">
              <span class="report-brand">{{ report.brandName }}</span>
              <span class="report-type">{{ report.type }}</span>
            </div>
            <div class="report-score">
              <div class="score-ring">
                <svg viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--border-color)" stroke-width="3"/>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" :stroke="getScoreColor(report.score)" stroke-width="3" :stroke-dasharray="report.score + ', 100'"/>
                </svg>
                <span class="score-num">{{ report.score }}</span>
              </div>
            </div>
            <div class="report-date">{{ report.date }}</div>
          </div>
          <div v-if="reports.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <p>暂无诊断报告</p>
            <button class="primary-btn small" @click="$router.push('/app/diagnose?new=true')">立即诊断</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Subscription Banner -->
    <div class="subscription-card">
      <div class="sub-info">
        <div class="sub-plan">
          <span class="plan-badge" :class="'plan-' + (subscription?.planId || 'free')">
            {{ subscription?.planName || '免费版' }}
          </span>
          <span v-if="subscription?.daysRemaining" class="sub-days">
            剩余 {{ subscription.daysRemaining }} 天
          </span>
        </div>
        <p class="sub-desc">解锁更多AI引擎、高级诊断维度与竞品追踪功能</p>
      </div>
      <button class="upgrade-btn" @click="$router.push('/app/pricing')">
        升级套餐
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '../../composables/useApi'
import { useTheme } from '../../composables/useTheme'

const { theme } = useTheme()
const { getCurrentSubscription } = useApi()

const subscription = ref(null)
const period = ref('30d')

onMounted(() => {
  loadReportData() // 加载诊断报告数据
})

const brandName = ref('我的品牌')
const overallScore = ref(0)
const seoScore = ref(0)
const grade = ref('-')
const trend = ref(0)
const latestReportDate = ref('-')

// 从诊断报告加载数据
const loadReportData = () => {
  try {
    const savedReports = localStorage.getItem('diagnose_reports')
    if (savedReports) {
      const reportsList = JSON.parse(savedReports)
      if (reportsList.length > 0) {
        // 获取最新报告
        const latestReport = reportsList[0]
        
        // 品牌名称
        brandName.value = latestReport.brandName || '我的品牌'
        
        // 从AI结果中获取分数
        const aiResult = latestReport.result
        if (aiResult) {
          overallScore.value = aiResult.overallScore || 0
          seoScore.value = Math.round((aiResult.overallScore || 0) * 0.95) // SEO分数近似
          latestReportDate.value = formatDate(latestReport.date)
          
          // 计算评分等级
          const score = aiResult.overallScore || 0
          if (score >= 85) {
            grade.value = 'A'
          } else if (score >= 70) {
            grade.value = 'B'
          } else if (score >= 60) {
            grade.value = 'C'
          } else {
            grade.value = 'D'
          }
          
          // 从报告维度计算趋势
          if (reportsList.length >= 2 && reportsList[1].result) {
            const prevScore = reportsList[1].result.overallScore || 0
            trend.value = Math.round(aiResult.overallScore - prevScore)
          }
          
          // 更新雷达图数据
          if (aiResult.dimensions) {
            radarData.value = aiResult.dimensions.map(d => d.score || 0)
            topDimensions.value = aiResult.dimensions.map(d => ({
              name: d.name,
              score: d.score || 0
            }))
          }
        }
        
        // 更新报告列表（用于显示）
        reports.value = reportsList.slice(0, 5).map((r, i) => {
          const score = r.result?.overallScore || r.score || 0
          let g = '-'
          if (score >= 85) g = 'A'
          else if (score >= 70) g = 'B'
          else if (score >= 60) g = 'C'
          else g = 'D'
          
          return {
            id: r.id || i,
            brandName: r.brandName || '我的品牌',
            type: r.type || '诊断报告',
            score,
            date: formatDate(r.date),
            grade: g
          }
        })
      }
    }
  } catch (e) {
    console.error('加载诊断报告数据失败:', e)
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

const brandMetrics = ref({
  organicTraffic: 12580,
  organicGrowth: 23,
  keywordsTracked: 156,
  keywordsGrowth: 12,
  mentions: 2847,
  mentionsGrowth: 15,
  visibility: 68,
  visibilityGrowth: 8
})

const topDimensions = ref([
  { name: '品牌认知', score: 82 },
  { name: '内容质量', score: 75 },
  { name: '用户互动', score: 68 },
  { name: '视觉一致性', score: 85 }
])

const engines = ref([
  { name: 'DeepSeek', usage: 85, avgScore: 76, calls: 1240, color: '#6366f1', logoUrl: '/ai-logos/deepseek-color.svg' },
  { name: 'Kimi', usage: 62, avgScore: 74, calls: 890, color: '#10b981', logoUrl: '/ai-logos/kimi-color.svg' },
  { name: 'Qwen', usage: 45, avgScore: 78, calls: 650, color: '#f59e0b', logoUrl: '/ai-logos/qwen-color.svg' },
  { name: '智谱 GLM', usage: 38, avgScore: 72, calls: 540, color: '#ec4899', logoUrl: '/ai-logos/zhipu-color.svg' },
  { name: '豆包', usage: 28, avgScore: 71, calls: 410, color: '#8b5cf6', logoUrl: '/ai-logos/doubao-color.svg' }
])

const reports = ref([
  { id: 1, brandName: '我的品牌', type: '完整诊断', score: 78, date: '2026-05-08', grade: 'B' },
  { id: 2, brandName: '我的品牌', type: '快速诊断', score: 75, date: '2026-04-25', grade: 'C' },
  { id: 3, brandName: '我的品牌', type: '完整诊断', score: 73, date: '2026-04-10', grade: 'C' },
  { id: 4, brandName: '我的品牌', type: '关键词诊断', score: 80, date: '2026-03-28', grade: 'B' }
])

const topKeywords = ref([
  { word: 'GEO优化工具', position: 8, trend: 5 },
  { word: '品牌可见度检测', position: 12, trend: 8 },
  { word: 'SEO效果分析', position: 15, trend: -2 },
  { word: '关键词排名查询', position: 18, trend: 3 },
  { word: '网站SEO诊断', position: 22, trend: 12 }
])

const seoTrendData7d = [
  { date: '05-06', ranking: 52, traffic: 48 },
  { date: '05-08', ranking: 55, traffic: 52 },
  { date: '05-10', ranking: 52, traffic: 48 },
  { date: '05-12', ranking: 62, traffic: 58 },
  { date: '05-14', ranking: 58, traffic: 55 },
  { date: '05-16', ranking: 68, traffic: 65 },
  { date: '05-18', ranking: 72, traffic: 68 }
]

const seoTrendData30d = [
  { date: '04-18', ranking: 32, traffic: 28 },
  { date: '04-22', ranking: 38, traffic: 35 },
  { date: '04-26', ranking: 42, traffic: 38 },
  { date: '04-30', ranking: 48, traffic: 42 },
  { date: '05-04', ranking: 48, traffic: 42 },
  { date: '05-08', ranking: 55, traffic: 52 },
  { date: '05-12', ranking: 62, traffic: 58 },
  { date: '05-16', ranking: 68, traffic: 65 }
]

const seoTrendData90d = [
  { date: '02-18', ranking: 18, traffic: 15 },
  { date: '03-01', ranking: 22, traffic: 20 },
  { date: '03-12', ranking: 28, traffic: 25 },
  { date: '03-22', ranking: 32, traffic: 30 },
  { date: '04-01', ranking: 35, traffic: 32 },
  { date: '04-12', ranking: 38, traffic: 35 },
  { date: '04-22', ranking: 42, traffic: 40 },
  { date: '05-02', ranking: 52, traffic: 48 },
  { date: '05-12', ranking: 62, traffic: 58 },
  { date: '05-16', ranking: 68, traffic: 65 }
]

const filteredSeoTrendData = computed(() => {
  switch (period.value) {
    case '7d': return seoTrendData7d
    case '90d': return seoTrendData90d
    default: return seoTrendData30d
  }
})

// Radar chart
const radarLabels = ['品牌认知', '内容质量', '用户互动', '视觉一致', '技术SEO', '社交媒体']
const radarData = ref([82, 75, 68, 85, 72, 78])

const radarAxes = computed(() => {
  const cx = 100, cy = 100, r = 70
  return radarLabels.map((label, i) => {
    const angle = (Math.PI * 2 * i / radarLabels.length) - Math.PI / 2
    return {
      x2: cx + r * Math.cos(angle),
      y2: cy + r * Math.sin(angle),
      lx: cx + (r + 18) * Math.cos(angle),
      ly: cy + (r + 18) * Math.sin(angle),
      label
    }
  })
})

const radarDataPoints = computed(() => {
  const cx = 100, cy = 100, r = 70
  return radarData.value.map((val, i) => {
    const angle = (Math.PI * 2 * i / radarData.value.length) - Math.PI / 2
    const radius = (val / 100) * r
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle)
    }
  })
})

const radarPoints = computed(() => {
  return radarDataPoints.value.map(p => `${p.x},${p.y}`).join(' ')
})

// SEO Trend chart
const maxRanking = computed(() => Math.max(...filteredSeoTrendData.value.map(d => d.ranking), 1))
const maxTraffic = computed(() => Math.max(...filteredSeoTrendData.value.map(d => d.traffic), 1))

const rankingPoints = computed(() => {
  const w = 440, h = 130
  return filteredSeoTrendData.value.map((d, i) => ({
    x: 40 + (w / (filteredSeoTrendData.value.length - 1)) * i,
    y: 20 + h - (d.ranking / maxRanking.value) * h
  }))
})

const trafficPoints = computed(() => {
  const w = 440, h = 130
  return filteredSeoTrendData.value.map((d, i) => ({
    x: 40 + (w / (filteredSeoTrendData.value.length - 1)) * i,
    y: 20 + h - (d.traffic / maxTraffic.value) * h
  }))
})

const rankingLinePath = computed(() => {
  if (rankingPoints.value.length === 0) return ''
  return rankingPoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
})

const rankingAreaPath = computed(() => {
  if (rankingPoints.value.length === 0) return ''
  const bottomY = 150
  return `${rankingLinePath.value} L ${rankingPoints.value[rankingPoints.value.length - 1].x} ${bottomY} L ${rankingPoints.value[0].x} ${bottomY} Z`
})

const trafficLinePath = computed(() => {
  if (trafficPoints.value.length === 0) return ''
  return trafficPoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
})

const trafficAreaPath = computed(() => {
  if (trafficPoints.value.length === 0) return ''
  const bottomY = 150
  return `${trafficLinePath.value} L ${trafficPoints.value[trafficPoints.value.length - 1].x} ${bottomY} L ${trafficPoints.value[0].x} ${bottomY} Z`
})

const gradeLabel = computed(() => {
  const labels = { A: '优秀', B: '良好', C: '一般', D: '较差', F: '不合格' }
  return labels[grade.value] || grade.value
})

const gaugeColor = computed(() => {
  if (overallScore.value >= 85) return '#10b981'
  if (overallScore.value >= 70) return '#6366f1'
  if (overallScore.value >= 55) return '#f59e0b'
  return '#ef4444'
})

const gaugeColorEnd = computed(() => {
  if (overallScore.value >= 85) return '#34d399'
  if (overallScore.value >= 70) return '#818cf8'
  if (overallScore.value >= 55) return '#fbbf24'
  return '#f87171'
})

const gaugeBackgroundArc = computed(() => {
  const cx = 100, cy = 110, r = 70
  const startAngle = 180, endAngle = 360
  const x1 = cx + r * Math.cos(Math.PI * startAngle / 180)
  const y1 = cy + r * Math.sin(Math.PI * startAngle / 180)
  const x2 = cx + r * Math.cos(Math.PI * endAngle / 180)
  const y2 = cy + r * Math.sin(Math.PI * endAngle / 180)
  return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`
})

const gaugeScoreArc = computed(() => {
  const cx = 100, cy = 110, r = 70
  const startAngle = 180
  const endAngle = 180 + (overallScore.value / 100) * 180
  const x1 = cx + r * Math.cos(Math.PI * startAngle / 180)
  const y1 = cy + r * Math.sin(Math.PI * startAngle / 180)
  const x2 = cx + r * Math.cos(Math.PI * endAngle / 180)
  const y2 = cy + r * Math.sin(Math.PI * endAngle / 180)
  return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`
})

const getDimColor = (score) => {
  if (score >= 80) return 'var(--color-success)'
  if (score >= 65) return 'var(--color-primary)'
  if (score >= 50) return 'var(--color-warning)'
  return 'var(--color-danger)'
}

const getScoreClass = (score) => {
  if (score >= 85) return 'high'
  if (score >= 70) return 'mid'
  return 'low'
}

const getScoreColor = (score) => {
  if (score >= 85) return '#10b981'
  if (score >= 70) return '#6366f1'
  if (score >= 55) return '#f59e0b'
  return '#ef4444'
}

const getKeywordColor = (position) => {
  if (position <= 10) return 'var(--color-success)'
  if (position <= 20) return 'var(--color-primary)'
  if (position <= 30) return 'var(--color-warning)'
  return 'var(--color-danger)'
}

const formatNumber = (num) => {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num?.toLocaleString() || '0'
}

const exportReport = () => {
  const data = {
    exportTime: new Date().toISOString(),
    brandName: brandName.value,
    overallScore: overallScore.value,
    seoScore: seoScore.value,
    metrics: brandMetrics.value,
    topKeywords: topKeywords.value,
    reports: reports.value
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `brand-report-${brandName.value}-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const refreshData = () => {
  loadReportData()
  // 重新计算统计数据
  brandMetrics.value = {
    organicTraffic: Math.floor(Math.random() * 20000) + 10000,
    organicGrowth: Math.floor(Math.random() * 30) + 10,
    keywordsTracked: Math.floor(Math.random() * 100) + 100,
    keywordsGrowth: Math.floor(Math.random() * 20) + 5,
    mentions: Math.floor(Math.random() * 5000) + 2000,
    mentionsGrowth: Math.floor(Math.random() * 30) - 10,
    visibility: Math.floor(Math.random() * 30) + 50,
    visibilityGrowth: Math.floor(Math.random() * 15) + 3
  }
}

onMounted(async () => {
  try {
    const subData = await getCurrentSubscription()
    subscription.value = subData
  } catch (error) {
    console.error('Failed to load subscription:', error)
  }
})
</script>

<style scoped>
.brand-dashboard {
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
  max-width: 1600px;
  margin: 0 auto;
  gap: 24px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.page-subtitle {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  border-radius: 8px;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.action-btn.primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  font-weight: 600;
}

.action-btn.primary:hover {
  opacity: 0.9;
  border-color: var(--color-primary);
  color: white;
}

.action-btn.small {
  padding: 6px 10px;
  font-size: 0.75rem;
}

.deploy-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
}

.deploy-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
}

/* Legacy button styles for compatibility */
.export-btn,
.secondary-btn,
.team-btn {
  composes: action-btn;
}

.primary-btn {
  composes: action-btn primary;
}

/* Health Section */
.health-section {
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px;
}

.health-main {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 32px;
  display: flex;
  align-items: center;
  gap: 40px;
}

@media (max-width: 1200px) {
  .health-main { flex-wrap: wrap; justify-content: center; }
}

.health-gauge {
  position: relative;
  width: 200px;
  flex-shrink: 0;
}

.gauge-svg {
  width: 200px;
  height: 120px;
}

.gauge-center {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gauge-score {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
}

.gauge-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

.gauge-trend {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.gauge-trend.positive {
  background: rgba(16, 185, 129, 0.15);
  color: var(--color-success);
}

.gauge-trend.negative {
  background: rgba(239, 68, 68, 0.15);
  color: var(--color-danger);
}

.health-stats {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.grade-badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 20px;
  border-radius: 10px;
  font-size: 1.125rem;
  font-weight: 700;
  width: fit-content;
}

.grade-A { background: rgba(16, 185, 129, 0.15); color: var(--color-success); }
.grade-B { background: rgba(99, 102, 241, 0.15); color: var(--color-primary); }
.grade-C { background: rgba(245, 158, 11, 0.15); color: var(--color-warning); }
.grade-D { background: rgba(239, 68, 68, 0.15); color: var(--color-danger); }
.grade-F { background: rgba(107, 114, 128, 0.15); color: var(--text-secondary); }

.health-meta {
  display: flex;
  gap: 32px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.meta-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.meta-value.highlight {
  color: var(--color-primary);
}

/* Radar Chart */
.radar-container {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
}

.radar-svg {
  width: 100%;
  height: 100%;
}

.radar-label {
  font-size: 0.625rem;
  fill: var(--text-secondary);
}

.radar-point {
  cursor: pointer;
  transition: all 0.2s ease;
}

.radar-point:hover {
  r: 7;
}

.gauge-animate {
  transition: all 1s ease;
}

/* Stats Overview */
.stats-overview {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 24px 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 1200px) {
  .stats-overview { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .stats-overview { grid-template-columns: 1fr; }
}

.stat-mini-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-mini-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-mini-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-mini-icon.organic { background: rgba(16, 185, 129, 0.15); color: #059669; }
.stat-mini-icon.keywords { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; }
.stat-mini-icon.mentions { background: rgba(236, 72, 153, 0.15); color: #ec4899; }
.stat-mini-icon.visibility { background: rgba(99, 102, 241, 0.15); color: #6366f1; }

.stat-mini-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-mini-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
}

.stat-mini-label {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.stat-mini-trend {
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 4px;
}

.stat-mini-trend.positive { color: var(--color-success); }
.stat-mini-trend.negative { color: var(--color-danger); }

/* SEO Trend Section */
.seo-trend-section {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 24px 24px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

@media (max-width: 1200px) {
  .seo-trend-section { grid-template-columns: 1fr; }
}

.chart-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.chart-title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chart-title-group h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.chart-subtitle {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
}

.chart-legend {
  display: flex;
  gap: 16px;
}

.chart-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.time-selector.compact {
  display: flex;
  gap: 2px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  padding: 2px;
  border-radius: 6px;
}

.time-selector.compact button {
  padding: 4px 8px;
  font-size: 0.6875rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.time-selector.compact button.active {
  background: var(--color-primary);
  color: white;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.legend-item .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-item .dot.purple { background: #8b5cf6; }
.legend-item .dot.green { background: #10b981; }

.chart-container {
  position: relative;
}

.chart-svg {
  width: 100%;
  height: 180px;
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

.chart-line.purple { stroke: #8b5cf6; }
.chart-line.green { stroke: #10b981; }

.chart-labels {
  display: flex;
  justify-content: space-between;
  padding: 8px 40px 0;
}

.chart-labels span {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
}

/* Keyword Ranking List */
.keyword-ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.kw-ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: var(--bg-primary);
  border-radius: 10px;
}

.kw-rank {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  background: var(--bg-elevated);
  color: var(--text-secondary);
  flex-shrink: 0;
}

.kw-rank.top3 {
  background: linear-gradient(135deg, var(--color-primary), #8b5cf6);
  color: white;
}

.kw-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.kw-word {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kw-bar {
  height: 4px;
  background: var(--border-color);
  border-radius: 2px;
  overflow: hidden;
}

.kw-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease;
}

.kw-stats {
  flex-shrink: 0;
}

.kw-pos {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.kw-pos.up { color: var(--color-success); }
.kw-pos.down { color: var(--color-danger); }

/* Bottom Section */
.bottom-section {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 24px 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 1024px) {
  .bottom-section { grid-template-columns: 1fr; }
}

.engines-card,
.reports-card {
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
  color: var(--text-primary);
}

.view-all {
  font-size: 0.8125rem;
  color: var(--color-primary);
  cursor: pointer;
  text-decoration: none;
}

.view-all:hover {
  text-decoration: underline;
}

/* Engine Usage */
.engines-usage {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.engine-usage-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.engine-info {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100px;
  flex-shrink: 0;
}

.engine-icon-sm {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.engine-logo-sm {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.engine-name-sm {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-primary);
}

.engine-usage-bar {
  flex: 1;
  height: 6px;
  background: var(--border-color);
  border-radius: 3px;
  overflow: hidden;
}

.engine-usage-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.engine-usage-pct {
  width: 40px;
  text-align: right;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* Reports List */
.reports-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.report-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-primary);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.report-item:hover {
  background: var(--border-color);
}

.report-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.report-brand {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.report-type {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.report-score {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.score-ring {
  position: relative;
  width: 100%;
  height: 100%;
}

.score-ring svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.score-num {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-primary);
}

.report-date {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px;
  color: var(--text-tertiary);
  text-align: center;
}

.empty-state p {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Subscription Card */
.subscription-card {
  max-width: 1600px;
  margin: 0 auto 24px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 16px;
  padding: 20px 24px;
}

.sub-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sub-plan {
  display: flex;
  align-items: center;
  gap: 12px;
}

.plan-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.plan-free {
  background: var(--bg-elevated);
  color: var(--text-secondary);
}

.plan-basic { background: rgba(16, 185, 129, 0.15); color: var(--color-success); }
.plan-pro { background: rgba(99, 102, 241, 0.15); color: var(--color-primary); }
.plan-enterprise { background: rgba(245, 158, 11, 0.15); color: var(--color-warning); }

.sub-days {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.sub-desc {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin: 0;
}

.upgrade-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.upgrade-btn:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}
</style>
