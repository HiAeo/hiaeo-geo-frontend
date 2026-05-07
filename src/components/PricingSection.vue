<template>
  <section id="pricing" class="py-20 relative">
    <div class="max-w-7xl mx-auto px-6">

      <!-- Header -->
      <div class="text-center mb-16">
        <span class="inline-block px-4 py-1.5 rounded-full text-xs font-medium mb-6"
          style="background: rgba(22, 93, 255, 0.1); color: #165DFF; border: 1px solid rgba(22, 93, 255, 0.2);">
          定价方案
        </span>
        <h2 class="text-4xl sm:text-5xl font-bold mb-4" style="color: var(--text-primary);">
          从免费诊断到企业级全闭环<br />
          按需选择，即开即用
        </h2>
        <p class="text-lg max-w-2xl mx-auto" style="color: var(--text-secondary);">
          基础版轻量起步，专业版解锁完整策略，企业版专属数据隔离与API对接
        </p>
      </div>

      <!-- Pricing cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">

        <!-- Free -->
        <div class="pricing-card">
          <div class="pricing-header">
            <div class="text-sm font-medium mb-1" style="color: var(--text-tertiary);">免费试用</div>
            <div class="text-3xl font-bold mb-1" style="color: var(--text-primary);">¥0</div>
            <div class="text-xs" style="color: var(--text-tertiary);">永久免费</div>
          </div>
          <div class="h-px my-6" style="background: var(--border-color);"/>
          <div class="space-y-3 flex-1">
            <div v-for="f in free" :key="f" class="flex items-start gap-3 text-sm" style="color: var(--text-secondary);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0 mt-0.5" style="color: #10B981;">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {{ f }}
            </div>
          </div>
          <button class="w-full py-3 rounded-xl text-sm font-medium mt-6 pricing-btn-secondary">
            立即开始
          </button>
        </div>

        <!-- Pro (highlighted) -->
        <div class="relative pricing-card pricing-card-popular">
          <!-- Popular badge -->
          <div class="popular-badge">推荐方案</div>

          <div class="pricing-header">
            <div class="text-sm font-medium mb-1" style="color: var(--text-tertiary);">专业版</div>
            <div class="text-3xl font-bold mb-1" style="color: var(--text-primary);">¥99<span class="text-base font-normal" style="color: var(--text-tertiary);">/月</span></div>
            <div class="text-xs" style="color: var(--text-tertiary);">年付享8折优惠</div>
          </div>
          <div class="h-px my-6" style="background: var(--border-color);"/>
          <div class="space-y-3 flex-1">
            <div v-for="f in pro" :key="f" class="flex items-start gap-3 text-sm" style="color: var(--text-secondary);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0 mt-0.5" style="color: #165DFF;">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {{ f }}
            </div>
          </div>
          <button class="w-full py-3 rounded-xl text-sm font-semibold mt-6 pricing-btn-primary">
            立即升级
          </button>
        </div>

        <!-- Enterprise -->
        <div class="pricing-card">
          <div class="pricing-header">
            <div class="text-sm font-medium mb-1" style="color: var(--text-tertiary);">企业版</div>
            <div class="text-3xl font-bold mb-1" style="color: var(--text-primary);">¥299<span class="text-base font-normal" style="color: var(--text-tertiary);">/月</span></div>
            <div class="text-xs" style="color: var(--text-tertiary);">支持私有化部署</div>
          </div>
          <div class="h-px my-6" style="background: var(--border-color);"/>
          <div class="space-y-3 flex-1">
            <div v-for="f in enterprise" :key="f" class="flex items-start gap-3 text-sm" style="color: var(--text-secondary);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0 mt-0.5" style="color: #8B5CF6;">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {{ f }}
            </div>
          </div>
          <button class="w-full py-3 rounded-xl text-sm font-medium mt-6 pricing-btn-secondary">
            联系销售
          </button>
        </div>
      </div>

      <!-- Trust badges -->
      <div class="flex items-center justify-center gap-8 mt-16 flex-wrap">
        <div v-for="badge in trustBadges" :key="badge"
          class="flex items-center gap-2 text-sm" style="color: var(--text-tertiary);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: #10B981;">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
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

<style scoped>
.pricing-card {
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-color-hover);
}

.pricing-card-popular {
  background: rgba(22, 93, 255, 0.08);
  border-color: rgba(22, 93, 255, 0.3);
  box-shadow: 0 0 60px rgba(22, 93, 255, 0.15);
}

.pricing-card-popular:hover {
  border-color: rgba(22, 93, 255, 0.5);
}

.popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 16px;
  background: linear-gradient(135deg, #165DFF, #8B5CF6);
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.pricing-header {
  text-align: left;
}

.pricing-btn-primary {
  background: #165DFF;
  color: white;
  transition: all 0.2s ease;
}

.pricing-btn-primary:hover {
  background: #0040ED;
  box-shadow: 0 0 20px rgba(22, 93, 255, 0.4);
}

.pricing-btn-secondary {
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.pricing-btn-secondary:hover {
  background: var(--bg-glass-hover);
  border-color: var(--border-color-hover);
}
</style>