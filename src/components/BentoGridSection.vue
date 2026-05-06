<template>
  <section id="features" class="py-28">
    <div class="max-w-7xl mx-auto px-6">

      <!-- Section header (centered, no label) -->
      <div class="text-center mb-16">
        <h2 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          诊断 · 策略 · 执行
        </h2>
        <p class="text-gray-500 text-lg max-w-2xl mx-auto">
          你只需要输入公司名、产品及官网，剩下的事交给魔鲸GEO Claw
        </p>
      </div>

      <!-- Bento Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

        <!-- Step 1: 模镜 -->
        <div class="glass-card p-8 flex flex-col gap-6" style="animation-delay: 0s;">
          <div class="flex items-center justify-between">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-100">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <span class="text-xs font-semibold px-3 py-1 rounded-full text-white" style="background:#165DFF;">STEP 01</span>
          </div>

          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">模镜 · AI可见度诊断</h3>
            <p class="text-gray-500 text-sm leading-relaxed">实时抓取 DeepSeek、豆包、Kimi 等主流大模型的回答数据，精准量化品牌实体独占率与替代风险指数。</p>
          </div>

          <!-- Mini Radar -->
          <div class="flex justify-center">
            <div class="relative w-36 h-36">
              <svg viewBox="0 0 120 120" class="w-full h-full">
                <circle cx="60" cy="60" r="10" fill="none" stroke="#E5E7EB" stroke-width="1"/>
                <circle cx="60" cy="60" r="25" fill="none" stroke="#E5E7EB" stroke-width="1"/>
                <circle cx="60" cy="60" r="40" fill="none" stroke="#E5E7EB" stroke-width="1"/>
                <circle cx="60" cy="60" r="55" fill="none" stroke="#E5E7EB" stroke-width="1"/>
                <polygon
                  points="60,12 82,38 95,60 78,88 42,88 25,60 38,38"
                  fill="rgba(22,93,255,0.10)"
                  stroke="#165DFF"
                  stroke-width="1.5"
                />
              </svg>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <span v-for="tag in ['7维度雷达图', '替代风险指数', '行业基准']" :key="tag"
              class="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Step 2: 模豆 -->
        <div class="glass-card p-8 flex flex-col gap-6" style="animation-delay: 0.5s;">
          <div class="flex items-center justify-between">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-100">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
            <span class="text-xs font-semibold px-3 py-1 rounded-full text-white" style="background:#10B981;">STEP 02</span>
          </div>

          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">模豆 · AI智能策略生成</h3>
            <p class="text-gray-500 text-sm leading-relaxed">内置6类语义实体库与各大模型内容偏好模板，AI替你写好文章、代码、关键词库，拿到就能发。</p>
          </div>

          <!-- Entity type list -->
          <div class="space-y-2">
            <div v-for="entity in entityTypes" :key="entity.name" class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full" :style="{ background: entity.color }" />
              <span class="text-sm text-gray-600">{{ entity.name }}</span>
              <div class="flex-1 h-px bg-gray-200" />
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <span v-for="tag in ['6类语义库', '多引擎适配', '合规检查']" :key="tag"
              class="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Step 3: 模法 -->
        <div class="glass-card p-8 flex flex-col gap-6" style="animation-delay: 1s;">
          <div class="flex items-center justify-between">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-100">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <span class="text-xs font-semibold px-3 py-1 rounded-full text-white" style="background:#8B5CF6;">STEP 03</span>
          </div>

          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">模法 · 半自动GEO执行</h3>
            <p class="text-gray-500 text-sm leading-relaxed">复制粘贴即落地，GEO Claw执行记录全程可见。不碰服务器，不自动机发，安全合规的半自动执行。</p>
          </div>

          <!-- Timeline -->
          <div class="relative pl-6 space-y-4">
            <div v-for="(step, i) in executionSteps" :key="step.label" class="relative">
              <div class="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white z-10" :style="{ background: step.color }" />
              <div v-if="i < executionSteps.length-1" class="absolute -left-6 top-5 bottom-0 w-px bg-gray-200" />
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">{{ step.label }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <span v-for="tag in ['审核确认', '一键复制', '效果反馈']" :key="tag"
              class="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
              {{ tag }}
            </span>
          </div>
        </div>

      </div>

      <!-- Closing loop connector -->
      <div class="flex justify-center mt-10">
        <div class="flex items-center gap-3 text-sm text-gray-400">
          <span>模镜实时监控 → 模豆策略再优化 → 模法持续迭代</span>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
const entityTypes = [
  { name: '产品词',     color: '#165DFF' },
  { name: '服务词',     color: '#10B981' },
  { name: '行业痛点词', color: '#F59E0B' },
  { name: '竞品对比词', color: '#EF4444' },
  { name: '使用场景词', color: '#8B5CF6' },
  { name: '解决方案词', color: '#EC4899' },
]

const executionSteps = [
  { label: '生成内容草稿',  color: '#165DFF' },
  { label: '用户审核确认',  color: '#8B5CF6' },
  { label: '一键复制发布',  color: '#10B981' },
  { label: '效果实时反馈',  color: '#374151' },
]
</script>