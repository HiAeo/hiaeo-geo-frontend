<template>
  <div class="brand-credits">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">我的积分</h1>
        <div class="header-actions">
          <button class="secondary-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            刷新
          </button>
        </div>
      </div>
    </div>

    <!-- Balance Card -->
    <div class="balance-section">
      <div class="balance-card">
        <div class="balance-header">
          <span class="balance-label">账户余额</span>
          <span class="balance-plan">Pro 套餐</span>
        </div>
        <div class="balance-amount">
          <span class="amount-num">{{ formatNumber(stats.balance) }}</span>
          <span class="amount-unit">积分</span>
        </div>
        <div class="balance-stats">
          <div class="bstat">
            <span class="bstat-label">冻结</span>
            <span class="bstat-value">{{ stats.frozen }}</span>
          </div>
          <div class="bstat">
            <span class="bstat-label">可用</span>
            <span class="bstat-value available">{{ stats.available }}</span>
          </div>
          <div class="bstat">
            <span class="bstat-label">本月消耗</span>
            <span class="bstat-value">{{ stats.monthlyUsed }}</span>
          </div>
        </div>
        <button class="recharge-btn">立即充值</button>
      </div>

      <div class="usage-card">
        <h3>本月用量趋势</h3>
        <div class="usage-chart">
          <div v-for="(day, i) in usageTrend" :key="i" class="usage-bar-wrap">
            <div class="usage-bar" :style="{ height: (day.value / maxUsage * 100) + '%' }"></div>
            <span class="usage-label">{{ day.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Records -->
    <div class="records-section">
      <div class="records-header">
        <h2 class="section-title">积分明细</h2>
        <div class="filter-tabs">
          <button :class="{ active: tab === 'all' }" @click="tab = 'all'">全部</button>
          <button :class="{ active: tab === 'income' }" @click="tab = 'income'">收入</button>
          <button :class="{ active: tab === 'expense' }" @click="tab = 'expense'">消耗</button>
        </div>
      </div>

      <div class="records-list">
        <div v-for="record in filteredRecords" :key="record.id" class="record-item">
          <div class="record-icon" :class="record.type">
            <svg v-if="record.type === 'income'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="19" x2="12" y2="5"/>
              <polyline points="5 12 12 5 19 12"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <polyline points="19 12 12 19 5 12"/>
            </svg>
          </div>
          <div class="record-info">
            <span class="record-title">{{ record.title }}</span>
            <span class="record-time">{{ record.time }}</span>
          </div>
          <div class="record-amount" :class="record.type">
            {{ record.type === 'income' ? '+' : '-' }}{{ record.amount }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const tab = ref('all')

const stats = ref({
  balance: 24580,
  frozen: 1200,
  available: 23380,
  monthlyUsed: 3200
})

const usageTrend = ref([
  { label: '周一', value: 120 }, { label: '周二', value: 80 }, { label: '周三', value: 150 },
  { label: '周四', value: 60 }, { label: '周五', value: 200 }, { label: '周六', value: 180 },
  { label: '周日', value: 90 }
])

const records = ref([
  { id: 1, type: 'income', title: '充值 - Pro 套餐', amount: 10000, time: '2026-05-01 10:30' },
  { id: 2, type: 'expense', title: '品牌诊断 - 完整版', amount: 500, time: '2026-05-08 14:20' },
  { id: 3, type: 'expense', title: '品牌诊断 - 快速版', amount: 200, time: '2026-05-07 09:15' },
  { id: 4, type: 'expense', title: '报告导出', amount: 50, time: '2026-05-06 16:45' },
  { id: 5, type: 'income', title: '赠送积分', amount: 500, time: '2026-05-05 11:00' }
])

const maxUsage = computed(() => Math.max(...usageTrend.value.map(d => d.value)))

const filteredRecords = computed(() => {
  if (tab.value === 'all') return records.value
  return records.value.filter(r => r.type === tab.value)
})

const formatNumber = (num) => num?.toLocaleString() || '0'
</script>

<style scoped>
.brand-credits { min-height: 100vh; padding-bottom: 40px; background: var(--bg-primary); }
.page-header { position: sticky; top: 0; z-index: 50; background: var(--bg-primary); border-bottom: 1px solid var(--border-color); padding: 16px 24px; }
.header-content { display: flex; align-items: center; justify-content: space-between; max-width: 1400px; margin: 0 auto; }
.page-title { font-size: 1.25rem; font-weight: 700; }
.secondary-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: 10px; font-size: 0.8125rem; font-weight: 600; color: var(--text-primary); cursor: pointer; }

.balance-section { max-width: 1400px; margin: 0 auto; padding: 24px; display: grid; grid-template-columns: 1fr 2fr; gap: 16px; }
@media (max-width: 1024px) { .balance-section { grid-template-columns: 1fr; } }

.balance-card { background: linear-gradient(135deg, var(--color-primary), #8b5cf6); border-radius: 20px; padding: 28px; color: white; display: flex; flex-direction: column; gap: 16px; }
.balance-header { display: flex; justify-content: space-between; align-items: center; }
.balance-label { font-size: 0.875rem; opacity: 0.8; }
.balance-plan { font-size: 0.75rem; background: rgba(255,255,255,0.2); padding: 3px 10px; border-radius: 4px; }
.balance-amount { display: flex; align-items: baseline; gap: 8px; }
.amount-num { font-size: 3rem; font-weight: 800; line-height: 1; }
.amount-unit { font-size: 1rem; opacity: 0.8; }
.balance-stats { display: flex; gap: 16px; }
.bstat { display: flex; flex-direction: column; gap: 2px; }
.bstat-label { font-size: 0.75rem; opacity: 0.7; }
.bstat-value { font-size: 1rem; font-weight: 600; }
.bstat-value.available { color: #4ade80; }
.recharge-btn { padding: 12px; background: white; color: var(--color-primary); border: none; border-radius: 12px; font-size: 0.9375rem; font-weight: 700; cursor: pointer; margin-top: auto; transition: all 0.2s; }
.recharge-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }

.usage-card { background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: 20px; padding: 24px; }
.usage-card h3 { font-size: 0.9375rem; font-weight: 600; margin-bottom: 20px; }
.usage-chart { display: flex; align-items: flex-end; justify-content: space-between; height: 160px; gap: 8px; }
.usage-bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; }
.usage-bar { width: 100%; background: var(--color-primary); border-radius: 6px 6px 0 0; min-height: 4px; transition: height 0.5s ease; }
.usage-label { font-size: 0.6875rem; color: var(--text-tertiary); }

.records-section { max-width: 1400px; margin: 0 auto; padding: 0 24px 24px; }
.records-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.section-title { font-size: 1rem; font-weight: 700; }
.filter-tabs { display: flex; gap: 4px; background: var(--bg-elevated); border: 1px solid var(--border-color); padding: 4px; border-radius: 10px; }
.filter-tabs button { padding: 6px 14px; font-size: 0.8125rem; border: none; background: transparent; color: var(--text-secondary); border-radius: 8px; cursor: pointer; transition: all 0.2s; }
.filter-tabs button.active { background: var(--color-primary); color: white; }

.records-list { background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: 16px; overflow: hidden; }
.record-item { display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--border-color); transition: background 0.2s; }
.record-item:last-child { border-bottom: none; }
.record-item:hover { background: var(--bg-primary); }
.record-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.record-icon.income { background: rgba(16, 185, 129, 0.15); color: #059669; }
.record-icon.expense { background: rgba(239, 68, 68, 0.15); color: #dc2626; }
.record-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.record-title { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); }
.record-time { font-size: 0.75rem; color: var(--text-secondary); }
.record-amount { font-size: 0.9375rem; font-weight: 700; }
.record-amount.income { color: #059669; }
.record-amount.expense { color: #dc2626; }
</style>
