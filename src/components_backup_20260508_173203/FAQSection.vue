<template>
  <section id="faq" class="py-20 relative faq-section">
    <div class="max-w-3xl mx-auto px-6">

      <!-- Section header -->
      <div class="text-center mb-16">
        <span class="inline-block px-4 py-1.5 rounded-full text-xs font-medium mb-6 faq-badge scroll-animate">
          常见问题
        </span>
        <h2 class="text-4xl sm:text-5xl font-bold mb-4 faq-title scroll-animate delay-100">
          你可能想问的
        </h2>
        <p class="text-lg faq-desc scroll-animate delay-200">
          还有其他问题？<a href="mailto:contact@hiaeo.com" class="faq-link">联系我们</a>
        </p>
      </div>

      <!-- FAQ list -->
      <div class="space-y-4 stagger-children scroll-animate">
        <div 
          v-for="(item, index) in faqs" 
          :key="index"
          class="faq-item"
          :class="{ 'is-open': openIndex === index }"
        >
          <button 
            class="faq-question"
            @click="toggle(index)"
          >
            <span class="faq-question-text">{{ item.question }}</span>
            <svg 
              class="faq-icon" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div class="faq-answer">
            <p>{{ item.answer }}</p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const openIndex = ref(null)

const faqs = [
  {
    question: '什么是 GEO（Generative Engine Optimization）？',
    answer: 'GEO 是生成式引擎优化的缩写，是一种针对 AI 生成式搜索引擎（如 DeepSeek、豆包、Kimi 等）的内容优化技术。通过 GEO 优化，可以让品牌内容在 AI 搜索结果中获得更好的展示和推荐，提升品牌在主流大模型中的可见度和提及率。'
  },
  {
    question: '魔鲸GEO 和 SEO 有什么区别？',
    answer: 'SEO 主要针对传统搜索引擎优化，而 GEO 专注于 AI 生成式引擎。传统 SEO 关注关键词排名和页面索引，GEO 则关注语义实体、品牌实体独占率、内容语义相关性等 AI 算法更看重的因素。魔鲸GEO 提供的是面向 AI 时代的全新优化方案。'
  },
  {
    question: '我的企业适合使用魔鲸GEO 吗？',
    answer: '如果您的企业希望在 DeepSeek、豆包、Kimi、通义千问等主流 AI 平台提升品牌可见度，无论是 B2B 还是 B2C 业务，GEO 优化都能带来价值。尤其适合品牌认知度提升、竞品压制、获客增长等场景。'
  },
  {
    question: 'GEO 优化需要多长时间才能看到效果？',
    answer: '通常在持续执行 GEO 优化 2-4 周后，可以开始观察到 AI 提及率、品牌独占率等指标的变化。3-6 个月后效果会更加显著。具体周期取决于行业竞争程度、当前品牌基础和优化执行力度。'
  },
  {
    question: '模镜诊断是如何工作的？',
    answer: '模镜会实时抓取 DeepSeek、豆包、Kimi 等主流 AI 引擎的公开数据，从 7 个维度（实体独占率、语义相关性、内容覆盖率、竞品对比度、行业基准、技术完整性、合规性）对您的品牌 GEO 健康度进行诊断，生成可视化的雷达图和详细的优化建议报告。'
  },
  {
    question: '我的数据会被如何使用？是否安全？',
    answer: '您的数据仅用于 GEO 分析和优化服务。我们采用银行级加密存储（Vercel Edge + 腾讯云），符合国家数据安全法规。所有数据处理均在您授权范围内进行，未经同意不会共享给第三方。'
  },
  {
    question: '支持私有化部署吗？',
    answer: '是的，企业版支持私有化部署方案。我们可以为您部署独立的 GEO 分析系统，支持自定义语义库、专有数据隔离，满足对数据安全有更高要求的企业客户。'
  },
  {
    question: '如何升级或降级订阅方案？',
    answer: '您可以随时在账户设置中升级或降级订阅。升级立即生效，按剩余天数折算费用；降级则在当前周期结束后生效。我们提供 7 天无理由退款保障。'
  }
]

const toggle = (index) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<style scoped>
.faq-section {
  background: var(--bg-primary);
}

.faq-badge {
  background: rgba(139, 92, 246, 0.1);
  color: #8B5CF6;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.faq-title {
  color: var(--text-primary);
}

.faq-desc {
  color: var(--text-secondary);
}

.faq-link {
  color: #165DFF;
  text-decoration: none;
  transition: color 0.2s ease;
}

.faq-link:hover {
  color: #0040ED;
}

.faq-item {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-item:hover {
  border-color: var(--border-color-hover);
}

.faq-item.is-open {
  border-color: rgba(22, 93, 255, 0.3);
  box-shadow: 0 4px 20px rgba(22, 93, 255, 0.1);
}

.faq-question {
  width: 100%;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
}

.faq-question-text {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  transition: color 0.2s ease;
}

.faq-item.is-open .faq-question-text {
  color: #165DFF;
}

.faq-icon {
  flex-shrink: 0;
  color: var(--text-tertiary);
  transition: transform 0.3s ease, color 0.2s ease;
}

.faq-item.is-open .faq-icon {
  transform: rotate(180deg);
  color: #165DFF;
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
}

.faq-item.is-open .faq-answer {
  max-height: 300px;
}

.faq-answer p {
  padding: 0 24px 20px;
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

/* Mobile */
@media (max-width: 640px) {
  .faq-question {
    padding: 16px 20px;
  }

  .faq-question-text {
    font-size: 0.9375rem;
  }

  .faq-answer p {
    padding: 0 20px 16px;
    font-size: 0.875rem;
  }
}
</style>
