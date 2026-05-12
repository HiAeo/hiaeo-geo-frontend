<template>
  <div class="workflow-progress">
    <h3>工作流进度</h3>
    
    <div class="modules">
      <div 
        v-for="(module, index) in modules" 
        :key="module.id"
        :class="['module', module.state, { active: module.id === activeModule }]"
      >
        <div class="module-connector" v-if="index > 0">
          <div :class="['connector-line', getLineClass(index)]"></div>
        </div>
        
        <div class="module-card" @click="handleModuleClick(module)">
          <div class="module-icon">{{ module.icon }}</div>
          <div class="module-info">
            <div class="module-name">{{ module.name }}</div>
            <div class="module-status">{{ getStatusText(module.state) }}</div>
          </div>
          <div class="module-state-icon">
            <span v-if="module.state === 'draft'" class="state-draft">○</span>
            <span v-else-if="module.state === 'ready'" class="state-ready">◐</span>
            <span v-else-if="module.state === 'processing'" class="state-processing spin">⟳</span>
            <span v-else-if="module.state === 'completed'" class="state-completed">✓</span>
            <span v-else-if="module.state === 'failed'" class="state-failed">✗</span>
          </div>
        </div>
        
        <!-- 快速操作按钮 -->
        <div v-if="module.state === 'ready' || module.state === 'failed'" class="module-actions">
          <button class="btn-action" @click.stop="executeModule(module.id)">
            {{ module.state === 'failed' ? '重试' : '开始' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 整体进度 -->
    <div class="overall-progress">
      <div class="progress-label">
        <span>完成度</span>
        <span class="progress-value">{{ overallProgress }}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: overallProgress + '%' }"></div>
      </div>
    </div>
    
    <!-- 下一步建议 -->
    <div v-if="nextAction" class="next-action">
      <span class="label">下一步</span>
      <span class="action">{{ nextAction }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { workflowApi } from '@/api/workflow.js'

const props = defineProps({
  brandId: {
    type: String,
    required: true
  },
  workflowState: {
    type: Object,
    default: () => ({
      knowledge: 'draft',
      diagnosis: 'draft',
      strategy: 'draft',
      execution: 'draft',
      monitor: 'draft',
    })
  },
  lastIds: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['moduleClick', 'moduleExecute', 'refresh'])

// 模块配置
const moduleConfig = {
  knowledge: { name: '品牌智库', icon: '📚', route: '/knowledge' },
  diagnosis: { name: '模镜诊断', icon: '🔍', route: '/diagnosis' },
  strategy: { name: '模豆策略', icon: '🎯', route: '/strategy' },
  execution: { name: '模法执行', icon: '⚡', route: '/content' },
  monitor: { name: '品牌监控', icon: '📊', route: '/monitor' },
}

// 计算模块列表
const modules = computed(() => {
  return Object.entries(moduleConfig).map(([id, config]) => ({
    id,
    ...config,
    state: props.workflowState[id] || 'draft',
    lastId: props.lastIds[`last${id.charAt(0).toUpperCase() + id.slice(1)}Id`],
  }))
})

// 当前活跃模块
const activeModule = computed(() => {
  const order = ['knowledge', 'diagnosis', 'strategy', 'execution', 'monitor']
  for (const id of order) {
    const state = props.workflowState[id]
    if (state === 'processing' || state === 'ready') {
      return id
    }
  }
  return null
})

// 整体进度
const overallProgress = computed(() => {
  const completedCount = modules.value.filter(m => m.state === 'completed').length
  return Math.round((completedCount / modules.value.length) * 100)
})

// 下一步动作
const nextAction = computed(() => {
  const config = {
    knowledge: '完善品牌信息，开启 GEO 之旅',
    diagnosis: '开始 AI 诊断，了解品牌现状',
    strategy: '生成 GEO 优化策略',
    execution: '执行策略，生成内容',
    monitor: '查看监控数据',
  }
  
  for (const mod of modules.value) {
    if (mod.state === 'ready' || mod.state === 'draft') {
      return config[mod.id]
    }
  }
  return null
})

// 获取状态文本
function getStatusText(state) {
  const texts = {
    draft: '未开始',
    ready: '就绪',
    processing: '进行中',
    completed: '已完成',
    failed: '失败',
  }
  return texts[state] || '未知'
}

// 获取连接线样式
function getLineClass(index) {
  const prevModule = modules.value[index - 1]
  const currModule = modules.value[index]
  
  if (prevModule?.state === 'completed' && currModule?.state === 'completed') {
    return 'completed'
  }
  if (prevModule?.state === 'completed') {
    return 'partial'
  }
  return ''
}

// 点击模块
function handleModuleClick(module) {
  emit('moduleClick', module)
}

// 执行模块
async function executeModule(moduleId) {
  try {
    const result = await workflowApi.updateModuleState(props.brandId, {
      module: moduleId,
      state: 'processing',
    })
    
    if (result.success) {
      emit('refresh')
    }
  } catch (error) {
    console.error('执行模块失败', error)
  }
  
  emit('moduleExecute', moduleId)
}
</script>

<style scoped>
.workflow-progress {
  padding: 16px;
  background: #fff;
  border-radius: 12px;
}

.workflow-progress h3 {
  margin: 0 0 20px;
  font-size: 16px;
  font-weight: 600;
}

.modules {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.module {
  position: relative;
}

.module-connector {
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 40px;
}

.connector-line {
  width: 2px;
  height: 100%;
  background: #e2e8f0;
}

.connector-line.completed {
  background: #10b981;
}

.connector-line.partial {
  background: linear-gradient(to bottom, #10b981 50%, #e2e8f0 50%);
}

.module-card {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.module-card:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.module.active .module-card {
  background: #fef3c7;
  border: 1px solid #fbbf24;
}

.module.completed .module-card {
  background: #d1fae5;
}

.module.failed .module-card {
  background: #fee2e2;
}

.module-icon {
  font-size: 24px;
  margin-right: 12px;
}

.module-info {
  flex: 1;
}

.module-name {
  font-weight: 500;
  color: #1e293b;
}

.module-status {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.module.completed .module-status {
  color: #059669;
}

.module.failed .module-status {
  color: #dc2626;
}

.module-state-icon {
  font-size: 18px;
  margin-left: 8px;
}

.state-draft { color: #94a3b8; }
.state-ready { color: #3b82f6; }
.state-processing { color: #f59e0b; }
.state-completed { color: #10b981; }
.state-failed { color: #ef4444; }

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.module-actions {
  display: flex;
  justify-content: flex-end;
  padding: 4px 12px 8px;
}

.btn-action {
  padding: 4px 12px;
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.btn-action:hover {
  background: #5a67d8;
}

.overall-progress {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.progress-value {
  font-weight: 600;
  color: #667eea;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s;
}

.next-action {
  margin-top: 16px;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 8px;
  font-size: 14px;
}

.next-action .label {
  color: #3b82f6;
  font-weight: 500;
  margin-right: 8px;
}

.next-action .action {
  color: #1e293b;
}
</style>
