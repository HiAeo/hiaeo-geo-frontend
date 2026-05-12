<template>
  <div class="publish-page">
    <!-- 统一页面头部 -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">MiraMag模法·AI生成式引擎优化</h1>
          <span class="page-subtitle">复制粘贴即落地，执行记录全程可见，不碰服务器，不自动机发，安全合规</span>
        </div>
        <div class="header-actions">
          <button class="secondary-btn" @click="fetchPublishList">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            刷新
          </button>
        </div>
      </div>
    </header>

    <!-- Tab Navigation -->
    <div class="tab-wrapper">
      <div class="tab-navigation">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab-btn', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
          <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
        </button>
      </div>
    </div>

    <!-- Content Area -->
    <div class="content-area">
      <!-- Publish List -->
      <div v-if="activeTab === 'list'" class="panel">
        <div class="panel-header">
          <h3>发布记录</h3>
          <div class="filters">
            <select v-model="filters.status" @change="fetchPublishList">
              <option value="">全部状态</option>
              <option value="pending">待发布</option>
              <option value="publishing">发布中</option>
              <option value="published">已发布</option>
              <option value="failed">失败</option>
              <option value="scheduled">已排期</option>
            </select>
            <select v-model="filters.platform" @change="fetchPublishList">
              <option value="">全部平台</option>
              <option value="website">官网</option>
              <option value="wechat">微信公众号</option>
              <option value="wechat_moments">朋友圈</option>
              <option value="weibo">微博</option>
              <option value="douyin">抖音</option>
              <option value="xiaohongshu">小红书</option>
              <option value="bilibili">B站</option>
            </select>
          </div>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <div v-else-if="publishList.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
          <h4>暂无发布记录</h4>
          <p>生成内容后，可以在此处一键发布到多个平台</p>
          <button class="primary-btn" @click="activeTab = 'publish'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            发布内容
          </button>
        </div>

        <div v-else class="publish-table">
          <table>
            <thead>
              <tr>
                <th>内容标题</th>
                <th>平台</th>
                <th>状态</th>
                <th>发布时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in publishList" :key="record.id">
                <td class="title-cell">
                  <span class="title">{{ record.title }}</span>
                </td>
                <td>
                  <div class="platform-tags">
                    <span 
                      v-for="pr in record.platformResults" 
                      :key="pr.platform"
                      :class="['platform-tag', pr.status]"
                    >
                      {{ getPlatformName(pr.platform) }}
                    </span>
                  </div>
                </td>
                <td>
                  <span :class="['status-badge', record.status]">
                    {{ getStatusName(record.status) }}
                  </span>
                </td>
                <td class="time-cell">
                  {{ formatTime(record.publishedAt || record.createdAt) }}
                </td>
                <td class="actions-cell">
                  <button class="icon-btn" title="查看详情" @click="viewDetail(record)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                  <button 
                    v-if="record.status === 'failed'" 
                    class="icon-btn" 
                    title="重新发布"
                    @click="retryPublish(record)"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="23 4 23 10 17 10"/>
                      <polyline points="1 20 1 14 7 14"/>
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="total > 0" class="pagination">
          <span class="total">共 {{ total }} 条</span>
          <div class="pagination-btns">
            <button class="page-btn" :disabled="page <= 1" @click="page--; fetchPublishList()">上一页</button>
            <span class="page-info">{{ page }} / {{ Math.ceil(total / pageSize) }}</span>
            <button class="page-btn" :disabled="page >= Math.ceil(total / pageSize)" @click="page++; fetchPublishList()">下一页</button>
          </div>
        </div>
      </div>

      <!-- New Publish -->
      <div v-if="activeTab === 'publish'" class="panel">
        <div class="panel-header">
          <h3>发布内容</h3>
        </div>

        <div class="publish-form">
          <div class="form-group">
            <label>内容标题 <span class="required">*</span></label>
            <input v-model="publishForm.title" type="text" placeholder="输入内容标题" />
          </div>

          <div class="form-group">
            <label>内容类型</label>
            <select v-model="publishForm.contentType">
              <option value="seo_article">SEO文章</option>
              <option value="faq">FAQ</option>
              <option value="json_ld">JSON-LD</option>
              <option value="product_description">产品描述</option>
              <option value="social_post">社交帖子</option>
            </select>
          </div>

          <div class="form-group full-width">
            <label>内容正文 <span class="required">*</span></label>
            <textarea v-model="publishForm.body" rows="10" placeholder="输入或粘贴内容..."></textarea>
          </div>

          <div class="form-group full-width">
            <label>关键词（可选）</label>
            <input v-model="publishForm.keywords" type="text" placeholder="用逗号分隔" />
          </div>

          <!-- GEO核心信源媒体选择 -->
          <div class="form-section">
            <label>
              GEO核心信源媒体 
              <span class="section-hint">（点击logo访问官网，勾选方块选择发布目标）</span>
            </label>
            <MediaSelector v-model="selectedMedia" />
          </div>

          <div class="form-actions">
            <button class="primary-btn" :disabled="!canPublish || publishing" @click="executePublish">
              <svg v-if="!publishing" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              <span v-if="publishing" class="loading-spinner-sm"></span>
              {{ publishing ? '发布中...' : '一键发布' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Export -->
      <div v-if="activeTab === 'export'" class="panel">
        <div class="panel-header">
          <h3>导出内容</h3>
        </div>

        <div class="export-form">
          <div class="form-group">
            <label>导出格式</label>
            <select v-model="exportForm.format">
              <option value="txt">TXT 文本</option>
              <option value="html">HTML 网页</option>
              <option value="md">Markdown</option>
              <option value="json">JSON</option>
            </select>
          </div>

          <div class="form-group">
            <label>文件名</label>
            <input v-model="exportForm.fileName" type="text" placeholder="export" />
          </div>

          <div class="form-actions">
            <button class="primary-btn" :disabled="publishList.length === 0" @click="exportContent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              导出全部
            </button>
          </div>
        </div>

        <div class="quick-actions">
          <h4>快捷操作</h4>
          <div class="action-grid">
            <button class="secondary-btn" @click="copyLatestContent">复制最新内容</button>
            <button class="secondary-btn" @click="downloadAsTxt">下载为TXT</button>
            <button class="secondary-btn" @click="downloadAsHtml">下载为HTML</button>
            <button class="secondary-btn" @click="downloadAsJson">下载为JSON</button>
          </div>
        </div>
      </div>

      <!-- Platform Status -->
      <div v-if="activeTab === 'platforms'" class="panel">
        <div class="panel-header">
          <h3>平台状态</h3>
        </div>

        <div class="platforms-grid">
          <div v-for="platform in platformStatus" :key="platform.platform" class="platform-card">
            <img v-if="getPlatformIcon(platform.platform).includes('/')" :src="getPlatformIcon(platform.platform)" :alt="platform.name" class="platform-logo-lg" />
            <div v-else class="platform-icon-lg">{{ getPlatformIcon(platform.platform) }}</div>
            <div class="platform-info">
              <h4>{{ platform.name }}</h4>
              <span :class="['status-indicator', platform.isConnected ? 'connected' : 'disconnected']">
                {{ platform.isConnected ? '已连接' : '未连接' }}
              </span>
            </div>
            <button class="secondary-btn btn-sm">
              {{ platform.isConnected ? '设置' : '连接' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <Transition name="modal">
      <div v-if="showDetail" class="modal-overlay" @click.self="showDetail = false">
        <div class="modal-content">
          <div class="modal-header">
            <h3>发布详情</h3>
            <button class="close-btn" @click="showDetail = false">×</button>
          </div>
          <div class="modal-body">
            <div class="detail-section">
              <h4>基本信息</h4>
              <dl>
                <dt>标题</dt>
                <dd>{{ selectedRecord?.title }}</dd>
                <dt>状态</dt>
                <dd>{{ getStatusName(selectedRecord?.status) }}</dd>
                <dt>创建时间</dt>
                <dd>{{ formatTime(selectedRecord?.createdAt) }}</dd>
              </dl>
            </div>
            <div class="detail-section">
              <h4>平台结果</h4>
              <div class="platform-results">
                <div v-for="pr in selectedRecord?.platformResults" :key="pr.platform" class="result-item">
                  <span class="platform-name">{{ getPlatformName(pr.platform) }}</span>
                  <span :class="['status-badge', pr.status]">{{ getStatusName(pr.status) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type">
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useApi } from '../composables/useApi'
import { useTheme } from '../composables/useTheme'
import MediaSelector from './MediaSelector.vue'
import { defaultSelectedMedia } from '../config/mediaConfig'

// 获取主题
const { theme, initTheme } = useTheme()

const tabs = [
  { id: 'list', label: '发布记录', icon: '📋' },
  { id: 'publish', label: '发布内容', icon: '🚀' },
  { id: 'export', label: '导出', icon: '📤' },
  { id: 'platforms', label: '平台', icon: '⚙️' },
]

const activeTab = ref('list')
const loading = ref(false)
const publishing = ref(false)
const publishList = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)

const showDetail = ref(false)
const selectedRecord = ref(null)

const toast = reactive({
  show: false,
  message: '',
  type: 'success'
})

const filters = reactive({
  status: '',
  platform: ''
})

const publishForm = reactive({
  title: '',
  body: '',
  contentType: 'seo_article',
  excerpt: '',
  keywords: '',
  targetPlatforms: [],
})

const exportForm = reactive({
  format: 'txt',
  fileName: '',
  includeMetadata: true,
})

const platformStatus = ref([])

// 选中的GEO核心信源媒体
const selectedMedia = ref([...defaultSelectedMedia])

const availablePlatforms = [
  { id: 'website', name: '官网', icon: '🌐', logoUrl: '/platforms-logos/website-color.svg' },
  { id: 'wechat', name: '微信公众号', icon: '💬', logoUrl: '/platforms-logos/wechat-color.svg' },
  { id: 'wechat_moments', name: '朋友圈', icon: '👥', logoUrl: '/platforms-logos/wechat-color.svg' },
  { id: 'weibo', name: '微博', icon: '📱', logoUrl: '/platforms-logos/weibo-color.svg' },
  { id: 'douyin', name: '抖音', icon: '🎬', logoUrl: '/platforms-logos/douyin-color.svg' },
  { id: 'xiaohongshu', name: '小红书', icon: '📕', logoUrl: '/platforms-logos/xiaohongshu-color.svg' },
  { id: 'bilibili', name: 'B站', icon: '📺', logoUrl: '/platforms-logos/bilibili-color.svg' },
  { id: 'baidu', name: '百度', icon: '🔍', logoUrl: '/platforms-logos/baidu-color.svg' },
  { id: 'taobao', name: '淘宝', icon: '🛒', logoUrl: '/platforms-logos/taobao-color.svg' },
  { id: 'tmall', name: '天猫', icon: '🏪', logoUrl: '/platforms-logos/tmall-color.svg' },
  { id: 'jd', name: '京东', icon: '📦', logoUrl: '/platforms-logos/jd-color.svg' },
]

// 使用 useApi (API函数加 Api 后缀避免命名冲突)
const { 
  getPublishList: getPublishListApi, 
  getPlatformStatus: getPlatformStatusApi, 
  publishContent: publishContentApi, 
  retryPublish: retryPublishApi, 
  cancelPublish: cancelPublishApi 
} = useApi()

const showToast = (message, type = 'success') => {
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => { toast.show = false }, 3000)
}

const canPublish = computed(() => {
  return publishForm.title && publishForm.body && selectedMedia.value.length > 0
})

const getSelectedPlatforms = computed(() => {
  return publishForm.targetPlatforms.map(id => {
    const platform = availablePlatforms.find(p => p.id === id)
    return {
      id,
      ...platform,
      isDraft: false,
      hasSchedule: false,
      scheduledTime: '',
    }
  })
})

const getPlatformName = (platformId) => {
  const platform = availablePlatforms.find(p => p.id === platformId)
  return platform ? platform.name : platformId
}

const getPlatformIcon = (platformId) => {
  const platform = availablePlatforms.find(p => p.id === platformId)
  return platform ? platform.logoUrl || platform.icon : '📱'
}

const getStatusName = (status) => {
  const names = {
    draft: '草稿',
    pending: '待发布',
    publishing: '发布中',
    published: '已发布',
    failed: '失败',
    scheduled: '已排期',
  }
  return names[status] || status
}

const formatTime = (time) => {
  if (!time) return '-'
  return new Date(time).toLocaleString('zh-CN')
}

const isPlatformSelected = (platformId) => {
  return publishForm.targetPlatforms.includes(platformId)
}

const fetchPublishList = async () => {
  loading.value = true
  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value,
    }
    if (filters.status) params.status = filters.status
    if (filters.platform) params.platform = filters.platform

    const data = await getPublishListApi(params)
    publishList.value = data.list || []
    total.value = data.total || 0
  } catch (error) {
    showToast('获取列表失败', 'error')
  } finally {
    loading.value = false
  }
}

const executePublish = async () => {
  if (!canPublish.value) return

  publishing.value = true
  try {
    const payload = {
      ...publishForm,
      keywords: publishForm.keywords ? publishForm.keywords.split(',').map(k => k.trim()) : [],
      // GEO核心信源媒体作为发布目标
      targetMedia: selectedMedia.value,
    }

    const data = await publishContentApi(payload)
    
    showToast(`发布成功！${data.platformResults?.filter(p => p.status === 'published').length || 0} 个平台`)
    fetchPublishList()
    
    // Reset form
    publishForm.title = ''
    publishForm.body = ''
    publishForm.excerpt = ''
    publishForm.keywords = ''
    publishForm.targetPlatforms = []
    selectedMedia.value = [...defaultSelectedMedia]
  } catch (error) {
    showToast('发布失败', 'error')
  } finally {
    publishing.value = false
  }
}

const viewDetail = (record) => {
  selectedRecord.value = record
  showDetail.value = true
}

const retryPublish = async (record) => {
  try {
    await retryPublishApi(record.id)
    showToast('重新发布已启动')
    fetchPublishList()
  } catch (error) {
    showToast('重试失败', 'error')
  }
}

const cancelPublish = async (record) => {
  try {
    const data = await cancelPublishApi(record.id)
    showToast(data.message || '发布已取消')
    fetchPublishList()
  } catch (error) {
    showToast('取消失败', 'error')
  }
}

const exportContent = async () => {
  const contentIds = publishList.value.map(p => p.id)
  if (contentIds.length === 0) {
    showToast('没有可导出的内容', 'error')
    return
  }

  try {
    const response = await fetch('/api/publish/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentIds,
        format: exportForm.format,
        fileName: exportForm.fileName || 'export',
        includeMetadata: exportForm.includeMetadata,
      }),
    })
    const data = await response.json()
    
    // Download file
    const blob = new Blob([data.content], { type: data.mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = data.fileName
    a.click()
    URL.revokeObjectURL(url)
    
    showToast('导出成功')
  } catch (error) {
    showToast('导出失败', 'error')
  }
}

const copyLatestContent = async () => {
  if (publishList.value.length === 0) {
    showToast('没有可复制的内容', 'error')
    return
  }
  const latest = publishList.value[0]
  try {
    // Mock: 直接复制标题和内容
    const content = latest.title || '示例内容'
    await navigator.clipboard.writeText(content)
    showToast('已复制到剪贴板')
  } catch (error) {
    showToast('复制失败', 'error')
  }
}

const downloadAsTxt = () => {
  exportForm.format = 'txt'
  exportContent()
}

const downloadAsHtml = () => {
  exportForm.format = 'html'
  exportContent()
}

const downloadAsJson = () => {
  exportForm.format = 'json'
  exportContent()
}

const fetchPlatformStatus = async () => {
  try {
    const data = await getPlatformStatusApi()
    platformStatus.value = data.platforms || []
  } catch (error) {
    console.error('Failed to fetch platform status')
  }
}

onMounted(() => {
  fetchPublishList()
  fetchPlatformStatus()
  
  // 从策略页跳转时，填充发布表单
  initFromStrategy()
  
  // 从模法页跳转时，填充发布表单
  initFromMofa()
})

// 从策略页接收数据
const initFromStrategy = () => {
  const strategyData = sessionStorage.getItem('publish_from_strategy')
  if (strategyData) {
    try {
      const data = JSON.parse(strategyData)
      
      // 自动填充表单
      publishForm.title = data.content?.summary?.substring(0, 50) || `${data.brandName} - GEO优化内容`
      publishForm.body = generateBodyFromStrategy(data.content)
      publishForm.keywords = data.content?.targetKeywords?.join(', ') || ''
      publishForm.targetPlatforms = data.content?.platformPlan?.map(p => p.platform) || ['website', 'wechat']
      
      // 如果策略包含选中的媒体，则使用它
      if (data.selectedMedia && data.selectedMedia.length > 0) {
        selectedMedia.value = data.selectedMedia
      }
      
      // 切换到发布标签
      activeTab.value = 'publish'
      
      // 显示提示
      showToast('已基于策略填充发布内容', 'info')
      
      // 清除sessionStorage
      sessionStorage.removeItem('publish_from_strategy')
    } catch (e) {
      console.error('解析策略数据失败:', e)
    }
  }
}

// 从模法页接收数据
const initFromMofa = () => {
  const mofaData = sessionStorage.getItem('publish_from_mofa')
  if (mofaData) {
    try {
      const data = JSON.parse(mofaData)
      
      // 自动填充表单
      publishForm.title = data.title || `${data.brandName} - GEO内容`
      publishForm.body = data.content || ''
      publishForm.keywords = data.keywords?.join(', ') || ''
      
      // 根据内容类型设置目标平台
      if (data.type === 'faq') {
        publishForm.targetPlatforms = ['website']
      } else if (data.type === 'jsonld') {
        publishForm.targetPlatforms = ['website']
      } else {
        publishForm.targetPlatforms = ['website', 'wechat', 'zhihu']
      }
      
      // 切换到发布标签
      activeTab.value = 'publish'
      
      // 显示提示
      showToast('已基于模法生成内容填充发布信息', 'info')
      
      // 清除sessionStorage
      sessionStorage.removeItem('publish_from_mofa')
    } catch (e) {
      console.error('解析模法数据失败:', e)
    }
  }
}

// 从策略内容生成发布正文
const generateBodyFromStrategy = (content) => {
  if (!content) return ''
  
  let body = ''
  
  // 添加执行摘要
  if (content.summary) {
    body += `【执行摘要】\n${content.summary}\n\n`
  }
  
  // 添加核心目标
  if (content.coreObjectives && content.coreObjectives.length > 0) {
    body += `【核心目标】\n`
    content.coreObjectives.forEach((obj, i) => {
      body += `${i + 1}. ${obj}\n`
    })
    body += '\n'
  }
  
  // 添加内容主题
  if (content.contentThemes && content.contentThemes.length > 0) {
    body += `【内容主题】\n`
    content.contentThemes.forEach(theme => {
      body += `- ${theme.theme}：${theme.description}\n`
    })
    body += '\n'
  }
  
  // 添加执行建议
  if (content.recommendations && content.recommendations.length > 0) {
    body += `【执行建议】\n`
    content.recommendations.forEach((rec, i) => {
      body += `${i + 1}. ${rec}\n`
    })
  }
  
  return body
}
</script>

<style scoped>
.publish-page {
  min-height: 100vh;
  padding-bottom: 40px;
  background: var(--bg-primary);
}

/* 统一页面头部 */
.page-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  padding: 20px 24px;
}

.header-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
}

.header-left { flex: 1; }
.header-actions { display: flex; gap: 12px; }

.page-title { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin: 0; }
.page-subtitle { font-size: 0.875rem; color: var(--text-secondary); margin-top: 4px; line-height: 1.5; }

/* 统一按钮样式 */
.primary-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 18px; background: var(--color-primary); color: white;
  border: none; border-radius: 10px; font-size: 0.875rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s ease;
}
.primary-btn:hover { background: var(--color-primary-hover); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(22, 93, 255, 0.3); }
.primary-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.secondary-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 18px; background: var(--bg-elevated); color: var(--text-primary);
  border: 1px solid var(--border-color); border-radius: 10px; font-size: 0.875rem;
  font-weight: 600; cursor: pointer; transition: all 0.2s ease;
}
.secondary-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }

.btn-sm { padding: 6px 12px; font-size: 0.8125rem; }

.icon-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; padding: 0; background: var(--bg-elevated);
  color: var(--text-secondary); border: 1px solid var(--border-color);
  border-radius: 8px; cursor: pointer; transition: all 0.2s ease;
}
.icon-btn:hover { background: var(--bg-primary); color: var(--text-primary); }

/* Tab */
.tab-wrapper { max-width: 1400px; margin: 0 auto; padding: 16px 24px 0; }
.tab-navigation {
  display: flex; gap: 4px; background: var(--bg-elevated);
  padding: 4px; border-radius: 12px; border: 1px solid var(--border-color);
}
.tab-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 10px 16px; border: none; background: transparent;
  border-radius: 8px; cursor: pointer; transition: all 0.2s;
  font-size: 0.875rem; color: var(--text-secondary);
}
.tab-btn:hover { color: var(--text-primary); background: var(--bg-primary); }
.tab-btn.active { background: var(--color-primary); color: white; }
.tab-icon { font-size: 1rem; }
.tab-count { font-size: 0.75rem; padding: 2px 8px; border-radius: 10px; background: rgba(255,255,255,0.2); }

/* Content */
.content-area { max-width: 1400px; margin: 0 auto; padding: 24px; }

.panel {
  background: var(--bg-elevated); border: 1px solid var(--border-color);
  border-radius: 16px; padding: 24px;
}

.panel-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px; padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}
.panel-header h3 { font-size: 1rem; font-weight: 700; margin: 0; }

.filters { display: flex; gap: 12px; }
.filters select {
  padding: 8px 14px; border: 1px solid var(--border-color); border-radius: 8px;
  font-size: 0.8125rem; cursor: pointer; background: var(--bg-primary); color: var(--text-primary);
}

/* Table */
.publish-table { overflow-x: auto; }
.publish-table table { width: 100%; border-collapse: collapse; }
.publish-table th, .publish-table td {
  padding: 14px 16px; text-align: left; border-bottom: 1px solid var(--border-color);
}
.publish-table th {
  font-weight: 500; color: var(--text-secondary); font-size: 0.8125rem;
  background: var(--bg-primary);
}
.publish-table td { font-size: 0.875rem; }

.title-cell .title { font-weight: 500; }
.platform-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.platform-tag {
  padding: 3px 10px; border-radius: 20px; font-size: 0.75rem;
  background: var(--bg-primary); color: var(--text-secondary);
}
.platform-tag.published { background: rgba(16, 185, 129, 0.15); color: var(--color-success); }
.platform-tag.failed { background: rgba(239, 68, 68, 0.15); color: var(--color-danger); }
.platform-tag.pending, .platform-tag.scheduled { background: rgba(245, 158, 11, 0.15); color: var(--color-warning); }

.status-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 500; }
.status-badge.draft { background: var(--bg-primary); color: var(--text-secondary); }
.status-badge.pending { background: rgba(245, 158, 11, 0.15); color: var(--color-warning); }
.status-badge.published { background: rgba(16, 185, 129, 0.15); color: var(--color-success); }
.status-badge.failed { background: rgba(239, 68, 68, 0.15); color: var(--color-danger); }

.time-cell { color: var(--text-secondary); font-size: 0.8125rem; }
.actions-cell { display: flex; gap: 8px; }

/* Pagination */
.pagination {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-color);
}
.total { font-size: 0.875rem; color: var(--text-secondary); }
.pagination-btns { display: flex; gap: 12px; align-items: center; }
.page-btn {
  padding: 8px 16px; background: var(--bg-elevated); color: var(--text-primary);
  border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.875rem;
  cursor: pointer; transition: all 0.2s;
}
.page-btn:hover:not(:disabled) { border-color: var(--color-primary); color: var(--color-primary); }
.page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.page-info { font-size: 0.875rem; color: var(--text-secondary); }

/* Form */
.publish-form, .export-form { display: flex; flex-direction: column; gap: 20px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group.full-width { grid-column: 1 / -1; }
.form-group label { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); }
.form-group .required { color: var(--color-danger); }
.form-group input, .form-group select, .form-group textarea {
  padding: 12px 14px; border: 1px solid var(--border-color); border-radius: 10px;
  font-size: 0.875rem; background: var(--bg-primary); color: var(--text-primary); outline: none;
  transition: border-color 0.2s;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--color-primary); }
.form-group textarea { resize: vertical; min-height: 120px; }

.form-section { margin-top: 8px; }
.form-section > label { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); display: block; margin-bottom: 12px; }
.form-section .section-hint { font-weight: 400; font-size: 0.75rem; color: var(--text-tertiary); margin-left: 8px; }
.media-section { margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--border-color); }

.platform-selection { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.platform-item {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 16px 12px; border: 1px solid var(--border-color); border-radius: 12px;
  cursor: pointer; transition: all 0.2s; position: relative; background: var(--bg-primary);
}
.platform-item:hover { border-color: var(--color-primary); }
.platform-item.selected { border-color: var(--color-primary); background: rgba(22, 93, 255, 0.1); }
.platform-icon { font-size: 1.5rem; }
.platform-logo { width: 32px; height: 32px; object-fit: contain; }
.platform-name { font-size: 0.75rem; color: var(--text-secondary); }
.platform-item.selected .platform-name { color: var(--color-primary); }
.check-mark {
  position: absolute; top: 6px; right: 6px; width: 18px; height: 18px;
  background: var(--color-primary); color: white; border-radius: 50%;
  font-size: 0.625rem; display: flex; align-items: center; justify-content: center;
}

.form-actions { margin-top: 24px; }
.form-actions .primary-btn { width: 100%; justify-content: center; padding: 14px; }

/* Quick Actions */
.quick-actions { margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border-color); }
.quick-actions h4 { font-size: 0.875rem; margin: 0 0 16px; }
.action-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.action-grid .secondary-btn { justify-content: center; }

/* Platform Grid */
.platforms-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.platform-card {
  display: flex; align-items: center; gap: 16px;
  padding: 20px; background: var(--bg-primary); border-radius: 12px;
}
.platform-icon-lg { font-size: 2rem; }
.platform-logo-lg { width: 40px; height: 40px; object-fit: contain; }
.platform-info { flex: 1; }
.platform-info h4 { font-size: 0.9375rem; margin: 0 0 4px; }
.status-indicator { font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; }
.status-indicator.connected { background: rgba(16, 185, 129, 0.15); color: var(--color-success); }
.status-indicator.disconnected { background: rgba(239, 68, 68, 0.15); color: var(--color-danger); }

/* Empty & Loading */
.empty-state, .loading-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 80px 24px; gap: 16px; color: var(--text-tertiary); text-align: center;
}
.empty-state h4 { font-size: 1rem; margin: 0; color: var(--text-primary); }
.empty-state p { font-size: 0.875rem; color: var(--text-secondary); margin: 0; }

.loading-spinner {
  width: 40px; height: 40px; border: 3px solid var(--border-color);
  border-top-color: var(--color-primary); border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.loading-spinner-sm {
  width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
  backdrop-filter: blur(4px);
}
.modal-content {
  background: var(--bg-elevated); border-radius: 20px;
  width: 560px; max-width: 90vw; border: 1px solid var(--border-color);
}
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 24px; border-bottom: 1px solid var(--border-color);
}
.modal-header h3 { font-size: 1rem; font-weight: 700; margin: 0; }
.close-btn {
  width: 32px; height: 32px; border: none; background: var(--bg-primary);
  border-radius: 50%; font-size: 1.25rem; color: var(--text-secondary); cursor: pointer;
}
.modal-body { padding: 24px; }
.detail-section { margin-bottom: 20px; }
.detail-section:last-child { margin-bottom: 0; }
.detail-section h4 { font-size: 0.875rem; margin: 0 0 12px; }
.detail-section dl { margin: 0; }
.detail-section dt { font-weight: 500; color: var(--text-secondary); font-size: 0.8125rem; margin-bottom: 4px; }
.detail-section dd { margin: 0 0 10px; font-size: 0.875rem; }
.platform-results { display: flex; flex-direction: column; gap: 8px; }
.result-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; background: var(--bg-primary); border-radius: 8px; }

/* Toast */
.toast {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  padding: 12px 24px; background: var(--bg-elevated); color: var(--text-primary);
  border-radius: 10px; font-size: 0.875rem; z-index: 1001;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}
.toast.success { background: var(--color-success); color: white; }
.toast.error { background: var(--color-danger); color: white; }

.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(20px); }
.modal-enter-active, .modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
