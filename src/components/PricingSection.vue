<template>
  <section id="pricing" class="py-28">

    <div class="max-w-7xl mx-auto px-6">

      <!-- Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          从免费诊断到企业级全闭环<br />
          按需选择，即开即用
        </h2>
        <p class="text-gray-500 text-lg">基础版轻量起步，专业版解锁完整策略，企业版专属数据隔离与API对接</p>
      </div>

      <!-- Pricing cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">

        <!-- Free -->
        <div class="glass-card p-7 flex flex-col gap-5 rounded-2xl">
          <div>
            <div class="text-sm font-medium text-gray-400 mb-1">免费试用</div>
            <div class="text-3xl font-bold text-gray-900 mb-1">¥0</div>
            <div class="text-xs text-gray-400">永久免费</div>
          </div>
          <div class="h-px bg-gray-200"/>
          <div class="space-y-3">
            <div v-for="f in free" :key="f" class="flex items-start gap-3 text-sm text-gray-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="2" class="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
              {{ f }}
            </div>
          </div>
          <button class="w-full py-3 rounded-xl text-sm font-medium mt-auto bg-gray-100 text-gray-700 hover:bg-gray-200">
            立即开始
          </button>
        </div>

        <!-- Pro (highlighted with border) -->
        <div class="relative glass-card p-7 flex flex-col gap-5 rounded-2xl md:-mt-3 md:mb-3 ring-2 ring-gray-300">
          <!-- Popular badge -->
          <div class="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <div class="px-4 py-1 rounded-full text-xs font-bold text-white bg-gray-900">
              推荐方案
            </div>
          </div>

          <div>
            <div class="text-sm font-medium text-gray-400 mb-1">专业版</div>
            <div class="text-3xl font-bold text-gray-900 mb-1">¥99<span class="text-base font-normal text-gray-400">/月</span></div>
            <div class="text-xs text-gray-400">年付享8折优惠</div>
          </div>
          <div class="h-px bg-gray-200"/>
          <div class="space-y-3">
            <div v-for="f in pro" :key="f" class="flex items-start gap-3 text-sm text-gray-700">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="2" class="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
              {{ f }}
            </div>
          </div>
          <button class="w-full py-3 rounded-xl text-sm font-medium mt-auto bg-gray-900 text-white hover:bg-black">
            立即升级
          </button>
        </div>

        <!-- Enterprise -->
        <div class="glass-card p-7 flex flex-col gap-5 rounded-2xl">
          <div>
            <div class="text-sm font-medium text-gray-400 mb-1">企业版</div>
            <div class="text-3xl font-bold text-gray-900 mb-1">¥299<span class="text-base font-normal text-gray-400">/月</span></div>
            <div class="text-xs text-gray-400">支持私有化部署</div>
          </div>
          <div class="h-px bg-gray-200"/>
          <div class="space-y-3">
            <div v-for="f in enterprise" :key="f" class="flex items-start gap-3 text-sm text-gray-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="2" class="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
              {{ f }}
            </div>
          </div>
          <button class="w-full py-3 rounded-xl text-sm font-medium mt-auto bg-gray-100 text-gray-700 hover:bg-gray-200">
            联系销售
          </button>
        </div>
      </div>

      <!-- Trust badges -->
      <div class="flex items-center justify-center gap-8 mt-16 flex-wrap">
        <div v-for="badge in trustBadges" :key="badge"
          class="flex items-center gap-2 text-sm text-gray-400">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          {{ badge }}
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
const free = [
  '模镜完整诊断1次',
  '查看7维度评分报告',
  '了解核心问题清单',
  '体验Hub驾驶舱',
  '手机号验证限1次试用',
]

const pro = [
  '模镜全功能诊断（6+引擎）',
  '模豆策略生成 + 内容草稿',
  '模法半自动执行',
  'Hub看板全角色视图',
  '「内容实验」A/B对比模块',
  '竞品对比分析',
  '行业基准参考',
  '7×24 技术支持',
]

const enterprise = [
  '专业版全部功能',
  '竞品多账号监控',
  '定制行业语义库',
  '专属策略顾问',
  'API系统对接',
  '数据隔离 + 专属数据库',
  '私有化部署方案',
  '私有化部署（定制）',
]

const trustBadges = [
  '国内首个GEO闭环',
  '数据加密存储',
  'Vercel + 腾讯云部署',
  '合规审计支持',
  '7天无理由退款',
]
</script>