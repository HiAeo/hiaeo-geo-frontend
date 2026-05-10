<template>
  <div class="content-editor">
    <!-- 页面头部 -->
    <div class="editor-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1>内容编辑器</h1>
        <span class="badge" :class="currentType">{{ contentTypeLabel }}</span>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" @click="previewContent" :disabled="!generatedContent">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          预览
        </button>
        <button class="btn btn-primary" @click="saveContent" :disabled="saving || !generatedContent">
          <svg v-if="saving" class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          {{ saving ? '保存中...' : '保存' }}
        </button>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="editor-container">
      <!-- 左侧：配置面板 -->
      <div class="config-panel">
        <!-- 内容类型选择 -->
        <div class="panel-section type-section">
          <div class="section-header">
            <h3>选择内容类型</h3>
            <span class="section-hint">点击卡片切换</span>
          </div>
          <div class="content-type-grid">
            <button
              v-for="type in contentTypes"
              :key="type.value"
              class="type-card"
              :class="{ active: contentType === type.value }"
              @click="selectType(type.value)"
            >
              <span class="type-icon">{{ type.icon }}</span>
              <span class="type-label">{{ type.label }}</span>
              <span class="type-desc">{{ type.desc }}</span>
            </button>
          </div>
        </div>

        <!-- 动态表单 -->
        <div class="panel-section form-section" v-if="currentTypeConfig">
          <div class="section-header">
            <h3>{{ currentTypeConfig.title }}</h3>
          </div>
          <div class="form-grid">
            <div class="form-group" v-for="field in currentTypeConfig.fields" :key="field?.key" v-if="field">
              <label :for="field.key">
                {{ field.label }}
                <span class="required" v-if="field.required">*</span>
              </label>
              <input
                v-if="field.type !== 'textarea'"
                v-model="formData[field.key]"
                :id="field.key"
                :type="field.type || 'text'"
                :placeholder="field.placeholder"
                :class="{ 'error': fieldErrors[field.key] }"
              />
              <textarea
                v-else
                v-model="formData[field.key]"
                :id="field.key"
                :rows="field.rows || 3"
                :placeholder="field.placeholder"
                :class="{ 'error': fieldErrors[field.key] }"
              ></textarea>
              <span class="field-error" v-if="fieldErrors[field.key]">{{ fieldErrors[field.key] }}</span>
            </div>
          </div>
          <!-- 字数控制滑块 -->
          <div class="form-group range-group" v-if="contentType === 'seo_article'">
            <label>目标字数</label>
            <div class="range-wrapper">
              <input
                v-model.number="formData.targetWordCount"
                type="range"
                min="500"
                max="3000"
                step="100"
              />
              <div class="range-info">
                <span class="range-value">{{ formData.targetWordCount }} 字</span>
                <span class="range-hint">约 {{ Math.round(formData.targetWordCount / 400) }} 分钟阅读</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 生成按钮 -->
        <div class="panel-section generate-section">
          <button 
            class="btn btn-generate" 
            @click="generateContent" 
            :disabled="generating || !canGenerate"
          >
            <svg v-if="generating" class="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/>
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            {{ generating ? 'AI生成中，请稍候...' : '✨ AI生成内容' }}
          </button>
          <p class="generate-hint" v-if="!generating">
            <span class="hint-icon">💡</span>
            基于您输入的信息，AI将自动生成高质量内容
          </p>
          <p class="generate-hint generating" v-else>
            <span class="loading-dots">
              <span></span><span></span><span></span>
            </span>
            正在调用AI引擎生成内容...
          </p>
        </div>
      </div>

      <!-- 右侧：内容预览 -->
      <div class="preview-panel">
        <div class="preview-header">
          <div class="preview-title">
            <span>内容预览</span>
            <span class="preview-tips" v-if="!generatedContent">生成后在此预览</span>
          </div>
          <div class="preview-actions">
            <button class="action-btn" @click="copyContent" :disabled="!generatedContent" title="复制内容">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              <span>复制</span>
            </button>
            <button class="action-btn" @click="downloadContent" :disabled="!generatedContent" title="下载内容">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>下载</span>
            </button>
          </div>
        </div>
        
        <!-- 内容预览区 -->
        <div class="preview-content" v-if="generatedContent">
          <div class="content-meta">
            <div class="meta-row">
              <span class="meta-label">标题</span>
              <span class="meta-value title-value">{{ generatedContent.title || '未生成' }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">字数</span>
              <span class="meta-value">{{ generatedContent.wordCount || '-' }}</span>
              <span class="meta-label" v-if="generatedContent.readingTime">阅读时间</span>
              <span class="meta-value" v-if="generatedContent.readingTime">{{ generatedContent.readingTime }} 分钟</span>
            </div>
          </div>
          
          <div class="content-body markdown-body" v-html="renderedContent"></div>
          
          <div class="content-footer" v-if="generatedContent.keywords?.length">
            <div class="keywords-section">
              <span class="keywords-label">📌 推荐关键词</span>
              <div class="keywords-list">
                <span v-for="kw in generatedContent.keywords" :key="kw" class="keyword-tag">{{ kw }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div class="preview-empty" v-else>
          <div class="empty-illustration">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="50" fill="#f0f4ff" stroke="#d1d5db" stroke-width="2" stroke-dasharray="8 4"/>
              <rect x="35" y="35" width="50" height="50" rx="8" fill="white" stroke="#d1d5db" stroke-width="2"/>
              <line x1="42" y1="48" x2="78" y2="48" stroke="#d1d5db" stroke-width="2" stroke-linecap="round"/>
              <line x1="42" y1="58" x2="70" y2="58" stroke="#d1d5db" stroke-width="2" stroke-linecap="round"/>
              <line x1="42" y1="68" x2="62" y2="68" stroke="#d1d5db" stroke-width="2" stroke-linecap="round"/>
              <circle cx="85" cy="75" r="15" fill="#3b82f6" opacity="0.1"/>
              <path d="M80 75h10M85 70v10" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h3 class="empty-title">内容编辑器</h3>
          <p class="empty-desc">配置内容参数后，点击"AI生成内容"按钮</p>
          <p class="empty-hint">生成的内容将实时显示在这里</p>
          <div class="empty-features">
            <span class="feature-tag">✓ SEO优化</span>
            <span class="feature-tag">✓ 自动生成</span>
            <span class="feature-tag">✓ 一键导出</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast 提示 -->
    <Transition name="toast">
      <div class="toast" :class="toast.type" v-if="toast.show">
        <span class="toast-icon">{{ toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ' }}</span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </Transition>

    <!-- 预览弹窗 -->
    <Transition name="modal">
      <div class="modal-overlay" v-if="showPreview" @click="showPreview = false">
        <div class="modal-content preview-modal" @click.stop>
          <div class="modal-header">
            <div class="modal-title">
              <span>📄 内容预览</span>
              <span class="modal-subtitle" v-if="generatedContent?.title">{{ generatedContent.title }}</span>
            </div>
            <div class="modal-actions">
              <button class="modal-action-btn" @click="copyContent">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                复制
              </button>
              <button class="close-btn" @click="showPreview = false">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="modal-body markdown-body" v-html="renderedContent"></div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 状态
const contentType = ref('seo_article')
const generating = ref(false)
const saving = ref(false)
const showPreview = ref(false)
const generatedContent = ref(null)

// 表单数据
const formData = ref({
  brandName: '',
  keyword: '',
  longTailKeywords: '',
  targetWordCount: 1500,
  brandInfo: '',
  competitors: ''
})

// 表单错误
const fieldErrors = ref({})

// Toast 提示
const toast = ref({
  show: false,
  type: 'info',
  message: ''
})

function showToast(type, message) {
  toast.value = { show: true, type, message }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// 内容类型配置
const contentTypes = [
  { value: 'seo_article', label: 'SEO文章', icon: '📝', desc: '搜索引擎优化文章' },
  { value: 'faq', label: 'FAQ问答', icon: '❓', desc: '常见问题解答' },
  { value: 'json_ld', label: 'JSON-LD', icon: '📋', desc: '结构化数据代码' },
  { value: 'product_description', label: '产品描述', icon: '🏷️', desc: '营销型产品文案' }
]

const contentTypeConfig = computed(() => {
  const configs = {
    seo_article: {
      title: 'SEO文章配置',
      fields: [
        { label: '品牌名称', key: 'brandName', placeholder: '输入品牌名称', required: true },
        { label: '核心关键词', key: 'keyword', placeholder: '输入SEO关键词', required: true },
        { label: '长尾关键词', key: 'longTailKeywords', placeholder: '输入长尾关键词（逗号分隔）', required: false }
      ]
    },
    faq: {
      title: 'FAQ配置',
      fields: [
        { label: '品牌/产品名称', key: 'brandName', placeholder: '输入名称', required: true },
        { label: 'FAQ类型', key: 'keyword', placeholder: 'product/service/brand', required: false },
        null
      ]
    },
    json_ld: {
      title: 'JSON-LD配置',
      fields: [
        { label: 'Schema类型', key: 'brandName', placeholder: 'Organization/Product/Article', required: true },
        { label: '名称', key: 'keyword', placeholder: '输入名称', required: true },
        null
      ]
    },
    product_description: {
      title: '产品描述配置',
      fields: [
        { label: '产品名称', key: 'brandName', placeholder: '输入产品名称', required: true },
        { label: '产品类别', key: 'keyword', placeholder: '输入产品类别', required: false },
        { label: '产品特点', key: 'longTailKeywords', placeholder: '特点1, 特点2, 特点3', required: false }
      ]
    }
  }
  return configs[contentType.value]
})

const contentTypeLabel = computed(() => {
  return contentTypes.find(t => t.value === contentType.value)?.label || ''
})

const currentType = computed(() => contentType.value)

const canGenerate = computed(() => {
  const d = formData.value
  if (contentType.value === 'seo_article') {
    return d.brandName && d.keyword
  }
  if (contentType.value === 'faq') {
    return d.brandName
  }
  if (contentType.value === 'product_description') {
    return d.brandName
  }
  return d.brandName || d.keyword
})

// 渲染Markdown内容
const renderedContent = computed(() => {
  if (!generatedContent.value) return ''
  const content = generatedContent.value.content || generatedContent.value.body || ''
  
  // 简单的Markdown解析
  return content
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
})

// 方法
function selectType(type) {
  contentType.value = type
  generatedContent.value = null
  fieldErrors.value = {}
  // 重置表单
  formData.value = {
    brandName: '',
    keyword: '',
    longTailKeywords: '',
    targetWordCount: 1500,
    brandInfo: '',
    competitors: ''
  }
}

function validateForm() {
  fieldErrors.value = {}
  const d = formData.value
  let isValid = true
  
  if (contentType.value === 'seo_article') {
    if (!d.brandName.trim()) {
      fieldErrors.value.brandName = '请输入品牌名称'
      isValid = false
    }
    if (!d.keyword.trim()) {
      fieldErrors.value.keyword = '请输入核心关键词'
      isValid = false
    }
  } else if (contentType.value === 'faq' || contentType.value === 'product_description') {
    if (!d.brandName.trim()) {
      fieldErrors.value.brandName = '请输入名称'
      isValid = false
    }
  }
  
  return isValid
}

async function generateContent() {
  if (!validateForm()) {
    showToast('error', '请填写必填项')
    return
  }
  
  generating.value = true
  try {
    const endpoints = {
      seo_article: '/content/generate/seo-article',
      faq: '/content/generate/faq',
      json_ld: '/content/generate/json-ld',
      product_description: '/content/generate/product-description'
    }

    let payload = {}
    if (contentType.value === 'seo_article') {
      payload = {
        brandName: formData.value.brandName,
        keyword: formData.value.keyword,
        longTailKeywords: formData.value.longTailKeywords,
        targetWordCount: formData.value.targetWordCount,
        brandInfo: formData.value.brandInfo,
        competitors: formData.value.competitors
      }
    } else if (contentType.value === 'faq') {
      payload = {
        name: formData.value.brandName,
        faqType: formData.value.keyword || 'general',
        questionCount: 10
      }
    } else if (contentType.value === 'product_description') {
      payload = {
        productName: formData.value.brandName,
        category: formData.value.keyword,
        features: formData.value.longTailKeywords,
        brandName: formData.value.brandInfo
      }
    }

    const token = localStorage.getItem('auth_token')
    if (!token) {
      showToast('error', '请先登录')
      router.push('/login')
      return
    }

    const response = await fetch(`/api${endpoints[contentType.value]}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      generatedContent.value = await response.json()
      showToast('success', '内容生成成功！')
    } else if (response.status === 401) {
      showToast('error', '登录已过期，请重新登录')
      localStorage.removeItem('auth_token')
      router.push('/login')
    } else {
      const error = await response.json()
      showToast('error', error.message || '生成失败，请重试')
    }
  } catch (error) {
    console.error('生成内容失败:', error)
    showToast('error', '网络错误，请检查连接后重试')
  } finally {
    generating.value = false
  }
}

async function saveContent() {
  if (!generatedContent.value) return
  
  saving.value = true
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      showToast('error', '请先登录')
      return
    }

    const payload = {
      title: generatedContent.value.title || formData.value.brandName + ' - ' + contentTypeLabel.value,
      body: generatedContent.value.content || generatedContent.value.body || JSON.stringify(generatedContent.value),
      type: contentType.value,
      tags: generatedContent.value.keywords?.join(',') || '',
      metaDescription: generatedContent.value.metaDescription || '',
      keywords: generatedContent.value.keywords?.join(',') || ''
    }

    const response = await fetch('/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      showToast('success', '内容保存成功！')
      setTimeout(() => {
        router.push('/app/publish')
      }, 1500)
    } else {
      const error = await response.json()
      showToast('error', error.message || '保存失败')
    }
  } catch (error) {
    console.error('保存内容失败:', error)
    showToast('error', '网络错误，请检查连接后重试')
  } finally {
    saving.value = false
  }
}

function previewContent() {
  showPreview.value = true
}

function copyContent() {
  if (!generatedContent.value) return
  const content = generatedContent.value.content || generatedContent.value.body || JSON.stringify(generatedContent.value, null, 2)
  navigator.clipboard.writeText(content).then(() => {
    showToast('success', '内容已复制到剪贴板')
  }).catch(() => {
    showToast('error', '复制失败')
  })
}

function downloadContent() {
  if (!generatedContent.value) return
  const content = generatedContent.value.content || generatedContent.value.body || JSON.stringify(generatedContent.value, null, 2)
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${formData.value.brandName || 'content'}_${Date.now()}.md`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  showToast('success', '文件下载开始')
}

function goBack() {
  router.back()
}
</script>

<style scoped>
/* 变量定义 */
:root {
  --primary: #3b82f6;
  --primary-dark: #2563eb;
  --primary-light: #eff6ff;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
  --radius: 12px;
  --radius-sm: 8px;
}

.content-editor {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--gray-50);
}

/* 页面头部 */
.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid var(--gray-200);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-left h1 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: var(--gray-800);
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: var(--gray-100);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;
  color: var(--gray-600);
}

.back-btn:hover {
  background: var(--gray-200);
  color: var(--gray-800);
}

.badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.badge.seo_article { background: #dbeafe; color: #1d4ed8; }
.badge.faq { background: #dcfce7; color: #16a34a; }
.badge.json_ld { background: #fef3c7; color: #d97706; }
.badge.product_description { background: #f3e8ff; color: #9333ea; }

.header-actions {
  display: flex;
  gap: 12px;
}

/* 按钮样式 */
.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
}

.btn-secondary {
  background: var(--gray-100);
  color: var(--gray-700);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--gray-200);
}

/* 编辑器容器 */
.editor-container {
  flex: 1;
  display: flex;
  gap: 24px;
  padding: 24px;
  overflow: hidden;
}

/* 配置面板 */
.config-panel {
  width: 420px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
}

.panel-section {
  background: white;
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-700);
  margin: 0;
}

.section-hint {
  font-size: 12px;
  color: var(--gray-400);
}

/* 内容类型卡片 */
.content-type-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.type-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 12px;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-sm);
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.type-card:hover {
  border-color: var(--primary);
  background: var(--primary-light);
}

.type-card.active {
  border-color: var(--primary);
  background: var(--primary-light);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.type-icon {
  font-size: 28px;
}

.type-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-700);
}

.type-desc {
  font-size: 11px;
  color: var(--gray-500);
}

/* 表单样式 */
.form-grid {
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
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-700);
}

.form-group .required {
  color: var(--error);
  margin-left: 2px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-sm);
  font-size: 14px;
  transition: all 0.2s;
  box-sizing: border-box;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input.error,
.form-group textarea.error {
  border-color: var(--error);
}

.form-group input.error:focus,
.form-group textarea.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.field-error {
  font-size: 12px;
  color: var(--error);
}

/* 滑块样式 */
.range-group {
  margin-top: 8px;
}

.range-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.range-wrapper input[type="range"] {
  width: 100%;
  -webkit-appearance: none;
  height: 6px;
  background: var(--gray-200);
  border-radius: 3px;
  cursor: pointer;
}

.range-wrapper input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: var(--primary);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: var(--shadow);
}

.range-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.range-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
}

.range-hint {
  font-size: 12px;
  color: var(--gray-500);
}

/* 生成按钮 */
.generate-section {
  text-align: center;
}

.btn-generate {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-generate:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.generate-hint {
  margin-top: 12px;
  font-size: 12px;
  color: var(--gray-400);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.hint-icon {
  font-size: 14px;
}

/* 预览面板 */
.preview-panel {
  flex: 1;
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--gray-200);
}

.preview-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  color: var(--gray-700);
}

.preview-tips {
  font-size: 12px;
  font-weight: 400;
  color: var(--gray-400);
}

.preview-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--gray-200);
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: var(--gray-600);
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-light);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 预览内容 */
.preview-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.content-meta {
  padding: 16px;
  background: var(--gray-50);
  border-radius: var(--radius-sm);
  margin-bottom: 20px;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.meta-row:last-child {
  margin-bottom: 0;
}

.meta-label {
  font-size: 12px;
  color: var(--gray-500);
  min-width: 50px;
}

.meta-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-700);
}

.title-value {
  flex: 1;
  font-size: 16px;
  color: var(--gray-800);
}

.content-body {
  font-size: 14px;
  line-height: 1.8;
  color: var(--gray-700);
}

.content-body :deep(h1) {
  font-size: 24px;
  font-weight: 600;
  margin: 20px 0 12px;
  color: var(--gray-800);
}

.content-body :deep(h2) {
  font-size: 20px;
  font-weight: 600;
  margin: 18px 0 10px;
  color: var(--gray-800);
}

.content-body :deep(h3) {
  font-size: 16px;
  font-weight: 600;
  margin: 14px 0 8px;
  color: var(--gray-700);
}

.content-body :deep(p) {
  margin: 12px 0;
}

.content-body :deep(strong) {
  color: var(--gray-800);
  font-weight: 600;
}

.content-body :deep(code) {
  background: var(--gray-100);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
}

.content-footer {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--gray-200);
}

.keywords-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.keywords-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-600);
}

.keywords-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword-tag {
  display: inline-block;
  padding: 4px 12px;
  background: var(--primary-light);
  border-radius: 16px;
  font-size: 12px;
  color: var(--primary);
  font-weight: 500;
}

/* 空状态 */
.preview-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.empty-illustration {
  margin-bottom: 24px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-700);
  margin: 0 0 8px;
}

.empty-desc {
  font-size: 14px;
  color: var(--gray-500);
  margin: 0 0 4px;
}

.empty-hint {
  font-size: 13px;
  color: var(--gray-400);
  margin: 0 0 20px;
}

.empty-features {
  display: flex;
  gap: 12px;
}

.feature-tag {
  padding: 6px 12px;
  background: var(--gray-100);
  border-radius: 16px;
  font-size: 12px;
  color: var(--gray-600);
}

/* Toast 提示 */
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background: var(--gray-800);
  color: white;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: var(--shadow-lg);
  z-index: 9999;
}

.toast.success {
  background: var(--success);
}

.toast.error {
  background: var(--error);
}

.toast-icon {
  font-size: 16px;
}

.toast-message {
  font-size: 14px;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.preview-modal {
  width: 90%;
  max-width: 800px;
  max-height: 85vh;
  background: white;
  border-radius: var(--radius);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--gray-200);
}

.modal-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modal-title > span:first-child {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
}

.modal-subtitle {
  font-size: 13px;
  color: var(--gray-500);
}

.modal-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--primary-light);
  border: none;
  border-radius: 6px;
  color: var(--primary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-action-btn:hover {
  background: var(--primary);
  color: white;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: var(--gray-100);
  border-radius: 6px;
  cursor: pointer;
  color: var(--gray-600);
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--gray-200);
  color: var(--gray-800);
}

.modal-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .preview-modal,
.modal-leave-to .preview-modal {
  transform: scale(0.95);
}

/* 加载动画 */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-dots {
  display: inline-flex;
  gap: 4px;
}

.loading-dots span {
  width: 6px;
  height: 6px;
  background: var(--primary);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* 响应式 */
@media (max-width: 1024px) {
  .editor-container {
    flex-direction: column;
  }
  
  .config-panel {
    width: 100%;
  }
  
  .preview-panel {
    min-height: 400px;
  }
}
</style>
