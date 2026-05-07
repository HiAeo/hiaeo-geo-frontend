<template>
  <section>
    <div class="max-w-7xl mx-auto px-6">

      <!-- Section header -->
      <div class="text-center mb-16">
        <div class="flex items-center justify-center gap-2 mb-3">
          <h2 class="text-4xl sm:text-5xl font-bold text-gray-900">
            MiraMag模法 · GEO Agent自动执行优化
          </h2>
          <span class="alpha-badge" style="background:#111827;color:white;">Alpha</span>
        </div>
        <p class="text-gray-500 text-lg max-w-2xl mx-auto">
          复制粘贴即落地，执行记录全程可见<br />
          不碰服务器，不自动机发，安全合规
        </p>
      </div>

      <!-- Tabbed card -->
      <div class="glass-card p-8 rounded-2xl max-w-5xl mx-auto transition-all duration-300 hover:shadow-lg">

        <!-- Tab switcher -->
        <div class="flex items-center gap-2 mb-8">
          <button
            v-for="tab in ['执行流程','效果反馈']"
            :key="tab"
            @click="activeTab = tab"
            class="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            :class="activeTab === tab ? 'text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
            :style="activeTab === tab ? 'background:#8B5CF6;' : ''"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Tab 1: Timeline -->
        <div v-if="activeTab === '执行流程'">
          <div class="relative mb-8">
            <div class="absolute top-5 left-0 right-0 h-px" style="background:linear-gradient(90deg,rgba(22,93,255,0.4),rgba(139,92,246,0.4),rgba(16,185,129,0.4));"/>
            <div class="grid grid-cols-4 gap-4">
              <div v-for="(step,i) in timelineSteps" :key="step.label"
                class="relative flex flex-col items-center text-center gap-3 group cursor-pointer">
                <div class="relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  :style="{ background: step.color, boxShadow: `0 0 16px ${step.color}50` }">
                  <svg v-if="step.done" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span v-else class="text-sm font-bold text-white">{{ i+1 }}</span>
                </div>
                <div class="text-sm font-medium text-gray-700">{{ step.label }}</div>
                <div class="text-xs text-gray-400 leading-relaxed">{{ step.detail }}</div>
                <div v-if="step.done" class="absolute top-5 w-10 h-10 rounded-full animate-ping"
                  :style="{ background: step.color, opacity: '0.3', animationDuration: '2s' }"/>
              </div>
            </div>
          </div>
          <div class="text-center text-sm text-gray-400">
            审核确认后执行，安全合规全程可控
          </div>
        </div>

        <!-- Tab 2: Effect feedback -->
        <div v-if="activeTab === '效果反馈'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="feedback in feedbackCards" :key="feedback.engine"
            class="p-5 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer"
            style="background:#FAFAFA;border:1px solid #F0F0F0;">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-semibold text-gray-600">{{ feedback.engine }}</span>
              <span class="text-xs px-2.5 py-1 rounded-full transition-all duration-200 hover:scale-105"
                :style="{ background: feedback.up > 0 ? 'rgba(52,211,153,0.12)' : 'rgba(239,68,68,0.12)', color: feedback.up > 0 ? '#059669' : '#EF4444' }">
                {{ feedback.up > 0 ? '↑' : '↓' }}{{ Math.abs(feedback.up) }}%
              </span>
            </div>
            <div class="flex items-end gap-2 mb-3">
              <span class="text-2xl font-bold" :style="{ color: feedback.color }">{{ feedback.mention }}</span>
              <span class="text-xs text-gray-400 mb-0.5">提及率</span>
            </div>
            <!-- Wave bars -->
            <div class="flex items-end gap-1 h-10">
              <div v-for="(h,n) in feedback.wave" :key="n"
                class="flex-1 rounded-full transition-all duration-500"
                :style="{ height: h+'px', background: feedback.color, opacity: 0.3 + n*0.07 }"/>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('执行流程')

const timelineSteps = [
  { label: '生成内容草稿', done: true,  color: '#165DFF', detail: 'AI生成3种风格文章' },
  { label: '用户审核确认', done: true,  color: '#8B5CF6', detail: '安全合规二次确认' },
  { label: '一键复制发布', done: true,  color: '#10B981', detail: '参考发布指引人工发布' },
  { label: '效果实时反馈', done: false, color: '#165DFF', detail: '模镜自动重新抓取' },
]

const feedbackCards = [
  { engine: 'DeepSeek', up: 12, mention: '+12%', color: '#00A3FF', wave: [8,14,20,24,20,16,12,8] },
  { engine: '豆包',    up:  8, mention: '+8%',  color: '#FE2C55', wave: [6,12,18,22,18,14,10,6] },
  { engine: 'Kimi',    up:  6, mention: '+6%',  color: '#8B6CFF', wave: [4,10,14,18,14,10,8,4] },
]
</script>