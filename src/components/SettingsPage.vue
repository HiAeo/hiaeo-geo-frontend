<template>
  <div class="settings-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">ModelBuddy·会员账户管理</h1>
      </div>
    </div>

    <div class="settings-content">
      <!-- Account Settings -->
      <section class="settings-section">
        <h2 class="section-title">账户设置</h2>
        <div class="settings-card">
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">管理员邮箱</span>
              <span class="setting-value">{{ adminEmail }}</span>
            </div>
            <button class="setting-btn" @click="showChangePassword = true">修改密码</button>
          </div>
        </div>
      </section>

      <!-- Appearance -->
      <section class="settings-section">
        <h2 class="section-title">外观设置</h2>
        <div class="settings-card">
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">主题模式</span>
              <span class="setting-desc">选择后台界面的显示主题</span>
            </div>
            <div class="theme-toggle">
              <button 
                class="theme-btn" 
                :class="{ active: themeMode === 'dark' }"
                @click="themeMode = 'dark'"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
                深色
              </button>
              <button 
                class="theme-btn" 
                :class="{ active: themeMode === 'light' }"
                @click="themeMode = 'light'"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                </svg>
                浅色
              </button>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">跟随前台主题</span>
              <span class="setting-desc">进入后台时自动使用前台主题</span>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="syncTheme" />
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </section>

      <!-- Notifications -->
      <section class="settings-section">
        <h2 class="section-title">通知设置</h2>
        <div class="settings-card">
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">新用户注册通知</span>
              <span class="setting-desc">有新用户注册时发送邮件通知</span>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="notifyNewUser" />
              <span class="slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">大额积分变动通知</span>
              <span class="setting-desc">单次积分变动超过阈值时发送通知</span>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="notifyCredits" />
              <span class="slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">积分变动阈值</span>
              <span class="setting-desc">触发通知的最小积分变动量</span>
            </div>
            <div class="input-group">
              <input type="number" v-model.number="creditsThreshold" min="100" step="100" />
              <span class="input-suffix">积分</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Security -->
      <section class="settings-section">
        <h2 class="section-title">安全设置</h2>
        <div class="settings-card">
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">双因素认证</span>
              <span class="setting-desc">登录时需要手机验证码</span>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="twoFactor" />
              <span class="slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">会话超时</span>
              <span class="setting-desc">无操作后自动退出登录</span>
            </div>
            <select v-model="sessionTimeout">
              <option value="30">30 分钟</option>
              <option value="60">1 小时</option>
              <option value="120">2 小时</option>
              <option value="480">8 小时</option>
            </select>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">登录IP限制</span>
              <span class="setting-desc">只允许指定IP地址访问后台</span>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="ipRestriction" />
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </section>

      <!-- Data Management -->
      <section class="settings-section">
        <h2 class="section-title">数据管理</h2>
        <div class="settings-card">
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">数据备份</span>
              <span class="setting-desc">手动备份数据库和配置文件</span>
            </div>
            <button class="setting-btn primary" @click="handleBackup" :disabled="backingUp">
              {{ backingUp ? '备份中...' : '立即备份' }}
            </button>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">自动备份</span>
              <span class="setting-desc">每天自动备份数据</span>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="autoBackup" />
              <span class="slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">导出所有数据</span>
              <span class="setting-desc">下载完整的数据备份文件</span>
            </div>
            <button class="setting-btn" @click="handleExport">导出数据</button>
          </div>
        </div>
      </section>

      <!-- About -->
      <section class="settings-section">
        <h2 class="section-title">关于</h2>
        <div class="settings-card">
          <div class="about-info">
            <div class="about-item">
              <span class="about-label">产品名称</span>
              <span class="about-value">ModelBuddy GEO Admin</span>
            </div>
            <div class="about-item">
              <span class="about-label">版本号</span>
              <span class="about-value">v1.0.0</span>
            </div>
            <div class="about-item">
              <span class="about-label">构建时间</span>
              <span class="about-value">2026-05-08</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Save Button -->
      <div class="settings-footer">
        <button class="save-btn" @click="saveSettings" :disabled="saving">
          {{ saving ? '保存中...' : '保存设置' }}
        </button>
      </div>
    </div>

    <!-- Change Password Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showChangePassword" class="modal-overlay" @click.self="showChangePassword = false">
          <div class="modal-container">
            <button class="modal-close" @click="showChangePassword = false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <div class="modal-header">
              <h2>修改密码</h2>
            </div>

            <form class="edit-form" @submit.prevent="handleChangePassword">
              <div class="form-group">
                <label>当前密码</label>
                <input type="password" v-model="passwordForm.old" placeholder="请输入当前密码" />
              </div>

              <div class="form-group">
                <label>新密码</label>
                <input type="password" v-model="passwordForm.new" placeholder="请输入新密码" />
              </div>

              <div class="form-group">
                <label>确认新密码</label>
                <input type="password" v-model="passwordForm.confirm" placeholder="请再次输入新密码" />
              </div>

              <div class="form-actions">
                <button type="button" class="btn-secondary" @click="showChangePassword = false">取消</button>
                <button type="submit" class="btn-primary" :disabled="changing">确认修改</button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  theme: { type: String, default: 'dark' }
})

const emit = defineEmits(['toggle-theme'])

const adminEmail = 'admin@hiaeo.com'
const themeMode = ref('dark')
const syncTheme = ref(true)
const notifyNewUser = ref(true)
const notifyCredits = ref(true)
const creditsThreshold = ref(1000)
const twoFactor = ref(false)
const sessionTimeout = ref('60')
const ipRestriction = ref(false)
const autoBackup = ref(true)
const saving = ref(false)
const backingUp = ref(false)
const showChangePassword = ref(false)
const changing = ref(false)

const passwordForm = reactive({
  old: '',
  new: '',
  confirm: ''
})

const saveSettings = async () => {
  saving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    alert('设置已保存')
  } catch (error) {
    alert('保存失败')
  } finally {
    saving.value = false
  }
}

const handleChangePassword = async () => {
  if (passwordForm.new !== passwordForm.confirm) {
    alert('两次输入的密码不一致')
    return
  }
  if (passwordForm.new.length < 6) {
    alert('密码长度不能少于6位')
    return
  }
  
  changing.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    alert('密码修改成功')
    showChangePassword.value = false
    passwordForm.old = ''
    passwordForm.new = ''
    passwordForm.confirm = ''
  } catch (error) {
    alert('修改失败')
  } finally {
    changing.value = false
  }
}

const handleBackup = async () => {
  backingUp.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    alert('备份完成！备份文件已下载。')
  } catch (error) {
    alert('备份失败')
  } finally {
    backingUp.value = false
  }
}

const handleExport = () => {
  alert('正在导出数据，请稍候...')
}
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  padding-bottom: 40px;
  background: var(--bg-primary);
}

.page-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  padding: 16px 24px;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 700;
}

.settings-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.settings-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

.settings-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.setting-label {
  font-size: 0.9375rem;
  font-weight: 500;
}

.setting-value {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.setting-desc {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
}

.setting-btn {
  padding: 8px 16px;
  font-size: 0.8125rem;
  font-weight: 500;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.setting-btn:hover:not(:disabled) {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.setting-btn.primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.setting-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Theme Toggle */
.theme-toggle {
  display: flex;
  gap: 8px;
  background: var(--bg-primary);
  padding: 4px;
  border-radius: 10px;
}

.theme-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 0.8125rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-btn.active {
  background: var(--color-primary);
  color: white;
}

/* Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 13px;
  transition: 0.3s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background: var(--text-tertiary);
  border-radius: 50%;
  transition: 0.3s;
}

input:checked + .slider {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

input:checked + .slider:before {
  transform: translateX(22px);
  background: white;
}

/* Input Group */
.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-group input {
  width: 100px;
  padding: 8px 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.input-group input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.input-suffix {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

select {
  padding: 8px 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
}

select:focus {
  outline: none;
  border-color: var(--color-primary);
}

/* About */
.about-info {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.about-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.about-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.about-value {
  font-size: 0.875rem;
  font-weight: 500;
}

/* Footer */
.settings-footer {
  padding-top: 24px;
}

.save-btn {
  width: 100%;
  padding: 14px;
  font-size: 0.9375rem;
  font-weight: 600;
  background: var(--color-primary);
  border: none;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-btn:hover:not(:disabled) {
  background: var(--color-primary-hover, #4f46e5);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 60px 20px;
  z-index: 1000;
  overflow-y: auto;
}

.modal-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.modal-header {
  margin-bottom: 20px;
}

.modal-header h2 {
  font-size: 1.125rem;
  font-weight: 600;
  padding-right: 40px;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-group input {
  padding: 10px 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 0.9375rem;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--color-primary);
  border: none;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-hover, #4f46e5);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: var(--bg-elevated);
  border-color: var(--color-primary);
}

/* Modal Animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: translateY(-20px) scale(0.98);
  opacity: 0;
}
</style>
