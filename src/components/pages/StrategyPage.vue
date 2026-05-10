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

          <div class="form-group">
            <label>GEO核心信源媒体 <span class="form-hint">（点击logo访问官网，勾选方块选择目标媒体）</span></label>
            <MediaSelector v-model="selectedMedia" />
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
              <button class="action-btn publish-btn" @click="goToPublish">
                🚀 立即发布内容
              </button>
              <button class="action-btn primary" @click="applyStrategy">
                💾 保存策略
              </button>
            </div>
          </div>

          <div class="strategy-overview">
            <div class="overview-card">
              <h4>📋 策略概览</h4>
              <p class="summary">{{ strategyResult?.content?.summary || '暂无数据' }}</p>
            </div>

            <div class="objectives-card">
              <h4>🎯 核心目标</h4>
              <ul>
                <li v-for="(obj, i) in (strategyResult?.content?.coreObjectives || [])" :key="i">{{ obj }}</li>
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
                  <tr v-for="kpi in (strategyResult?.content?.kpis || [])" :key="kpi?.name || $index">
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
              <div v-for="theme in (strategyResult?.content?.contentThemes || [])" :key="theme?.theme || $index" class="theme-item">
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
                  <span v-for="(kw, idx) in (strategyResult?.content?.coreKeywords || [])" :key="kw?.keyword || idx" class="keyword-tag">
                    {{ kw.keyword }}
                    <span class="difficulty" :class="kw.difficulty.toLowerCase()">{{ kw.difficulty }}</span>
                  </span>
                </div>
              </div>
              <div class="keywords-group">
                <h5>长尾关键词</h5>
                <div class="keyword-tags">
                  <span v-for="(kw, idx) in (strategyResult?.content?.longTailKeywords || [])" :key="kw?.keyword || idx" class="keyword-tag secondary">
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
              <div v-for="(plan, idx) in (strategyResult?.content?.platformPlan || [])" :key="plan?.platform || idx" class="platform-plan">
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
              <div v-for="(phase, idx) in (strategyResult?.content?.timeline || [])" :key="phase?.phase || idx" class="timeline-phase">
                <div class="phase-header">
                  <span class="phase-name">{{ phase.phase }}</span>
                  <span class="phase-duration">{{ phase.duration }} (第{{ phase.startWeek }}-{{ phase.endWeek }}周)</span>
                </div>
                <div class="phase-tasks">
                  <div v-for="(task, tIdx) in (phase?.tasks || [])" :key="task?.task || tIdx" class="task-item">
                    <span class="task-name">{{ task.task }}</span>
                    <span class="task-deliverable">{{ task.deliverable }}</span>
                  </div>
                </div>
                <div class="phase-milestones">
                  <span v-for="(m, mIdx) in (phase?.milestones || [])" :key="m || mIdx" class="milestone">🏁 {{ m }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="strategy-section">
            <h4>💡 执行建议</h4>
            <ul class="recommendations">
              <li v-for="(rec, rIdx) in (strategyResult?.content?.recommendations || [])" :key="rec || rIdx">{{ rec }}</li>
            </ul>
          </div>

          <div class="strategy-section">
            <h4>⚠️ 潜在风险</h4>
            <div class="risks">
              <div v-for="(risk, rIdx) in (strategyResult?.content?.risks || [])" :key="risk?.risk || rIdx" class="risk-item">
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
                <tr v-for="(res, rIdx) in (strategyResult?.content?.resourceRequirements || [])" :key="res?.type || rIdx">
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
import { ref, reactive, onUnmounted, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MediaSelector from '../MediaSelector.vue'
import { defaultSelectedMedia } from '../../config/mediaConfig'

const router = useRouter()

// AbortController for request cancellation
let abortController = null

const tabs = []

const activeTab = ref('strategy')
const generating = ref(false)
const strategyResult = ref(null)
const fromReport = ref(false) // 是否从诊断报告跳转而来

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
  { id: 'website', name: '官网', icon: '🌐', logoUrl: '/platforms-logos/website-color.svg' },
  { id: 'wechat', name: '微信公众号', icon: '💬', logoUrl: '/platforms-logos/wechat-color.svg' },
  { id: 'wechat_moments', name: '朋友圈', icon: '👥', logoUrl: '/platforms-logos/wechat-color.svg' },
  { id: 'weibo', name: '微博', icon: '📱', logoUrl: '/platforms-logos/weibo-color.svg' },
  { id: 'douyin', name: '抖音', icon: '🎬', logoUrl: '/platforms-logos/douyin-color.svg' },
  { id: 'xiaohongshu', name: '小红书', icon: '📕', logoUrl: '/platforms-logos/xiaohongshu-color.svg' },
  { id: 'bilibili', name: 'B站', icon: '📺', logoUrl: '/platforms-logos/bilibili-color.svg' },
  { id: 'baidu', name: '百度', icon: '🔍', logoUrl: '/platforms-logos/baidu-color.svg' },
  { id: 'taobao', name: '淘宝', icon: '🛒', logoUrl: '/platforms-logos/taobao-color.svg' },
  { id: 'tmall', name: '天猫', icon: '🏪', logoUrl: '/platforms-logos/tmall-color.svg' },
  { id: 'jd', name: '京东', icon: '📦', logoUrl: '/platforms-logos/jd-color.svg' },
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
})

// GEO核心信源媒体选择
const selectedMedia = ref([...defaultSelectedMedia])

const getPlatformName = (platformId) => {
  const platform = platforms.find(p => p.id === platformId)
  return platform ? platform.name : platformId
}

// 初始化：从诊断报告跳转时填充表单
const initFromReport = () => {
  const reportData = sessionStorage.getItem('strategy_from_report')
  if (reportData) {
    try {
      const data = JSON.parse(reportData)
      
      // 填充表单
      form.brandName = data.brandName || ''
      
      // 根据诊断分数建议策略类型
      if (data.score && data.score < 60) {
        form.strategyType = 'content' // 低分优先做内容策略
      } else if (data.score && data.score > 80) {
        form.strategyType = 'competitor' // 高分做竞品策略
      }
      
      // 从建议中提取优化方向作为挑战
      if (data.suggestions && data.suggestions.length > 0) {
        const challenges = data.suggestions
          .filter(s => s.priority === '高')
          .map(s => s.action)
          .slice(0, 2)
          .join('；')
        form.brandChallenges = challenges || ''
      }
      
      // 从维度中提取关键词
      if (data.keywords && data.keywords.length > 0) {
        form.keywords = data.keywords.join(', ')
      }
      
      fromReport.value = true
      
      // 清除sessionStorage
      sessionStorage.removeItem('strategy_from_report')
      
      // 显示提示
      showToast('已基于诊断报告填充策略信息', 'info')
    } catch (e) {
      console.error('解析报告数据失败:', e)
    }
  }
}

// 发布内容快捷入口
const goToPublish = () => {
  if (strategyResult.value) {
    // 将策略结果存储到sessionStorage
    sessionStorage.setItem('publish_from_strategy', JSON.stringify({
      strategyId: strategyResult.value.id,
      strategyName: strategyResult.value.name,
      content: strategyResult.value.content,
      brandName: form.brandName,
    }))
    router.push('/app/publish')
  }
}

// 页面加载时初始化
onMounted(() => {
  initFromReport()
})

const generateStrategy = async () => {
  if (!form.brandName) return
  
  // Cancel previous request if any
  if (abortController) {
    abortController.abort()
  }
  abortController = new AbortController()
  
  generating.value = true
  try {
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      showToast('请先登录', 'error')
      return
    }
    
    const payload = {
      ...form,
      keywords: form.keywords ? form.keywords.split(',').map(k => k.trim()) : [],
    }
    
    const response = await fetch('/api/strategy/mofa/generate', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
      signal: abortController.signal
    })
    
    if (response.status === 401) {
      showToast('登录已过期，请重新登录', 'error')
      localStorage.removeItem('auth_token')
      return
    }
    
    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`)
    }
    
    const data = await response.json()
    
    // 添加防御性检查
    if (data && data.content) {
      strategyResult.value = data
      showToast('策略生成成功！')
    } else {
      showToast('生成结果格式异常', 'error')
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request cancelled')
    } else {
      console.error('生成策略失败:', error)
      showToast('生成失败，请重试', 'error')
    }
  } finally {
    generating.value = false
    abortController = null
  }
}

// 组件卸载时取消请求
onUnmounted(() => {
  if (abortController) {
    abortController.abort()
  }
})

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
  display: flex;
  flex-direction: column;
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

.platform-logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
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
  background: var(--color-primary);
  color: white;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.4);
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

.action-btn.publish-btn {
  background: linear-gradient(135deg, var(--color-success) 0%, #059669 100%);
  border-color: var(--color-success);
  color: white;
}

.action-btn.publish-btn:hover {
  border-color: var(--color-success);
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
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
