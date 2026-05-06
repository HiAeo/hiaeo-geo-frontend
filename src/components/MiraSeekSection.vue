<template>
  <section id="miraseek" class="py-28" style="background:#0A0E17;">

    <!-- Section header (centered, no module label) -->
    <div class="max-w-7xl mx-auto px-6 mb-16">
      <div class="text-center">
        <h2 class="text-4xl sm:text-5xl font-bold text-white mb-3">
          模镜 · <span style="background:linear-gradient(90deg,#165DFF,#22D3EE);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">AI可见度诊断</span>
        </h2>
        <p class="text-white/50 text-lg max-w-2xl mx-auto">
          实时抓取主流大模型表现，精准量化
          <span style="color:#22D3EE;font-weight:500;">实体独占率</span> 与
          <span style="color:#FB7185;font-weight:500;">替代风险指数</span>
        </p>
        <div class="flex items-center gap-3 flex-wrap justify-center mt-8">
          <div v-for="metric in topMetrics" :key="metric.label"
            class="glass-card-dark px-5 py-3 text-center">
            <div class="text-xl font-bold text-white">{{ metric.value }}</div>
            <div class="text-xs text-white/40 mt-0.5">{{ metric.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard mockup -->
    <div class="max-w-7xl mx-auto px-6">
      <div class="glass-card-dark p-8 rounded-2xl">

        <!-- Dashboard toolbar -->
        <div class="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div class="flex items-center gap-3">
            <div class="w-3 h-3 rounded-full" style="background:#EF4444;opacity:0.7;" />
            <div class="w-3 h-3 rounded-full" style="background:#F59E0B;opacity:0.7;" />
            <div class="w-3 h-3 rounded-full" style="background:#10B981;opacity:0.7;" />
            <span class="ml-3 text-xs text-white/30 font-mono">模镜诊断看板</span>
          </div>
          <div class="flex items-center gap-2">
            <span v-for="tag in ['DeepSeek','豆包','Kimi','文心']" :key="tag"
              class="text-xs px-3 py-1.5 rounded-full"
              :style="tag==='DeepSeek' ? 'background:rgba(0,163,255,0.2);color:#00A3FF;border:1px solid rgba(0,163,255,0.3);' : 'background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.4);border:1px solid rgba(255,255,255,0.08);'">
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Dashboard grid -->
        <div class="grid grid-cols-12 gap-5">

          <!-- 7-dimension radar (left) -->
          <div class="col-span-12 lg:col-span-5">
            <div class="glass-card-dark p-5 h-full">
              <h4 class="text-sm font-semibold text-white/70 mb-4">7维度健康分</h4>
              <div class="flex justify-center">
                <svg viewBox="0 0 200 200" class="w-full max-w-[260px]">
                  <circle v-for="r in [20,40,60,80]" :key="r"
                    :r="r" cx="100" cy="100"
                    fill="none" stroke="rgba(22,93,255,0.12)" stroke-width="1"/>
                  <line v-for="i in 7" :key="i"
                    :x1="100" :y1="100"
                    :x2="100 + 80*Math.cos((i*51.4-90)*Math.PI/180)"
                    :y2="100 + 80*Math.sin((i*51.4-90)*Math.PI/180)"
                    stroke="rgba(22,93,255,0.10)" stroke-width="1"/>
                  <polygon
                    points="100,22 130,40 155,100 130,160 70,160 45,100 70,40"
                    fill="rgba(22,93,255,0.18)"
                    stroke="rgba(22,93,255,0.7)"
                    stroke-width="1.5"
                  />
                  <!-- Score labels with varying colors -->
                  <text x="100" y="14" text-anchor="middle" font-size="7" fill="#165DFF" font-weight="600">AI可见度 82</text>
                  <text x="140" y="36" text-anchor="start"  font-size="7" fill="rgba(255,255,255,0.5)">语义一致 71</text>
                  <text x="165" y="100" text-anchor="start"  font-size="7" fill="rgba(255,255,255,0.5)">权威信号 65</text>
                  <text x="140" y="164" text-anchor="start"  font-size="7" fill="#FB7185">竞品压制 58</text>
                  <text x="100" y="192" text-anchor="middle" font-size="7" fill="rgba(255,255,255,0.5)">转化引导 74</text>
                  <text x="60" y="164" text-anchor="end" font-size="7" fill="rgba(255,255,255,0.5)">内容友好 80</text>
                  <text x="35" y="100" text-anchor="end" font-size="7" fill="#22D3EE">实体独占 68</text>
                  <!-- Score dots -->
                  <circle cx="100" cy="22" r="4" fill="#165DFF"/>
                  <circle cx="130" cy="40" r="4" fill="#165DFF"/>
                  <circle cx="155" cy="100" r="4" fill="#165DFF"/>
                  <circle cx="130" cy="160" r="4" fill="#FB7185"/>
                  <circle cx="70" cy="160" r="4" fill="#FB7185"/>
                  <circle cx="100" cy="188" r="4" fill="#165DFF"/>
                  <circle cx="45" cy="100" r="4" fill="#22D3EE"/>
                </svg>
              </div>
              <!-- Score summary -->
              <div class="mt-4 flex items-center justify-center gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold" style="color:#22D3EE;">68</div>
                  <div class="text-xs" style="color:#22D3EE;">实体独占率</div>
                </div>
                <div class="w-px h-8 bg-white/10" />
                <div class="text-center">
                  <div class="text-2xl font-bold" style="color:#FB7185;">32</div>
                  <div class="text-xs text-white/40">替代风险</div>
                </div>
                <div class="w-px h-8 bg-white/10" />
                <div class="text-center">
                  <div class="text-2xl font-bold text-white">72</div>
                  <div class="text-xs text-white/40">综合得分</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right column -->
          <div class="col-span-12 lg:col-span-7 space-y-5">

            <!-- Engine performance cards -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div v-for="engine in engineCards" :key="engine.name"
                class="glass-card-dark p-4">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-xs font-medium text-white/50">{{ engine.name }}</span>
                  <div class="w-2 h-2 rounded-full" :style="{ background: engine.color }" />
                </div>
                <div class="text-2xl font-bold text-white mb-1">{{ engine.score }}</div>
                <!-- Mini bar with cyan gradient -->
                <div class="h-1 rounded-full overflow-hidden" style="background:rgba(255,255,255,0.08);">
                  <div class="h-full rounded-full" :style="{ width: engine.score+'%', background:'linear-gradient(90deg,#00A3FF,#165DFF)' }"/>
                </div>
                <div class="mt-2 text-xs" :style="{ color: engine.color }">
                  {{ engine.trend > 0 ? '↑' : '↓' }}{{ Math.abs(engine.trend) }}% vs 上周
                </div>
              </div>
            </div>

            <!-- Problem list -->
            <div class="glass-card-dark p-5">
              <h4 class="text-sm font-semibold text-white/70 mb-4">问题优先级清单</h4>
              <div class="space-y-3">
                <div v-for="problem in problems" :key="problem.id"
                  class="flex items-center gap-3 p-3 rounded-xl"
                  style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);">
                  <span class="text-xs font-bold px-2 py-0.5 rounded-md shrink-0"
                    :style="{ background: problem.bgColor, color: problem.color }">
                    {{ problem.priority }}
                  </span>
                  <span class="text-sm text-white/60 flex-1">{{ problem.text }}</span>
                  <span class="text-xs text-white/30 shrink-0">{{ problem.engine }}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const topMetrics = [
  { value: '6+',    label: '支持引擎' },
  { value: '7项',   label: '诊断维度' },
  { value: '10min', label: '完成诊断' },
]

const engineCards = [
  { name: 'DeepSeek',  score: 82, trend: 34, color: '#00A3FF' },
  { name: '豆包',     score: 71, trend: 22, color: '#F59E0B' },
  { name: 'Kimi',     score: 65, trend: 18, color: '#A78BFA' },
  { name: '文心一言', score: 58, trend: -5, color: '#EF4444' },
  { name: '通义千问', score: 49, trend: 9,  color: '#10B981' },
  { name: '讯飞星火', score: 41, trend: 12, color: '#6B7280' },
]

const problems = [
  { id: 1, priority: 'P0', text: '品牌在Kimi「企业软件」类问题中被竞品A抢先占位', engine: 'Kimi',   color: '#EF4444', bgColor: 'rgba(239,68,68,0.15)' },
  { id: 2, priority: 'P0', text: '官网未配置JSON-LD结构化数据，AI难以识别核心实体', engine: '全引擎', color: '#EF4444', bgColor: 'rgba(239,68,68,0.15)' },
  { id: 3, priority: 'P1', text: '「智能客服」核心产品词在豆包中出现描述错误',         engine: '豆包',   color: '#F59E0B', bgColor: 'rgba(245,158,11,0.15)' },
  { id: 4, priority: 'P1', text: '官网缺少权威新闻引用，削弱AI权威性信号判断',       engine: 'DeepSeek', color: '#F59E0B', bgColor: 'rgba(245,158,11,0.15)' },
  { id: 5, priority: 'P2', text: 'FAQ板块缺失，导致长尾问题AI回答质量偏低',          engine: 'Kimi',   color: '#6B7280', bgColor: 'rgba(107,114,128,0.15)' },
]
</script>
