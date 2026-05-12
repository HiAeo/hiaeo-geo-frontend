<template>
  <div class="knowledge-page" :data-theme="theme">
    <!-- 加载中遮罩 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <svg class="animate-spin" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p>加载知识库数据中...</p>
      </div>
    </div>

    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div>
          <h1 class="page-title">MiraBox模盒·AI品牌智库</h1>
          <p class="page-subtitle">输入公司名称，AI 自动抓取并填充品牌信息</p>
        </div>
      </div>
    </div>

    <!-- AI 智能填写区域 -->
    <div class="ai-fetch-section">
      <div class="company-search-box">
        <div class="search-input-wrapper">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            v-model="companyNameInput"
            type="text"
            placeholder="请输入公司名称，如：腾讯科技（深圳）有限公司"
            class="search-input"
            :disabled="searching"
            @keyup.enter="handleSearchCompany"
          />
        </div>
        <button
          class="ai-fill-btn"
          :disabled="!companyNameInput.trim() || searching"
          @click="handleSearchCompany"
        >
          <svg v-if="searching" class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2"/>
            <path d="M12 8v4l3 3"/>
          </svg>
          {{ searching ? 'AI 抓取中...' : 'AI 智能填写' }}
        </button>
      </div>
      <p class="search-hint">
        企业基础信息通过工商数据库获取，其他信息通过 AI 全网抓取
      </p>
      <!-- 加载进度 -->
      <div v-if="searching" class="loading-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <span class="progress-text">{{ progressText }}</span>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="fetchError" class="error-message">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
      {{ fetchError }}
    </div>

    <!-- 成功提示 -->
    <div v-if="fetchSuccess" class="success-message">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      AI 已自动填充数据，请检查并修改后保存
    </div>

    <!-- 7个模块表单 -->
    <div class="modules-container">
      
      <!-- 模块一：企业基础信息 -->
      <div class="module-card">
        <div class="module-header">
          <div class="module-title">
            <span class="module-num">1</span>
            <span>企业基础信息</span>
            <span class="required-tag">必填</span>
          </div>
        </div>
        <div class="module-content">
          <div class="form-grid-2">
            <div class="form-group">
              <label>公司/品牌名称</label>
              <input v-model="form.module1.companyName" type="text" placeholder="请输入公司或品牌全称" />
            </div>
            <div class="form-group">
              <label>所属行业</label>
              <select v-model="form.module1.industry">
                <option value="">请选择行业</option>
                <option value="technology">科技/技术</option>
                <option value="ecommerce">电商/零售</option>
                <option value="education">教育/培训</option>
                <option value="healthcare">医疗/健康</option>
                <option value="finance">金融/银行</option>
                <option value="food">餐饮/食品</option>
                <option value="manufacture">制造业</option>
                <option value="service">服务业</option>
                <option value="real_estate">房地产/装修</option>
                <option value="media">媒体/广告</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div class="form-group">
              <label>公司规模</label>
              <select v-model="form.module1.companySize">
                <option value="">请选择规模</option>
                <option value="1-10">1-10人</option>
                <option value="11-50">11-50人</option>
                <option value="51-200">51-200人</option>
                <option value="201-500">201-500人</option>
                <option value="501-1000">501-1000人</option>
                <option value="1000+">1000人以上</option>
              </select>
            </div>
            <div class="form-group">
              <label>所在地区</label>
              <input v-model="form.module1.region" type="text" placeholder="如：北京市朝阳区" />
            </div>
            <div class="form-group">
              <label>官方网址</label>
              <input v-model="form.module1.website" type="text" placeholder="如：www.example.com" />
            </div>
            <div class="form-group">
              <label>品牌slogan</label>
              <input v-model="form.module1.slogan" type="text" placeholder="一句话描述品牌定位" />
            </div>
          </div>
          <div class="form-group full-width">
            <label>公司简介</label>
            <textarea v-model="form.module1.intro" rows="4" placeholder="请输入公司/品牌简介"></textarea>
          </div>
          <div class="module-actions">
            <button class="btn btn-primary" @click="saveModule1" :disabled="saving1">
              {{ saving1 ? '保存中...' : '保存' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 模块二：核心业务与定位 -->
      <div class="module-card">
        <div class="module-header">
          <div class="module-title">
            <span class="module-num">2</span>
            <span>核心业务与定位</span>
            <span class="required-tag">必填</span>
          </div>
        </div>
        <div class="module-content">
          <div class="form-group">
            <label>核心业务介绍</label>
            <textarea v-model="form.module2.coreBusiness" rows="4" placeholder="请详细描述公司的核心业务是什么，为客户提供什么价值"></textarea>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label>品牌定位</label>
              <input v-model="form.module2.positioning" type="text" placeholder="如：高端定制、专业服务" />
            </div>
            <div class="form-group">
              <label>目标客户群体</label>
              <input v-model="form.module2.targetCustomers" type="text" placeholder="如：B端企业主、25-40岁女性" />
            </div>
          </div>
          <div class="form-group">
            <label>差异化竞争优势</label>
            <textarea v-model="form.module2.differentiation" rows="3" placeholder="与竞品相比，贵公司的核心优势是什么？"></textarea>
          </div>
          <div class="form-group">
            <label>品牌故事（选填）</label>
            <textarea v-model="form.module2.brandStory" rows="3" placeholder="品牌创立故事、发展历程等"></textarea>
          </div>
          <div class="module-actions">
            <button class="btn btn-primary" @click="saveModule2" :disabled="saving2">
              {{ saving2 ? '保存中...' : '保存' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 模块三：产品与服务详情 -->
      <div class="module-card">
        <div class="module-header">
          <div class="module-title">
            <span class="module-num">3</span>
            <span>产品与服务详情</span>
            <span class="required-tag">必填</span>
          </div>
        </div>
        <div class="module-content">
          <div class="form-group">
            <label>主要产品/服务</label>
            <textarea v-model="form.module3.mainProducts" rows="4" placeholder="列出主要产品或服务类别，详细说明"></textarea>
          </div>
          <div class="form-group">
            <label>产品核心卖点</label>
            <textarea v-model="form.module3.sellPoints" rows="3" placeholder="产品的核心卖点是什么？解决了客户什么痛点？"></textarea>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label>价格区间</label>
              <input v-model="form.module3.priceRange" type="text" placeholder="如：¥1000-5000" />
            </div>
            <div class="form-group">
              <label>核心关键词（SEO用）</label>
              <input v-model="form.module3.seoKeywords" type="text" placeholder="用逗号分隔，如：SEO优化,网站诊断" />
            </div>
          </div>
          <div class="form-group">
            <label>服务流程/周期</label>
            <textarea v-model="form.module3.serviceProcess" rows="3" placeholder="描述服务流程或产品交付周期"></textarea>
          </div>
          <div class="module-actions">
            <button class="btn btn-primary" @click="saveModule3" :disabled="saving3">
              {{ saving3 ? '保存中...' : '保存' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 模块四：竞品与市场信息 -->
      <div class="module-card optional">
        <div class="module-header">
          <div class="module-title">
            <span class="module-num">4</span>
            <span>竞品与市场信息</span>
            <span class="optional-tag">选填</span>
          </div>
        </div>
        <div class="module-content">
          <div class="form-group">
            <label>主要竞争对手</label>
            <textarea v-model="form.module4.competitors" rows="4" placeholder="列出主要竞争对手（名称 + 网址），每行一个"></textarea>
          </div>
          <div class="form-group">
            <label>市场竞争环境</label>
            <textarea v-model="form.module4.marketEnv" rows="3" placeholder="描述市场环境、行业发展趋势等"></textarea>
          </div>
          <div class="form-group">
            <label>与竞品对比优势</label>
            <textarea v-model="form.module4.comparisonAdvantage" rows="3" placeholder="相比竞品，贵公司的独特优势"></textarea>
          </div>
          <div class="module-actions">
            <button class="btn btn-primary" @click="saveModule4" :disabled="saving4">
              {{ saving4 ? '保存中...' : '保存' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 模块五：GEO推广目标 -->
      <div class="module-card">
        <div class="module-header">
          <div class="module-title">
            <span class="module-num">5</span>
            <span>GEO推广目标</span>
            <span class="required-tag">必填</span>
          </div>
        </div>
        <div class="module-content">
          <div class="form-group">
            <label>核心 GEO 关键词</label>
            <textarea v-model="form.module5.geoKeywords" rows="3" placeholder="希望用户在搜索引擎中搜什么词能找到你？每行一个"></textarea>
          </div>
          <div class="form-group">
            <label>目标覆盖地区</label>
            <input v-model="form.module5.targetRegions" type="text" placeholder="如：全国、北京/上海/广州、一线城市" />
          </div>
          <div class="form-group">
            <label>内容营销目标</label>
            <textarea v-model="form.module5.contentGoals" rows="3" placeholder="希望通过GEO获得什么？如：提升品牌曝光、获取潜在客户等"></textarea>
          </div>
          <div class="form-group">
            <label>内容风格偏好</label>
            <select v-model="form.module5.contentStyle">
              <option value="">请选择</option>
              <option value="professional">专业严谨</option>
              <option value="friendly">亲切友好</option>
              <option value="authoritative">权威专家</option>
              <option value="casual">轻松活泼</option>
            </select>
          </div>
          <div class="module-actions">
            <button class="btn btn-primary" @click="saveModule5" :disabled="saving5">
              {{ saving5 ? '保存中...' : '保存' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 模块六：资料上传区 -->
      <div class="module-card optional">
        <div class="module-header">
          <div class="module-title">
            <span class="module-num">6</span>
            <span>资料上传区</span>
            <span class="optional-tag">选填（AI深度分析素材）</span>
          </div>
        </div>
        <div class="module-content">
          <p class="module-tip">上传品牌相关资料，帮助AI更深入地了解品牌，用于生成更精准的内容</p>
          
          <!-- 文件错误提示 -->
          <div v-if="fileError" class="file-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {{ fileError }}
          </div>
          
          <!-- 上传区域 -->
          <div class="upload-area" :class="{ 'uploading': uploading }" @click="!uploading && $refs.fileInput.click()">
            <input 
              ref="fileInput"
              type="file" 
              @change="handleFileChange" 
              :disabled="uploading"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,.jpg,.jpeg,.png,.gif,.webp,.svg,.mp4,.mp3,.wav"
              style="display: none;"
            />
            <div class="upload-placeholder">
              <svg v-if="uploading" class="animate-spin" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <svg v-else width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <p>{{ uploading ? '上传中...' : '点击上传文件' }}</p>
              <span>支持 PDF、Word、Excel、PPT、图片、音视频等常见格式</span>
            </div>
          </div>
          
          <!-- 文件列表（从 profile.fileIndex 派生） -->
          <div class="uploaded-files" v-if="fileList.length">
            <div v-for="(file, idx) in fileList" :key="file.fileId || idx" class="uploaded-file">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span :title="file.name">{{ file.name || '未知文件' }}</span>
              <button 
                class="remove-btn" 
                @click="handleDeleteFile(file.fileId)" 
                :disabled="deleting"
                :title="deleting ? '删除中...' : '删除'"
              >
                <svg v-if="deleting" class="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <span v-else>×</span>
              </button>
            </div>
          </div>
          
          <!-- 无文件提示 -->
          <div v-else class="no-files-tip">
            暂无上传文件
          </div>
          
          <div class="form-group" style="margin-top: 16px;">
            <label>资料补充说明</label>
            <textarea v-model="form.module6.notes" rows="3" placeholder="补充说明这些资料的特点或重点关注内容"></textarea>
          </div>
          <div class="module-actions">
            <button class="btn btn-primary" @click="saveModule6" :disabled="saving6">
              {{ saving6 ? '保存中...' : '保存' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 模块七：补充信息与特殊要求 -->
      <div class="module-card optional">
        <div class="module-header">
          <div class="module-title">
            <span class="module-num">7</span>
            <span>补充信息与特殊要求</span>
            <span class="optional-tag">选填</span>
          </div>
        </div>
        <div class="module-content">
          <div class="form-group">
            <label>联系方式</label>
            <div class="form-grid-2">
              <input v-model="form.module7.contactPhone" type="text" placeholder="联系电话" />
              <input v-model="form.module7.contactEmail" type="text" placeholder="电子邮箱" />
            </div>
          </div>
          <div class="form-group">
            <label>社交媒体账号</label>
            <div class="form-grid-2">
              <input v-model="form.module7.socialWechat" type="text" placeholder="微信公众号" />
              <input v-model="form.module7.socialWeibo" type="text" placeholder="微博" />
            </div>
            <div class="form-grid-2" style="margin-top: 8px;">
              <input v-model="form.module7.socialZhihu" type="text" placeholder="知乎" />
              <input v-model="form.module7.socialDouyin" type="text" placeholder="抖音" />
            </div>
          </div>
          <div class="form-group">
            <label>特殊要求或注意事项</label>
            <textarea v-model="form.module7.specialRequirements" rows="4" placeholder="任何特殊要求、禁用词、品牌调性说明等"></textarea>
          </div>
          <div class="module-actions">
            <button class="btn btn-primary" @click="saveModule7" :disabled="saving7">
              {{ saving7 ? '保存中...' : '保存' }}
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- Toast -->
    <div v-if="toast.show" class="toast" :class="toast.type">
      {{ toast.message }}
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useTheme } from '../../composables/useTheme'
import {
  getProfile,
  createProfile,
  updateProfile,
  uploadFile,
  deleteFile,
} from '@/api/knowledge'
import { getAISuggestion, searchCompany } from '@/api/workflow'

export default {
  name: 'KnowledgePage',
  setup() {
    const { theme } = useTheme()
    
    // URL 抓取相关
    // 企查查公司查询
    const companyNameInput = ref('')
    const searching = ref(false)
    const fetchError = ref('')
    const fetchSuccess = ref(false)

    // 页面加载状态
    const loading = ref(true)

    // 当前知识库的 ID，用于判断新建还是更新
    const profileId = ref(null)
    
    // 完整的 profile 数据，用于派生 file_index
    const profile = ref(null)
    
    // 文件列表 - 从 profile.fileIndex 派生（兼容对象和数组结构）
    const fileList = computed(() => {
      if (!profile.value) return []
      
      // 优先尝试 fileIndex（后端返回的对象结构：{ module: [files] }）
      const fileIndex = profile.value.fileIndex
      
      if (fileIndex) {
        // 如果是对象（{ module: [files] } 结构），合并所有模块的文件
        if (typeof fileIndex === 'object' && !Array.isArray(fileIndex)) {
          const allFiles = []
          for (const mod of Object.keys(fileIndex)) {
            const files = fileIndex[mod]
            if (Array.isArray(files)) {
              allFiles.push(...files.map(f => ({ ...f, module: mod })))
            }
          }
          return allFiles
        }
        // 如果是数组，直接返回
        if (Array.isArray(fileIndex)) {
          return fileIndex
        }
        // 如果是字符串，尝试解析
        if (typeof fileIndex === 'string') {
          try {
            return JSON.parse(fileIndex)
          } catch {
            return []
          }
        }
      }
      
      // 备用：尝试 uploadedFiles
      const uploadedFiles = profile.value.uploadedFiles
      if (uploadedFiles) {
        if (Array.isArray(uploadedFiles)) return uploadedFiles
        if (typeof uploadedFiles === 'string') {
          try { return JSON.parse(uploadedFiles) } catch { return [] }
        }
      }
      
      return []
    })
    
    // 文件输入 ref
    const fileInput = ref(null)
    
    // 进度显示
    const progressPercent = ref(0)
    const progressText = ref('准备中...')

    // 各模块保存状态
    const saving1 = ref(false)
    const saving2 = ref(false)
    const saving3 = ref(false)
    const saving4 = ref(false)
    const saving5 = ref(false)
    const saving6 = ref(false)
    const saving7 = ref(false)

    // 文件上传/删除状态
    const uploading = ref(false)
    const deleting = ref(false)
    const fileError = ref('')

    const toast = reactive({
      show: false,
      message: '',
      type: 'info',
    })

    // 7个模块的表单数据
    const form = reactive({
      module1: {
        companyName: '',
        industry: '',
        companySize: '',
        region: '',
        website: '',
        slogan: '',
        intro: '',
      },
      module2: {
        coreBusiness: '',
        positioning: '',
        targetCustomers: '',
        differentiation: '',
        brandStory: '',
      },
      module3: {
        mainProducts: '',
        sellPoints: '',
        priceRange: '',
        seoKeywords: '',
        serviceProcess: '',
      },
      module4: {
        competitors: '',
        marketEnv: '',
        comparisonAdvantage: '',
      },
      module5: {
        geoKeywords: '',
        targetRegions: '',
        contentGoals: '',
        contentStyle: '',
      },
      module6: {
        uploadedFiles: [],
        notes: '',
      },
      module7: {
        contactPhone: '',
        contactEmail: '',
        socialWechat: '',
        socialWeibo: '',
        socialZhihu: '',
        socialDouyin: '',
        specialRequirements: '',
      },
    })

    const showToast = (message, type = 'info') => {
      toast.message = message
      toast.type = type
      toast.show = true
      setTimeout(() => {
        toast.show = false
      }, 3000)
    }

    // 加载智库数据
    const loadProfile = async () => {
      loading.value = true
      try {
        const res = await getProfile()
        if (res?.data) {
          // 保存完整 profile 数据
          profile.value = res.data
          console.log('Profile loaded:', res.data)
          console.log('file_index field:', res.data.file_index)
          console.log('uploadedFiles field:', res.data.uploadedFiles)
          const data = res.data
          // 模块一
          if (data.basicInfo) {
            Object.assign(form.module1, {
              companyName: data.basicInfo.companyName || '',
              industry: data.basicInfo.industry || '',
              companySize: data.basicInfo.companySize || '',
              region: data.basicInfo.region || '',
              website: data.basicInfo.website || '',
              slogan: data.basicInfo.slogan || '',
              intro: data.basicInfo.intro || '',
            })
          }
          // 模块二
          if (data.bizPositioning) {
            Object.assign(form.module2, {
              coreBusiness: data.bizPositioning.coreBusiness || '',
              positioning: data.bizPositioning.positioning || '',
              targetCustomers: data.bizPositioning.targetCustomers || '',
              differentiation: data.bizPositioning.differentiation || '',
              brandStory: data.bizPositioning.brandStory || '',
            })
          }
          // 模块三
          if (data.productService) {
            Object.assign(form.module3, {
              mainProducts: data.productService.mainProducts || '',
              sellPoints: data.productService.sellPoints || '',
              priceRange: data.productService.priceRange || '',
              seoKeywords: data.productService.seoKeywords || '',
              serviceProcess: data.productService.serviceProcess || '',
            })
          }
          // 模块四
          if (data.competitorMarket) {
            Object.assign(form.module4, {
              competitors: data.competitorMarket.competitors || '',
              marketEnv: data.competitorMarket.marketEnv || '',
              comparisonAdvantage: data.competitorMarket.comparisonAdvantage || '',
            })
          }
          // 模块五
          if (data.geoGoals) {
            Object.assign(form.module5, {
              geoKeywords: data.geoGoals.geoKeywords || '',
              targetRegions: data.geoGoals.targetRegions || '',
              contentGoals: data.geoGoals.contentGoals || '',
              contentStyle: data.geoGoals.contentStyle || '',
            })
          }
          // 模块七
          if (data.contact) {
            Object.assign(form.module7, {
              contactPhone: data.contact.phone || '',
              contactEmail: data.contact.email || '',
              socialWechat: data.contact.wechat || '',
              socialWeibo: data.contact.weibo || '',
              socialZhihu: data.contact.zhihu || '',
              socialDouyin: data.contact.douyin || '',
            })
          }
          if (data.specialRequirements) {
            form.module7.specialRequirements = data.specialRequirements
          }
          // 强制初始化 uploadedFiles 为空数组，避免 undefined 导致后端 500
          if (!form.module6.uploadedFiles) {
            form.module6.uploadedFiles = []
          }
        }
        // 保存 profile ID，用于判断新建还是更新
        profileId.value = res.data?.id || res.data?._id || null
      } catch (err) {
        // 404: 没有数据，保持页面空状态，用户可以新建
        if (err.message && err.message.includes('404')) {
          // 无数据，静默保持空状态
          profileId.value = null
        } else {
          // 其他错误，显示提示
          console.error('加载智库失败:', err)
          showToast(err.message || '加载知识库失败，请稍后重试', 'error')
        }
      } finally {
        loading.value = false
      }
    }

    // AI URL 抓取 - 直接填充表单
    const handleFetchWebsite = async () => {
      if (!urlInput.value.trim()) return

      fetching.value = true
      fetchError.value = ''
      fetchSuccess.value = false

      try {
        const result = await getAISuggestion(urlInput.value)
        
        if (result.code === 0 && result.data) {
          const s = result.data
          
          // 填充模块一：基础信息
          if (s.basicInfo) {
            if (s.basicInfo.companyName) form.module1.companyName = s.basicInfo.companyName
            if (s.basicInfo.industry) form.module1.industry = s.basicInfo.industry
            if (s.basicInfo.companyRegion) form.module1.region = s.basicInfo.companyRegion
            if (s.basicInfo.website) form.module1.website = s.basicInfo.website
            if (s.basicInfo.slogan) form.module1.slogan = s.basicInfo.slogan
            if (s.basicInfo.intro) form.module1.intro = s.basicInfo.intro
            if (s.basicInfo.companySize) form.module1.companySize = s.basicInfo.companySize
          }
          
          // 填充模块二：业务定位
          if (s.bizPositioning) {
            if (s.bizPositioning.coreBizIntro) form.module2.coreBusiness = s.bizPositioning.coreBizIntro
            if (s.bizPositioning.targetCustomer) form.module2.targetCustomers = s.bizPositioning.targetCustomer
            if (s.bizPositioning.differentialAdvantage) form.module2.differentiation = s.bizPositioning.differentialAdvantage
            if (s.bizPositioning.positioning) form.module2.positioning = s.bizPositioning.positioning
            if (s.bizPositioning.brandStory) form.module2.brandStory = s.bizPositioning.brandStory
          }
          
          // 填充模块三：产品服务
          if (s.productService) {
            if (s.productService.mainProducts) form.module3.mainProducts = s.productService.mainProducts
            if (s.productService.sellPoints) form.module3.sellPoints = s.productService.sellPoints
            if (s.productService.serviceProcess) form.module3.serviceProcess = s.productService.serviceProcess
            if (s.productService.seoKeywords?.length) form.module3.seoKeywords = s.productService.seoKeywords.join(', ')
          }
          
          // 填充模块七：联系方式
          if (s.contact) {
            if (s.contact.phone) form.module7.contactPhone = s.contact.phone
            if (s.contact.email) form.module7.contactEmail = s.contact.email
            if (s.contact.wechat) form.module7.socialWechat = s.contact.wechat
            if (s.contact.weibo) form.module7.socialWeibo = s.contact.weibo
            if (s.contact.zhihu) form.module7.socialZhihu = s.contact.zhihu
            if (s.contact.douyin) form.module7.socialDouyin = s.contact.douyin
          }
          
          fetchSuccess.value = true
          showToast('AI 已填充数据，请检查并修改后保存', 'success')
        } else {
          fetchError.value = result.message || 'AI 分析失败'
        }
      } catch (err) {
        console.error('URL 抓取失败:', err)
        fetchError.value = err.message || '网络错误，请稍后重试'
      } finally {
        fetching.value = false
      }
    }

    // 企查查公司查询
    // AI 智能填写 - 整合企查查和大模型
    const handleSearchCompany = async () => {
      if (!companyNameInput.value.trim()) return

      searching.value = true
      fetchError.value = ''
      fetchSuccess.value = false
      progressPercent.value = 0
      progressText.value = '准备中...'

      try {
        // 调用统一的 AI 智能填写接口
        const result = await searchCompany(companyNameInput.value)
        
        if (result.code === 0 && result.data) {
          const data = result.data
          
          // 模块一：基础信息（来自企查查）
          progressText.value = '填充企业基础信息...'
          progressPercent.value = 15
          if (data.basicInfo) {
            if (data.basicInfo.companyName) form.module1.companyName = data.basicInfo.companyName
            if (data.basicInfo.industry) form.module1.industry = data.basicInfo.industry
            if (data.basicInfo.companySize) form.module1.companySize = data.basicInfo.companySize
            if (data.basicInfo.region) form.module1.region = data.basicInfo.region
            if (data.basicInfo.website) form.module1.website = data.basicInfo.website
            if (data.basicInfo.slogan) form.module1.slogan = data.basicInfo.slogan
            if (data.basicInfo.intro) form.module1.intro = data.basicInfo.intro
          }
          
          // 模块二：核心业务与定位（来自大模型）
          progressText.value = '抓取核心业务与定位...'
          progressPercent.value = 30
          if (data.bizPositioning) {
            if (data.bizPositioning.coreBusiness) form.module2.coreBusiness = data.bizPositioning.coreBusiness
            if (data.bizPositioning.targetCustomers) form.module2.targetCustomers = data.bizPositioning.targetCustomers
            if (data.bizPositioning.positioning) form.module2.positioning = data.bizPositioning.positioning
            if (data.bizPositioning.differentiation) form.module2.differentiation = data.bizPositioning.differentiation
            if (data.bizPositioning.brandStory) form.module2.brandStory = data.bizPositioning.brandStory
          }
          
          // 模块三：产品与服务详情（来自大模型）
          progressText.value = '抓取产品与服务详情...'
          progressPercent.value = 45
          if (data.productService) {
            if (data.productService.mainProducts) form.module3.mainProducts = data.productService.mainProducts
            if (data.productService.sellPoints) form.module3.sellPoints = data.productService.sellPoints
            if (data.productService.serviceProcess) form.module3.serviceProcess = data.productService.serviceProcess
            if (data.productService.priceRange) form.module3.priceRange = data.productService.priceRange
            if (data.productService.seoKeywords) form.module3.seoKeywords = data.productService.seoKeywords
          }
          
          // 模块四：竞品与市场信息（来自大模型）
          progressText.value = '分析竞品与市场格局...'
          progressPercent.value = 60
          if (data.competitorMarket) {
            if (data.competitorMarket.competitors) form.module4.competitors = data.competitorMarket.competitors
            if (data.competitorMarket.marketEnv) form.module4.marketEnv = data.competitorMarket.marketEnv
            if (data.competitorMarket.comparisonAdvantage) form.module4.comparisonAdvantage = data.competitorMarket.comparisonAdvantage
          }
          
          // 模块五：GEO推广目标（来自大模型）
          progressText.value = '生成GEO推广策略...'
          progressPercent.value = 75
          if (data.geoGoals) {
            if (data.geoGoals.geoKeywords) form.module5.geoKeywords = data.geoGoals.geoKeywords
            if (data.geoGoals.targetRegions) form.module5.targetRegions = data.geoGoals.targetRegions
            if (data.geoGoals.contentGoals) form.module5.contentGoals = data.geoGoals.contentGoals
            if (data.geoGoals.contentStyle) form.module5.contentStyle = data.geoGoals.contentStyle
          }
          
          // 模块七：联系方式（来自企查查）
          progressText.value = '获取联系方式...'
          progressPercent.value = 90
          if (data.contact) {
            if (data.contact.phone) form.module7.contactPhone = data.contact.phone
            if (data.contact.email) form.module7.contactEmail = data.contact.email
            if (data.contact.wechat) form.module7.socialWechat = data.contact.wechat
            if (data.contact.weibo) form.module7.socialWeibo = data.contact.weibo
            if (data.contact.zhihu) form.module7.socialZhihu = data.contact.zhihu
            if (data.contact.douyin) form.module7.socialDouyin = data.contact.douyin
          }
          
          progressPercent.value = 100
          progressText.value = '填写完成！'
          fetchSuccess.value = true
          showToast('AI 智能填写完成，请检查并修改后保存', 'success')
        } else {
          fetchError.value = result.message || 'AI 填写失败'
        }
      } catch (err) {
        console.error('AI 填写失败:', err)
        fetchError.value = err.message || '网络错误，请稍后重试'
      } finally {
        setTimeout(() => {
          searching.value = false
          progressPercent.value = 0
          progressText.value = ''
        }, 500)
      }
    }

    // 各模块保存函数
    const saveModule1 = async () => {
      if (saving1.value) return
      saving1.value = true
      try {
        const data = {
          basicInfo: form.module1,
        }
        if (profileId.value) {
          await updateProfile(data)
        } else {
          await createProfile(data)
        }
        showToast('模块一保存成功', 'success')
        await loadProfile()
      } catch (err) {
        console.error('保存失败:', err)
        showToast(err.message || '保存失败', 'error')
      } finally {
        saving1.value = false
      }
    }

    const saveModule2 = async () => {
      if (saving2.value) return
      saving2.value = true
      try {
        const data = {
          bizPositioning: form.module2,
        }
        if (profileId.value) {
          await updateProfile(data)
        } else {
          await createProfile(data)
        }
        showToast('模块二保存成功', 'success')
        await loadProfile()
      } catch (err) {
        console.error('保存失败:', err)
        showToast(err.message || '保存失败', 'error')
      } finally {
        saving2.value = false
      }
    }

    const saveModule3 = async () => {
      if (saving3.value) return
      saving3.value = true
      try {
        const data = {
          productService: {
            ...form.module3,
            seoKeywords: form.module3.seoKeywords.split(',').map(k => k.trim()).filter(Boolean),
          },
        }
        if (profileId.value) {
          await updateProfile(data)
        } else {
          await createProfile(data)
        }
        showToast('模块三保存成功', 'success')
        await loadProfile()
      } catch (err) {
        console.error('保存失败:', err)
        showToast(err.message || '保存失败', 'error')
      } finally {
        saving3.value = false
      }
    }

    const saveModule4 = async () => {
      if (saving4.value) return
      saving4.value = true
      try {
        const data = {
          competitorMarket: form.module4,
        }
        if (profileId.value) {
          await updateProfile(data)
        } else {
          await createProfile(data)
        }
        showToast('模块四保存成功', 'success')
        await loadProfile()
      } catch (err) {
        console.error('保存失败:', err)
        showToast(err.message || '保存失败', 'error')
      } finally {
        saving4.value = false
      }
    }

    const saveModule5 = async () => {
      if (saving5.value) return
      saving5.value = true
      try {
        const data = {
          geoGoals: form.module5,
        }
        if (profileId.value) {
          await updateProfile(data)
        } else {
          await createProfile(data)
        }
        showToast('模块五保存成功', 'success')
        await loadProfile()
      } catch (err) {
        console.error('保存失败:', err)
        showToast(err.message || '保存失败', 'error')
      } finally {
        saving5.value = false
      }
    }

    const saveModule6 = async () => {
      if (saving6.value) return
      saving6.value = true
      try {
        const data = {
          uploadedFiles: form.module6.uploadedFiles,
          materialNotes: form.module6.notes,
        }
        if (profileId.value) {
          await updateProfile(data)
        } else {
          await createProfile(data)
        }
        showToast('模块六保存成功', 'success')
        await loadProfile()
      } catch (err) {
        console.error('保存失败:', err)
        showToast(err.message || '保存失败', 'error')
      } finally {
        saving6.value = false
      }
    }

    const saveModule7 = async () => {
      if (saving7.value) return
      saving7.value = true
      try {
        const data = {
          contact: {
            phone: form.module7.contactPhone,
            email: form.module7.contactEmail,
            wechat: form.module7.socialWechat,
            weibo: form.module7.socialWeibo,
            zhihu: form.module7.socialZhihu,
            douyin: form.module7.socialDouyin,
          },
          specialRequirements: form.module7.specialRequirements,
        }
        if (profileId.value) {
          await updateProfile(data)
        } else {
          await createProfile(data)
        }
        showToast('模块七保存成功', 'success')
        await loadProfile()
      } catch (err) {
        console.error('保存失败:', err)
        showToast(err.message || '保存失败', 'error')
      } finally {
        saving7.value = false
      }
    }

    // 处理文件选择
    const handleFileChange = (event) => {
      const files = event.target.files
      if (files && files.length > 0) {
        handleUpload(files[0])
      }
      // 清空 input 以允许重复选择同一文件
      event.target.value = ''
    }

    // 上传文件
    const handleUpload = async (file) => {
      if (uploading.value) return
      
      fileError.value = ''
      uploading.value = true
      
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('brandId', profileId.value || 'default')
        
        const result = await uploadFile(formData)
        
        if (result.code === 0 || result.success) {
          showToast('文件上传成功', 'success')
          await loadProfile() // 刷新文件列表
        } else {
          fileError.value = result.message || '文件上传失败'
          showToast(result.message || '文件上传失败', 'error')
        }
      } catch (err) {
        console.error('上传失败:', err)
        fileError.value = err.message || '文件上传失败'
        showToast(err.message || '文件上传失败', 'error')
      } finally {
        uploading.value = false
      }
    }

    // 删除文件
    const handleDeleteFile = async (fileId) => {
      if (deleting.value) return
      
      fileError.value = ''
      deleting.value = true
      
      try {
        const result = await deleteFile(fileId)
        
        if (result.code === 0 || result.success) {
          showToast('文件删除成功', 'success')
          await loadProfile() // 刷新文件列表
        } else {
          fileError.value = result.message || '文件删除失败'
          showToast(result.message || '文件删除失败', 'error')
        }
      } catch (err) {
        console.error('删除失败:', err)
        fileError.value = err.message || '文件删除失败'
        showToast(err.message || '文件删除失败', 'error')
      } finally {
        deleting.value = false
      }
    }

    // 本地移除文件（仅用于 UI 反馈，不实际删除）
    const removeFile = (idx) => {
      form.module6.uploadedFiles.splice(idx, 1)
    }

    onMounted(() => {
      loadProfile()
    })

    return {
      theme,
      loading,
      profileId,
      companyNameInput,
      searching,
      fetchError,
      fetchSuccess,
      progressPercent,
      progressText,
      form,
      saving1,
      saving2,
      saving3,
      saving4,
      saving5,
      saving6,
      saving7,
      uploading,
      deleting,
      fileError,
      fileList,
      fileInput,
      toast,
      handleSearchCompany,
      saveModule1,
      saveModule2,
      saveModule3,
      saveModule4,
      saveModule5,
      saveModule6,
      saveModule7,
      handleFileChange,
      handleUpload,
      handleDeleteFile,
      removeFile,
    }
  },
}
</script>

<style scoped>
.knowledge-page {
  min-height: 100vh;
  padding-bottom: 40px;
  background: var(--bg-primary);
  color: var(--text-primary);
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
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.ai-fetch-section {
  max-width: 1200px;
  margin: 24px auto;
  padding: 24px;
  background: linear-gradient(135deg, rgba(22, 93, 255, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
  border: 1px solid var(--color-primary);
  border-radius: 16px;
}

.url-input-wrapper {
  display: flex;
  gap: 12px;
}

.url-input-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: border-color 0.2s;
}

.url-input-box:focus-within {
  border-color: var(--color-primary);
}

.url-icon {
  color: var(--color-primary);
  flex-shrink: 0;
}

.url-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.9375rem;
  color: var(--text-primary);
  outline: none;
}

.url-input::placeholder {
  color: var(--text-tertiary);
}

.url-input:disabled {
  opacity: 0.6;
}

.url-hint {
  margin-top: 12px;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

/* 企查查公司搜索 */
.company-search-box {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0 14px;
  transition: all 0.2s;
}

.search-input-wrapper:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  color: var(--text-secondary);
  margin-right: 10px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 12px 0;
  font-size: 0.9375rem;
  color: var(--text-primary);
  outline: none;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.ai-fill-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.ai-fill-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.ai-fill-btn:active:not(:disabled) {
  transform: translateY(0);
}

.ai-fill-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 加载进度条 */
.loading-progress {
  margin-top: 16px;
}

.progress-bar {
  height: 6px;
  background: var(--bg-secondary);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  display: block;
  margin-top: 8px;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  text-align: center;
}

.company-search-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.company-search-btn:active:not(:disabled) {
  transform: translateY(0);
}

.company-search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-hint {
  font-size: 0.8125rem;
  color: #10b981;
  margin-bottom: 8px;
}

.divider-text {
  text-align: center;
  margin: 20px 0;
  position: relative;
}

.divider-text::before,
.divider-text::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 40px);
  height: 1px;
  background: var(--border-color);
}

.divider-text::before {
  left: 0;
}

.divider-text::after {
  right: 0;
}

.divider-text span {
  display: inline-block;
  padding: 0 16px;
  background: var(--bg-primary);
  color: var(--text-muted);
  font-size: 0.8125rem;
  position: relative;
}

.ai-fetch-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, var(--color-primary), #8b5cf6);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.ai-fetch-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.3);
}

.ai-fetch-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-message, .success-message {
  max-width: 1200px;
  margin: 0 auto 16px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-message {
  background: rgba(245, 63, 63, 0.1);
  border: 1px solid var(--color-danger);
  color: var(--color-danger);
}

.success-message {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid var(--color-success);
  color: var(--color-success);
}

.modules-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.module-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
}

.module-card.optional {
  border-style: dashed;
}

.module-header {
  padding: 16px 24px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
}

.module-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.0625rem;
  font-weight: 600;
}

.module-num {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  font-size: 0.875rem;
  font-weight: 700;
}

.required-tag {
  padding: 2px 8px;
  background: rgba(22, 93, 255, 0.1);
  color: var(--color-primary);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.optional-tag {
  padding: 2px 8px;
  background: rgba(156, 163, 175, 0.1);
  color: var(--text-tertiary);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.module-content {
  padding: 24px;
}

.module-tip {
  margin: 0 0 16px;
  padding: 12px 16px;
  background: rgba(22, 93, 255, 0.05);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.form-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.9375rem;
  background: var(--bg-elevated);
  color: var(--text-primary);
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--text-tertiary);
}

.form-group select {
  cursor: pointer;
}

.module-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-area:hover {
  border-color: var(--color-primary);
  background: rgba(22, 93, 255, 0.02);
}

.upload-area.uploading {
  cursor: wait;
  opacity: 0.7;
}

.file-error {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 10px 12px;
  background: rgba(245, 63, 63, 0.1);
  border: 1px solid var(--color-danger);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--color-danger);
}

.no-files-tip {
  margin-top: 12px;
  padding: 16px;
  text-align: center;
  color: var(--text-tertiary);
  font-size: 0.875rem;
  background: var(--bg-primary);
  border-radius: 8px;
}

.upload-placeholder {
  color: var(--text-tertiary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-placeholder svg {
  margin-bottom: 12px;
}

.upload-placeholder p {
  margin: 0 0 4px;
  font-size: 0.9375rem;
  color: var(--text-secondary);
}

.upload-placeholder span {
  font-size: 0.8125rem;
}

.uploaded-files {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.uploaded-file {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.875rem;
}

.remove-btn {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-danger);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
}

.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  color: white;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.toast.success { background: var(--color-success); }
.toast.error { background: var(--color-danger); }
.toast.info { background: var(--color-primary); }

@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 加载中遮罩 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 0.95;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--color-primary);
}

.loading-spinner svg {
  animation: spin 1s linear infinite;
}

.loading-spinner p {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  margin: 0;
}
</style>
