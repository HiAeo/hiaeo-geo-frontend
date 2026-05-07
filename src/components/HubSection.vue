<template>
  <section class="py-16">
    <div class="max-w-7xl mx-auto px-6">

      <div class="text-center mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          魔鲸Hub · AI协同驾驶舱
        </h2>
        <p class="text-gray-500 text-lg max-w-2xl mx-auto text-center">
          老板看结果，运营管执行，技术看指引 — 三方同舱不打架<br />
          三层指标（可见度→提及率→品牌搜索与官网引流）全量化关联
        </p>
      </div>

      <!-- Hub dashboard mockup -->
      <div class="glass-card rounded-2xl max-w-5xl mx-auto transition-all duration-300 hover:shadow-lg">
        <div style="padding:48px;">
        <!-- Tab switcher -->
        <div class="flex items-center gap-2 mb-8">
          <button
            v-for="tab in ['老板视图','运营视图','技术视图']"
            :key="tab"
            @click="activeTab = tab"
            class="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            :class="activeTab === tab ? 'text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
            :style="activeTab === tab ? 'background:#165DFF;' : ''"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Boss view -->
        <div v-if="activeTab === '老板视图'" class="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div v-for="metric in bossMetrics" :key="metric.label"
            class="p-5 rounded-xl border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer"
            style="background:#FAFAFA;">
            <div class="text-xs text-gray-400 mb-3">{{ metric.label }}</div>
            <div class="text-3xl font-bold mb-2" :style="{ color: metric.color }">{{ metric.value }}</div>
            <div class="flex items-center gap-2">
              <div class="flex-1 h-1 rounded-full overflow-hidden bg-gray-200">
                <div class="h-full rounded-full transition-all duration-500" :style="{ width: metric.pct+'%', background: metric.color }"/>
              </div>
              <span class="text-xs font-medium text-gray-500">
                {{ metric.trend > 0 ? '↑' : '↓' }}{{ Math.abs(metric.trend) }}%
              </span>
            </div>
          </div>
        </div>

        <!-- Ops view -->
        <div v-if="activeTab === '运营视图'" class="space-y-5">
          <!-- Pending review -->
          <div class="p-5 rounded-xl border border-gray-100 transition-all duration-300 hover:shadow-sm" style="background:#FAFAFA;">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-semibold text-gray-600">待审核内容</span>
              <span class="text-xs px-2.5 py-1 rounded-full transition-all duration-200 hover:scale-105"
                :style="{ background:'rgba(22,93,255,0.10)', color:'#165DFF' }">3 篇待审</span>
            </div>
            <div class="space-y-3">
              <div v-for="item in pendingItems" :key="item.title"
                class="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 cursor-pointer">
                <div class="w-2 h-2 rounded-full shrink-0" :style="{ background: item.color }"/>
                <div class="flex-1">
                  <div class="text-sm text-gray-700">{{ item.title }}</div>
                  <div class="text-xs text-gray-400 mt-0.5">{{ item.meta }}</div>
                </div>
                <button class="text-xs px-3 py-1.5 rounded-lg font-medium text-white transition-all duration-200 hover:scale-105 active:scale-95"
                  :style="{ background: item.color }">
                  审核
                </button>
              </div>
            </div>
          </div>

          <!-- Next step suggestions -->
          <div class="p-5 rounded-xl border border-gray-100 transition-all duration-300 hover:shadow-sm" style="background:#FAFAFA;">
            <div class="text-sm font-semibold text-gray-600 mb-3">下一步建议</div>
            <div class="space-y-2">
              <div v-for="(tip,i) in opTips" :key="i"
                class="flex items-start gap-3 text-sm text-gray-500 transition-all duration-200 hover:text-gray-700 cursor-pointer">
                <span class="text-xs font-bold mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
                  style="background:#165DFF;">
                  {{ i+1 }}
                </span>
                <span class="leading-relaxed">{{ tip }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tech view -->
        <div v-if="activeTab === '技术视图'" class="space-y-4">
          <div v-for="task in techTasks" :key="task.label"
            class="flex items-center gap-4 p-4 rounded-xl border border-gray-100 transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5 cursor-pointer"
            style="background:#FAFAFA;">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
              :style="{ background: task.done ? 'rgba(16,185,129,0.10)' : 'rgba(245,158,11,0.10)' }">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                :stroke="task.done ? '#10B981' : '#F59E0B'" stroke-width="2">
                <path v-if="task.done" d="M4 17l6-6-6-6"/><path d="M12 19h8"/>
              </svg>
            </div>
            <div class="flex-1">
              <div class="text-sm font-medium text-gray-700">{{ task.label }}</div>
              <div class="text-xs text-gray-400 mt-0.5">{{ task.detail }}</div>
            </div>
            <span class="text-xs px-2.5 py-1 rounded-full shrink-0 transition-all duration-200 hover:scale-105"
              :style="task.done
                ? 'background:rgba(16,185,129,0.10);color:#10B981;'
                : 'background:#F3F4F6;color:#9CA3AF;'">
              {{ task.done ? '已完成' : '待处理' }}
            </span>
          </div>
        </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('老板视图')

const bossMetrics = [
  { label: 'GEO健康分',      value: '72',    pct: 72, color: '#165DFF', trend: 8 },
  { label: 'DeepSeek提及率', value: '+34%', pct: 60, color: '#00A3FF', trend: 34 },
  { label: '竞品压制率',    value: '+12%', pct: 55, color: '#8B5CF6', trend: 12 },
  { label: 'ROI预估',        value: '+23%', pct: 65, color: '#10B981', trend: 23 },
]

const pendingItems = [
  { title: '《中小企业如何选客服系统》', meta: 'DeepSeek风格 · 小红书 · 预计提升12%', color: '#00A3FF' },
  { title: 'JSON-LD结构化数据配置',       meta: '官网部署 · 技术视图参考',           color: '#A78BFA' },
  { title: '竞品对比页FAQ扩展',           meta: 'Kimi风格 · 预计提升6%',            color: '#8B6CFF' },
]

const opTips = [
  '豆包提及率仍低于行业平均，建议补充2篇豆包风格的短视频脚本，适配生活化种草场景',
  '本周已发布3篇DeepSeek风格内容，建议下周切换豆包/Kimi风格内容进行A/B测试',
  '官网「关于我们」页缺少核心优势关键词，建议更新为AI人设定位版本',
]

const techTasks = [
  { label: '部署JSON-LD结构化数据',   detail: '参考模法生成代码片段，部署至官网<head>标签内', done: true },
  { label: '完善sitemap.xml',          detail: '建议新增「解决方案」「行业案例」等栏目 sitemap', done: true },
  { label: '添加客服核心页面Meta标签',  detail: 'title/description 需包含品牌核心关键词', done: false },
  { label: '提交Bing Webmaster Tools',  detail: '全站提交索引，提升 Bing/ChatGPT 爬虫友好度', done: false },
]
</script>