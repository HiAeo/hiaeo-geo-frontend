<template>
  <div class="mofa-page">
    <!-- Header -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1>模法内容生成</h1>
          <p class="subtitle">AI驱动的SEO文章、FAQ、JSON-LD一键生成</p>
        </div>
        <div class="credits-info">
          <span class="credits-icon">⚡</span>
          <span>每次生成消耗 10 积分</span>
        </div>
      </div>
    </header>

    <!-- Tab Navigation -->
    <div class="tab-navigation">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['tab-btn', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <!-- Content Area -->
    <div class="content-area">
      <!-- SEO Article Generator -->
      <div v-if="activeTab === 'seo'" class="generator-panel">
        <div class="input-section">
          <h3>SEO文章生成</h3>
          <p class="section-desc">输入品牌信息，AI自动生成高质量SEO优化文章</p>
          
          <div class="form-grid">
            <div class="form-group">
              <label>品牌名称 <span class="required">*</span></label>
              <input 
                v-model="seoForm.brandName" 
                type="text" 
                placeholder="例如：华为、小米、Apple"
              />
            </div>
            <div class="form-group">
              <label>核心关键词 <span class="required">*</span></label>
              <input 
                v-model="seoForm.keyword" 
                type="text" 
                placeholder="例如：智能手机、笔记本电脑"
              />
            </div>
            <div class="form-group full-width">
              <label>长尾关键词（可选）</label>
              <input 
                v-model="seoForm.longTailKeywords" 
                type="text" 
                placeholder="用逗号分隔，例如：5G手机推荐,性价比高的手机"
              />
            </div>
            <div class="form-group">
              <label>目标字数</label>
              <select v-model="seoForm.targetWordCount">
                <option :value="800">800字（短文）</option>
                <option :value="1200">1200字（标准）</option>
                <option :value="1500">1500字（中等）</option>
                <option :value="2000">2000字（长文）</option>
                <option :value="3000">3000字（深度）</option>
              </select>
            </div>
            <div class="form-group">
              <label>竞争对手（可选）</label>
              <input 
                v-model="seoForm.competitors" 
                type="text" 
                placeholder="用逗号分隔"
              />
            </div>
            <div class="form-group full-width">
              <label>品牌介绍（可选）</label>
              <textarea 
                v-model="seoForm.brandInfo" 
                rows="3"
                placeholder="简要描述品牌特点、优势等..."
              ></textarea>
            </div>
          </div>

          <button 
            class="generate-btn primary"
            :disabled="!seoForm.brandName || !seoForm.keyword || generating"
            @click="generateSeoArticle"
          >
            <span v-if="generating" class="loading-spinner"></span>
            <span v-else>🚀 生成SEO文章</span>
          </button>
        </div>

        <!-- Generated Result -->
        <div v-if="seoResult" class="result-section">
          <div class="result-header">
            <h3>生成结果</h3>
            <div class="result-actions">
              <button class="action-btn" @click="copyToClipboard(seoResult.content)">
                📋 复制内容
              </button>
              <button class="action-btn" @click="downloadContent(seoResult.content, 'seo-article')">
                📥 下载文档
              </button>
            </div>
          </div>
          
          <div class="result-meta">
            <span class="meta-item">📝 {{ seoResult.wordCount }} 字</span>
            <span class="meta-item">⏱️ {{ seoResult.readingTime }} 分钟阅读</span>
            <span class="meta-item">🔑 {{ seoResult.keywords?.join(', ') }}</span>
          </div>

          <div class="result-content">
            <h2 class="article-title">{{ seoResult.title }}</h2>
            <p class="article-meta">{{ seoResult.metaDescription }}</p>
            <div class="article-body" v-html="formatMarkdown(seoResult.content)"></div>
          </div>
        </div>
      </div>

      <!-- FAQ Generator -->
      <div v-if="activeTab === 'faq'" class="generator-panel">
        <div class="input-section">
          <h3>FAQ问答生成</h3>
          <p class="section-desc">自动生成常见问题解答，提升页面SEO效果</p>
          
          <div class="form-grid">
            <div class="form-group">
              <label>名称 <span class="required">*</span></label>
              <input 
                v-model="faqForm.name" 
                type="text" 
                placeholder="品牌/产品/服务名称"
              />
            </div>
            <div class="form-group">
              <label>FAQ类型</label>
              <select v-model="faqForm.faqType">
                <option value="product">产品FAQ</option>
                <option value="service">服务FAQ</option>
                <option value="brand">品牌FAQ</option>
                <option value="general">通用FAQ</option>
              </select>
            </div>
            <div class="form-group">
              <label>问题数量</label>
              <select v-model="faqForm.questionCount">
                <option :value="5">5个问题</option>
                <option :value="8">8个问题</option>
                <option :value="10">10个问题（推荐）</option>
                <option :value="15">15个问题</option>
                <option :value="20">20个问题</option>
              </select>
            </div>
            <div class="form-group full-width">
              <label>目标用户（可选）</label>
              <input 
                v-model="faqForm.targetAudience" 
                type="text" 
                placeholder="例如：中小企业主、电商运营人员"
              />
            </div>
          </div>

          <button 
            class="generate-btn primary"
            :disabled="!faqForm.name || generating"
            @click="generateFaq"
          >
            <span v-if="generating" class="loading-spinner"></span>
            <span v-else>❓ 生成FAQ</span>
          </button>
        </div>

        <!-- Generated Result -->
        <div v-if="faqResult" class="result-section">
          <div class="result-header">
            <h3>生成结果</h3>
            <div class="result-actions">
              <button class="action-btn" @click="copyToClipboard(faqResult.faqs.map(f => f.question + '\n' + f.answer).join('\n\n'))">
                📋 复制问答
              </button>
              <button class="action-btn" @click="downloadContent(faqResult.jsonLd, 'faq-jsonld')">
                📥 下载JSON-LD
              </button>
            </div>
          </div>

          <div class="faq-list">
            <div v-for="(faq, index) in faqResult.faqs" :key="index" class="faq-item">
              <div class="faq-question">{{ index + 1 }}. {{ faq.question }}</div>
              <div class="faq-answer">{{ faq.answer }}</div>
            </div>
          </div>

          <div class="jsonld-preview">
            <h4>JSON-LD 代码（可直接嵌入网页）</h4>
            <pre><code>{{ faqResult.jsonLd }}</code></pre>
          </div>
        </div>
      </div>

      <!-- JSON-LD Generator -->
      <div v-if="activeTab === 'jsonld'" class="generator-panel">
        <div class="input-section">
          <h3>JSON-LD结构化数据</h3>
          <p class="section-desc">生成符合Google标准的结构化数据，提升搜索展示效果</p>
          
          <div class="form-grid">
            <div class="form-group">
              <label>Schema类型 <span class="required">*</span></label>
              <select v-model="jsonLdForm.schemaType">
                <option value="Organization">Organization（组织）</option>
                <option value="LocalBusiness">LocalBusiness（本地商家）</option>
                <option value="Product">Product（产品）</option>
                <option value="Article">Article（文章）</option>
                <option value="FAQPage">FAQPage（问答页）</option>
                <option value="BreadcrumbList">BreadcrumbList（面包屑）</option>
              </select>
            </div>
            <div class="form-group">
              <label>名称 <span class="required">*</span></label>
              <input 
                v-model="jsonLdForm.name" 
                type="text" 
                placeholder="组织/品牌/产品名称"
              />
            </div>
            <div class="form-group">
              <label>网站URL（可选）</label>
              <input 
                v-model="jsonLdForm.websiteUrl" 
                type="url" 
                placeholder="https://example.com"
              />
            </div>
            <div class="form-group">
              <label>Logo URL（可选）</label>
              <input 
                v-model="jsonLdForm.logoUrl" 
                type="url" 
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div class="form-group">
              <label>联系邮箱（可选）</label>
              <input 
                v-model="jsonLdForm.contactEmail" 
                type="email" 
                placeholder="contact@example.com"
              />
            </div>
            <div class="form-group full-width" v-if="jsonLdForm.schemaType === 'Product'">
              <label>产品描述</label>
              <textarea 
                v-model="jsonLdForm.description" 
                rows="3"
                placeholder="产品简短描述..."
              ></textarea>
            </div>
            <div class="form-group" v-if="jsonLdForm.schemaType === 'Product'">
              <label>产品价格</label>
              <input 
                v-model="jsonLdForm.price" 
                type="text" 
                placeholder="99.00"
              />
            </div>
          </div>

          <button 
            class="generate-btn primary"
            :disabled="!jsonLdForm.name || generating"
            @click="generateJsonLd"
          >
            <span v-if="generating" class="loading-spinner"></span>
            <span v-else>📊 生成JSON-LD</span>
          </button>
        </div>

        <!-- Generated Result -->
        <div v-if="jsonLdResult" class="result-section">
          <div class="result-header">
            <h3>生成结果</h3>
            <div class="result-actions">
              <button class="action-btn" @click="copyToClipboard(jsonLdResult.script)">
                📋 复制代码
              </button>
            </div>
          </div>

          <div class="jsonld-preview">
            <h4>{{ jsonLdResult.schemaType }} Schema</h4>
            <pre><code>{{ jsonLdResult.script }}</code></pre>
          </div>

          <div class="usage-tips">
            <h4>💡 使用说明</h4>
            <ol>
              <li>复制上方的JSON-LD代码</li>
              <li>粘贴到网页HTML的 <code>&lt;head&gt;</code> 或 <code>&lt;body&gt;</code> 标签内</li>
              <li>使用 <a href="https://search.google.com/test/rich-results" target="_blank">Google Rich Results Test</a> 验证</li>
            </ol>
          </div>
        </div>
      </div>

      <!-- Product Description Generator -->
      <div v-if="activeTab === 'product'" class="generator-panel">
        <div class="input-section">
          <h3>产品描述生成</h3>
          <p class="section-desc">生成吸引人的产品描述，提升转化率</p>
          
          <div class="form-grid">
            <div class="form-group">
              <label>产品名称 <span class="required">*</span></label>
              <input 
                v-model="productForm.productName" 
                type="text" 
                placeholder="产品名称"
              />
            </div>
            <div class="form-group">
              <label>产品类别 <span class="required">*</span></label>
              <input 
                v-model="productForm.category" 
                type="text" 
                placeholder="例如：软件、服务、电子产品"
              />
            </div>
            <div class="form-group">
              <label>品牌名称（可选）</label>
              <input 
                v-model="productForm.brandName" 
                type="text" 
                placeholder="品牌名称"
              />
            </div>
            <div class="form-group">
              <label>目标用户（可选）</label>
              <input 
                v-model="productForm.targetAudience" 
                type="text" 
                placeholder="主要用户群体"
              />
            </div>
            <div class="form-group full-width">
              <label>产品特点（可选）</label>
              <textarea 
                v-model="productForm.features" 
                rows="3"
                placeholder="用逗号分隔产品主要特点..."
              ></textarea>
            </div>
          </div>

          <button 
            class="generate-btn primary"
            :disabled="!productForm.productName || !productForm.category || generating"
            @click="generateProductDescription"
          >
            <span v-if="generating" class="loading-spinner"></span>
            <span v-else>✨ 生成产品描述</span>
          </button>
        </div>

        <!-- Generated Result -->
        <div v-if="productResult" class="result-section">
          <div class="result-header">
            <h3>生成结果</h3>
            <div class="result-actions">
              <button class="action-btn" @click="copyToClipboard(formatProductDescription(productResult))">
                📋 复制全部
              </button>
            </div>
          </div>

          <div class="product-result">
            <div class="product-short-desc">
              <h4>短描述（50字以内）</h4>
              <p>{{ productResult.shortDescription }}</p>
            </div>

            <div class="product-long-desc">
              <h4>详细描述</h4>
              <p>{{ productResult.longDescription }}</p>
            </div>

            <div class="product-features">
              <h4>核心卖点</h4>
              <ul>
                <li v-for="(feature, index) in productResult.features" :key="index">
                  {{ feature }}
                </li>
              </ul>
            </div>

            <div class="product-usecases">
              <h4>使用场景</h4>
              <ul>
                <li v-for="(usecase, index) in productResult.useCases" :key="index">
                  {{ usecase }}
                </li>
              </ul>
            </div>

            <div class="product-specs">
              <h4>规格参数</h4>
              <table>
                <tbody>
                  <tr v-for="spec in productResult.specifications" :key="spec.name">
                    <td class="spec-name">{{ spec.name }}</td>
                    <td class="spec-value">{{ spec.value }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type">
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const tabs = [
  { id: 'seo', label: 'SEO文章', icon: '📝' },
  { id: 'faq', label: 'FAQ问答', icon: '❓' },
  { id: 'jsonld', label: 'JSON-LD', icon: '📊' },
  { id: 'product', label: '产品描述', icon: '✨' },
]

const activeTab = ref('seo')
const generating = ref(false)

const toast = reactive({
  show: false,
  message: '',
  type: 'success'
})

const showToast = (message, type = 'success') => {
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => { toast.show = false }, 3000)
}

const seoForm = reactive({
  brandName: '',
  keyword: '',
  longTailKeywords: '',
  targetWordCount: 1500,
  brandInfo: '',
  competitors: ''
})

const faqForm = reactive({
  name: '',
  faqType: 'product',
  questionCount: 10,
  targetAudience: ''
})

const jsonLdForm = reactive({
  schemaType: 'Organization',
  name: '',
  websiteUrl: '',
  logoUrl: '',
  contactEmail: '',
  description: '',
  price: ''
})

const productForm = reactive({
  productName: '',
  category: '',
  brandName: '',
  targetAudience: '',
  features: ''
})

const seoResult = ref(null)
const faqResult = ref(null)
const jsonLdResult = ref(null)
const productResult = ref(null)

const api = '/api/content/generate'

const generateSeoArticle = async () => {
  if (!seoForm.brandName || !seoForm.keyword) return
  
  generating.value = true
  try {
    const response = await fetch(`${api}/seo-article`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(seoForm)
    })
    const data = await response.json()
    seoResult.value = data
    showToast('SEO文章生成成功！')
  } catch (error) {
    showToast('生成失败，请重试', 'error')
  } finally {
    generating.value = false
  }
}

const generateFaq = async () => {
  if (!faqForm.name) return
  
  generating.value = true
  try {
    const response = await fetch(`${api}/faq`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(faqForm)
    })
    const data = await response.json()
    faqResult.value = data
    showToast('FAQ生成成功！')
  } catch (error) {
    showToast('生成失败，请重试', 'error')
  } finally {
    generating.value = false
  }
}

const generateJsonLd = async () => {
  if (!jsonLdForm.name) return
  
  generating.value = true
  try {
    const response = await fetch(`${api}/json-ld`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonLdForm)
    })
    const data = await response.json()
    jsonLdResult.value = data
    showToast('JSON-LD生成成功！')
  } catch (error) {
    showToast('生成失败，请重试', 'error')
  } finally {
    generating.value = false
  }
}

const generateProductDescription = async () => {
  if (!productForm.productName || !productForm.category) return
  
  generating.value = true
  try {
    const response = await fetch(`${api}/product-description`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productForm)
    })
    const data = await response.json()
    productResult.value = data
    showToast('产品描述生成成功！')
  } catch (error) {
    showToast('生成失败，请重试', 'error')
  } finally {
    generating.value = false
  }
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    showToast('已复制到剪贴板')
  } catch (error) {
    showToast('复制失败', 'error')
  }
}

const downloadContent = (content, filename) => {
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}-${Date.now()}.md`
  a.click()
  URL.revokeObjectURL(url)
  showToast('下载成功')
}

const formatMarkdown = (content) => {
  return content
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
}

const formatProductDescription = (result) => {
  return `# ${result.productName}

## 短描述
${result.shortDescription}

## 详细描述
${result.longDescription}

## 核心卖点
${result.features.map(f => `- ${f}`).join('\n')}

## 使用场景
${result.useCases.map(u => `- ${u}`).join('\n')}

## 规格参数
${result.specifications.map(s => `| ${s.name} | ${s.value} |`).join('\n')}
`
}
</script>

<style scoped>
.mofa-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.header-content {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border-radius: 16px;
  padding: 32px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

[data-theme="light"] .header-content {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
}

.header-title h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px;
  color: white;
}

.subtitle {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

.credits-info {
  background: rgba(255, 255, 255, 0.2);
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-navigation {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  background: var(--bg-elevated);
  padding: 8px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  color: var(--text-secondary);
}

.tab-btn:hover {
  background: var(--bg-primary);
}

.tab-btn.active {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
}

.tab-icon {
  font-size: 18px;
}

.content-area {
  display: grid;
  gap: 24px;
}

.generator-panel {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .generator-panel {
    grid-template-columns: 1fr;
  }
}

.input-section {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
}

.input-section h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--text-primary);
}

.section-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0 0 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.form-group .required {
  color: var(--color-error);
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px 14px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.generate-btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.generate-btn.primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.4);
}

.generate-btn:disabled {
  opacity: 0.6;
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

.result-section {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.result-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.result-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px 14px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-primary);
}

.action-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.result-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 13px;
  color: var(--text-secondary);
  background: var(--bg-primary);
  padding: 6px 12px;
  border-radius: 20px;
}

.article-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 12px;
  color: var(--text-primary);
}

.article-meta {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.article-body {
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-primary);
}

.article-body :deep(h1),
.article-body :deep(h2),
.article-body :deep(h3) {
  margin-top: 24px;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.article-body :deep(p) {
  margin-bottom: 16px;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.faq-item {
  padding: 16px;
  background: var(--bg-primary);
  border-radius: 12px;
}

.faq-question {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.faq-answer {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.jsonld-preview {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 20px;
  overflow-x: auto;
}

[data-theme="light"] .jsonld-preview {
  background: var(--bg-primary);
}

.jsonld-preview h4 {
  color: var(--text-primary);
  font-size: 14px;
  margin: 0 0 12px;
}

.jsonld-preview pre {
  margin: 0;
}

.jsonld-preview code {
  color: var(--color-info);
  font-size: 13px;
  font-family: 'Monaco', 'Menlo', monospace;
  white-space: pre-wrap;
  word-break: break-all;
}

.usage-tips {
  margin-top: 20px;
  padding: 16px;
  background: rgba(245, 158, 11, 0.1);
  border-radius: 12px;
  border-left: 4px solid var(--color-warning);
}

[data-theme="light"] .usage-tips {
  background: var(--bg-elevated);
}

.usage-tips h4 {
  margin: 0 0 12px;
  color: var(--text-primary);
}

[data-theme="light"] .usage-tips h4 {
  color: var(--text-primary);
}

.usage-tips ol {
  margin: 0;
  padding-left: 20px;
  color: var(--text-secondary);
  font-size: 14px;
}

[data-theme="light"] .usage-tips ol {
  color: var(--text-secondary);
}

.usage-tips li {
  margin-bottom: 8px;
}

.usage-tips a {
  color: var(--color-primary);
}

.product-result {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-result h4 {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 12px;
  color: var(--text-primary);
}

.product-short-desc {
  padding: 16px;
  background: rgba(22, 93, 255, 0.1);
  border-radius: 12px;
}

[data-theme="light"] .product-short-desc {
  background: rgba(22, 93, 255, 0.05);
}

.product-short-desc p {
  margin: 0;
  font-size: 16px;
  color: var(--color-primary);
  font-weight: 500;
}

.product-long-desc p {
  margin: 0;
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-secondary);
}

.product-features ul,
.product-usecases ul {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.product-features li,
.product-usecases li {
  padding: 8px 12px;
  background: var(--bg-primary);
  border-radius: 6px;
  font-size: 14px;
  color: var(--text-primary);
}

.product-specs table {
  width: 100%;
  border-collapse: collapse;
}

.product-specs td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border-color);
}

.spec-name {
  font-weight: 500;
  color: var(--text-primary);
  width: 120px;
}

.spec-value {
  color: var(--text-secondary);
}

.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast.success {
  background: var(--color-success);
  color: white;
  border-color: var(--color-success);
}

.toast.error {
  background: var(--color-error);
  color: white;
  border-color: var(--color-error);
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

@media (max-width: 768px) {
  .mofa-page {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .tab-navigation {
    flex-wrap: wrap;
  }

  .tab-btn {
    flex: 1 1 45%;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .result-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>