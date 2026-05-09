<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="contact-overlay" :data-theme="theme" @click.self="$emit('close')">
        <div class="contact-container">

          <!-- Close button -->
          <button class="contact-close" @click="$emit('close')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <!-- Header -->
          <div class="contact-header">
            <h2 class="contact-title">联系我们</h2>
            <p class="contact-subtitle">留下您的信息，我们将在24小时内与您联系</p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="contact-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">姓名 <span class="required">*</span></label>
                <input 
                  type="text" 
                  v-model="form.name" 
                  placeholder="请输入您的姓名"
                  class="form-input"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">公司</label>
                <input 
                  type="text" 
                  v-model="form.company" 
                  placeholder="请输入公司名称"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">手机号 <span class="required">*</span></label>
                <input 
                  type="tel" 
                  v-model="form.phone" 
                  placeholder="请输入手机号"
                  class="form-input"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">邮箱</label>
                <input 
                  type="email" 
                  v-model="form.email" 
                  placeholder="请输入邮箱"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">合作意向 <span class="required">*</span></label>
              <div class="intent-options">
                <button 
                  v-for="intent in intents" 
                  :key="intent.value"
                  type="button"
                  class="intent-btn"
                  :class="{ active: form.intent === intent.value }"
                  @click="form.intent = intent.value"
                >
                  {{ intent.label }}
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">留言</label>
              <textarea 
                v-model="form.message" 
                placeholder="请描述您的需求..."
                class="form-textarea"
                rows="4"
              ></textarea>
            </div>

            <button type="submit" class="btn-submit" :disabled="loading || !isFormValid">
              <span v-if="loading" class="loading-spinner"></span>
              <span v-else>提交咨询</span>
            </button>
          </form>

          <!-- Contact info -->
          <div class="contact-info">
            <div class="info-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>400-888-8888</span>
            </div>
            <div class="info-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>contact@modelbuddy.net</span>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useApi } from '../composables/useApi'
import { useTheme } from '../composables/useTheme'

// 使用全局主题状态
const { theme } = useTheme()

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

const { submitContactForm } = useApi()
const loading = ref(false)

const intents = [
  { label: '产品咨询', value: 'consult' },
  { label: '商务合作', value: 'business' },
  { label: '技术对接', value: 'tech' },
  { label: '定制服务', value: 'custom' },
]

const form = ref({
  name: '',
  company: '',
  phone: '',
  email: '',
  intent: '',
  message: ''
})

const isFormValid = computed(() => {
  return form.value.name && form.value.phone && form.value.intent
})

const handleSubmit = async () => {
  if (!isFormValid.value || loading.value) return
  
  loading.value = true
  try {
    // 调用真实的 API
    await submitContactForm({ ...form.value })
    // 通知父组件（用于统计或其他处理）
    emit('submit', { ...form.value })
    emit('close')
    // Reset form
    form.value = {
      name: '',
      company: '',
      phone: '',
      email: '',
      intent: '',
      message: ''
    }
  } catch (error) {
    console.error('提交失败:', error)
    alert('提交失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

// Prevent body scroll
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
</script>

<style scoped>
.contact-overlay {
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

.contact-container {
  position: relative;
  width: 100%;
  max-width: 520px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 32px 28px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
}

.contact-close {
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

.contact-close:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.contact-header {
  text-align: center;
  margin-bottom: 28px;
}

.contact-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.contact-subtitle {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.required {
  color: #EF4444;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 14px;
  font-size: 0.875rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--text-tertiary);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-alpha);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

/* Intent options */
.intent-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.intent-btn {
  padding: 8px 16px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.intent-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.intent-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

/* Submit button */
.btn-submit {
  width: 100%;
  padding: 14px;
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
  min-height: 48px;
  margin-top: 8px;
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

/* Contact info */
.contact-info {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.info-item svg {
  color: var(--text-tertiary);
}

/* Modal animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-active .contact-container,
.modal-leave-active .contact-container {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .contact-container,
.modal-leave-to .contact-container {
  transform: translateY(-20px) scale(0.98);
  opacity: 0;
}

/* Mobile */
@media (max-width: 480px) {
  .contact-overlay {
    padding: 40px 16px 16px;
  }
  
  .contact-container {
    padding: 28px 20px;
    border-radius: 16px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .contact-info {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
}
</style>
