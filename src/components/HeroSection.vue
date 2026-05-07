<template>
  <section class="hero-section">
    <div class="container">
      <div class="hero-content">
        <h1 class="hero-title">
          MirusAI魔鲸智能，让GEO生成式引擎优化像呼吸一样简单
        </h1>
        <p class="hero-desc">
          一站式生成式引擎优化平台，从诊断、策略到自动执行，全链路AI赋能。
        </p>
        <div class="hero-actions">
          <a class="btn-primary" href="#">预约演示</a>
          <a class="btn-outline-inverse" href="#">获取邀请码</a>
        </div>
      </div>

      <div class="hero-visual-wrapper">
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.hero-content {
  text-align: center;
  max-width: 800px;
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
  justify-content: center;
}

.btn-primary {
  display: inline-block;
  padding: 12px 32px;
  background: #111827;
  color: #FFFFFF;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
}

.btn-outline-inverse {
  display: inline-block;
  padding: 12px 32px;
  background: #FFFFFF;
  color: #111827;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
}

.hero-visual-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

.hero-visual {
  padding: 40px;
  display: inline-block;
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
