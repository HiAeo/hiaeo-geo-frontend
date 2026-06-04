<template>
  <!-- 登录遮罩 -->
  <div class="login-overlay" v-if="!authenticated" @keydown.enter="checkPassword">
    <div class="login-box">
      <div class="login-icon">
        <svg viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="10" fill="url(#g-login)" />
          <path d="M12 20c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8" stroke="#fff" stroke-width="2.5" stroke-linecap="round" />
          <circle cx="20" cy="20" r="3" fill="#fff" />
          <defs>
            <linearGradient id="g-login" x1="0" y1="0" x2="40" y2="40">
              <stop offset="0%" stop-color="#165DFF" />
              <stop offset="100%" stop-color="#0F4CD0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h2>小智管理后台</h2>
      <p>请输入管理员密码</p>
      <input
        v-model="passwordInput"
        type="password"
        placeholder="管理员密码"
        autofocus
      />
      <p class="login-error" v-if="passwordError">{{ passwordError }}</p>
      <button class="btn btn-primary login-btn" @click="checkPassword">登录</button>
    </div>
  </div>

  <div class="xiaozhi-admin" v-else>
    <!-- 侧边栏 -->
    <aside class="admin-sidebar">
      <div class="sidebar-brand">
        <div class="brand-icon">
          <svg viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="url(#g-admin)" />
            <path d="M12 20c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8" stroke="#fff" stroke-width="2.5" stroke-linecap="round" />
            <circle cx="20" cy="20" r="3" fill="#fff" />
            <defs>
              <linearGradient id="g-admin" x1="0" y1="0" x2="40" y2="40">
                <stop offset="0%" stop-color="#165DFF" />
                <stop offset="100%" stop-color="#0F4CD0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="brand-text">
          <span class="brand-name">小智后台</span>
          <span class="brand-sub">360智见 · 知识库管理</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['nav-item', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <el-icon><component :is="tab.icon" /></el-icon>
          {{ tab.label }}
        </button>
      </nav>

      <div class="sidebar-footer">
        <a href="/xiaozhi" class="back-link" target="_blank">
          <el-icon><View /></el-icon>
          预览小智
        </a>
        <button class="logout-btn" @click="handleLogout">
          <el-icon><SwitchButton /></el-icon>
          退出
        </button>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="admin-main">
      <!-- 欢迎语配置 -->
      <section v-if="activeTab === 'welcome'" class="config-section">
        <h2>欢迎语设置</h2>
        <p class="section-desc">配置小智机器人的开场欢迎语和描述文本</p>

        <div class="form-group">
          <label>欢迎语</label>
          <textarea
            v-model="config.welcomeMessage"
            rows="3"
            placeholder="输入欢迎语..."
            class="form-textarea"
          ></textarea>
        </div>

        <div class="form-group">
          <label>预设快捷问题（每行一个，最多8个）</label>
          <textarea
            v-model="quickQuestionsText"
            rows="6"
            placeholder="什么是GEO？&#10;如何提升品牌AI可见度？&#10;360智见有哪些功能？"
            class="form-textarea"
          ></textarea>
        </div>

        <div class="form-actions">
          <button class="btn btn-primary" @click="saveConfig">保存配置</button>
          <button class="btn btn-secondary" @click="resetConfig">重置</button>
        </div>

        <div class="preview-card" v-if="showPreview">
          <h3>预览效果</h3>
          <div class="preview-box">
            <p class="preview-welcome">{{ config.welcomeMessage }}</p>
            <div class="preview-questions">
              <span
                v-for="(q, idx) in quickQuestionsList"
                :key="idx"
                class="preview-tag"
              >{{ q.length > 30 ? q.slice(0, 30) + '...' : q }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 问答知识库管理 -->
      <section v-if="activeTab === 'knowledge'" class="config-section">
        <h2>问答知识库</h2>
        <p class="section-desc">管理小智的问答对。每条问答包含匹配关键词和对应回答内容，按顺序优先匹配。</p>

        <!-- 新增问答 -->
        <div class="kb-add-card">
          <h3>➕ 新增问答</h3>
          <div class="form-group">
            <label>匹配关键词（多个用逗号分隔）</label>
            <input
              v-model="newQA.id"
              type="text"
              class="form-input"
              placeholder="ID标识，如: pricing"
              style="margin-bottom:8px"
            />
            <input
              v-model="newKwInput"
              type="text"
              class="form-input"
              placeholder="例如: 收费, 多少钱, 价格, 费用, 报价"
            />
          </div>
          <div class="form-group">
            <label>回答内容（支持 Markdown）</label>
            <textarea
              v-model="newQA.answer"
              rows="5"
              class="form-textarea"
              placeholder="输入对应的回答内容..."
            ></textarea>
          </div>
          <button class="btn btn-primary" @click="addQAPair" :disabled="!newQA.id || !newKwInput.trim() || !newQA.answer.trim()">
            添加问答
          </button>
        </div>

        <!-- 问答列表 -->
        <div class="kb-list" v-if="qaPairs.length > 0">
          <h3>📚 已有问答 ({{ qaPairs.length }}条) <span class="kb-hint">拖拽可调整优先级</span></h3>

          <div
            v-for="(pair, idx) in qaPairs"
            :key="pair.id"
            class="kb-item"
            :class="{ 'kb-editing': editingId === pair.id }"
          >
            <!-- 展示模式 -->
            <template v-if="editingId !== pair.id">
              <div class="kb-item-header">
                <span class="kb-idx">{{ idx + 1 }}</span>
                <span class="kb-id">{{ pair.id }}</span>
                <span class="kb-kws">{{ pair.keywords.slice(0, 4).join('、') }}{{ pair.keywords.length > 4 ? '...' : '' }}</span>
                <div class="kb-actions">
                  <button class="btn-icon" @click="startEdit(pair)" title="编辑">✏️</button>
                  <button class="btn-icon danger" @click="removeQAPair(idx)" title="删除">🗑️</button>
                  <button class="btn-icon" @click="moveQAPair(idx, -1)" :disabled="idx === 0" title="上移">⬆️</button>
                  <button class="btn-icon" @click="moveQAPair(idx, 1)" :disabled="idx === qaPairs.length - 1" title="下移">⬇️</button>
                </div>
              </div>
              <div class="kb-preview">{{ pair.answer.slice(0, 80) }}{{ pair.answer.length > 80 ? '...' : '' }}</div>
            </template>

            <!-- 编辑模式 -->
            <template v-else>
              <div class="form-group" style="margin-bottom:8px">
                <label>ID</label>
                <input v-model="editForm.id" class="form-input" disabled style="background:#f5f7fa" />
              </div>
              <div class="form-group" style="margin-bottom:8px">
                <label>关键词（逗号分隔）</label>
                <input v-model="editKwInput" class="form-input" placeholder="收费, 多少钱..." />
              </div>
              <div class="form-group" style="margin-bottom:8px">
                <label>回答内容</label>
                <textarea v-model="editForm.answer" rows="4" class="form-textarea"></textarea>
              </div>
              <div class="kb-edit-actions">
                <button class="btn btn-primary btn-sm" @click="saveEdit">保存</button>
                <button class="btn btn-secondary btn-sm" @click="cancelEdit">取消</button>
              </div>
            </template>
          </div>
        </div>

        <div v-else class="empty-state">
          <p>暂无问答对，请在上方添加。</p>
        </div>

        <!-- 默认回复编辑 -->
        <div class="kb-default-section" style="margin-top:24px">
          <h3>💬 默认回复（无匹配时显示）</h3>
          <textarea
            v-model="defaultReply"
            rows="3"
            class="form-textarea"
            placeholder="当用户问题无法匹配任何关键词时的默认回复..."
          ></textarea>
        </div>

        <div class="form-actions" style="margin-top:20px">
          <button class="btn btn-primary" @click="saveKnowledgeBase" :disabled="savingKB">
            {{ savingKB ? '保存中...' : '💾 保存全部修改' }}
          </button>
          <button class="btn btn-secondary" @click="resetKnowledgeBase">重置为默认</button>
          <button class="btn btn-secondary" @click="exportKnowledgeBase">📥 导出JSON</button>
        </div>

        <div class="kb-save-status" v-if="kbSaveStatus">
          {{ kbSaveStatus }}
        </div>
      </section>

      <!-- 知识源管理 -->
      <section v-if="activeTab === 'sources'" class="config-section">
        <h2>知识源管理</h2>
        <p class="section-desc">管理小智回答所依赖的知识库数据来源</p>

        <div class="form-group">
          <label>添加网页数据源 URL</label>
          <div class="add-url-row">
            <input
              v-model="newUrl"
              type="url"
              placeholder="https://example.com/article"
              class="form-input"
              @keydown.enter="addUrl"
            />
            <button class="btn btn-primary btn-sm" @click="addUrl" :disabled="!newUrl.trim()">
              添加
            </button>
          </div>
        </div>

        <div class="url-list" v-if="config.knowledgeUrls && config.knowledgeUrls.length > 0">
          <div v-for="(url, idx) in config.knowledgeUrls" :key="idx" class="url-item">
            <span class="url-index">{{ idx + 1 }}</span>
            <span class="url-text" :title="url">{{ url }}</span>
            <button class="btn-icon danger" @click="removeUrl(idx)">
              <el-icon><Delete /></el-icon>
            </button>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>暂无数据源，请添加 URL</p>
        </div>

        <div class="form-group" style="margin-top: 24px;">
          <label>上传文档</label>
          <div class="upload-area" @click="triggerUpload">
            <input
              type="file"
              ref="fileInput"
              @change="handleFileUpload"
              accept=".txt,.pdf,.doc,.docx,.md,.json"
              multiple
              style="display:none"
            />
            <el-icon :size="32"><Upload /></el-icon>
            <p>点击上传文档（支持 txt, pdf, doc, md, json）</p>
          </div>
          <div class="uploaded-files" v-if="config.uploadedFiles && config.uploadedFiles.length > 0">
            <div v-for="(file, idx) in config.uploadedFiles" :key="idx" class="file-item">
              <el-icon><Document /></el-icon>
              <span>{{ file.name }}</span>
              <button class="btn-icon danger" @click="removeFile(idx)">
                <el-icon><Delete /></el-icon>
              </button>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn btn-primary" @click="saveConfig">保存配置</button>
        </div>
      </section>

      <!-- 系统设置 -->
      <section v-if="activeTab === 'settings'" class="config-section">
        <h2>系统设置</h2>
        <p class="section-desc">小智机器人的全局系统参数</p>

        <div class="form-group">
          <label>机器人标题</label>
          <input v-model="config.botTitle" type="text" class="form-input" placeholder="小智" />
        </div>

        <div class="form-group">
          <label>副标题</label>
          <input v-model="config.botSubtitle" type="text" class="form-input" placeholder="360智见 · AI智能助手" />
        </div>

        <div class="form-group">
          <label>管理员密码</label>
          <div class="password-row">
            <input :type="showPassword ? 'text' : 'password'" v-model="config.adminPassword" class="form-input" />
            <button class="btn-icon" @click="showPassword = !showPassword">
              <el-icon><View v-if="!showPassword" /><Hide v-else /></el-icon>
            </button>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn btn-primary" @click="saveConfig">保存设置</button>
        </div>
      </section>

      <!-- 保存提示 -->
      <transition name="fade">
        <div v-if="saveSuccess" class="toast toast-success">✅ 配置已保存，刷新小智页面即可生效</div>
      </transition>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import {
  Setting, View, Upload, Document, Delete, SwitchButton, Hide, ChatDotRound, Files, Operation
} from '@element-plus/icons-vue'

const tabs = [
  { id: 'welcome', label: '欢迎语配置', icon: 'ChatDotRound' },
  { id: 'knowledge', label: '问答知识库', icon: 'Files' },
  { id: 'sources', label: '知识源管理', icon: 'Upload' },
  { id: 'settings', label: '系统设置', icon: 'Operation' }
]

const activeTab = ref('welcome')
const newUrl = ref('')
const fileInput = ref(null)
const showPreview = ref(true)
const showPassword = ref(false)
const saveSuccess = ref(false)

// 密码验证
const ADMIN_PASSWORD = 'xiaozhi360'
const authenticated = ref(false)
const passwordInput = ref('')
const passwordError = ref('')

// 配置
const defaultConfig = {
  welcomeMessage: '我是360智见AI智能助手小智，可以帮你解答GEO优化、品牌建设、AI搜索等相关问题。',
  quickQuestions: [
    '什么是GEO？',
    '如何提升品牌在AI搜索中的可见度？',
    '360智见有哪些核心功能？'
  ],
  knowledgeUrls: [],
  uploadedFiles: [],
  botTitle: '小智',
  botSubtitle: '360智见 · AI智能助手',
  adminPassword: ADMIN_PASSWORD
}

const config = reactive({ ...defaultConfig })

const quickQuestionsText = ref('')

// 计算属性
const quickQuestionsList = computed(() => {
  return quickQuestionsText.value
    .split('\n')
    .map(q => q.trim())
    .filter(q => q)
    .slice(0, 8)
})

function loadConfig() {
  const saved = localStorage.getItem('xiaozhi_config')
  if (saved) {
    try {
      const data = JSON.parse(saved)
      Object.assign(config, data)
    } catch { /* ignore */ }
  }
  quickQuestionsText.value = (config.quickQuestions || []).join('\n')
}

function saveConfig() {
  config.quickQuestions = quickQuestionsList.value
  localStorage.setItem('xiaozhi_config', JSON.stringify({ ...config }))
  showSaveSuccess()
}

function resetConfig() {
  Object.assign(config, defaultConfig)
  quickQuestionsText.value = defaultConfig.quickQuestions.join('\n')
}

function addUrl() {
  const url = newUrl.value.trim()
  if (!url) return
  if (!config.knowledgeUrls) config.knowledgeUrls = []
  if (!config.knowledgeUrls.includes(url)) {
    config.knowledgeUrls.push(url)
  }
  newUrl.value = ''
}

function removeUrl(idx) {
  config.knowledgeUrls.splice(idx, 1)
}

function triggerUpload() {
  fileInput.value?.click()
}

function handleFileUpload(e) {
  const files = e.target.files
  if (!files) return
  if (!config.uploadedFiles) config.uploadedFiles = []
  for (const file of files) {
    if (!config.uploadedFiles.find(f => f.name === file.name)) {
      config.uploadedFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
        addedAt: new Date().toISOString()
      })
    }
  }
}

function removeFile(idx) {
  config.uploadedFiles.splice(idx, 1)
}

function showSaveSuccess() {
  saveSuccess.value = true
  setTimeout(() => { saveSuccess.value = false }, 3000)
}

function checkPassword() {
  if (passwordInput.value === ADMIN_PASSWORD) {
    authenticated.value = true
    passwordError.value = ''
    loadConfig()
  } else {
    passwordError.value = '密码错误'
  }
}

// ========== 知识库管理 ==========
const qaPairs = ref([])
const defaultReply = ref('')
const newQA = reactive({ id: '', answer: '' })
const newKwInput = ref('')
const editingId = ref(null)
const editForm = reactive({ id: '', answer: '' })
const editKwInput = ref('')
const savingKB = ref(false)
const kbSaveStatus = ref('')

// 加载知识库（优先从 localStorage，其次从 API 获取默认）
async function loadKnowledgeBase() {
  // 1. 先检查本地是否有自定义版本
  const localKB = localStorage.getItem('xiaozhi_custom_kb')
  if (localKB) {
    try {
      const data = JSON.parse(localKB)
      qaPairs.value = data.qaPairs || []
      defaultReply.value = data.defaultReply || ''
      return
    } catch { /* ignore */ }
  }

  // 2. 从线上 API 获取当前部署的知识库
  try {
    const res = await fetch('/api/xiaozhi/admin/knowledge')
    if (res.ok) {
      const result = await res.json()
      if (result.data) {
        qaPairs.value = result.data.qaPairs || []
        defaultReply.value = result.data.defaultReply || ''
      }
    }
  } catch (err) {
    console.error('[Admin] Failed to load KB:', err)
  }
}

// 新增问答
function addQAPair() {
  if (!newQA.id.trim() || !newKwInput.value.trim() || !newQA.answer.trim()) return

  const keywords = newKwInput.value.split(/[,，]/).map(k => k.trim()).filter(k => k)

  // 检查ID重复
  if (qaPairs.value.some(p => p.id === newQA.id.trim())) {
    kbSaveStatus.value = '⚠️ ID 已存在，请使用不同的标识'
    setTimeout(() => { kbSaveStatus.value = '' }, 3000)
    return
  }

  qaPairs.value.push({
    id: newQA.id.trim(),
    keywords,
    answer: newQA.answer.trim()
  })

  // 清空输入
  newQA.id = ''
  newQA.answer = ''
  newKwInput.value = ''
  kbSaveStatus.value = '✅ 已添加（请点击保存按钮使修改生效）'
}

// 删除问答
function removeQAPair(idx) {
  if (confirm('确定删除这条问答吗？')) {
    qaPairs.value.splice(idx, 1)
    kbSaveStatus.value = '已删除（请保存）'
  }
}

// 开始编辑
function startEdit(pair) {
  editingId.value = pair.id
  editForm.id = pair.id
  editForm.answer = pair.answer
  editKwInput.value = pair.keywords.join('，')
}

// 保存编辑
function saveEdit() {
  const idx = qaPairs.value.findIndex(p => p.id === editForm.id)
  if (idx !== -1) {
    qaPairs.value[idx].answer = editForm.answer
    qaPairs.value[idx].keywords = editKwInput.value.split(/[,，]/).map(k => k.trim()).filter(k => k)
  }
  editingId.value = null
  kbSaveStatus.value = '✅ 已更新（请保存）'
}

// 取消编辑
function cancelEdit() {
  editingId.value = null
}

// 移动顺序
function moveQAPair(idx, direction) {
  const newIdx = idx + direction
  if (newIdx < 0 || newIdx >= qaPairs.value.length) return
  const temp = qaPairs.value[idx]
  qaPairs.value[idx] = qaPairs.value[newIdx]
  qaPairs.value[newIdx] = temp
}

// 保存到 localStorage + 同步到后端
async function saveKnowledgeBase() {
  savingKB.value = true
  kbSaveStatus.value = ''

  const kbData = {
    name: '360智见小智知识库',
    version: '1.0.0',
    description: '小智机器人后台管理的问答知识库',
    defaultReply: defaultReply.value,
    qaPairs: qaPairs.value,
    lastUpdated: new Date().toISOString()
  }

  // 1. 保存到 localStorage（立即生效）
  localStorage.setItem('xiaozhi_custom_kb', JSON.stringify(kbData))

  // 2. 尝试同步到后端
  try {
    const res = await fetch('/api/xiaozhi/admin/knowledge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        qaPairs: kbData.qaPairs,
        defaultReply: kbData.defaultReply
      })
    })

    if (res.ok) {
      kbSaveStatus.value = '✅ 知识库已保存！刷新聊天页面即可看到最新内容。'
    } else {
      kbSaveStatus.value = '✅ 本地已保存（云端同步失败，但不影响使用）'
    }
  } catch (err) {
    kbSaveStatus.value = '✅ 本地已保存！修改已在当前浏览器生效。'
  }

  savingKB.value = false
  setTimeout(() => { kbSaveStatus.value = '' }, 5000)
}

// 重置为默认
function resetKnowledgeBase() {
  if (!confirm('确定重置为默认知识库吗？所有自定义修改将丢失。')) return
  localStorage.removeItem('xiaozhi_custom_kb')
  loadKnowledgeBase()
  kbSaveStatus.value = '已重置为默认知识库'
}

// 导出 JSON
function exportKnowledgeBase() {
  const data = {
    defaultReply: defaultReply.value,
    qaPairs: qaPairs.value
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'xiaozhi-knowledge-base-' + new Date().toISOString().slice(0, 10) + '.json'
  a.click()
  URL.revokeObjectURL(url)
}

function handleLogout() {
  authenticated.value = false
  passwordInput.value = ''
  passwordError.value = ''
}

onMounted(() => {
  // 自动检测是否已认证
  const auth = sessionStorage.getItem('xiaozhi_admin_auth')
  if (auth === 'true') {
    authenticated.value = true
    loadConfig()
    loadKnowledgeBase()
  }
})

watch(authenticated, (val) => {
  sessionStorage.setItem('xiaozhi_admin_auth', val ? 'true' : 'false')
})
</script>

<style scoped>
.xiaozhi-admin {
  display: flex;
  height: 100vh;
  height: 100dvh;
  background: #F5F7FA;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* ===== 侧边栏 ===== */
.admin-sidebar {
  width: 220px;
  background: #fff;
  border-right: 1px solid #E8ECF1;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding-top: env(safe-area-inset-top);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  border-bottom: 1px solid #E8ECF1;
}

.brand-icon {
  width: 36px;
  height: 36px;
}

.brand-icon svg { width: 100%; height: 100%; }

.brand-name {
  font-size: 14px;
  font-weight: 600;
  color: #1D2129;
  display: block;
}

.brand-sub {
  font-size: 11px;
  color: #86909C;
}

.sidebar-nav {
  flex: 1;
  padding: 12px 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-size: 13px;
  color: #4E5969;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  margin-bottom: 2px;
}

.nav-item:hover { background: #F5F7FA; color: #165DFF; }

.nav-item.active {
  background: rgba(22, 93, 255, 0.08);
  color: #165DFF;
  font-weight: 500;
}

.sidebar-footer {
  padding: 12px 16px;
  border-top: 1px solid #E8ECF1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #165DFF;
  text-decoration: none;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 0;
  border: none;
  background: none;
  font-size: 12px;
  color: #86909C;
  cursor: pointer;
}

.logout-btn:hover { color: #F53F3F; }

/* ===== 主内容 ===== */
.admin-main {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  padding-top: max(32px, env(safe-area-inset-top));
}

.config-section {
  max-width: 640px;
}

.config-section h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1D2129;
  margin: 0 0 4px;
}

.section-desc {
  font-size: 13px;
  color: #86909C;
  margin: 0 0 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #4E5969;
  margin-bottom: 6px;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  color: #1D2129;
  background: #fff;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
  box-sizing: border-box;
}

.form-input:focus, .form-textarea:focus {
  border-color: #165DFF;
  box-shadow: 0 0 0 2px rgba(22, 93, 255, 0.1);
}

.form-textarea {
  resize: vertical;
}

/* 按钮 */
.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-primary {
  background: #165DFF;
  color: #fff;
}

.btn-primary:hover { background: #0F4CD0; }
.btn-primary:disabled { background: #B0C4F5; cursor: not-allowed; }

.btn-secondary {
  background: #F5F7FA;
  color: #4E5969;
  border: 1px solid #E5E7EB;
}

.btn-secondary:hover { background: #E8ECF1; }

.btn-sm {
  padding: 8px 16px;
  font-size: 13px;
}

.btn-icon {
  border: none;
  background: none;
  cursor: pointer;
  color: #86909C;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.btn-icon:hover { background: #F5F7FA; }

.btn-icon.danger:hover { color: #F53F3F; background: rgba(245, 63, 63, 0.06); }

/* URL 列表 */
.add-url-row {
  display: flex;
  gap: 8px;
}

.add-url-row .form-input { flex: 1; }

.url-list {
  margin-top: 12px;
}

.url-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  margin-bottom: 6px;
}

.url-index {
  font-size: 12px;
  color: #C9CDD4;
  min-width: 20px;
}

.url-text {
  flex: 1;
  font-size: 13px;
  color: #4E5969;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 上传区域 */
.upload-area {
  border: 2px dashed #E5E7EB;
  border-radius: 10px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #86909C;
  font-size: 13px;
}

.upload-area:hover {
  border-color: #165DFF;
  background: rgba(22, 93, 255, 0.03);
}

.uploaded-files {
  margin-top: 12px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  margin-bottom: 4px;
  font-size: 13px;
  color: #4E5969;
}

/* 预览卡片 */
.preview-card {
  margin-top: 24px;
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  padding: 20px;
}

.preview-card h3 {
  font-size: 14px;
  color: #86909C;
  margin: 0 0 12px;
}

.preview-box {
  background: #F5F7FA;
  border-radius: 8px;
  padding: 16px;
}

.preview-welcome {
  font-size: 14px;
  color: #4E5969;
  margin: 0 0 12px;
}

.preview-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.preview-tag {
  padding: 4px 12px;
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 14px;
  font-size: 12px;
  color: #4E5969;
}

/* 密码 */
.password-row {
  display: flex;
  gap: 4px;
}

.password-row .form-input { flex: 1; }

.empty-state {
  text-align: center;
  padding: 32px;
  color: #C9CDD4;
  font-size: 13px;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background: #00B42A;
  color: #fff;
  border-radius: 8px;
  font-size: 13px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 180, 42, 0.3);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* 登录遮罩 */
.login-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.login-box {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  width: 320px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
}

.login-box h2 {
  font-size: 18px;
  margin: 0 0 4px;
}

.login-box p {
  font-size: 13px;
  color: #86909C;
  margin: 0 0 20px;
}

.login-box input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  margin-bottom: 12px;
  box-sizing: border-box;
}

.login-box .error {
  color: #F53F3F;
  font-size: 12px;
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .xiaozhi-admin {
    flex-direction: column;
  }

  .admin-sidebar {
    width: 100%;
    flex-direction: row;
    padding: 8px;
    border-right: none;
    border-bottom: 1px solid #E8ECF1;
    overflow-x: auto;
  }

  .sidebar-brand { display: none; }
  .sidebar-footer { display: none; }

  .sidebar-nav {
    display: flex;
    flex-direction: row;
    gap: 4px;
    padding: 0;
  }

  .nav-item {
    white-space: nowrap;
    padding: 8px 14px;
  }

  .admin-main {
    padding: 20px;
  }
}

/* 登录遮罩 */
.login-overlay {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.login-box {
  background: #fff;
  border-radius: 16px;
  padding: 40px 32px;
  width: 360px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  text-align: center;
}

.login-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
}

.login-icon svg {
  width: 100%;
  height: 100%;
}

.login-box h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1D2129;
  margin: 0 0 4px;
}

.login-box p {
  font-size: 13px;
  color: #86909C;
  margin: 0 0 20px;
}

.login-box input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  letter-spacing: 2px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.login-box input:focus {
  border-color: #165DFF;
  box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.1);
}

.login-error {
  color: #F53F3F;
  font-size: 12px;
  margin: 8px 0 0;
}

.login-btn {
  width: 100%;
  margin-top: 16px;
}

/* ===== 知识库管理 ===== */
.kb-add-card {
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 24px;
}

.kb-add-card h3 {
  font-size: 15px;
  color: #1D2129;
  margin: 0 0 16px;
}

.kb-list {
  margin-top: 8px;
}

.kb-list h3 {
  font-size: 15px;
  color: #1D2129;
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.kb-hint {
  font-size: 12px;
  color: #86909C;
  font-weight: normal;
}

.kb-item {
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  margin-bottom: 8px;
  overflow: hidden;
  transition: all 0.2s;
}

.kb-item:hover { border-color: #c9cdd4; }
.kb-editing { border-color: #165DFF; box-shadow: 0 0 0 3px rgba(22,93,255,0.08); }

.kb-item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
}

.kb-idx {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #F5F7FA;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #86909C;
  flex-shrink: 0;
}

.kb-id {
  font-size: 13px;
  font-weight: 600;
  color: #165DFF;
  flex-shrink: 0;
}

.kb-kws {
  flex: 1;
  font-size: 12px;
  color: #4E5969;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.kb-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.kb-item:hover .kb-actions { opacity: 1; }

.kb-preview {
  padding: 0 12px 8px;
  font-size: 12px;
  color: #86909C;
  line-height: 1.6;
  border-top: 1px solid #f5f7fa;
}

.kb-edit-actions {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #f0f0f0;
  background: #fafbfc;
}

.kb-default-section {
  background: #fff;
  border: 1px dashed #c9cdd4;
  border-radius: 10px;
  padding: 16px;
}

.kb-default-section h3 {
  font-size: 14px;
  color: #4E5969;
  margin: 0 0 8px;
}

.kb-save-status {
  margin-top: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  text-align: center;
  animation: fadeIn 0.3s ease;
}

.kb-save-status:empty { display: none; }
</style>
