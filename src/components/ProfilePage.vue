<template>
  <div class="profile-page" :data-theme="theme">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <button class="back-btn" @click="$emit('back')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
        </button>
        <h1 class="page-title">个人中心</h1>
        <button class="logout-btn" @click="handleLogout">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Profile Card -->
    <div class="profile-card">
      <div class="avatar-section">
        <div class="avatar-wrapper">
          <div class="avatar" :style="avatarStyle">
            {{ userInitial }}
          </div>
          <button class="avatar-edit-btn" @click="showEditAvatar = true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </button>
        </div>
        <div class="user-info">
          <h2 class="user-name">{{ profile.nickname || profile.email?.split('@')[0] || '用户' }}</h2>
          <p class="user-email">{{ profile.email }}</p>
        </div>
      </div>
    </div>

    <!-- Profile Form -->
    <div class="form-section">
      <h3 class="section-title">基本信息</h3>
      
      <div class="form-card">
        <div class="form-group">
          <label class="form-label">邮箱</label>
          <div class="form-input-wrapper">
            <input 
              type="email" 
              v-model="formData.email" 
              class="form-input"
              disabled
            />
          </div>
          <p class="form-hint">邮箱用于登录，不可修改</p>
        </div>

        <div class="form-group">
          <label class="form-label">昵称</label>
          <div class="form-input-wrapper">
            <input 
              type="text" 
              v-model="formData.nickname" 
              class="form-input"
              placeholder="请输入昵称"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">公司/组织</label>
          <div class="form-input-wrapper">
            <input 
              type="text" 
              v-model="formData.company" 
              class="form-input"
              placeholder="请输入公司/组织名称"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">行业</label>
          <div class="form-input-wrapper">
            <input 
              type="text" 
              v-model="formData.industry" 
              class="form-input"
              placeholder="请输入所在行业"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">网站</label>
          <div class="form-input-wrapper">
            <input 
              type="url" 
              v-model="formData.website" 
              class="form-input"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <button 
          class="btn-save" 
          :disabled="loading || !hasChanges"
          @click="handleSaveProfile"
        >
          <span v-if="loading" class="loading-spinner"></span>
          <span v-else>保存修改</span>
        </button>
      </div>
    </div>

    <!-- Password Section -->
    <div class="form-section">
      <h3 class="section-title">安全设置</h3>
      
      <div class="form-card">
        <div class="form-group">
          <label class="form-label">原密码</label>
          <div class="form-input-wrapper">
            <input 
              :type="showOldPassword ? 'text' : 'password'" 
              v-model="passwordData.oldPassword" 
              class="form-input"
              placeholder="请输入原密码"
            />
            <button class="password-toggle" @click="showOldPassword = !showOldPassword">
              <svg v-if="showOldPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">新密码</label>
          <div class="form-input-wrapper">
            <input 
              :type="showNewPassword ? 'text' : 'password'" 
              v-model="passwordData.newPassword" 
              class="form-input"
              placeholder="请输入新密码（6位以上）"
              minlength="6"
            />
            <button class="password-toggle" @click="showNewPassword = !showNewPassword">
              <svg v-if="showNewPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">确认新密码</label>
          <div class="form-input-wrapper">
            <input 
              :type="showConfirmPassword ? 'text' : 'password'" 
              v-model="passwordData.confirmPassword" 
              class="form-input"
              placeholder="请再次输入新密码"
            />
            <button class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
              <svg v-if="showConfirmPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
        </div>

        <button 
          class="btn-save btn-password" 
          :disabled="loading || !canChangePassword"
          @click="handleChangePassword"
        >
          <span v-if="loading" class="loading-spinner"></span>
          <span v-else>修改密码</span>
        </button>
      </div>
    </div>

    <!-- Account Section -->
    <div class="form-section">
      <h3 class="section-title">账户信息</h3>
      
      <div class="info-card">
        <div class="info-item">
          <span class="info-label">注册时间</span>
          <span class="info-value">{{ formatDate(profile.createdAt) }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">最后登录</span>
          <span class="info-value">{{ formatDate(profile.lastLoginAt) }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">账户 ID</span>
          <span class="info-value info-id">{{ profile.id }}</span>
        </div>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="form-section danger-zone">
      <h3 class="section-title">危险区域</h3>
      
      <div class="danger-card">
        <div class="danger-content">
          <h4>注销账户</h4>
          <p>注销后，所有数据将被永久删除，无法恢复</p>
        </div>
        <button class="btn-danger" @click="confirmDeleteAccount">
          注销账户
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useApi } from '../composables/useApi'
import { useTheme } from '../composables/useTheme'

// 使用全局主题状态
const { theme } = useTheme()

const props = defineProps({
  theme: {
    type: String,
    default: 'dark'
  }
})

const emit = defineEmits(['back', 'logout'])

const { getUserProfile, updateUserProfile, changePassword, logout, isAuthenticated } = useApi()

const loading = ref(false)
const showEditAvatar = ref(false)

// Password visibility toggles
const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Profile data
const profile = ref({
  email: '',
  nickname: '',
  avatar: null,
  company: '',
  industry: '',
  website: '',
  createdAt: null,
  lastLoginAt: null,
  id: ''
})

// Form data for profile editing
const formData = reactive({
  email: '',
  nickname: '',
  company: '',
  industry: '',
  website: ''
})

// Password change form
const passwordData = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Computed properties
const userInitial = computed(() => {
  const name = profile.value.nickname || profile.value.email || 'U'
  return name.charAt(0).toUpperCase()
})

const avatarStyle = computed(() => {
  if (profile.value.avatar) {
    return { backgroundImage: `url(${profile.value.avatar})` }
  }
  return {}
})

const hasChanges = computed(() => {
  return (
    formData.nickname !== profile.value.nickname ||
    formData.company !== profile.value.company ||
    formData.industry !== profile.value.industry ||
    formData.website !== profile.value.website
  )
})

const canChangePassword = computed(() => {
  return (
    passwordData.oldPassword.length >= 6 &&
    passwordData.newPassword.length >= 6 &&
    passwordData.newPassword === passwordData.confirmPassword
  )
})

// Methods
const loadProfile = async () => {
  try {
    const user = await getUserProfile()
    profile.value = user
    Object.assign(formData, {
      email: user.email || '',
      nickname: user.nickname || '',
      company: user.company || '',
      industry: user.industry || '',
      website: user.website || ''
    })
  } catch (error) {
    console.error('Failed to load profile:', error)
    alert('加载用户信息失败: ' + error.message)
  }
}

const handleSaveProfile = async () => {
  loading.value = true
  try {
    await updateUserProfile({
      nickname: formData.nickname,
      company: formData.company,
      industry: formData.industry,
      website: formData.website
    })
    profile.value = { ...profile.value, ...formData }
    alert('保存成功！')
  } catch (error) {
    console.error('Failed to save profile:', error)
    alert('保存失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

const handleChangePassword = async () => {
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }
  
  if (passwordData.newPassword.length < 6) {
    alert('新密码长度至少6位')
    return
  }

  loading.value = true
  try {
    await changePassword({
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword
    })
    alert('密码修改成功！')
    passwordData.oldPassword = ''
    passwordData.newPassword = ''
    passwordData.confirmPassword = ''
  } catch (error) {
    console.error('Failed to change password:', error)
    alert('修改密码失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  if (confirm('确定要退出登录吗？')) {
    await logout()
    emit('logout')
  }
}

const confirmDeleteAccount = () => {
  if (confirm('确定要注销账户吗？此操作不可恢复！')) {
    if (confirm('最后确认：所有数据将被永久删除，确定吗？')) {
      alert('注销功能开发中...')
    }
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Load profile on mount
onMounted(() => {
  if (isAuthenticated()) {
    loadProfile()
  }
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--bg-primary, #0a0a0f);
  color: var(--text-primary, #fff);
  padding-bottom: 40px;
}

/* Header */
.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-primary, #0a0a0f);
  border-bottom: 1px solid var(--border-color, rgba(255,255,255,0.1));
  padding: 16px 20px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 600px;
  margin: 0 auto;
}

.back-btn,
.logout-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-elevated, rgba(255,255,255,0.05));
  border: 1px solid var(--border-color, rgba(255,255,255,0.1));
  color: var(--text-primary, #fff);
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover,
.logout-btn:hover {
  background: var(--color-primary, #6366f1);
  border-color: var(--color-primary, #6366f1);
}

.page-title {
  font-size: 1.125rem;
  font-weight: 600;
}

/* Profile Card */
.profile-card {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px 20px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary, #6366f1), var(--color-secondary, #8b5cf6));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  background-size: cover;
  background-position: center;
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-primary, #6366f1);
  border: 2px solid var(--bg-primary, #0a0a0f);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.avatar-edit-btn:hover {
  background: var(--color-primary-hover, #4f46e5);
  transform: scale(1.1);
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.user-email {
  font-size: 0.875rem;
  color: var(--text-secondary, #9ca3af);
}

/* Form Section */
.form-section {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px 24px;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary, #9ca3af);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

.form-card {
  background: var(--bg-elevated, rgba(255,255,255,0.03));
  border: 1px solid var(--border-color, rgba(255,255,255,0.1));
  border-radius: 16px;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-of-type {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary, #9ca3af);
  margin-bottom: 8px;
}

.form-input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 0.9375rem;
  background: var(--bg-primary, #0a0a0f);
  border: 1px solid var(--border-color, rgba(255,255,255,0.1));
  border-radius: 10px;
  color: var(--text-primary, #fff);
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary, #6366f1);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-input::placeholder {
  color: var(--text-tertiary, #6b7280);
}

.form-hint {
  font-size: 0.75rem;
  color: var(--text-tertiary, #6b7280);
  margin-top: 6px;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-tertiary, #6b7280);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  color: var(--text-secondary, #9ca3af);
}

/* Buttons */
.btn-save {
  width: 100%;
  padding: 14px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: white;
  background: var(--color-primary, #6366f1);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  min-height: 48px;
}

.btn-save:hover:not(:disabled) {
  background: var(--color-primary-hover, #4f46e5);
  transform: translateY(-1px);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-password {
  background: transparent;
  border: 1px solid var(--border-color, rgba(255,255,255,0.1));
  color: var(--text-primary, #fff);
}

.btn-password:hover:not(:disabled) {
  background: var(--bg-elevated, rgba(255,255,255,0.05));
  border-color: var(--color-primary, #6366f1);
  transform: none;
}

/* Info Card */
.info-card {
  background: var(--bg-elevated, rgba(255,255,255,0.03));
  border: 1px solid var(--border-color, rgba(255,255,255,0.1));
  border-radius: 16px;
  padding: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color, rgba(255,255,255,0.05));
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 0.875rem;
  color: var(--text-secondary, #9ca3af);
}

.info-value {
  font-size: 0.875rem;
  color: var(--text-primary, #fff);
}

.info-id {
  font-family: monospace;
  font-size: 0.75rem;
  color: var(--text-tertiary, #6b7280);
}

/* Danger Zone */
.danger-zone .section-title {
  color: #ef4444;
}

.danger-card {
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.danger-content h4 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #ef4444;
  margin-bottom: 4px;
}

.danger-content p {
  font-size: 0.8125rem;
  color: var(--text-secondary, #9ca3af);
}

.btn-danger {
  padding: 10px 20px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #ef4444;
  background: transparent;
  border: 1px solid #ef4444;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-danger:hover {
  background: #ef4444;
  color: white;
}

/* Loading Spinner */
.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 480px) {
  .avatar-section {
    flex-direction: column;
    text-align: center;
  }
  
  .danger-card {
    flex-direction: column;
    text-align: center;
  }
  
  .btn-danger {
    width: 100%;
  }
}
</style>
