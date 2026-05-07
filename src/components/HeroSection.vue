<template>
  <section class="hero-section">
    <!-- Background effects -->
    <div class="hero-bg">
      <div class="hero-gradient"></div>
      <div class="hero-grid"></div>
    </div>
    
    <div class="section-container">
      <div class="hero-content">
        <!-- Badge -->
        <div class="hero-badge animate-fade-in-up">
          <span class="badge-dot"></span>
          <span>国内首个 GEO 全闭环 SaaS 平台</span>
        </div>
        
        <!-- Main headline -->
        <h1 class="hero-headline animate-fade-in-up" style="animation-delay: 0.1s;">
          <span class="gradient-text">魔鲸GEO</span>，让AI优化<br />
          像呼吸一样简单
        </h1>
        
        <!-- Subheadline -->
        <p class="hero-subheadline animate-fade-in-up" style="animation-delay: 0.2s;">
          诊断 · 策略 · 执行 · 监控<br />
          全链路 AI 赋能，一站式提升品牌在主流大模型中的可见度
        </p>
        
        <!-- Key metrics -->
        <div class="hero-metrics animate-fade-in-up" style="animation-delay: 0.3s;">
          <div class="metric-item">
            <span class="metric-value">6+</span>
            <span class="metric-label">主流 AI 引擎</span>
          </div>
          <div class="metric-divider"></div>
          <div class="metric-item">
            <span class="metric-value">7</span>
            <span class="metric-label">维度健康诊断</span>
          </div>
          <div class="metric-divider"></div>
          <div class="metric-item">
            <span class="metric-value">3min</span>
            <span class="metric-label">完成首次诊断</span>
          </div>
        </div>
        
        <!-- CTA buttons -->
        <div class="hero-actions animate-fade-in-up" style="animation-delay: 0.4s;">
          <button @click="$emit('open-contact')" class="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-2">
              <circle cx="12" cy="12" r="10"/>
              <polygon points="10,8 16,12 10,16" fill="currentColor"/>
            </svg>
            预约演示
          </button>
          <button @click="$emit('open-contact')" class="btn-outline-inverse">
            获取邀请码
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ml-2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12,5 19,12 12,19"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Dashboard preview -->
      <div class="hero-dashboard animate-fade-in-up" style="animation-delay: 0.5s;">
        <div class="dashboard-card">
          <!-- Header -->
          <div class="dashboard-header">
            <div class="dashboard-dots">
              <span></span><span></span><span></span>
            </div>
            <span class="dashboard-title">魔鲸GEO · 诊断看板</span>
          </div>
          
          <!-- Metrics row -->
          <div class="dashboard-metrics">
            <div class="dash-metric">
              <span class="dash-metric-label">GEO健康分</span>
              <span class="dash-metric-value" style="color: #165DFF;">72</span>
              <span class="dash-metric-trend up">↑ 8%</span>
            </div>
            <div class="dash-metric">
              <span class="dash-metric-label">DeepSeek提及率</span>
              <span class="dash-metric-value" style="color: #10B981;">+34%</span>
              <span class="dash-metric-trend up">↑ 34%</span>
            </div>
            <div class="dash-metric">
              <span class="dash-metric-label">竞品压制</span>
              <span class="dash-metric-value" style="color: #8B5CF6;">+12%</span>
              <span class="dash-metric-trend up">↑ 12%</span>
            </div>
          </div>
          
          <!-- AI Model Logos Grid -->
          <div class="ai-logos-section">
            <!-- 国产大模型 -->
            <div class="ai-logos-row">
              <a href="https://www.doubao.com" target="_blank" class="ai-logo-card wide">
                <img src="/ai-logos/doubao-color.svg" alt="豆包" />
                <span>豆包</span>
              </a>
              <a href="https://tongyi.aliyun.com" target="_blank" class="ai-logo-card">
                <img src="/ai-logos/qwen-color.svg" alt="千问" />
                <span>千问</span>
              </a>
              <a href="https://yuanbao.tencent.com" target="_blank" class="ai-logo-card">
                <img src="/ai-logos/yuanbao-color.svg" alt="元宝" />
                <span>元宝</span>
              </a>
              <a href="https://chatglm.cn" target="_blank" class="ai-logo-card">
                <img src="/ai-logos/zhipu-color.svg" alt="智谱" />
                <span>智谱</span>
              </a>
              <a href="https://www.deepseek.com" target="_blank" class="ai-logo-card">
                <img src="/ai-logos/deepseek-color.svg" alt="DeepSeek" />
                <span>DeepSeek</span>
              </a>
            </div>
            <!-- 国外大模型 -->
            <div class="ai-logos-row">
              <a href="https://claude.ai" target="_blank" class="ai-logo-card">
                <img src="/ai-logos/claude-color.svg" alt="Claude" />
                <span>Claude</span>
              </a>
              <a href="https://gemini.google.com" target="_blank" class="ai-logo-card">
                <img src="/ai-logos/gemini-color.svg" alt="Gemini" />
                <span>Gemini</span>
              </a>
              <a href="https://grok.x.ai" target="_blank" class="ai-logo-card">
                <img src="/ai-logos/grok.svg" alt="Grok" />
                <span>Grok</span>
              </a>
              <a href="https://www.meta.ai" target="_blank" class="ai-logo-card">
                <img src="/ai-logos/meta-color.svg" alt="Meta" />
                <span>Meta</span>
              </a>
              <a href="https://chat.openai.com" target="_blank" class="ai-logo-card wide">
                <img src="/ai-logos/openai.svg" alt="OpenAI" />
                <span>OpenAI</span>
              </a>
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
  </section>
</template>

<script setup>
defineEmits(['open-contact'])

const engines = [
  { name: 'DeepSeek', color: '#4D6BFE' },
  { name: '豆包', color: '#1E37FC' },
  { name: '文心一言', color: '#0A51C3' },
  { name: 'Kimi', color: '#8B6CFF' },
  { name: '通义千问', color: '#6336E7' },
]
</script>

<style scoped>
.hero-section {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 0 80px;
  overflow: hidden;
  background: var(--bg-primary);
}

/* Background effects */
.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(22, 93, 255, 0.15), transparent),
    radial-gradient(ellipse 60% 40% at 80% 60%, rgba(139, 92, 246, 0.1), transparent),
    radial-gradient(ellipse 50% 30% at 20% 80%, rgba(16, 185, 129, 0.08), transparent);
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent);
}

/* Content */
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  position: relative;
  z-index: 1;
}

@media (max-width: 1024px) {
  .section-container {
    grid-template-columns: 1fr;
    gap: 60px;
    text-align: center;
  }
}

@media (max-width: 640px) {
  .section-container {
    padding: 0 24px;
  }
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}

@media (max-width: 1024px) {
  .hero-content {
    align-items: center;
  }
}

/* Badge */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(22, 93, 255, 0.1);
  border: 1px solid rgba(22, 93, 255, 0.2);
  border-radius: 9999px;
  font-size: 13px;
  color: var(--text-primary);
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: #165DFF;
  border-radius: 50%;
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Headline */
.hero-headline {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.15;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

@media (max-width: 768px) {
  .hero-headline {
    font-size: 2.5rem;
  }
}

.gradient-text {
  background: linear-gradient(135deg, #165DFF, #8B5CF6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Subheadline */
.hero-subheadline {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

/* Metrics */
.hero-metrics {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 20px 28px;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

@media (max-width: 640px) {
  .hero-metrics {
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.metric-label {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  white-space: nowrap;
}

.metric-divider {
  width: 1px;
  height: 40px;
  background: var(--border-color);
}

/* Actions */
.hero-actions {
  display: flex;
  gap: 16px;
}

@media (max-width: 640px) {
  .hero-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .hero-actions a {
    width: 100%;
    justify-content: center;
  }
}

/* Dashboard preview */
.hero-dashboard {
  position: relative;
  perspective: 1000px;
}

.dashboard-card {
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow-card);
  transform: rotateY(-5deg) rotateX(5deg);
  transition: transform 0.5s ease;
}

.hero-dashboard:hover .dashboard-card {
  transform: rotateY(0) rotateX(0);
}

@media (max-width: 1024px) {
  .dashboard-card {
    transform: none;
    max-width: 500px;
    margin: 0 auto;
  }
}

.dashboard-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.dashboard-dots {
  display: flex;
  gap: 6px;
}

.dashboard-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--border-color);
}

.dashboard-dots span:nth-child(1) { background: #EF4444; }
.dashboard-dots span:nth-child(2) { background: #F59E0B; }
.dashboard-dots span:nth-child(3) { background: #10B981; }

.dashboard-title {
  font-size: 13px;
  color: var(--text-secondary);
  margin-left: auto;
}

.dashboard-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.dash-metric {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  background: var(--bg-glass);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.dash-metric-label {
  font-size: 11px;
  color: var(--text-tertiary);
}

.dash-metric-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.dash-metric-trend {
  font-size: 11px;
}

.dash-metric-trend.up {
  color: #10B981;
}

/* AI Logos Grid */
.ai-logos-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ai-logos-row {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.ai-logo-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  transition: all 0.2s ease;
}

.ai-logo-card:hover {
  transform: translateY(-2px);
  border-color: rgba(22, 93, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.ai-logo-card img {
  width: 32px;
  height: 32px;
}

.ai-logo-card span {
  font-size: 11px;
  color: var(--text-secondary);
  white-space: nowrap;
}

@media (max-width: 640px) {
  .ai-logos-row {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .ai-logo-card {
    padding: 8px;
  }
  
  .ai-logo-card img {
    width: 28px;
    height: 28px;
  }
}@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 10px rgba(22, 93, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(22, 93, 255, 0.6);
  }
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
}
</style>