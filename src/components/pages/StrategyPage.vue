<template>
  <div class="strategy-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">MiraMod模豆 · GEO智能策略生成</h1>
          <span class="page-subtitle">内置6类语义实体库，AI替你写好文章、代码、关键词库，各引擎风格一键适配，拿到就能发</span>
        </div>
        <div class="header-actions">
          <div class="credits-info">
            <span class="credits-icon">⚡</span>
            <span>每次生成消耗 30 积分</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="tab-navigation">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['tab-btn', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <!-- Content Area -->
    <div class="content-area">
      <!-- Strategy Generator -->
      <div class="generator-panel">
        <div class="input-section">
          <h3>策略生成</h3>
          <p class="section-desc">填写品牌信息，AI自动生成完整的营销策略方案</p>
          
          <div class="form-grid">
            <div class="form-group">
              <label>品牌名称 <span class="required">*</span></label>
              <input 
                v-model="form.brandName" 
                type="text" 
                placeholder="例如：魔鲸科技"
              />
            </div>
            <div class="form-group">
              <label>策略类型</label>
              <select v-model="form.strategyType">
                <option value="content">内容策略</option>
                <option value="faq">FAQ策略</option>
                <option value="product">产品策略</option>
                <option value="competitor">竞品策略</option>
                <option value="seo">SEO策略</option>
                <option value="social">社交媒体策略</option>
              </select>
            </div>
            <div class="form-group">
              <label>行业领域</label>
              <input 
                v-model="form.industry" 
                type="text" 
                placeholder="例如：SaaS/企业服务"
              />
            </div>
            <div class="form-group">
              <label>预算范围</label>
              <select v-model="form.budget">
                <option value="">请选择</option>
                <option value="10万以下">10万以下</option>
                <option value="10-50万/年">10-50万/年</option>
                <option value="50-100万/年">50-100万/年</option>
                <option value="100万以上">100万以上</option>
              </select>
            </div>
            <div class="form-group">
              <label>计划周期（周）</label>
              <select v-model="form.planningWeeks">
                <option :value="4">4周（1个月）</option>
                <option :value="8">8周（2个月）</option>
                <option :value="12">12周（3个月）</option>
                <option :value="24">24周（6个月）</option>
                <option :value="52">52周（1年）</option>
              </select>
            </div>
            <div class="form-group full-width">
              <label>产品/服务描述</label>
              <textarea 
                v-model="form.productDescription" 
                rows="2"
                placeholder="简要描述您的产品或服务..."
              ></textarea>
            </div>
            <div class="form-group full-width">
              <label>目标受众</label>
              <input 
                v-model="form.targetAudience" 
                type="text" 
                placeholder="例如：25-40岁企业管理者、电商运营人员"
              />
            </div>
            <div class="form-group full-width">
              <label>核心关键词</label>
              <input 
                v-model="form.keywords" 
                type="text" 
                placeholder="用逗号分隔，例如：AI写作, 智能营销, 内容生成"
              />
            </div>
            <div class="form-group full-width">
              <label>竞争对手</label>
              <input 
                v-model="form.competitors" 
                type="text" 
                placeholder="用逗号分隔，例如：竞品A, 竞品B"
              />
            </div>
            <div class="form-group">
              <label>品牌优势</label>
              <input 
                v-model="form.brandStrengths" 
                type="text" 
                placeholder="技术领先, 用户体验好"
              />
            </div>
            <div class="form-group">
              <label>品牌挑战</label>
              <input 
                v-model="form.brandChallenges" 
                type="text" 
                placeholder="品牌认知度不高"
              />
            </div>
          </div>

          <div class="platform-selection">
            <label>目标平台</label>
            <div class="platform-grid">
              <label 
                v-for="platform in platforms" 
                :key="platform.id"
                :class="['platform-item', { selected: form.targetPlatforms.includes(platform.id) }]"
              >
                <input 
                  type="checkbox" 
                  :value="platform.id"
                  v-model="form.targetPlatforms"
                  hidden
                />
                <span class="platform-icon">{{ platform.icon }}</span>
                <span class="platform-name">{{ platform.name }}</span>
              </label>
            </div>
          </div>

          <button 
            class="generate-btn primary"
            :disabled="!form.brandName || generating"
            @click="generateStrategy"
          >
            <span v-if="generating" class="loading-spinner"></span>
            <span v-else>🎯 生成策略</span>
          </button>
        </div>

        <!-- Generated Result -->
        <div v-if="strategyResult" class="result-section">
          <div class="result-header">
            <h3>策略方案</h3>
            <div class="result-actions">
              <button class="action-btn" @click="downloadStrategy">
                📥 导出策略
              </button>
              <button class="action-btn primary" @click="applyStrategy">
                🚀 应用策略
              </button>
            </div>
          </div>

          <div class="strategy-overview">
            <div class="overview-card">
              <h4>📋 策略概览</h4>
              <p class="summary">{{ strategyResult.content.summary }}</p>
            </div>

            <div class="objectives-card">
              <h4>🎯 核心目标</h4>
              <ul>
                <li v-for="(obj, i) in strategyResult.content.coreObjectives" :key="i">{{ obj }}</li>
              </ul>
            </div>

            <div class="kpis-card">
              <h4>📊 关键绩效指标</h4>
              <table>
                <thead>
                  <tr>
                    <th>指标</th>
                    <th>当前</th>
                    <th>目标</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="kpi in strategyResult.content.kpis" :key="kpi.name">
                    <td>{{ kpi.name }}</td>
                    <td>{{ kpi.current || '-' }}</td>
                    <td class="target">{{ kpi.target }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="strategy-section">
            <h4>📝 内容策略</h4>
            <div class="content-themes">
              <div v-for="theme in strategyResult.content.contentThemes" :key="theme.theme" class="theme-item">
                <span class="theme-name">{{ theme.theme }}</span>
                <span class="theme-desc">{{ theme.description }}</span>
                <span :class="['priority-badge', theme.priority]">{{ theme.priority }}</span>
              </div>
            </div>
          </div>

          <div class="strategy-section">
            <h4>🔑 关键词策略</h4>
            <div class="keywords-section">
              <div class="keywords-group">
                <h5>核心关键词</h5>
                <div class="keyword-tags">
                  <span v-for="kw in strategyResult.content.coreKeywords" :key="kw.keyword" class="keyword-tag">
                    {{ kw.keyword }}
                    <span class="difficulty" :class="kw.difficulty.toLowerCase()">{{ kw.difficulty }}</span>
                  </span>
                </div>
              </div>
              <div class="keywords-group">
                <h5>长尾关键词</h5>
                <div class="keyword-tags">
                  <span v-for="kw in strategyResult.content.longTailKeywords" :key="kw.keyword" class="keyword-tag secondary">
                    {{ kw.keyword }}
                    <span class="opportunity">{{ kw.opportunity }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="strategy-section">
            <h4>📱 平台执行计划</h4>
            <div class="platform-plans">
              <div v-for="plan in strategyResult.content.platformPlan" :key="plan.platform" class="platform-plan">
                <div class="platform-header">
                  <span class="platform-name">{{ getPlatformName(plan.platform) }}</span>
                  <span class="budget-tag">{{ plan.budget || '-' }}</span>
                </div>
                <div class="plan-details">
                  <p><strong>内容类型：</strong>{{ plan.contentTypes?.join(', ') }}</p>
                  <p><strong>发布频率：</strong>{{ plan.postingFrequency }}</p>
                  <p><strong>关键指标：</strong>{{ plan.keyMetrics?.join(', ') }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="strategy-section">
            <h4>📅 执行时间线</h4>
            <div class="timeline">
              <div v-for="phase in strategyResult.content.timeline" :key="phase.phase" class="timeline-phase">
                <div class="phase-header">
                  <span class="phase-name">{{ phase.phase }}</span>
                  <span class="phase-duration">{{ phase.duration }} (第{{ phase.startWeek }}-{{ phase.endWeek }}周)</span>
                </div>
                <div class="phase-tasks">
                  <div v-for="task in phase.tasks" :key="task.task" class="task-item">
                    <span class="task-name">{{ task.task }}</span>
                    <span class="task-deliverable">{{ task.deliverable }}</span>
                  </div>
                </div>
                <div class="phase-milestones">
                  <span v-for="m in phase.milestones" :key="m" class="milestone">🏁 {{ m }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="strategy-section">
            <h4>💡 执行建议</h4>
            <ul class="recommendations">
              <li v-for="rec in strategyResult.content.recommendations" :key="rec">{{ rec }}</li>
            </ul>
          </div>

          <div class="strategy-section">
            <h4>⚠️ 潜在风险</h4>
            <div class="risks">
              <div v-for="risk in strategyResult.content.risks" :key="risk.risk" class="risk-item">
                <span class="risk-name">{{ risk.risk }}</span>
                <span :class="['risk-probability', risk.probability]">{{ risk.probability }}</span>
                <p class="risk-mitigation">{{ risk.mitigation }}</p>
              </div>
            </div>
          </div>

          <div class="strategy-section">
            <h4>📦 资源需求</h4>
            <table class="resources-table">
              <thead>
                <tr>
                  <th>资源类型</th>
                  <th>需求量</th>
                  <th>预计成本</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="res in strategyResult.content.resourceRequirements" :key="res.type">
                  <td>{{ res.type }}</td>
                  <td>{{ res.quantity }}</td>
                  <td>{{ res.cost }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type">
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const tabs = [
  { id: 'strategy', label: '策略生成', icon: '🎯' },
]

const activeTab = ref('strategy')
const generating = ref(false)
const strategyResult = ref(null)

const toast = reactive({
  show: false,
  message: '',
  type: 'success'
})

const showToast = (message, type = 'success') => {
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => { toast.show = false }, 3000)
}

const platforms = [
  { id: 'website', name: '官网', icon: '🌐' },
  { id: 'wechat', name: '微信公众号', icon: '💬' },
  { id: 'wechat_moments', name: '朋友圈', icon: '👥' },
  { id: 'weibo', name: '微博', icon: '📱' },
  { id: 'douyin', name: '抖音', icon: '🎬' },
  { id: 'xiaohongshu', name: '小红书', icon: '📕' },
  { id: 'bilibili', name: 'B站', icon: '📺' },
  { id: 'baidu', name: '百度', icon: '🔍' },
  { id: 'taobao', name: '淘宝', icon: '🛒' },
  { id: 'tmall', name: '天猫', icon: '🏪' },
  { id: 'jd', name: '京东', icon: '📦' },
]

const form = reactive({
  brandName: '',
  strategyType: 'content',
  industry: '',
  budget: '',
  planningWeeks: 12,
  productDescription: '',
  targetAudience: '',
  keywords: '',
  competitors: '',
  brandStrengths: '',
  brandChallenges: '',
  targetPlatforms: ['website', 'wechat'],
})

const getPlatformName = (platformId) => {
  const platform = platforms.find(p => p.id === platformId)
  return platform ? platform.name : platformId
}

const generateStrategy = async () => {
  if (!form.brandName) return
  
  generating.value = true
  try {
    const payload = {
      ...form,
      keywords: form.keywords ? form.keywords.split(',').map(k => k.trim()) : [],
    }
    
    const response = await fetch('/api/strategy/mofa/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await response.json()
    strategyResult.value = data
    showToast('策略生成成功！')
  } catch (error) {
    showToast('生成失败，请重试', 'error')
  } finally {
    generating.value = false
  }
}

const downloadStrategy = () => {
  if (!strategyResult.value) return
  
  const content = JSON.stringify(strategyResult.value, null, 2)
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `strategy-${strategyResult.value.name}-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
  showToast('导出成功')
}

const applyStrategy = () => {
  showToast('策略已保存，可在发布系统中使用')
}
</script>

<style scoped>
.strategy-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-bottom: 40px;
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

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.credits-info {
  background: rgba(245, 158, 11, 0.1);
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-warning);
}

.credits-icon {
  font-size: 1rem;
}

.tab-navigation {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  background: var(--bg-elevated);
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  color: var(--text-secondary);
}

.tab-btn:hover {
  background: var(--bg-primary);
}

.tab-btn.active {
  background: var(--color-primary);
  color: white;
}

.content-area {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  gap: 24px;
}

.generator-panel {
  display: grid;
  grid-template-columns: 450px 1fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .generator-panel {
    grid-template-columns: 1fr;
  }
}

.input-section {
  background: var(--bg-elevated);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  height: fit-content;
}

.input-section h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--text-primary);
}

.section-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0 0 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.form-group .required {
  color: var(--color-danger);
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px 14px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-warning);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 60px;
}

.platform-selection {
  margin-bottom: 20px;
}

.platform-selection > label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  display: block;
  margin-bottom: 12px;
}

.platform-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.platform-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
}

.platform-item:hover {
  border-color: var(--color-warning);
}

.platform-item.selected {
  background: rgba(245, 158, 11, 0.1);
  border-color: var(--color-warning);
}

.platform-icon {
  font-size: 20px;
}

.platform-name {
  color: var(--text-secondary);
}

.platform-item.selected .platform-name {
  color: var(--color-warning);
}

.generate-btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.generate-btn.primary {
  background: linear-gradient(135deg, var(--color-warning) 0%, var(--color-warning) 100%);
  color: white;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

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

.result-section {
  background: var(--bg-elevated);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.result-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.result-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  background: var(--bg-elevated);
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-primary);
}

.action-btn:hover {
  border-color: var(--color-warning);
  color: var(--color-warning);
}

.action-btn.primary {
  background: var(--color-warning);
  border-color: var(--color-warning);
  color: white;
}

.strategy-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.overview-card,
.objectives-card,
.kpis-card {
  padding: 16px;
  background: var(--bg-primary);
  border-radius: 12px;
}

.overview-card h4,
.objectives-card h4,
.kpis-card h4 {
  margin: 0 0 12px;
  font-size: 14px;
  color: var(--text-primary);
}

.summary {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
}

.objectives-card ul {
  margin: 0;
  padding-left: 20px;
}

.objectives-card li {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.kpis-card table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.kpis-card th,
.kpis-card td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.kpis-card th {
  font-weight: 500;
  color: var(--text-secondary);
}

.kpis-card .target {
  color: var(--color-warning);
  font-weight: 600;
}

.strategy-section {
  margin-bottom: 24px;
}

.strategy-section h4 {
  margin: 0 0 16px;
  font-size: 16px;
  color: var(--text-primary);
  padding-bottom: 8px;
  border-bottom: 2px solid var(--color-warning);
  display: inline-block;
}

.content-themes {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.theme-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg-primary);
  border-radius: 8px;
}

.theme-name {
  font-weight: 600;
  color: var(--text-primary);
  min-width: 100px;
}

.theme-desc {
  flex: 1;
  font-size: 13px;
  color: var(--text-secondary);
}

.priority-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.priority-badge.high {
  background: rgba(245, 158, 11, 0.15);
  color: var(--color-warning);
}

.priority-badge.medium {
  background: rgba(22, 93, 255, 0.15);
  color: var(--color-info);
}

.priority-badge.low {
  background: var(--border-color);
  color: var(--text-tertiary);
}

.keywords-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.keywords-group h5 {
  margin: 0 0 12px;
  font-size: 14px;
  color: var(--text-primary);
}

.keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(245, 158, 11, 0.15);
  border-radius: 20px;
  font-size: 13px;
  color: var(--text-primary);
}

.keyword-tag.secondary {
  background: rgba(22, 93, 255, 0.15);
}

.difficulty,
.opportunity {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(0,0,0,0.1);
}

.platform-plans {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.platform-plan {
  padding: 16px;
  background: var(--bg-primary);
  border-radius: 12px;
}

.platform-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.platform-plan .platform-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
}

.budget-tag {
  background: rgba(245, 158, 11, 0.15);
  color: var(--color-warning);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.plan-details p {
  margin: 6px 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.plan-details strong {
  color: var(--text-primary);
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.timeline-phase {
  padding: 16px;
  background: var(--bg-primary);
  border-radius: 12px;
  border-left: 4px solid var(--color-warning);
}

.phase-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.phase-name {
  font-weight: 600;
  color: var(--text-primary);
}

.phase-duration {
  font-size: 12px;
  color: var(--text-secondary);
}

.phase-tasks {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.task-item {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.task-name {
  color: var(--text-primary);
}

.task-deliverable {
  color: var(--text-secondary);
}

.phase-milestones {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.milestone {
  font-size: 12px;
  color: var(--color-warning);
  background: rgba(245, 158, 11, 0.15);
  padding: 4px 8px;
  border-radius: 4px;
}

.recommendations {
  margin: 0;
  padding-left: 20px;
}

.recommendations li {
  margin-bottom: 10px;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.risks {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.risk-item {
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
}

.risk-name {
  font-weight: 500;
  color: var(--color-danger);
}

.risk-probability {
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.risk-probability.high {
  background: rgba(239, 68, 68, 0.15);
  color: var(--color-danger);
}

.risk-probability.medium {
  background: rgba(245, 158, 11, 0.15);
  color: var(--color-warning);
}

.risk-probability.low {
  background: rgba(22, 93, 255, 0.15);
  color: var(--color-info);
}

.risk-mitigation {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.resources-table {
  width: 100%;
  border-collapse: collapse;
}

.resources-table th,
.resources-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.resources-table th {
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 13px;
}

.resources-table td {
  font-size: 14px;
}

.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background: var(--text-tertiary);
  color: white;
  border-radius: 8px;
  font-size: 14px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast.success {
  background: var(--color-success);
}

.toast.error {
  background: var(--color-danger);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

@media (max-width: 768px) {
  .strategy-page {
    padding-bottom: 24px;
  }

  .page-header {
    padding: 12px 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .page-title {
    font-size: 1.125rem;
  }

  .content-area {
    padding: 16px;
  }

  .tab-navigation {
    margin-left: 0;
    margin-right: 0;
    padding-left: 16px;
    padding-right: 16px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .platform-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .strategy-overview {
    grid-template-columns: 1fr;
  }

  .keywords-section {
    grid-template-columns: 1fr;
  }
}
</style>
