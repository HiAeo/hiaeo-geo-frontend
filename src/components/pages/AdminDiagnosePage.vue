<template>
  <div class="admin-diagnose">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">诊断管理</h1>
        <div class="header-actions">
          <button class="secondary-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            导出数据
          </button>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-value">{{ stats.total }}</span>
          <span class="stat-label">总诊断数</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ stats.today }}</span>
          <span class="stat-label">今日诊断</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ stats.monthly }}</span>
          <span class="stat-label">本月诊断</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ formatNumber(stats.creditsUsed) }}</span>
          <span class="stat-label">消耗积分</span>
        </div>
      </div>
    </div>

    <!-- Filter -->
    <div class="filter-section">
      <div class="filter-tabs">
        <button :class="{ active: filter === 'all' }" @click="filter = 'all'">全部</button>
        <button :class="{ active: filter === 'completed' }" @click="filter = 'completed'">已完成</button>
        <button :class="{ active: filter === 'running' }" @click="filter = 'running'">进行中</button>
        <button :class="{ active: filter === 'failed' }" @click="filter = 'failed'">失败</button>
      </div>
    </div>

    <!-- Table -->
    <div class="table-section">
      <table class="diagnose-table">
        <thead>
          <tr>
            <th>用户</th>
            <th>品牌</th>
            <th>类型</th>
            <th>引擎</th>
            <th>得分</th>
            <th>消耗积分</th>
            <th>状态</th>
            <th>时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in filteredDiagnoses" :key="d.id">
            <td>{{ d.email }}</td>
            <td>{{ d.brandName }}</td>
            <td>{{ d.type }}</td>
            <td>
              <div class="engine-tags">
                <span v-for="eng in d.engines" :key="eng" class="engine-tag">{{ eng }}</span>
              </div>
            </td>
            <td>
              <span v-if="d.score" class="score-val" :class="getScoreClass(d.score)">{{ d.score }}</span>
              <span v-else class="score-val none">-</span>
            </td>
            <td>{{ d.creditsUsed }}</td>
            <td>
              <span class="status-badge" :class="'status-' + d.status">{{ d.statusLabel }}</span>
            </td>
            <td>{{ d.time }}</td>
            <td>
              <div class="action-btns">
                <button class="action-btn" @click="viewDetail(d)">详情</button>
                <button v-if="d.status === 'failed'" class="action-btn" @click="retry(d)">重试</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filter = ref('all')

const stats = ref({
  total: 48,
  today: 5,
  monthly: 32,
  creditsUsed: 24000
})

const diagnoses = ref([
  { id: 1, email: 'emma@example.com', brandName: '魔鲸科技', type: '完整诊断', engines: ['DeepSeek', 'Kimi'], score: 88, creditsUsed: 500, status: 'completed', statusLabel: '完成', time: '2026-05-08 14:30' },
  { id: 2, email: 'henry@example.com', brandName: '蓝色光标', type: '快速诊断', engines: ['Qwen'], score: 75, creditsUsed: 200, status: 'completed', statusLabel: '完成', time: '2026-05-08 13:15' },
  { id: 3, email: 'alice@example.com', brandName: '创新工场', type: '完整诊断', engines: ['DeepSeek'], score: null, creditsUsed: 0, status: 'running', statusLabel: '进行中', time: '2026-05-08 15:00' },
  { id: 4, email: 'jack@example.com', brandName: '未来科技', type: '竞品对比', engines: ['智谱 GLM'], score: 62, creditsUsed: 300, status: 'completed', statusLabel: '完成', time: '2026-05-07 11:20' },
  { id: 5, email: 'grace@example.com', brandName: '智慧品牌', type: '完整诊断', engines: ['DeepSeek', '豆包'], score: null, creditsUsed: 0, status: 'failed', statusLabel: '失败', time: '2026-05-06 09:30' },
  { id: 6, email: 'bob@example.com', brandName: '创意工坊', type: '快速诊断', engines: ['Kimi'], score: 71, creditsUsed: 200, status: 'completed', statusLabel: '完成', time: '2026-05-05 16:45' }
])

const filteredDiagnoses = computed(() => {
  if (filter.value === 'all') return diagnoses.value
  return diagnoses.value.filter(d => d.status === filter.value)
})

const formatNumber = (n) => n?.toLocaleString() || '0'
const getScoreClass = (s) => { if (s >= 85) return 'high'; if (s >= 70) return 'mid'; return 'low' }
const viewDetail = (d) => { console.log('view detail', d.id) }
const retry = (d) => { console.log('retry', d.id) }
</script>

<style scoped>
.admin-diagnose { min-height: 100vh; padding-bottom: 40px; background: var(--bg-primary); }
.page-header { position: sticky; top: 0; z-index: 50; background: var(--bg-primary); border-bottom: 1px solid var(--border-color); padding: 16px 24px; }
.header-content { display: flex; align-items: center; justify-content: space-between; max-width: 1400px; margin: 0 auto; }
.page-title { font-size: 1.25rem; font-weight: 700; }
.secondary-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: 10px; font-size: 0.875rem; font-weight: 600; color: var(--text-primary); cursor: pointer; }

.stats-section { max-width: 1400px; margin: 24px auto 0; padding: 0 24px; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.stat-card { background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; text-align: center; display: flex; flex-direction: column; gap: 4px; }
.stat-value { font-size: 1.5rem; font-weight: 700; }
.stat-label { font-size: 0.8125rem; color: var(--text-secondary); }

.filter-section { max-width: 1400px; margin: 16px auto 0; padding: 0 24px; }
.filter-tabs { display: flex; gap: 4px; background: var(--bg-elevated); border: 1px solid var(--border-color); padding: 4px; border-radius: 10px; width: fit-content; }
.filter-tabs button { padding: 6px 14px; font-size: 0.8125rem; border: none; background: transparent; color: var(--text-secondary); border-radius: 8px; cursor: pointer; }
.filter-tabs button.active { background: var(--color-primary); color: white; }

.table-section { max-width: 1400px; margin: 16px auto 0; padding: 0 24px 24px; }
.diagnose-table { width: 100%; background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: 16px; border-collapse: separate; border-spacing: 0; overflow: hidden; }
.diagnose-table th { padding: 12px 16px; text-align: left; font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); background: var(--bg-primary); border-bottom: 1px solid var(--border-color); white-space: nowrap; }
.diagnose-table td { padding: 14px 16px; font-size: 0.875rem; border-bottom: 1px solid var(--border-color); color: var(--text-primary); }
.diagnose-table tr:last-child td { border-bottom: none; }
.diagnose-table tr:hover td { background: var(--bg-primary); }

.engine-tags { display: flex; gap: 4px; flex-wrap: wrap; }
.engine-tag { padding: 2px 8px; background: rgba(99, 102, 241, 0.1); color: var(--color-primary); border-radius: 4px; font-size: 0.75rem; }
.score-val { font-weight: 700; }
.score-val.high { color: #059669; }
.score-val.mid { color: #4f46e5; }
.score-val.low { color: #d97706; }
.score-val.none { color: var(--text-tertiary); }
.status-badge { display: inline-block; padding: 3px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
.status-completed { background: rgba(16, 185, 129, 0.15); color: #059669; }
.status-running { background: rgba(245, 158, 11, 0.15); color: #d97706; }
.status-failed { background: rgba(239, 68, 68, 0.15); color: #dc2626; }
.action-btns { display: flex; gap: 4px; }
.action-btn { padding: 5px 10px; border-radius: 6px; font-size: 0.75rem; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); cursor: pointer; }
.action-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }
</style>
