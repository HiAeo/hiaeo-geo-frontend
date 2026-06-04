<template>
  <div class="xiaozhi-chat">
    <!-- 头部 -->
    <header class="chat-header">
      <div class="header-left">
        <div class="logo-icon">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="10" fill="url(#grad)" />
            <path d="M12 20c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8" stroke="#fff" stroke-width="2.5" stroke-linecap="round" />
            <circle cx="20" cy="20" r="3" fill="#fff" />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="40" y2="40">
                <stop offset="0%" stop-color="#165DFF" />
                <stop offset="100%" stop-color="#0F4CD0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="header-text">
          <h1>小智</h1>
          <span class="subtitle">360智见 · AI智能助手</span>
        </div>
      </div>
      <div class="header-right">
        <a href="/xiaozhi/admin" class="admin-link">
          <el-icon><Setting /></el-icon>
          管理后台
        </a>
      </div>
    </header>

    <!-- 聊天区域 -->
    <div class="chat-messages" ref="messagesContainer">
      <!-- 欢迎消息 -->
      <div class="welcome-area" v-if="messages.length === 0">
        <div class="welcome-avatar">
          <div class="avatar-circle">
            <svg viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="url(#grad2)" />
              <path d="M12 20c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8" stroke="#fff" stroke-width="2.5" stroke-linecap="round" />
              <circle cx="20" cy="20" r="3" fill="#fff" />
              <defs>
                <linearGradient id="grad2" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stop-color="#165DFF" />
                  <stop offset="100%" stop-color="#0F4CD0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <h2 class="welcome-title">你好，我是小智 👋</h2>
        <p class="welcome-desc">{{ welcomeMessage }}</p>
        <div class="quick-questions" v-if="quickQuestions.length > 0">
          <button
            v-for="(q, idx) in quickQuestions"
            :key="idx"
            class="quick-btn"
            @click="sendQuickQuestion(q)"
          >
            {{ q.length > 30 ? q.slice(0, 30) + '...' : q }}
          </button>
        </div>
      </div>

      <!-- 消息列表 -->
      <div v-else>
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          :class="['message-row', msg.role === 'user' ? 'user' : 'assistant']"
        >
          <div class="message-avatar" v-if="msg.role === 'assistant'">
            <div class="avatar-circle small">
              <svg viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" fill="url(#grad3)" />
                <path d="M12 20c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8" stroke="#fff" stroke-width="2" stroke-linecap="round" />
                <circle cx="20" cy="20" r="3" fill="#fff" />
                <defs>
                  <linearGradient id="grad3" x1="0" y1="0" x2="40" y2="40">
                    <stop offset="0%" stop-color="#165DFF" />
                    <stop offset="100%" stop-color="#0F4CD0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <div class="message-bubble" :class="msg.role">
            <div class="message-text" v-html="formatMessage(msg.content)"></div>
            <div class="message-time">{{ msg.time }}</div>
          </div>
        </div>

        <!-- 加载中 -->
        <div class="message-row assistant" v-if="loading">
          <div class="message-avatar">
            <div class="avatar-circle small">
              <svg viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" fill="url(#grad3)" />
                <path d="M12 20c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8" stroke="#fff" stroke-width="2" stroke-linecap="round" />
                <circle cx="20" cy="20" r="3" fill="#fff" />
              </svg>
            </div>
          </div>
          <div class="message-bubble assistant typing">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-input-area">
      <div class="input-wrapper">
        <textarea
          v-model="inputText"
          @keydown.enter.exact.prevent="sendMessage"
          placeholder="输入你的问题，小智为你解答..."
          rows="1"
          ref="inputRef"
          @input="autoResize"
          :disabled="loading"
        ></textarea>
        <button
          class="send-btn"
          @click="sendMessage"
          :disabled="!inputText.trim() || loading"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 10l16-8-8 16-2-6-6-2z" :fill="inputText.trim() && !loading ? '#fff' : '#B0B8C9'" />
          </svg>
        </button>
      </div>
      <p class="input-hint">小智基于知识库提供回答，如有不准确请以官方信息为准</p>
    </div>

    <!-- 底部 -->
    <footer class="chat-footer">
      <span>Powered by 360智见</span>
      <span class="dot-sep">·</span>
      <a href="https://www.360zhijiangeo.com" target="_blank">360智见GEO</a>
    </footer>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { Setting } from '@element-plus/icons-vue'

const messagesContainer = ref(null)
const inputRef = ref(null)
const inputText = ref('')
const loading = ref(false)

// ========== 配置版本控制（版本变化时自动清除旧缓存）=========
const CONFIG_VERSION = '2.0.0'  // 升级此值可强制刷新所有客户端缓存
const STORED_VERSION = localStorage.getItem('xiaozhi_config_version')
if (STORED_VERSION !== CONFIG_VERSION) {
  // 版本不匹配，清除所有旧配置缓存
  localStorage.removeItem('xiaozhi_config')
  localStorage.removeItem('xiaozhi_custom_kb')
  localStorage.setItem('xiaozhi_config_version', CONFIG_VERSION)
}

// ========== Cookie 跨域同步读取 ==========
function getSyncCookie(key) {
  try {
    const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'))
    return match ? decodeURIComponent(match[2]) : null
  } catch { return null }
}

// 从 localStorage 读取配置，或使用默认值（也尝试跨域 Cookie）
const configStr = localStorage.getItem('xiaozhi_config') || getSyncCookie('xiaozhi_config')
const config = configStr ? JSON.parse(configStr) : {
  welcomeMessage: '我是360智见AI智能助手小智，可以帮你解答GEO优化、品牌建设、AI搜索等相关问题。',
  quickQuestions: [
    '介绍一下360智见？',
    '360智见有哪些优势？',
    '360智见有哪些核心功能？',
    '360智见怎么收费？'
  ]
}

const welcomeMessage = ref(config.welcomeMessage)
const quickQuestions = ref(config.quickQuestions)
const messages = ref([])

// 刷新配置
function refreshConfig() {
  const s = localStorage.getItem('xiaozhi_config')
  if (s) {
    const c = JSON.parse(s)
    welcomeMessage.value = c.welcomeMessage
    quickQuestions.value = c.quickQuestions
  }
}

// 监听 storage 变化（跨标签页同步）
window.addEventListener('storage', (e) => {
  if (e.key === 'xiaozhi_config') refreshConfig()
})

// 自动调整输入框高度
function autoResize() {
  const el = inputRef.value
  if (el) {
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }
}

function formatMessage(text) {
  return text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
}

function getTime() {
  return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || loading.value) return

  messages.value.push({ role: 'user', content: text, time: getTime() })
  inputText.value = ''
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
  }
  loading.value = true

  await nextTick()
  scrollToBottom()

  try {
    // 读取本地自定义知识库（后台编辑过的），也尝试跨域 Cookie
    let customKB = null
    try {
      const savedKB = localStorage.getItem('xiaozhi_custom_kb') || getSyncCookie('xiaozhi_custom_kb')
      if (savedKB) customKB = JSON.parse(savedKB)
    } catch { /* ignore */ }

    // 调用后端 API 获取 AI 回复
    const res = await fetch('/api/xiaozhi/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        history: messages.value.slice(0, -1).map(m => ({
          role: m.role,
          content: m.content
        })),
        knowledgeBase: customKB  // 传入自定义知识库
      })
    })

    if (res.ok) {
      const data = await res.json()
      messages.value.push({
        role: 'assistant',
        content: data.reply || '抱歉，我暂时无法回答这个问题。',
        time: getTime()
      })
    } else {
      throw new Error('API error')
    }
  } catch {
    messages.value.push({
      role: 'assistant',
      content: '抱歉，服务暂时不可用，请稍后再试。',
      time: getTime()
    })
  } finally {
    loading.value = false
    await nextTick()
    scrollToBottom()
  }
}

function sendQuickQuestion(question) {
  inputText.value = question
  sendMessage()
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}
</script>

<style scoped>
.xiaozhi-chat {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  background: #F5F7FA;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* ===== 头部 ===== */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #E8ECF1;
  flex-shrink: 0;
  padding-top: max(12px, env(safe-area-inset-top));
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 40px;
  height: 40px;
}

.logo-icon svg {
  width: 100%;
  height: 100%;
}

.header-text h1 {
  font-size: 16px;
  font-weight: 600;
  color: #1D2129;
  margin: 0;
  line-height: 1.2;
}

.subtitle {
  font-size: 11px;
  color: #86909C;
}

.admin-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #165DFF;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background 0.2s;
}

.admin-link:hover {
  background: rgba(22, 93, 255, 0.06);
}

/* ===== 聊天消息区域 ===== */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

/* 欢迎区域 */
.welcome-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.welcome-avatar {
  margin-bottom: 16px;
}

.avatar-circle {
  width: 64px;
  height: 64px;
}

.avatar-circle.small {
  width: 32px;
  height: 32px;
}

.avatar-circle svg {
  width: 100%;
  height: 100%;
}

.welcome-title {
  font-size: 20px;
  font-weight: 600;
  color: #1D2129;
  margin: 0 0 8px;
}

.welcome-desc {
  font-size: 14px;
  color: #86909C;
  max-width: 300px;
  margin: 0 0 24px;
  line-height: 1.6;
}

.quick-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  max-width: 400px;
}

.quick-btn {
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 20px;
  font-size: 13px;
  color: #4E5969;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.quick-btn:hover {
  border-color: #165DFF;
  color: #165DFF;
  background: rgba(22, 93, 255, 0.04);
}

/* 消息行 */
.message-row {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  max-width: 85%;
}

.message-row.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-row.assistant {
  align-self: flex-start;
}

.message-avatar {
  flex-shrink: 0;
  padding-top: 4px;
}

.message-bubble {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
}

.message-bubble.user {
  background: #165DFF;
  color: #fff;
  border-bottom-right-radius: 4px;
}

.message-bubble.assistant {
  background: #fff;
  color: #1D2129;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.message-bubble.typing {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 14px 18px;
}

.message-text :deep(code) {
  background: rgba(0,0,0,0.06);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}

.message-bubble.user .message-text :deep(code) {
  background: rgba(255,255,255,0.2);
}

.message-time {
  font-size: 11px;
  color: #C9CDD4;
  margin-top: 4px;
  text-align: right;
}

.message-bubble.user .message-time {
  color: rgba(255,255,255,0.6);
}

/* 加载动画 */
.dot {
  width: 6px;
  height: 6px;
  background: #C9CDD4;
  border-radius: 50%;
  animation: dotPulse 1.4s infinite;
}

.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes dotPulse {
  0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
  30% { opacity: 1; transform: scale(1); }
}

/* ===== 输入区域 ===== */
.chat-input-area {
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #E8ECF1;
  flex-shrink: 0;
  padding-bottom: max(12px, env(safe-area-inset-bottom));
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  background: #F5F7FA;
  border-radius: 12px;
  padding: 8px 12px;
  border: 1px solid #E8ECF1;
  transition: border-color 0.2s;
}

.input-wrapper:focus-within {
  border-color: #165DFF;
  background: #fff;
}

.input-wrapper textarea {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #1D2129;
  resize: none;
  max-height: 120px;
  line-height: 1.5;
  font-family: inherit;
}

.input-wrapper textarea::placeholder {
  color: #C9CDD4;
}

.send-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: #165DFF;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.send-btn:disabled {
  background: #E8ECF1;
  cursor: not-allowed;
}

.send-btn:not(:disabled):hover {
  background: #0F4CD0;
  transform: scale(1.05);
}

.input-hint {
  text-align: center;
  font-size: 11px;
  color: #C9CDD4;
  margin: 6px 0 0;
}

/* ===== 底部 ===== */
.chat-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px;
  font-size: 12px;
  color: #C9CDD4;
  flex-shrink: 0;
}

.chat-footer a {
  color: #165DFF;
  text-decoration: none;
}

.chat-footer .dot-sep {
  color: #E5E7EB;
}
</style>
