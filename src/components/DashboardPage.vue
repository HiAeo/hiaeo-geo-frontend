<template>
  <div class="dashboard-page" :data-theme="theme">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">数据看板</h1>
          <div class="time-selector">
            <button :class="{ active: period === '7d' }" @click="period = '7d'">近7天</button>
            <button :class="{ active: period === '30d' }" @click="period = '30d'">近30天</button>
            <button :class="{ active: period === '90d' }" @click="period = '90d'">近90天</button>
          </div>
        </div>
        <div class="header-actions">
          <button class="export-btn" @click="exportData">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            导出报告
          </button>
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

    <!-- Stats Cards -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon total">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.totalUsers }}</span>
            <span class="stat-label">总用户数</span>
            <div class="stat-trend">
              <span class="trend-badge positive">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="18 15 12 9 6 15"/>
                </svg>
                +12%
              </span>
              <span class="trend-period">较上周</span>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon active">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.activeUsers }}</span>
            <span class="stat-label">活跃用户</span>
            <div class="stat-trend">
              <span class="trend-badge positive">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="18 15 12 9 6 15"/>
                </svg>
                +8%
              </span>
              <span class="trend-period">较上周</span>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon diagnose">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.totalDiagnoses }}</span>
            <span class="stat-label">总诊断数</span>
            <div class="stat-trend">
              <span class="trend-badge positive">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="18 15 12 9 6 15"/>
                </svg>
                +23%
              </span>
              <span class="trend-period">较上周</span>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon credits">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ formatNumber(stats.totalCredits) }}</span>
            <span class="stat-label">总积分消耗</span>
            <div class="stat-trend">
              <span class="trend-badge negative">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
                -3%
              </span>
              <span class="trend-period">较上周</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="charts-section">
      <!-- User Growth Chart -->
      <div class="chart-card flex-2">
        <div class="chart-header">
          <div class="chart-title-group">
            <h3>用户增长趋势</h3>
            <span class="chart-subtitle">新增注册与活跃用户对比</span>
          </div>
          <div class="chart-legend">
            <span class="legend-item"><span class="dot purple"></span>新增用户</span>
            <span class="legend-item"><span class="dot green"></span>活跃用户</span>
          </div>
        </div>
        <div class="chart-container">
          <svg class="chart-svg" viewBox="0 0 600 220" preserveAspectRatio="none">
            <defs>
              <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="rgba(139, 92, 246, 0.3)"/>
                <stop offset="100%" stop-color="rgba(139, 92, 246, 0)"/>
              </linearGradient>
              <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="rgba(16, 185, 129, 0.3)"/>
                <stop offset="100%" stop-color="rgba(16, 185, 129, 0)"/>
              </linearGradient>
            </defs>
            <line v-for="i in 4" :key="'g'+i" :x1="50" :y1="30 + (150/3)*(i-1)" :x2="580" :y2="30 + (150/3)*(i-1)" class="grid-line"/>
            <!-- Active users area and line -->
            <path :d="activeAreaPath" fill="url(#greenGradient)"/>
            <path :d="activeLinePath" class="chart-line green"/>
            <!-- New users area and line -->
            <path :d="newUserAreaPath" fill="url(#purpleGradient)"/>
            <path :d="newUserLinePath" class="chart-line purple"/>
            <!-- Points -->
            <circle v-for="(p, i) in activePoints" :key="'ac'+i" :cx="p.x" :cy="p.y" r="4" class="chart-point green" @mouseenter="showTooltip($event, '活跃: ' + p.value)" @mouseleave="hideTooltip"/>
            <circle v-for="(p, i) in newUserPoints" :key="'nc'+i" :cx="p.x" :cy="p.y" r="4" class="chart-point purple" @mouseenter="showTooltip($event, '新增: ' + p.value)" @mouseleave="hideTooltip"/>
          </svg>
          <div class="chart-labels">
            <span v-for="(d, i) in chartData" :key="'l'+i">{{ formatChartDate(d.date) }}</span>
          </div>
          <!-- Tooltip -->
          <div v-if="tooltip.show" class="chart-tooltip" :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }">
            {{ tooltip.text }}
          </div>
        </div>
      </div>

      <!-- Subscription Distribution -->
      <div class="chart-card flex-1">
        <div class="chart-header">
          <div class="chart-title-group">
            <h3>订阅分布</h3>
            <span class="chart-subtitle">用户等级占比</span>
          </div>
        </div>
        <div class="subscription-pie">
          <svg viewBox="0 0 200 200" class="pie-svg">
            <circle v-for="(segment, i) in pieSegments" :key="'s'+i"
              cx="100" cy="100" r="80"
              fill="none"
              :stroke="segment.color"
              stroke-width="40"
              :stroke-dasharray="segment.dash"
              :stroke-dashoffset="segment.offset"
              :style="{ transform: 'rotate(-90deg)', transformOrigin: '100px 100px' }"
            />
            <circle cx="100" cy="100" r="50" fill="var(--bg-elevated)"/>
            <text x="100" y="95" text-anchor="middle" class="pie-total">{{ stats.totalUsers }}</text>
            <text x="100" y="115" text-anchor="middle" class="pie-label">用户</text>
          </svg>
          <div class="pie-legend">
            <div class="legend-item" v-for="tier in tierDistribution" :key="tier.name">
              <span class="legend-dot" :style="{ background: tier.color }"></span>
              <span class="legend-label">{{ tier.name }}</span>
              <span class="legend-value">{{ tier.count }} ({{ tier.percent }}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SEO Metrics Section -->
    <div class="seo-section">
      <div class="section-header">
        <div class="chart-title-group">
          <h2>SEO 效果趋势</h2>
          <span class="chart-subtitle">关键词排名与流量变化追踪</span>
        </div>
      </div>
      <div class="seo-grid">
        <!-- Keyword Ranking Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title-group">
              <h3>关键词排名 TOP 10</h3>
            </div>
            <select v-model="selectedKeywordPeriod" class="period-select">
              <option value="7d">近7天</option>
              <option value="30d">近30天</option>
            </select>
          </div>
          <div class="keyword-list">
            <div v-for="(kw, index) in topKeywords" :key="kw.word" class="keyword-item">
              <div class="keyword-rank">{{ index + 1 }}</div>
              <div class="keyword-info">
                <span class="keyword-word">{{ kw.word }}</span>
                <div class="keyword-bar">
                  <div class="keyword-fill" :style="{ width: (kw.position / 100 * 100) + '%', background: getKeywordColor(kw.position) }"></div>
                </div>
              </div>
              <div class="keyword-stats">
                <span class="keyword-pos" :class="kw.trend >= 0 ? 'up' : 'down'">
                  <svg v-if="kw.trend >= 0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="18 15 12 9 6 15"/>
                  </svg>
                  <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                  {{ Math.abs(kw.trend) }}
                </span>
                <span class="keyword-volume">{{ formatNumber(kw.volume) }} 搜索量</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Traffic Trend -->
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title-group">
              <h3>网站流量趋势</h3>
            </div>
          </div>
          <div class="traffic-stats">
            <div class="traffic-main">
              <span class="traffic-value">{{ formatNumber(trafficData.total) }}</span>
              <span class="traffic-label">总访问量</span>
            </div>
            <div class="traffic-breakdown">
              <div class="traffic-item">
                <span class="traffic-dot organic"></span>
                <span class="traffic-name">自然搜索</span>
                <span class="traffic-count">{{ formatNumber(trafficData.organic) }}</span>
                <span class="traffic-percent">{{ Math.round(trafficData.organic / trafficData.total * 100) }}%</span>
              </div>
              <div class="traffic-item">
                <span class="traffic-dot direct"></span>
                <span class="traffic-name">直接访问</span>
                <span class="traffic-count">{{ formatNumber(trafficData.direct) }}</span>
                <span class="traffic-percent">{{ Math.round(trafficData.direct / trafficData.total * 100) }}%</span>
              </div>
              <div class="traffic-item">
                <span class="traffic-dot referral"></span>
                <span class="traffic-name">引荐链接</span>
                <span class="traffic-count">{{ formatNumber(trafficData.referral) }}</span>
                <span class="traffic-percent">{{ Math.round(trafficData.referral / trafficData.total * 100) }}%</span>
              </div>
            </div>
          </div>
          <div class="traffic-chart">
            <svg class="traffic-svg" viewBox="0 0 400 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="rgba(99, 102, 241, 0.4)"/>
                  <stop offset="100%" stop-color="rgba(99, 102, 241, 0)"/>
                </linearGradient>
              </defs>
              <path :d="trafficAreaPath" fill="url(#trafficGradient)"/>
              <path :d="trafficLinePath" class="traffic-line"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity & Top Users -->
    <div class="bottom-section">
      <!-- Recent Activity -->
      <div class="activity-card">
        <div class="card-header">
          <h3>最近活动</h3>
          <span class="live-indicator">
            <span class="live-dot"></span>
            实时更新
          </span>
        </div>
        <div class="activity-list">
          <div v-for="activity in recentActivity" :key="activity.id" class="activity-item">
            <div class="activity-icon" :class="activity.type">
              <svg v-if="activity.type === 'register'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              <svg v-else-if="activity.type === 'diagnose'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <svg v-else-if="activity.type === 'upgrade'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <svg v-else-if="activity.type === 'credits'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <div class="activity-content">
              <span class="activity-text">{{ activity.text }}</span>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
            <div class="activity-badge" :class="activity.type">{{ getActivityLabel(activity.type) }}</div>
          </div>
        </div>
      </div>

      <!-- Top Users by Diagnoses -->
      <div class="top-users-card">
        <div class="card-header">
          <h3>活跃用户 TOP 5</h3>
          <span class="card-subtitle">诊断次数排行</span>
        </div>
        <div class="top-users-list">
          <div v-for="(user, index) in topUsers" :key="user.id" class="top-user-item">
            <div class="rank" :class="{ gold: index === 0, silver: index === 1, bronze: index === 2 }">
              {{ index + 1 }}
            </div>
            <div class="user-avatar">
              {{ user.nickname?.charAt(0) || user.email?.charAt(0) }}
            </div>
            <div class="user-info">
              <span class="user-name">{{ user.nickname || user.email }}</span>
              <span class="user-tier" :class="user.subscriptionTier">{{ getTierLabel(user.subscriptionTier) }}</span>
            </div>
            <div class="user-stats">
              <span class="stats-value">{{ user.diagnoseCount }}</span>
              <span class="stats-label">次诊断</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '../composables/useApi'
import { useTheme } from '../composables/useTheme'

const { theme } = useTheme()
const { getAdminStats } = useApi()

const loading = ref(false)
const period = ref('7d')
const selectedKeywordPeriod = ref('30d')
const tooltip = ref({ show: false, x: 0, y: 0, text: '' })

const stats = ref({
  totalUsers: 128,
  activeUsers: 96,
  totalCredits: 778500,
  totalDiagnoses: 452,
  monthlyRevenue: 28500,
  freeUsers: 58,
  proUsers: 45,
  enterpriseUsers: 25
})

const chartData = ref([
  { date: '05-02', newUsers: 12, activeUsers: 85 },
  { date: '05-03', newUsers: 18, activeUsers: 88 },
  { date: '05-04', newUsers: 15, activeUsers: 82 },
  { date: '05-05', newUsers: 25, activeUsers: 95 },
  { date: '05-06', newUsers: 22, activeUsers: 90 },
  { date: '05-07', newUsers: 30, activeUsers: 98 },
  { date: '05-08', newUsers: 28, activeUsers: 96 }
])

const recentActivity = ref([
  { id: 1, type: 'diagnose', text: 'Emma 完成了品牌"A公司"的全维度诊断', time: '2分钟前' },
  { id: 2, type: 'register', text: '新用户 kate@example.com 注册成功', time: '5分钟前' },
  { id: 3, type: 'credits', text: 'Henry 充值了 2000 积分', time: '15分钟前' },
  { id: 4, type: 'upgrade', text: 'Jack 升级为 Pro 套餐', time: '1小时前' },
  { id: 5, type: 'diagnose', text: 'Alice 完成了关键词"SEO工具"的排名查询', time: '2小时前' },
  { id: 6, type: 'register', text: '新用户 alex@example.com 注册成功', time: '3小时前' }
])

const topUsers = ref([
  { id: 1, email: 'emma@example.com', nickname: 'Emma Sun', subscriptionTier: 'enterprise', diagnoseCount: 48 },
  { id: 2, email: 'henry@example.com', nickname: 'Henry Wu', subscriptionTier: 'enterprise', diagnoseCount: 35 },
  { id: 3, email: 'alice@example.com', nickname: 'Alice Chen', subscriptionTier: 'pro', diagnoseCount: 28 },
  { id: 4, email: 'jack@example.com', nickname: 'Jack Lin', subscriptionTier: 'pro', diagnoseCount: 22 },
  { id: 5, email: 'grace@example.com', nickname: 'Grace Yang', subscriptionTier: 'pro', diagnoseCount: 18 }
])

const topKeywords = ref([
  { word: 'GEO优化工具', position: 8, trend: 5, volume: 12580 },
  { word: '品牌可见度检测', position: 12, trend: 8, volume: 8920 },
  { word: 'SEO效果分析', position: 15, trend: -2, volume: 15600 },
  { word: '关键词排名查询', position: 18, trend: 3, volume: 22300 },
  { word: '网站SEO诊断', position: 22, trend: 12, volume: 18900 },
  { word: '内容优化建议', position: 25, trend: -5, volume: 7800 },
  { word: '搜索引擎优化', position: 28, trend: 0, volume: 45000 },
  { word: '品牌营销工具', position: 32, trend: 7, volume: 5600 },
  { word: 'AI写作SEO', position: 35, trend: 15, volume: 4200 },
  { word: 'SEO自动优化', position: 40, trend: -3, volume: 3100 }
])

const trafficData = ref({
  total: 45680,
  organic: 28500,
  direct: 10200,
  referral: 6980
})

const trafficTrend = ref([35, 42, 38, 55, 48, 62, 58, 72, 68, 85, 78, 92, 88])

// Computed for user growth chart
const maxActiveValue = computed(() => Math.max(...chartData.value.map(d => d.activeUsers), 1))
const maxNewValue = computed(() => Math.max(...chartData.value.map(d => d.newUsers), 1))

const activePoints = computed(() => {
  const w = 530, h = 150
  return chartData.value.map((d, i) => ({
    x: 50 + (w / (chartData.value.length - 1)) * i,
    y: 30 + h - (d.activeUsers / maxActiveValue.value) * h,
    value: d.activeUsers
  }))
})

const newUserPoints = computed(() => {
  const w = 530, h = 150
  return chartData.value.map((d, i) => ({
    x: 50 + (w / (chartData.value.length - 1)) * i,
    y: 30 + h - (d.newUsers / maxNewValue.value) * h,
    value: d.newUsers
  }))
})

const activeLinePath = computed(() => {
  if (activePoints.value.length === 0) return ''
  return activePoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
})

const activeAreaPath = computed(() => {
  if (activePoints.value.length === 0) return ''
  const bottomY = 180
  return `${activeLinePath.value} L ${activePoints.value[activePoints.value.length - 1].x} ${bottomY} L ${activePoints.value[0].x} ${bottomY} Z`
})

const newUserLinePath = computed(() => {
  if (newUserPoints.value.length === 0) return ''
  return newUserPoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
})

const newUserAreaPath = computed(() => {
  if (newUserPoints.value.length === 0) return ''
  const bottomY = 180
  return `${newUserLinePath.value} L ${newUserPoints.value[newUserPoints.value.length - 1].x} ${bottomY} L ${newUserPoints.value[0].x} ${bottomY} Z`
})

// Traffic chart
const maxTraffic = computed(() => Math.max(...trafficTrend.value, 1))
const trafficPoints = computed(() => {
  const w = 380, h = 80
  return trafficTrend.value.map((v, i) => ({
    x: 10 + (w / (trafficTrend.value.length - 1)) * i,
    y: 10 + h - (v / maxTraffic.value) * h
  }))
})

const trafficLinePath = computed(() => {
  if (trafficPoints.value.length === 0) return ''
  return trafficPoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
})

const trafficAreaPath = computed(() => {
  if (trafficPoints.value.length === 0) return ''
  const bottomY = 90
  return `${trafficLinePath.value} L ${trafficPoints.value[trafficPoints.value.length - 1].x} ${bottomY} L ${trafficPoints.value[0].x} ${bottomY} Z`
})

const pieSegments = computed(() => {
  const total = stats.value.totalUsers || 1
  const circumference = 2 * Math.PI * 80
  let offset = 0
  
  const segments = [
    { value: stats.value.freeUsers, color: '#6b7280' },
    { value: stats.value.proUsers, color: '#f59e0b' },
    { value: stats.value.enterpriseUsers, color: '#8b5cf6' }
  ]
  
  return segments.map(s => {
    const dash = (s.value / total) * circumference
    const result = { ...s, dash: `${dash} ${circumference - dash}`, offset: -offset }
    offset += dash
    return result
  })
})

const tierDistribution = computed(() => {
  const total = stats.value.totalUsers || 1
  return [
    { name: 'Free', count: stats.value.freeUsers, percent: Math.round(stats.value.freeUsers / total * 100), color: '#6b7280' },
    { name: 'Pro', count: stats.value.proUsers, percent: Math.round(stats.value.proUsers / total * 100), color: '#f59e0b' },
    { name: 'Enterprise', count: stats.value.enterpriseUsers, percent: Math.round(stats.value.enterpriseUsers / total * 100), color: '#8b5cf6' }
  ]
})

const showTooltip = (event, text) => {
  const rect = event.target.getBoundingClientRect()
  tooltip.value = {
    show: true,
    x: rect.left + 10,
    y: rect.top - 30,
    text
  }
}

const hideTooltip = () => {
  tooltip.value.show = false
}

const refreshData = async () => {
  loading.value = true
  try {
    const result = await getAdminStats()
    stats.value = { ...stats.value, ...result }
  } catch (error) {
    console.error('Failed to refresh data:', error)
  } finally {
    loading.value = false
  }
}

const exportData = () => {
  const data = {
    exportTime: new Date().toISOString(),
    period: period.value,
    stats: stats.value,
    topKeywords: topKeywords.value,
    trafficData: trafficData.value
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const formatNumber = (num) => {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  return num?.toLocaleString() || '0'
}

const formatChartDate = (date) => date

const getTierLabel = (tier) => {
  const labels = { free: 'Free', pro: 'Pro', enterprise: 'Enterprise' }
  return labels[tier] || tier
}

const getKeywordColor = (position) => {
  if (position <= 10) return 'var(--color-success)'
  if (position <= 20) return 'var(--color-primary)'
  if (position <= 30) return 'var(--color-warning)'
  return 'var(--color-danger)'
}

const getActivityLabel = (type) => {
  const labels = { register: '注册', diagnose: '诊断', upgrade: '升级', credits: '积分', login: '登录' }
  return labels[type] || type
}

onMounted(() => { refreshData() })
</script>

<style scoped>
.dashboard-page {
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
  gap: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 700;
}

.time-selector {
  display: flex;
  gap: 4px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  padding: 4px;
  border-radius: 10px;
}

.time-selector button {
  padding: 6px 14px;
  font-size: 0.8125rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.time-selector button.active {
  background: var(--color-primary);
  color: white;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: 10px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.export-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
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

/* Stats */
.stats-section {
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 1200px) {
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
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.total { background: rgba(99, 102, 241, 0.15); color: #4f46e5; }
.stat-icon.active { background: rgba(16, 185, 129, 0.15); color: #059669; }
.stat-icon.credits { background: rgba(245, 158, 11, 0.15); color: #d97706; }
.stat-icon.diagnose { background: rgba(236, 72, 153, 0.15); color: #ec4899; }

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.2;
}

.stat-label {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
}

.trend-badge {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.trend-badge.positive { background: rgba(16, 185, 129, 0.15); color: #059669; }
.trend-badge.negative { background: rgba(239, 68, 68, 0.15); color: #dc2626; }

.trend-period {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
}

/* Charts */
.charts-section {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 24px 24px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

@media (max-width: 1200px) {
  .charts-section { grid-template-columns: 1fr; }
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
  height: 220px;
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

.chart-point {
  cursor: pointer;
  transition: all 0.2s ease;
}

.chart-point.purple { fill: #8b5cf6; }
.chart-point.green { fill: #10b981; }

.chart-point:hover {
  r: 6;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  padding: 8px 50px 0;
}

.chart-labels span {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
}

.chart-tooltip {
  position: fixed;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  pointer-events: none;
}

/* Subscription Pie */
.subscription-pie {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.pie-svg {
  width: 180px;
  height: 180px;
}

.pie-total {
  font-size: 1.5rem;
  font-weight: 700;
  fill: var(--text-primary);
}

.pie-label {
  font-size: 0.8125rem;
  fill: var(--text-secondary);
}

.pie-legend {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.875rem;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-value {
  margin-left: auto;
  font-weight: 600;
  color: var(--text-primary);
}

/* SEO Section */
.seo-section {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 24px 24px;
}

.section-header {
  margin-bottom: 16px;
}

.seo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 1200px) {
  .seo-grid { grid-template-columns: 1fr; }
}

.period-select {
  padding: 6px 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.8125rem;
  color: var(--text-primary);
  cursor: pointer;
}

/* Keyword List */
.keyword-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.keyword-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: var(--bg-primary);
  border-radius: 10px;
  transition: all 0.2s ease;
}

.keyword-item:hover {
  background: var(--border-color);
}

.keyword-rank {
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

.keyword-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.keyword-word {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.keyword-bar {
  height: 4px;
  background: var(--border-color);
  border-radius: 2px;
  overflow: hidden;
}

.keyword-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease;
}

.keyword-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
}

.keyword-pos {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 0.875rem;
  font-weight: 600;
}

.keyword-pos.up { color: var(--color-success); }
.keyword-pos.down { color: var(--color-danger); }

.keyword-volume {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
}

/* Traffic Stats */
.traffic-stats {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.traffic-main {
  display: flex;
  flex-direction: column;
}

.traffic-value {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
}

.traffic-label {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.traffic-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.traffic-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
}

.traffic-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.traffic-dot.organic { background: #10b981; }
.traffic-dot.direct { background: #6366f1; }
.traffic-dot.referral { background: #f59e0b; }

.traffic-name {
  color: var(--text-secondary);
  width: 60px;
}

.traffic-count {
  font-weight: 600;
  color: var(--text-primary);
}

.traffic-percent {
  color: var(--text-tertiary);
  font-size: 0.75rem;
}

.traffic-chart {
  margin-top: 10px;
}

.traffic-svg {
  width: 100%;
  height: 100px;
}

.traffic-line {
  fill: none;
  stroke: var(--color-primary);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

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

.activity-card,
.top-users-card {
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

.card-subtitle {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--color-success);
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-success);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: var(--bg-primary);
  border-radius: 10px;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon.register { background: rgba(16, 185, 129, 0.15); color: #059669; }
.activity-icon.diagnose { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; }
.activity-icon.upgrade { background: rgba(245, 158, 11, 0.15); color: #d97706; }
.activity-icon.credits { background: rgba(99, 102, 241, 0.15); color: #4f46e5; }

.activity-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.activity-text {
  font-size: 0.8125rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-time {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
}

.activity-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 600;
  flex-shrink: 0;
}

.activity-badge.register { background: rgba(16, 185, 129, 0.15); color: #059669; }
.activity-badge.diagnose { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; }
.activity-badge.upgrade { background: rgba(245, 158, 11, 0.15); color: #d97706; }
.activity-badge.credits { background: rgba(99, 102, 241, 0.15); color: #4f46e5; }

/* Top Users */
.top-users-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.top-user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-primary);
  border-radius: 10px;
  transition: all 0.2s ease;
}

.top-user-item:hover {
  background: var(--border-color);
}

.rank {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  font-weight: 700;
  background: var(--bg-elevated);
  flex-shrink: 0;
}

.rank.gold { background: linear-gradient(135deg, #f59e0b, #fbbf24); color: white; }
.rank.silver { background: linear-gradient(135deg, #9ca3af, #d1d5db); color: white; }
.rank.bronze { background: linear-gradient(135deg, #b45309, #d97706); color: white; }

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-tier {
  font-size: 0.6875rem;
  padding: 2px 8px;
  border-radius: 4px;
  width: fit-content;
}

.user-tier.free { background: rgba(107, 114, 128, 0.15); color: #6b7280; }
.user-tier.pro { background: rgba(245, 158, 11, 0.15); color: #d97706; }
.user-tier.enterprise { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; }

.user-stats {
  text-align: right;
  flex-shrink: 0;
}

.stats-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-primary);
  display: block;
}

.stats-label {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
}
</style>
