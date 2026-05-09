<template>
  <div class="strategy-page">
    <!-- 统一页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">模豆 MiraMod · GEO智能策略生成</h1>
          <span class="page-subtitle">内置6类语义实体库，AI替你写好文章、代码、关键词库，各引擎风格一键适配，拿到就能发</span>
        </div>
        <div class="header-actions">
          <button class="primary-btn" @click="showGenerateDialog = true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            生成策略
          </button>
        </div>
      </div>
    </div>

    <!-- 策略列表 -->
    <div class="content-wrapper">
      <div class="strategy-list" v-if="!loading && strategies.length > 0">
        <div 
          v-for="strategy in strategies" 
          :key="strategy.id" 
          class="strategy-card"
        >
          <div class="card-header">
            <span class="strategy-title">{{ strategy.title }}</span>
            <span class="type-tag" :class="'type-' + strategy.type">{{ getTypeLabel(strategy.type) }}</span>
          </div>
          
          <div class="strategy-content">
            <p class="strategy-description">{{ strategy.description }}</p>
            
            <div class="strategy-meta">
              <span class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ formatDate(strategy.createdAt) }}
              </span>
              <span class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                {{ strategy.creatorName }}
              </span>
            </div>
          </div>
          
          <div class="card-footer">
            <div class="card-actions">
              <button class="secondary-btn btn-sm" @click="viewStrategy(strategy)">查看</button>
              <button class="primary-btn btn-sm" @click="applyStrategy(strategy)">应用</button>
              <button class="icon-btn" @click="handleCommand('edit', strategy)" title="编辑">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="icon-btn danger" @click="handleCommand('delete', strategy)" title="删除">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!loading" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="11" x2="12" y2="17"/>
          <line x1="9" y1="14" x2="15" y2="14"/>
        </svg>
        <p>暂无策略</p>
        <button class="primary-btn" @click="showGenerateDialog = true">生成策略</button>
      </div>

      <!-- 加载状态 -->
      <div v-else class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-wrapper" v-if="total > 0">
      <div class="pagination-info">共 {{ total }} 条</div>
      <div class="pagination-btns">
        <button class="page-btn" :disabled="currentPage <= 1" @click="currentPage--; fetchStrategies()">上一页</button>
        <span class="page-current">{{ currentPage }} / {{ Math.ceil(total / pageSize) }}</span>
        <button class="page-btn" :disabled="currentPage >= Math.ceil(total / pageSize)" @click="currentPage++; fetchStrategies()">下一页</button>
      </div>
    </div>

    <!-- 生成策略对话框 -->
    <div v-if="showGenerateDialog" class="modal-overlay" @click.self="showGenerateDialog = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>生成策略</h3>
          <button class="close-btn" @click="showGenerateDialog = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>策略类型 <span class="required">*</span></label>
            <div class="type-grid">
              <button 
                v-for="type in strategyTypes" 
                :key="type.value"
                :class="['type-option', { active: generateForm.type === type.value }]"
                @click="generateForm.type = type.value"
              >
                <span class="type-icon">{{ type.icon }}</span>
                <span class="type-name">{{ type.label }}</span>
              </button>
            </div>
          </div>
          <div class="form-group">
            <label>产品名称 <span class="required">*</span></label>
            <input v-model="generateForm.product" type="text" placeholder="请输入产品名称" />
          </div>
          <div class="form-group">
            <label>关键词</label>
            <input v-model="generateForm.keywordsStr" type="text" placeholder="用逗号分隔，如：品质,服务,价格" />
          </div>
          <div class="form-group">
            <label>语气风格</label>
            <div class="tone-options">
              <button 
                v-for="tone in toneOptions" 
                :key="tone.value"
                :class="['tone-btn', { active: generateForm.tone === tone.value }]"
                @click="generateForm.tone = tone.value"
              >
                {{ tone.label }}
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="showGenerateDialog = false">取消</button>
          <button class="primary-btn" :disabled="!generateForm.product" @click="handleGenerate">
            {{ generating ? '生成中...' : '生成策略' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 策略详情对话框 -->
    <div v-if="showDetailDialog" class="modal-overlay" @click.self="showDetailDialog = false">
      <div class="modal-content modal-lg">
        <div class="modal-header">
          <h3>策略详情</h3>
          <button class="close-btn" @click="showDetailDialog = false">×</button>
        </div>
        <div class="modal-body">
          <div v-if="currentStrategy" class="strategy-detail">
            <h4>{{ currentStrategy.title }}</h4>
            <div class="detail-content">{{ currentStrategy.content }}</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="showDetailDialog = false">关闭</button>
          <button class="primary-btn" @click="copyStrategyContent">复制内容</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'

// 响应式数据
const loading = ref(false)
const generating = ref(false)
const strategies = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框状态
const showGenerateDialog = ref(false)
const showDetailDialog = ref(false)
const currentStrategy = ref<any>(null)

// 生成表单
const generateForm = reactive({
  type: 'faq',
  product: '',
  keywordsStr: '',
  tone: 'professional'
})

// 策略类型选项
const strategyTypes = [
  { value: 'faq', label: 'FAQ策略', icon: '❓' },
  { value: 'product_copy', label: '产品文案', icon: '📝' },
  { value: 'competitor', label: '竞品对比', icon: '⚔️' },
  { value: 'news', label: '新闻动态', icon: '📰' }
]

// 语气选项
const toneOptions = [
  { value: 'professional', label: '专业' },
  { value: 'friendly', label: '友好' },
  { value: 'humorous', label: '幽默' },
  { value: 'authoritative', label: '权威' }
]

// 获取策略列表
const fetchStrategies = async () => {
  loading.value = true
  try {
    // Mock数据
    strategies.value = [
      { id: 1, title: '智能客服FAQ优化策略', description: '针对智能客服产品特点，生成高频问题解答，提升用户自助服务能力', type: 'faq', createdAt: '2026-05-08', creatorName: 'AI助手' },
      { id: 2, title: '企业级产品文案包', description: '面向企业用户的专业产品介绍，突出安全性和稳定性优势', type: 'product_copy', createdAt: '2026-05-07', creatorName: 'AI助手' },
      { id: 3, title: '竞品对比分析报告', description: '与行业主流竞品的功能、价格、服务多维度对比', type: 'competitor', createdAt: '2026-05-06', creatorName: 'AI助手' }
    ]
    total.value = 3
  } catch (error: any) {
    console.error('获取策略列表失败', error)
  } finally {
    loading.value = false
  }
}

// 生成策略
const handleGenerate = async () => {
  if (!generateForm.product) return
  
  generating.value = true
  try {
    // 模拟生成
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const newStrategy = {
      id: Date.now(),
      title: `${generateForm.product} - ${strategyTypes.find(t => t.value === generateForm.type)?.label || '策略'}`,
      description: '新生成的策略内容，请查看详情',
      type: generateForm.type,
      createdAt: new Date().toISOString().split('T')[0],
      creatorName: 'AI助手'
    }
    strategies.value.unshift(newStrategy)
    total.value++
    
    showGenerateDialog.value = false
    generateForm.product = ''
    generateForm.keywordsStr = ''
  } catch (error: any) {
    console.error('策略生成失败', error)
  } finally {
    generating.value = false
  }
}

// 查看策略
const viewStrategy = (strategy: any) => {
  currentStrategy.value = {
    ...strategy,
    content: '这是策略的详细内容。\n\n1. 第一步：了解产品特点\n2. 第二步：分析目标用户\n3. 第三步：制定内容策略'
  }
  showDetailDialog.value = true
}

// 应用策略
const applyStrategy = async (strategy: any) => {
  console.log('应用策略:', strategy)
  alert('策略应用成功！')
}

// 复制策略内容
const copyStrategyContent = async () => {
  if (!currentStrategy.value) return
  try {
    await navigator.clipboard.writeText(currentStrategy.value.content)
    alert('内容已复制到剪贴板')
  } catch {
    alert('复制失败')
  }
}

// 操作命令处理
const handleCommand = async (command: string, strategy: any) => {
  switch (command) {
    case 'edit':
      alert('编辑功能开发中')
      break
    case 'delete':
      if (confirm('确定要删除该策略吗?')) {
        strategies.value = strategies.value.filter(s => s.id !== strategy.id)
        total.value--
      }
      break
  }
}

// 工具函数
const getTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    faq: 'FAQ策略',
    product_copy: '产品文案',
    competitor: '竞品对比',
    news: '新闻动态'
  }
  return labelMap[type] || type
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

// 生命周期
onMounted(() => {
  fetchStrategies()
})
</script>

<style scoped>
.strategy-page {
  min-height: 100vh;
  padding-bottom: 40px;
  background: var(--bg-primary);
}

/* 统一页面头部 */
.page-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  padding: 20px 24px;
}

.header-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
}

.header-left { flex: 1; }
.header-actions { display: flex; gap: 12px; }

.page-title { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin: 0; }
.page-subtitle { font-size: 0.875rem; color: var(--text-secondary); margin-top: 4px; line-height: 1.5; }

/* 统一按钮样式 */
.primary-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 18px; background: var(--color-primary); color: white;
  border: none; border-radius: 10px; font-size: 0.875rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s ease;
}
.primary-btn:hover { background: var(--color-primary-hover); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(22, 93, 255, 0.3); }
.primary-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.secondary-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 18px; background: var(--bg-elevated); color: var(--text-primary);
  border: 1px solid var(--border-color); border-radius: 10px; font-size: 0.875rem;
  font-weight: 600; cursor: pointer; transition: all 0.2s ease;
}
.secondary-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }

.btn-sm { padding: 6px 12px; font-size: 0.8125rem; }

.icon-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px;
  padding: 0; background: transparent; color: var(--text-secondary);
  border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer;
  transition: all 0.2s ease;
}
.icon-btn:hover { background: var(--bg-elevated); color: var(--text-primary); }
.icon-btn.danger:hover { background: rgba(239, 68, 68, 0.1); color: var(--color-danger); border-color: var(--color-danger); }

/* 内容区域 */
.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

/* 策略列表 */
.strategy-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
}

.strategy-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.2s ease;
}
.strategy-card:hover { border-color: var(--color-primary); transform: translateY(-2px); }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.strategy-title {
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-primary);
}

.type-tag {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 20px;
  background: rgba(99, 102, 241, 0.15);
  color: var(--color-primary);
}
.type-tag.type-product_copy { background: rgba(16, 185, 129, 0.15); color: var(--color-success); }
.type-tag.type-competitor { background: rgba(245, 158, 11, 0.15); color: var(--color-warning); }
.type-tag.type-news { background: rgba(139, 92, 246, 0.15); color: var(--color-secondary); }

.strategy-content { margin-bottom: 16px; }

.strategy-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.strategy-meta {
  display: flex;
  gap: 16px;
  font-size: 0.75rem;
  color: var(--text-tertiary);
}
.strategy-meta .meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-footer { padding-top: 16px; border-top: 1px solid var(--border-color); }
.card-actions { display: flex; gap: 8px; align-items: center; }

/* 分页 */
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 24px auto 0;
  padding: 0 24px;
}
.pagination-info { font-size: 0.875rem; color: var(--text-secondary); }
.pagination-btns { display: flex; gap: 12px; align-items: center; }
.page-btn {
  padding: 8px 16px; background: var(--bg-elevated); color: var(--text-primary);
  border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.875rem;
  cursor: pointer; transition: all 0.2s ease;
}
.page-btn:hover:not(:disabled) { border-color: var(--color-primary); color: var(--color-primary); }
.page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.page-current { font-size: 0.875rem; color: var(--text-secondary); }

/* 空状态 */
.empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 80px 24px; gap: 16px; color: var(--text-tertiary);
}
.empty-state p { font-size: 1rem; color: var(--text-secondary); }

/* 加载状态 */
.loading-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 80px 24px; gap: 16px;
}
.loading-spinner {
  width: 40px; height: 40px; border: 3px solid var(--border-color);
  border-top-color: var(--color-primary); border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
  backdrop-filter: blur(4px);
}
.modal-content {
  background: var(--bg-elevated); border-radius: 20px;
  width: 560px; max-width: 90vw; border: 1px solid var(--border-color);
}
.modal-lg { width: 720px; }
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 24px; border-bottom: 1px solid var(--border-color);
}
.modal-header h3 { font-size: 1rem; font-weight: 700; margin: 0; }
.close-btn {
  width: 32px; height: 32px; border: none; background: transparent;
  border-radius: 50%; font-size: 1.5rem; color: var(--text-secondary); cursor: pointer;
}
.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
.modal-footer {
  padding: 16px 24px; border-top: 1px solid var(--border-color);
  display: flex; justify-content: flex-end; gap: 12px;
}

/* 表单 */
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); }
.form-group .required { color: var(--color-danger); }
.form-group input, .form-group textarea, .form-group select {
  padding: 10px 14px; background: var(--bg-primary); border: 1px solid var(--border-color);
  border-radius: 10px; font-size: 0.875rem; color: var(--text-primary); outline: none;
  transition: border-color 0.2s;
}
.form-group input:focus, .form-group textarea:focus, .form-group select:focus { border-color: var(--color-primary); }
.form-group textarea { resize: vertical; }

.type-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.type-option {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 16px 12px; background: var(--bg-primary); border: 1px solid var(--border-color);
  border-radius: 12px; cursor: pointer; transition: all 0.2s ease;
}
.type-option:hover { border-color: var(--color-primary); }
.type-option.active { border-color: var(--color-primary); background: rgba(22, 93, 255, 0.1); }
.type-icon { font-size: 1.5rem; }
.type-name { font-size: 0.8125rem; color: var(--text-primary); }

.tone-options { display: flex; gap: 8px; flex-wrap: wrap; }
.tone-btn {
  padding: 8px 16px; background: var(--bg-primary); border: 1px solid var(--border-color);
  border-radius: 20px; font-size: 0.8125rem; color: var(--text-secondary); cursor: pointer;
  transition: all 0.2s ease;
}
.tone-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }
.tone-btn.active { background: var(--color-primary); border-color: var(--color-primary); color: white; }

/* 策略详情 */
.strategy-detail h4 { font-size: 1.125rem; margin: 0 0 16px; }
.detail-content { line-height: 1.8; color: var(--text-secondary); white-space: pre-wrap; }
</style>
