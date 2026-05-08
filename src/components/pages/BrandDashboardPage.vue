<template>
  <div class="brand-dashboard">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">品牌健康仪表盘</h1>
          <div class="brand-tag">
            <span class="brand-name">{{ brandName }}</span>
            <span class="report-count">{{ reports.length }} 份诊断报告</span>
          </div>
        </div>
        <div class="header-actions">
          <button class="secondary-btn" @click="$router.push('/app/diagnose')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            查看报告
          </button>
          <button class="primary-btn" @click="$router.push('/app/diagnose?new=true')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            新建诊断
          </button>
        </div>
      </div>
    </div>

    <!-- Brand Health Score Section -->
    <div class="health-section">
      <div class="health-main">
        <div class="health-gauge">
          <svg viewBox="0 0 200 120" class="gauge-svg">
            <!-- Background arc -->
            <path :d="gaugeBackgroundArc" fill="none" stroke="var(--border-color)" stroke-width="16" stroke-linecap="round"/>
            <!-- Score arc -->
            <path :d="gaugeScoreArc" fill="none" :stroke="gaugeColor" stroke-width="16" stroke-linecap="round"/>
          </svg>
          <div class="gauge-center">
            <span class="gauge-score">{{ overallScore }}</span>
            <span class="gauge-label">健康分</span>
          </div>
        </div>
        <div class="health-info">
          <div class="grade-badge" :class="'grade-' + grade">
            {{ gradeLabel }}
          </div>
          <div class="health-meta">
            <div class="meta-item">
              <span class="meta-label">较上月</span>
              <span class="meta-value" :class="trend >= 0 ? 'positive' : 'negative'">
                {{ trend >= 0 ? '+' : '' }}{{ trend }}分
              </span>
            </div>
            <div class="meta-item">
              <span class="meta-label">最新诊断</span>
              <span class="meta-value">{{ latestReportDate }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">诊断次数</span>
              <span class="meta-value">{{ reports.length }}次</span>
            </div>
          </div>
          <div class="dimension-preview">
            <div v-for="dim in topDimensions" :key="dim.name" class="dim-bar-item">
              <div class="dim-header">
                <span class="dim-name">{{ dim.name }}</span>
                <span class="dim-score">{{ dim.score }}</span>
              </div>
              <div class="dim-bar">
                <div class="dim-fill" :style="{ width: dim.score + '%', background: getDimColor(dim.score) }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Subscription Status Card -->
    <div class="subscription-card">
      <div class="sub-info">
        <div class="sub-plan">
          <span class="plan-badge" :class="'plan-' + (subscription?.planId || 'free')">
            {{ subscription?.planName || '免费版' }}
          </span>
          <span v-if="subscription?.daysRemaining" class="sub-days">
            剩余 {{ subscription.daysRemaining }} 天
          </span>
        </div>
        <p class="sub-desc">解锁更多AI引擎和诊断维度</p>
      </div>
      <button class="upgrade-btn" @click="$router.push('/app/pricing')">
        升级套餐
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </button>
    </div>

    <!-- AI Engines Usage -->
    <div class="engines-section">
      <div class="section-header">
        <h2 class="section-title">AI 引擎使用情况</h2>
        <span class="section-subtitle">各模型在不同诊断维度中的表现对比</span>
      </div>
      <div class="engines-grid">
        <div v-for="engine in engines" :key="engine.name" class="engine-card">
          <div class="engine-header">
            <div class="engine-icon" :style="{ background: engine.color + '20', color: engine.color }">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            </div>
            <span class="engine-name">{{ engine.name }}</span>
            <span class="engine-usage">{{ engine.usage }}%</span>
          </div>
          <div class="engine-bar">
            <div class="engine-fill" :style="{ width: engine.usage + '%', background: engine.color }"></div>
          </div>
          <div class="engine-stats">
            <span>平均得分: <strong>{{ engine.avgScore }}</strong></span>
            <span>调用: <strong>{{ engine.calls }}次</strong></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Reports & Competitors -->
    <div class="bottom-section">
      <!-- Recent Diagnosis Reports -->
      <div class="reports-card">
        <div class="card-header">
          <h3>近期诊断报告</h3>
          <router-link to="/app/diagnose" class="view-all">查看全部</router-link>
        </div>
        <div class="reports-list">
          <div v-for="report in reports.slice(0, 5)" :key="report.id" class="report-item" @click="$router.push('/app/diagnose/' + report.id)">
            <div class="report-info">
              <span class="report-brand">{{ report.brandName }}</span>
              <span class="report-type">{{ report.type }}</span>
            </div>
            <div class="report-score">
              <span class="score-value" :class="'score-' + getScoreClass(report.score)">{{ report.score }}</span>
            </div>
            <div class="report-date">{{ report.date }}</div>
          </div>
          <div v-if="reports.length === 0" class="empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <p>暂无诊断报告</p>
            <button class="primary-btn small" @click="$router.push('/app/diagnose?new=true')">立即诊断</button>
          </div>
        </div>
      </div>

      <!-- Competitor Overview -->
      <div class="competitors-card">
        <div class="card-header">
          <h3>竞品对比</h3>
          <span class="view-all">实时数据</span>
        </div>
        <div class="competitor-list">
          <div v-for="(comp, index) in competitors" :key="index" class="comp-item">
            <div class="comp-rank" :class="'rank-' + (index + 1)">{{ index + 1 }}</div>
            <div class="comp-info">
              <span class="comp-name">{{ comp.name }}</span>
              <span class="comp-score">{{ comp.score }}分</span>
            </div>
            <div class="comp-bar">
              <div class="comp-fill" :style="{ width: (comp.score / 100 * 100) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '../../composables/useApi'

const { getCurrentSubscription } = useApi()

const subscription = ref(null)

const brandName = ref('我的品牌')
const overallScore = ref(78)
const grade = ref('B')
const trend = ref(5)
const latestReportDate = ref('2026-05-08')

const topDimensions = ref([
  { name: '品牌认知', score: 82 },
  { name: '内容质量', score: 75 },
  { name: '用户互动', score: 68 },
  { name: '视觉一致性', score: 85 }
])

const engines = ref([
  { name: 'DeepSeek', usage: 85, avgScore: 76, calls: 1240, color: '#6366f1' },
  { name: 'Kimi', usage: 62, avgScore: 74, calls: 890, color: '#f59e0b' },
  { name: 'Qwen', usage: 45, avgScore: 78, calls: 650, color: '#10b981' },
  { name: '智谱 GLM', usage: 38, avgScore: 72, calls: 540, color: '#ef4444' },
  { name: '豆包', usage: 28, avgScore: 71, calls: 410, color: '#8b5cf6' }
])

const reports = ref([
  { id: 1, brandName: '我的品牌', type: '完整诊断', score: 78, date: '2026-05-08', grade: 'B' },
  { id: 2, brandName: '我的品牌', type: '快速诊断', score: 75, date: '2026-04-25', grade: 'C' },
  { id: 3, brandName: '我的品牌', type: '完整诊断', score: 73, date: '2026-04-10', grade: 'C' }
])

const competitors = ref([
  { name: '竞品 A', score: 88 },
  { name: '竞品 B', score: 82 },
  { name: '我的品牌', score: 78 },
  { name: '竞品 C', score: 65 },
  { name: '竞品 D', score: 52 }
])

const gradeLabel = computed(() => {
  const labels = { A: '优秀', B: '良好', C: '一般', D: '较差', F: '不合格' }
  return labels[grade.value] || grade.value
})

const gaugeColor = computed(() => {
  if (overallScore.value >= 85) return '#10b981'
  if (overallScore.value >= 70) return '#6366f1'
  if (overallScore.value >= 55) return '#f59e0b'
  return '#ef4444'
})

const gaugeBackgroundArc = computed(() => {
  const cx = 100, cy = 110, r = 70
  const startAngle = 180
  const endAngle = 360
  const x1 = cx + r * Math.cos(Math.PI * startAngle / 180)
  const y1 = cy + r * Math.sin(Math.PI * startAngle / 180)
  const x2 = cx + r * Math.cos(Math.PI * endAngle / 180)
  const y2 = cy + r * Math.sin(Math.PI * endAngle / 180)
  return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`
})

const gaugeScoreArc = computed(() => {
  const cx = 100, cy = 110, r = 70
  const startAngle = 180
  const endAngle = 180 + (overallScore.value / 100) * 180
  const x1 = cx + r * Math.cos(Math.PI * startAngle / 180)
  const y1 = cy + r * Math.sin(Math.PI * startAngle / 180)
  const x2 = cx + r * Math.cos(Math.PI * endAngle / 180)
  const y2 = cy + r * Math.sin(Math.PI * endAngle / 180)
  return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`
})

const getDimColor = (score) => {
  if (score >= 80) return '#10b981'
  if (score >= 65) return '#6366f1'
  if (score >= 50) return '#f59e0b'
  return '#ef4444'
}

const getScoreClass = (score) => {
  if (score >= 85) return 'high'
  if (score >= 70) return 'mid'
  return 'low'
}

onMounted(async () => {
  // Load brand data from API
  try {
    const subData = await getCurrentSubscription()
    subscription.value = subData
  } catch (error) {
    console.error('Failed to load subscription:', error)
  }
})
</script>

<style scoped>
.brand-dashboard {
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
}

.brand-tag {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-name {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.report-count {
  font-size: 0.75rem;
  color: var(--color-primary);
  background: rgba(99, 102, 241, 0.12);
  padding: 2px 8px;
  border-radius: 4px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.primary-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.primary-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.primary-btn.small {
  padding: 8px 12px;
  font-size: 0.8125rem;
}

.secondary-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.secondary-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Health Section */
.health-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.health-main {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 32px;
  display: flex;
  align-items: center;
  gap: 40px;
}

.health-gauge {
  position: relative;
  width: 200px;
  flex-shrink: 0;
}

.gauge-svg {
  width: 200px;
  height: 120px;
}

.gauge-center {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gauge-score {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
}

.gauge-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

.health-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.grade-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  width: fit-content;
}

.grade-A { background: rgba(16, 185, 129, 0.15); color: #059669; }
.grade-B { background: rgba(99, 102, 241, 0.15); color: #4f46e5; }
.grade-C { background: rgba(245, 158, 11, 0.15); color: #d97706; }
.grade-D { background: rgba(239, 68, 68, 0.15); color: #dc2626; }
.grade-F { background: rgba(107, 114, 128, 0.15); color: #6b7280; }

.health-meta {
  display: flex;
  gap: 24px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.meta-label {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.meta-value {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
}

.meta-value.positive { color: #059669; }
.meta-value.negative { color: #dc2626; }

.dimension-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dim-bar-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dim-header {
  display: flex;
  justify-content: space-between;
}

.dim-name {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.dim-score {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.dim-bar {
  height: 6px;
  background: var(--border-color);
  border-radius: 3px;
  overflow: hidden;
}

.dim-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 1s ease;
}

/* Subscription Card */
.subscription-card {
  max-width: 1400px;
  margin: 0 auto 24px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 16px;
  padding: 20px 24px;
}

.sub-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sub-plan {
  display: flex;
  align-items: center;
  gap: 12px;
}

.plan-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.plan-free {
  background: var(--bg-elevated);
  color: var(--text-secondary);
}

.plan-basic {
  background: rgba(16, 185, 129, 0.15);
  color: #10B981;
}

.plan-pro {
  background: rgba(99, 102, 241, 0.15);
  color: #6366f1;
}

.plan-enterprise {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.sub-days {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.sub-desc {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin: 0;
}

.upgrade-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.upgrade-btn:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
}

/* Engines Section */
.engines-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px 24px;
}

.section-header {
  margin-bottom: 16px;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.section-subtitle {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.engines-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.engine-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
}

.engine-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.engine-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.engine-name {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.engine-usage {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
}

.engine-bar {
  height: 6px;
  background: var(--border-color);
  border-radius: 3px;
  margin-bottom: 8px;
  overflow: hidden;
}

.engine-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 1s ease;
}

.engine-stats {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.engine-stats strong {
  color: var(--text-primary);
}

@media (max-width: 1200px) {
  .engines-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 768px) {
  .engines-grid { grid-template-columns: repeat(2, 1fr); }
  .health-main { flex-direction: column; }
  .health-gauge { width: 160px; }
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

.reports-card,
.competitors-card {
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
  color: var(--text-primary);
}

.view-all {
  font-size: 0.8125rem;
  color: var(--color-primary);
  cursor: pointer;
  text-decoration: none;
}

.view-all:hover {
  text-decoration: underline;
}

.reports-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.report-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-primary);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.report-item:hover {
  background: var(--border-color);
}

.report-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.report-brand {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.report-type {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.report-score {
  text-align: center;
}

.score-value {
  font-size: 1.25rem;
  font-weight: 800;
}

.score-high { color: #059669; }
.score-mid { color: #4f46e5; }
.score-low { color: #d97706; }

.report-date {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px;
  color: var(--text-tertiary);
  text-align: center;
}

.empty-state p {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Competitor List */
.competitor-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comp-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.comp-rank {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  background: var(--bg-primary);
  flex-shrink: 0;
}

.comp-rank.rank-1 { background: rgba(245, 158, 11, 0.2); color: #d97706; }
.comp-rank.rank-2 { background: rgba(156, 163, 175, 0.25); color: #6b7280; }
.comp-rank.rank-3 { background: rgba(180, 83, 9, 0.2); color: #b45309; }

.comp-info {
  width: 100px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-shrink: 0;
}

.comp-name {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-primary);
}

.comp-score {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.comp-bar {
  flex: 1;
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.comp-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 4px;
  transition: width 1s ease;
}
</style>
