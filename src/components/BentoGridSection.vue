<template>
  <section id="features" class="py-20 relative overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0 bg-gradient-to-b from-[#0A0A0F] to-[#0A0A0F]"></div>
    
    <div class="max-w-7xl mx-auto px-6 relative z-10">

      <!-- Section header -->
      <div class="text-center mb-16">
        <span class="inline-block px-4 py-1.5 rounded-full text-xs font-medium mb-6"
          style="background: rgba(22, 93, 255, 0.15); color: #165DFF; border: 1px solid rgba(22, 93, 255, 0.2);">
          诊断 · 策略 · 执行 · 监控
        </span>
        <h2 class="text-4xl sm:text-5xl font-bold mb-4" style="color: white;">
          全闭环 GEO 优化，一站式搞定
        </h2>
        <p class="text-lg max-w-2xl mx-auto" style="color: rgba(255,255,255,0.6);">
          你只需要输入公司名、产品及官网，剩下的事交给魔鲸GEO Claw
        </p>
      </div>

      <!-- Bento Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

        <!-- Step 1: 模镜 -->
        <div class="bento-card group" style="--accent: #165DFF;">
          <div class="bento-header">
            <div class="bento-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <span class="step-badge">STEP 01</span>
          </div>

          <h3 class="bento-title">
            <span style="font-weight:800;">Mira</span><span style="font-weight:400;">Seek</span> 模镜
          </h3>
          <p class="bento-desc">实时抓取 DeepSeek、豆包、Kimi 等主流大模型的回答数据，精准量化品牌实体独占率与替代风险指数。</p>

          <!-- Mini Radar -->
          <div class="flex justify-center my-6">
            <svg viewBox="0 0 120 120" class="radar-mini">
              <circle cx="60" cy="60" r="10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
              <circle cx="60" cy="60" r="25" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
              <circle cx="60" cy="60" r="40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
              <circle cx="60" cy="60" r="55" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
              <polygon
                points="60,12 82,38 95,60 78,88 42,88 25,60 38,38"
                fill="rgba(22,93,255,0.2)"
                stroke="#165DFF"
                stroke-width="2"
              />
              <circle cx="60" cy="35" r="3" fill="#165DFF"/>
              <circle cx="78" cy="52" r="3" fill="#165DFF"/>
              <circle cx="88" cy="78" r="3" fill="#10B981"/>
              <circle cx="72" cy="92" r="3" fill="#EF4444"/>
              <circle cx="48" cy="92" r="3" fill="#165DFF"/>
              <circle cx="32" cy="78" r="3" fill="#8B5CF6"/>
              <circle cx="42" cy="52" r="3" fill="#165DFF"/>
            </svg>
          </div>

          <div class="bento-tags">
            <span v-for="tag in ['7维度雷达图', '替代风险指数', '行业基准']" :key="tag">{{ tag }}</span>
          </div>
        </div>

        <!-- Step 2: 模豆 -->
        <div class="bento-card group" style="--accent: #10B981;">
          <div class="bento-header">
            <div class="bento-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <span class="step-badge" style="background: rgba(16, 185, 129, 0.15); color: #10B981; border-color: rgba(16, 185, 129, 0.2);">STEP 02</span>
          </div>

          <h3 class="bento-title">
            <span style="font-weight:800;">Mira</span><span style="font-weight:400;">Mod</span> 模豆
          </h3>
          <p class="bento-desc">内置6类语义实体库与各大模型内容偏好模板，AI替你写好文章、代码、关键词库，拿到就能发。</p>

          <!-- Entity type list -->
          <div class="space-y-3 my-6">
            <div v-for="entity in entityTypes" :key="entity.name" class="flex items-center gap-3">
              <div class="w-2.5 h-2.5 rounded-full" :style="{ background: entity.color, boxShadow: `0 0 8px ${entity.color}` }" />
              <span class="text-sm" style="color: rgba(255,255,255,0.7);">{{ entity.name }}</span>
              <div class="flex-1 h-px" style="background: rgba(255,255,255,0.1);" />
            </div>
          </div>

          <div class="bento-tags">
            <span v-for="tag in ['6类语义库', '多引擎适配', '合规检查']" :key="tag">{{ tag }}</span>
          </div>
        </div>

        <!-- Step 3: 模法 -->
        <div class="bento-card group" style="--accent: #8B5CF6;">
          <div class="bento-header">
            <div class="bento-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <span class="step-badge" style="background: rgba(139, 92, 246, 0.15); color: #8B5CF6; border-color: rgba(139, 92, 246, 0.2);">STEP 03</span>
          </div>

          <h3 class="bento-title">
            <span style="font-weight:800;">Mira</span><span style="font-weight:400;">Mag</span> 模法
          </h3>
          <p class="bento-desc">复制粘贴即落地，GEO Claw执行记录全程可见。不碰服务器，不自动机发，安全合规的半自动执行。</p>

          <!-- Timeline -->
          <div class="relative pl-6 space-y-4 my-6">
            <div v-for="(step, i) in executionSteps" :key="step.label" class="relative">
              <div class="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full z-10 transition-all duration-300 group-hover:scale-125" 
                :style="{ background: step.color, boxShadow: `0 0 10px ${step.color}` }" />
              <div v-if="i < executionSteps.length-1" class="absolute -left-6 top-5 bottom-0 w-px" style="background: rgba(255,255,255,0.1);" />
              <span class="text-sm font-medium" style="color: rgba(255,255,255,0.8);">{{ step.label }}</span>
            </div>
          </div>

          <div class="bento-tags">
            <span v-for="tag in ['审核确认', '一键复制', '效果反馈']" :key="tag">{{ tag }}</span>
          </div>
        </div>

      </div>

      <!-- Closing loop connector -->
      <div class="flex justify-center mt-12">
        <div class="loop-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"/>
            <polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
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

<style scoped>
.bento-card {
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.bento-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.bento-card:hover {
  background: rgba(17, 24, 39, 0.8);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 60px rgba(22, 93, 255, 0.1);
}

.bento-card:hover::before {
  opacity: 1;
}

.bento-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bento-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--accent);
  transition: all 0.3s ease;
}

.bento-card:hover .bento-icon {
  background: rgba(22, 93, 255, 0.15);
  transform: scale(1.05);
}

.step-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 9999px;
  background: rgba(22, 93, 255, 0.15);
  color: #165DFF;
  border: 1px solid rgba(22, 93, 255, 0.2);
  letter-spacing: 0.05em;
}

.bento-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
}

.bento-desc {
  font-size: 0.875rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.55);
}

.radar-mini {
  width: 120px;
  height: 120px;
  transition: transform 0.3s ease;
}

.bento-card:hover .radar-mini {
  transform: scale(1.05);
}

.bento-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
}

.bento-tags span {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.2s ease;
}

.bento-tags span:hover {
  background: rgba(22, 93, 255, 0.15);
  color: white;
}

.loop-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 9999px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

.loop-badge svg {
  color: #165DFF;
}
</style>