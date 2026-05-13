<template>
  <div class="ai-diagnosis-panel">
    <div class="panel-header">
      <h3>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
        AI 智能诊断
      </h3>
      <button class="refresh-btn" @click="refreshData" :disabled="loading">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M23 4v6h-6"/>
          <path d="M1 20v-6h6"/>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
        </svg>
      </button>
    </div>

    <!-- 完整度概览 -->
    <div class="completeness-section" v-if="completenessData">
      <div class="completeness-header">
        <span>知识库完整度</span>
        <span class="score" :class="getScoreClass(completenessData.overall)">
          {{ (completenessData.overall * 100).toFixed(0) }}%
        </span>
      </div>
      <div class="completeness-bar">
        <div class="bar-fill" :style="{ width: (completenessData.overall * 100) + '%' }" 
             :class="getScoreClass(completenessData.overall)"></div>
      </div>
      <div class="section-breakdown">
        <div v-for="section in completenessData.sections" :key="section.name" 
             class="section-item" :class="section.status">
          <span class="section-name">{{ section.name }}</span>
          <span class="section-score">{{ (section.score * 100).toFixed(0) }}%</span>
        </div>
      </div>
    </div>

    <!-- 关键词建议 -->
    <div class="keywords-section" v-if="keywordData">
      <h4>推荐关键词</h4>
      <div class="keyword-tags">
        <span class="keyword-tag primary" v-for="kw in keywordData.primary" :key="kw">{{ kw }}</span>
      </div>
      <div class="keyword-tags secondary">
        <span class="keyword-tag" v-for="kw in keywordData.secondary" :key="kw">{{ kw }}</span>
      </div>
      <div class="competition-badge" :class="keywordData.competition">
        竞争度: {{ getCompetitionLabel(keywordData.competition) }}
      </div>
    </div>

    <!-- 诊断建议 -->
    <div class="diagnosis-section" v-if="diagnosisData?.shouldSuggest">
      <div class="diagnosis-alert">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <div class="alert-content">
          <p>{{ diagnosisData.reason }}</p>
          <span class="last-check" v-if="diagnosisData.lastDiagnosisAge">
            上次诊断: {{ diagnosisData.lastDiagnosisAge }} 天前
          </span>
        </div>
      </div>
      <button class="trigger-btn" @click="triggerDiagnosis" :disabled="diagnosing">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
        {{ diagnosing ? '诊断中...' : '立即诊断' }}
      </button>
    </div>

    <!-- 语义搜索 -->
    <div class="search-section">
      <h4>语义搜索</h4>
      <div class="search-box">
        <input v-model="searchQuery" type="text" placeholder="输入关键词搜索相关内容..." 
               @keyup.enter="doSemanticSearch" />
        <button @click="doSemanticSearch" :disabled="searching">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
      </div>
      <div class="search-results" v-if="searchResults.length > 0">
        <div class="result-item" v-for="(result, index) in searchResults" :key="index">
          <div class="result-header">
            <span class="result-section">{{ result.section }}</span>
            <span class="result-similarity">{{ (result.similarity * 100).toFixed(1) }}% 匹配</span>
          </div>
          <p class="result-text">{{ result.text }}</p>
        </div>
      </div>
    </div>

    <!-- 推荐建议 -->
    <div class="recommendations-section" v-if="completenessData?.recommendations?.length > 0">
      <h4>优化建议</h4>
      <ul class="recommendations-list">
        <li v-for="(rec, index) in completenessData.recommendations" :key="index">
          {{ rec }}
        </li>
      </ul>
    </div>

    <!-- 向量索引状态 -->
    <div class="index-status" v-if="indexStatus">
      <span class="status-dot" :class="{ active: indexStatus.indexed }"></span>
      <span>向量索引 {{ indexStatus.indexed ? '已就绪' : '未构建' }}</span>
      <button v-if="!indexStatus.indexed" class="index-btn" @click="rebuildIndex">
        构建索引
      </button>
    </div>

    <!-- 加载状态 -->
    <div class="loading-state" v-if="loading">
      <div class="spinner"></div>
      <span>加载中...</span>
    </div>
  </div>
</template>

<script>
import { 
  getCompletenessReport,
  getKeywordSuggestions,
  getDiagnosisSuggestion,
  triggerIncrementalDiagnosis,
  semanticSearch,
  getIndexStatus,
  rebuildIndex 
} from '@/api/knowledge'

export default {
  name: 'AIDiagnosisPanel',
  data() {
    return {
      completenessData: null,
      keywordData: null,
      diagnosisData: null,
      indexStatus: null,
      searchQuery: '',
      searchResults: [],
      loading: false,
      diagnosing: false,
      searching: false,
    }
  },
  mounted() {
    this.refreshData()
  },
  methods: {
    async refreshData() {
      this.loading = true
      try {
        const [completeness, keywords, diagnosis, status] = await Promise.all([
          getCompletenessReport().catch(() => null),
          getKeywordSuggestions().catch(() => null),
          getDiagnosisSuggestion().catch(() => null),
          getIndexStatus().catch(() => null),
        ])

        this.completenessData = completeness?.data
        this.keywordData = keywords?.data
        this.diagnosisData = diagnosis?.data
        this.indexStatus = status?.data
      } catch (error) {
        console.error('加载诊断数据失败:', error)
      } finally {
        this.loading = false
      }
    },

    getScoreClass(score) {
      if (score >= 0.7) return 'good'
      if (score >= 0.4) return 'warning'
      return 'critical'
    },

    getCompetitionLabel(level) {
      const labels = {
        high: '高',
        medium: '中',
        low: '低'
      }
      return labels[level] || level
    },

    async triggerDiagnosis() {
      this.diagnosing = true
      try {
        const result = await triggerIncrementalDiagnosis()
        if (result.success) {
          this.$message.success('诊断任务已创建，请稍后查看结果')
          this.$router.push('/app/diagnose')
        }
      } catch (error) {
        this.$message.error('触发诊断失败')
      } finally {
        this.diagnosing = false
      }
    },

    async doSemanticSearch() {
      if (!this.searchQuery.trim()) return
      
      this.searching = true
      try {
        const result = await semanticSearch(this.searchQuery)
        this.searchResults = result.data?.results || []
      } catch (error) {
        this.$message.error('搜索失败')
      } finally {
        this.searching = false
      }
    },

    async rebuildIndex() {
      try {
        await rebuildIndex()
        this.$message.success('索引构建成功')
        await this.refreshData()
      } catch (error) {
        this.$message.error('索引构建失败')
      }
    }
  }
}
</script>

<style scoped>
.ai-diagnosis-panel {
  background: var(--bg-elevated);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.panel-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 16px;
  color: var(--text-primary);
}

.refresh-btn {
  background: var(--bg-secondary);
  border: none;
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.refresh-btn:hover {
  background: var(--bg-primary);
  color: var(--primary-color);
}

/* 完整度 */
.completeness-section {
  margin-bottom: 20px;
}

.completeness-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.score {
  font-weight: 600;
}

.score.good { color: #52c41a; }
.score.warning { color: #faad14; }
.score.critical { color: #f5222d; }

.completeness-bar {
  height: 6px;
  background: var(--bg-secondary);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 12px;
}

.bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s;
}

.bar-fill.good { background: #52c41a; }
.bar-fill.warning { background: #faad14; }
.bar-fill.critical { background: #f5222d; }

.section-breakdown {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 4px 0;
}

.section-name { color: var(--text-secondary); }
.section-score { font-weight: 500; }

.section-item.good .section-score { color: #52c41a; }
.section-item.warning .section-score { color: #faad14; }
.section-item.critical .section-score { color: #f5222d; }

/* 关键词 */
.keywords-section {
  margin-bottom: 20px;
}

.keywords-section h4 {
  font-size: 14px;
  margin: 0 0 10px;
  color: var(--text-primary);
}

.keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.keyword-tag {
  padding: 4px 10px;
  background: var(--bg-secondary);
  border-radius: 12px;
  font-size: 12px;
  color: var(--text-secondary);
}

.keyword-tag.primary {
  background: rgba(24, 144, 255, 0.1);
  color: #1890ff;
}

.competition-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  margin-top: 8px;
}

.competition-badge.high {
  background: rgba(245, 34, 45, 0.1);
  color: #f5222d;
}

.competition-badge.medium {
  background: rgba(250, 173, 20, 0.1);
  color: #faad14;
}

.competition-badge.low {
  background: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

/* 诊断建议 */
.diagnosis-section {
  margin-bottom: 20px;
}

.diagnosis-alert {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: rgba(250, 173, 20, 0.1);
  border-radius: 8px;
  margin-bottom: 12px;
}

.diagnosis-alert svg {
  flex-shrink: 0;
  color: #faad14;
}

.alert-content p {
  margin: 0;
  font-size: 13px;
  color: var(--text-primary);
}

.last-check {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 4px;
  display: block;
}

.trigger-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.trigger-btn:hover {
  background: #40a9ff;
}

/* 语义搜索 */
.search-section {
  margin-bottom: 20px;
}

.search-section h4 {
  font-size: 14px;
  margin: 0 0 10px;
  color: var(--text-primary);
}

.search-box {
  display: flex;
  gap: 8px;
}

.search-box input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 13px;
}

.search-box button {
  padding: 8px 12px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.search-results {
  margin-top: 12px;
  max-height: 200px;
  overflow-y: auto;
}

.result-item {
  padding: 10px;
  background: var(--bg-secondary);
  border-radius: 6px;
  margin-bottom: 8px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.result-section {
  font-size: 12px;
  color: var(--primary-color);
}

.result-similarity {
  font-size: 11px;
  color: var(--text-secondary);
}

.result-text {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 推荐建议 */
.recommendations-section {
  margin-bottom: 20px;
}

.recommendations-section h4 {
  font-size: 14px;
  margin: 0 0 10px;
  color: var(--text-primary);
}

.recommendations-list {
  margin: 0;
  padding-left: 20px;
}

.recommendations-list li {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

/* 索引状态 */
.index-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-secondary);
}

.status-dot.active {
  background: #52c41a;
}

.index-btn {
  margin-left: auto;
  padding: 4px 8px;
  background: var(--bg-secondary);
  border: none;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
}

/* 加载状态 */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  color: var(--text-secondary);
  font-size: 13px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
