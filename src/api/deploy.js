import request from './request'

export const deployApi = {
  // 获取已配置的目标平台列表
  getPlatforms: () => {
    return request('/deploy/platforms')
  },
  
  // 添加/更新平台配置
  savePlatform: (data) => {
    return request('/deploy/platforms', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  
  // 删除平台配置
  deletePlatform: (id) => {
    return request(`/deploy/platforms/${id}`, {
      method: 'DELETE'
    })
  },
  
  // 一键发布到目标平台
  deploy: (platformId, options = {}) => {
    return request('/deploy/execute', {
      method: 'POST',
      body: JSON.stringify({ platformId, ...options })
    })
  },
  
  // 批量发布到多个平台
  batchDeploy: (platformIds, options = {}) => {
    return request('/deploy/batch', {
      method: 'POST',
      body: JSON.stringify({ platformIds, ...options })
    })
  },
  
  // 获取发布任务状态
  getTaskStatus: (taskId) => {
    return request(`/deploy/tasks/${taskId}`)
  },
  
  // 获取发布历史记录
  getHistory: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/deploy/history${query ? '?' + query : ''}`)
  },
  
  // 回滚到指定版本
  rollback: (taskId) => {
    return request(`/deploy/rollback/${taskId}`, {
      method: 'POST'
    })
  },
  
  // 获取可用版本列表
  getVersions: (platformId) => {
    return request(`/deploy/versions/${platformId}`)
  },
  
  // 测试平台连接
  testConnection: (platformId) => {
    return request(`/deploy/platforms/${platformId}/test`, {
      method: 'POST'
    })
  }
}

// 平台类型枚举
export const PLATFORM_TYPES = {
  EDGEONE: 'edgeone',
  VERCEL: 'vercel',
  NETLIFY: 'netlify',
  AWS_S3: 'aws_s3',
  ALIYUN_OSS: 'aliyun_oss',
  TENCENT_COS: 'tencent_cos',
  CUSTOM: 'custom'
}

// 平台配置模板
export const PLATFORM_TEMPLATES = {
  [PLATFORM_TYPES.EDGEONE]: {
    name: 'EdgeOne Pages',
    icon: '⚡',
    color: '#1a73e8',
    fields: [
      { key: 'siteId', label: '站点 ID', type: 'text', required: true },
      { key: 'token', label: 'API Token', type: 'password', required: true },
      { key: 'branch', label: '分支', type: 'text', default: 'main' }
    ]
  },
  [PLATFORM_TYPES.VERCEL]: {
    name: 'Vercel',
    icon: '▲',
    color: '#000000',
    fields: [
      { key: 'token', label: 'Vercel Token', type: 'password', required: true },
      { key: 'projectId', label: '项目 ID', type: 'text', required: true },
      { key: 'teamId', label: '团队 ID (可选)', type: 'text', required: false }
    ]
  },
  [PLATFORM_TYPES.NETLIFY]: {
    name: 'Netlify',
    icon: 'N',
    color: '#00c7b7',
    fields: [
      { key: 'token', label: 'Netlify Token', type: 'password', required: true },
      { key: 'siteId', label: 'Site ID', type: 'text', required: true },
      { key: 'branch', label: '分支', type: 'text', default: 'main' }
    ]
  },
  [PLATFORM_TYPES.AWS_S3]: {
    name: 'AWS S3',
    icon: 'S3',
    color: '#ff9900',
    fields: [
      { key: 'accessKeyId', label: 'Access Key ID', type: 'text', required: true },
      { key: 'secretAccessKey', label: 'Secret Access Key', type: 'password', required: true },
      { key: 'region', label: '区域', type: 'select', options: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-northeast-1'], required: true },
      { key: 'bucket', label: 'Bucket 名称', type: 'text', required: true }
    ]
  },
  [PLATFORM_TYPES.ALIYUN_OSS]: {
    name: '阿里云 OSS',
    icon: '阿里',
    color: '#ff6a00',
    fields: [
      { key: 'accessKeyId', label: 'Access Key ID', type: 'text', required: true },
      { key: 'secretAccessKey', label: 'Access Key Secret', type: 'password', required: true },
      { key: 'region', label: '区域', type: 'text', placeholder: 'oss-cn-hangzhou', required: true },
      { key: 'bucket', label: 'Bucket 名称', type: 'text', required: true }
    ]
  },
  [PLATFORM_TYPES.TENCENT_COS]: {
    name: '腾讯云 COS',
    icon: '腾讯',
    color: '#0099ff',
    fields: [
      { key: 'secretId', label: 'Secret ID', type: 'text', required: true },
      { key: 'secretKey', label: 'Secret Key', type: 'password', required: true },
      { key: 'region', label: '区域', type: 'text', placeholder: 'ap-guangzhou', required: true },
      { key: 'bucket', label: 'Bucket 名称', type: 'text', required: true }
    ]
  },
  [PLATFORM_TYPES.CUSTOM]: {
    name: '自定义部署',
    icon: '⚙',
    color: '#6366f1',
    fields: [
      { key: 'name', label: '平台名称', type: 'text', required: true },
      { key: 'deployCommand', label: '部署命令', type: 'textarea', placeholder: 'npm run deploy', required: true },
      { key: 'remoteUrl', label: '远程地址', type: 'text', placeholder: 'ssh user@host:/path', required: true }
    ]
  }
}

// 任务状态
export const TASK_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  ROLLBACK: 'rollback'
}
