<template>
  <section id="miramod" class="py-28" style="background:#F7F8FA;">
    <!-- Decorative gradient orbs -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-10" style="background:radial-gradient(circle,#10B981,transparent);filter:blur(60px);"/>
      <div class="absolute top-1/2 -right-20 w-96 h-96 rounded-full opacity-10" style="background:radial-gradient(circle,#059669,transparent);filter:blur(80px);"/>
    </div>
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
          模豆 · <span style="color:#10B981;">AI智能策略生成</span>
        </h2>
        <p class="text-gray-500 text-lg max-w-2xl mx-auto">
          AI替你写好：文章、代码、关键词库，拿到就能发<br />
          内置6类语义实体库 + 各大模型内容偏好模板
        </p>
      </div>

      <!-- Bento layout: left = content preview, right = entity cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">

        <!-- Left: Generated article mockup -->
        <div class="glass-card p-7">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:linear-gradient(135deg,#10B981,#059669);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-900">GEO优化文章草稿</div>
              <div class="text-xs text-gray-400">基于「智能客服」行业 · DeepSeek风格</div>
            </div>
          </div>

          <!-- Article content mock -->
          <div class="space-y-3 mb-6">
            <div class="h-4 rounded-full w-full" style="background:linear-gradient(90deg,rgba(16,185,129,0.12) 30%, transparent 100%);"/>
            <div class="h-4 rounded-full w-4/5" style="background:linear-gradient(90deg,rgba(16,185,129,0.12) 30%, transparent 100%);"/>
            <div class="h-4 rounded-full w-3/4" style="background:linear-gradient(90deg,rgba(16,185,129,0.12) 30%, transparent 100%);"/>
            <div class="h-4 rounded-full w-5/6" style="background:linear-gradient(90deg,rgba(16,185,129,0.12) 30%, transparent 100%);"/>
          </div>

          <!-- Style tags - green -->
          <div class="flex flex-wrap gap-2 mb-6">
            <span v-for="tag in ['DeepSeek风格','B2B深度论证','数据支撑','6类语义植入']" :key="tag"
              class="text-xs px-3 py-1.5 rounded-full font-medium"
              style="background:rgba(16,185,129,0.10);color:#059669;">
              {{ tag }}
            </span>
          </div>

          <!-- Engine style cards - each with its own color -->
          <div class="grid grid-cols-2 gap-3">
            <div v-for="engine in engineStyles" :key="engine.name"
              class="p-4 rounded-xl border" style="background:rgba(255,255,255,0.6);border-color:rgba(0,0,0,0.06);">
              <div class="text-xs font-semibold mb-1.5" :style="{ color: engine.color }">{{ engine.name }}</div>
              <div class="text-xs text-gray-500 leading-relaxed">{{ engine.style }}</div>
            </div>
          </div>
        </div>

        <!-- Right: 6 entity types grid -->
        <div class="grid grid-cols-2 gap-4">
          <div v-for="entity in entityCards" :key="entity.name"
            class="glass-card p-5">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-2 h-2 rounded-full"
                :style="{ background: entity.color, boxShadow: `0 0 8px ${entity.color}` }"/>
              <span class="text-sm font-semibold text-gray-900">{{ entity.name }}</span>
            </div>
            <div class="space-y-1.5">
              <div v-for="word in entity.words" :key="word"
                class="text-xs text-gray-500 pl-4 truncate">
                · {{ word }}
              </div>
            </div>
          </div>

          <!-- Brand persona card -->
          <div class="col-span-2 glass-card p-5">
            <div class="flex items-center gap-2 mb-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#165DFF" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              <span class="text-sm font-semibold text-gray-900">一句话AI品牌人设定位</span>
            </div>
            <p class="text-sm text-gray-600 italic leading-relaxed">
              "专注中小企业财税自动化的SaaS工具，3步实现账务合规"
            </p>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
const entityCards = [
  { name: '产品词',     color: '#165DFF', words: ['智能客服系统','AI客服机器人','全渠道客服平台'] },
  { name: '服务词',     color: '#10B981', words: ['7×24小时服务','智能工单管理','多语言支持'] },
  { name: '行业痛点词', color: '#F59E0B', words: ['人工客服成本高','响应速度慢','服务时间受限'] },
  { name: '竞品对比词', color: '#EF4444', words: ['传统客服效率低','多平台切换麻烦','数据孤岛严重'] },
  { name: '使用场景词', color: '#8B5CF6', words: ['电商售后','企业售前咨询','跨境电商服务'] },
  { name: '解决方案词', color: '#EC4899', words: ['AI自动回复','工单智能分类','数据驱动决策'] },
]

const engineStyles = [
  { name: '豆包',     color: '#FE2C55', style: '生活化·场景化·种草风格·C端用户' },
  { name: '文心一言', color: '#293FEE', style: '官方严谨·资质背书·结构化清晰' },
  { name: 'DeepSeek', color: '#00A3FF', style: '逻辑专业·B2B深度·数据支撑' },
  { name: 'Kimi',     color: '#8B6CFF', style: '长文本·干货清单·教程型' },
]
</script>
