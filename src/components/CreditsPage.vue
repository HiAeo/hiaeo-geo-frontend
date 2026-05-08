<template>
  <div class="credits-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">积分管理</h1>
        <div class="header-actions">
          <button class="refresh-btn" @click="loadData" :class="{ spinning: loading }">
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
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ formatNumber(stats.totalCredits) }}</span>
            <span class="stat-label">平台总积分</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon distributed">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ formatNumber(stats.distributedCredits) }}</span>
            <span class="stat-label">已分发积分</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon consumed">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ formatNumber(stats.consumedCredits) }}</span>
            <span class="stat-label">已消耗积分</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon rate">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20V10"/>
              <path d="M18 20V4"/>
              <path d="M6 20v-4"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.consumptionRate }}%</span>
            <span class="stat-label">消耗率</span>
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
        <input type="text" v-model="filters.search" placeholder="搜索用户..." @keyup.enter="loadData" />
      </div>

      <div class="filter-group">
        <select v-model="filters.type" @change="loadData">
          <option value="">全部类型</option>
          <option value="add">充值</option>
          <option value="deduct">扣除</option>
          <option value="consume">消耗</option>
        </select>

        <select v-model="filters.period" @change="loadData">
          <option value="7d">近7天</option>
          <option value="30d">近30天</option>
          <option value="90d">近90天</option>
        </select>
      </div>
    </div>

    <!-- Transaction List -->
    <div class="list-section">
      <div class="list-card">
        <div class="list-header">
          <h3>积分流水</h3>
          <span class="list-count">{{ transactions.length }} 条记录</span>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <span>加载中...</span>
        </div>

        <div v-else-if="transactions.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          <p>暂无积分记录</p>
        </div>

        <div v-else class="transaction-list">
          <div v-for="tx in transactions" :key="tx.id" class="transaction-item">
            <div class="tx-icon" :class="tx.type">
              <svg v-if="tx.type === 'add'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <svg v-else-if="tx.type === 'deduct'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>

            <div class="tx-content">
              <div class="tx-main">
                <span class="tx-user">{{ tx.userEmail }}</span>
                <span class="tx-amount" :class="tx.type">
                  {{ tx.type === 'add' ? '+' : '-' }}{{ tx.amount }}
                </span>
              </div>
              <div class="tx-meta">
                <span class="tx-reason">{{ tx.reason || '无备注' }}</span>
                <span class="tx-time">{{ formatDate(tx.createdAt) }}</span>
              </div>
            </div>

            <div class="tx-balance">
              <span class="balance-label">余额</span>
              <span class="balance-value">{{ formatNumber(tx.balanceAfter) }}</span>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.total > pagination.limit" class="pagination">
          <button class="page-btn" :disabled="pagination.page <= 1" @click="goToPage(pagination.page - 1)">
            上一页
          </button>
          <span class="page-info">第 {{ pagination.page }} / {{ totalPages }} 页</span>
          <button class="page-btn" :disabled="pagination.page >= totalPages" @click="goToPage(pagination.page + 1)">
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

const props = defineProps({
  theme: { type: String, default: 'dark' }
})

const loading = ref(false)

const stats = ref({
  totalCredits: 100000,
  distributedCredits: 77850,
  consumedCredits: 42150,
  consumptionRate: 54
})

const filters = reactive({
  search: '',
  type: '',
  period: '7d'
})

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})

const transactions = ref([
  { id: 1, userEmail: 'emma@example.com', type: 'add', amount: 5000, reason: '企业套餐升级', balanceAfter: 25000, createdAt: new Date(Date.now() - 3600000) },
  { id: 2, userEmail: 'jack@example.com', type: 'consume', amount: 200, reason: 'GEO API调用', balanceAfter: 6000, createdAt: new Date(Date.now() - 7200000) },
  { id: 3, userEmail: 'alice@example.com', type: 'add', amount: 1000, reason: '积分充值', balanceAfter: 15000, createdAt: new Date(Date.now() - 10800000) },
  { id: 4, userEmail: 'bob@example.com', type: 'consume', amount: 500, reason: '高级功能解锁', balanceAfter: 5000, createdAt: new Date(Date.now() - 14400000) },
  { id: 5, userEmail: 'henry@example.com', type: 'deduct', amount: 2000, reason: '违规操作扣除', balanceAfter: 18000, createdAt: new Date(Date.now() - 18000000) },
  { id: 6, userEmail: 'grace@example.com', type: 'consume', amount: 300, reason: 'GEO API调用', balanceAfter: 4500, createdAt: new Date(Date.now() - 21600000) },
  { id: 7, userEmail: 'david@example.com', type: 'add', amount: 500, reason: '新手礼包', balanceAfter: 3200, createdAt: new Date(Date.now() - 25200000) },
  { id: 8, userEmail: 'carol@example.com', type: 'consume', amount: 50, reason: '基础功能使用', balanceAfter: 50, createdAt: new Date(Date.now() - 28800000) }
])

const totalPages = computed(() => Math.ceil(pagination.total / pagination.limit) || 1)

const loadData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    pagination.total = transactions.value.length
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    loading.value = false
  }
}

const goToPage = (page) => {
  pagination.page = page
  loadData()
}

const formatNumber = (num) => {
  return num?.toLocaleString() || '0'
}

const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.credits-page {
  min-height: 100vh;
  padding-bottom: 40px;
  background: var(--bg-primary);
}

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
.stat-icon.distributed { background: rgba(16, 185, 129, 0.15); color: #059669; }
.stat-icon.consumed { background: rgba(245, 158, 11, 0.15); color: #d97706; }
.stat-icon.rate { background: rgba(139, 92, 246, 0.15); color: #7c3aed; }

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

.filters-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px 20px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 200px;
  position: relative;
}

.search-box svg {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
}

.search-box input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.search-box input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.filter-group {
  display: flex;
  gap: 8px;
}

.filter-group select {
  padding: 10px 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
}

.filter-group select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.list-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.list-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.list-header h3 {
  font-size: 0.9375rem;
  font-weight: 600;
}

.list-count {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.loading-state,
.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: var(--text-secondary);
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

.transaction-list {
  display: flex;
  flex-direction: column;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  transition: background 0.2s ease;
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-item:hover {
  background: var(--bg-primary);
}

.tx-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tx-icon.add { background: rgba(16, 185, 129, 0.15); color: #059669; }
.tx-icon.deduct { background: rgba(239, 68, 68, 0.15); color: #dc2626; }
.tx-icon.consume { background: rgba(245, 158, 11, 0.15); color: #d97706; }

.tx-content {
  flex: 1;
  min-width: 0;
}

.tx-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tx-user {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.tx-amount {
  font-size: 0.9375rem;
  font-weight: 700;
}

.tx-amount.add { color: #059669; }
.tx-amount.deduct { color: #dc2626; }
.tx-amount.consume { color: #d97706; }

.tx-meta {
  display: flex;
  gap: 12px;
  margin-top: 4px;
}

.tx-reason {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.tx-time {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.tx-balance {
  text-align: right;
}

.balance-label {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
  display: block;
}

.balance-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 20px;
}

.page-btn {
  padding: 8px 16px;
  font-size: 0.875rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.875rem;
  color: var(--text-secondary);
}
</style>
