<template>
  <section class="py-16">
    <div class="max-w-7xl mx-auto px-6">

      <!-- Section header -->
      <div class="text-center mb-16">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          <span style="font-weight:700">MiraSeek</span><span style="font-weight:400">模镜</span> · AI可见度诊断
        </h2>
        <p class="text-gray-500 text-lg max-w-2xl mx-auto">
          实时抓取 DeepSeek、豆包、Kimi 等主流大模型的回答数据<br />
          精准量化实体独占率与替代风险指数
        </p>
      </div>

      <!-- Tabbed card -->
      <div class="glass-card rounded-2xl max-w-5xl mx-auto transition-all duration-300 hover:shadow-lg">
        <div style="padding:48px;">
        <!-- Tab switcher -->
        <div class="flex items-center gap-2 mb-8">
          <button
            v-for="tab in ['健康分雷达','各引擎得分','问题优先级']"
            :key="tab"
            @click="activeTab = tab"
            class="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            :class="activeTab === tab ? 'text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
            :style="activeTab === tab ? 'background:#165DFF;' : ''"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Tab 1: 7-dimension radar -->
        <div v-if="activeTab === '健康分雷达'" class="flex flex-col items-center">
          <div class="max-w-sm transition-transform duration-300 hover:scale-105 cursor-pointer">
            <svg viewBox="0 0 200 200" class="w-full">
              <circle v-for="r in [20,40,60,80]" :key="r"
                cx="100" cy="100" r="r"
                fill="none" stroke="rgba(22,93,255,0.12)" stroke-width="1"/>
              <line v-for="i in 7" :key="i"
                x1="100" y1="100"
                :x2="100 + 80*Math.cos((i*51.4-90)*Math.PI/180)"
                :y2="100 + 80*Math.sin((i*51.4-90)*Math.PI/180)"
                stroke="rgba(22,93,255,0.10)" stroke-width="1"/>
              <polygon
                points="100,22 130,40 155,100 130,160 70,160 45,100 70,40"
                fill="rgba(22,93,255,0.15)"
                stroke="rgba(22,93,255,0.7)"
                stroke-width="1.5"/>
              <circle cx="100" cy="22" r="4" fill="#165DFF"/>
              <circle cx="130" cy="40" r="4" fill="#165DFF"/>
              <circle cx="155" cy="100" r="4" fill="#165DFF"/>
              <circle cx="130" cy="160" r="4" fill="#FB7185"/>
              <circle cx="70" cy="160" r="4" fill="#FB7185"/>
              <circle cx="100" cy="188" r="4" fill="#165DFF"/>
              <circle cx="45" cy="100" r="4" fill="#22D3EE"/>
              <text x="100" y="14"  text-anchor="middle" font-size="7" fill="#165DFF" font-weight="600">AI可见度 82</text>
              <text x="140" y="36"  text-anchor="start"  font-size="7" fill="rgba(0,0,0,0.4)">语义一致 71</text>
              <text x="165" y="100" text-anchor="start"  font-size="7" fill="rgba(0,0,0,0.4)">权威信号 65</text>
              <text x="140" y="164" text-anchor="start"  font-size="7" fill="#FB7185">竞品压制 58</text>
              <text x="100" y="196" text-anchor="middle" font-size="7" fill="rgba(0,0,0,0.4)">转化引导 74</text>
              <text x="60" y="164" text-anchor="end"     font-size="7" fill="rgba(0,0,0,0.4)">内容友好 80</text>
              <text x="35" y="100" text-anchor="end"     font-size="7" fill="#22D3EE">实体独占 68</text>
            </svg>
          </div>
          <!-- Score summary -->
          <div class="mt-6 flex items-center gap-8">
            <div class="text-center transition-transform duration-200 hover:scale-110 cursor-pointer">
              <div class="text-2xl font-bold" style="color:#22D3EE;">68</div>
              <div class="text-xs text-gray-400 mt-0.5">实体独占率</div>
            </div>
            <div class="w-px h-8 bg-gray-200"/>
            <div class="text-center transition-transform duration-200 hover:scale-110 cursor-pointer">
              <div class="text-2xl font-bold" style="color:#FB7185;">32</div>
              <div class="text-xs text-gray-400">替代风险</div>
            </div>
            <div class="w-px h-8 bg-gray-200"/>
            <div class="text-center transition-transform duration-200 hover:scale-110 cursor-pointer">
              <div class="text-2xl font-bold text-gray-900">72</div>
              <div class="text-xs text-gray-400">综合得分</div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Engine scores -->
        <div v-if="activeTab === '各引擎得分'" class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div v-for="engine in engineCards" :key="engine.name"
            class="p-5 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer"
            style="background:#FAFAFA;border:1px solid #F0F0F0;">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-medium text-gray-600">{{ engine.name }}</span>
              <div class="w-2 h-2 rounded-full" :style="{ background: engine.color }"/>
            </div>
            <div class="text-2xl font-bold text-gray-900 mb-2">{{ engine.score }}</div>
            <div class="h-1 rounded-full overflow-hidden" style="background:#F0F0F0;">
              <div class="h-full rounded-full transition-all duration-500" :style="{ width: engine.score+'%', background: engine.color }"/>
            </div>
            <div class="mt-2 text-xs" :style="{ color: engine.color }">
              {{ engine.trend > 0 ? '↑' : '↓' }}{{ Math.abs(engine.trend) }}% vs 上周
            </div>
          </div>
        </div>

        <!-- Tab 3: Problem priority list -->
        <div v-if="activeTab === '问题优先级'" class="space-y-3">
          <div v-for="problem in problems" :key="problem.id"
            class="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 cursor-pointer"
            style="background:#FAFAFA;border:1px solid #F0F0F0;">
            <span class="text-xs font-bold px-2.5 py-1 rounded-md shrink-0"
              :style="{ background: problem.bgColor, color: problem.color }">
              {{ problem.priority }}
            </span>
            <span class="text-sm text-gray-600 flex-1">{{ problem.text }}</span>
            <span class="text-xs text-gray-400 shrink-0">{{ problem.engine }}</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('健康分雷达')

const engineCards = [
  { name: 'DeepSeek',  score: 82, trend: 34, color: '#165DFF' },
  { name: '豆包',     score: 71, trend: 22, color: '#F59E0B' },
  { name: 'Kimi',     score: 65, trend: 18, color: '#8B5CF6' },
  { name: '文心一言', score: 58, trend: -5, color: '#EF4444' },
  { name: '通义千问', score: 49, trend:  9, color: '#10B981' },
  { name: '讯飞星火', score: 41, trend: 12, color: '#6B7280' },
]

const problems = [
  { id: 1, priority: 'P0', text: '品牌在Kimi「企业软件」类问题中被竞品A抢先占位', engine: 'Kimi',   color: '#EF4444', bgColor: 'rgba(239,68,68,0.10)' },
  { id: 2, priority: 'P0', text: '官网未配置JSON-LD结构化数据，AI难以识别核心实体', engine: '全引擎', color: '#EF4444', bgColor: 'rgba(239,68,68,0.10)' },
  { id: 3, priority: 'P1', text: '「智能客服」核心产品词在豆包中出现描述错误',     engine: '豆包',   color: '#F59E0B', bgColor: 'rgba(245,158,11,0.10)' },
  { id: 4, priority: 'P1', text: '官网缺少权威新闻引用，削弱AI权威性信号判断',     engine: 'DeepSeek', color: '#F59E0B', bgColor: 'rgba(245,158,11,0.10)' },
  { id: 5, priority: 'P2', text: 'FAQ板块缺失，导致长尾问题AI回答质量偏低',       engine: 'Kimi',   color: '#6B7280', bgColor: 'rgba(107,114,128,0.10)' },
]
</script>