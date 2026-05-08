<template>
  <div class="diagnose-detail">
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <button class="back-btn" @click="$router.push('/app/diagnose')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>
          <div>
            <h1 class="page-title">{{ report.brandName || '品牌' }} - 诊断报告</h1>
            <span class="page-subtitle">
              <span v-if="report.engineName" class="engine-tag">{{ report.engineLogo }} {{ report.engineName }}</span>
              <span>{{ formatDate(report.date) }} · {{ report.type }}</span>
            </span>
          </div>
        </div>
        <div class="header-actions">
          <button class="secondary-btn" @click="exportReport">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            导出报告
          </button>
        </div>
      </div>
    </div>

    <div class="detail-content">
      <!-- Loading -->
      <div v-if="loading" class="loading-section">
        <div class="loading-spinner"></div>
        <p>加载诊断报告...</p>
      </div>

      <template v-else-if="aiResult">
        <!-- Score Overview -->
        <div class="score-overview">
          <div class="big-score-card">
            <div class="big-score">{{ aiResult.overallScore }}</div>
            <div class="score-grade" :class="'grade-' + getGrade(aiResult.overallScore)">{{ getGrade(aiResult.overallScore) }}</div>
            <div class="score-label">品牌健康分</div>
          </div>
          <div class="dimension-cards">
            <div v-for="dim in aiResult.dimensions" :key="dim.name" class="dim-card">
              <div class="dim-header">
                <span class="dim-name">{{ dim.name }}</span>
                <span class="dim-score">{{ dim.score }}</span>
              </div>
              <div class="dim-bar">
                <div class="dim-fill" :style="{ width: dim.score + '%', background: getDimColor(dim.score) }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Executive Summary -->
        <div class="summary-section">
          <h2 class="section-title">执行摘要</h2>
          <div class="summary-content">{{ aiResult.summary || '暂无摘要信息' }}</div>
        </div>

        <!-- Findings -->
        <div class="findings-section">
          <h2 class="section-title">诊断发现</h2>
          <div class="findings-list">
            <div v-for="(dim, idx) in aiResult.dimensions" :key="idx" class="finding-card">
              <div class="finding-header">
                <span class="finding-name">{{ dim.name }}</span>
                <span class="finding-score" :style="{ color: getDimColor(dim.score) }">{{ dim.score }}分</span>
              </div>
              <div class="finding-findings">
                <div v-for="(finding, fIdx) in dim.findings" :key="fIdx" class="finding-item">
                  {{ finding }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommendations -->
        <div class="recommendations-section">
          <h2 class="section-title">优化建议</h2>
          <div class="recommendations-list">
            <div v-for="(rec, idx) in aiResult.recommendations" :key="idx" class="rec-card">
              <span class="rec-number">{{ idx + 1 }}</span>
              <span class="rec-text">{{ rec }}</span>
            </div>
          </div>
        </div>

        <!-- Content Suggestions -->
        <div v-if="aiResult.contentSuggestions && aiResult.contentSuggestions.length > 0" class="content-section">
          <h2 class="section-title">内容建议</h2>
          <div class="content-list">
            <div v-for="(content, idx) in aiResult.contentSuggestions" :key="idx" class="content-card">
              <div class="content-type">{{ getContentTypeLabel(content.type) }}</div>
              <div class="content-text">{{ content.content }}</div>
            </div>
          </div>
        </div>
      </template>

      <!-- Fallback: Show mock data if no result -->
      <template v-else>
        <div class="score-overview">
          <div class="big-score-card">
            <div class="big-score">{{ report.score || '-' }}</div>
            <div class="score-grade" :class="'grade-' + report.grade">{{ report.grade || '-' }}</div>
            <div class="score-label">品牌健康分</div>
          </div>
          <div class="dimension-cards">
            <div v-for="dim in report.dimensions || []" :key="dim.name" class="dim-card">
              <div class="dim-header">
                <span class="dim-name">{{ dim.name }}</span>
                <span class="dim-score">{{ dim.score }}</span>
              </div>
              <div class="dim-bar">
                <div class="dim-fill" :style="{ width: dim.score + '%', background: getDimColor(dim.score) }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="summary-section">
          <h2 class="section-title">执行摘要</h2>
          <div class="summary-content">{{ report.summary || '暂无摘要信息' }}</div>
        </div>

        <div class="insights-section">
          <h2 class="section-title">AI 洞察</h2>
          <div class="insights-grid">
            <div v-for="insight in report.insights || []" :key="insight.title" class="insight-card">
              <div class="insight-icon">{{ insight.icon }}</div>
              <div class="insight-body">
                <h4>{{ insight.title }}</h4>
                <p>{{ insight.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const loading = ref(true)
const aiResult = ref(null)

const report = ref({
  id: route.params.id,
  brandName: '',
  type: '完整诊断',
  date: new Date().toISOString(),
  score: null,
  grade: '-',
})

const getDimColor = (score) => {
  if (score >= 80) return '#10b981'
  if (score >= 65) return '#6366f1'
  if (score >= 50) return '#f59e0b'
  return '#ef4444'
}

const getGrade = (score) => {
  if (!score) return '-'
  if (score >= 85) return 'A'
  if (score >= 70) return 'B'
  if (score >= 60) return 'C'
  return 'D'
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })
}

const getContentTypeLabel = (type) => {
  const labels = { slogan: '品牌口号', tagline: '品牌故事', bio: '品牌简介', description: '品牌描述' }
  return labels[type] || type
}

const loadReport = () => {
  loading.value = true

  const reportId = route.params.id

  // Try to load from localStorage
  const savedReports = localStorage.getItem('diagnose_reports')
  if (savedReports) {
    const reports = JSON.parse(savedReports)
    const found = reports.find(r => r.id === reportId)
    if (found) {
      report.value = found
      if (found.result) {
        aiResult.value = found.result
      }
    }
  }

  loading.value = false
}

const exportReport = () => {
  // Export functionality - create a simple text report
  const content = `
品牌诊断报告
============

品牌名称: ${report.value.brandName}
诊断时间: ${formatDate(report.value.date)}
AI 引擎: ${report.value.engineName || '未知'}

综合得分: ${aiResult.value?.overallScore || report.value.score}分

维度分析:
${aiResult.value?.dimensions.map(d => `  - ${d.name}: ${d.score}分`).join('\n') || '无'}

${aiResult.value?.summary || report.value.summary || ''}

优化建议:
${aiResult.value?.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n') || '无'}
`

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `品牌诊断报告_${report.value.brandName}_${formatDate(report.value.date)}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  loadReport()
})
</script>

<style scoped>
.diagnose-detail { min-height: 100vh; padding-bottom: 40px; background: var(--bg-primary); }
.page-header { position: sticky; top: 0; z-index: 50; background: var(--bg-primary); border-bottom: 1px solid var(--border-color); padding: 16px 24px; }
.header-content { display: flex; align-items: center; justify-content: space-between; max-width: 1200px; margin: 0 auto; }
.header-left { display: flex; align-items: center; gap: 12px; }
.back-btn { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: var(--bg-elevated); border: 1px solid var(--border-color); color: var(--text-primary); cursor: pointer; transition: all 0.2s; }
.back-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }
.page-title { font-size: 1.125rem; font-weight: 700; }
.page-subtitle { font-size: 0.8125rem; color: var(--text-secondary); display: flex; align-items: center; gap: 8px; }
.engine-tag { display: inline-flex; align-items: center; gap: 4px; background: var(--bg-elevated); padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; }
.secondary-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: 10px; font-size: 0.8125rem; font-weight: 600; color: var(--text-primary); cursor: pointer; transition: all 0.2s; }
.secondary-btn:hover { border-color: var(--color-primary); }

.loading-section { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 24px; gap: 16px; }
.loading-spinner { width: 40px; height: 40px; border: 3px solid var(--border-color); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.detail-content { max-width: 1200px; margin: 0 auto; padding: 24px; display: flex; flex-direction: column; gap: 24px; }

.score-overview { background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: 20px; padding: 32px; display: flex; gap: 40px; align-items: center; }
@media (max-width: 768px) { .score-overview { flex-direction: column; } }
.big-score-card { text-align: center; flex-shrink: 0; }
.big-score { font-size: 5rem; font-weight: 900; line-height: 1; color: var(--text-primary); }
.score-grade { display: inline-block; padding: 6px 20px; border-radius: 8px; font-size: 1.25rem; font-weight: 800; margin: 8px 0; }
.grade-A { background: rgba(16, 185, 129, 0.15); color: #059669; }
.grade-B { background: rgba(99, 102, 241, 0.15); color: #4f46e5; }
.grade-C { background: rgba(245, 158, 11, 0.15); color: #d97706; }
.grade-D { background: rgba(239, 68, 68, 0.15); color: #dc2626; }
.score-label { font-size: 0.875rem; color: var(--text-secondary); }

.dimension-cards { flex: 1; display: flex; flex-direction: column; gap: 12px; }
.dim-card { display: flex; flex-direction: column; gap: 6px; }
.dim-header { display: flex; justify-content: space-between; }
.dim-name { font-size: 0.875rem; color: var(--text-secondary); }
.dim-score { font-size: 0.875rem; font-weight: 700; color: var(--text-primary); }
.dim-bar { height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden; }
.dim-fill { height: 100%; border-radius: 4px; transition: width 1s; }

.summary-section, .insights-section, .competitor-section, .issues-section, .findings-section, .recommendations-section, .content-section { background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: 16px; padding: 24px; }
.section-title { font-size: 0.9375rem; font-weight: 700; margin-bottom: 16px; color: var(--text-primary); }
.summary-content { font-size: 0.9375rem; line-height: 1.7; color: var(--text-secondary); }

.insights-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
@media (max-width: 768px) { .insights-grid { grid-template-columns: 1fr; } }
.insight-card { background: var(--bg-primary); border-radius: 12px; padding: 16px; display: flex; gap: 12px; }
.insight-icon { font-size: 1.5rem; flex-shrink: 0; }
.insight-body h4 { font-size: 0.875rem; font-weight: 600; margin-bottom: 4px; color: var(--text-primary); }
.insight-body p { font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.5; }

.findings-list { display: flex; flex-direction: column; gap: 12px; }
.finding-card { background: var(--bg-primary); border-radius: 12px; padding: 16px; }
.finding-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.finding-name { font-size: 0.9375rem; font-weight: 600; color: var(--text-primary); }
.finding-score { font-size: 1rem; font-weight: 700; }
.finding-findings { display: flex; flex-direction: column; gap: 6px; }
.finding-item { font-size: 0.8125rem; color: var(--text-secondary); padding-left: 12px; border-left: 2px solid var(--border-color); }

.recommendations-list { display: flex; flex-direction: column; gap: 10px; }
.rec-card { display: flex; align-items: flex-start; gap: 12px; background: var(--bg-primary); border-radius: 10px; padding: 14px; }
.rec-number { width: 24px; height: 24px; border-radius: 50%; background: var(--color-primary); color: white; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.rec-text { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5; }

.content-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
@media (max-width: 768px) { .content-list { grid-template-columns: 1fr; } }
.content-card { background: var(--bg-primary); border-radius: 12px; padding: 16px; }
.content-type { font-size: 0.75rem; font-weight: 600; color: var(--color-primary); text-transform: uppercase; margin-bottom: 8px; }
.content-text { font-size: 0.9375rem; color: var(--text-primary); line-height: 1.5; }

.comp-table { display: flex; flex-direction: column; gap: 10px; }
.comp-row { display: flex; align-items: center; gap: 16px; }
.comp-name { width: 100px; font-size: 0.875rem; font-weight: 600; color: var(--text-primary); flex-shrink: 0; }
.comp-bar-wrap { flex: 1; display: flex; align-items: center; gap: 10px; }
.comp-bar { flex: 1; height: 10px; background: var(--border-color); border-radius: 5px; overflow: hidden; }
.comp-fill { height: 100%; background: var(--color-primary); border-radius: 5px; }
.comp-score { font-size: 0.8125rem; font-weight: 700; color: var(--text-primary); width: 40px; text-align: right; }

.issues-list { display: flex; flex-direction: column; gap: 12px; }
.issue-card { background: var(--bg-primary); border-radius: 12px; padding: 16px; display: flex; gap: 12px; }
.issue-priority { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; flex-shrink: 0; }
.priority-高 { background: rgba(239, 68, 68, 0.15); color: #dc2626; }
.priority-中 { background: rgba(245, 158, 11, 0.15); color: #d97706; }
.priority-低 { background: rgba(16, 185, 129, 0.15); color: #059669; }
.issue-body h4 { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; }
.issue-body p { font-size: 0.8125rem; color: var(--text-secondary); margin-bottom: 8px; }
.issue-suggestion { font-size: 0.8125rem; color: var(--text-primary); background: var(--bg-elevated); padding: 8px 12px; border-radius: 8px; }
</style>
