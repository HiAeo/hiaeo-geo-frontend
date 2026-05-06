<template>
  <section id="miramag" class="py-28" style="background:#0A0E17;">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-4xl sm:text-5xl font-bold text-white mb-3">
          模法 · <span style="color:#A78BFA;">半自动GEO执行</span>
        </h2>
        <p class="text-white/50 text-lg max-w-2xl mx-auto">
          复制粘贴即落地，GEO Claw 执行记录全程可见<br />
          不碰服务器，不自动机发，安全合规
        </p>
      </div>

      <!-- Execution timeline -->
      <div class="glass-card-dark p-8 rounded-2xl max-w-5xl mx-auto">
        <div class="flex items-center gap-2 mb-8 text-sm font-medium text-white/50">
          <div style="width:6px;height:6px;background:#8B5CF6;border-radius:50%;box-shadow:0 0 8px #8B5CF6;"/>
          <span>执行时间轴</span>
        </div>

        <!-- Horizontal timeline -->
        <div class="relative">
          <div class="absolute top-5 left-0 right-0 h-px"
            style="background:linear-gradient(90deg,rgba(22,93,255,0.4),rgba(139,92,246,0.4),rgba(16,185,129,0.4),rgba(22,93,255,0.4));"/>

          <div class="grid grid-cols-4 gap-4">
            <div v-for="(step,i) in timelineSteps" :key="step.label"
              class="relative flex flex-col items-center text-center gap-3">
              <!-- Node with color and glow -->
              <div class="relative z-10 w-10 h-10 rounded-full flex items-center justify-center"
                :style="{ background: step.color, boxShadow: `0 0 20px ${step.color}60` }">
                <svg v-if="step.done" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span v-else class="text-sm font-bold text-white">{{ i+1 }}</span>
              </div>
              <div class="text-sm font-medium text-white/80">{{ step.label }}</div>
              <div class="text-xs text-white/40 leading-relaxed">{{ step.detail }}</div>
              <!-- Pulse animation if done -->
              <div v-if="step.done" class="absolute top-5 w-10 h-10 rounded-full animate-ping"
                :style="{ background: step.color, opacity: '0.3', animationDuration: '2s' }" />
            </div>
          </div>
        </div>

        <!-- Effect feedback row -->
        <div class="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="feedback in feedbackCards" :key="feedback.engine"
            class="p-5 rounded-xl"
            style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-semibold text-white/70">{{ feedback.engine }}</span>
              <span class="text-xs px-2 py-0.5 rounded-full"
                :style="{ background: feedback.up > 0 ? 'rgba(52,211,153,0.15)' : 'rgba(239,68,68,0.15)', color: feedback.up > 0 ? '#34D399' : '#EF4444' }">
                {{ feedback.up > 0 ? '↑' : '↓' }}{{ Math.abs(feedback.up) }}%
              </span>
            </div>
            <div class="flex items-end gap-3">
              <span class="text-2xl font-bold" :style="{ color: feedback.color }">{{ feedback.mention }}</span>
              <span class="text-xs text-white/30 mb-0.5">提及率</span>
            </div>
            <!-- Wave indicator with engine color -->
            <div class="mt-3 flex items-center gap-1">
              <div v-for="n in 8" :key="n" class="flex-1 rounded-full"
                :style="{
                  height: feedback.wave[n-1]+'px',
                  background: feedback.color,
                  opacity: 0.3 + (n-1)*0.08,
                  animation: 'wave 1.5s ease-in-out infinite',
                  animationDelay: (n-1)*0.1+'s',
                }" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const timelineSteps = [
  { label: '生成内容草稿',  done: true,  color: '#165DFF', detail: 'AI生成3种风格文章' },
  { label: '用户审核确认',  done: true,  color: '#8B5CF6', detail: '安全合规二次确认' },
  { label: '一键复制发布',  done: true,  color: '#10B981', detail: '参考发布指引人工发布' },
  { label: '效果实时反馈',  done: false, color: '#165DFF', detail: '模镜自动重新抓取' },
]

const feedbackCards = [
  { engine: 'DeepSeek', up: 12, mention: '+12%', color: '#00A3FF', wave: [8,12,18,22,18,14,10,6] },
  { engine: '豆包',    up: 8,  mention: '+8%',  color: '#FE2C55', wave: [6,10,16,20,16,12,8,4] },
  { engine: 'Kimi',    up: 6,  mention: '+6%',  color: '#8B6CFF', wave: [4,8,12,16,12,8,6,4] },
]
</script>
