<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" :data-theme="theme" @click.self="$emit('close')">
        <div class="modal-container">

          <!-- Close button -->
          <button class="modal-close" @click="$emit('close')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <!-- Header -->
          <div class="modal-header">
            <h2 class="modal-title">{{ mode === 'login' ? '欢迎回来' : '开启 GEO 之旅' }}</h2>
            <p class="modal-subtitle">{{ mode === 'login' ? '登录您的 ModelBuddy 账号' : '创建账号，免费开始诊断' }}</p>
          </div>

          <!-- Tab switch -->
          <div class="modal-tabs">
            <button 
              class="modal-tab" 
              :class="{ active: mode === 'login' }"
              @click="mode = 'login'"
            >
              登录
            </button>
            <button 
              class="modal-tab" 
              :class="{ active: mode === 'signup' }"
              @click="mode = 'signup'"
            >
              注册
            </button>
            <div class="modal-tab-indicator" :style="{ left: mode === 'login' ? '4px' : '50%' }"></div>
          </div>

          <!-- Login form (password) -->
          <form v-if="mode === 'login' && !smsMode" @submit.prevent="handleLogin" class="modal-form">
            <div class="form-group">
              <label class="form-label">用户名 / 邮箱</label>
              <div class="input-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="input-icon">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  type="text"
                  v-model="loginForm.account"
                  placeholder="请输入用户名或邮箱"
                  class="form-input"
                  autocomplete="username"
                />
              </div>
            </div>

            <div class="form-group">
              <div class="form-label-row">
                <label class="form-label">密码</label>
                <a href="#" class="form-link">忘记密码？</a>
              </div>
              <div class="input-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="input-icon">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input 
                  type="password" 
                  v-model="loginForm.password" 
                  placeholder="请输入密码"
                  class="form-input"
                />
              </div>
            </div>

            <button type="submit" class="btn-submit">
              <span v-if="!loading">登录</span>
              <span v-else class="loading-spinner"></span>
            </button>

            <button type="button" class="btn-sms" @click="smsMode = true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
              短信验证码登录
            </button>
          </form>

          <!-- SMS login form -->
          <form v-else-if="mode === 'login' && smsMode" @submit.prevent="handleSmsLogin" class="modal-form">
            <div class="form-group">
              <label class="form-label">手机号</label>
              <div class="input-wrapper">
                <span class="input-prefix">+86</span>
                <input 
                  type="tel" 
                  v-model="smsForm.phone" 
                  placeholder="请输入手机号"
                  class="form-input has-prefix"
                  maxlength="11"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">验证码</label>
              <div class="input-wrapper sms-input-wrapper">
                <input 
                  type="text" 
                  v-model="smsForm.code" 
                  placeholder="请输入验证码"
                  class="form-input"
                  maxlength="6"
                />
                <button 
                  type="button" 
                  class="btn-sms-code" 
                  :disabled="smsCooldown > 0"
                  @click="sendSmsCode"
                >
                  {{ smsCooldown > 0 ? `${smsCooldown}s` : '获取验证码' }}
                </button>
              </div>
            </div>

            <button type="submit" class="btn-submit">
              <span v-if="!loading">登录</span>
              <span v-else class="loading-spinner"></span>
            </button>

            <button type="button" class="btn-sms" @click="smsMode = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              密码登录
            </button>
          </form>

          <!-- Signup form -->
          <form v-else @submit.prevent="handleSignup" class="modal-form">
            <div class="form-group">
              <label class="form-label">邮箱</label>
              <div class="input-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="input-icon">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input 
                  type="email" 
                  v-model="signupForm.email" 
                  placeholder="请输入邮箱"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">手机号（用于接收验证码）</label>
              <div class="input-wrapper">
                <span class="input-prefix">+86</span>
                <input 
                  type="tel" 
                  v-model="signupForm.phone" 
                  placeholder="请输入手机号"
                  class="form-input has-prefix"
                  maxlength="11"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">验证码</label>
              <div class="input-wrapper sms-input-wrapper">
                <input 
                  type="text" 
                  v-model="signupForm.code" 
                  placeholder="请输入验证码"
                  class="form-input"
                  maxlength="6"
                />
                <button 
                  type="button" 
                  class="btn-sms-code" 
                  :disabled="smsCooldown > 0 || !signupForm.phone"
                  @click="sendSignupCode"
                >
                  {{ smsCooldown > 0 ? `${smsCooldown}s` : '获取验证码' }}
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">昵称（选填）</label>
              <div class="input-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="input-icon">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input 
                  type="text" 
                  v-model="signupForm.nickname" 
                  placeholder="请输入昵称（选填）"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">设置密码</label>
              <div class="input-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="input-icon">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input 
                  type="password" 
                  v-model="signupForm.password" 
                  placeholder="请设置密码（6位以上）"
                  class="form-input"
                  minlength="6"
                />
              </div>
            </div>

            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="signupForm.agree" />
                <span class="checkbox-custom"></span>
                <span class="checkbox-text">
                  我已阅读并同意 <a href="#" class="form-link">《服务条款》</a> 和 <a href="#" class="form-link">《隐私政策》</a>
                </span>
              </label>
            </div>

            <button type="submit" class="btn-submit" :disabled="!signupForm.agree || !signupForm.code">
              <span v-if="!loading">注册</span>
              <span v-else class="loading-spinner"></span>
            </button>
          </form>

          <!-- Social login -->
          <div class="social-login">
            <div class="social-divider">
              <span>其他登录方式</span>
            </div>
            <div class="social-buttons">
              <button class="social-btn" title="微信登录">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.87c-.217-.01-.43-.012-.65-.012h.144z"/>
                </svg>
              </button>
              <button class="social-btn" title="企业微信">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.03 2 11c0 2.76 1.36 5.22 3.5 6.83V22l3.9-2.15c.82.23 1.69.35 2.6.35 5.52 0 10-4.03 10-9s-4.48-9-10-9z"/>
                </svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useApi } from '../composables/useApi'
import { useTheme } from '../composables/useTheme'

// 使用全局主题状态
const { theme } = useTheme()

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  initialMode: {
    type: String,
    default: 'login'
  }
})

const emit = defineEmits(['close', 'login', 'signup'])

const { loginWithPassword, register, sendLoginSmsCode, sendRegisterSmsCode } = useApi()

const mode = ref(props.initialMode)
const smsMode = ref(false)
const loading = ref(false)
const smsCooldown = ref(0)
const smsLoading = ref(false)

const loginForm = ref({
  account: '',
  password: ''
})

const smsForm = ref({
  phone: '',
  code: ''
})

const signupForm = ref({
  email: '',
  phone: '',
  code: '',
  nickname: '',
  password: '',
  agree: false
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    mode.value = props.initialMode
    smsMode.value = false
    smsCooldown.value = 0
    loginForm.value = { account: '', password: '' }
    smsForm.value = { phone: '', code: '' }
    signupForm.value = { email: '', phone: '', code: '', nickname: '', password: '', agree: false }
  }
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.show) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

const handleLogin = async () => {
  if (!loginForm.value.account || !loginForm.value.password) {
    alert('请填写完整信息')
    return
  }
  loading.value = true
  try {
    console.log('[LoginModal] 开始登录...')
    const result = await loginWithPassword({
      email: loginForm.value.account,
      password: loginForm.value.password
    })
    console.log('[LoginModal] 登录成功，准备 emit login 事件')
    emit('login', result)
    console.log('[LoginModal] emit login 完成，准备 emit close')
    emit('close')
    console.log('[LoginModal] emit close 完成')
  } catch (error) {
    console.error('[LoginModal] 登录失败:', error)
    alert('登录失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

const handleSmsLogin = async () => {
  if (!smsForm.value.phone || !smsForm.value.code) {
    alert('请填写完整信息')
    return
  }
  loading.value = true
  try {
    // 短信登录暂用模拟实现（后端未实现短信登录接口）
    emit('login', { phone: smsForm.value.phone, code: smsForm.value.code, isSms: true })
    emit('close')
  } catch (error) {
    console.error('登录失败:', error)
    alert('登录失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

const handleSignup = async () => {
  if (!signupForm.value.email || !signupForm.value.phone || !signupForm.value.code || !signupForm.value.password || !signupForm.value.agree) {
    alert('请填写完整信息')
    return
  }
  if (!signupForm.value.email.includes('@')) {
    alert('请输入有效的邮箱地址')
    return
  }
  if (!/^1[3-9]\d{9}$/.test(signupForm.value.phone)) {
    alert('请输入有效的手机号')
    return
  }
  if (signupForm.value.code !== '123456') {
    alert('验证码错误，开发环境固定验证码: 123456')
    return
  }
  if (signupForm.value.password.length < 6) {
    alert('密码长度至少6位')
    return
  }
  loading.value = true
  try {
    console.log('[LoginModal] 1. 开始注册...')
    // 注册
    const registerResult = await register({
      email: signupForm.value.email,
      phone: signupForm.value.phone,
      password: signupForm.value.password,
      nickname: signupForm.value.nickname || signupForm.value.email.split('@')[0]
    })
    console.log('[LoginModal] 2. 注册成功:', registerResult)
    
    // 构建用户数据
    const userData = {
      email: signupForm.value.email,
      nickname: signupForm.value.nickname || signupForm.value.email.split('@')[0],
      phone: signupForm.value.phone
    }
    
    // 触发登录事件并关闭弹窗
    // 注册成功后直接跳转，不需要再登录
    console.log('[LoginModal] 3. 触发 login 事件, userData:', userData)
    emit('login', {
      ...registerResult,
      user: registerResult.user || userData
    })
    console.log('[LoginModal] 4. emit login 完成，准备 emit close')
    emit('close')
    console.log('[LoginModal] 5. 完成')
  } catch (error) {
    console.error('[LoginModal] 注册失败:', error)
    alert('注册失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

const sendSmsCode = async () => {
  if (smsCooldown.value > 0 || !smsForm.value.phone) return
  
  smsLoading.value = true
  try {
    await sendLoginSmsCode(smsForm.value.phone)
    smsCooldown.value = 60
    startCooldown()
    alert('验证码已发送')
  } catch (error) {
    alert('发送失败: ' + error.message)
  } finally {
    smsLoading.value = false
  }
}

const sendSignupCode = async () => {
  if (smsCooldown.value > 0 || !signupForm.value.phone) return
  
  smsLoading.value = true
  try {
    await sendRegisterSmsCode(signupForm.value.phone)
    smsCooldown.value = 60
    startCooldown()
    alert('验证码已发送')
  } catch (error) {
    alert('发送失败: ' + error.message)
  } finally {
    smsLoading.value = false
  }
}

const startCooldown = () => {
  const timer = setInterval(() => {
    smsCooldown.value--
    if (smsCooldown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}
</script>

<style scoped>
/* Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 60px 20px 20px;
  z-index: 1000;
  overflow-y: auto;
}

/* Container */
.modal-container {
  position: relative;
  width: 100%;
  max-width: 380px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 32px 28px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
}

/* Close button */
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

/* Header */
.modal-header {
  text-align: center;
  margin-bottom: 24px;
}

.modal-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.modal-subtitle {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

/* Tabs */
.modal-tabs {
  position: relative;
  display: flex;
  background: var(--bg-elevated);
  border-radius: 10px;
  padding: 3px;
  margin-bottom: 24px;
}

.modal-tab {
  flex: 1;
  padding: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  z-index: 1;
}

.modal-tab.active {
  color: var(--text-primary);
}

.modal-tab-indicator {
  position: absolute;
  top: 3px;
  width: calc(50% - 3px);
  height: calc(100% - 6px);
  background: var(--bg-primary);
  border-radius: 7px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: left 0.25s ease;
}

/* Form */
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-link {
  font-size: 0.75rem;
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.form-link:hover {
  color: var(--color-primary-hover);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: var(--text-tertiary);
  pointer-events: none;
}

.input-prefix {
  position: absolute;
  left: 12px;
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  font-size: 0.875rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.form-input.has-prefix {
  padding-left: 52px;
}

.form-input::placeholder {
  color: var(--text-tertiary);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-alpha);
}

.sms-input-wrapper .form-input {
  padding-right: 90px;
}

.btn-sms-code {
  position: absolute;
  right: 6px;
  padding: 6px 10px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-primary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-sms-code:hover:not(:disabled) {
  color: var(--color-primary-hover);
}

.btn-sms-code:disabled {
  color: var(--text-tertiary);
  cursor: not-allowed;
}

/* Checkbox */
.checkbox-group {
  margin-top: -4px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
}

.checkbox-label input {
  display: none;
}

.checkbox-custom {
  width: 16px;
  height: 16px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all 0.2s ease;
}

.checkbox-label input:checked + .checkbox-custom {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.checkbox-label input:checked + .checkbox-custom::after {
  content: '';
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  margin-bottom: 2px;
}

.checkbox-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Submit button */
.btn-submit {
  width: 100%;
  padding: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  background: var(--color-primary);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  margin-top: 4px;
}

.btn-submit:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

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

/* SMS button */
.btn-sms {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-sms:hover {
  background: var(--bg-elevated);
  border-color: var(--border-color-hover);
}

/* Social login */
.social-login {
  margin-top: 20px;
}

.social-divider {
  position: relative;
  text-align: center;
  margin-bottom: 16px;
}

.social-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border-color);
}

.social-divider span {
  position: relative;
  padding: 0 12px;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  background: var(--bg-primary);
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.social-btn {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.social-btn:hover {
  background: var(--color-primary-alpha);
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-2px);
}

/* Modal animation */
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

/* Mobile */
@media (max-width: 480px) {
  .modal-overlay {
    padding: 40px 16px 16px;
    align-items: flex-start;
  }
  
  .modal-container {
    padding: 28px 20px;
    border-radius: 16px;
  }
}
</style>
