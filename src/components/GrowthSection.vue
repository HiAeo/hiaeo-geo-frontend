<template>
  <section id="cases" class="py-14">
    <div class="max-w-7xl mx-auto px-6">

      <!-- Section header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
          从新手到优秀，<br />每一步都有标准动作
        </h2>
        <p class="text-gray-500 text-lg max-w-2xl mx-auto">
          行业范本、真实案例、AI智能引导，让你的GEO优化不再从零摸索
        </p>
      </div>

      <!-- Tabbed card -->
      <div class="glass-card p-8 rounded-2xl max-w-5xl mx-auto">

        <!-- Tab switcher: stages + cases -->
        <div class="flex items-center gap-2 mb-8 flex-wrap">
          <button
            v-for="(stage,i) in stages"
            :key="stage.name"
            @click="activeTab = 'stage-'+i"
            class="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            :class="activeTab === 'stage-'+i ? 'text-white' : 'bg-gray-100 text-gray-500'"
            :style="activeTab === 'stage-'+i ? `background:${stage.color};` : ''"
          >
            {{ stage.num }} · {{ stage.name }}
          </button>
          <button
            v-for="c in cases"
            :key="'case-'+c.company"
            @click="activeTab = 'case-'+c.company"
            class="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            :class="activeTab === 'case-'+c.company ? 'text-white' : 'bg-gray-100 text-gray-500'"
            :style="activeTab === 'case-'+c.company ? `background:${c.color};` : ''"
          >
            案例
          </button>
        </div>

        <!-- Stage detail view -->
        <div v-for="(stage,i) in stages" :key="stage.name"
          v-show="activeTab === 'stage-'+i"
          class="p-6 rounded-2xl"
          :style="`border:2px solid ${stage.color}20;background:${stage.color}08;`">
          <div class="flex items-center gap-4 mb-5">
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
              :style="{ background: stage.color }">
              {{ stage.num }}
            </div>
            <div>
              <div class="text-lg font-bold text-gray-900">{{ stage.name }}</div>
              <div class="text-sm" :style="{ color: stage.color }">GEO分 {{ stage.score }}</div>
            </div>
          </div>
          <div class="space-y-3">
            <div v-for="task in stage.tasks" :key="task"
              class="flex items-center gap-3 p-3 rounded-xl"
              style="background:white;border:1px solid #F0F0F0;">
              <div class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ background: stage.color }"/>
              <span class="text-sm text-gray-600">{{ task }}</span>
            </div>
          </div>
        </div>

        <!-- Case studies view -->
        <div v-for="c in cases" :key="'detail-'+c.company"
          v-show="activeTab === 'case-'+c.company"
          class="p-6 rounded-2xl"
          :style="`border:2px solid ${c.color}20;background:${c.color}08;`">
          <!-- Company header -->
          <div class="flex items-center gap-4 mb-5">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white"
              :style="{ background: c.color }">
              {{ c.company[0] }}
            </div>
            <div>
              <div class="text-lg font-bold text-gray-900">{{ c.company }}</div>
              <div class="text-sm text-gray-400">{{ c.industry }}</div>
            </div>
          </div>
          <!-- Metrics -->
          <div class="grid grid-cols-2 gap-4 mb-5">
            <div v-for="m in c.metrics" :key="m.label"
              class="p-4 rounded-xl bg-white border border-gray-100">
              <div class="text-lg font-bold" :style="{ color: c.color }">
                {{ m.before }} <span class="text-gray-300 font-normal">→</span> {{ m.after }}
              </div>
              <div class="text-xs text-gray-400 mt-0.5">{{ m.label }}</div>
            </div>
          </div>
          <!-- Quote -->
          <p class="text-sm text-gray-500 italic leading-relaxed p-4 rounded-xl bg-white border border-gray-100">
            "{{ c.quote }}"
          </p>
        </div>

        <!-- All stages overview (shown when activeTab is empty/default) -->
        <div v-if="activeTab === ''" class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="(stage,i) in stages" :key="stage.name"
            class="p-5 rounded-xl text-center cursor-pointer transition-all duration-200"
            style="background:#FAFAFA;border:1px solid #F0F0F0;"
            @click="activeTab = 'stage-'+i">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white mx-auto mb-3"
              :style="{ background: stage.color }">
              {{ stage.num }}
            </div>
            <div class="text-sm font-semibold text-gray-900 mb-1">{{ stage.name }}</div>
            <div class="text-xs" :style="{ color: stage.color }">GEO分 {{ stage.score }}</div>
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