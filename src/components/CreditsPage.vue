<template>
  <div class="credits-page" :data-theme="theme">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">我的积分</h1>
          <span class="page-subtitle">查看积分余额、获取方式和交易明细</span>
        </div>
      </div>
    </div>

    <!-- Credits Overview -->
    <div class="credits-overview">
      <div class="credits-card">
        <div class="credits-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        </div>
        <div class="credits-info">
          <span class="credits-label">当前积分</span>
          <span class="credits-value">{{ creditsInfo?.balance || 0 }}</span>
        </div>
      </div>

      <div class="credits-stats">
        <div class="stat-item">
          <span class="stat-value">+{{ creditsInfo?.totalEarned || 0 }}</span>
          <span class="stat-label">累计获得</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">-{{ creditsInfo?.totalConsumed || 0 }}</span>
          <span class="stat-label">累计消耗</span>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <button class="action-btn" @click="showEarnModal = true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        <span>获取积分</span>
      </button>
      <button class="action-btn" @click="scrollToHistory">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <span>积分明细</span>
      </button>
    </div>

    <!-- How to Earn -->
    <div class="section">
      <h2 class="section-title">如何获取积分</h2>
      <div class="earn-methods">
        <div class="earn-item">
          <div class="earn-icon">📦</div>
          <div class="earn-content">
            <span class="earn-title">订阅付费套餐</span>
            <span class="earn-desc">每消费10元获得1积分</span>
          </div>
          <span class="earn-rate">+1/10元</span>
        </div>
        <div class="earn-item">
          <div class="earn-icon">🎁</div>
          <div class="earn-content">
            <span class="earn-title">新人礼包</span>
            <span class="earn-desc">新用户注册赠送100积分</span>
          </div>
          <span class="earn-rate">+100</span>
        </div>
        <div class="earn-item">
          <div class="earn-icon">📢</div>
          <div class="earn-content">
            <span class="earn-title">邀请好友</span>
            <span class="earn-desc">每邀请1位好友获得50积分</span>
          </div>
          <span class="earn-rate">+50/位</span>
        </div>
        <div class="earn-item">
          <div class="earn-icon">⭐</div>
          <div class="earn-content">
            <span class="earn-title">每日签到</span>
            <span class="earn-desc">每日签到获得5积分</span>
          </div>
          <span class="earn-rate">+5/天</span>
        </div>
      </div>
    </div>

    <!-- Transaction History -->
    <div class="section" ref="historySection">
      <div class="section-header">
        <h2 class="section-title">积分明细</h2>
        <div class="filter-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.value"
            class="tab-btn"
            :class="{ active: activeTab === tab.value }"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <span>加载中...</span>
      </div>

      <div v-else-if="transactions.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span>暂无积分记录</span>
      </div>

      <div v-else class="transactions-list">
        <div 
          v-for="tx in filteredTransactions" 
          :key="tx.id"
          class="transaction-item"
          :class="{ 'is-earn': tx.type === 'earn' || tx.type === 'bonus' || tx.type === 'refund', 'is-consume': tx.type === 'consume' }"
        >
          <div class="tx-icon">
            <span v-if="tx.type === 'earn' || tx.type === 'bonus'">📈</span>
            <span v-else-if="tx.type === 'refund'">🔄</span>
            <span v-else>📉</span>
          </div>
          <div class="tx-content">
            <span class="tx-desc">{{ tx.description }}</span>
            <span class="tx-time">{{ formatTime(tx.createdAt) }}</span>
          </div>
          <span class="tx-amount" :class="{ positive: tx.type !== 'consume' }">
            {{ tx.type !== 'consume' ? '+' : '-' }}{{ tx.amount }}
          </span>
        </div>
      </div>

      <div v-if="hasMore" class="load-more">
        <button @click="loadMore" :disabled="loadingMore">
          {{ loadingMore ? '加载中...' : '加载更多' }}
        </button>
      </div>
    </div>

    <!-- Earn Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showEarnModal" class="modal-overlay" @click.self="showEarnModal = false">
          <div class="modal-container">
            <button class="modal-close" @click="showEarnModal = false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <h2 class="modal-title">获取更多积分</h2>

            <div class="earn-options">
              <div class="earn-option" @click="goToPricing">
                <div class="option-icon">🚀</div>
                <div class="option-content">
                  <span class="option-title">升级套餐</span>
                  <span class="option-desc">订阅付费套餐，享受更多功能</span>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>

              <div class="earn-option" @click="handleDailyCheckin">
                <div class="option-icon">✨</div>
                <div class="option-content">
                  <span class="option-title">每日签到</span>
                  <span class="option-desc">签到即可获得5积分</span>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>

              <div class="earn-option" @click="showInviteModal">
                <div class="option-icon">👥</div>
                <div class="option-content">
                  <span class="option-title">邀请好友</span>
                  <span class="option-desc">每邀请1位好友获得50积分</span>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Check-in Success Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCheckinSuccess" class="modal-overlay" @click.self="showCheckinSuccess = false">
          <div class="modal-container success-modal">
            <div class="success-icon">🎉</div>
            <h2 class="success-title">签到成功</h2>
            <p class="success-message">恭喜获得 5 积分</p>
            <button class="btn-primary" @click="showCheckinSuccess = false">确定</button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '../composables/useApi'

const props = defineProps({
  theme: {
    type: String,
    default: 'dark'
  }
})

const emit = defineEmits(['back', 'goto-pricing'])

const { getCreditsInfo, getCreditsTransactions } = useApi()

// State
const creditsInfo = ref(null)
const transactions = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const activeTab = ref('all')
const hasMore = ref(false)
const page = ref(1)
const showEarnModal = ref(false)
const showCheckinSuccess = ref(false)
const historySection = ref(null)

const tabs = [
  { label: '全部', value: 'all' },
  { label: '获得', value: 'earn' },
  { label: '消耗', value: 'consume' },
]

// Computed
const filteredTransactions = computed(() => {
  if (activeTab.value === 'all') return transactions.value
  return transactions.value.filter(tx => tx.type === activeTab.value)
})

// Methods
const loadData = async () => {
  loading.value = true
  try {
    const [infoResult, txResult] = await Promise.all([
      getCreditsInfo(),
      getCreditsTransactions({ page: 1, limit: 20 })
    ])
    creditsInfo.value = infoResult
    transactions.value = txResult.transactions || []
    hasMore.value = txResult.page < txResult.totalPages
    page.value = txResult.page
  } catch (error) {
    console.error('Failed to load credits:', error)
  } finally {
    loading.value = false
  }
}

const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return
  loadingMore.value = true
  try {
    const result = await getCreditsTransactions({ page: page.value + 1, limit: 20 })
    transactions.value = [...transactions.value, ...(result.transactions || [])]
    hasMore.value = result.page < result.totalPages
    page.value = result.page
  } catch (error) {
    console.error('Failed to load more:', error)
  } finally {
    loadingMore.value = false
  }
}

const formatTime = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return '今天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (days === 1) {
    return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

const scrollToHistory = () => {
  historySection.value?.scrollIntoView({ behavior: 'smooth' })
}

const goToPricing = () => {
  showEarnModal.value = false
  emit('goto-pricing')
}

const handleDailyCheckin = () => {
  showEarnModal.value = false
  // 模拟签到
  setTimeout(() => {
    showCheckinSuccess.value = true
    if (creditsInfo.value) {
      creditsInfo.value.balance += 5
      creditsInfo.value.totalEarned += 5
    }
    transactions.value.unshift({
      id: 'new_' + Date.now(),
      type: 'earn',
      amount: 5,
      description: '每日签到',
      createdAt: new Date().toISOString(),
    })
  }, 300)
}

const showInviteModal = () => {
  showEarnModal.value = false
  // TODO: 显示邀请码
  alert('邀请功能开发中，敬请期待！')
}

// Lifecycle
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
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

/* Credits Overview */
.credits-overview {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.credits-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: linear-gradient(135deg, #165DFF, #8B5CF6);
  border-radius: 16px;
  margin-bottom: 16px;
}

.credits-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
}

.credits-info {
  display: flex;
  flex-direction: column;
}

.credits-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
}

.credits-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
}

.credits-stats {
  display: flex;
  align-items: center;
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--border-color);
}

/* Quick Actions */
.quick-actions {
  display: flex;
  gap: 12px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px 24px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Section */
.section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.filter-tabs {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: var(--bg-elevated);
  border-radius: 8px;
}

.tab-btn {
  padding: 6px 12px;
  background: transparent;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: var(--color-primary);
  color: white;
}

/* Earn Methods */
.earn-methods {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.earn-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.2s ease;
}

.earn-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.earn-icon {
  font-size: 1.5rem;
}

.earn-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.earn-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.earn-desc {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.earn-rate {
  font-size: 0.875rem;
  font-weight: 600;
  color: #10B981;
}

/* Transactions */
.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.transaction-item:hover {
  border-color: var(--color-primary);
}

.tx-icon {
  font-size: 1.25rem;
}

.tx-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tx-desc {
  font-size: 0.875rem;
  color: var(--text-primary);
}

.tx-time {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.tx-amount {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.tx-amount.positive {
  color: #10B981;
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.load-more button {
  padding: 10px 24px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.load-more button:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Empty & Loading */
.empty-state,
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 0;
  color: var(--text-tertiary);
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
}

.modal-container {
  position: relative;
  width: 100%;
  max-width: 420px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 28px;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
  text-align: center;
}

.earn-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.earn-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.earn-option:hover {
  border-color: var(--color-primary);
  background: rgba(22, 93, 255, 0.05);
}

.option-icon {
  font-size: 1.5rem;
}

.option-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.option-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.option-desc {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.success-modal {
  text-align: center;
}

.success-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.success-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.success-message {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.3);
}

/* Modal Animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
