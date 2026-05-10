<template>
  <div class="one-click-deploy">
    <!-- 一键发布按钮区域 -->
    <div class="deploy-action-bar">
      <div class="deploy-main">
        <button 
          class="deploy-btn primary" 
          :disabled="isDeploying || platforms.length === 0"
          @click="showDeployModal = true"
        >
          <span class="deploy-icon">🚀</span>
          <span>一键发布</span>
        </button>
        
        <div class="platform-chips" v-if="platforms.length > 0">
          <span 
            v-for="p in platforms.filter(p => p.enabled)" 
            :key="p.id"
            class="platform-chip"
            :style="{ '--chip-color': PLATFORM_TEMPLATES[p.type]?.color }"
          >
            {{ PLATFORM_TEMPLATES[p.type]?.icon }}
            {{ PLATFORM_TEMPLATES[p.type]?.name || p.name }}
          </span>
        </div>
      </div>
      
      <div class="deploy-stats" v-if="lastTask">
        <div class="stat-item">
          <span class="stat-label">上次发布</span>
          <span class="stat-value">{{ formatTime(lastTask.createdAt) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">状态</span>
          <span class="stat-value" :class="'status-' + lastTask.status">
            {{ TASK_STATUS_LABELS[lastTask.status] }}
          </span>
        </div>
      </div>
    </div>

    <!-- 发布进度弹窗 -->
    <div class="modal-overlay" v-if="isDeploying" @click.self="isDeploying = false">
      <div class="deploy-progress-modal">
        <div class="modal-header">
          <h3>正在发布到 {{ currentDeployName }}</h3>
          <button class="close-btn" @click="isDeploying = false">&times;</button>
        </div>
        
        <div class="progress-content">
          <div class="progress-circle" :class="progressClass">
            <span class="progress-percent">{{ deployProgress }}%</span>
          </div>
          
          <div class="progress-steps">
            <div 
              v-for="(step, idx) in deploySteps" 
              :key="idx"
              class="step-item"
              :class="{ active: step.active, completed: step.completed, error: step.error }"
            >
              <span class="step-icon">
                <template v-if="step.completed">✓</template>
                <template v-else-if="step.error">✗</template>
                <template v-else-if="step.active">
                  <span class="spinner"></span>
                </template>
                <template v-else>{{ idx + 1 }}</template>
              </span>
              <span class="step-text">{{ step.label }}</span>
            </div>
          </div>
          
          <div class="progress-logs" v-if="deployLogs.length > 0">
            <div v-for="(log, idx) in deployLogs" :key="idx" class="log-item" :class="log.type">
              <span class="log-time">{{ log.time }}</span>
              <span class="log-message">{{ log.message }}</span>
            </div>
          </div>
        </div>
        
        <div class="modal-footer" v-if="currentTask?.status === 'failed'">
          <button class="btn secondary" @click="retryDeploy">重试</button>
          <button class="btn primary" @click="isDeploying = false">关闭</button>
        </div>
        <div class="modal-footer" v-else-if="currentTask?.status === 'success'">
          <button class="btn primary" @click="viewResult">查看结果</button>
          <button class="btn secondary" @click="isDeploying = false">关闭</button>
        </div>
      </div>
    </div>

    <!-- 平台管理弹窗 -->
    <div class="modal-overlay" v-if="showPlatformModal" @click.self="showPlatformModal = false">
      <div class="platform-config-modal">
        <div class="modal-header">
          <h3>目标平台配置</h3>
          <button class="close-btn" @click="showPlatformModal = false">&times;</button>
        </div>
        
        <div class="platform-list">
          <div v-for="p in platforms" :key="p.id" class="platform-item">
            <div class="platform-info">
              <span class="platform-icon" :style="{ background: PLATFORM_TEMPLATES[p.type]?.color }">
                {{ PLATFORM_TEMPLATES[p.type]?.icon }}
              </span>
              <div class="platform-detail">
                <span class="platform-name">{{ PLATFORM_TEMPLATES[p.type]?.name || p.name }}</span>
                <span class="platform-status" :class="{ connected: p.connected }">
                  {{ p.connected ? '已连接' : '未配置' }}
                </span>
              </div>
            </div>
            <div class="platform-actions">
              <button class="action-btn" @click="testConnection(p)">测试</button>
              <button class="action-btn" @click="editPlatform(p)">编辑</button>
              <button class="action-btn danger" @click="deletePlatform(p.id)">删除</button>
            </div>
          </div>
          
          <button class="add-platform-btn" @click="addNewPlatform">
            <span>+</span> 添加新平台
          </button>
        </div>
      </div>
    </div>

    <!-- 发布历史抽屉 -->
    <div class="drawer-overlay" v-if="showHistoryDrawer" @click.self="showHistoryDrawer = false">
      <div class="history-drawer">
        <div class="drawer-header">
          <h3>发布历史</h3>
          <button class="close-btn" @click="showHistoryDrawer = false">&times;</button>
        </div>
        
        <div class="history-list">
          <div v-for="task in deployHistory" :key="task.id" class="history-item">
            <div class="history-info">
              <span class="history-platform">{{ task.platformName }}</span>
              <span class="history-time">{{ formatTime(task.createdAt) }}</span>
            </div>
            <div class="history-status" :class="'status-' + task.status">
              {{ TASK_STATUS_LABELS[task.status] }}
            </div>
            <div class="history-actions">
              <button v-if="task.status === 'success'" @click="viewResult">查看</button>
              <button v-if="task.status === 'success'" @click="rollbackTask(task.id)">回滚</button>
            </div>
          </div>
          
          <div v-if="deployHistory.length === 0" class="empty-state">
            暂无发布记录
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { deployApi, PLATFORM_TYPES, PLATFORM_TEMPLATES, TASK_STATUS } from '@/api/deploy'

const props = defineProps({
  projectPath: { type: String, default: '' },
  buildCommand: { type: String, default: 'npm run build' },
  outputDir: { type: String, default: 'dist' }
})

const emit = defineEmits(['success', 'error', 'progress'])

// 状态
const platforms = ref([])
const showDeployModal = ref(false)
const showPlatformModal = ref(false)
const showHistoryDrawer = ref(false)
const isDeploying = ref(false)
const deployProgress = ref(0)
const currentDeployName = ref('')
const currentTask = ref(null)
const deployLogs = ref([])
const deploySteps = ref([])
const deployHistory = ref([])
const lastTask = ref(null)

// 轮询定时器
let pollTimer = null

// 常量
const TASK_STATUS_LABELS = {
  pending: '等待中',
  running: '发布中',
  success: '成功',
  failed: '失败',
  cancelled: '已取消',
  rollback: '回滚中'
}

// 计算属性
const progressClass = computed(() => {
  if (deployProgress.value === 100) return 'success'
  if (deployProgress.value > 0) return 'active'
  return ''
})

// 方法
const loadPlatforms = async () => {
  try {
    const res = await deployApi.getPlatforms()
    platforms.value = res.data || []
  } catch (err) {
    console.error('加载平台列表失败:', err)
  }
}

const loadHistory = async () => {
  try {
    const res = await deployApi.getHistory({ limit: 20 })
    deployHistory.value = res.data || []
    if (deployHistory.value.length > 0) {
      lastTask.value = deployHistory.value[0]
    }
  } catch (err) {
    console.error('加载发布历史失败:', err)
  }
}

const startDeploy = async (platformId) => {
  isDeploying.value = true
  deployProgress.value = 0
  deployLogs.value = []
  
  const platform = platforms.value.find(p => p.id === platformId)
  currentDeployName.value = PLATFORM_TEMPLATES[platform?.type]?.name || platform?.name || '目标平台'
  
  // 初始化步骤
  deploySteps.value = [
    { label: '准备构建环境', active: true, completed: false, error: false },
    { label: '执行构建命令', active: false, completed: false, error: false },
    { label: '上传文件到平台', active: false, completed: false, error: false },
    { label: '验证部署结果', active: false, completed: false, error: false },
    { label: '清理缓存', active: false, completed: false, error: false }
  ]
  
  addLog('info', `开始发布到 ${currentDeployName.value}...`)
  
  try {
    // 启动发布任务
    const res = await deployApi.deploy(platformId, {
      projectPath: props.projectPath,
      buildCommand: props.buildCommand,
      outputDir: props.outputDir
    })
    
    currentTask.value = res.data
    addLog('success', `任务已创建: ${currentTask.value.id}`)
    
    // 开始轮询状态
    startPolling(res.data.id)
    
  } catch (err) {
    addLog('error', `发布启动失败: ${err.message}`)
    completeStep(0, false)
    completeStep(1, false)
    emit('error', err)
  }
}

const startPolling = (taskId) => {
  pollTimer = setInterval(async () => {
    try {
      const res = await deployApi.getTaskStatus(taskId)
      currentTask.value = res.data
      
      // 更新进度
      updateProgress(res.data.progress || 0)
      
      // 添加日志
      if (res.data.logs?.length > deployLogs.value.length) {
        const newLogs = res.data.logs.slice(deployLogs.value.length)
        newLogs.forEach(log => addLog(log.type || 'info', log.message))
      }
      
      // 更新步骤状态
      updateSteps(res.data.progress || 0)
      
      // 检查是否完成
      if (res.data.status === 'success') {
        clearInterval(pollTimer)
        deployProgress.value = 100
        completeAllSteps()
        addLog('success', '发布完成！')
        emit('success', res.data)
      } else if (res.data.status === 'failed') {
        clearInterval(pollTimer)
        addLog('error', res.data.error || '发布失败')
        emit('error', res.data)
      }
      
    } catch (err) {
      console.error('轮询状态失败:', err)
    }
  }, 2000)
}

const updateProgress = (progress) => {
  deployProgress.value = Math.min(100, Math.max(0, progress))
  emit('progress', deployProgress.value)
}

const updateSteps = (progress) => {
  const stepCount = deploySteps.value.length
  const completedCount = Math.floor((progress / 100) * stepCount)
  
  deploySteps.value.forEach((step, idx) => {
    if (idx < completedCount) {
      step.completed = true
      step.active = false
    } else if (idx === completedCount) {
      step.active = true
      step.completed = false
    } else {
      step.active = false
      step.completed = false
    }
  })
}

const completeStep = (idx, success = true) => {
  if (deploySteps.value[idx]) {
    deploySteps.value[idx].completed = success
    deploySteps.value[idx].active = false
    deploySteps.value[idx].error = !success
  }
}

const completeAllSteps = () => {
  deploySteps.value.forEach(step => {
    step.completed = true
    step.active = false
  })
}

const addLog = (type, message) => {
  const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  deployLogs.value.push({ type, message, time })
}

const retryDeploy = async () => {
  if (currentTask.value) {
    await startDeploy(currentTask.value.platformId)
  }
}

const viewResult = () => {
  if (currentTask.value?.url) {
    window.open(currentTask.value.url, '_blank')
  }
  isDeploying.value = false
}

const rollbackTask = async (taskId) => {
  try {
    await deployApi.rollback(taskId)
    addLog('info', '回滚请求已提交')
    loadHistory()
  } catch (err) {
    addLog('error', `回滚失败: ${err.message}`)
  }
}

const addNewPlatform = () => {
  // TODO: 打开添加平台弹窗
  console.log('添加新平台')
}

const editPlatform = (platform) => {
  // TODO: 打开编辑平台弹窗
  console.log('编辑平台', platform)
}

const deletePlatform = async (id) => {
  if (confirm('确定要删除这个平台配置吗？')) {
    try {
      await deployApi.deletePlatform(id)
      await loadPlatforms()
    } catch (err) {
      alert('删除失败: ' + err.message)
    }
  }
}

const testConnection = async (platform) => {
  try {
    const res = await deployApi.testConnection(platform.id)
    if (res.success) {
      alert('连接测试成功！')
    } else {
      alert('连接测试失败: ' + res.message)
    }
  } catch (err) {
    alert('连接测试失败: ' + err.message)
  }
}

const formatTime = (time) => {
  if (!time) return '-'
  const date = new Date(time)
  return date.toLocaleString('zh-CN', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

// 暴露方法
defineExpose({
  startDeploy,
  loadPlatforms,
  loadHistory,
  showPlatformModal
})

// 生命周期
onMounted(() => {
  loadPlatforms()
  loadHistory()
})

onUnmounted(() => {
  if (pollTimer) {
    clearInterval(pollTimer)
  }
})
</script>

<style scoped>
.one-click-deploy {
  --primary: #4f46e5;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #dc2626;
  --bg: #f8fafc;
  --card: #ffffff;
  --border: #e2e8f0;
  --text: #1e293b;
  --text-secondary: #64748b;
}

.deploy-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--card);
  border-radius: 12px;
  border: 1px solid var(--border);
}

.deploy-main {
  display: flex;
  align-items: center;
  gap: 16px;
}

.deploy-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.deploy-btn.primary {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.deploy-btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
}

.deploy-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.deploy-icon { font-size: 1.125rem; }

.platform-chips {
  display: flex;
  gap: 8px;
}

.platform-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background: color-mix(in srgb, var(--chip-color) 15%, transparent);
  color: var(--chip-color);
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.deploy-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 0.6875rem;
  color: var(--text-secondary);
}

.stat-value {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text);
}

.stat-value.status-success { color: var(--success); }
.stat-value.status-failed { color: var(--danger); }
.stat-value.status-running { color: var(--primary); }

/* Modal */
.modal-overlay, .drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.drawer-overlay { align-items: flex-end; justify-content: flex-start; }

.deploy-progress-modal, .platform-config-modal {
  background: var(--card);
  border-radius: 16px;
  width: 90%;
  max-width: 480px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.history-drawer {
  background: var(--card);
  border-radius: 16px 16px 0 0;
  width: 100%;
  max-height: 70vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header, .drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}

.modal-header h3, .drawer-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.close-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: var(--bg);
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.25rem;
  color: var(--text-secondary);
}

.progress-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.progress-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(var(--primary) var(--progress, 0%), var(--border) 0%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.progress-circle::before {
  content: '';
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: var(--card);
}

.progress-circle.success { background: conic-gradient(var(--success) 100%, var(--border) 0%); }

.progress-percent {
  position: absolute;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
}

.progress-steps {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--bg);
  transition: all 0.2s;
}

.step-item.active { background: color-mix(in srgb, var(--primary) 10%, var(--card)); }
.step-item.completed { background: color-mix(in srgb, var(--success) 10%, var(--card)); }
.step-item.error { background: color-mix(in srgb, var(--danger) 10%, var(--card)); }

.step-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.step-item.completed .step-icon { background: var(--success); color: white; }
.step-item.error .step-icon { background: var(--danger); color: white; }
.step-item.active .step-icon { background: var(--primary); color: white; }

.spinner {
  width: 12px;
  height: 12px;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.step-text {
  font-size: 0.875rem;
  color: var(--text);
}

.progress-logs {
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  background: #1e293b;
  border-radius: 8px;
  padding: 12px;
  font-family: monospace;
  font-size: 0.75rem;
}

.log-item {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
  color: #94a3b8;
}

.log-item.info .log-message { color: #e2e8f0; }
.log-item.success .log-message { color: #4ade80; }
.log-item.error .log-message { color: #f87171; }

.log-time { color: #64748b; }

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--border);
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.btn.primary { background: var(--primary); color: white; }
.btn.secondary { background: var(--bg); color: var(--text); border: 1px solid var(--border); }

/* Platform Config */
.platform-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.platform-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: var(--bg);
  border-radius: 10px;
}

.platform-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.platform-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
}

.platform-detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.platform-name { font-weight: 600; font-size: 0.875rem; }
.platform-status { font-size: 0.6875rem; color: var(--text-secondary); }
.platform-status.connected { color: var(--success); }

.platform-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 4px 10px;
  border: 1px solid var(--border);
  background: var(--card);
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
}

.action-btn.danger { color: var(--danger); border-color: var(--danger); }

.add-platform-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border: 2px dashed var(--border);
  border-radius: 10px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
}

.add-platform-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* History */
.history-list {
  padding: 16px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: var(--bg);
  border-radius: 10px;
  margin-bottom: 8px;
}

.history-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.history-platform { font-weight: 600; font-size: 0.875rem; }
.history-time { font-size: 0.6875rem; color: var(--text-secondary); }

.history-status {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.history-status.status-success { background: color-mix(in srgb, var(--success) 15%, transparent); color: var(--success); }
.history-status.status-failed { background: color-mix(in srgb, var(--danger) 15%, transparent); color: var(--danger); }
.history-status.status-running { background: color-mix(in srgb, var(--primary) 15%, transparent); color: var(--primary); }

.history-actions {
  display: flex;
  gap: 8px;
}

.history-actions button {
  padding: 4px 10px;
  border: 1px solid var(--border);
  background: var(--card);
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}
</style>
