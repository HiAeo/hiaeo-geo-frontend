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
          <div class="export-dropdown">
            <button class="secondary-btn" @click="showExportMenu = !showExportMenu">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              导出报告
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <div v-if="showExportMenu" class="dropdown-menu">
              <button @click="exportReport('pdf')">导出为 PDF</button>
              <button @click="exportReport('txt')">导出为 文本文件</button>
            </div>
          </div>
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
            <div class="score-label">GEO健康分</div>
            <div class="score-rank">超越 {{ getPercentile(aiResult.overallScore) }}% 的同类品牌</div>
          </div>
          <div class="dimension-cards">
            <div v-for="dim in aiResult.dimensions" :key="dim.id" class="dim-card">
              <div class="dim-header">
                <span class="dim-name">{{ dim.name }}</span>
                <span class="dim-score">{{ dim.score }}<small>分</small></span>
              </div>
              <div class="dim-bar">
                <div class="dim-fill" :style="{ width: dim.score + '%', background: getDimColor(dim.score) }"></div>
                <div class="dim-benchmark" :style="{ left: (dim.benchmark || 60) + '%' }"></div>
              </div>
              <div class="dim-desc">{{ dim.description }}</div>
            </div>
          </div>
        </div>

        <!-- Executive Summary -->
        <div class="summary-section">
          <h2 class="section-title">执行摘要</h2>
          <div class="summary-content" v-html="formatSummary(aiResult.summary)"></div>
        </div>

        <!-- Key Findings -->
        <div class="findings-section" v-if="aiResult.keyFindings">
          <h2 class="section-title">关键发现</h2>
          <div class="key-findings-grid">
            <div v-for="(finding, idx) in aiResult.keyFindings" :key="idx" class="key-finding-card">
              <div class="key-finding-icon">{{ getFindingIcon(finding) }}</div>
              <div class="key-finding-text">{{ finding }}</div>
            </div>
          </div>
        </div>

        <!-- Dimension Detail Cards -->
        <div class="findings-section">
          <h2 class="section-title">各维度详细分析</h2>
          <div class="dimension-details">
            <div v-for="dim in aiResult.dimensions" :key="dim.id" class="dim-detail-card">
              <div class="dim-detail-header">
                <div class="dim-detail-title">
                  <span class="dim-detail-name">{{ dim.name }}</span>
                  <span class="dim-detail-weight">权重 {{ dim.weight }}%</span>
                </div>
                <div class="dim-detail-score" :style="{ color: getDimColor(dim.score) }">
                  {{ dim.score }}
                  <span class="score-unit">分</span>
                  <span class="score-compare" :class="dim.score >= dim.benchmark ? 'above' : 'below'">
                    {{ dim.score >= dim.benchmark ? '↑ 高于基准' : '↓ 低于基准' }}
                  </span>
                </div>
              </div>
              
              <div class="dim-detail-findings">
                <h4>诊断发现</h4>
                <ul>
                  <li v-for="(finding, fIdx) in dim.findings" :key="fIdx">{{ finding }}</li>
                </ul>
              </div>
              
              <div class="dim-detail-suggestions" v-if="dim.suggestions && dim.suggestions.length">
                <h4>优化建议</h4>
                <div class="suggestion-list">
                  <div v-for="(sug, sIdx) in dim.suggestions" :key="sIdx" class="suggestion-item">
                    <span class="sug-priority" :class="'priority-' + sug.priority">{{ sug.priority }}</span>
                    <span class="sug-action">{{ sug.action }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Competitor Analysis -->
        <div class="competitor-section" v-if="aiResult.competitorAnalysis">
          <h2 class="section-title">竞品分析</h2>
          <div class="competitor-grid">
            <div class="competitor-card main-brand">
              <div class="competitor-name">{{ report.brandName }}</div>
              <div class="competitor-score" :style="{ color: getDimColor(aiResult.overallScore) }">{{ aiResult.overallScore }}分</div>
              <div class="competitor-label">您的品牌</div>
            </div>
            <div v-for="comp in aiResult.competitorAnalysis.mainCompetitors" :key="comp.name" class="competitor-card">
              <div class="competitor-name">{{ comp.name }}</div>
              <div class="competitor-score">{{ comp.mentionRate }}%提及率</div>
              <div class="competitor-advantages" v-if="comp.advantage.length">
                <span class="advantage-tag" v-for="adv in comp.advantage" :key="adv">{{ adv }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommendations -->
        <div class="recommendations-section">
          <h2 class="section-title">优化建议汇总</h2>
          <div class="recommendations-list">
            <div v-for="dim in aiResult.dimensions" :key="dim.id">
              <template v-for="(sug, idx) in (dim.suggestions || [])" :key="dim.id + '-' + idx">
                <div v-if="sug && (sug.priority === '高' || sug.priority === '中')" class="rec-card">
                  <span class="rec-dim-tag">{{ dim.id }}</span>
                  <span class="rec-priority" :class="'priority-' + sug.priority">{{ sug.priority }}</span>
                  <span class="rec-text">{{ sug.action }}</span>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- Content Suggestions -->
        <div class="content-section" v-if="aiResult.contentSuggestions && aiResult.contentSuggestions.length > 0">
          <h2 class="section-title">内容建议</h2>
          <div class="content-list">
            <div v-for="(content, idx) in aiResult.contentSuggestions" :key="idx" class="content-card">
              <span class="content-priority" :class="'priority-' + content.priority">{{ content.priority }}</span>
              <div class="content-type">{{ getContentTypeLabel(content.type) }}</div>
              <div class="content-text">{{ content.content }}</div>
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
import jsPDF from 'jspdf'

const route = useRoute()

const loading = ref(true)
const aiResult = ref(null)
const showExportMenu = ref(false)

const report = ref({
  id: route.params.id,
  brandName: '',
  type: '完整诊断',
  date: new Date().toISOString(),
  score: null,
  grade: '-',
})

const getDimColor = (score) => {
  if (score >= 80) return 'var(--color-success)'
  if (score >= 65) return 'var(--color-primary)'
  if (score >= 50) return 'var(--color-warning)'
  return 'var(--color-danger)'
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
  const labels = { 
    faq: 'FAQ问答', 
    seo: 'SEO文章', 
    competitor: '竞品对比', 
    'json-ld': '结构化数据',
    slogan: '品牌口号', 
    tagline: '品牌故事', 
    bio: '品牌简介', 
    description: '品牌描述' 
  }
  return labels[type] || type
}

const getPercentile = (score) => {
  if (score >= 85) return 90
  if (score >= 75) return 75
  if (score >= 65) return 55
  if (score >= 55) return 35
  return 15
}

const getFindingIcon = (finding) => {
  if (finding.includes('领先') || finding.includes('良好') || finding.includes('正常')) return '✓'
  if (finding.includes('落后') || finding.includes('偏低')) return '↑'
  return '●'
}

const formatSummary = (summary) => {
  if (!summary) return ''
  return summary.replace(/\n/g, '<br>').replace(/【(.*?)】/g, '<strong>【$1】</strong>')
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

// PDF Color palette
const COLORS = {
  primary: [79, 70, 229],      // #4f46e5
  secondary: [99, 102, 241],   // #6366f1
  success: [16, 185, 129],     // #10b981
  warning: [245, 158, 11],     // #f59e0b
  danger: [220, 38, 38],       // #dc2626
  textDark: [30, 30, 30],
  textGray: [100, 100, 100],
  bgLight: [248, 250, 252]
}

// Get score color
const getScoreColor = (score) => {
  if (score >= 80) return COLORS.success
  if (score >= 60) return COLORS.primary
  if (score >= 40) return COLORS.warning
  return COLORS.danger
}

// Get grade label
const getGradeLabel = (score) => {
  if (score >= 85) return 'A 优秀'
  if (score >= 70) return 'B 良好'
  if (score >= 60) return 'C 中等'
  return 'D 较差'
}

// Draw radar chart
const drawRadarChart = (doc, x, y, size, scores) => {
  const centerX = x + size / 2
  const centerY = y + size / 2
  const numAxes = scores.length || 6
  const angleStep = (2 * Math.PI) / numAxes
  const maxRadius = size / 2 - 10
  
  // Draw concentric circles
  for (let r = 1; r <= 4; r++) {
    const radius = (maxRadius / 4) * r
    doc.setDrawColor(220, 220, 230)
    doc.setLineWidth(0.3)
    const startX = centerX + radius
    const startY = centerY
    doc.moveTo(startX, startY)
    for (let i = 1; i <= numAxes; i++) {
      const angle = angleStep * i
      doc.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle))
    }
    // 手动闭合路径
    doc.lineTo(startX, startY)
    doc.stroke()
  }
  
  // Draw axes
  for (let i = 0; i < numAxes; i++) {
    const angle = angleStep * i
    const px = centerX + maxRadius * Math.cos(angle)
    const py = centerY + maxRadius * Math.sin(angle)
    doc.setDrawColor(180, 180, 200)
    doc.setLineWidth(0.5)
    doc.line(centerX, centerY, px, py)
  }
  
  // Draw data polygon
  if (scores && scores.length === numAxes) {
    doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2])
    // 使用 setGColor 或直接使用 RGB
    doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2])
    doc.setLineWidth(2)
    
    let startPx, startPy
    scores.forEach((score, i) => {
      const angle = angleStep * i
      const radius = (score / 100) * maxRadius
      const px = centerX + radius * Math.cos(angle)
      const py = centerY + radius * Math.sin(angle)
      
      if (i === 0) {
        startPx = px
        startPy = py
        doc.moveTo(px, py)
      } else {
        doc.lineTo(px, py)
      }
    })
    // 手动闭合路径回到起点
    doc.lineTo(startPx, startPy)
    doc.fill()
    doc.stroke()
  }
}

// Draw progress bar
const drawProgressBar = (doc, x, y, width, height, value, max = 100, color = COLORS.primary) => {
  doc.setFillColor(230, 230, 240)
  doc.roundedRect(x, y, width, height, height / 2, height / 2, 'F')
  
  const fillWidth = (value / max) * width
  if (fillWidth > 0) {
    doc.setFillColor(color[0], color[1], color[2])
    doc.roundedRect(x, y, fillWidth, height, height / 2, height / 2, 'F')
  }
}

// Draw page header
const drawHeader = (doc, title, pageNum, totalPages) => {
  doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2])
  doc.rect(0, 0, 210, 22, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('魔鲸GEO 品牌诊断报告', 15, 14)
  doc.text(title || '', 105, 14, { align: 'center' })
  doc.text(`${pageNum} / ${totalPages}`, 195, 14, { align: 'right' })
}

// Draw page footer
const drawFooter = (doc) => {
  const pageHeight = doc.internal.pageSize.height
  doc.setDrawColor(230, 230, 240)
  doc.setLineWidth(0.5)
  doc.line(10, pageHeight - 15, 200, pageHeight - 15)
  
  doc.setTextColor(150, 150, 150)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('让GEO像呼吸一样简单 | www.modelbuddy.net', 15, pageHeight - 8)
  doc.text(`报告ID: ${report.value.id || 'N/A'}`, 195, pageHeight - 8, { align: 'right' })
}

// Export report
const exportReport = async (format = 'pdf') => {
  showExportMenu.value = false
  
  if (format === 'txt') {
    await exportAsText()
    return
  }
  
  // PDF export with 7-dimension GEO data
  try {
    const doc = new jsPDF()
    
    // Get data with new structure
    const dimensions = aiResult.value?.dimensions || []
    const overallScore = aiResult.value?.overallScore || report.value.score || 0
    const summary = aiResult.value?.summary || '暂无摘要信息'
    const keyFindings = aiResult.value?.keyFindings || []
    const competitorAnalysis = aiResult.value?.competitorAnalysis
    const contentSuggestions = aiResult.value?.contentSuggestions || []
    
    // ==================== PAGE 0: Cover ====================
    doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2])
    doc.rect(0, 0, 210, 297, 'F')
    
    doc.setFillColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2])
    doc.circle(185, 35, 70, 'F')
    doc.setFillColor(255, 255, 255)
    doc.circle(25, 260, 50, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(36)
    doc.setFont('helvetica', 'bold')
    doc.text('魔鲸GEO', 20, 85)
    
    doc.setFontSize(14)
    doc.setFont('helvetica', 'normal')
    doc.text('AI 可见度诊断报告 (GEO健康分)', 20, 100)
    
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    doc.text('品牌诊断报告', 20, 145)
    
    // Info card
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(20, 165, 170, 70, 5, 5, 'F')
    
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2])
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text(report.value.brandName || '品牌', 30, 185)
    
    doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2])
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(`诊断类型: ${report.value.type}`, 30, 200)
    doc.text(`诊断时间: ${formatDate(report.value.date)}`, 30, 212)
    doc.text(`AI 引擎: ${report.value.engineName || '通用引擎'}`, 30, 224)
    
    // Score highlight
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('综合健康分', 145, 175)
    
    const scoreColor = getScoreColor(overallScore)
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2])
    doc.setFontSize(52)
    doc.setFont('helvetica', 'bold')
    doc.text(`${overallScore}`, 145, 210)
    
    doc.setFontSize(14)
    doc.setTextColor(255, 255, 255)
    doc.text(getGradeLabel(overallScore), 145, 225)
    
    // Meta info
    doc.setTextColor(200, 200, 200)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`报告编号: ${report.value.id || 'N/A'}`, 30, 265)
    doc.text(`生成时间: ${new Date().toLocaleString('zh-CN')}`, 30, 275)
    
    // ==================== PAGE 1: Executive Summary ====================
    doc.addPage()
    drawHeader(doc, '执行摘要', 2, 6)
    
    let y = 35
    
    doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2])
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('执行摘要', 15, y)
    
    y += 12
    
    // Summary card
    doc.setFillColor(COLORS.bgLight[0], COLORS.bgLight[1], COLORS.bgLight[2])
    doc.roundedRect(10, y, 190, 55, 3, 3, 'F')
    
    doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2])
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const summaryLines = doc.splitTextToSize(summary, 175)
    doc.text(summaryLines.slice(0, 5), 18, y + 12)
    
    y += 65
    
    // Overall Score
    doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2])
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('综合健康分', 15, y)
    
    y += 12
    
    // Score card
    doc.setFillColor(COLORS.bgLight[0], COLORS.bgLight[1], COLORS.bgLight[2])
    doc.roundedRect(10, y, 190, 70, 5, 5, 'F')
    
    // Big score circle
    doc.setFillColor(245, 245, 255)
    doc.circle(50, y + 35, 28, 'F')
    
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2])
    doc.setFontSize(32)
    doc.setFont('helvetica', 'bold')
    doc.text(`${overallScore}`, 38, y + 40)
    
    // Dimension bars
    const dimStartX = 95
    const dimStartY = y + 10
    
    dimensions.forEach((dim, i) => {
      const rowY = dimStartY + i * 14
      
      doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2])
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text(dim.name || `维度${i + 1}`, dimStartX, rowY + 5)
      
      drawProgressBar(doc, dimStartX + 35, rowY, 65, 7, dim.score || 0, 100, getScoreColor(dim.score || 0))
      
      doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2])
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text(`${dim.score || 0}`, dimStartX + 105, rowY + 6)
    })
    
    y += 80
    
    // Key Findings
    if (keyFindings.length > 0) {
      doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2])
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('关键发现', 15, y)
      
      y += 10
      
      keyFindings.forEach((finding, i) => {
        const findingY = y + i * 16
        doc.setFillColor(COLORS.bgLight[0], COLORS.bgLight[1], COLORS.bgLight[2])
        doc.roundedRect(10, findingY, 190, 14, 2, 2, 'F')
        
        doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2])
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text(`${i + 1}`, 18, findingY + 10)
        
        doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2])
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        const lines = doc.splitTextToSize(finding, 165)
        doc.text(lines.slice(0, 1), 28, findingY + 10)
      })
    }
    
    drawFooter(doc)
    
    // ==================== PAGE 2: Seven Dimensions ====================
    doc.addPage()
    drawHeader(doc, '七维健康度分析', 3, 6)
    
    y = 35
    
    doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2])
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('品牌健康度雷达图', 15, y)
    
    y += 10
    
    // Draw radar chart with 7 axes
    const scores = dimensions.map(d => d.score || 0)
    drawRadarChart(doc, 55, y, 100, scores)
    
    // Dimension labels
    const radarCenterX = 105
    const radarCenterY = y + 50
    const labelRadius = 58
    
    dimensions.forEach((dim, i) => {
      const angle = (i * 360 / dimensions.length - 90) * Math.PI / 180
      const lx = radarCenterX + labelRadius * Math.cos(angle)
      const ly = radarCenterY + labelRadius * Math.sin(angle)
      
      doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2])
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text(dim.id || `D${i+1}`, lx - 6, ly + 3)
      
      doc.setTextColor(getScoreColor(dim.score || 0)[0], getScoreColor(dim.score || 0)[1], getScoreColor(dim.score || 0)[2])
      doc.setFontSize(10)
      doc.text(`${dim.score || 0}`, lx - 6, ly + 12)
    })
    
    y += 115
    
    // 7 Dimension detail cards (2 columns)
    doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2])
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('各维度详细分析', 15, y)
    
    y += 10
    
    dimensions.forEach((dim, i) => {
      const cardX = 10 + (i % 2) * 95
      const cardY = y + Math.floor(i / 2) * 50
      
      doc.setFillColor(COLORS.bgLight[0], COLORS.bgLight[1], COLORS.bgLight[2])
      doc.roundedRect(cardX, cardY, 90, 46, 3, 3, 'F')
      
      doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2])
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text(dim.name || `维度${i + 1}`, cardX + 5, cardY + 10)
      
      doc.setTextColor(COLORS.textGray[0], COLORS.textGray[1], COLORS.textGray[2])
      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      doc.text(`权重${dim.weight}% | 基准${dim.benchmark || 60}分`, cardX + 5, cardY + 18)
      
      const scoreColor = getScoreColor(dim.score || 0)
      doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2])
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text(`${dim.score || 0}`, cardX + 70, cardY + 35)
      
      doc.setTextColor(COLORS.textGray[0], COLORS.textGray[1], COLORS.textGray[2])
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text('分', cardX + 85, cardY + 35)
      
      // Progress bar
      doc.setFillColor(230, 230, 240)
      doc.roundedRect(cardX + 5, cardY + 38, 80, 4, 2, 2, 'F')
      doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2])
      doc.roundedRect(cardX + 5, cardY + 38, (dim.score || 0) / 100 * 80, 4, 2, 2, 'F')
    })
    
    drawFooter(doc)
    
    // ==================== PAGE 3: Dimension Suggestions ====================
    doc.addPage()
    drawHeader(doc, '各维度优化建议', 4, 6)
    
    y = 35
    
    // Collect high priority suggestions
    let sugCount = 0
    dimensions.forEach((dim, i) => {
      const suggestions = dim.suggestions || []
      suggestions.filter(s => s.priority === '高' || s.priority === '中').forEach(sug => {
        sugCount++
      })
    })
    
    doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2])
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`优化建议 (${sugCount} 项)`, 15, y)
    
    y += 12
    
    // Priority badges
    const priorityColors = [COLORS.danger, COLORS.warning, COLORS.primary]
    let sugIdx = 0
    
    dimensions.forEach((dim, i) => {
      const suggestions = dim.suggestions || []
      suggestions.filter(s => s.priority === '高' || s.priority === '中').forEach(sug => {
        if (y > 250) {
          doc.addPage()
          drawHeader(doc, '各维度优化建议', 4.1, 6)
          y = 35
        }
        
        const cardHeight = 35
        doc.setFillColor(COLORS.bgLight[0], COLORS.bgLight[1], COLORS.bgLight[2])
        doc.roundedRect(10, y, 190, cardHeight, 3, 3, 'F')
        
        // Priority indicator
        const priorityIdx = sug.priority === '高' ? 0 : 1
        doc.setFillColor(priorityColors[priorityIdx][0], priorityColors[priorityIdx][1], priorityColors[priorityIdx][2])
        doc.rect(10, y, 4, cardHeight, 'F')
        
        // Dimension tag
        doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2])
        doc.roundedRect(18, y + 8, 18, 12, 2, 2, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(7)
        doc.setFont('helvetica', 'bold')
        doc.text(dim.id || `D${i+1}`, 20, y + 16)
        
        // Suggestion text
        doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2])
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        const sugText = `[${sug.priority}] ${sug.action}`
        const sugLines = doc.splitTextToSize(sugText, 145)
        doc.text(sugLines.slice(0, 2), 40, y + cardHeight / 2 + 3)
        
        y += cardHeight + 5
        sugIdx++
      })
    })
    
    drawFooter(doc)
    
    // ==================== PAGE 4: Competitor Analysis ====================
    if (competitorAnalysis) {
      doc.addPage()
      drawHeader(doc, '竞品分析', 5, 6)
      
      y = 35
      
      // Competitor cards
      const competitors = [
        { name: report.value.brandName, score: overallScore, isBrand: true },
        ...(competitorAnalysis.mainCompetitors || [])
      ]
      
      competitors.forEach((comp, i) => {
        const cardX = 10 + i * 48
        const cardY = y
        
        if (comp.isBrand) {
          doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2])
          doc.roundedRect(cardX, cardY, 45, 55, 3, 3, 'F')
          doc.setTextColor(255, 255, 255)
          doc.setFontSize(9)
          doc.setFont('helvetica', 'bold')
          doc.text('Your Brand', cardX + 22, cardY + 15, { align: 'center' })
          doc.setFontSize(20)
          doc.text(`${comp.score}`, cardX + 22, cardY + 38, { align: 'center' })
          doc.setFontSize(8)
          doc.text('分', cardX + 22, cardY + 48, { align: 'center' })
        } else {
          doc.setFillColor(COLORS.bgLight[0], COLORS.bgLight[1], COLORS.bgLight[2])
          doc.roundedRect(cardX, cardY, 45, 55, 3, 3, 'F')
          doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2])
          doc.setFontSize(8)
          doc.setFont('helvetica', 'bold')
          doc.text(comp.name, cardX + 22, cardY + 12, { align: 'center' })
          doc.setFontSize(12)
          doc.text(`${comp.mentionRate}%`, cardX + 22, cardY + 30, { align: 'center' })
          doc.setFontSize(7)
          doc.setTextColor(COLORS.textGray[0], COLORS.textGray[1], COLORS.textGray[2])
          doc.text('提及率', cardX + 22, cardY + 42, { align: 'center' })
        }
      })
      
      y += 70
      
      // Comparison table
      if (competitorAnalysis.comparisonMatrix) {
        doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2])
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('维度对比', 15, y)
        
        y += 10
        
        competitorAnalysis.comparisonMatrix.forEach((row, i) => {
          doc.setFillColor(COLORS.bgLight[0], COLORS.bgLight[1], COLORS.bgLight[2])
          doc.roundedRect(10, y, 190, 18, 2, 2, 'F')
          
          doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2])
          doc.setFontSize(9)
          doc.setFont('helvetica', 'normal')
          doc.text(row.aspect, 15, y + 12)
          
          // Brand bar
          doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2])
          doc.roundedRect(60, y + 7, (row.brandScore / 100) * 60, 6, 2, 2, 'F')
          doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2])
          doc.text(`${row.brandScore}`, 125, y + 12)
          
          // Competitor bar
          doc.setFillColor(200, 200, 200)
          doc.roundedRect(145, y + 7, (row.avgCompetitorScore / 100) * 50, 6, 2, 2, 'F')
          doc.text(`${row.avgCompetitorScore}`, 198, y + 12, { align: 'right' })
          
          y += 22
        })
      }
      
      drawFooter(doc)
    }
    
    // ==================== PAGE 5: Closing ====================
    if (contentSuggestions.length > 0) {
      doc.addPage()
      drawHeader(doc, '内容建议', 5, 6)
      
      y = 35
      
      doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2])
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('内容优化建议', 15, y)
      
      y += 12
      
      contentSuggestions.forEach((content, i) => {
        if (y > 260) {
          doc.addPage()
          drawHeader(doc, '内容建议', 5.1, 6)
          y = 35
        }
        
        const cardHeight = 40
        doc.setFillColor(COLORS.bgLight[0], COLORS.bgLight[1], COLORS.bgLight[2])
        doc.roundedRect(10, y, 190, cardHeight, 3, 3, 'F')
        
        doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2])
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text(`[${content.priority || '中'}]`, 15, y + 12)
        
        doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2])
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        const contentLines = doc.splitTextToSize(content.content, 170)
        doc.text(contentLines.slice(0, 3), 40, y + 22)
        
        y += cardHeight + 6
      })
      
      drawFooter(doc)
    }
    
    // ==================== PAGE 6: Closing ====================
    doc.addPage()
    drawHeader(doc, '结语', 6, 6)
    
    y = 50
    
    // Closing message
    doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2])
    doc.roundedRect(10, y, 190, 100, 5, 5, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('感谢使用魔鲸GEO', 105, y + 25, { align: 'center' })
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    const closingText = '本报告基于AI搜索引擎算法和GEO健康度模型生成，帮助您全面了解品牌在AI时代的可见度和竞争力。'
    const closingLines = doc.splitTextToSize(closingText, 170)
    doc.text(closingLines, 105, y + 45, { align: 'center' })
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('持续优化，让品牌在AI时代脱颖而出！', 105, y + 80, { align: 'center' })
    
    y += 115
    
    // Next steps
    doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2])
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('后续步骤', 15, y)
    
    y += 12
    
    const nextSteps = [
      { title: '制定优化计划', desc: '根据各维度建议制定具体的优化执行计划' },
      { title: '内容生产', desc: '使用模法模块生成AI友好的优化内容' },
      { title: '定期复查', desc: '建议每月进行一次GEO健康度检测' }
    ]
    
    nextSteps.forEach((step, i) => {
      doc.setFillColor(COLORS.bgLight[0], COLORS.bgLight[1], COLORS.bgLight[2])
      doc.roundedRect(10, y + i * 25, 190, 22, 3, 3, 'F')
      
      doc.setFillColor(COLORS.success[0], COLORS.success[1], COLORS.success[2])
      doc.circle(22, y + i * 25 + 11, 7, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text(`${i + 1}`, 20, y + i * 25 + 14)
      
      doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2])
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text(step.title, 35, y + i * 25 + 10)
      
      doc.setTextColor(COLORS.textGray[0], COLORS.textGray[1], COLORS.textGray[2])
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text(step.desc, 35, y + i * 25 + 18)
    })
    
    drawFooter(doc)
    
    // Save PDF
    const fileName = `GEO诊断报告_${report.value.brandName}_${formatDate(report.value.date)}.pdf`
    doc.save(fileName)
    console.log('PDF exported successfully:', fileName)
    
  } catch (error) {
    console.error('PDF export failed:', error)
    alert('PDF 导出失败，请重试')
  }
}

// Export as text file (no font issues)
const exportAsText = async () => {
  try {
    const dimensions = aiResult.value?.dimensions || []
    const overallScore = aiResult.value?.overallScore || report.value.score || 0
    const summary = aiResult.value?.summary || report.value.summary || '暂无摘要信息'
    const keyFindings = aiResult.value?.keyFindings || []
    const competitorAnalysis = aiResult.value?.competitorAnalysis
    const contentSuggestions = aiResult.value?.contentSuggestions || []
    
    const dateStr = formatDate(report.value.date)
    const brandName = report.value.brandName || '品牌'
    
    let content = ''
    content += '='.repeat(55) + '\n'
    content += '          AI可见度诊断报告 (GEO健康分)\n'
    content += '='.repeat(55) + '\n\n'
    
    content += `品牌名称: ${brandName}\n`
    content += `诊断类型: ${report.value.type}\n`
    content += `诊断时间: ${dateStr}\n`
    content += `AI 引擎: ${report.value.engineName || '通用引擎'}\n`
    content += `报告编号: ${report.value.id || 'N/A'}\n`
    content += '\n' + '='.repeat(55) + '\n'
    content += `  综合GEO健康分: ${overallScore} 分 (${getGradeLabel(overallScore)})\n`
    content += '  超越 ' + getPercentile(overallScore) + '% 的同类品牌\n'
    content += '='.repeat(55) + '\n\n'
    
    content += '【执行摘要】\n'
    content += '-'.repeat(40) + '\n'
    content += summary.replace(/\n/g, '\n  ') + '\n\n'
    
    if (keyFindings.length > 0) {
      content += '【关键发现】\n'
      content += '-'.repeat(40) + '\n'
      keyFindings.forEach((finding, i) => {
        content += `  ${i + 1}. ${finding}\n`
      })
      content += '\n'
    }
    
    content += '【七维度健康分详情】\n'
    content += '-'.repeat(40) + '\n'
    dimensions.forEach((dim, i) => {
      const score = dim.score || 0
      const benchmark = dim.benchmark || 60
      const bar = '█'.repeat(Math.round(score / 5)) + '░'.repeat(20 - Math.round(score / 5))
      const status = score >= benchmark ? '(高于基准)' : '(低于基准)'
      content += `\n${dim.name} [权重${dim.weight}%]\n`
      content += `  得分: ${score}分 ${status} | 基准: ${benchmark}分\n`
      content += `  进度: [${bar}]\n`
      content += `  说明: ${dim.description}\n`
      if (dim.findings && dim.findings.length > 0) {
        dim.findings.forEach(f => {
          content += `  • ${f}\n`
        })
      }
      if (dim.suggestions && dim.suggestions.length > 0) {
        content += `  优化建议:\n`
        dim.suggestions.forEach(s => {
          const mark = s.priority === '高' ? '[!]' : s.priority === '中' ? '[~]' : '[ ]'
          content += `    ${mark} [${s.priority}] ${s.action}\n`
        })
      }
    })
    content += '\n'
    
    if (competitorAnalysis && competitorAnalysis.mainCompetitors) {
      content += '【竞品分析】\n'
      content += '-'.repeat(40) + '\n'
      content += `  ${brandName} (您的品牌): ${overallScore}分\n`
      competitorAnalysis.mainCompetitors.forEach(comp => {
        content += `  ${comp.name}: ${comp.mentionRate}%提及率\n`
        if (comp.advantage && comp.advantage.length) {
          content += `    优势: ${comp.advantage.join(', ')}\n`
        }
      })
      content += '\n'
    }
    
    if (contentSuggestions.length > 0) {
      content += '【内容建议】\n'
      content += '-'.repeat(40) + '\n'
      contentSuggestions.forEach((sug, i) => {
        const mark = sug.priority === '高' ? '[!]' : sug.priority === '中' ? '[~]' : '[ ]'
        content += `  ${mark} [${sug.priority}] ${sug.content}\n`
      })
      content += '\n'
    }
    
    content += '='.repeat(50) + '\n'
    content += `报告生成时间: ${new Date().toLocaleString('zh-CN')}\n`
    content += '让GEO像呼吸一样简单 | www.modelbuddy.net\n'
    content += '='.repeat(50) + '\n'
    
    // Create and download file
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `品牌诊断报告_${brandName}_${dateStr}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    console.log('Text report exported successfully')
  } catch (error) {
    console.error('Text export failed:', error)
    alert('文本导出失败，请重试')
  }
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

.export-dropdown { position: relative; }
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 100;
  min-width: 140px;
}
.dropdown-menu button {
  display: block;
  width: 100%;
  padding: 10px 16px;
  text-align: left;
  background: none;
  border: none;
  font-size: 0.875rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: background 0.2s;
}
.dropdown-menu button:hover {
  background: var(--bg-light);
}

.loading-section { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 24px; gap: 16px; }
.loading-spinner { width: 40px; height: 40px; border: 3px solid var(--border-color); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.detail-content { max-width: 1200px; margin: 0 auto; padding: 24px; display: flex; flex-direction: column; gap: 24px; }

.score-overview { background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: 20px; padding: 32px; display: flex; gap: 40px; align-items: center; }
@media (max-width: 768px) { .score-overview { flex-direction: column; } }
.big-score-card { text-align: center; flex-shrink: 0; }
.big-score { font-size: 5rem; font-weight: 900; line-height: 1; color: var(--text-primary); }
.score-grade { display: inline-block; padding: 6px 20px; border-radius: 8px; font-size: 1.25rem; font-weight: 800; margin: 8px 0; }
.grade-A { background: rgba(16, 185, 129, 0.15); color: var(--color-success); }
.grade-B { background: rgba(99, 102, 241, 0.15); color: var(--color-primary); }
.grade-C { background: rgba(245, 158, 11, 0.15); color: var(--color-warning); }
.grade-D { background: rgba(239, 68, 68, 0.15); color: var(--color-danger); }
.score-label { font-size: 0.875rem; color: var(--text-secondary); }
.score-rank { font-size: 0.75rem; color: var(--color-primary); margin-top: 4px; }

.dimension-cards { flex: 1; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
@media (max-width: 900px) { .dimension-cards { grid-template-columns: 1fr; } }
.dim-card { display: flex; flex-direction: column; gap: 6px; background: var(--bg-primary); padding: 14px; border-radius: 12px; }
.dim-header { display: flex; justify-content: space-between; align-items: center; }
.dim-name { font-size: 0.8125rem; color: var(--text-secondary); font-weight: 500; }
.dim-score { font-size: 1.125rem; font-weight: 700; color: var(--text-primary); }
.dim-score small { font-size: 0.75rem; font-weight: 400; }
.dim-bar { height: 6px; background: var(--border-color); border-radius: 3px; overflow: visible; position: relative; }
.dim-fill { height: 100%; border-radius: 3px; transition: width 1s; }
.dim-benchmark { position: absolute; top: -2px; width: 2px; height: 10px; background: var(--text-secondary); border-radius: 1px; }
.dim-desc { font-size: 0.6875rem; color: var(--text-secondary); margin-top: 2px; }

.summary-section, .insights-section, .competitor-section, .issues-section, .findings-section, .recommendations-section, .content-section { background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: 16px; padding: 24px; }
.section-title { font-size: 0.9375rem; font-weight: 700; margin-bottom: 16px; color: var(--text-primary); }
.summary-content { font-size: 0.9375rem; line-height: 1.8; color: var(--text-secondary); }
.summary-content strong { color: var(--text-primary); font-weight: 600; }

.key-findings-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
@media (max-width: 768px) { .key-findings-grid { grid-template-columns: 1fr; } }
.key-finding-card { display: flex; align-items: flex-start; gap: 12px; background: var(--bg-primary); padding: 16px; border-radius: 12px; }
.key-finding-icon { font-size: 1.25rem; flex-shrink: 0; width: 28px; height: 28px; background: var(--bg-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.key-finding-text { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5; }

.dimension-details { display: flex; flex-direction: column; gap: 16px; }
.dim-detail-card { background: var(--bg-primary); border-radius: 16px; padding: 20px; }
.dim-detail-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color); }
.dim-detail-title { display: flex; flex-direction: column; gap: 4px; }
.dim-detail-name { font-size: 1rem; font-weight: 700; color: var(--text-primary); }
.dim-detail-weight { font-size: 0.75rem; color: var(--text-secondary); }
.dim-detail-score { font-size: 1.5rem; font-weight: 800; display: flex; align-items: baseline; gap: 6px; }
.score-unit { font-size: 0.75rem; font-weight: 500; }
.score-compare { font-size: 0.6875rem; font-weight: 600; padding: 2px 6px; border-radius: 4px; }
.score-compare.above { background: rgba(16, 185, 129, 0.15); }
.score-compare.below { background: rgba(239, 68, 68, 0.15); }
.dim-detail-findings { margin-bottom: 16px; }
.dim-detail-findings h4 { font-size: 0.8125rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 10px; }
.dim-detail-findings ul { list-style: none; padding: 0; margin: 0; }
.dim-detail-findings li { font-size: 0.875rem; color: var(--text-secondary); padding: 6px 0; padding-left: 16px; position: relative; line-height: 1.5; }
.dim-detail-findings li::before { content: '•'; position: absolute; left: 0; color: var(--color-primary); }

.dim-detail-suggestions h4 { font-size: 0.8125rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 10px; }
.suggestion-list { display: flex; flex-direction: column; gap: 8px; }
.suggestion-item { display: flex; align-items: flex-start; gap: 10px; font-size: 0.875rem; }
.sug-priority { padding: 2px 8px; border-radius: 4px; font-size: 0.6875rem; font-weight: 600; flex-shrink: 0; }
.sug-action { color: var(--text-secondary); line-height: 1.5; }

.competitor-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
@media (max-width: 768px) { .competitor-grid { grid-template-columns: repeat(2, 1fr); } }
.competitor-card { background: var(--bg-primary); border-radius: 12px; padding: 20px; text-align: center; }
.competitor-card.main-brand { background: linear-gradient(135deg, var(--color-primary), #818cf8); }
.competitor-card.main-brand .competitor-name, .competitor-card.main-brand .competitor-score { color: white; }
.competitor-name { font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
.competitor-score { font-size: 0.875rem; color: var(--text-secondary); }
.competitor-label { font-size: 0.6875rem; color: rgba(255,255,255,0.8); margin-top: 4px; }
.competitor-advantages { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px; margin-top: 8px; }
.advantage-tag { font-size: 0.625rem; background: var(--bg-light); padding: 2px 6px; border-radius: 4px; color: var(--text-secondary); }

.findings-list { display: flex; flex-direction: column; gap: 12px; }
.finding-card { background: var(--bg-primary); border-radius: 12px; padding: 16px; }
.finding-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.finding-name { font-size: 0.9375rem; font-weight: 600; color: var(--text-primary); }
.finding-score { font-size: 1rem; font-weight: 700; }
.finding-findings { display: flex; flex-direction: column; gap: 6px; }
.finding-item { font-size: 0.8125rem; color: var(--text-secondary); padding-left: 12px; border-left: 2px solid var(--border-color); }

.recommendations-list { display: flex; flex-direction: column; gap: 10px; }
.rec-card { display: flex; align-items: flex-start; gap: 10px; background: var(--bg-primary); border-radius: 10px; padding: 14px; }
.rec-number { width: 24px; height: 24px; border-radius: 50%; background: var(--color-primary); color: white; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.rec-dim-tag { font-size: 0.6875rem; font-weight: 700; color: var(--color-primary); background: rgba(99, 102, 241, 0.1); padding: 2px 6px; border-radius: 4px; flex-shrink: 0; }
.rec-priority { padding: 2px 8px; border-radius: 4px; font-size: 0.6875rem; font-weight: 600; flex-shrink: 0; }
.rec-text { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5; }

.content-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
@media (max-width: 768px) { .content-list { grid-template-columns: 1fr; } }
.content-card { background: var(--bg-primary); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 8px; }
.content-priority { align-self: flex-start; padding: 2px 8px; border-radius: 4px; font-size: 0.6875rem; font-weight: 600; }
.content-type { font-size: 0.75rem; font-weight: 600; color: var(--color-primary); text-transform: uppercase; }
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
.priority-高 { background: rgba(239, 68, 68, 0.15); color: var(--color-danger); }
.priority-中 { background: rgba(245, 158, 11, 0.15); color: var(--color-warning); }
.priority-低 { background: rgba(16, 185, 129, 0.15); color: var(--color-success); }
.issue-body h4 { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; }
.issue-body p { font-size: 0.8125rem; color: var(--text-secondary); margin-bottom: 8px; }
.issue-suggestion { font-size: 0.8125rem; color: var(--text-primary); background: var(--bg-elevated); padding: 8px 12px; border-radius: 8px; }
</style>
