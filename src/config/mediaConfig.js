// GEO核心信源媒体配置
// 包含顶级权威信源和官方权威信源分类

export const mediaCategories = [
  {
    id: 'top-authority',
    name: '顶级权威信源',
    description: 'AI优先采信的权威媒体',
    icon: '🏆',
    isDefault: true
  },
  {
    id: 'official-authority',
    name: '官方权威信源',
    description: '官方平台和权威信息源',
    icon: '📢',
    isDefault: false
  },
  {
    id: 'social-platforms',
    name: '社交媒体平台',
    description: '社交和内容平台',
    icon: '📱',
    isDefault: false
  },
  {
    id: 'local-media',
    name: '地方媒体',
    description: '地方新闻和垂直媒体',
    icon: '🏠',
    isDefault: false
  }
]

// 顶级权威信源
export const topAuthorityMedia = [
  {
    id: 'xinhuanet',
    name: '新华网',
    url: 'https://www.xinhuanet.com/',
    logo: '/media-logos/xinhuanet.svg',
    category: 'top-authority',
    priority: 1,
    description: '国家级权威新闻媒体'
  },
  {
    id: 'people',
    name: '人民网',
    url: 'https://www.people.com.cn/',
    logo: '/media-logos/people.svg',
    category: 'top-authority',
    priority: 2,
    description: '人民日报社主办的新闻网站'
  },
  {
    id: 'cctv',
    name: '央视网',
    url: 'https://www.cctv.com/',
    logo: '/media-logos/cctv.svg',
    category: 'top-authority',
    priority: 3,
    description: '中央广播电视总台官方网站'
  },
  {
    id: 'guangming',
    name: '光明网',
    url: 'https://www.gmw.cn/',
    logo: '/media-logos/guangming.svg',
    category: 'top-authority',
    priority: 4,
    description: '光明日报社主办的综合性新闻网站'
  },
  {
    id: 'chinanews',
    name: '中国新闻网',
    url: 'https://www.chinanews.com.cn/',
    logo: '/media-logos/chinanews.svg',
    category: 'top-authority',
    priority: 5,
    description: '中国新闻社主办的综合新闻网站'
  },
  {
    id: 'chinadaily',
    name: '中国日报网',
    url: 'https://www.chinadaily.com.cn/',
    logo: '/media-logos/chinadaily.svg',
    category: 'top-authority',
    priority: 6,
    description: '中国日报社主办的英文新闻网站'
  }
]

// 官方权威信源
export const officialAuthorityMedia = [
  {
    id: 'baidu-baike',
    name: '百度百科',
    url: 'https://baike.baidu.com/',
    logo: '/media-logos/baidu-baike.svg',
    category: 'official-authority',
    priority: 1,
    description: '权威百科知识平台'
  },
  {
    id: 'sogou-baike',
    name: '搜狗百科',
    url: 'https://baike.sogou.com/',
    logo: '/media-logos/baidu-baike.svg',
    category: 'official-authority',
    priority: 2,
    description: '搜狗旗下的百科知识平台'
  },
  {
    id: 'tianyancha',
    name: '企查查/天眼查',
    url: 'https://www.tianyancha.com/',
    logo: '/media-logos/tianyancha.svg',
    category: 'official-authority',
    priority: 3,
    description: '企业信息查询平台'
  },
  {
    id: 'whitepaper',
    name: '行业白皮书平台',
    url: 'https://www.analysys.cn/',
    logo: '/media-logos/whitepaper.svg',
    category: 'official-authority',
    priority: 4,
    description: '行业报告和白皮书发布平台'
  }
]

// 社交媒体平台
export const socialPlatformMedia = [
  {
    id: 'weibo',
    name: '微博',
    url: 'https://weibo.com/',
    logo: '/media-logos/微博.svg',
    category: 'social-platforms',
    priority: 1,
    description: '品牌新闻、热点话题、用户互动'
  },
  {
    id: 'douyin',
    name: '抖音',
    url: 'https://www.douyin.com/',
    logo: '/media-logos/抖音.svg',
    category: 'social-platforms',
    priority: 2,
    description: '品牌视频、产品演示、全域流量'
  },
  {
    id: 'xiaohongshu',
    name: '小红书',
    url: 'https://www.xiaohongshu.com/',
    logo: '/media-logos/小红书.svg',
    category: 'social-platforms',
    priority: 3,
    description: '种草社区、用户口碑、时尚生活'
  },
  {
    id: 'bilibili',
    name: '哔哩哔哩',
    url: 'https://www.bilibili.com/',
    logo: '/media-logos/哔哩哔哩.svg',
    category: 'social-platforms',
    priority: 4,
    description: '年轻用户聚集的视频平台'
  },
  {
    id: 'kuaishou',
    name: '快手',
    url: 'https://www.kuaishou.com/',
    logo: '/media-logos/快手.svg',
    category: 'social-platforms',
    priority: 5,
    description: '短视频平台、下沉市场覆盖'
  },
  {
    id: 'hupu',
    name: '虎扑',
    url: 'https://www.hupu.com/',
    logo: '/media-logos/虎扑.svg',
    category: 'social-platforms',
    priority: 6,
    description: '体育社区、用户评论'
  },
  {
    id: 'douban',
    name: '豆瓣',
    url: 'https://www.douban.com/',
    logo: '/media-logos/豆瓣.svg',
    category: 'social-platforms',
    priority: 7,
    description: '兴趣社区、用户评分'
  },
  {
    id: 'toutiao',
    name: '今日头条',
    url: 'https://www.toutiao.com/',
    logo: '/media-logos/今日头条.svg',
    category: 'social-platforms',
    priority: 8,
    description: '资讯平台、智能推荐'
  }
]

// 地方媒体（用于扩展）
export const localMedia = [
  {
    id: 'dianping',
    name: '大众点评',
    url: 'https://www.dianping.com/',
    logo: '/media-logos/dianping.svg',
    category: 'local-media',
    priority: 1,
    description: '本地品牌口碑、用户评价'
  }
]

// 所有媒体汇总
export const allMedia = [
  ...topAuthorityMedia,
  ...officialAuthorityMedia,
  ...socialPlatformMedia,
  ...localMedia
]

// 根据分类获取媒体
export const getMediaByCategory = (categoryId) => {
  return allMedia.filter(media => media.category === categoryId)
}

// 根据ID获取媒体
export const getMediaById = (id) => {
  return allMedia.find(media => media.id === id)
}

// 默认选中的媒体（顶级权威信源）
export const defaultSelectedMedia = topAuthorityMedia.map(m => m.id)
