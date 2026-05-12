/**
 * 工作流 WebSocket 组合式函数
 * 实时监听工作流状态变化
 */

import { ref, onMounted, onUnmounted, computed } from 'vue'
import { socketService, WS_EVENTS } from '@/plugins/socket.io.js'
import { workflowApi } from '@/api/workflow.js'

// 状态映射
const stateLabels = {
  draft: '未开始',
  ready: '就绪',
  processing: '进行中',
  completed: '已完成',
  failed: '失败',
}

// 模块配置
const moduleConfig = {
  knowledge: { name: '品牌智库', icon: '📚' },
  diagnosis: { name: '模镜诊断', icon: '🔍' },
  strategy: { name: '模豆策略', icon: '🎯' },
  execution: { name: '模法执行', icon: '⚡' },
  monitor: { name: '品牌监控', icon: '📊' },
}

export function useWorkflowSocket(brandId) {
  // 状态
  const workflowState = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const chainProgress = ref(null)
  const notifications = ref([])

  // 计算属性
  const modules = computed(() => {
    if (!workflowState.value) return []
    
    return Object.entries(moduleConfig).map(([id, config]) => ({
      id,
      ...config,
      state: workflowState.value[id] || 'draft',
      label: stateLabels[workflowState.value[id]] || '未知',
    }))
  })

  const overallProgress = computed(() => {
    if (!workflowState.value) return 0
    const completedCount = modules.value.filter(m => m.state === 'completed').length
    return Math.round((completedCount / modules.value.length) * 100)
  })

  const currentStage = computed(() => {
    if (!workflowState.value) return null
    
    const order = ['knowledge', 'diagnosis', 'strategy', 'execution', 'monitor']
    for (const id of order) {
      const state = workflowState.value[id]
      if (state === 'processing' || state === 'ready') {
        return { id, ...moduleConfig[id], state }
      }
    }
    
    // 检查是否全部完成
    if (modules.value.every(m => m.state === 'completed')) {
      return { id: 'completed', name: '全部完成', icon: '✅', state: 'completed' }
    }
    
    return null
  })

  // 方法
  async function fetchWorkflowState() {
    if (!brandId) return
    
    loading.value = true
    error.value = null
    
    try {
      const result = await workflowApi.getWorkflowState(brandId)
      if (result.success) {
        workflowState.value = result.data
      } else {
        error.value = result.message || '获取工作流状态失败'
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function updateModuleState(module, state) {
    try {
      const result = await workflowApi.updateModuleState(brandId, { module, state })
      if (result.success) {
        workflowState.value = result.data
        return true
      }
      return false
    } catch (err) {
      error.value = err.message
      return false
    }
  }

  // WebSocket 事件处理
  function handleWorkflowStateUpdate(data) {
    console.log('收到工作流状态更新:', data)
    if (data.module && data.state) {
      workflowState.value = {
        ...workflowState.value,
        [data.module]: data.state,
      }
    }
  }

  function handleWorkflowProgress(data) {
    console.log('收到工作流进度:', data)
    chainProgress.value = {
      ...data,
      percent: data.progress || 0,
    }
  }

  function handleChainProgress(data) {
    console.log('收到 Agent 链进度:', data)
    chainProgress.value = {
      stage: data.stage,
      progress: data.progress || 0,
      timestamp: data.timestamp,
      ...data.details,
    }
  }

  function handleChainComplete(data) {
    console.log('收到 Agent 链完成:', data)
    chainProgress.value = {
      ...data,
      completed: true,
      percent: 100,
    }
    // 刷新工作流状态
    fetchWorkflowState()
  }

  function handleDiagnosisProgress(data) {
    console.log('收到诊断进度:', data)
    chainProgress.value = {
      module: 'diagnosis',
      progress: data.progress || 0,
      taskId: data.taskId,
    }
  }

  function handleNotification(data) {
    console.log('收到通知:', data)
    notifications.value.unshift({
      ...data,
      id: Date.now(),
      read: false,
    })
    
    // 限制通知数量
    if (notifications.value.length > 20) {
      notifications.value.pop()
    }
  }

  function handleSystemAlert(data) {
    console.log('收到系统警告:', data)
    notifications.value.unshift({
      id: Date.now(),
      type: 'alert',
      level: data.level,
      message: data.message,
      timestamp: data.timestamp,
      read: false,
    })
  }

  // 订阅/取消订阅
  function subscribe() {
    if (!brandId) return
    // 订阅品牌频道
    socketService.subscribeBrand(brandId)
  }

  function unsubscribe() {
    if (!brandId) return
    socketService.unsubscribeBrand(brandId)
  }

  // 生命周期
  onMounted(async () => {
    // 连接 Socket
    if (!socketService.isConnected()) {
      socketService.connect()
    }
    
    // 等待连接后订阅
    socketService.on(WS_EVENTS.CONNECTED, () => {
      subscribe()
    })
    
    // 如果已连接，直接订阅
    if (socketService.isConnected()) {
      subscribe()
    }
    
    // 获取初始状态
    await fetchWorkflowState()
    
    // 绑定事件监听
    socketService.on(WS_EVENTS.WORKFLOW_STATE_UPDATE, handleWorkflowStateUpdate)
    socketService.on(WS_EVENTS.WORKFLOW_PROGRESS, handleWorkflowProgress)
    socketService.on(WS_EVENTS.AGENT_CHAIN_PROGRESS, handleChainProgress)
    socketService.on(WS_EVENTS.AGENT_CHAIN_COMPLETE, handleChainComplete)
    socketService.on(WS_EVENTS.DIAGNOSIS_PROGRESS, handleDiagnosisProgress)
    socketService.on(WS_EVENTS.NOTIFICATION_NEW, handleNotification)
    socketService.on(WS_EVENTS.SYSTEM_ALERT, handleSystemAlert)
  })

  onUnmounted(() => {
    unsubscribe()
    
    // 移除事件监听
    socketService.off(WS_EVENTS.WORKFLOW_STATE_UPDATE, handleWorkflowStateUpdate)
    socketService.off(WS_EVENTS.WORKFLOW_PROGRESS, handleWorkflowProgress)
    socketService.off(WS_EVENTS.AGENT_CHAIN_PROGRESS, handleChainProgress)
    socketService.off(WS_EVENTS.AGENT_CHAIN_COMPLETE, handleChainComplete)
    socketService.off(WS_EVENTS.DIAGNOSIS_PROGRESS, handleDiagnosisProgress)
    socketService.off(WS_EVENTS.NOTIFICATION_NEW, handleNotification)
    socketService.off(WS_EVENTS.SYSTEM_ALERT, handleSystemAlert)
  })

  return {
    // 状态
    workflowState,
    modules,
    overallProgress,
    currentStage,
    chainProgress,
    notifications,
    loading,
    error,
    
    // 方法
    fetchWorkflowState,
    updateModuleState,
    subscribe,
    unsubscribe,
  }
}

export default useWorkflowSocket
