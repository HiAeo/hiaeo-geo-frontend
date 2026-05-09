<template>
  <div class="orders-page" :data-theme="theme">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">我的订单</h1>
          <span class="page-subtitle">管理订阅套餐购买记录和退款申请</span>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.value"
        class="tab-btn"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
        <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Order Stats -->
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-value">{{ stats.totalOrders }}</span>
        <span class="stat-label">总订单</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">¥{{ stats.totalSpent }}</span>
        <span class="stat-label">累计消费</span>
      </div>
    </div>

    <!-- Orders List -->
    <div class="orders-container">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <span>加载中...</span>
      </div>

      <div v-else-if="filteredOrders.length === 0" class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <span>暂无订单</span>
        <button class="btn-primary" @click="$emit('goto-pricing')">去选购</button>
      </div>

      <div v-else class="orders-list">
        <div 
          v-for="order in filteredOrders" 
          :key="order.id"
          class="order-card"
        >
          <div class="order-header">
            <span class="order-no">{{ order.orderNo }}</span>
            <span class="order-status" :class="getStatusClass(order.status)">
              {{ getStatusText(order.status) }}
            </span>
          </div>

          <div class="order-content">
            <div class="order-info">
              <span class="order-name">{{ order.packageName || order.planName }}</span>
              <span class="order-time">{{ formatTime(order.createdAt) }}</span>
            </div>
            <div class="order-price">
              <span class="price">¥{{ order.amount }}</span>
              <span v-if="order.originalAmount > order.amount" class="original-price">
                ¥{{ order.originalAmount }}
              </span>
            </div>
          </div>

          <div class="order-actions">
            <template v-if="order.status === 'pending'">
              <button class="btn-outline" @click="handleCancel(order)">取消</button>
              <button class="btn-primary" @click="handlePay(order)">去支付</button>
            </template>
            <template v-else-if="order.status === 'paid'">
              <button class="btn-outline" @click="handleRefund(order)">退款</button>
              <button class="btn-outline" @click="viewOrderDetail(order)">详情</button>
            </template>
            <template v-else>
              <button class="btn-outline" @click="viewOrderDetail(order)">详情</button>
            </template>
          </div>
        </div>
      </div>

      <div v-if="hasMore" class="load-more">
        <button @click="loadMore" :disabled="loadingMore">
          {{ loadingMore ? '加载中...' : '加载更多' }}
        </button>
      </div>
    </div>

    <!-- Refund Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showRefundModal" class="modal-overlay" @click.self="showRefundModal = false">
          <div class="modal-container">
            <button class="modal-close" @click="showRefundModal = false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <h2 class="modal-title">申请退款</h2>
            <p class="modal-desc">订单金额：¥{{ selectedOrder?.amount }}</p>

            <div class="form-group">
              <label>退款原因</label>
              <textarea 
                v-model="refundReason"
                placeholder="请输入退款原因..."
                rows="3"
              ></textarea>
            </div>

            <div class="refund-notice">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <span>退款将在1-3个工作日内原路返回</span>
            </div>

            <button class="btn-primary" @click="confirmRefund" :disabled="!refundReason.trim()">
              确认退款
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '../composables/useApi'
import { useTheme } from '../composables/useTheme'

// 使用全局主题状态
const { theme } = useTheme()

const props = defineProps({
  theme: {
    type: String,
    default: 'dark'
  }
})

const emit = defineEmits(['back', 'goto-pricing', 'view-order'])

const { getOrderList, getOrderStats, cancelOrder, refundOrder } = useApi()

// State
const orders = ref([])
const stats = ref({ totalOrders: 0, totalSpent: 0, paidOrders: 0, pendingOrders: 0 })
const loading = ref(false)
const loadingMore = ref(false)
const activeTab = ref('all')
const hasMore = ref(false)
const page = ref(1)
const showRefundModal = ref(false)
const selectedOrder = ref(null)
const refundReason = ref('')

const tabs = computed(() => [
  { label: '全部', value: 'all', count: null },
  { label: '待支付', value: 'pending', count: stats.value.pendingOrders },
  { label: '已完成', value: 'paid', count: stats.value.paidOrders },
])

// Computed
const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value
  return orders.value.filter(o => o.status === activeTab.value)
})

// Methods
const loadData = async () => {
  loading.value = true
  try {
    const [ordersResult, statsResult] = await Promise.all([
      getOrderList({ page: 1, limit: 20 }),
      getOrderStats()
    ])
    orders.value = ordersResult.orders || ordersResult || []
    stats.value = statsResult
    hasMore.value = ordersResult.page < ordersResult.totalPages
    page.value = ordersResult.page
  } catch (error) {
    console.error('Failed to load orders:', error)
  } finally {
    loading.value = false
  }
}

const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return
  loadingMore.value = true
  try {
    const result = await getOrderList({ page: page.value + 1, limit: 20 })
    orders.value = [...orders.value, ...(result.orders || [])]
    hasMore.value = result.page < result.totalPages
    page.value = result.page
  } catch (error) {
    console.error('Failed to load more:', error)
  } finally {
    loadingMore.value = false
  }
}

const formatTime = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status) => {
  const classMap = {
    pending: 'status-pending',
    paid: 'status-success',
    cancelled: 'status-cancelled',
    refunded: 'status-refunded',
    failed: 'status-failed',
  }
  return classMap[status] || ''
}

const getStatusText = (status) => {
  const textMap = {
    pending: '待支付',
    paid: '已完成',
    cancelled: '已取消',
    refunded: '已退款',
    failed: '失败',
  }
  return textMap[status] || status
}

const handleCancel = async (order) => {
  if (!confirm('确定要取消该订单吗？')) return
  try {
    await cancelOrder(order.id, '用户主动取消')
    order.status = 'cancelled'
  } catch (error) {
    alert('取消失败：' + error.message)
  }
}

const handlePay = async (order) => {
  // TODO: 跳转支付
  emit('goto-pricing')
}

const handleRefund = (order) => {
  selectedOrder.value = order
  refundReason.value = ''
  showRefundModal.value = true
}

const confirmRefund = async () => {
  if (!selectedOrder.value || !refundReason.value.trim()) return
  try {
    await refundOrder(selectedOrder.value.id, refundReason.value)
    selectedOrder.value.status = 'refunded'
    showRefundModal.value = false
    alert('退款申请已提交')
  } catch (error) {
    alert('退款申请失败：' + error.message)
  }
}

const viewOrderDetail = (order) => {
  emit('view-order', order)
}

// Lifecycle
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.orders-page {
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

/* Tabs */
.tabs {
  display: flex;
  gap: 8px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 24px 0;
  overflow-x: auto;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-size: 0.875rem;
  color: var(--text-secondary);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.tab-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.tab-count {
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  font-size: 0.75rem;
}

/* Stats */
.stats-bar {
  display: flex;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto 16px;
  padding: 20px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
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

/* Orders List */
.orders-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  padding: 20px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.2s ease;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.order-no {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.order-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-pending {
  background: rgba(255, 159, 10, 0.1);
  color: #FF9F0A;
}

.status-success {
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
}

.status-cancelled,
.status-refunded {
  background: var(--bg-elevated);
  color: var(--text-tertiary);
}

.status-failed {
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
}

.order-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.order-time {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.order-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.price {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.original-price {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  text-decoration: line-through;
}

.order-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-primary {
  padding: 10px 18px;
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

.btn-outline {
  padding: 10px 18px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-outline:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.load-more button {
  padding: 10px 24px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
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
  margin-bottom: 8px;
}

.modal-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.form-group textarea {
  width: 100%;
  padding: 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.875rem;
  resize: none;
}

.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.refund-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(22, 93, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.75rem;
  color: var(--color-primary);
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
