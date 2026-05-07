<template>
  <section id="about" class="py-20 relative about-section">
    <div class="max-w-6xl mx-auto px-6">

      <!-- Section header -->
      <div class="text-center mb-16">
        <span class="inline-block px-4 py-1.5 rounded-full text-xs font-medium mb-6 about-badge scroll-animate">
          关于我们
        </span>
        <h2 class="text-4xl sm:text-5xl font-bold mb-4 about-title scroll-animate delay-100">
          让 AI 认识你的品牌
        </h2>
        <p class="text-lg max-w-2xl mx-auto about-desc scroll-animate delay-200">
          魔鲸 GEO Claw 团队专注于大模型优化领域，用技术帮助企业在 AI 时代获得更好的可见度
        </p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 stagger-children scroll-animate">
        <div class="stat-card">
          <div class="stat-number">50+</div>
          <div class="stat-label">服务企业</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">200+</div>
          <div class="stat-label">优化案例</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">8</div>
          <div class="stat-label">覆盖引擎</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">95%</div>
          <div class="stat-label">客户满意度</div>
        </div>
      </div>

      <!-- Team -->
      <div class="mb-16">
        <h3 class="text-2xl font-bold text-center mb-10 about-team-title scroll-animate">
          核心团队
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children scroll-animate">
          <div v-for="member in team" :key="member.name" class="team-card">
            <div class="team-avatar" :style="{ background: member.avatar }">
              {{ member.name.charAt(0) }}
            </div>
            <div class="team-info">
              <h4 class="team-name">{{ member.name }}</h4>
              <p class="team-role">{{ member.role }}</p>
              <p class="team-desc">{{ member.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Values -->
      <div>
        <h3 class="text-2xl font-bold text-center mb-10 about-team-title scroll-animate">
          我们的价值观
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children scroll-animate">
          <div v-for="value in values" :key="value.title" class="value-card">
            <div class="value-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" v-html="value.icon"></svg>
            </div>
            <h4 class="value-title">{{ value.title }}</h4>
            <p class="value-desc">{{ value.desc }}</p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
const team = [
  {
    name: '李明',
    role: '创始人 & CEO',
    desc: '前某大厂搜索算法专家，深耕 NLP 领域10年，专注于 AI 搜索优化方向。',
    avatar: 'linear-gradient(135deg, #165DFF, #8B5CF6)'
  },
  {
    name: '王芳',
    role: 'CTO',
    desc: '前某云厂商技术VP，主导过多个大型分布式系统架构，具有丰富的工程落地经验。',
    avatar: 'linear-gradient(135deg, #10B981, #06B6D4)'
  },
  {
    name: '张强',
    role: '产品负责人',
    desc: '7年产品经验，曾负责多个 toB SaaS 产品从0到1的搭建。',
    avatar: 'linear-gradient(135deg, #F59E0B, #EF4444)'
  }
]

const values = [
  {
    title: '技术驱动',
    desc: '用先进的技术手段解决实际问题，让 AI 更好地理解和呈现品牌价值。',
    icon: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>'
  },
  {
    title: '客户至上',
    desc: '深入理解客户需求，提供切实可行的解决方案，与客户共同成长。',
    icon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>'
  },
  {
    title: '持续创新',
    desc: '保持对新技术的好奇心，不断探索 GEO 领域的边界，引领行业发展。',
    icon: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'
  }
]
</script>

<style scoped>
.about-section {
  background: var(--bg-section);
}

.about-badge {
  background: var(--color-primary-alpha);
  color: var(--color-primary);
  border: 1px solid var(--color-primary-alpha);
}

.about-title {
  color: var(--text-primary);
}

.about-desc {
  color: var(--text-secondary);
}

.about-team-title {
  color: var(--text-primary);
}

/* Stats */
.stat-card {
  text-align: center;
  padding: 24px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-primary), #8B5CF6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Team */
.team-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.team-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card);
}

.team-avatar {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.team-info {
  flex: 1;
}

.team-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.team-role {
  font-size: 0.8125rem;
  color: var(--color-primary);
  margin-bottom: 8px;
}

.team-desc {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Values */
.value-card {
  padding: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s ease;
}

.value-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card);
  border-color: var(--color-primary-alpha);
}

.value-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-alpha);
  border-radius: 12px;
  color: var(--color-primary);
}

.value-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.value-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
}
</style>
