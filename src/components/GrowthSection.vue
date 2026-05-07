<template>
  <section id="cases" class="py-20 relative growth-section">
    <div class="max-w-7xl mx-auto px-6">

      <!-- Section header -->
      <div class="text-center mb-16">
        <span class="inline-block px-4 py-1.5 rounded-full text-xs font-medium mb-6 growth-badge scroll-animate">
          客户成长路径
        </span>
        <h2 class="text-4xl sm:text-5xl font-bold mb-4 growth-title scroll-animate delay-100">
          从新手到优秀，<br />每一步都有标准动作
        </h2>
        <p class="text-lg max-w-2xl mx-auto growth-desc scroll-animate delay-200">
          行业范本、真实案例、AI智能引导，让你的GEO优化不再从零摸索
        </p>
      </div>

      <!-- Card outer -->
      <div class="max-w-5xl mx-auto">
        <div class="growth-card scroll-animate delay-300">

          <!-- Tab switcher: stages + cases -->
          <div class="flex items-center gap-2 mb-8 flex-wrap">
            <button
              v-for="(stage,i) in stages"
              :key="stage.name"
              @click="activeTab = 'stage-'+i"
              class="growth-tab px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              :class="activeTab === 'stage-'+i ? 'growth-tab-active' : 'growth-tab-inactive'"
              :style="activeTab === 'stage-'+i ? `background:${stage.color};` : ''"
            >
              {{ stage.num }} · {{ stage.name }}
            </button>
            <button
              v-for="c in cases"
              :key="'case-'+c.company"
              @click="activeTab = 'case-'+c.company"
              class="growth-tab px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              :class="activeTab === 'case-'+c.company ? 'growth-tab-active' : 'growth-tab-inactive'"
              :style="activeTab === 'case-'+c.company ? `background:${c.color};` : ''"
            >
              案例
            </button>
          </div>

          <!-- Stage detail view -->
          <div v-for="(stage,i) in stages" :key="stage.name"
            v-show="activeTab === 'stage-'+i"
            class="p-6 rounded-2xl transition-all duration-300 growth-stage-card"
            :style="`border-color: ${stage.color}30;`">
            <div class="flex items-center gap-3 mb-4 group cursor-pointer">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-transform duration-300 group-hover:scale-110"
                :style="{ background: stage.color, color: 'white' }">
                {{ stage.num }}
              </div>
              <div>
                <div class="text-sm font-bold growth-stage-title">{{ stage.name }}</div>
                <div class="text-xs" :style="{ color: stage.color }">GEO分 {{ stage.score }}</div>
              </div>
            </div>
            <div class="space-y-2">
              <div v-for="task in stage.tasks" :key="task"
                class="flex items-center gap-2.5 p-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer growth-task-item">
                <div class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ background: stage.color }"/>
                <span class="text-sm growth-task-text">{{ task }}</span>
              </div>
            </div>
          </div>

          <!-- Case studies view -->
          <div v-for="c in cases" :key="'detail-'+c.company"
            v-show="activeTab === 'case-'+c.company"
            class="p-6 rounded-2xl transition-all duration-300 growth-case-card"
            :style="`border-color: ${c.color}30;`">
            <div class="flex items-center gap-3 mb-4 group cursor-pointer">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-transform duration-300 group-hover:scale-110"
                :style="{ background: c.color, color: 'white' }">
                {{ c.company[0] }}
              </div>
              <div>
                <div class="text-sm font-bold growth-stage-title">{{ c.company }}</div>
                <div class="text-xs growth-industry">{{ c.industry }}</div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3 mb-4">
              <div v-for="m in c.metrics" :key="m.label"
                class="p-4 rounded-xl transition-all duration-200 hover:scale-105 cursor-pointer growth-metric-card">
                <div class="text-xl font-bold" :style="{ color: c.color }">
                  {{ m.before }} <span class="growth-arrow">→</span> {{ m.after }}
                </div>
                <div class="text-xs mt-1 growth-metric-label">{{ m.label }}</div>
              </div>
            </div>
            <p class="text-sm italic leading-relaxed p-4 rounded-xl growth-quote">
              "{{ c.quote }}"
            </p>
          </div>

          <!-- All stages overview (shown when no tab selected) -->
          <div v-if="activeTab === ''" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="(stage,i) in stages" :key="stage.name"
              class="p-5 rounded-xl text-center cursor-pointer transition-all duration-300 hover:scale-105 growth-overview-card"
              @click="activeTab = 'stage-'+i">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3"
                :style="{ background: stage.color, color: 'white' }">
                {{ stage.num }}
              </div>
              <div class="text-sm font-semibold mb-1 growth-stage-title">{{ stage.name }}</div>
              <div class="text-xs" :style="{ color: stage.color }">GEO分 {{ stage.score }}</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('')

const stages = [
  { num: '01', name: '新手', score: '< 40', color: '#6B7280',
    tasks: ['完成首次模镜诊断', '了解7维度评分体系', '熟悉Hub看板基础操作'] },
  { num: '02', name: '入门', score: '40-60', color: '#F59E0B',
    tasks: ['梳理核心问题清单', '审核首批模豆策略', '发布第一篇GEO内容'] },
  { num: '03', name: '达标', score: '60-80', color: '#165DFF',
    tasks: ['执行2周GEO优化', '对比优化前后数据', '建立内容发布节奏'] },
  { num: '04', name: '优秀', score: '≥ 80', color: '#10B981',
    tasks: ['全引擎提及率领先', '竞品压制效果显著', '建立内容实验体系'] },
]

const cases = [
  { company: '苏州某 SaaS 企业', industry: '企业服务 · B2B', color: '#165DFF',
    metrics: [
      { label: 'DeepSeek提及率', before: '18%', after: '72%' },
      { label: 'GEO健康分', before: '42', after: '81' },
    ],
    quote: '3个月内，品牌在DeepSeek的回答质量从行业倒数跃升至前三，竞品替代风险指数下降60%。' },
  { company: '深圳某智能硬件商', industry: '消费电子 · B2C', color: '#10B981',
    metrics: [
      { label: '豆包种草转化', before: '2.1%', after: '8.7%' },
      { label: '官网引流增量', before: '+0', after: '+340%' },
    ],
    quote: '豆包用户推荐率从2%提升至8.7%，618大促期间官网UV增长340%。' },
  { company: '杭州某医美机构', industry: '医疗健康 · 本地生活', color: '#8B5CF6',
    metrics: [
      { label: 'Kimi口碑评分', before: '51', after: '79' },
      { label: '替代风险指数', before: '78', after: '31' },
    ],
    quote: 'Kimi口碑评分大幅提升，竞品替代风险从高危降至中低，成功守住本地市场认知。' },
]
</script>

<style scoped>
.growth-section {
  background: var(--bg-primary);
}

.growth-badge {
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.growth-title {
  color: var(--text-primary);
}

.growth-desc {
  color: var(--text-secondary);
}

.growth-card {
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 36px;
}

.growth-tab-active {
  color: white;
}

.growth-tab-inactive {
  background: var(--bg-glass);
  color: var(--text-secondary);
}

.growth-stage-card {
  background: var(--bg-glass);
}

.growth-case-card {
  background: var(--bg-glass);
}

.growth-stage-title {
  color: var(--text-primary);
}

.growth-task-item {
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
}

.growth-task-text {
  color: var(--text-secondary);
}

.growth-industry {
  color: var(--text-tertiary);
}

.growth-metric-card {
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
}

.growth-arrow {
  color: var(--text-tertiary);
  font-weight: 400;
}

.growth-metric-label {
  color: var(--text-tertiary);
}

.growth-quote {
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.growth-overview-card {
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
}
</style>
