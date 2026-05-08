<template>
  <section id="cases" class="py-20 relative growth-section">
    <div class="max-w-7xl mx-auto px-6">

      <!-- Section header -->
      <div class="text-center mb-16">
        <span class="inline-block px-4 py-1.5 rounded-full text-xs font-medium mb-6 growth-badge scroll-animate">
          客户成长路径
        </span>
        <h2 class="text-4xl sm:text-5xl font-bold mb-4 growth-title scroll-animate delay-100">
          从新手到优秀，<br />每一步都有标准动作
        </h2>
        <p class="text-lg max-w-2xl mx-auto growth-desc scroll-animate delay-200">
          行业范本、真实案例、AI智能引导，让你的GEO优化不再从零摸索
        </p>
      </div>

      <!-- Path cards grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto stagger-children scroll-animate">

        <!-- Path 1: 新手起步 -->
        <div class="growth-path-card">
          <div class="path-header">
            <div class="path-number">01</div>
            <div class="path-badge" style="background: rgba(107, 114, 128, 0.15); color: #9CA3AF;">入门</div>
          </div>
          <h3 class="path-title">新手起步</h3>
          <p class="path-desc">完成首次诊断，了解自身现状</p>
          <div class="path-divider"></div>
          <ul class="path-tasks">
            <li v-for="task in path1" :key="task">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {{ task }}
            </li>
          </ul>
          <div class="path-metric">
            <span class="metric-label">GEO健康分</span>
            <span class="metric-value" style="color: #9CA3AF;">&lt; 40</span>
          </div>
        </div>

        <!-- Path 2: 快速见效 -->
        <div class="growth-path-card">
          <div class="path-header">
            <div class="path-number">02</div>
            <div class="path-badge" style="background: rgba(245, 158, 11, 0.15); color: #F59E0B;">见效</div>
          </div>
          <h3 class="path-title">快速见效</h3>
          <p class="path-desc">执行首轮优化，收获第一波数据</p>
          <div class="path-divider"></div>
          <ul class="path-tasks">
            <li v-for="task in path2" :key="task">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {{ task }}
            </li>
          </ul>
          <div class="path-metric">
            <span class="metric-label">GEO健康分</span>
            <span class="metric-value" style="color: #F59E0B;">40-60</span>
          </div>
        </div>

        <!-- Path 3: 体系优化 -->
        <div class="growth-path-card">
          <div class="path-header">
            <div class="path-number">03</div>
            <div class="path-badge" style="background: rgba(22, 93, 255, 0.15); color: #165DFF;">进阶</div>
          </div>
          <h3 class="path-title">体系优化</h3>
          <p class="path-desc">建立内容节奏，数据稳步提升</p>
          <div class="path-divider"></div>
          <ul class="path-tasks">
            <li v-for="task in path3" :key="task">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#165DFF" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {{ task }}
            </li>
          </ul>
          <div class="path-metric">
            <span class="metric-label">GEO健康分</span>
            <span class="metric-value" style="color: #165DFF;">60-80</span>
          </div>
        </div>

        <!-- Path 4: 行业领先 -->
        <div class="growth-path-card growth-path-featured">
          <div class="path-header">
            <div class="path-number">04</div>
            <div class="path-badge" style="background: rgba(16, 185, 129, 0.15); color: #10B981;">领先</div>
          </div>
          <h3 class="path-title">行业领先</h3>
          <p class="path-desc">全引擎压制竞品，建立品牌护城河</p>
          <div class="path-divider"></div>
          <ul class="path-tasks">
            <li v-for="task in path4" :key="task">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {{ task }}
            </li>
          </ul>
          <div class="path-metric">
            <span class="metric-label">GEO健康分</span>
            <span class="metric-value" style="color: #10B981;">≥ 80</span>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>

<script setup>
const path1 = [
  '完成首次模镜诊断',
  '了解7维度评分体系',
  '熟悉Hub看板基础操作',
  '获取首份问题清单'
]

const path2 = [
  '梳理核心问题清单',
  '审核首批模豆策略',
  '发布第一篇GEO内容',
  '观察3大引擎反馈'
]

const path3 = [
  '执行2周GEO优化',
  '对比优化前后数据',
  '建立内容发布节奏',
  '开启A/B内容实验'
]

const path4 = [
  '全引擎提及率领先',
  '竞品压制效果显著',
  '建立内容实验体系',
  '形成品牌护城河'
]
</script>

<style scoped>
.growth-section {
  background: var(--bg-primary);
}

.growth-badge {
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.growth-title {
  color: var(--text-primary);
}

.growth-desc {
  color: var(--text-secondary);
}

.growth-path-card {
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

@media (min-width: 768px) {
  .growth-path-card {
    border-radius: 20px;
    padding: 28px;
  }
}

.growth-path-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-color-hover);
}

.growth-path-featured {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(22, 93, 255, 0.05));
  border-color: rgba(16, 185, 129, 0.3);
}

.growth-path-featured:hover {
  border-color: rgba(16, 185, 129, 0.5);
  box-shadow: 0 0 40px rgba(16, 185, 129, 0.1);
}

.path-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.path-number {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-tertiary);
  opacity: 0.3;
  line-height: 1;
}

.path-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 9999px;
}

.path-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.path-desc {
  font-size: 13px;
  color: var(--text-tertiary);
  line-height: 1.5;
}

.path-divider {
  height: 1px;
  background: var(--border-color);
  margin: 20px 0;
}

.path-tasks {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.path-tasks li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.path-tasks li svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.path-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px dashed var(--border-color);
}

.metric-label {
  font-size: 12px;
  color: var(--text-tertiary);
}

.metric-value {
  font-size: 14px;
  font-weight: 700;
}
</style>
