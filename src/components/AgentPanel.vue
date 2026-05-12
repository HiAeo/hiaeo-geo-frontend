<template>
  <div class="agent-panel">
    <!-- Agent 头部 -->
    <div class="agent-header">
      <div class="agent-avatar">🤖</div>
      <div class="agent-info">
        <h3>GEO AI Agent</h3>
        <span :class="['status-badge', statusClass]">{{ statusText }}</span>
      </div>
      <button class="btn-icon" @click="$emit('close')" title="关闭">
        <span>×</span>
      </button>
    </div>

    <!-- 快捷操作 -->
    <div class="quick-actions">
      <button 
        v-for="action in quickActions" 
        :key="action.id"
        class="action-btn"
        :disabled="loading"
        @click="executeAction(action.id)"
      >
        <span class="action-icon">{{ action.icon }}</span>
        <span>{{ action.label }}</span>
      </button>
    </div>

    <!-- 消息列表 -->
    <div class="messages-container" ref="messagesContainer">
      <div 
        v-for="(msg, index) in messages" 
        :key="index"
        :class="['message', `message-${msg.role}`]"
      >
        <div class="message-avatar">
          {{ msg.role === 'user' ? '👤' : '🤖' }}
        </div>
        <div class="message-content">
          <div class="message-text" v-html="formatMessage(msg.content)"></div>
          <div class="message-time">{{ formatTime(msg.timestamp) }}</div>
        </div>
      </div>
      
      <!-- 加载指示器 -->
      <div v-if="loading" class="message message-assistant">
        <div class="message-avatar">🤖</div>
        <div class="message-content">
          <div class="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-area">
      <textarea 
        v-model="inputMessage"
        class="message-input"
        placeholder="输入消息或选择快捷操作..."
        rows="2"
        :disabled="loading"
        @keydown.enter.exact.prevent="sendMessage"
        @keydown.shift.enter="newline"
      ></textarea>
      <button 
        class="send-btn"
        :disabled="!inputMessage.trim() || loading"
        @click="sendMessage"
      >
        发送
      </button>
    </div>

    <!-- 一键串联进度弹窗 -->
    <div v-if="chainProgress.show" class="chain-progress-overlay">
      <div class="chain-progress-modal">
        <h3>🚀 一键串联执行中</h3>
        
        <div class="progress-stages">
          <div 
            v-for="(stage, index) in chainProgress.stages" 
            :key="stage.id"
            :class="['stage', stage.status]"
          >
            <div class="stage-indicator">
              <span v-if="stage.status === 'pending'">{{ index + 1 }}</span>
              <span v-else-if="stage.status === 'running'" class="spin">⟳</span>
              <span v-else-if="stage.status === 'completed'">✓</span>
              <span v-else>✗</span>
            </div>
            <div class="stage-info">
              <div class="stage-name">{{ stage.name }}</div>
              <div class="stage-detail">{{ stage.detail }}</div>
            </div>
          </div>
        </div>

        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: chainProgress.percent + '%' }"></div>
        </div>
        <div class="progress-text">{{ chainProgress.percent }}%</div>

        <button 
          v-if="chainProgress.percent === 100 || chainProgress.error"
          class="btn-primary"
          @click="closeChainProgress"
        >
          {{ chainProgress.error ? '关闭' : '查看结果' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { 
  createAgentSession,
  sendAgentMessage,
  executeAgentChain,
  getAgentHealth 
} from '@/api/agent.js'

// Props
const props = defineProps({
  brandId: {
    type: String,
    required: true
  }
})

// Emits
const emit = defineEmits(['close', 'chainComplete'])

// 状态
const sessionId = ref(null)
const messages = ref([])
const inputMessage = ref('')
const loading = ref(false)
const healthStatus = ref({ healthy: true })

// 快捷操作
const quickActions = [
  { id: 'diagnosis', label: '开始诊断', icon: '🔍' },
  { id: 'strategy', label: '生成策略', icon: '🎯' },
  { id: 'execution', label: '执行策略', icon: '⚡' },
  { id: 'chain', label: '一键串联', icon: '🚀' },
  { id: 'status', label: '查看状态', icon: '📊' },
]

// 一键串联进度
const chainProgress = ref({
  show: false,
  percent: 0,
  error: null,
  stages: [
    { id: 'diagnosis', name: '模镜诊断', detail: '分析品牌 GEO 状态', status: 'pending' },
    { id: 'strategy', name: '模豆策略', detail: '生成优化方案', status: 'pending' },
    { id: 'execution', name: '模法执行', detail: '生成内容并发布', status: 'pending' },
  ]
})

// 计算属性
const statusClass = computed(() => {
  if (!healthStatus.value.healthy) return 'error'
  if (loading.value) return 'running'
  return 'ready'
})

const statusText = computed(() => {
  if (!healthStatus.value.healthy) return '离线'
  if (loading.value) return '思考中...'
  return '就绪'
})

// 方法
async function initSession() {
  try {
    const result = await createAgentSession(props.brandId)
    if (result.success) {
      sessionId.value = result.id
      messages.value = result.messages || []
      messages.value.push({
        role: 'assistant',
        content: '您好！我是品牌 GEO AI Agent。\n\n我可以帮您：\n• 分析品牌 GEO 状态\n• 制定优化策略\n• 生成并执行内容计划\n• 一键串联全流程\n\n请问有什么可以帮助您的？',
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('初始化会话失败', error)
  }
}

async function checkHealth() {
  try {
    const result = await getAgentHealth()
    healthStatus.value = result
  } catch (error) {
    healthStatus.value = { healthy: false }
  }
}

async function sendMessage() {
  const text = inputMessage.value.trim()
  if (!text || loading.value || !sessionId.value) return

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: text,
    timestamp: new Date().toISOString()
  })
  
  inputMessage.value = ''
  loading.value = true
  scrollToBottom()

  try {
    const result = await sendAgentMessage(sessionId.value, text)
    if (result.reply) {
      messages.value.push({
        role: 'assistant',
        content: result.reply,
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    messages.value.push({
      role: 'assistant',
      content: '抱歉，服务暂时不可用，请稍后重试。',
      timestamp: new Date().toISOString()
    })
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

async function executeAction(actionId) {
  const actionTexts = {
    diagnosis: '请帮我分析品牌的 GEO 状态',
    strategy: '请帮我生成 GEO 优化策略',
    execution: '请帮我执行策略，生成内容',
    chain: '请执行一键串联',
    status: '请告诉我当前的工作流状态'
  }
  
  inputMessage.value = actionTexts[actionId]
  
  if (actionId === 'chain') {
    await executeChain()
  } else {
    await sendMessage()
  }
}

async function executeChain() {
  chainProgress.value.show = true
  chainProgress.value.percent = 0
  chainProgress.value.error = null
  
  // 重置阶段状态
  chainProgress.value.stages.forEach(s => s.status = 'pending')
  
  try {
    // 阶段1: 诊断
    chainProgress.value.stages[0].status = 'running'
    chainProgress.value.percent = 10
    
    const result = await executeAgentChain(props.brandId, sessionId.value)
    
    if (result.success) {
      // 更新阶段状态
      if (result.stages?.diagnosis?.success) {
        chainProgress.value.stages[0].status = 'completed'
        chainProgress.value.stages[0].detail = `报告: ${result.stages.diagnosis.reportId}`
      }
      
      chainProgress.value.percent = 40
      
      if (result.stages?.strategy?.success) {
        chainProgress.value.stages[1].status = 'completed'
        chainProgress.value.stages[1].detail = `策略: ${result.stages.strategy.strategyId}`
      }
      
      chainProgress.value.percent = 70
      
      if (result.stages?.execution?.success) {
        chainProgress.value.stages[2].status = 'completed'
        chainProgress.value.stages[2].detail = `已生成 ${result.stages.execution.contentIds?.length || 0} 条内容`
      }
      
      chainProgress.value.percent = 100
      
      // 添加完成消息
      messages.value.push({
        role: 'assistant',
        content: `✅ 一键串联完成！\n\n诊断: ${result.stages.diagnosis?.success ? '成功' : '失败'}\n策略: ${result.stages.strategy?.success ? '成功' : '失败'}\n执行: ${result.stages.execution?.success ? '成功' : '失败'}\n\n总耗时: ${result.totalDuration}ms`,
        timestamp: new Date().toISOString()
      })
      
      emit('chainComplete', result)
    } else {
      chainProgress.value.error = result.error
      chainProgress.value.stages[0].status = 'failed'
    }
  } catch (error) {
    chainProgress.value.error = error.message
    chainProgress.value.stages[0].status = 'failed'
  }
}

function closeChainProgress() {
  chainProgress.value.show = false
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

function formatMessage(text) {
  if (!text) return ''
  return text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
}

function formatTime(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

function newline() {
  inputMessage.value += '\n'
}

// 监听消息变化，自动滚动
watch(messages, () => {
  scrollToBottom()
}, { deep: true })

// 初始化
onMounted(async () => {
  await checkHealth()
  await initSession()
})
</script>

<style scoped>
.agent-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.agent-header {
  display: flex;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.agent-avatar {
  font-size: 32px;
  margin-right: 12px;
}

.agent-info {
  flex: 1;
}

.agent-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.status-badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  background: rgba(255,255,255,0.2);
}

.status-badge.ready { background: #10b981; }
.status-badge.running { background: #f59e0b; }
.status-badge.error { background: #ef4444; }

.quick-actions {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) {
  background: #667eea;
  color: #fff;
  border-color: #667eea;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-icon {
  font-size: 14px;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.message {
  display: flex;
  margin-bottom: 16px;
}

.message-user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.message-user .message-avatar {
  background: #667eea;
  color: #fff;
}

.message-content {
  max-width: 80%;
  margin: 0 8px;
}

.message-text {
  padding: 12px 16px;
  border-radius: 16px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.message-assistant .message-text {
  background: #f1f5f9;
  border-bottom-left-radius: 4px;
}

.message-user .message-text {
  background: #667eea;
  color: #fff;
  border-bottom-right-radius: 4px;
}

.message-time {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 4px;
}

.message-user .message-time {
  text-align: right;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #94a3b8;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-4px); }
}

.input-area {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #e2e8f0;
  background: #fff;
}

.message-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  resize: none;
  font-size: 14px;
}

.message-input:focus {
  outline: none;
  border-color: #667eea;
}

.send-btn {
  padding: 8px 20px;
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
}

.send-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

/* 一键串联进度弹窗 */
.chain-progress-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.chain-progress-modal {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
}

.chain-progress-modal h3 {
  margin: 0 0 20px;
  text-align: center;
}

.progress-stages {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.stage {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.stage.running {
  background: #fef3c7;
}

.stage.completed {
  background: #d1fae5;
}

.stage.failed {
  background: #fee2e2;
}

.stage-indicator {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.stage.completed .stage-indicator {
  background: #10b981;
  color: #fff;
}

.stage.running .stage-indicator {
  background: #f59e0b;
  color: #fff;
}

.stage.failed .stage-indicator {
  background: #ef4444;
  color: #fff;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.stage-name {
  font-weight: 500;
}

.stage-detail {
  font-size: 12px;
  color: #64748b;
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

.progress-text {
  text-align: center;
  margin-top: 8px;
  font-size: 14px;
  color: #64748b;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255,255,255,0.2);
  color: #fff;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  margin-top: 16px;
  cursor: pointer;
}
</style>
