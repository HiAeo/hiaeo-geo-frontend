<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-container" :class="{ 'is-signup': mode === 'signup' }">
          
          <!-- Close button -->
          <button class="modal-close" @click="$emit('close')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <!-- Header -->
          <div class="modal-header">
            <div class="modal-logo">
              <img :src="theme === 'dark' ? '/logo-white.png' : '/logo-header.png'" alt="HiAeo" class="h-8 w-auto" />
            </div>
            <h2 class="modal-title">{{ mode === 'login' ? '欢迎回来' : '开启 GEO 之旅' }}</h2>
            <p class="modal-subtitle">{{ mode === 'login' ? '登录您的 HiAeo 账号' : '创建账号，免费开始诊断' }}</p>
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

          <!-- Login form -->
          <form v-if="mode === 'login'" @submit.prevent="handleLogin" class="modal-form">
            <div class="form-group">
              <label class="form-label">手机号 / 邮箱</label>
              <div class="input-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="input-icon">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input 
                  type="text" 
                  v-model="loginForm.account" 
                  placeholder="请输入手机号或邮箱"
                  class="form-input"
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

            <div class="divider">
              <span>或</span>
            </div>

            <button type="button" class="btn-sms" @click="smsMode = !smsMode">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
              {{ smsMode ? '密码登录' : '短信验证码登录' }}
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
          </form>

          <!-- Signup form -->
          <form v-else @submit.prevent="handleSignup" class="modal-form">
            <div class="form-group">
              <label class="form-label">手机号</label>
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
                  :disabled="smsCooldown > 0"
                  @click="sendSignupCode"
                >
                  {{ smsCooldown > 0 ? `${smsCooldown}s` : '获取验证码' }}
                </button>
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
                  placeholder="请设置密码（8位以上）"
                  class="form-input"
                  minlength="8"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="signupForm.agree" />
                <span class="checkbox-custom"></span>
                <span class="checkbox-text">
                  我已阅读并同意 <a href="#" class="form-link">《服务条款》</a> 和 <a href="#" class="form-link">《隐私政策》</a>
                </span>
              </label>
            </div>

            <button type="submit" class="btn-submit" :disabled="!signupForm.agree">
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.87c-.217-.01-.43-.012-.65-.012h.144z"/>
                </svg>
              </button>
              <button class="social-btn" title="企业微信">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  initialMode: {
    type: String,
    default: 'login' // 'login' | 'signup'
  },
  theme: {
    type: String,
    default: 'dark'
  }
})

const emit = defineEmits(['close', 'login', 'signup'])

const mode = ref(props.initialMode)
const smsMode = ref(false)
const loading = ref(false)
const smsCooldown = ref(0)

const loginForm = ref({
  account: '',
  password: ''
})

const smsForm = ref({
  phone: '',
  code: ''
})

const signupForm = ref({
  phone: '',
  code: '',
  password: '',
  agree: false
})

// Reset form when mode changes
watch(() => props.show, (newVal) => {
  if (newVal) {
    mode.value = props.initialMode
    smsMode.value = false
    smsCooldown.value = 0
    loginForm.value = { account: '', password: '' }
    smsForm.value = { phone: '', code: '' }
    signupForm.value = { phone: '', code: '', password: '', agree: false }
  }
})

// Prevent body scroll when modal is open
watch(() => props.show, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Handle ESC key
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

// Methods
const handleLogin = async () => {
  if (!loginForm.value.account || !loginForm.value.password) {
    return
  }
  loading.value = true
  // Simulate API call
  setTimeout(() => {
    loading.value = false
    emit('login', { ...loginForm.value })
    emit('close')
  }, 1500)
}

const handleSmsLogin = async () => {
  if (!smsForm.value.phone || !smsForm.value.code) {
    return
  }
  loading.value = true
  setTimeout(() => {
    loading.value = false
    emit('login', { phone: smsForm.value.phone, code: smsForm.value.code })
    emit('close')
  }, 1500)
}

const handleSignup = async () => {
  if (!signupForm.value.phone || !signupForm.value.code || !signupForm.value.password || !signupForm.value.agree) {
    return
  }
  loading.value = true
  setTimeout(() => {
    loading.value = false
    emit('signup', { ...signupForm.value })
    emit('close')
  }, 1500)
}

const sendSmsCode = () => {
  if (smsCooldown.value > 0) return
  smsCooldown.value = 60
  const timer = setInterval(() => {
    smsCooldown.value--
    if (smsCooldown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const sendSignupCode = () => {
  if (smsCooldown.value > 0) return
  smsCooldown.value = 60
  const timer = setInterval(() => {
    smsCooldown.value--
    if (smsCooldown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
}

.modal-container {
  position: relative;
  width: 100%;
  max-width: 420px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 40px 36px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: rgba(22, 93, 255, 0.15);
  border-color: rgba(22, 93, 255, 0.3);
  color: #165DFF;
}

.modal-header {
  text-align: center;
  margin-bottom: 28px;
}

.modal-logo {
  margin-bottom: 20px;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.modal-tabs {
  position: relative;
  display: flex;
  background: var(--bg-glass);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 28px;
}

.modal-tab {
  flex: 1;
  padding: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  z-index: 1;
}

.modal-tab.active {
  color: white;
}

.modal-tab-indicator {
  position: absolute;
  top: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: linear-gradient(135deg, #165DFF, #8B5CF6);
  border-radius: 10px;
  transition: left 0.3s ease;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-link {
  font-size: 0.75rem;
  color: #165DFF;
  text-decoration: none;
  transition: color 0.2s ease;
}

.form-link:hover {
  color: #0040ED;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  color: var(--text-tertiary);
  pointer-events: none;
}

.input-prefix {
  position: absolute;
  left: 14px;
  font-size: 0.875rem;
  color: var(--text-tertiary);
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 14px 14px 14px 44px;
  font-size: 0.875rem;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.form-input.has-prefix {
  padding-left: 56px;
}

.form-input::placeholder {
  color: var(--text-tertiary);
}

.form-input:focus {
  outline: none;
  border-color: #165DFF;
  box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.15);
}

.sms-input-wrapper .form-input {
  padding-right: 100px;
}

.btn-sms-code {
  position: absolute;
  right: 8px;
  padding: 8px 12px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #165DFF;
  background: rgba(22, 93, 255, 0.1);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-sms-code:hover:not(:disabled) {
  background: rgba(22, 93, 255, 0.2);
}

.btn-sms-code:disabled {
  color: var(--text-tertiary);
  cursor: not-allowed;
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
  width: 18px;
  height: 18px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  background: var(--bg-glass);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all 0.2s ease;
}

.checkbox-label input:checked + .checkbox-custom {
  background: #165DFF;
  border-color: #165DFF;
}

.checkbox-label input:checked + .checkbox-custom::after {
  content: '';
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-text {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  line-height: 1.5;
}

.btn-submit {
  width: 100%;
  padding: 14px;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #165DFF, #8B5CF6);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(22, 93, 255, 0.35);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.divider {
  display: flex;
  align-items: center;
  gap: 16px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-color);
}

.divider span {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.btn-sms {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-sms:hover {
  background: var(--bg-glass-hover);
  border-color: var(--border-color-hover);
}

.social-login {
  margin-top: 24px;
}

.social-divider {
  position: relative;
  text-align: center;
  margin-bottom: 20px;
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
  padding: 0 16px;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  background: var(--bg-card);
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.social-btn {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.social-btn:hover {
  background: rgba(22, 93, 255, 0.15);
  border-color: rgba(22, 93, 255, 0.3);
  color: #165DFF;
  transform: translateY(-2px);
}

/* Modal animation */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95) translateY(20px);
  opacity: 0;
}

/* Mobile */
@media (max-width: 480px) {
  .modal-container {
    padding: 32px 24px;
    border-radius: 20px;
  }
}
</style>
