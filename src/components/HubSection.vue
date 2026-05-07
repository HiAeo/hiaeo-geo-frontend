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

      <!-- Hub dashboard mockup -->
      <div class="hub-card rounded-2xl max-w-5xl mx-auto transition-all duration-300 scroll-animate delay-200">
        <div class="p-12">
        <!-- Tab switcher -->
        <div class="flex items-center gap-2 mb-8">
          <button
            v-for="tab in ['老板视图','运营视图','技术视图']"
            :key="tab"
            @click="activeTab = tab"
            class="hub-tab px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            :class="{ 'hub-tab-active': activeTab === tab, 'hub-tab-inactive': activeTab !== tab }"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Boss view -->
        <div v-if="activeTab === '老板视图'" class="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div v-for="metric in bossMetrics" :key="metric.label"
            class="p-5 rounded-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer hub-metric-card">
            <div class="text-xs mb-3 hub-label">{{ metric.label }}</div>
            <div class="text-3xl font-bold mb-2" :style="{ color: metric.color }">{{ metric.value }}</div>
            <div class="flex items-center gap-2">
              <div class="flex-1 h-1 rounded-full overflow-hidden hub-progress-bg">
                <div class="h-full rounded-full transition-all duration-500" :style="{ width: metric.pct+'%', background: metric.color }"/>
              </div>
              <span class="text-xs font-medium hub-label">
                {{ metric.trend > 0 ? '↑' : '↓' }}{{ Math.abs(metric.trend) }}%
              </span>
            </div>
          </div>
        </div>

        <!-- Ops view -->
        <div v-if="activeTab === '运营视图'" class="space-y-5">
          <!-- Pending review -->
          <div class="p-5 rounded-xl transition-all duration-300 hub-panel">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-semibold hub-text-primary">待审核内容</span>
              <span class="text-xs px-2.5 py-1 rounded-full transition-all duration-200 hover:scale-105 hub-badge">{{ pendingCount }} 篇待审</span>
            </div>
            <div class="space-y-3">
              <div v-for="item in pendingItems" :key="item.title"
                class="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer hub-list-item">
                <div class="w-2 h-2 rounded-full shrink-0" :style="{ background: item.color }"/>
                <div class="flex-1">
                  <div class="text-sm hub-text-secondary">{{ item.title }}</div>
                  <div class="text-xs mt-0.5 hub-text-tertiary">{{ item.meta }}</div>
                </div>
                <button class="text-xs px-3 py-1.5 rounded-lg font-medium text-white transition-all duration-200 hover:scale-105 active:scale-95"
                  :style="{ background: item.color }"
                  @click="handleReview(item, 'approve')">
                  审核
                </button>
              </div>
            </div>
          </div>

          <!-- Next step suggestions -->
          <div class="p-5 rounded-xl transition-all duration-300 hub-panel">
            <div class="text-sm font-semibold mb-3 hub-text-primary">下一步建议</div>
            <div class="space-y-2">
              <div v-for="(tip,i) in opTips" :key="i"
                class="flex items-start gap-3 text-sm transition-all duration-200 cursor-pointer hub-tip">
                <span class="text-xs font-bold mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hub-step">
                  {{ i+1 }}
                </span>
                <span class="leading-relaxed">{{ tip }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tech view -->
        <div v-if="activeTab === '技术视图'" class="space-y-4">
          <div v-for="task in techTasks" :key="task.label"
            class="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer hub-task-item">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300"
              :style="{ background: task.done ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)' }">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                :stroke="task.done ? '#10B981' : '#F59E0B'" stroke-width="2">
                <path v-if="task.done" d="M4 17l6-6-6-6"/><path d="M12 19h8"/>
              </svg>
            </div>
            <div class="flex-1">
              <div class="text-sm font-medium hub-text-secondary">{{ task.label }}</div>
              <div class="text-xs mt-0.5 hub-text-tertiary">{{ task.detail }}</div>
            </div>
            <span class="text-xs px-2.5 py-1 rounded-full shrink-0 transition-all duration-200 hover:scale-105"
              :style="task.done
                ? 'background:rgba(16,185,129,0.15);color:#10B981;'
                : 'background:rgba(245,158,11,0.15);color:#F59E0B;'">
              {{ task.done ? '已完成' : '待处理' }}
            </span>
          </div>
        </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useApi } from '../composables/useApi'

defineEmits(['open-contact'])

const {
  getBossMetrics,
  getPendingItems,
  getOpTips,
  getTechTasks,
  reviewItem
} = useApi()

const activeTab = ref('老板视图')
const loading = ref(false)

// 数据状态
const bossMetrics = ref([])
const pendingItems = ref([])
const opTips = ref([])
const techTasks = ref([])
const pendingCount = ref(0)

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // 并行加载所有数据
    const [metricsRes, itemsRes, tipsRes, tasksRes] = await Promise.all([
      getBossMetrics(),
      getPendingItems(),
      getOpTips(),
      getTechTasks()
    ])
    
    bossMetrics.value = metricsRes.data || []
    pendingItems.value = itemsRes.data || []
    pendingCount.value = itemsRes.total || 0
    opTips.value = tipsRes.data || []
    techTasks.value = tasksRes.data || []
  } catch (error) {
    console.error('加载Hub数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理审核
const handleReview = async (item, action) => {
  try {
    await reviewItem(item.title, action)
    // 从列表中移除已审核项
    pendingItems.value = pendingItems.value.filter(i => i.title !== item.title)
    pendingCount.value = pendingItems.value.length
  } catch (error) {
    console.error('审核失败:', error)
  }
}

// 切换 Tab 时刷新数据
watch(activeTab, () => {
  loadData()
})

onMounted(() => {
  loadData()
})
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
