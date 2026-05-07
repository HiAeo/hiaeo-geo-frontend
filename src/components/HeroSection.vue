<template>
  <section class="hero-section">
    <div class="container">
      <div class="hero-content">
        <h1 style="font-size:3rem;line-height:1.2;font-weight:800;" class="mb-5">
          <span style="font-weight:800">Mirus</span><span style="font-weight:400">AI</span>魔鲸智能，让GEO生成式引擎优化像呼吸一样简单
        </h1>
        <p class="hero-desc">
          一站式生成式引擎优化平台，从诊断、策略到自动执行，全链路AI赋能。
        </p>
        <div class="hero-actions">
          <a class="btn-primary" href="#">预约演示</a>
          <a class="btn-outline-inverse" href="#">获取邀请码</a>
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
</style>
