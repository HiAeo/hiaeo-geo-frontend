<template>
  <div class="workflow-chainer">
    <!-- 一键串联按钮 -->
    <div class="chain-actions">
      <button
        class="chain-btn primary"
        @click="triggerChain('diagnosis')"
        :disabled="isChaining || workflowState.knowledge !== 'completed'"
      >
        <span class="btn-icon">🚀</span>
        <span class="btn-text">一键启动完整流程</span>
        <span class="btn-arrow">→</span>
      </button>

      <div class="chain-hint" v-if="workflowState.knowledge !== 'completed'">
        <span class="hint-icon">💡</span>
        <span>请先完成智库信息填充</span>
      </div>
    </div>

    <!-- 模块状态展示 -->
    <div class="module-states">
      <div
        v-for="module in modules"
        :key="module.id"
        class="module-state"
        :class="[getStateClass(module.id), { active: isModuleActive(module.id) }]"
      >
        <div class="module-icon">{{ module.icon }}</div>
        <div class="module-info">
          <div class="module-name">{{ module.name }}</div>
          <div class="module-status">{{ getStateText(module.id) }}</div>
        </div>
        <div class="module-state-badge" :class="workflowState[module.id]">
          {{ getStateLabel(workflowState[module.id]) }}
        </div>
      </div>
    </div>

    <!-- 串联进度弹窗 -->
    <Teleport to="body">
      <div v-if="showChainModal" class="chain-modal-overlay" @click.self="closeChainModal">
        <div class="chain-modal">
          <div class="modal-header">
            <h3>🚀 品牌 GEO 全流程</h3>
            <button class="close-btn" @click="closeChainModal">×</button>
          </div>

          <div class="modal-body">
            <div class="chain-progress">
              <div
                v-for="(step, index) in chainSteps"
                :key="step.id"
                class="progress-step"
                :class="[step.status, { current: step.status === 'running' }]"
              >
                <div class="step-indicator">
                  <span v-if="step.status === 'completed'" class="check">✓</span>
                  <span v-else-if="step.status === 'running'" class="spinner">⟳</span>
                  <span v-else class="number">{{ index + 1 }}</span>
                </div>
                <div class="step-content">
                  <div class="step-name">{{ step.name }}</div>
                  <div class="step-desc">{{ step.desc }}</div>
                  <div v-if="step.error" class="step-error">{{ step.error }}</div>
                </div>
              </div>
            </div>

            <div v-if="chainError" class="chain-error">
              <span class="error-icon">⚠️</span>
              <span>{{ chainError }}</span>
            </div>
          </div>

          <div class="modal-footer">
            <button
              v-if="allStepsCompleted"
              class="modal-btn success"
              @click="goToResult"
            >
              查看结果 →
            </button>
            <button
              v-else-if="chainError"
              class="modal-btn retry"
              @click="retryChain"
            >
              重试
            </button>
            <button
              v-else
              class="modal-btn secondary"
              @click="closeChainModal"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useWorkflowStore } from '../stores/workflow'
import { triggerWorkflowChain, updateWorkflowModule } from '../api/hub'

const props = defineProps({
  brandId: { type: String, required: true }
})

const workflowStore = useWorkflowStore()

// 模块定义
const modules = [
  { id: 'knowledge', name: '品牌智库', icon: '📚' },
  { id: 'diagnosis', name: '模镜诊断', icon: '🔍' },
  { id: 'strategy', name: '模豆策略', icon: '🎯' },
  { id: 'execution', name: '模法执行', icon: '⚡' },
  { id: 'monitor', name: '品牌监控', icon: '📊' }
]

// 工作流状态
const workflowState = ref(workflowStore.getState(props.brandId) || {
  knowledge: 'draft',
  diagnosis: 'draft',
  strategy: 'draft',
  execution: 'draft',
  monitor: 'draft'
})

// 监听 store 变化
watch(() => workflowStore.getState(props.brandId), (newState) => {
  if (newState) {
    workflowState.value = newState
  }
}, { deep: true })

// 串联相关状态
const isChaining = ref(false)
const showChainModal = ref(false)
const chainSteps = ref([])
const chainError = ref('')

// 串联步骤定义
const chainStepsDef = [
  { id: 'diagnosis', name: '模镜诊断', desc: 'AI 分析品牌现状' },
  { id: 'strategy', name: '模豆策略', desc: '生成个性化策略' },
  { id: 'execution', name: '模法执行', desc: '批量生成内容' }
]

// 计算属性
const allStepsCompleted = computed(() => {
  return chainSteps.value.length > 0 &&
    chainSteps.value.every(s => s.status === 'completed')
})

// 方法
const isModuleActive = (moduleId) => {
  const moduleOrder = ['knowledge', 'diagnosis', 'strategy', 'execution', 'monitor']
  const currentIndex = moduleOrder.indexOf(workflowState.value[moduleId])
  return currentIndex >= 2 // processing 或 completed
}

const getStateClass = (moduleId) => {
  const state = workflowState.value[moduleId]
  return {
    draft: 'state-draft',
    ready: 'state-ready',
    processing: 'state-processing',
    completed: 'state-completed',
    error: 'state-error'
  }[state] || 'state-draft'
}

const getStateText = (moduleId) => {
  const state = workflowState.value[moduleId]
  return {
    draft: '待填充',
    ready: '已就绪',
    processing: '处理中',
    completed: '已完成',
    error: '有错误'
  }[state] || '未知'
}

const getStateLabel = (state) => {
  return {
    draft: '草稿',
    ready: '就绪',
    processing: '进行中',
    completed: '完成',
    error: '错误'
  }[state] || state
}

const triggerChain = async (startFrom) => {
  isChaining.value = true
  showChainModal.value = true
  chainError.value = ''

  // 初始化步骤状态
  const startIndex = chainStepsDef.findIndex(s => s.id === startFrom)
  chainSteps.value = chainStepsDef.slice(startIndex).map(s => ({
    ...s,
    status: 'pending'
  }))

  try {
    // 调用后端触发串联
    const response = await triggerWorkflowChain(props.brandId, startFrom)

    if (response.success) {
      // 模拟串联进度
      for (let i = 0; i < chainSteps.value.length; i++) {
        chainSteps.value[i].status = 'running'
        await new Promise(resolve => setTimeout(resolve, 1500))

        try {
          // 更新模块状态为处理中
          await updateWorkflowModule(props.brandId, chainSteps.value[i].id, 'processing')

          // 模拟模块执行
          await new Promise(resolve => setTimeout(resolve, 1000))

          // 更新为完成
          await workflowStore.updateModuleState(props.brandId, chainSteps.value[i].id, 'completed')
          await updateWorkflowModule(props.brandId, chainSteps.value[i].id, 'completed')

          chainSteps.value[i].status = 'completed'
        } catch (stepError) {
          chainSteps.value[i].status = 'error'
          chainSteps.value[i].error = stepError.message || '执行失败'
          throw stepError
        }
      }

      // 全部完成后更新监控状态
      await workflowStore.updateModuleState(props.brandId, 'monitor', 'ready')
    } else {
      throw new Error(response.message || '串联执行失败')
    }
  } catch (error) {
    chainError.value = error.message || '执行过程中发生错误'
  } finally {
    isChaining.value = false
  }
}

const closeChainModal = () => {
  if (!isChaining.value) {
    showChainModal.value = false
  }
}

const retryChain = () => {
  const failedStep = chainSteps.value.find(s => s.status === 'error')
  if (failedStep) {
    triggerChain(failedStep.id)
  }
}

const goToResult = () => {
  showChainModal.value = false
  // 导航到监控页面
  window.location.href = '/hub'
}
</script>

<style scoped>
.workflow-chainer {
  padding: 16px;
  background: var(--bg-elevated);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

/* 一键串联按钮 */
.chain-actions {
  margin-bottom: 16px;
}

.chain-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 10px;
  border: none;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.chain-btn.primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
}

.chain-btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(22, 93, 255, 0.3);
}

.chain-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 1.25rem;
}

.btn-arrow {
  margin-left: auto;
  font-size: 1.25rem;
}

.chain-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.hint-icon {
  font-size: 0.875rem;
}

/* 模块状态展示 */
.module-states {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.module-state {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-primary);
  border-radius: 10px;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.module-state.active {
  border-color: var(--color-primary);
  background: rgba(22, 93, 255, 0.05);
}

.module-state.state-completed {
  border-color: var(--color-success);
  background: rgba(16, 185, 129, 0.05);
}

.module-state.state-processing {
  border-color: var(--color-warning);
  background: rgba(245, 158, 11, 0.05);
}

.module-state.state-error {
  border-color: var(--color-danger);
  background: rgba(239, 68, 68, 0.05);
}

.module-icon {
  font-size: 1.5rem;
  width: 36px;
  text-align: center;
}

.module-info {
  flex: 1;
}

.module-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.module-status {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.module-state-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.6875rem;
  font-weight: 600;
}

.module-state-badge.draft {
  background: rgba(107, 114, 128, 0.15);
  color: var(--text-secondary);
}

.module-state-badge.ready {
  background: rgba(22, 93, 255, 0.15);
  color: var(--color-primary);
}

.module-state-badge.processing {
  background: rgba(245, 158, 11, 0.15);
  color: var(--color-warning);
}

.module-state-badge.completed {
  background: rgba(16, 185, 129, 0.15);
  color: var(--color-success);
}

.module-state-badge.error {
  background: rgba(239, 68, 68, 0.15);
  color: var(--color-danger);
}

/* 串联进度弹窗 */
.chain-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.chain-modal {
  width: 90%;
  max-width: 480px;
  background: var(--bg-elevated);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: var(--bg-primary);
}

.modal-body {
  padding: 20px;
}

.chain-progress {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.progress-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: var(--bg-primary);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.progress-step.current {
  background: rgba(22, 93, 255, 0.1);
  border: 1px solid var(--color-primary);
}

.progress-step.completed {
  opacity: 0.8;
}

.step-indicator {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  flex-shrink: 0;
  background: var(--border-color);
  color: var(--text-secondary);
}

.progress-step.completed .step-indicator {
  background: var(--color-success);
  color: white;
}

.progress-step.current .step-indicator {
  background: var(--color-primary);
  color: white;
}

.step-indicator .spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.step-content {
  flex: 1;
}

.step-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.step-desc {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.step-error {
  font-size: 0.75rem;
  color: var(--color-danger);
  margin-top: 4px;
}

.chain-error {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  color: var(--color-danger);
  font-size: 0.875rem;
}

.error-icon {
  font-size: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
}

.modal-btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-btn.success {
  background: var(--color-success);
  color: white;
}

.modal-btn.retry {
  background: var(--color-warning);
  color: white;
}

.modal-btn.secondary {
  background: var(--bg-primary);
  color: var(--text-secondary);
}

.modal-btn:hover {
  transform: translateY(-1px);
}
</style>
