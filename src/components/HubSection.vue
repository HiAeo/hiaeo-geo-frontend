<template>
  <section id="hub" class="py-16 hub-section">
    <div class="max-w-7xl mx-auto px-6">

      <div class="text-center mb-16">
        <h2 class="text-4xl sm:text-5xl font-bold mb-3 hub-title scroll-animate">
          魔鲸Hub · AI协同驾驶舱
        </h2>
        <p class="text-lg max-w-2xl mx-auto text-center hub-desc scroll-animate delay-100">
          老板看结果，运营管执行，技术看指引 — 三方同舱不打架<br />
          三层指标（可见度→提及率→品牌搜索与官网引流）全量化关联
        </p>
      </div>

      <!-- Hub dashboard -->
      <div class="hub-card rounded-2xl max-w-5xl mx-auto transition-all duration-300 scroll-animate delay-200">
        <div class="p-6 md:p-12">
          <!-- Tab switcher -->
          <div class="flex flex-wrap items-center gap-2 mb-6 md:mb-8">
            <button
              v-for="tab in ['老板视图','运营视图','技术视图']"
              :key="tab"
              @click="activeTab = tab"
              class="hub-tab px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
              :class="{ 'hub-tab-active': activeTab === tab, 'hub-tab-inactive': activeTab !== tab }"
            >
              {{ tab }}
            </button>
          </div>

          <!-- Boss view -->
          <div v-if="activeTab === '老板视图'" class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            <div class="p-5 rounded-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer hub-metric-card">
              <div class="text-xs mb-3 hub-label">GEO健康分</div>
              <div class="text-3xl font-bold mb-2" style="color: #165DFF">72</div>
              <div class="flex items-center gap-2">
                <div class="flex-1 h-1 rounded-full overflow-hidden hub-progress-bg">
                  <div class="h-full rounded-full transition-all duration-500" style="width: 72%; background: #165DFF"/>
                </div>
                <span class="text-xs font-medium hub-label">↑8%</span>
              </div>
            </div>
            <div class="p-5 rounded-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer hub-metric-card">
              <div class="text-xs mb-3 hub-label">DeepSeek提及率</div>
              <div class="text-3xl font-bold mb-2" style="color: #00A3FF">+34%</div>
              <div class="flex items-center gap-2">
                <div class="flex-1 h-1 rounded-full overflow-hidden hub-progress-bg">
                  <div class="h-full rounded-full transition-all duration-500" style="width: 60%; background: #00A3FF"/>
                </div>
                <span class="text-xs font-medium hub-label">↑34%</span>
              </div>
            </div>
            <div class="p-5 rounded-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer hub-metric-card">
              <div class="text-xs mb-3 hub-label">竞品压制率</div>
              <div class="text-3xl font-bold mb-2" style="color: #8B5CF6">+12%</div>
              <div class="flex items-center gap-2">
                <div class="flex-1 h-1 rounded-full overflow-hidden hub-progress-bg">
                  <div class="h-full rounded-full transition-all duration-500" style="width: 55%; background: #8B5CF6"/>
                </div>
                <span class="text-xs font-medium hub-label">↑12%</span>
              </div>
            </div>
            <div class="p-5 rounded-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer hub-metric-card">
              <div class="text-xs mb-3 hub-label">ROI预估</div>
              <div class="text-3xl font-bold mb-2" style="color: #10B981">+23%</div>
              <div class="flex items-center gap-2">
                <div class="flex-1 h-1 rounded-full overflow-hidden hub-progress-bg">
                  <div class="h-full rounded-full transition-all duration-500" style="width: 65%; background: #10B981"/>
                </div>
                <span class="text-xs font-medium hub-label">↑23%</span>
              </div>
            </div>
          </div>

          <!-- Ops view -->
          <div v-if="activeTab === '运营视图'" class="space-y-5">
            <div class="p-5 rounded-xl transition-all duration-300 hub-panel">
              <div class="flex items-center justify-between mb-4">
                <span class="text-sm font-semibold hub-text-primary">待审核内容</span>
                <span class="text-xs px-2.5 py-1 rounded-full transition-all duration-200 hover:scale-105 hub-badge">3 篇待审</span>
              </div>
              <div class="space-y-3">
                <div class="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer hub-list-item">
                  <div class="w-2 h-2 rounded-full shrink-0" style="background: #00A3FF"/>
                  <div class="flex-1">
                    <div class="text-sm hub-text-secondary">《中小企业如何选客服系统》</div>
                    <div class="text-xs mt-0.5 hub-text-tertiary">DeepSeek风格 · 小红书 · 预计提升12%</div>
                  </div>
                </div>
                <div class="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer hub-list-item">
                  <div class="w-2 h-2 rounded-full shrink-0" style="background: #A78BFA"/>
                  <div class="flex-1">
                    <div class="text-sm hub-text-secondary">JSON-LD结构化数据配置</div>
                    <div class="text-xs mt-0.5 hub-text-tertiary">官网部署 · 技术视图参考</div>
                  </div>
                </div>
                <div class="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer hub-list-item">
                  <div class="w-2 h-2 rounded-full shrink-0" style="background: #8B6CFF"/>
                  <div class="flex-1">
                    <div class="text-sm hub-text-secondary">竞品对比页FAQ扩展</div>
                    <div class="text-xs mt-0.5 hub-text-tertiary">Kimi风格 · 预计提升6%</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-5 rounded-xl transition-all duration-300 hub-panel">
              <div class="text-sm font-semibold mb-3 hub-text-primary">下一步建议</div>
              <div class="space-y-2">
                <div class="flex items-start gap-3 text-sm transition-all duration-200 cursor-pointer hub-tip">
                  <span class="text-xs font-bold mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hub-step">1</span>
                  <span class="leading-relaxed">豆包提及率仍低于行业平均，建议补充2篇豆包风格的短视频脚本，适配生活化种草场景</span>
                </div>
                <div class="flex items-start gap-3 text-sm transition-all duration-200 cursor-pointer hub-tip">
                  <span class="text-xs font-bold mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hub-step">2</span>
                  <span class="leading-relaxed">本周已发布3篇DeepSeek风格内容，建议下周切换豆包/Kimi风格内容进行A/B测试</span>
                </div>
                <div class="flex items-start gap-3 text-sm transition-all duration-200 cursor-pointer hub-tip">
                  <span class="text-xs font-bold mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hub-step">3</span>
                  <span class="leading-relaxed">官网「关于我们」页缺少核心优势关键词，建议更新为AI人设定位版本</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Tech view -->
          <div v-if="activeTab === '技术视图'" class="space-y-3 md:space-y-4">
            <div class="flex items-start md:items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer hub-task-item">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300" style="background: rgba(16,185,129,0.15)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2">
                  <path d="M4 17l6-6-6-6"/><path d="M12 19h8"/>
                </svg>
              </div>
              <div class="flex-1">
                <div class="text-sm font-medium hub-text-secondary">部署JSON-LD结构化数据</div>
                <div class="text-xs mt-0.5 hub-text-tertiary">参考模法生成代码片段，部署至官网&lt;head&gt;标签内</div>
              </div>
              <span class="text-xs px-2.5 py-1 rounded-full shrink-0 transition-all duration-200 hover:scale-105" style="background:rgba(16,185,129,0.15);color:#10B981;">已完成</span>
            </div>
            <div class="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer hub-task-item">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300" style="background: rgba(16,185,129,0.15)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2">
                  <path d="M4 17l6-6-6-6"/><path d="M12 19h8"/>
                </svg>
              </div>
              <div class="flex-1">
                <div class="text-sm font-medium hub-text-secondary">完善sitemap.xml</div>
                <div class="text-xs mt-0.5 hub-text-tertiary">建议新增「解决方案」「行业案例」等栏目 sitemap</div>
              </div>
              <span class="text-xs px-2.5 py-1 rounded-full shrink-0 transition-all duration-200 hover:scale-105" style="background:rgba(16,185,129,0.15);color:#10B981;">已完成</span>
            </div>
            <div class="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer hub-task-item">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300" style="background: rgba(245,158,11,0.15)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2">
                  <path d="M12 19h8"/>
                </svg>
              </div>
              <div class="flex-1">
                <div class="text-sm font-medium hub-text-secondary">添加客服核心页面Meta标签</div>
                <div class="text-xs mt-0.5 hub-text-tertiary">title/description 需包含品牌核心关键词</div>
              </div>
              <span class="text-xs px-2.5 py-1 rounded-full shrink-0 transition-all duration-200 hover:scale-105" style="background:rgba(245,158,11,0.15);color:#F59E0B;">待处理</span>
            </div>
            <div class="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer hub-task-item">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300" style="background: rgba(245,158,11,0.15)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2">
                  <path d="M12 19h8"/>
                </svg>
              </div>
              <div class="flex-1">
                <div class="text-sm font-medium hub-text-secondary">提交Bing Webmaster Tools</div>
                <div class="text-xs mt-0.5 hub-text-tertiary">全站提交索引，提升 Bing/ChatGPT 爬虫友好度</div>
              </div>
              <span class="text-xs px-2.5 py-1 rounded-full shrink-0 transition-all duration-200 hover:scale-105" style="background:rgba(245,158,11,0.15);color:#F59E0B;">待处理</span>
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
</script>

<style scoped>
.hub-section {
  background: var(--bg-primary);
}

.hub-title {
  color: var(--text-primary);
}

.hub-desc {
  color: var(--text-secondary);
}

.hub-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-card);
}

.hub-tab-active {
  background: #165DFF;
  color: white;
}

.hub-tab-inactive {
  background: var(--bg-glass);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.hub-metric-card {
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
}

.hub-label {
  color: var(--text-tertiary);
}

.hub-progress-bg {
  background: var(--border-color);
}

.hub-panel {
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
}

.hub-text-primary {
  color: var(--text-primary);
}

.hub-text-secondary {
  color: var(--text-secondary);
}

.hub-text-tertiary {
  color: var(--text-tertiary);
}

.hub-badge {
  background: rgba(22,93,255,0.15);
  color: #165DFF;
}

.hub-list-item {
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
}

.hub-tip {
  color: var(--text-tertiary);
}

.hub-step {
  background: #165DFF;
  color: white;
}

.hub-task-item {
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
}

.hub-cta-btn {
  background: linear-gradient(135deg, #165DFF, #8B5CF6);
  color: white;
  box-shadow: 0 4px 20px rgba(22, 93, 255, 0.3);
}

.hub-cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(22, 93, 255, 0.4);
}
</style>
