<template>
  <div class="admin-credits">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">积分管理</h1>
        <div class="header-actions">
          <button class="secondary-btn" @click="showAddModal = true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            分配积分
          </button>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon total">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ formatNumber(stats.totalCredits) }}</span>
            <span class="stat-label">平台总积分</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon distributed">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ formatNumber(stats.distributedCredits) }}</span>
            <span class="stat-label">已分发积分</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon consumed">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ formatNumber(stats.consumedCredits) }}</span>
            <span class="stat-label">已消耗积分</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon balance">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ formatNumber(stats.availableCredits) }}</span>
            <span class="stat-label">可用积分</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Transactions -->
    <div class="table-section">
      <div class="table-header">
        <h2 class="section-title">积分变动记录</h2>
        <div class="filter-tabs">
          <button :class="{ active: filter === 'all' }" @click="filter = 'all'">全部</button>
          <button :class="{ active: filter === 'income' }" @click="filter = 'income'">收入</button>
          <button :class="{ active: filter === 'expense' }" @click="filter = 'expense'">消耗</button>
        </div>
      </div>

      <table class="credits-table">
        <thead>
          <tr>
            <th>用户</th>
            <th>类型</th>
            <th>数量</th>
            <th>余额</th>
            <th>来源</th>
            <th>时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tx in filteredTransactions" :key="tx.id">
            <td>
              <div class="user-cell">
                <div class="user-avatar">{{ tx.nickname?.charAt(0) || 'U' }}</div>
                <span>{{ tx.email }}</span>
              </div>
            </td>
            <td>
              <span class="type-badge" :class="tx.type">{{ tx.typeLabel }}</span>
            </td>
            <td :class="tx.type">
              {{ tx.type === 'income' ? '+' : '-' }}{{ formatNumber(tx.amount) }}
            </td>
            <td>{{ formatNumber(tx.balance) }}</td>
            <td>{{ tx.source }}</td>
            <td>{{ tx.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filter = ref('all')
const showAddModal = ref(false)

const stats = ref({
  totalCredits: 150000,
  distributedCredits: 77850,
  consumedCredits: 32150,
  availableCredits: 40000
})

const transactions = ref([
  { id: 1, email: 'emma@example.com', nickname: 'Emma Sun', type: 'income', typeLabel: '充值', amount: 10000, balance: 25000, source: 'Pro套餐购买', time: '2026-05-08 10:30' },
  { id: 2, email: 'alice@example.com', nickname: 'Alice Chen', type: 'expense', typeLabel: '消耗', amount: 500, balance: 14500, source: '品牌诊断', time: '2026-05-08 14:20' },
  { id: 3, email: 'henry@example.com', nickname: 'Henry Wu', type: 'income', typeLabel: '充值', amount: 5000, balance: 18000, source: '充值', time: '2026-05-07 09:15' },
  { id: 4, email: 'jack@example.com', nickname: 'Jack Lin', type: 'expense', typeLabel: '消耗', amount: 200, balance: 6000, source: '快速诊断', time: '2026-05-06 16:45' },
  { id: 5, email: 'grace@example.com', nickname: 'Grace Yang', type: 'expense', typeLabel: '消耗', amount: 100, balance: 4700, source: '报告导出', time: '2026-05-05 11:00' },
  { id: 6, email: 'bob@example.com', nickname: 'Bob Wang', type: 'income', typeLabel: '赠送', amount: 500, balance: 3700, source: '活动赠送', time: '2026-05-04 14:30' }
])

const filteredTransactions = computed(() => {
  if (filter.value === 'all') return transactions.value
  return transactions.value.filter(t => t.type === filter.value)
})

const formatNumber = (n) => n?.toLocaleString() || '0'
</script>

<style scoped>
.admin-credits { min-height: 100vh; padding-bottom: 40px; background: var(--bg-primary); }
.page-header { position: sticky; top: 0; z-index: 50; background: var(--bg-primary); border-bottom: 1px solid var(--border-color); padding: 16px 24px; }
.header-content { display: flex; align-items: center; justify-content: space-between; max-width: 1400px; margin: 0 auto; }
.page-title { font-size: 1.25rem; font-weight: 700; }
.secondary-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: var(--color-primary); color: white; border: none; border-radius: 10px; font-size: 0.875rem; font-weight: 600; cursor: pointer; }

.stats-section { max-width: 1400px; margin: 24px auto 0; padding: 0 24px; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.stat-card { background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: 16px; padding: 20px; display: flex; gap: 16px; }
.stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon.total { background: rgba(99, 102, 241, 0.15); color: #4f46e5; }
.stat-icon.distributed { background: rgba(16, 185, 129, 0.15); color: #059669; }
.stat-icon.consumed { background: rgba(239, 68, 68, 0.15); color: #dc2626; }
.stat-icon.balance { background: rgba(245, 158, 11, 0.15); color: #d97706; }
.stat-content { display: flex; flex-direction: column; }
.stat-value { font-size: 1.5rem; font-weight: 700; }
.stat-label { font-size: 0.8125rem; color: var(--text-secondary); margin-top: 2px; }

.table-section { max-width: 1400px; margin: 16px auto 0; padding: 0 24px 24px; }
.table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.section-title { font-size: 1rem; font-weight: 700; }
.filter-tabs { display: flex; gap: 4px; background: var(--bg-elevated); border: 1px solid var(--border-color); padding: 4px; border-radius: 10px; }
.filter-tabs button { padding: 6px 14px; font-size: 0.8125rem; border: none; background: transparent; color: var(--text-secondary); border-radius: 8px; cursor: pointer; }
.filter-tabs button.active { background: var(--color-primary); color: white; }

.credits-table { width: 100%; background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: 16px; border-collapse: separate; border-spacing: 0; overflow: hidden; }
.credits-table th { padding: 12px 16px; text-align: left; font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); background: var(--bg-primary); border-bottom: 1px solid var(--border-color); }
.credits-table td { padding: 14px 16px; font-size: 0.875rem; border-bottom: 1px solid var(--border-color); color: var(--text-primary); }
.credits-table tr:last-child td { border-bottom: none; }
.credits-table tr:hover td { background: var(--bg-primary); }
.user-cell { display: flex; align-items: center; gap: 10px; }
.user-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary), #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; color: white; }
.type-badge { display: inline-block; padding: 3px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
.type-badge.income { background: rgba(16, 185, 129, 0.15); color: #059669; }
.type-badge.expense { background: rgba(239, 68, 68, 0.15); color: #dc2626; }
td.income { color: #059669; font-weight: 600; }
td.expense { color: #dc2626; font-weight: 600; }
</style>
