<template>
  <section id="cases" class="py-28">
    <div class="max-w-7xl mx-auto px-6">

      <div class="text-center mb-16">
        <h2 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
          从新手到优秀，<br />每一步都有标准动作
        </h2>
        <p class="text-gray-500 text-lg">行业范本、真实案例、AI智能引导，让你的GEO优化不再从零摸索</p>
      </div>

      <!-- Growth stages -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16 max-w-5xl mx-auto">
        <div v-for="(stage, i) in stages" :key="stage.name"
          class="relative flex flex-col items-center text-center gap-4">

          <!-- Connector line -->
          <div v-if="i < stages.length-1"
            class="absolute top-5 -right-2.5 w-5 h-px z-10" style="background:#D1D5DB;"/>

          <!-- Card -->
          <div class="w-full glass-card p-6 flex flex-col items-center gap-3"
            :style="i === 3 ? 'border-color:rgba(22,93,255,0.30);border-width:2px;' : ''">
            <!-- Stage number -->
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
              :style="i === 3 ? 'background:#165DFF;' : 'background:#F3F4F6;color:#374151;'">
              {{ stage.num }}
            </div>
            <!-- Stage name -->
            <div class="text-sm font-semibold text-gray-900">{{ stage.name }}</div>
            <!-- Score range -->
            <div class="text-xs font-medium px-3 py-1 rounded-full"
              :style="i === 3
                ? 'background:rgba(22,93,255,0.10);color:#165DFF;'
                : 'background:#F3F4F6;color:#6B7280;'">
              GEO分 {{ stage.score }}
            </div>
            <!-- Core tasks -->
            <div class="w-full space-y-1.5 text-left">
              <div v-for="task in stage.tasks" :key="task" class="text-xs text-gray-500 pl-3 relative">
                <span class="absolute -left-0.5 top-1.5 w-1 h-1 rounded-full" style="background:#165DFF;"/>
                {{ task }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Case studies -->
      <div>
        <h3 class="text-2xl font-bold text-gray-900 mb-8 text-center">真实案例 · 优化效果可量化</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div v-for="c in cases" :key="c.company"
            class="glass-card p-6 flex flex-col gap-4">
            <!-- Company info -->
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                :style="{ background: c.color }">
                {{ c.company[0] }}
              </div>
              <div>
                <div class="text-sm font-semibold text-gray-900">{{ c.company }}</div>
                <div class="text-xs text-gray-400">{{ c.industry }}</div>
              </div>
            </div>

            <!-- Metrics improvement -->
            <div class="grid grid-cols-2 gap-3">
              <div v-for="m in c.metrics" :key="m.label"
                class="p-3 rounded-xl" style="background:#FAFAFA;">
                <div class="text-lg font-bold" :style="{ color: c.color }">{{ m.before }}→{{ m.after }}</div>
                <div class="text-xs text-gray-400 mt-0.5">{{ m.label }}</div>
              </div>
            </div>

            <!-- Quote -->
            <p class="text-xs text-gray-500 italic leading-relaxed border-t border-gray-100 pt-3">
              "{{ c.quote }}"
            </p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
const stages = [
  {
    num: '01', name: '新手', score: '< 40',
    tasks: ['完成首次模镜诊断', '了解7维度评分体系', '熟悉Hub看板基础操作'],
  },
  {
    num: '02', name: '入门', score: '40-60',
    tasks: ['梳理核心问题清单', '审核首批模豆策略', '发布第一篇GEO内容'],
  },
  {
    num: '03', name: '达标', score: '60-80',
    tasks: ['执行2周GEO优化', '对比优化前后数据', '建立内容发布节奏'],
  },
  {
    num: '04', name: '优秀', score: '≥ 80',
    tasks: ['全引擎提及率领先', '竞品压制效果显著', '建立内容实验体系'],
  },
]

const cases = [
  {
    company: '苏州某 SaaS 企业', industry: '企业服务 · B2B',
    color: '#165DFF',
    metrics: [
      { label: 'DeepSeek提及率', before: '18%', after: '72%' },
      { label: 'GEO健康分', before: '42', after: '81' },
    ],
    quote: '3个月内，品牌在DeepSeek的回答质量从行业倒数跃升至前三，竞品替代风险指数下降60%。',
  },
  {
    company: '深圳某智能硬件商', industry: '消费电子 · B2C',
    color: '#10B981',
    metrics: [
      { label: '豆包种草转化', before: '2.1%', after: '8.7%' },
      { label: '官网引流增量', before: '+0', after: '+340%' },
    ],
    quote: '豆包用户推荐率从2%提升至8.7%，618大促期间官网UV增长340%。',
  },
  {
    company: '杭州某医美机构', industry: '医疗健康 · 本地生活',
    color: '#8B5CF6',
    metrics: [
      { label: 'Kimi口碑评分', before: '51', after: '79' },
      { label: '替代风险指数', before: '78', after: '31' },
    ],
    quote: 'Kimi口碑评分大幅提升，竞品替代风险从高危降至中低，成功守住本地市场认知。',
  },
]
</script>