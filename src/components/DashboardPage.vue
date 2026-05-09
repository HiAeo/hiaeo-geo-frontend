<template>
  <div class="dashboard-page" :data-theme="theme">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">仪表盘</h1>
        <div class="header-actions">
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
            <span class="stat-change positive">+12%</span>
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
            <span class="stat-change positive">+8%</span>
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
            <span class="stat-label">总积分</span>
            <span class="stat-change negative">-3%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon revenue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">¥{{ formatNumber(stats.monthlyRevenue) }}</span>
            <span class="stat-label">月收入</span>
            <span class="stat-change positive">+15%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="charts-section">
      <!-- User Growth Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>用户增长趋势</h3>
          <div class="chart-tabs">
            <button :class="{ active: period === '7d' }" @click="period = '7d'">近7天</button>
            <button :class="{ active: period === '30d' }" @click="period = '30d'">近30天</button>
          </div>
        </div>
        <div class="chart-container">
          <svg class="chart-svg" viewBox="0 0 600 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="rgba(99, 102, 241, 0.3)"/>
                <stop offset="100%" stop-color="rgba(99, 102, 241, 0)"/>
              </linearGradient>
            </defs>
            <line v-for="i in 4" :key="'g'+i" :x1="50" :y1="20 + (160/3)*(i-1)" :x2="580" :y2="20 + (160/3)*(i-1)" class="grid-line"/>
            <path :d="areaPath" fill="url(#areaGradient)"/>
            <path :d="linePath" class="chart-line"/>
            <circle v-for="(p, i) in points" :key="'c'+i" :cx="p.x" :cy="p.y" r="4" class="chart-point"/>
          </svg>
          <div class="chart-labels">
            <span v-for="(d, i) in chartData" :key="'l'+i">{{ formatChartDate(d.date) }}</span>
          </div>
        </div>
      </div>

      <!-- Subscription Distribution -->
      <div class="chart-card subscription-chart">
        <div class="chart-header">
          <h3>订阅分布</h3>
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
            <div class="legend-item">
              <span class="legend-dot" style="background: #6366f1"></span>
              <span class="legend-label">Free</span>
              <span class="legend-value">{{ stats.freeUsers }} ({{ Math.round(stats.freeUsers/stats.totalUsers*100) || 0 }}%)</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #f59e0b"></span>
              <span class="legend-label">Pro</span>
              <span class="legend-value">{{ stats.proUsers }} ({{ Math.round(stats.proUsers/stats.totalUsers*100) || 0 }}%)</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #8b5cf6"></span>
              <span class="legend-label">Enterprise</span>
              <span class="legend-value">{{ stats.enterpriseUsers }} ({{ Math.round(stats.enterpriseUsers/stats.totalUsers*100) || 0 }}%)</span>
            </div>
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
          </div>
        </div>
      </div>

      <!-- Top Users by Credits -->
      <div class="top-users-card">
        <div class="card-header">
          <h3>积分排行 TOP 5</h3>
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
            <div class="user-credits">
              <span class="credits-value">{{ formatNumber(user.credits) }}</span>
              <span class="credits-label">积分</span>
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

// 使用全局主题状态
const { theme } = useTheme()

const { getAdminStats } = useApi()

const loading = ref(false)
const period = ref('7d')

const stats = ref({
  totalUsers: 10,
  activeUsers: 9,
  totalCredits: 77850,
  monthlyRevenue: 28500,
  freeUsers: 3,
  proUsers: 4,
  enterpriseUsers: 3
})

const chartData = ref([
  { date: '05-02', value: 12 },
  { date: '05-03', value: 18 },
  { date: '05-04', value: 15 },
  { date: '05-05', value: 25 },
  { date: '05-06', value: 22 },
  { date: '05-07', value: 30 },
  { date: '05-08', value: 28 }
])

const recentActivity = ref([
  { id: 1, type: 'register', text: '用户 ivy@example.com 注册', time: '5分钟前' },
  { id: 2, type: 'credits', text: '用户 alice@example.com 充值 1000 积分', time: '15分钟前' },
  { id: 3, type: 'upgrade', text: '用户 jack@example.com 升级为 Pro', time: '1小时前' },
  { id: 4, type: 'register', text: '用户 newuser@example.com 注册', time: '2小时前' },
  { id: 5, type: 'credits', text: '用户 bob@example.com 消耗 500 积分', time: '3小时前' }
])

const topUsers = ref([
  { id: 1, email: 'emma@example.com', nickname: 'Emma Sun', subscriptionTier: 'enterprise', credits: 25000 },
  { id: 2, email: 'henry@example.com', nickname: 'Henry Wu', subscriptionTier: 'enterprise', credits: 18000 },
  { id: 3, email: 'alice@example.com', nickname: 'Alice Chen', subscriptionTier: 'enterprise', credits: 15000 },
  { id: 4, email: 'jack@example.com', nickname: 'Jack Lin', subscriptionTier: 'pro', credits: 6200 },
  { id: 5, email: 'grace@example.com', nickname: 'Grace Yang', subscriptionTier: 'pro', credits: 4800 }
])

const maxValue = computed(() => Math.max(...chartData.value.map(d => d.value), 1))

const points = computed(() => {
  const w = 530
  const h = 160
  return chartData.value.map((d, i) => ({
    x: 50 + (w / (chartData.value.length - 1)) * i,
    y: 20 + h - (d.value / maxValue.value) * h
  }))
})

const linePath = computed(() => {
  if (points.value.length === 0) return ''
  return points.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
})

const areaPath = computed(() => {
  if (points.value.length === 0) return ''
  const bottomY = 180
  const first = points.value[0]
  const last = points.value[points.value.length - 1]
  return `${linePath.value} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`
})

const pieSegments = computed(() => {
  const total = stats.value.totalUsers || 1
  const circumference = 2 * Math.PI * 80
  let offset = 0
  
  const segments = [
    { value: stats.value.freeUsers, color: '#6366f1' },
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

const formatNumber = (num) => {
  return num?.toLocaleString() || '0'
}

const formatChartDate = (date) => {
  return date
}

const getTierLabel = (tier) => {
  const labels = { free: 'Free', pro: 'Pro', enterprise: 'Enterprise' }
  return labels[tier] || tier
}

onMounted(() => {
  refreshData()
})
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
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 700;
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
.stat-icon.revenue { background: rgba(139, 92, 246, 0.15); color: #7c3aed; }

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

.stat-change {
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 4px;
}

.stat-change.positive { color: #059669; }
.stat-change.negative { color: #dc2626; }

/* Charts */
.charts-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px 24px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

@media (max-width: 1024px) {
  .charts-section { grid-template-columns: 1fr; }
}

.chart-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  font-size: 0.9375rem;
  font-weight: 600;
}

.chart-tabs {
  display: flex;
  gap: 4px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  padding: 4px;
  border-radius: 8px;
}

.chart-tabs button {
  padding: 6px 12px;
  font-size: 0.75rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chart-tabs button.active {
  background: var(--color-primary);
  color: white;
}

.chart-container {
  position: relative;
}

.chart-svg {
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
  stroke: #6366f1;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.chart-point {
  fill: #6366f1;
  cursor: pointer;
}

.chart-point:hover {
  fill: #4f46e5;
  r: 6;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  padding: 8px 0 0;
}

.chart-labels span {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
}

/* Subscription Pie */
.subscription-chart {
  min-height: 280px;
}

.subscription-pie {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.pie-svg {
  width: 160px;
  height: 160px;
}

.pie-total {
  font-size: 1.25rem;
  font-weight: 700;
  fill: var(--text-primary);
}

.pie-label {
  font-size: 0.75rem;
  fill: var(--text-secondary);
}

.pie-legend {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-label {
  color: var(--text-secondary);
}

.legend-value {
  margin-left: auto;
  font-weight: 600;
}

/* Bottom Section */
.bottom-section {
  max-width: 1400px;
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
  margin-bottom: 16px;
}

.card-header h3 {
  font-size: 0.9375rem;
  font-weight: 600;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
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
.activity-icon.upgrade { background: rgba(245, 158, 11, 0.15); color: #d97706; }
.activity-icon.credits { background: rgba(99, 102, 241, 0.15); color: #4f46e5; }

.activity-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.activity-text {
  font-size: 0.8125rem;
  color: var(--text-primary);
}

.activity-time {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
}

/* Top Users */
.top-users-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.top-user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: var(--bg-primary);
  border-radius: 10px;
}

.rank {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  background: var(--bg-elevated);
}

.rank.gold { background: rgba(245, 158, 11, 0.2); color: #d97706; }
.rank.silver { background: rgba(156, 163, 175, 0.25); color: #6b7280; }
.rank.bronze { background: rgba(180, 83, 9, 0.2); color: #b45309; }

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary, #8b5cf6));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.user-tier {
  font-size: 0.6875rem;
  padding: 2px 6px;
  border-radius: 4px;
  width: fit-content;
}

.user-tier.free { background: rgba(107, 114, 128, 0.15); color: #6b7280; }
.user-tier.pro { background: rgba(245, 158, 11, 0.15); color: #d97706; }
.user-tier.enterprise { background: rgba(139, 92, 246, 0.15); color: #7c3aed; }

.user-credits {
  text-align: right;
}

.credits-value {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-primary);
}

.credits-label {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
  display: block;
}
</style>
