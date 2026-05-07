<template>
  <section class="py-16">
    <div class="max-w-7xl mx-auto px-6">

      <!-- Section header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
          <span style="font-weight:800">Mira</span><span style="font-weight:400">Mod</span>模豆 · GEO智能策略生成
        </h2>
        <p class="text-gray-500 text-lg max-w-2xl mx-auto">
          内置6类语义实体库，AI替你写好文章、代码、关键词库<br />
          各引擎风格一键适配，拿到就能发
        </p>
      </div>

      <!-- Tabbed card -->
      <div class="glass-card rounded-2xl max-w-5xl mx-auto transition-all duration-300 hover:shadow-lg">
        <div style="padding:48px;">
        <!-- Tab switcher -->
        <div class="flex items-center gap-2 mb-8">
          <button
            v-for="tab in ['语义实体库','引擎适配','品牌人设']"
            :key="tab"
            @click="activeTab = tab"
            class="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            :class="activeTab === tab ? 'text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
            :style="activeTab === tab ? 'background:#10B981;' : ''"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Tab 1: 6 entity types -->
        <div v-if="activeTab === '语义实体库'" class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div v-for="entity in entityCards" :key="entity.name"
            class="p-5 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer"
            style="background:#FAFAFA;border:1px solid #F0F0F0;">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-2.5 h-2.5 rounded-full"
                :style="{ background: entity.color, boxShadow: `0 0 6px ${entity.color}` }"/>
              <span class="text-sm font-semibold text-gray-900">{{ entity.name }}</span>
            </div>
            <div class="space-y-1.5">
              <div v-for="word in entity.words" :key="word"
                class="text-xs text-gray-500 pl-3 truncate">· {{ word }}</div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Engine styles -->
        <div v-if="activeTab === '引擎适配'" class="grid grid-cols-2 gap-4">
          <div v-for="engine in engineStyles" :key="engine.name"
            class="p-5 rounded-xl border transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer"
            style="background:#FAFAFA;border-color:#F0F0F0;">
            <div class="text-sm font-bold mb-1.5" :style="{ color: engine.color }">{{ engine.name }}</div>
            <div class="text-xs text-gray-500 leading-relaxed">{{ engine.style }}</div>
          </div>
        </div>

        <!-- Tab 3: Brand persona -->
        <div v-if="activeTab === '品牌人设'" class="p-6 rounded-xl transition-all duration-300 hover:shadow-md cursor-pointer"
          style="background:#FAFAFA;border:1px solid #F0F0F0;">
          <div class="flex items-center gap-2 mb-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#165DFF" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
            </svg>
            <span class="text-sm font-semibold text-gray-900">AI品牌人设定位</span>
          </div>
          <p class="text-base text-gray-700 italic leading-relaxed">
            "专注中小企业财税自动化的SaaS工具，3步实现账务合规"
          </p>
          <div class="mt-5 flex flex-wrap gap-2">
            <span v-for="tag in ['B2B专业定位','数据驱动','合规可信','降本增效']" :key="tag"
              class="text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 hover:scale-105"
              style="background:rgba(16,185,129,0.10);color:#059669;">
              {{ tag }}
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

const activeTab = ref('语义实体库')

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