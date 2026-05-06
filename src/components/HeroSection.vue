<template>
  <section class="hero-section">
    <div class="container">
      <div class="hero-content">
        <h1 class="hero-title">
          魔鲸GEO，让AI生成式引擎优化像呼吸一样简单
        </h1>
        <p class="hero-desc">
          一站式生成式引擎优化平台，从诊断、策略到自动执行，全链路AI赋能。
        </p>
        <div class="hero-actions">
          <a class="btn-primary" href="#">免费诊断一次</a>
          <a class="btn-outline" href="#">预约演示</a>
        </div>
      </div>

      <div class="hero-visual glass-card">
        <div class="visual-content">
          <h3>全球领先AI模型支持</h3>
          <div class="icon-group">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.container {
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.hero-title {
  font-size: 48px;
  line-height: 1.2;
  font-weight: 700;
  color: #111827;
  margin-bottom: 24px;
}

.hero-desc {
  font-size: 18px;
  color: #6B7280;
  margin-bottom: 32px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

.hero-visual {
  padding: 40px;
}

.visual-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
}

.icon-group {
  display: flex;
  gap: 20px;
  color: #374151;
}
</style>
