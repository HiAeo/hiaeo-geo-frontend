<template>
  <section id="miraseek" class="py-16 mira-section">
    <div class="max-w-7xl mx-auto px-6">

      <!-- Section header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl sm:text-5xl font-bold mb-3 mira-title scroll-animate">
          <span style="font-weight:800">Mira</span><span style="font-weight:400">Seek</span>模镜 · AI可见度诊断
        </h2>
        <p class="text-lg max-w-2xl mx-auto mira-desc scroll-animate delay-100">
          实时抓取 DeepSeek、豆包、Kimi 等主流大模型的回答数据<br />
          精准量化实体独占率与替代风险指数
        </p>
      </div>

      <!-- Tabbed card -->
      <div class="mira-card rounded-2xl max-w-5xl mx-auto transition-all duration-300 scroll-animate delay-200">
        <div class="p-12">
        <!-- Tab switcher -->
        <div class="flex items-center gap-2 mb-8">
          <button
            v-for="tab in ['健康分雷达','各引擎得分','问题优先级']"
            :key="tab"
            @click="activeTab = tab"
            class="mira-tab px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            :class="{ 'mira-tab-active': activeTab === tab, 'mira-tab-inactive': activeTab !== tab }"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Tab 1: 7-dimension radar -->
        <div v-if="activeTab === '健康分雷达'" class="flex gap-6 flex-col lg:flex-row">
          <!-- Left: Radar chart -->
          <div class="shrink-0 transition-transform duration-300 hover:scale-[1.02] cursor-pointer mx-auto lg:mx-0">
            <svg viewBox="0 0 240 200" class="w-52">
              <!-- Grid circles -->
              <circle v-for="r in [20,40,60,80]" :key="r"
                cx="120" cy="100" :r="r"
                fill="none" stroke="rgba(22,93,255,0.12)" stroke-width="1"/>
              <!-- Axis lines -->
              <line v-for="i in 7" :key="i"
                x1="120" y1="100"
                :x2="120 + 80*Math.cos((i*51.4-90)*Math.PI/180)"
                :y2="100 + 80*Math.sin((i*51.4-90)*Math.PI/180)"
                stroke="rgba(22,93,255,0.10)" stroke-width="1"/>
              <!-- Radar polygon -->
              <polygon
                points="120,22 150,40 175,100 150,160 90,160 65,100 90,40"
                fill="rgba(22,93,255,0.15)"
                stroke="rgba(22,93,255,0.7)"
                stroke-width="1.5"/>
              <!-- Data points -->
              <circle cx="120" cy="22" r="4" fill="#165DFF"/>
              <circle cx="150" cy="40" r="4" fill="#165DFF"/>
              <circle cx="175" cy="100" r="4" fill="#165DFF"/>
              <circle cx="150" cy="160" r="4" fill="#FB7185"/>
              <circle cx="90" cy="160" r="4" fill="#165DFF"/>
              <circle cx="65" cy="100" r="4" fill="#22D3EE"/>
              <circle cx="90" cy="40" r="4" fill="#165DFF"/>
              <!-- Labels -->
              <text x="120" y="12" text-anchor="middle" font-size="7" fill="#165DFF" font-weight="600">AI可见度 82</text>
              <text x="158" y="36" text-anchor="start" font-size="7" class="svg-label">语义一致 71</text>
              <text x="182" y="100" text-anchor="start" font-size="7" class="svg-label">权威信号 65</text>
              <text x="158" y="168" text-anchor="start" font-size="7" fill="#FB7185">竞品压制 58</text>
              <text x="82" y="168" text-anchor="end" font-size="7" class="svg-label">内容友好 80</text>
              <text x="57" y="100" text-anchor="end" font-size="7" fill="#22D3EE">实体独占 68</text>
              <text x="82" y="36" text-anchor="end" font-size="7" class="svg-label">转化引导 74</text>
            </svg>
          </div>
          
          <!-- Right: Score details -->
          <div class="flex-1 flex flex-col gap-4">
            <!-- Top row: Overall score + 3 metrics -->
            <div class="flex gap-3 flex-wrap">
              <!-- Overall score card -->
              <div class="flex-1 min-w-[140px] p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer mira-metric-card">
                <div class="text-xs mb-1 mira-label">综合健康分</div>
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl font-bold mira-value">72</span>
                  <span class="text-xs px-2 py-0.5 rounded-full mira-badge-good">良好</span>
                </div>
              </div>
              
              <!-- 3 metric cards -->
              <div class="p-3 rounded-xl text-center transition-all duration-300 hover:scale-105 cursor-pointer mira-mini-card">
                <div class="text-lg font-bold mira-value-cyan">68</div>
                <div class="text-xs mira-label">实体独占</div>
              </div>
              <div class="p-3 rounded-xl text-center transition-all duration-300 hover:scale-105 cursor-pointer mira-mini-card">
                <div class="text-lg font-bold mira-value-red">32</div>
                <div class="text-xs mira-label">替代风险</div>
              </div>
              <div class="p-3 rounded-xl text-center transition-all duration-300 hover:scale-105 cursor-pointer mira-mini-card">
                <div class="text-lg font-bold mira-value-green">80</div>
                <div class="text-xs mira-label">内容友好</div>
              </div>
            </div>
            
            <!-- Optimization suggestions -->
            <div class="p-4 rounded-xl mira-suggestion">
              <div class="text-xs mb-3 mira-label">待优化维度</div>
              <div class="space-y-3">
                <div class="flex items-center gap-3 p-2 rounded-lg transition-all duration-200 cursor-pointer mira-progress-item">
                  <span class="text-sm w-20 mira-progress-label">竞品压制</span>
                  <div class="flex-1 h-2 rounded-full overflow-hidden mira-progress-bg">
                    <div class="h-full rounded-full transition-all duration-700 hover:opacity-80 mira-progress-bar" style="width:58%;background:#FB7185;"/>
                  </div>
                  <span class="text-sm font-bold w-8 text-right mira-value-red">58</span>
                </div>
                <div class="flex items-center gap-3 p-2 rounded-lg transition-all duration-200 cursor-pointer mira-progress-item">
                  <span class="text-sm w-20 mira-progress-label">权威信号</span>
                  <div class="flex-1 h-2 rounded-full overflow-hidden mira-progress-bg">
                    <div class="h-full rounded-full transition-all duration-700 hover:opacity-80 mira-progress-bar" style="width:65%;background:#F59E0B;"/>
                  </div>
                  <span class="text-sm font-bold w-8 text-right mira-value-orange">65</span>
                </div>
                <div class="flex items-center gap-3 p-2 rounded-lg transition-all duration-200 cursor-pointer mira-progress-item">
                  <span class="text-sm w-20 mira-progress-label">语义一致</span>
                  <div class="flex-1 h-2 rounded-full overflow-hidden mira-progress-bg">
                    <div class="h-full rounded-full transition-all duration-700 hover:opacity-80 mira-progress-bar" style="width:71%;background:#165DFF;"/>
                  </div>
                  <span class="text-sm font-bold w-8 text-right mira-value-blue">71</span>
                </div>
              </div>
            </div>
            
            <!-- Suggestion -->
            <div class="text-xs px-1 mira-hint">
              💡 建议优先优化「竞品压制」维度，可提升综合得分约8-12分
            </div>
          </div>
        </div>

        <!-- Tab 2: Engine scores -->
        <div v-if="activeTab === '各引擎得分'" class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div v-for="engine in engineCards" :key="engine.name"
            class="p-5 rounded-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer mira-engine-card">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-medium mira-text-secondary">{{ engine.name }}</span>
              <div class="w-2 h-2 rounded-full" :style="{ background: engine.color }"/>
            </div>
            <div class="text-2xl font-bold mb-2 mira-value">{{ engine.score }}</div>
            <div class="h-1 rounded-full overflow-hidden mira-progress-bg">
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
            class="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer mira-problem-item">
            <span class="text-xs font-bold px-2.5 py-1 rounded-md shrink-0"
              :style="{ background: problem.bgColor, color: problem.color }">
              {{ problem.priority }}
            </span>
            <span class="text-sm flex-1 mira-text-secondary">{{ problem.text }}</span>
            <span class="text-xs shrink-0 mira-text-tertiary">{{ problem.engine }}</span>
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

<style scoped>
/* Section backgrounds */
.mira-section {
  background: var(--bg-primary);
}

.mira-title {
  color: var(--text-primary);
}

.mira-desc {
  color: var(--text-secondary);
}

.mira-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-card);
}

.mira-tab-active {
  background: #165DFF;
  color: white;
}

.mira-tab-inactive {
  background: var(--bg-glass);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.mira-metric-card {
  background: rgba(22,93,255,0.1);
  border: 1px solid var(--border-color);
}

.mira-mini-card {
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
}

.mira-suggestion {
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
}

.mira-label {
  color: var(--text-tertiary);
}

.mira-value {
  color: var(--text-primary);
}

.mira-badge-good {
  background: rgba(16,185,129,0.15);
  color: #10B981;
}

.mira-value-cyan { color: #22D3EE; }
.mira-value-red { color: #FB7185; }
.mira-value-green { color: #10B981; }
.mira-value-orange { color: #F59E0B; }
.mira-value-blue { color: #165DFF; }

.mira-progress-item {
  background: var(--bg-glass);
}

.mira-progress-label {
  color: var(--text-secondary);
}

.mira-progress-bg {
  background: var(--border-color);
}

.mira-hint {
  color: var(--text-tertiary);
}

.mira-engine-card {
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
}

.mira-text-secondary {
  color: var(--text-secondary);
}

.mira-text-tertiary {
  color: var(--text-tertiary);
}

.mira-problem-item {
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
}

.svg-label {
  fill: var(--text-tertiary);
}

/* Light theme overrides */
:global([data-theme="light"]) .mira-suggestion,
:global([data-theme="light"]) .mira-progress-item {
  background: rgba(0, 0, 0, 0.02);
}
</style>