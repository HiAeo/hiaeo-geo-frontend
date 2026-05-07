<template>
  <section id="cases-detail" class="py-20 relative cases-detail-section">
    <div class="max-w-6xl mx-auto px-6">

      <!-- Section header -->
      <div class="text-center mb-16">
        <span class="inline-block px-4 py-1.5 rounded-full text-xs font-medium mb-6 cases-badge scroll-animate">
          客户案例
        </span>
        <h2 class="text-4xl sm:text-5xl font-bold mb-4 cases-title scroll-animate delay-100">
          真实案例 · 可见效果
        </h2>
        <p class="text-lg max-w-2xl mx-auto cases-desc scroll-animate delay-200">
          来自不同行业的客户通过魔鲸 GEO Claw 实现了 AI 可见度的大幅提升
        </p>
      </div>

      <!-- Industry filter -->
      <div class="flex flex-wrap justify-center gap-3 mb-12 scroll-animate">
        <button 
          v-for="industry in industries" 
          :key="industry"
          class="industry-btn"
          :class="{ active: activeIndustry === industry }"
          @click="activeIndustry = industry"
        >
          {{ industry }}
        </button>
      </div>

      <!-- Cases grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 stagger-children scroll-animate">
        <div 
          v-for="caseItem in filteredCases" 
          :key="caseItem.id" 
          class="case-card"
        >
          <div class="case-header">
            <div class="case-industry-tag" :style="{ background: caseItem.industryColor }">
              {{ caseItem.industry }}
            </div>
            <span class="case-date">{{ caseItem.date }}</span>
          </div>
          
          <div class="case-content">
            <div class="case-logo" :style="{ borderColor: caseItem.logoColor }">
              <svg :style="{ color: caseItem.logoColor }" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" v-html="caseItem.logoIcon"></svg>
            </div>
            <div class="case-info">
              <h3 class="case-company">{{ caseItem.company }}</h3>
              <p class="case-product">{{ caseItem.product }}</p>
            </div>
          </div>

          <p class="case-desc">{{ caseItem.desc }}</p>

          <!-- Metrics -->
          <div class="case-metrics">
            <div v-for="metric in caseItem.metrics" :key="metric.label" class="metric-item">
              <div class="metric-value" :style="{ color: metric.color }">
                {{ metric.value }}
              </div>
              <div class="metric-label">{{ metric.label }}</div>
            </div>
          </div>

          <!-- Results -->
          <div class="case-results">
            <h4 class="results-title">主要成果</h4>
            <ul class="results-list">
              <li v-for="result in caseItem.results" :key="result">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {{ result }}
              </li>
            </ul>
          </div>

        </div>
      </div>

      <!-- CTA -->
      <div class="text-center mt-16 scroll-animate">
        <p class="cases-cta-text">
          想了解这些企业是如何做到的？
        </p>
        <button class="cases-cta-btn" @click="$emit('openContact')">
          预约咨询
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

defineEmits(['openContact'])

const industries = ['全部', '科技', '金融', '医疗', '电商', '教育']
const activeIndustry = ref('全部')

const cases = [
  {
    id: 1,
    company: '某智能汽车品牌',
    product: '新能源汽车 · 智能座舱',
    logoIcon: '<path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6"/><path d="M7 8l4 -2h5l3 2v6h-4"/>',
    logoColor: '#10B981',
    industry: '科技',
    industryColor: 'rgba(16, 185, 129, 0.15)',
    date: '2024.12',
    desc: '该品牌在新能源智能汽车领域具有领先技术，但在 AI 搜索中的可见度较低，影响了潜在客户的获取。',
    metrics: [
      { label: 'DeepSeek曝光', value: '+180%', color: '#10B981' },
      { label: '豆包提及', value: '+95%', color: '#165DFF' },
      { label: '官网引流', value: '+220%', color: '#8B5CF6' }
    ],
    results: [
      '在 DeepSeek 等主流 AI 引擎的品牌提及率提升 180%',
      '智能座舱功能相关关键词排名进入 Top 3',
      '官网自然流量增长 220%'
    ]
  },
  {
    id: 2,
    company: '某在线教育平台',
    product: 'K12 在线辅导 · 职业教育',
    logoIcon: '<path d="M4 19.5v-15a2.5 2.5 0 0 1 2.5 -2.5h11a2.5 2.5 0 0 1 2.5 2.5v15a2.5 2.5 0 0 1 -2.5 2.5h-11a2.5 2.5 0 0 1 -2.5 -2.5z"/><path d="M8.5 6h7"/><path d="M8.5 10h7"/><path d="M8.5 14h4"/>',
    logoColor: '#F59E0B',
    industry: '教育',
    industryColor: 'rgba(245, 158, 11, 0.15)',
    date: '2024.11',
    desc: '面临 AI 搜索时代流量分散的挑战，需要在新的搜索场景中建立品牌认知。',
    metrics: [
      { label: 'AI提及率', value: '+156%', color: '#F59E0B' },
      { label: '课程咨询', value: '+89%', color: '#EF4444' },
      { label: '品牌搜索', value: '+134%', color: '#8B5CF6' }
    ],
    results: [
      '高考志愿填报相关查询中品牌曝光提升 156%',
      '职业教育课程咨询转化率提升 89%',
      '通过 AI 引擎带来的付费用户增长 45%'
    ]
  },
  {
    id: 3,
    company: '某金融科技公司',
    product: '智能投顾 · 财富管理',
    logoIcon: '<path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M3 21h18"/><path d="M9 9h.01"/><path d="M15 9h.01"/><path d="M8 14s1.5 2 4 2s4-2 4-2"/><path d="M5 21v-4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/>',
    logoColor: '#8B5CF6',
    industry: '金融',
    industryColor: 'rgba(22, 93, 255, 0.15)',
    date: '2024.10',
    desc: '金融行业合规要求高，需要在 AI 搜索中建立专业可信的品牌形象。',
    metrics: [
      { label: 'Kimi曝光', value: '+210%', color: '#165DFF' },
      { label: '品牌词检索', value: '+167%', color: '#8B5CF6' },
      { label: '转化率', value: '+78%', color: '#10B981' }
    ],
    results: [
      '智能投顾相关内容在多个 AI 引擎获得高权重',
      '品牌词自然搜索量增长 167%',
      '从 AI 引擎引流的用户付费转化率提升 78%'
    ]
  },
  {
    id: 4,
    company: '某医疗器械企业',
    product: '高端医疗设备 · 家用健康',
    logoIcon: '<path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M12 7a4 4 0 0 1 4 4v3"/><path d="M12 7a4 4 0 0 0 -4 4v3"/><path d="M6 7m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M6 7l-2 5"/><path d="M18 7m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M18 7l2 5"/><path d="M9 21v-6"/><path d="M15 21v-6"/><path d="M6 12h12"/>',
    logoColor: '#EF4444',
    industry: '医疗',
    industryColor: 'rgba(239, 68, 68, 0.15)',
    date: '2024.09',
    desc: '医疗行业专业性强，需要通过 AI 搜索触达更多患者和医疗机构。',
    metrics: [
      { label: '专业认可', value: '+145%', color: '#EF4444' },
      { label: '机构咨询', value: '+112%', color: '#F59E0B' },
      { label: '官网访问', value: '+189%', color: '#165DFF' }
    ],
    results: [
      '在 AI 医疗相关问题回答中出现率提升 145%',
      '医疗器械采购咨询量增长 112%',
      '官网独立访客增长 189%'
    ]
  },
  {
    id: 5,
    company: '某时尚服饰品牌',
    product: '女装 · 配饰 · 跨境电商',
    logoIcon: '<path d="M6 2l.001 5.999a2 2 0 0 0 2 1.999h7.998a2 2 0 0 0 2-1.999l.001-5.999"/><path d="M6 9a6 6 0 0 0 12 0"/><path d="M6 9h12"/><path d="M5 15h14v5a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z"/>',
    logoColor: '#EC4899',
    industry: '电商',
    industryColor: 'rgba(236, 72, 153, 0.15)',
    date: '2024.11',
    desc: '时尚电商竞争激烈，需要在 AI 搜索中脱颖而出，建立独特的品牌形象。',
    metrics: [
      { label: '豆包种草', value: '+234%', color: '#EC4899' },
      { label: '小红书提及', value: '+189%', color: '#F472B6' },
      { label: 'GMV增长', value: '+67%', color: '#10B981' }
    ],
    results: [
      '「换季穿搭」相关 AI 查询中品牌曝光提升 234%',
      '小红书用户自发推荐增长 189%',
      '大促期间 AI 引流带来的 GMV 增长 67%'
    ]
  }
]

const filteredCases = computed(() => {
  if (activeIndustry.value === '全部') {
    return cases
  }
  return cases.filter(c => c.industry === activeIndustry.value)
})
</script>

<style scoped>
.cases-detail-section {
  background: var(--bg-primary);
}

.cases-badge {
  background: var(--color-primary-alpha);
  color: var(--color-primary);
  border: 1px solid var(--color-primary-alpha);
}

.cases-title {
  color: var(--text-primary);
}

.cases-desc {
  color: var(--text-secondary);
}

/* Industry filter */
.industry-btn {
  padding: 8px 20px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.industry-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.industry-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

/* Case card */
.case-card {
  padding: 28px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  transition: all 0.3s ease;
}

.case-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card);
  border-color: var(--color-primary-alpha);
}

.case-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.case-industry-tag {
  padding: 4px 12px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-primary);
  border-radius: 20px;
}

.case-date {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.case-content {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.case-logo {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--bg-elevated);
  border: 1.5px solid;
}

.case-company {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.case-product {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.case-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
}

/* Metrics */
.case-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 20px;
  background: var(--bg-elevated);
  border-radius: 12px;
  margin-bottom: 20px;
}

.metric-item {
  text-align: center;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
}

/* Results */
.case-results {
  border-top: 1px solid var(--border-color);
  padding-top: 20px;
}

.results-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.results-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.results-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.results-list svg {
  color: var(--color-primary);
  flex-shrink: 0;
  margin-top: 2px;
}

/* CTA */
.cases-cta-text {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.cases-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: white;
  background: var(--color-primary);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cases-cta-btn:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
}

@media (max-width: 640px) {
  .case-metrics {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .metric-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }
}
</style>
