<template>
  <div class="pricing-page" :data-theme="theme">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <button class="back-btn" @click="$emit('back')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
        </button>
        <h1 class="page-title">选择套餐</h1>
      </div>
    </div>

    <!-- Current Subscription Status -->
    <div v-if="currentSubscription" class="subscription-status-card">
      <div class="status-info">
        <span class="status-label">当前订阅</span>
        <span class="status-plan">{{ currentSubscription.planName }}</span>
        <span v-if="currentSubscription.status !== 'free'" class="status-expiry">
          到期时间：{{ formatDate(currentSubscription.endDate) }}
        </span>
        <span v-if="currentSubscription.daysRemaining !== undefined" class="status-days">
          剩余 {{ currentSubscription.daysRemaining }} 天
        </span>
      </div>
      <button 
        v-if="currentSubscription.planId !== 'enterprise'"
        class="btn-upgrade"
        @click="handleUpgrade"
      >
        升级套餐
      </button>
    </div>

    <!-- Pricing Cards -->
    <div class="pricing-cards">
      <div 
        v-for="plan in plans" 
        :key="plan.id"
        class="pricing-card"
        :class="{ 
          'card-recommended': plan.recommended,
          'card-selected': selectedPlan === plan.id,
          'card-current': currentSubscription?.planId === plan.id
        }"
      >
        <!-- Recommended Badge -->
        <div v-if="plan.recommended" class="recommended-badge">
          推荐方案
        </div>

        <!-- Plan Header -->
        <div class="plan-header">
          <h3 class="plan-name">{{ plan.name }}</h3>
          <div class="plan-price">
            <span class="price-currency">¥</span>
            <span class="price-value">{{ plan.price }}</span>
            <span v-if="plan.price > 0" class="price-period">/{{ plan.period }}</span>
          </div>
          <div v-if="plan.originalPrice > plan.price" class="plan-original">
            原价 ¥{{ plan.originalPrice }}
          </div>
        </div>

        <!-- Features List -->
        <div class="plan-features">
          <div v-for="feature in plan.features" :key="feature" class="feature-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="feature-icon">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>{{ feature }}</span>
          </div>
        </div>

        <!-- Plan Limits -->
        <div class="plan-limits">
          <div class="limit-item">
            <span class="limit-label">诊断引擎</span>
            <span class="limit-value">{{ plan.limits.diagnosisEngines === -1 ? '无限' : plan.limits.diagnosisEngines + '个' }}</span>
          </div>
          <div class="limit-item">
            <span class="limit-label">诊断问题</span>
            <span class="limit-value">{{ plan.limits.diagnosisQuestions === -1 ? '无限' : plan.limits.diagnosisQuestions + '条' }}</span>
          </div>
          <div class="limit-item">
            <span class="limit-label">内容生成</span>
            <span class="limit-value">{{ plan.limits.contentPerMonth === -1 ? '无限' : plan.limits.contentPerMonth + '篇/月' }}</span>
          </div>
          <div class="limit-item">
            <span class="limit-label">竞品监控</span>
            <span class="limit-value">{{ plan.limits.competitors === -1 ? '无限' : plan.limits.competitors + '个' }}</span>
          </div>
        </div>

        <!-- Action Button -->
        <button 
          class="plan-action-btn"
          :class="{ 'btn-primary': plan.recommended, 'btn-secondary': !plan.recommended }"
          :disabled="loading || currentSubscription?.planId === plan.id"
          @click="handleSelectPlan(plan)"
        >
          <span v-if="loading && selectedPlan === plan.id" class="loading-spinner"></span>
          <span v-else-if="currentSubscription?.planId === plan.id">当前方案</span>
          <span v-else-if="plan.price === 0">免费开始</span>
          <span v-else>选择此方案</span>
        </button>
      </div>
    </div>

    <!-- Trust Badges -->
    <div class="trust-badges">
      <div class="badge-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <span>数据加密存储</span>
      </div>
      <div class="badge-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <span>7天无理由退款</span>
      </div>
      <div class="badge-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <span>24小时技术支持</span>
      </div>
    </div>

    <!-- Payment Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showPaymentModal" class="modal-overlay" @click.self="showPaymentModal = false">
          <div class="modal-container payment-modal">
            <button class="modal-close" @click="showPaymentModal = false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <h2 class="modal-title">确认订单</h2>

            <!-- Order Summary -->
            <div class="order-summary">
              <div class="summary-row">
                <span>套餐</span>
                <span>{{ selectedPlanData?.name }}</span>
              </div>
              <div class="summary-row">
                <span>时长</span>
                <span>{{ duration }} {{ duration > 1 ? '个月' : '个月' }}</span>
              </div>
              <div class="summary-row">
                <span>原价</span>
                <span>¥{{ selectedPlanData?.price * duration }}</span>
              </div>
              <div v-if="couponDiscount > 0" class="summary-row discount">
                <span>优惠券</span>
                <span>-¥{{ couponDiscount }}</span>
              </div>
              <div class="summary-row total">
                <span>应付金额</span>
                <span>¥{{ finalAmount }}</span>
              </div>
            </div>

            <!-- Coupon Input -->
            <div class="coupon-section">
              <input 
                v-model="couponCode"
                type="text" 
                placeholder="输入优惠券码"
                class="coupon-input"
              />
              <button class="btn-verify" @click="verifyCoupon" :disabled="!couponCode">
                验证
              </button>
            </div>
            <p v-if="couponMessage" class="coupon-message" :class="{ error: couponError }">
              {{ couponMessage }}
            </p>

            <!-- Payment Methods -->
            <div class="payment-methods">
              <h3>选择支付方式</h3>
              <div class="method-options">
                <label class="method-option" :class="{ selected: paymentMethod === 'alipay' }">
                  <input type="radio" v-model="paymentMethod" value="alipay" />
                  <span class="method-icon">💙</span>
                  <span>支付宝</span>
                </label>
                <label class="method-option" :class="{ selected: paymentMethod === 'wechat' }">
                  <input type="radio" v-model="paymentMethod" value="wechat" />
                  <span class="method-icon">💚</span>
                  <span>微信支付</span>
                </label>
                <label class="method-option" :class="{ selected: paymentMethod === 'card' }">
                  <input type="radio" v-model="paymentMethod" value="card" />
                  <span class="method-icon">💳</span>
                  <span>银行卡</span>
                </label>
              </div>
            </div>

            <!-- Duration Selection -->
            <div class="duration-section">
              <h3>选择时长</h3>
              <div class="duration-options">
                <button 
                  v-for="d in [1, 3, 6, 12]" 
                  :key="d"
                  class="duration-btn"
                  :class="{ selected: duration === d }"
                  @click="duration = d"
                >
                  {{ d }}个月
                  <span v-if="d >= 12" class="discount-hint">享8折</span>
                </button>
              </div>
            </div>

            <!-- Pay Button -->
            <button class="btn-pay" @click="handlePay" :disabled="paymentLoading">
              <span v-if="paymentLoading" class="loading-spinner"></span>
              <span v-else>确认支付 ¥{{ finalAmount }}</span>
            </button>

            <!-- Agreement -->
            <p class="agreement-text">
              点击确认即表示您同意
              <a href="#">《服务条款》</a> 和 <a href="#">《隐私政策》</a>
            </p>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Success Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showSuccessModal" class="modal-overlay" @click.self="showSuccessModal = false">
          <div class="modal-container success-modal">
            <div class="success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="8 12 11 15 16 9"/>
              </svg>
            </div>
            <h2 class="success-title">支付成功</h2>
            <p class="success-message">
              您已成功升级到{{ selectedPlanData?.name }}，感谢您的支持！
            </p>
            <button class="btn-continue" @click="handleContinue">
              继续使用
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

const props = defineProps({
  theme: {
    type: String,
    default: 'dark'
  }
})

const emit = defineEmits(['back', 'success'])

const { getPlans, getCurrentSubscription, createOrder, payOrder, validateCoupon } = useApi()

// State
const plans = ref([])
const currentSubscription = ref(null)
const loading = ref(false)
const selectedPlan = ref(null)

// Payment modal
const showPaymentModal = ref(false)
const selectedPlanData = ref(null)
const duration = ref(1)
const paymentMethod = ref('alipay')
const paymentLoading = ref(false)
const couponCode = ref('')
const couponDiscount = ref(0)
const couponMessage = ref('')
const couponError = ref(false)

// Success modal
const showSuccessModal = ref(false)

// Computed
const finalAmount = computed(() => {
  const base = (selectedPlanData.value?.price || 0) * duration.value
  return Math.max(0, base - couponDiscount.value)
})

// Methods
const loadData = async () => {
  loading.value = true
  try {
    const [plansData, subscriptionData] = await Promise.all([
      getPlans(),
      getCurrentSubscription()
    ])
    plans.value = plansData
    currentSubscription.value = subscriptionData
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    loading.value = false
  }
}

const handleSelectPlan = (plan) => {
  selectedPlan.value = plan.id
  selectedPlanData.value = plan
  showPaymentModal.value = true
  // Reset state
  duration.value = 1
  couponCode.value = ''
  couponDiscount.value = 0
  couponMessage.value = ''
}

const handleUpgrade = () => {
  // Find next plan
  const currentIndex = plans.value.findIndex(p => p.id === currentSubscription.value?.planId)
  if (currentIndex >= 0 && currentIndex < plans.value.length - 1) {
    const nextPlan = plans.value[currentIndex + 1]
    handleSelectPlan(nextPlan)
  }
}

const verifyCoupon = async () => {
  if (!couponCode.value) return
  
  try {
    const result = await validateCoupon(couponCode.value)
    if (result.valid) {
      couponError.value = false
      couponMessage.value = result.message || '优惠券有效'
      // Calculate discount
      const base = (selectedPlanData.value?.price || 0) * duration.value
      couponDiscount.value = Math.round(base * (result.discount / 100))
    } else {
      couponError.value = true
      couponMessage.value = result.message || '优惠券无效'
      couponDiscount.value = 0
    }
  } catch (error) {
    couponError.value = true
    couponMessage.value = '验证失败'
    couponDiscount.value = 0
  }
}

const handlePay = async () => {
  if (!selectedPlanData.value) return
  
  paymentLoading.value = true
  try {
    // Create order
    const order = await createOrder({
      planType: selectedPlanData.value.id,
      duration: duration.value,
      paymentMethod: paymentMethod.value,
      couponCode: couponCode.value || undefined
    })
    
    // Pay order
    await payOrder(order.id, paymentMethod.value)
    
    // Show success
    showPaymentModal.value = false
    showSuccessModal.value = true
    
    // Reload subscription
    await loadData()
  } catch (error) {
    console.error('Payment failed:', error)
    alert('支付失败: ' + error.message)
  } finally {
    paymentLoading.value = false
  }
}

const handleContinue = () => {
  showSuccessModal.value = false
  emit('success')
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('zh-CN')
}

// Lifecycle
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.pricing-page {
  min-height: 100vh;
  padding-bottom: 40px;
  background: var(--bg-primary);
}

/* Header */
.page-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-elevated);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: var(--bg-glass);
  border-color: var(--border-color-hover);
}

.page-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* Subscription Status */
.subscription-status-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px;
  padding: 16px 20px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.status-label {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.status-plan {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.status-expiry, .status-days {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.btn-upgrade {
  padding: 8px 16px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-upgrade:hover {
  background: var(--color-primary-hover);
}

/* Pricing Cards */
.pricing-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 20px;
}

@media (min-width: 768px) {
  .pricing-cards {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
}

.pricing-card {
  position: relative;
  flex: 1;
  min-width: 280px;
  max-width: 360px;
  padding: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.3s;
}

@media (min-width: 768px) {
  .pricing-card {
    max-width: none;
  }
}

.pricing-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-color-hover);
}

.pricing-card.card-recommended {
  background: rgba(22, 93, 255, 0.08);
  border-color: rgba(22, 93, 255, 0.3);
}

.pricing-card.card-selected {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.1);
}

.pricing-card.card-current {
  border-color: #10B981;
}

.recommended-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 12px;
  background: linear-gradient(135deg, #165DFF, #8B5CF6);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}

.plan-header {
  margin-bottom: 20px;
}

.plan-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.plan-price {
  display: flex;
  align-items: baseline;
}

.price-currency {
  font-size: 1rem;
  color: var(--text-secondary);
}

.price-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.price-period {
  font-size: 0.875rem;
  color: var(--text-tertiary);
  margin-left: 4px;
}

.plan-original {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  text-decoration: line-through;
  margin-top: 4px;
}

/* Features */
.plan-features {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.feature-icon {
  color: #10B981;
  flex-shrink: 0;
}

/* Limits */
.plan-limits {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 12px;
  background: var(--bg-elevated);
  border-radius: 8px;
  margin-bottom: 20px;
}

.limit-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.limit-label {
  font-size: 0.625rem;
  color: var(--text-tertiary);
  text-transform: uppercase;
}

.limit-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

/* Action Button */
.plan-action-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
}

.plan-action-btn.btn-primary {
  background: #165DFF;
  color: white;
}

.plan-action-btn.btn-primary:hover:not(:disabled) {
  background: #0040ED;
  box-shadow: 0 0 20px rgba(22, 93, 255, 0.4);
}

.plan-action-btn.btn-secondary {
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.plan-action-btn.btn-secondary:hover:not(:disabled) {
  background: var(--bg-glass-hover);
  border-color: var(--border-color-hover);
}

.plan-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Trust Badges */
.trust-badges {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 32px;
  padding: 0 20px;
  flex-wrap: wrap;
}

.badge-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.badge-item svg {
  color: #10B981;
}

/* Loading */
.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Payment Modal */
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
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
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

/* Order Summary */
.order-summary {
  background: var(--bg-elevated);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-row.discount {
  color: #10B981;
}

.summary-row.total {
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-primary);
  padding-top: 12px;
}

/* Coupon */
.coupon-section {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.coupon-input {
  flex: 1;
  padding: 10px 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.coupon-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.btn-verify {
  padding: 10px 16px;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
}

.btn-verify:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.coupon-message {
  font-size: 0.75rem;
  color: #10B981;
  margin-bottom: 16px;
}

.coupon-message.error {
  color: #EF4444;
}

/* Payment Methods */
.payment-methods {
  margin-bottom: 20px;
}

.payment-methods h3,
.duration-section h3 {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.method-options {
  display: flex;
  gap: 12px;
}

.method-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.method-option input {
  display: none;
}

.method-option.selected {
  border-color: var(--color-primary);
  background: rgba(22, 93, 255, 0.05);
}

.method-icon {
  font-size: 1.5rem;
}

/* Duration */
.duration-section {
  margin-bottom: 20px;
}

.duration-options {
  display: flex;
  gap: 8px;
}

.duration-btn {
  flex: 1;
  padding: 10px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.duration-btn.selected {
  border-color: var(--color-primary);
  background: rgba(22, 93, 255, 0.05);
}

.discount-hint {
  font-size: 0.625rem;
  color: #10B981;
}

/* Pay Button */
.btn-pay {
  width: 100%;
  padding: 14px;
  background: #165DFF;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  margin-bottom: 12px;
}

.btn-pay:hover:not(:disabled) {
  background: #0040ED;
}

.btn-pay:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.agreement-text {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  text-align: center;
}

.agreement-text a {
  color: var(--color-primary);
  text-decoration: none;
}

/* Success Modal */
.success-modal {
  text-align: center;
}

.success-icon {
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

.btn-continue {
  width: 100%;
  padding: 12px;
  background: #165DFF;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

/* Modal Animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: translateY(-20px) scale(0.98);
  opacity: 0;
}
</style>
