<template>
  <div class="xiaozhi-app" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <!-- 顶部 Logo -->
      <div class="sidebar-header">
        <div class="logo-area">
          <svg class="ai360-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path clip-rule="evenodd" d="M12 0h.018c1.473-.002 2.88.261 4.179.754C20.755 2.456 24 6.85 24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm8.604 18.967A11.024 11.024 0 0023.07 12c0-1.717-.39-3.344-1.089-4.794a2.59 2.59 0 01-3.214.62 6.278 6.278 0 01-1.333-.992C16.283 5.73 15.109 4.66 13.696 3.9c-3.211-1.729-6.825-1.501-9.695.447A11.033 11.033 0 00.93 12c0 1.663.367 3.241 1.024 4.657.75-.973 2.131-1.346 3.232-.71.667.384 1.257.92 1.837 1.447l.176.16c1.365 1.234 2.794 2.355 4.558 2.965 3.053 1.053 6.356.437 8.847-1.552z" fill="url(#sg0)" fill-rule="evenodd"/>
            <path d="M5.643 10.312c-.83.11-1.401.766-1.408 1.618a1.715 1.715 0 001.45 1.72c.805.128 1.64-.426 1.87-1.26.046-.167.076-.338.106-.51.025-.14.05-.282.084-.42.318-1.317 1.237-1.95 2.788-1.93 1.086.013 1.318.271 1.68 1.855.017.076.043.151.07.226.26.714.976 1.17 1.67 1.065a1.647 1.647 0 001.38-1.438c.083-.729-.348-1.264-1.122-1.575-.34-.136-.664-.158-.995-.141-.726.037-1.121-.36-1.339-.977a3.359 3.359 0 01-.134-.65c-.014-.093-.027-.186-.043-.278-.156-.887-.835-1.51-1.669-1.532-.791-.02-1.464.551-1.665 1.418l-.06.27-.025.117c-.355 1.636-.974 2.205-2.638 2.422z" fill="url(#sg1)"/>
            <path d="M18.059 13.644c.989-.206 1.577-.838 1.592-1.697.015-.83-.624-1.582-1.46-1.724-.77-.13-1.599.383-1.844 1.18-.069.22-.117.448-.165.676-.06.29-.122.58-.225.854-.367.986-1.593 1.546-2.926 1.394-.824-.095-1.106-.446-1.342-1.674-.18-.938-.864-1.535-1.681-1.467-.85.07-1.515.829-1.468 1.673.05.892.678 1.44 1.705 1.489 1.375.064 1.75.396 1.926 1.787.067.531.267.967.685 1.288 1.02.783 2.407.208 2.66-1.108l.022-.114c.152-.796.3-1.577 1.04-2.101.36-.255.761-.326 1.166-.397.105-.019.21-.037.315-.06z" fill="url(#sg2)"/>
            <defs>
              <linearGradient id="sg0" x1="12" x2="12" y1="0" y2="24"><stop stop-color="#12B7FA"/><stop offset="1" stop-color="#006FBB"/></linearGradient>
              <linearGradient id="sg1" x1="11.943" x2="11.943" y1="6.085" y2="17.778"><stop stop-color="#006FBB"/><stop offset="1" stop-color="#12B7FA"/></linearGradient>
              <linearGradient id="sg2" x1="11.943" x2="11.943" y1="6.085" y2="17.778"><stop stop-color="#006FBB"/><stop offset="1" stop-color="#12B7FA"/></linearGradient>
            </defs>
          </svg>
          <span class="app-title">360智见GEO助手</span>
        </div>
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed" :title="sidebarCollapsed ? '展开侧栏' : '收起侧栏'">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3L10 8L6 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- 新对话按钮 -->
      <button class="new-chat-btn" @click="createNewChat">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3V13M3 8H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        新对话
        <span class="shortcut-hint">⌘ K</span>
      </button>

      <!-- 历史对话列表 -->
      <div class="history-section" v-if="conversationList.length > 0">
        <div class="history-label">历史对话</div>
        <div class="history-list">
          <div
            v-for="conv in conversationList"
            :key="conv.id"
            :class="['history-item', { active: currentConvId === conv.id }]"
            @click="switchConversation(conv.id)"
          >
            <span class="history-text">{{ conv.title }}</span>
            <button class="delete-btn" @click.stop="deleteConversation(conv.id)" title="删除对话">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M11 3.5L3 11.5M3 3.5L11 11.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 底部用户区域 -->
      <div class="sidebar-footer">
        <!-- 用户登录区（左侧） -->
        <button class="user-login-btn" @click="showLoginModal = true" v-if="!userName">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="5" r="3.5" stroke="currentColor" stroke-width="1.2"/>
            <path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
          <span>登 录</span>
        </button>
        <div class="user-area" v-else>
          <div class="user-avatar-circle">{{ userName.charAt(0).toUpperCase() }}</div>
          <span class="user-name">{{ userName }}</span>
        </div>

        <!-- 管理后台入口（右侧） -->
        <a href="/xiaozhi/admin" class="admin-link-sm" target="_blank" title="管理后台">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
            <line x1="1.5" y1="6" x2="14.5" y2="6" stroke="currentColor" stroke-width="1.2"/>
            <circle cx="4" cy="4.25" r="0.8" fill="currentColor"/>
            <circle cx="7" cy="4.25" r="0.8" fill="currentColor"/>
            <circle cx="10" cy="4.25" r="0.8" fill="currentColor"/>
          </svg>
        </a>
      </div>
    </aside>

    <!-- 登录/注册弹窗 -->
    <Teleport to="body">
      <div class="login-overlay" v-if="showLoginModal" @click.self="showLoginModal = false">
        <div class="login-modal">
          <button class="login-close" @click="showLoginModal = false">&times;</button>

          <!-- Logo -->
          <div class="login-logo">
            <div class="login-logo-icon">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="url(#lg)"/>
                <path d="M8 16L14 10L20 16L14 22Z" fill="#fff" opacity=".9"/>
                <path d="M14 10L20 16L26 10" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                <defs><linearGradient id="lg" x1="0" y1="0" x2="32" y2="32"><stop stop-color="#165DFF"/><stop offset="1" stop-color="#0F4CD0"/></linearGradient></defs>
              </svg>
            </div>
            <span class="login-brand">智见GEO</span>
          </div>

          <!-- Tab 切换 -->
          <div class="auth-tabs">
            <button :class="['tab-btn', { active: authMode === 'login' }]" @click="switchAuthMode('login')">登 录</button>
            <button :class="['tab-btn', { active: authMode === 'register' }]" @click="switchAuthMode('register')">注 册</button>
          </div>

          <!-- ====== 登录表单 ====== -->
          <form v-if="authMode === 'login'" @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label>手机号</label>
              <input v-model="loginForm.phone" type="tel" placeholder="请输入手机号" maxlength="11" required autofocus />
            </div>
            <div class="form-group">
              <label>密码</label>
              <input v-model="loginForm.password" type="password" placeholder="请输入密码" required />
            </div>
            <div class="login-error" v-if="loginError">{{ loginError }}</div>
            <button type="submit" class="submit-btn" :disabled="loginLoading">
              {{ loginLoading ? '登录中...' : '登 录' }}
            </button>
          </form>

          <!-- ====== 注册表单 ====== -->
          <form v-else @submit.prevent="handleRegister" class="login-form">
            <div class="form-group">
              <label>手机号</label>
              <input v-model="registerForm.phone" type="tel" placeholder="请输入手机号" maxlength="11" required autofocus />
            </div>
            <div class="form-group">
              <label>设置密码</label>
              <input v-model="registerForm.password" type="password" placeholder="请设置密码（至少6位）" minlength="6" required />
            </div>
            <div class="form-group">
              <label>确认密码</label>
              <input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" minlength="6" required />
            </div>
            <div class="login-error" v-if="registerError">{{ registerError }}</div>
            <button type="submit" class="submit-btn" :disabled="registerLoading">
              {{ registerLoading ? '注册中...' : '注 册' }}
            </button>
            <p class="login-hint">注册即表示同意用户协议和隐私政策</p>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- 右侧聊天区 -->
    <main class="chat-main">
      <!-- 聊天头部（右侧顶部） -->
      <header class="chat-header-right">
        <span>{{ currentTitle }}</span>
      </header>

      <!-- 聊天内容区 -->
      <div class="chat-messages" ref="messagesContainer">
        <!-- 欢迎消息 -->
        <div class="welcome-area" v-if="messages.length === 0">
          <div class="welcome-avatar">
            <svg class="ai360-icon ai360-lg heartbeat" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path clip-rule="evenodd" d="M12 0h.018c1.473-.002 2.88.261 4.179.754C20.755 2.456 24 6.85 24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm8.604 18.967A11.024 11.024 0 0023.07 12c0-1.717-.39-3.344-1.089-4.794a2.59 2.59 0 01-3.214.62 6.278 6.278 0 01-1.333-.992C16.283 5.73 15.109 4.66 13.696 3.9c-3.211-1.729-6.825-1.501-9.695.447A11.033 11.033 0 00.93 12c0 1.663.367 3.241 1.024 4.657.75-.973 2.131-1.346 3.232-.71.667.384 1.257.92 1.837 1.447l.176.16c1.365 1.234 2.794 2.355 4.558 2.965 3.053 1.053 6.356.437 8.847-1.552z" fill="url(#wg0)" fill-rule="evenodd"/>
              <path d="M5.643 10.312c-.83.11-1.401.766-1.408 1.618a1.715 1.715 0 001.45 1.72c.805.128 1.64-.426 1.87-1.26.046-.167.076-.338.106-.51.025-.14.05-.282.084-.42.318-1.317 1.237-1.95 2.788-1.93 1.086.013 1.318.271 1.68 1.855.017.076.043.151.07.226.26.714.976 1.17 1.67 1.065a1.647 1.647 0 001.38-1.438c.083-.729-.348-1.264-1.122-1.575-.34-.136-.664-.158-.995-.141-.726.037-1.121-.36-1.339-.977a3.359 3.359 0 01-.134-.65c-.014-.093-.027-.186-.043-.278-.156-.887-.835-1.51-1.669-1.532-.791-.02-1.464.551-1.665 1.418l-.06.27-.025.117c-.355 1.636-.974 2.205-2.638 2.422z" fill="url(#wg1)"/>
              <path d="M18.059 13.644c.989-.206 1.577-.838 1.592-1.697.015-.83-.624-1.582-1.46-1.724-.77-.13-1.599.383-1.844 1.18-.069.22-.117.448-.165.676-.06.29-.122.58-.225.854-.367.986-1.593 1.546-2.926 1.394-.824-.095-1.106-.446-1.342-1.674-.18-.938-.864-1.535-1.681-1.467-.85.07-1.515.829-1.468 1.673.05.892.678 1.44 1.705 1.489 1.375.064 1.75.396 1.926 1.787.067.531.267.967.685 1.288 1.02.783 2.407.208 2.66-1.108l.022-.114c.152-.796.3-1.577 1.04-2.101.36-.255.761-.326 1.166-.397.105-.019.21-.037.315-.06z" fill="url(#wg2)"/>
              <defs>
                <linearGradient id="wg0" x1="12" x2="12" y1="0" y2="24"><stop stop-color="#12B7FA"/><stop offset="1" stop-color="#006FBB"/></linearGradient>
                <linearGradient id="wg1" x1="11.943" x2="11.943" y1="6.085" y2="17.778"><stop stop-color="#006FBB"/><stop offset="1" stop-color="#12B7FA"/></linearGradient>
                <linearGradient id="wg2" x1="11.943" x2="11.943" y1="6.085" y2="17.778"><stop stop-color="#006FBB"/><stop offset="1" stop-color="#12B7FA"/></linearGradient>
              </defs>
            </svg>
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
        <div v-else class="message-list-wrapper">
          <div
            v-for="(msg, idx) in messages"
            :key="idx"
            :class="['message-row', msg.role === 'user' ? 'user' : 'assistant']"
          >
            <div class="message-avatar" v-if="msg.role === 'assistant'">
              <svg class="ai360-icon ai360-sm" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path clip-rule="evenodd" d="M12 0h.018c1.473-.002 2.88.261 4.179.754C20.755 2.456 24 6.85 24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm8.604 18.967A11.024 11.024 0 0023.07 12c0-1.717-.39-3.344-1.089-4.794a2.59 2.59 0 01-3.214.62 6.278 6.278 0 01-1.333-.992C16.283 5.73 15.109 4.66 13.696 3.9c-3.211-1.729-6.825-1.501-9.695.447A11.033 11.033 0 00.93 12c0 1.663.367 3.241 1.024 4.657.75-.973 2.131-1.346 3.232-.71.667.384 1.257.92 1.837 1.447l.176.16c1.365 1.234 2.794 2.355 4.558 2.965 3.053 1.053 6.356.437 8.847-1.552z" fill="url(#mg0)" fill-rule="evenodd"/>
                <path d="M5.643 10.312c-.83.11-1.401.766-1.408 1.618a1.715 1.715 0 001.45 1.72c.805.128 1.64-.426 1.87-1.26.046-.167.076-.338.106-.51.025-.14.05-.282.084-.42.318-1.317 1.237-1.95 2.788-1.93 1.086.013 1.318.271 1.68 1.855.017.076.043.151.07.226.26.714.976 1.17 1.67 1.065a1.647 1.647 0 001.38-1.438c.083-.729-.348-1.264-1.122-1.575-.34-.136-.664-.158-.995-.141-.726.037-1.121-.36-1.339-.977a3.359 3.359 0 01-.134-.65c-.014-.093-.027-.186-.043-.278-.156-.887-.835-1.51-1.669-1.532-.791-.02-1.464.551-1.665 1.418l-.06.27-.025.117c-.355 1.636-.974 2.205-2.638 2.422z" fill="url(#mg1)"/>
                <path d="M18.059 13.644c.989-.206 1.577-.838 1.592-1.697.015-.83-.624-1.582-1.46-1.724-.77-.13-1.599.383-1.844 1.18-.069.22-.117.448-.165.676-.06.29-.122.58-.225.854-.367.986-1.593 1.546-2.926 1.394-.824-.095-1.106-.446-1.342-1.674-.18-.938-.864-1.535-1.681-1.467-.85.07-1.515.829-1.468 1.673.05.892.678 1.44 1.705 1.489 1.375.064 1.75.396 1.926 1.787.067.531.267.967.685 1.288 1.02.783 2.407.208 2.66-1.108l.022-.114c.152-.796.3-1.577 1.04-2.101.36-.255.761-.326 1.166-.397.105-.019.21-.037.315-.06z" fill="url(#mg2)"/>
                <defs>
                  <linearGradient id="mg0" x1="12" x2="12" y1="0" y2="24"><stop stop-color="#12B7FA"/><stop offset="1" stop-color="#006FBB"/></linearGradient>
                  <linearGradient id="mg1" x1="11.943" x2="11.943" y1="6.085" y2="17.778"><stop stop-color="#006FBB"/><stop offset="1" stop-color="#12B7FA"/></linearGradient>
                  <linearGradient id="mg2" x1="11.943" x2="11.943" y1="6.085" y2="17.778"><stop stop-color="#006FBB"/><stop offset="1" stop-color="#12B7FA"/></linearGradient>
                </defs>
              </svg>
            </div>
            <div class="message-bubble" :class="msg.role">
              <div class="message-text" v-html="formatMessage(msg.content)"></div>
              <div class="message-time">{{ msg.time }}</div>
            </div>
          </div>

          <!-- 加载中 -->
          <div class="message-row assistant" v-if="loading">
            <div class="message-avatar">
              <svg class="ai360-icon ai360-sm" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path clip-rule="evenodd" d="M12 0h.018c1.473-.002 2.88.261 4.179.754C20.755 2.456 24 6.85 24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm8.604 18.967A11.024 11.024 0 0023.07 12c0-1.717-.39-3.344-1.089-4.794a2.59 2.59 0 01-3.214.62 6.278 6.278 0 01-1.333-.992C16.283 5.73 15.109 4.66 13.696 3.9c-3.211-1.729-6.825-1.501-9.695.447A11.033 11.033 0 00.93 12c0 1.663.367 3.241 1.024 4.657.75-.973 2.131-1.346 3.232-.71.667.384 1.257.92 1.837 1.447l.176.16c1.365 1.234 2.794 2.355 4.558 2.965 3.053 1.053 6.356.437 8.847-1.552z" fill="url(#lg0)" fill-rule="evenodd"/>
                <defs><linearGradient id="lg0" x1="12" x2="12" y1="0" y2="24"><stop stop-color="#12B7FA"/><stop offset="1" stop-color="#006FBB"/></linearGradient></defs>
              </svg>
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
            placeholder="有什么我能帮你的吗？"
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
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 9l14-7-7 14-2-5-5-2z" :fill="inputText.trim() && !loading ? '#fff' : '#B0B8C9'" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'

// ========== 配置版本控制 ==========
const CONFIG_VERSION = '2.1.0'
const STORED_VERSION = localStorage.getItem('xiaozhi_config_version')
if (STORED_VERSION !== CONFIG_VERSION) {
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

// ========== 配置 ==========
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

// ========== 对话管理 ==========
const messagesContainer = ref(null)
const inputRef = ref(null)
const inputText = ref('')
const loading = ref(false)
const sidebarCollapsed = ref(false)
const currentConvId = ref('')
const messages = ref([])
const conversationList = ref([])

// 用户名
const userName = ref(localStorage.getItem('xiaozhi_user_name') || '')

// 登录弹窗
const showLoginModal = ref(false)
const authMode = ref('login') // 'login' | 'register'
const loginLoading = ref(false)
const loginError = ref('')
const loginForm = ref({ phone: '', password: '' })

// 注册
const registerLoading = ref(false)
const registerError = ref('')
const registerForm = ref({ phone: '', password: '', confirmPassword: '' })

// 当前对话标题
const currentTitle = computed(() => {
  if (currentConvId.value && messages.value.length > 0) {
    const conv = conversationList.value.find(c => c.id === currentConvId.value)
    if (conv) return conv.title
    // 从第一条用户消息取标题
    const firstUserMsg = messages.value.find(m => m.role === 'user')
    if (firstUserMsg) return firstUserMsg.content.slice(0, 20)
  }
  return '新对话'
})

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function loadConversations() {
  try {
    const raw = localStorage.getItem('xiaozhi_conversations')
    if (raw) conversationList.value = JSON.parse(raw)
  } catch { /* ignore */ }
}

function saveConversations() {
  localStorage.setItem('xiaozhi_conversations', JSON.stringify(conversationList.value))
}

function saveCurrentMessages() {
  if (!currentConvId.value) return
  // 自动从第一条用户消息生成标题
  let title = currentConvId.value
  const firstUserMsg = messages.value.find(m => m.role === 'user')
  if (firstUserMsg && firstUserMsg.content.length > 0) {
    title = firstUserMsg.content.slice(0, 25) + (firstUserMsg.content.length > 25 ? '...' : '')
  }

  const existingIdx = conversationList.value.findIndex(c => c.id === currentConvId.value)
  const data = { id: currentConvId.value, title, updatedAt: Date.now(), messages: [...messages.value] }
  if (existingIdx >= 0) {
    conversationList.value[existingIdx] = data
  } else {
    conversationList.value.unshift(data)
  }
  saveConversations()
}

function createNewChat() {
  saveCurrentMessages()
  currentConvId.value = generateId()
  messages.value = []
  inputText.value = ''
}

function switchConversation(id) {
  saveCurrentMessages()
  const conv = conversationList.value.find(c => c.id === id)
  if (conv) {
    currentConvId.value = id
    messages.value = conv.messages || []
  }
  inputText.value = ''
}

function deleteConversation(id) {
  conversationList.value = conversationList.value.filter(c => c.id !== id)
  saveConversations()
  if (id === currentConvId.value) {
    createNewChat()
  }
}

// ========== 刷新配置 ==========
function refreshConfig() {
  const s = localStorage.getItem('xiaozhi_config')
  if (s) {
    const c = JSON.parse(s)
    welcomeMessage.value = c.welcomeMessage
    quickQuestions.value = c.quickQuestions
  }
}

window.addEventListener('storage', (e) => {
  if (e.key === 'xiaozhi_config') refreshConfig()
})

// ========== 键盘快捷键 ==========
function handleKeydown(e) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    createNewChat()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  // 加载历史对话
  loadConversations()
  // 如果没有当前对话，创建一个
  if (!currentConvId.value || !conversationList.value.find(c => c.id === currentConvId.value)) {
    createNewChat()
  }
})
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// ========== 自动调整输入框高度 ==========
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
  if (inputRef.value) inputRef.value.style.height = 'auto'
  loading.value = true

  await nextTick()
  scrollToBottom()

  try {
    let customKB = null
    try {
      const savedKB = localStorage.getItem('xiaozhi_custom_kb') || getSyncCookie('xiaozhi_custom_kb')
      if (savedKB) customKB = JSON.parse(savedKB)
    } catch { /* ignore */ }

    const res = await fetch('/api/xiaozhi/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        history: messages.value.slice(0, -1).map(m => ({ role: m.role, content: m.content })),
        knowledgeBase: customKB
      })
    })

    if (res.ok) {
      const data = await res.json()
      messages.value.push({ role: 'assistant', content: data.reply || '抱歉，我暂时无法回答这个问题。', time: getTime() })
    } else {
      throw new Error('API error')
    }
  } catch {
    messages.value.push({ role: 'assistant', content: '抱歉，服务暂时不可用，请稍后再试。', time: getTime() })
  } finally {
    loading.value = false
    // 保存消息到当前对话记录
    saveCurrentMessages()
    await nextTick()
    scrollToBottom()
  }
}

function sendQuickQuestion(question) {
  inputText.value = question
  sendMessage()
}

// ========== 登录 / 注册 ==========
function switchAuthMode(mode) {
  authMode.value = mode
  loginError.value = ''
  registerError.value = ''
}

async function handleLogin() {
  const { phone, password } = loginForm.value
  if (!phone || !password) return

  loginLoading.value = true
  loginError.value = ''

  try {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    })

    if (res.ok) {
      const data = await res.json()
      userName.value = data.user?.phone || phone
      localStorage.setItem('xiaozhi_user_name', userName.value)
      localStorage.setItem('xiaozhi_user_token', data.accessToken || data.token || '')
      showLoginModal.value = false
      loginForm.value = { phone: '', password: '' }
    } else {
      const errData = await res.json().catch(() => ({}))
      loginError.value = errData.message || '手机号或密码错误'
    }
  } catch (e) {
    loginError.value = '网络连接失败，请稍后重试'
  } finally {
    loginLoading.value = false
  }
}

async function handleRegister() {
  const { phone, password, confirmPassword } = registerForm.value
  if (!phone || !password) return

  // 前端校验
  if (!/^1\d{10}$/.test(phone)) {
    registerError.value = '请输入正确的手机号'
    return
  }
  if (password.length < 6) {
    registerError.value = '密码至少6位'
    return
  }
  if (password !== confirmPassword) {
    registerError.value = '两次输入的密码不一致'
    return
  }

  registerLoading.value = true
  registerError.value = ''

  try {
    const res = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    })

    if (res.ok) {
      const data = await res.json()
      userName.value = data.user?.phone || phone
      localStorage.setItem('xiaozhi_user_name', userName.value)
      localStorage.setItem('xiaozhi_user_token', data.accessToken || data.token || '')
      showLoginModal.value = false
      registerForm.value = { phone: '', password: '', confirmPassword: '' }
    } else {
      const errData = await res.json().catch(() => ({}))
      registerError.value = errData.message || '注册失败，该手机号可能已注册'
    }
  } catch (e) {
    registerError.value = '网络连接失败，请稍后重试'
  } finally {
    registerLoading.value = false
  }
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}
</script>

<style scoped>
.xiaozhi-app {
  display: flex;
  height: 100vh;
  height: 100dvh;
  background: #F5F7FA;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* ====== 侧边栏 ====== */
.sidebar {
  width: 260px;
  min-width: 260px;
  background: #fff;
  border-right: 1px solid #E8ECF1;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.25s ease, opacity 0.25s ease;
  position: relative;
  z-index: 10;
}
.sidebar-collapsed .sidebar {
  margin-left: -260px;
  opacity: 0;
  pointer-events: none;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 14px;
  border-bottom: 1px solid #F0F0F0;
  flex-shrink: 0;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.ai360-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}
.app-title {
  font-size: 14px;
  font-weight: 600;
  color: #1D2129;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.collapse-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: #F5F7FA;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #86909C;
  flex-shrink: 0;
  transition: all 0.2s;
}
.collapse-btn:hover { background: #E8ECF1; color: #1D2129; }
.sidebar-collapsed .collapse-btn svg { transform: rotate(180deg); }

/* 新对话按钮 */
.new-chat-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 14px;
  padding: 10px 14px;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  background: #fff;
  color: #1D2129;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.new-chat-btn:hover {
  border-color: #165DFF;
  color: #165DFF;
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.1);
}
.shortcut-hint {
  margin-left: auto;
  font-size: 11px;
  color: #C9CDD4;
  background: #F5F7FA;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: SFMono-Regular, Consolas, monospace;
}

/* 历史记录 */
.history-section {
  flex: 1;
  overflow-y: auto;
  padding: 0 10px;
  min-height: 0;
}
.history-label {
  font-size: 12px;
  color: #86909C;
  padding: 8px 8px 4px;
  font-weight: 500;
}
.history-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.history-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
  font-size: 13px;
  color: #4E5969;
}
.history-item:hover { background: #F5F7FA; }
.history-item.active { background: rgba(22, 93, 255, 0.08); color: #165DFF; }
.history-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.delete-btn {
  opacity: 0;
  width: 22px;
  height: 22px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #86909C;
  transition: all 0.15s;
  flex-shrink: 0;
}
.history-item:hover .delete-btn { opacity: 1; }
.delete-btn:hover { background: #FFECE8; color: #F53F3F; }

/* 侧边栏底部 */
.sidebar-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-top: 1px solid #F0F0F0;
  flex-shrink: 0;
}
.user-login-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  background: linear-gradient(135deg, #165DFF, #0F4CD0);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.user-login-btn:hover {
  box-shadow: 0 2px 10px rgba(22, 93, 255, 0.35);
  transform: translateY(-1px);
}
.user-area {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.user-avatar-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #165DFF, #0F4CD0);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.user-name {
  font-size: 13px;
  color: #4E5969;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.admin-link-sm {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #86909C;
  text-decoration: none;
  transition: all 0.2s;
  flex-shrink: 0;
  border: 1px solid #E5E7EB;
}
.admin-link-sm:hover { background: #F5F7FA; color: #165DFF; border-color: #165DFF; }

/* ====== 聊天主区域 ====== */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;
}

.chat-header-right {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  background: #fff;
  border-bottom: 1px solid #E8ECF1;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 500;
  color: #86909C;
}

/* 聊天消息 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
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
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}
.ai360-lg { width: 72px; height: 72px; }
.ai360-sm { width: 32px; height: 32px; }

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  14% { transform: scale(1.15); }
  28% { transform: scale(1); }
  42% { transform: scale(1.1); }
  70% { transform: scale(1); }
}
.heartbeat {
  animation: heartbeat 2s ease-in-out infinite;
}

.welcome-title {
  font-size: 22px;
  font-weight: 700;
  color: #1D2129;
  margin: 0 0 10px;
}
.welcome-desc {
  font-size: 14px;
  color: #86909C;
  max-width: 380px;
  margin: 0 0 28px;
  line-height: 1.7;
}
.quick-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  max-width: 480px;
}
.quick-btn {
  padding: 10px 18px;
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 22px;
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
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.08);
}

/* 消息列表 */
.message-list-wrapper {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding-top: 8px;
}

.message-row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.message-row.user {
  flex-direction: row-reverse;
}
.message-row.assistant {
  align-self: flex-start;
}
.message-row.user {
  align-self: flex-end;
  max-width: 80%;
}
.message-row.assistant {
  max-width: 80%;
}

.message-avatar {
  flex-shrink: 0;
  padding-top: 2px;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.7;
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
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}
.message-bubble.typing {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 16px 20px;
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
  margin-top: 5px;
  text-align: right;
}
.message-bubble.user .message-time {
  color: rgba(255,255,255,0.6);
}

.dot {
  width: 7px;
  height: 7px;
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

/* 输入区域 */
.chat-input-area {
  padding: 12px 20px 16px;
  background: #fff;
  border-top: 1px solid #E8ECF1;
  flex-shrink: 0;
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}
.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  border-radius: 14px;
  padding: 14px 18px;
  border: 1px solid #E5E7EB;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.input-wrapper:focus-within {
  border-color: #165DFF;
  box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.08);
}
.input-wrapper textarea {
  flex: 1;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  font-size: 15px;
  color: #1D2129;
  resize: none;
  max-height: 120px;
  line-height: 1.6;
  font-family: inherit;
  padding: 0;
  margin: 0;
}
.input-wrapper textarea::placeholder { color: #C9CDD4; }
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

/* 登录/注册弹窗 */
.login-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.login-modal {
  background: #fff;
  border-radius: 16px;
  padding: 32px 28px 28px;
  width: 400px;
  max-width: 90vw;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.25s ease;
}
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.login-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 18px;
  color: #86909C;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.login-close:hover { background: #F5F7FA; color: #1D2129; }

/* Logo */
.login-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 22px;
}
.login-logo-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}
.login-logo-icon svg {
  width: 100%;
  height: 100%;
}
.login-brand {
  font-size: 20px;
  font-weight: 700;
  color: #1D2129;
  letter-spacing: 0.5px;
}

/* Tab 切换 */
.auth-tabs {
  display: flex;
  background: #F5F7FA;
  border-radius: 10px;
  padding: 3px;
  margin-bottom: 20px;
}
.tab-btn {
  flex: 1;
  padding: 9px 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: #86909C;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-btn.active {
  background: #fff;
  color: #165DFF;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  font-weight: 600;
}

/* 表单 */
.login-form .form-group {
  margin-bottom: 14px;
}
.login-form label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #4E5969;
  margin-bottom: 6px;
}
.login-form input {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  font-size: 14px;
  color: #1D2129;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  font-family: inherit;
}
.login-form input:focus {
  border-color: #165DFF;
  box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.08);
}
.login-form input::placeholder { color: #C9CDD4; }

/* 错误提示 + 按钮 + 提示 */
.login-error {
  background: #FFECE8;
  color: #F53F3F;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 12px;
}

.submit-btn {
  width: 100%;
  padding: 11px;
  background: linear-gradient(135deg, #165DFF, #0F4CD0);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 4px;
}
.submit-btn:hover:not(:disabled) {
  box-shadow: 0 4px 16px rgba(22, 93, 255, 0.35);
  transform: translateY(-1px);
}
.submit-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.login-hint {
  text-align: center;
  font-size: 12px;
  color: #C9CDD4;
  margin: 12px 0 0;
}
@media (max-width: 640px) {
  .sidebar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    box-shadow: 4px 0 16px rgba(0, 0, 0, 0.1);
  }
  .sidebar-collapsed .sidebar {
    margin-left: -260px;
  }
  .chat-header-right {
    padding: 8px 12px;
  }
  .chat-messages { padding: 12px; }
  .chat-input-area { padding: 8px 12px 12px; }
  .message-row.user,
  .message-row.assistant { max-width: 90%; }
}
</style>
