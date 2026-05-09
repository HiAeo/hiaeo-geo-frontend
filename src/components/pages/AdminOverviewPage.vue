<template>
  <div class="admin-overview">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">运营概览</h1>
        <div class="header-actions">
          <div class="period-selector">
            <button :class="{ active: period === '7d' }" @click="period = '7d'">近7天</button>
            <button :class="{ active: period === '30d' }" @click="period = '30d'">近30天</button>
          </div>
          <button class="refresh-btn" @click="refreshData">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-section">
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon total">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="kpi-body">
            <span class="kpi-value">{{ stats.totalUsers }}</span>
            <span class="kpi-label">总用户数</span>
            <span class="kpi-change positive">+{{ stats.userGrowth }}%</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon active">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="kpi-body">
            <span class="kpi-value">{{ stats.activeUsers }}</span>
            <span class="kpi-label">活跃用户</span>
            <span class="kpi-change positive">+{{ stats.activeGrowth }}%</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon credits">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
          <div class="kpi-body">
            <span class="kpi-value">{{ formatNumber(stats.totalCredits) }}</span>
            <span class="kpi-label">平台总积分</span>
            <span class="kpi-change negative">-{{ stats.creditsChange }}%</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon revenue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div class="kpi-body">
            <span class="kpi-value">¥{{ formatNumber(stats.monthlyRevenue) }}</span>
            <span class="kpi-label">月收入</span>
            <span class="kpi-change positive">+{{ stats.revenueGrowth }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="charts-section">
      <div class="chart-card wide">
        <div class="chart-header">
          <h3>用户增长趋势</h3>
          <div class="chart-tabs">
            <button :class="{ active: chartPeriod === '7d' }" @click="chartPeriod = '7d'">近7天</button>
            <button :class="{ active: chartPeriod === '30d' }" @click="chartPeriod = '30d'">近30天</button>
          </div>
        </div>
        <div class="chart-container">
          <svg class="chart-svg" viewBox="0 0 600 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="adminAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="rgba(99, 102, 241, 0.3)"/>
                <stop offset="100%" stop-color="rgba(99, 102, 241, 0)"/>
              </linearGradient>
            </defs>
            <line v-for="i in 4" :key="'g'+i" :x1="50" :y1="20 + (160/3)*(i-1)" :x2="580" :y2="20 + (160/3)*(i-1)" class="grid-line"/>
            <path :d="areaPath" fill="url(#adminAreaGrad)"/>
            <path :d="linePath" class="chart-line"/>
            <circle v-for="(p, i) in points" :key="'c'+i" :cx="p.x" :cy="p.y" r="4" class="chart-point"/>
          </svg>
          <div class="chart-labels">
            <span v-for="(d, i) in chartData" :key="'l'+i">{{ d.date }}</span>
          </div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <h3>订阅分布</h3>
        </div>
        <div class="pie-container">
          <svg viewBox="0 0 200 200" class="pie-svg">
            <circle v-for="(seg, i) in pieSegments" :key="'s'+i"
              cx="100" cy="100" r="80" fill="none" :stroke="seg.color"
              stroke-width="40" :stroke-dasharray="seg.dash" :stroke-dashoffset="seg.offset"
              :style="{ transform: 'rotate(-90deg)', transformOrigin: '100px 100px' }"
            />
            <circle cx="100" cy="100" r="50" fill="var(--bg-primary)"/>
            <text x="100" y="95" text-anchor="middle" class="pie-total">{{ stats.totalUsers }}</text>
            <text x="100" y="115" text-anchor="middle" class="pie-label">用户</text>
          </svg>
          <div class="pie-legend">
            <div v-for="tier in tiers" :key="tier.name" class="legend-item">
              <span class="legend-dot" :style="{ background: tier.color }"></span>
              <span class="legend-label">{{ tier.name }}</span>
              <span class="legend-value">{{ tier.count }} ({{ Math.round(tier.count/stats.totalUsers*100) || 0 }}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="activity-section">
      <div class="activity-card">
        <div class="card-header">
          <h3>最近活动</h3>
          <router-link to="/manage/users" class="view-all">查看全部</router-link>
        </div>
        <div class="activity-list">
          <div v-for="act in recentActivity" :key="act.id" class="activity-item">
            <div class="act-icon" :class="act.type">
              <svg v-if="act.type === 'register'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              <svg v-else-if="act.type === 'upgrade'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
            </div>
            <div class="act-content">
              <span class="act-text">{{ act.text }}</span>
              <span class="act-time">{{ act.time }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="top-users-card">
        <div class="card-header">
          <h3>积分排行 TOP 5</h3>
        </div>
        <div class="top-list">
          <div v-for="(user, i) in topUsers" :key="user.id" class="top-item">
            <div class="rank" :class="'rank-' + (i+1)">{{ i+1 }}</div>
            <div class="user-avatar">{{ user.nickname?.charAt(0) || 'U' }}</div>
            <div class="user-info">
              <span class="user-name">{{ user.nickname || user.email }}</span>
              <span class="user-tier" :class="user.tier">{{ user.tierLabel }}</span>
            </div>
            <div class="user-credits">{{ formatNumber(user.credits) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const period = ref('7d')
const chartPeriod = ref('7d')

const stats = ref({
  totalUsers: 10,
  activeUsers: 9,
  totalCredits: 77850,
  monthlyRevenue: 28500,
  userGrowth: 12,
  activeGrowth: 8,
  creditsChange: 3,
  revenueGrowth: 15
})

const chartData = ref([
  { date: '05-02', value: 12 }, { date: '05-03', value: 18 }, { date: '05-04', value: 15 },
  { date: '05-05', value: 25 }, { date: '05-06', value: 22 }, { date: '05-07', value: 30 }, { date: '05-08', value: 28 }
])

const recentActivity = ref([
  { id: 1, type: 'register', text: '用户 ivy@example.com 注册', time: '5分钟前' },
  { id: 2, type: 'credits', text: '用户 alice@example.com 充值 1000 积分', time: '15分钟前' },
  { id: 3, type: 'upgrade', text: '用户 jack@example.com 升级为 Pro', time: '1小时前' },
  { id: 4, type: 'register', text: '用户 newuser@example.com 注册', time: '2小时前' },
  { id: 5, type: 'credits', text: '用户 bob@example.com 消耗 500 积分', time: '3小时前' }
])

const topUsers = ref([
  { id: 1, email: 'emma@example.com', nickname: 'Emma Sun', tier: 'enterprise', tierLabel: 'Enterprise', credits: 25000 },
  { id: 2, email: 'henry@example.com', nickname: 'Henry Wu', tier: 'enterprise', tierLabel: 'Enterprise', credits: 18000 },
  { id: 3, email: 'alice@example.com', nickname: 'Alice Chen', tier: 'enterprise', tierLabel: 'Enterprise', credits: 15000 },
  { id: 4, email: 'jack@example.com', nickname: 'Jack Lin', tier: 'pro', tierLabel: 'Pro', credits: 6200 },
  { id: 5, email: 'grace@example.com', nickname: 'Grace Yang', tier: 'pro', tierLabel: 'Pro', credits: 4800 }
])

const tiers = [
  { name: 'Free', count: 3, color: 'var(--color-primary)' },
  { name: 'Pro', count: 4, color: 'var(--color-warning)' },
  { name: 'Enterprise', count: 3, color: 'var(--color-secondary)' }
]

const maxValue = computed(() => Math.max(...chartData.value.map(d => d.value), 1))

const points = computed(() => {
  const w = 530, h = 160
  return chartData.value.map((d, i) => ({
    x: 50 + (w / (chartData.value.length - 1)) * i,
    y: 20 + h - (d.value / maxValue.value) * h
  }))
})

const linePath = computed(() => points.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '))

const areaPath = computed(() => {
  if (!points.value.length) return ''
  const last = points.value[points.value.length - 1]
  const first = points.value[0]
  return `${linePath.value} L ${last.x} 180 L ${first.x} 180 Z`
})

const pieSegments = computed(() => {
  const total = stats.value.totalUsers || 1
  const circumference = 2 * Math.PI * 80
  let offset = 0
  return tiers.map(t => {
    const dash = (t.count / total) * circumference
    const result = { ...t, dash: `${dash} ${circumference - dash}`, offset: -offset }
    offset += dash
    return result
  })
})

const formatNumber = (num) => num?.toLocaleString() || '0'
const refreshData = () => {}
</script>

<style scoped>
.admin-overview { min-height: 100vh; padding-bottom: 40px; background: var(--bg-primary); }
.page-header { position: sticky; top: 0; z-index: 50; background: var(--bg-primary); border-bottom: 1px solid var(--border-color); padding: 16px 24px; }
.header-content { display: flex; align-items: center; justify-content: space-between; max-width: 1400px; margin: 0 auto; }
.page-title { font-size: 1.25rem; font-weight: 700; }
.header-actions { display: flex; gap: 8px; align-items: center; }
.period-selector { display: flex; gap: 4px; background: var(--bg-elevated); border: 1px solid var(--border-color); padding: 4px; border-radius: 10px; }
.period-selector button { padding: 6px 12px; font-size: 0.75rem; border: none; background: transparent; color: var(--text-secondary); border-radius: 8px; cursor: pointer; }
.period-selector button.active { background: var(--color-primary); color: white; }
.refresh-btn { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: var(--bg-elevated); border: 1px solid var(--border-color); color: var(--text-primary); cursor: pointer; }

.kpi-section { max-width: 1400px; margin: 0 auto; padding: 24px 24px 0; }
.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
@media (max-width: 1024px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .kpi-grid { grid-template-columns: 1fr; } }

.kpi-card { background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: 16px; padding: 20px; display: flex; gap: 16px; }
.kpi-icon { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.kpi-icon.total { background: rgba(99, 102, 241, 0.15); color: var(--color-primary); }
.kpi-icon.active { background: rgba(16, 185, 129, 0.15); color: var(--color-success); }
.kpi-icon.credits { background: rgba(245, 158, 11, 0.15); color: var(--color-warning); }
.kpi-icon.revenue { background: rgba(139, 92, 246, 0.15); color: var(--color-secondary); }
.kpi-body { display: flex; flex-direction: column; }
.kpi-value { font-size: 1.5rem; font-weight: 700; }
.kpi-label { font-size: 0.8125rem; color: var(--text-secondary); margin-top: 2px; }
.kpi-change { font-size: 0.75rem; font-weight: 600; margin-top: 4px; }
.kpi-change.positive { color: var(--color-success); }
.kpi-change.negative { color: var(--color-danger); }

.charts-section { max-width: 1400px; margin: 16px auto 0; padding: 0 24px; display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
@media (max-width: 1024px) { .charts-section { grid-template-columns: 1fr; } }
.chart-card { background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: 16px; padding: 20px; }
.chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.chart-header h3 { font-size: 0.9375rem; font-weight: 600; }
.chart-tabs { display: flex; gap: 4px; background: var(--bg-primary); border: 1px solid var(--border-color); padding: 4px; border-radius: 8px; }
.chart-tabs button { padding: 6px 12px; font-size: 0.75rem; border: none; background: transparent; color: var(--text-secondary); border-radius: 6px; cursor: pointer; }
.chart-tabs button.active { background: var(--color-primary); color: white; }
.chart-svg { width: 100%; height: 200px; }
.grid-line { stroke: var(--border-color); stroke-width: 1; stroke-dasharray: 4; }
.chart-line { fill: none; stroke: var(--color-primary); stroke-width: 2.5; stroke-linecap: round; }
.chart-point { fill: var(--color-primary); }
.chart-labels { display: flex; justify-content: space-between; padding: 8px 0 0; }
.chart-labels span { font-size: 0.6875rem; color: var(--text-tertiary); }

.pie-container { display: flex; flex-direction: column; align-items: center; gap: 16px; }
.pie-svg { width: 140px; height: 140px; }
.pie-total { font-size: 1.25rem; font-weight: 700; fill: var(--text-primary); }
.pie-label { font-size: 0.75rem; fill: var(--text-secondary); }
.pie-legend { width: 100%; display: flex; flex-direction: column; gap: 8px; }
.legend-item { display: flex; align-items: center; gap: 8px; font-size: 0.8125rem; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; }
.legend-label { color: var(--text-secondary); flex: 1; }
.legend-value { font-weight: 600; }

.activity-section { max-width: 1400px; margin: 16px auto 0; padding: 0 24px 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 1024px) { .activity-section { grid-template-columns: 1fr; } }
.activity-card, .top-users-card { background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: 16px; padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.card-header h3 { font-size: 0.9375rem; font-weight: 600; }
.view-all { font-size: 0.8125rem; color: var(--color-primary); text-decoration: none; }
.view-all:hover { text-decoration: underline; }
.activity-list { display: flex; flex-direction: column; gap: 12px; }
.activity-item { display: flex; gap: 12px; align-items: flex-start; }
.act-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.act-icon.register { background: rgba(16, 185, 129, 0.15); color: var(--color-success); }
.act-icon.upgrade { background: rgba(245, 158, 11, 0.15); color: var(--color-warning); }
.act-icon.credits { background: rgba(99, 102, 241, 0.15); color: var(--color-primary); }
.act-content { display: flex; flex-direction: column; gap: 2px; }
.act-text { font-size: 0.8125rem; color: var(--text-primary); }
.act-time { font-size: 0.6875rem; color: var(--text-tertiary); }

.top-list { display: flex; flex-direction: column; gap: 12px; }
.top-item { display: flex; align-items: center; gap: 12px; padding: 10px; background: var(--bg-primary); border-radius: 10px; }
.rank { width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; background: var(--bg-elevated); }
.rank.rank-1 { background: rgba(245, 158, 11, 0.2); color: var(--color-warning); }
.rank.rank-2 { background: rgba(156, 163, 175, 0.25); color: var(--text-secondary); }
.rank.rank-3 { background: rgba(180, 83, 9, 0.2); color: var(--color-warning); }
.user-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); display: flex; align-items: center; justify-content: center; font-size: 0.875rem; font-weight: 600; color: white; }
.user-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.user-name { font-size: 0.875rem; font-weight: 500; color: var(--text-primary); }
.user-tier { font-size: 0.6875rem; padding: 2px 6px; border-radius: 4px; width: fit-content; }
.user-tier.free { background: rgba(107, 114, 128, 0.15); color: var(--text-secondary); }
.user-tier.pro { background: rgba(245, 158, 11, 0.15); color: var(--color-warning); }
.user-tier.enterprise { background: rgba(139, 92, 246, 0.15); color: var(--color-secondary); }
.user-credits { font-size: 0.9375rem; font-weight: 700; color: var(--color-primary); }
</style>
