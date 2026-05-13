<template>
  <div class="about-page" :data-theme="theme">
    <!-- 固定导航栏 -->
    <NavBar :theme="theme" @toggle-theme="toggleTheme" @open-login="showLogin = true" @open-contact="showContact = true" />

    <!-- 页面内容 -->
    <div class="about-content">

      <!-- Hero 区域 -->
      <section class="about-hero relative overflow-hidden">
        <div class="hero-bg-gradient"></div>
        <div class="hero-glow hero-glow-1"></div>
        <div class="hero-glow hero-glow-2"></div>
        
        <div class="max-w-7xl mx-auto px-6 py-24 md:py-32 text-center relative z-10">
          <span class="about-badge scroll-animate">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            品牌介绍
          </span>
          
          <h1 class="about-hero-title scroll-animate delay-100">关于 ModelBuddy</h1>
          <p class="about-hero-subtitle scroll-animate delay-200">让AI生成式引擎优化像呼吸一样简单</p>
          
          <!-- Logo展示区 -->
          <div class="hero-logos scroll-animate delay-300">
            <div class="logo-section">
              <div class="logo-section-label">覆盖优质AI大模型</div>
              <div class="logo-grid">
                <img v-for="logo in aiModelLogos" :key="logo" :src="logo" :alt="logo.split('/').pop()" class="logo-img" />
              </div>
            </div>
            <div class="logo-divider"></div>
            <div class="logo-section">
              <div class="logo-section-label">覆盖优质AI信源媒体</div>
              <div class="logo-grid">
                <img v-for="logo in aiMediaLogos" :key="logo" :src="logo" :alt="logo.split('/').pop()" class="logo-img" />
              </div>
            </div>
          </div>
          

        </div>
      </section>

      <!-- 板块一：About ModelBuddy -->
      <section class="about-section relative overflow-hidden" id="about-intro">
        <div class="section-bg-effect"></div>
        <div class="max-w-7xl mx-auto px-6 relative z-10">
          <div class="section-grid">
            <div class="section-text">
              <span class="section-label scroll-animate">01 / 品牌简介</span>
              <h2 class="section-title scroll-animate delay-100">关于 ModelBuddy</h2>
              <div class="section-body scroll-animate delay-200">
                <p>ModelBuddy（魔鲸）是国内领先的AI生成式引擎优化（GEO）解决方案提供商，致力于帮助企业应对以DeepSeek、豆包、文心一言、Kimi等为代表的大语言模型（LLM）驱动的全新搜索与推荐时代。</p>
                <p>我们打造了国内首个"诊断-策略-执行-监控"全闭环的GEO SaaS平台——魔鲸GEO，其核心愿景是<strong>"让AI生成式引擎优化像呼吸一样简单"</strong>。</p>
                <p>通过创新的AI Agent协调层与品牌私有知识库（品牌智库），魔鲸GEO能够自动化地为企业构建在AI模型中的"数字孪生"，确保品牌信息被大模型精准识别、优先推荐并正面传播。</p>
              </div>
              <div class="highlight-box scroll-animate delay-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <span>我们的使命是让每一次AI问答都成为企业的增长机遇，终结"SEO玄学"，以数据驱动和自动闭环，为企业提供一个持续自我迭代的AI增长引擎。</span>
              </div>
            </div>
            <div class="section-visual scroll-animate delay-200">
              <div class="brand-card">
                <div class="brand-icon-wrapper">
                  <div class="brand-icon-ring"></div>
                  <div class="brand-icon-inner">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                      <path d="M8 12l2 2 4-4"/>
                    </svg>
                  </div>
                </div>
                <div class="brand-name">魔鲸GEO</div>
                <div class="brand-tagline">AI生成式引擎优化平台</div>
                <div class="brand-features">
                  <span class="feature-tag" v-for="f in ['诊断', '策略', '执行', '监控']" :key="f">{{ f }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 板块二：核心业务 -->
      <section class="about-section alt-bg relative overflow-hidden" id="about-business">
        <div class="section-bg-dots"></div>
        <div class="max-w-7xl mx-auto px-6 relative z-10">
          <div class="text-center">
            <span class="section-label scroll-animate">02 / 核心业务</span>
            <h2 class="section-title scroll-animate delay-100 text-center">五大核心环节</h2>
            <p class="section-intro scroll-animate delay-200">围绕"知识资产化、诊断智能化、策略自动化、执行半自动、监控闭环化"五大核心环节展开</p>
          </div>
          
          <div class="business-grid">
            <div class="business-card scroll-animate" v-for="(item, idx) in businessItems" :key="idx" 
                 :style="{ '--accent': item.color }">
              <div class="business-card-header">
                <div class="business-icon" :style="{ background: `${item.color}15`, borderColor: `${item.color}30` }">
                  <span v-html="item.icon"></span>
                </div>
                <span class="step-badge" :style="{ background: `${item.color}15`, color: item.color, borderColor: `${item.color}30` }">
                  STEP 0{{ idx + 1 }}
                </span>
              </div>
              <h3 class="business-title">{{ item.title }}</h3>
              <p class="business-desc">{{ item.desc }}</p>
              <div class="business-tags">
                <span v-for="tag in item.tags" :key="tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 板块三：品牌定位 -->
      <section class="about-section relative overflow-hidden" id="about-positioning">
        <div class="section-bg-effect-2"></div>
        <div class="max-w-7xl mx-auto px-6 relative z-10">
          <div class="section-grid reverse">
            <div class="section-visual scroll-animate">
              <div class="positioning-cards">
                <div class="pos-card" style="--accent: #165DFF">
                  <div class="pos-header">
                    <span class="pos-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                    </span>
                    <span class="pos-label">一句话定位</span>
                  </div>
                  <div class="pos-content">国内首个<strong>全闭环、可量化、零门槛</strong>的AI生成式引擎优化（GEO）SaaS平台</div>
                </div>
                <div class="pos-card" style="--accent: #10B981">
                  <div class="pos-header">
                    <span class="pos-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    </span>
                    <span class="pos-label">价值定位</span>
                  </div>
                  <div class="pos-content">成为企业在AI时代必备的<strong>品牌数字孪生与增长引擎</strong></div>
                </div>
                <div class="pos-card" style="--accent: #8B5CF6">
                  <div class="pos-header">
                    <span class="pos-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                    </span>
                    <span class="pos-label">市场定位</span>
                  </div>
                  <div class="pos-content">面向所有希望在AI搜索结果中获得竞争优势的企业，提供从AI可见度诊断到持续优化的"交钥匙"解决方案</div>
                </div>
              </div>
            </div>
            <div class="section-text">
              <span class="section-label scroll-animate">03 / 品牌定位</span>
              <h2 class="section-title scroll-animate delay-100">品牌定位</h2>
              <div class="section-body scroll-animate delay-200">
                <p>魔鲸GEO定位为企业在AI时代的战略伙伴，通过系统性的GEO优化，帮助品牌在生成式AI的浪潮中建立可持续的竞争优势。</p>
                <p>我们相信，未来的品牌竞争不再仅仅是传统的搜索排名，而是在AI问答中的"被提及率"和"被推荐度"。魔鲸GEO正是为此而生。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 板块四：竞争优势 -->
      <section class="about-section alt-bg relative overflow-hidden" id="about-advantages">
        <div class="section-bg-gradient"></div>
        <div class="max-w-7xl mx-auto px-6 relative z-10">
          <div class="text-center">
            <span class="section-label scroll-animate">04 / 竞争优势</span>
            <h2 class="section-title scroll-animate delay-100 text-center">五大核心优势</h2>
          </div>
          
          <div class="advantages-grid">
            <div class="advantage-card scroll-animate" v-for="(adv, idx) in advantages" :key="idx"
                 :style="{ '--accent': adv.color }">
              <div class="advantage-num">{{ String(idx + 1).padStart(2, '0') }}</div>
              <div class="advantage-content">
                <h3 class="advantage-title">{{ adv.title }}</h3>
                <p class="advantage-desc">{{ adv.desc }}</p>
              </div>
              <div class="advantage-glow"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- 板块五：品牌故事 -->
      <section class="about-section relative overflow-hidden" id="about-story">
        <div class="section-bg-effect"></div>
        <div class="max-w-7xl mx-auto px-6 relative z-10">
          <div class="section-grid">
            <div class="section-text">
              <span class="section-label scroll-animate">05 / 品牌故事</span>
              <h2 class="section-title scroll-animate delay-100">品牌故事</h2>
              <div class="section-body scroll-animate delay-200">
                <p>在AI技术狂飙的2026年，企业发现，传统的搜索引擎优化（SEO）逻辑在DeepSeek、豆包等生成式AI面前失效了。用户不再点击蓝色链接，而是直接向AI提问。</p>
                <p><strong>你的品牌是否被AI提及？如何被描述？</strong>这些成为生死攸关的问题。</p>
                <p>魔鲸的创始团队正是观察到这一巨大鸿沟——<strong>企业拥有海量信息，却无法被AI有效理解、调用和推荐</strong>。</p>
                <p>我们思考：能不能创造一个"AI管家"，它像鲸鱼一样智能、强大，能潜入数字海洋，系统地帮助企业梳理信息、诊断AI眼中的自己、制定优化策略，并自动执行？</p>
              </div>
              <div class="highlight-box highlight-box-accent scroll-animate delay-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                </svg>
                <span>于是，魔鲸GEO应运而生。我们的故事，就是帮助企业从"被动等待AI发现"到<strong>"主动构建AI中的官方叙事"</strong>的赋能故事。</span>
              </div>
            </div>
            <div class="section-visual scroll-animate delay-200">
              <div class="milestone-grid">
                <div class="milestone-card" v-for="(item, idx) in storyTimeline" :key="idx"
                     :class="{ 'highlight': item.highlight, 'future': item.future }">
                  <div class="milestone-month">{{ item.year }}</div>
                  <div class="milestone-title">{{ item.title }}</div>
                  <div class="milestone-num">{{ String(idx + 1).padStart(2, '0') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 板块六：产品/服务 -->
      <section class="about-section alt-bg relative overflow-hidden" id="about-products">
        <div class="section-bg-dots-2"></div>
        <div class="max-w-7xl mx-auto px-6 relative z-10">
          <div class="text-center">
            <span class="section-label scroll-animate">06 / 产品服务</span>
            <h2 class="section-title scroll-animate delay-100 text-center">六大产品模块</h2>
          </div>
          
          <div class="products-grid">
            <div class="product-card scroll-animate" v-for="(prod, idx) in products" :key="idx"
                 :style="{ '--accent': prod.color }">
              <div class="product-icon-wrapper">
                <span v-html="prod.icon"></span>
              </div>
              <h3 class="product-name">{{ prod.name }}</h3>
              <p class="product-desc">{{ prod.desc }}</p>
              <div class="product-hover-effect"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- 板块七：核心能力 -->
      <section class="about-section relative overflow-hidden" id="about-capabilities">
        <div class="section-bg-effect-3"></div>
        <div class="max-w-7xl mx-auto px-6 relative z-10">
          <div class="text-center">
            <span class="section-label scroll-animate">07 / 核心能力</span>
            <h2 class="section-title scroll-animate delay-100 text-center">五大核心能力</h2>
          </div>
          
          <div class="capabilities-showcase">
            <div class="capability-highlight scroll-animate">
              <div class="cap-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>
              <div class="cap-text">
                <div class="cap-title-lg">智能闭环驱动</div>
                <div class="cap-desc-lg">从诊断到优化，全流程自动化运转</div>
              </div>
            </div>
            
            <div class="capabilities-mini-grid">
              <div class="cap-mini-card scroll-animate" v-for="(cap, idx) in capabilities" :key="idx"
                   :style="{ '--accent': cap.color }">
                <div class="cap-mini-icon" v-html="cap.icon"></div>
                <div class="cap-mini-title">{{ cap.title }}</div>
                <div class="cap-mini-desc">{{ cap.desc }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 板块八：服务流程 -->
      <section class="about-section alt-bg relative overflow-hidden" id="about-process">
        <div class="section-bg-gradient-2"></div>
        <div class="max-w-7xl mx-auto px-6 relative z-10">
          <div class="text-center">
            <span class="section-label scroll-animate">08 / 服务流程</span>
            <h2 class="section-title scroll-animate delay-100 text-center">服务流程与周期</h2>
            <p class="section-intro scroll-animate delay-200">从注册到自动监控，核心操作时间不超过30分钟</p>
          </div>
          
          <div class="process-timeline">
            <div class="process-step-card scroll-animate" v-for="(step, idx) in processSteps" :key="idx"
                 :style="{ '--accent': step.color }">
              <div class="step-num-circle">
                <span>{{ idx + 1 }}</span>
              </div>
              <div class="step-connector" v-if="idx < processSteps.length - 1">
                <svg width="40" height="12" viewBox="0 0 40 12">
                  <path d="M0 6h35M30 1l5 5-5 5" stroke="currentColor" fill="none" stroke-width="1.5"/>
                </svg>
              </div>
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-desc">{{ step.desc }}</p>
              <span class="step-time-badge">{{ step.time }}</span>
            </div>
          </div>
        </div>
      </section>

    </div>

    <!-- Footer -->
    <FooterSection :theme="theme" />

    <!-- Login Modal -->
    <LoginModal :show="showLogin" @close="showLogin = false" />

    <!-- Contact Modal -->
    <ContactModal :show="showContact" @close="showContact = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavBar from '../NavBar.vue'
import FooterSection from '../FooterSection.vue'
import LoginModal from '../LoginModal.vue'
import ContactModal from '../ContactModal.vue'
import { initTheme, toggleTheme as globalToggleTheme, theme as globalTheme } from '../../composables/useTheme'

const theme = globalTheme
const showLogin = ref(false)
const showContact = ref(false)

const toggleTheme = () => {
  globalToggleTheme()
}

// Logo数据
const aiModelLogos = [
  '/src/assets/logos/ai-models/claude-color.svg',
  '/src/assets/logos/ai-models/deepseek-color.svg',
  '/src/assets/logos/ai-models/doubao-color.svg',
  '/src/assets/logos/ai-models/gemini-color.svg',
  '/src/assets/logos/ai-models/grok.svg',
  '/src/assets/logos/ai-models/meta-color.svg',
  '/src/assets/logos/ai-models/openai.svg',
  '/src/assets/logos/ai-models/qwen-color.svg',
  '/src/assets/logos/ai-models/spark-color.svg',
  '/src/assets/logos/ai-models/wenxin-color.svg',
  '/src/assets/logos/ai-models/yuanbao-color.svg',
  '/src/assets/logos/ai-models/zhipu-color.svg',
]

const aiMediaLogos = [
  '/src/assets/logos/ai-media/今日头条.svg',
  '/src/assets/logos/ai-media/哔哩哔哩.svg',
  '/src/assets/logos/ai-media/小红书.svg',
  '/src/assets/logos/ai-media/微信.svg',
  '/src/assets/logos/ai-media/微博.svg',
  '/src/assets/logos/ai-media/快手.svg',
  '/src/assets/logos/ai-media/抖音.svg',
  '/src/assets/logos/ai-media/百度.svg',
  '/src/assets/logos/ai-media/虎扑.svg',
  '/src/assets/logos/ai-media/豆瓣.svg',
]

const businessItems = [
  { 
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', 
    title: '品牌智库', 
    desc: '提供结构化表单与AI智能预填，帮助企业零门槛构建私有品牌知识库（7大模块），并支持文件上传与向量化，成为AI Agent的"长期记忆"和决策大脑。',
    tags: ['7大模块', 'AI预填', '向量存储'],
    color: '#165DFF'
  },
  { 
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>', 
    title: '模镜诊断', 
    desc: '基于7维健康分体系（品牌实体、产品关联度、竞品压制等），自动抓取多AI引擎数据进行深度分析，生成可视化诊断报告与优先级问题清单。',
    tags: ['7维分析', '多引擎', '可视化报告'],
    color: '#10B981'
  },
  { 
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>', 
    title: '模豆策略', 
    desc: 'AI Agent根据诊断报告和知识库，自动生成多类型优化策略（品牌问答、产品描述、竞品对比等），并提供符合不同AI引擎偏好的内容模板。',
    tags: ['多类型策略', '引擎适配', '内容模板'],
    color: '#F59E0B'
  },
  { 
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>', 
    title: '模法执行', 
    desc: '将策略智能转化为可执行内容（文章、结构化数据等），支持手动复制、API推送等多种安全落地方式，所有高危操作均需人工确认。',
    tags: ['内容生成', '安全执行', '二次确认'],
    color: '#8B5CF6'
  },
  { 
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>', 
    title: '魔鲸Hub', 
    desc: '统一数据驾驶舱，提供角色化视图。具备定时诊断、指标异常预警、自动生成待办策略等功能，驱动整个优化流程的自动闭环。',
    tags: ['驾驶舱', '预警', '自动待办'],
    color: '#EC4899'
  },
]

const advantages = [
  { 
    title: '全闭环自动化体验', 
    desc: '区别于市场碎片化工具，魔鲸GEO是唯一实现"输入网址 → AI诊断 → 策略生成 → 半自动执行 → 效果监控"全流程闭环的产品，用户仅需初次输入网址，后续如同自动驾驶。',
    color: '#165DFF'
  },
  { 
    title: '核心AI Agent驱动', 
    desc: '产品大脑是一个智能协调层（Agent），不仅能执行指令，还能根据知识库变化、诊断结果、监控指标主动触发下一步优化动作，实现真正的智能循环。',
    color: '#10B981'
  },
  { 
    title: '品牌私有知识库（智库）', 
    desc: '独有的结构化+非结构化数据资产层，作为AI的"长期记忆"，确保所有诊断和策略都基于品牌最精准、最新、最私有的信息，杜绝通用AI建议。',
    color: '#F59E0B'
  },
  { 
    title: '7维可量化健康分体系', 
    desc: '首次将GEO效果量化为具体维度指标（实体识别、竞品压制、引流率等），让优化过程告别"玄学"，效果可追溯、可验证、可预测。',
    color: '#8B5CF6'
  },
  { 
    title: '多AI引擎适配与安全执行', 
    desc: '内置各主流大模型的内容偏好模板，确保生成内容"投其所好"。同时采用人工二次确认的半自动执行模式，确保企业级安全合规。',
    color: '#EC4899'
  },
]

const products = [
  { icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>', name: '魔鲸GEO SaaS平台', desc: '包含诊断、策略、执行、监控、Hub五大核心模块的完整平台', color: '#165DFF' },
  { icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', name: '品牌智库', desc: '企业私有知识资产管理后台，支持结构化数据与文件向量化', color: '#10B981' },
  { icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>', name: '模镜 MiraSeek', desc: 'AI可见度诊断服务，7维健康分体系深度分析', color: '#F59E0B' },
  { icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>', name: '模豆 MiraMod', desc: '智能策略生成服务，基于诊断报告自动生成优化策略', color: '#8B5CF6' },
  { icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', name: '模法 MiraMag', desc: '内容生成与执行服务，一键生成适配不同AI的内容', color: '#EC4899' },
  { icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>', name: '魔鲸Hub', desc: '统一数据驾驶舱与任务调度中心，提供角色化视图', color: '#06B6D4' },
]

const capabilities = [
  { icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>', title: '找得准', desc: '从7个维度精准诊断品牌在各大AI引擎中的真实占位', color: '#165DFF' },
  { icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>', title: '出得对', desc: '基于品牌自身数据和诊断结果，AI自动生成针对性策略', color: '#10B981' },
  { icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', title: '做得快', desc: '一键生成适配不同AI的内容，支持多种发布方式', color: '#F59E0B' },
  { icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>', title: '看得全', desc: '所有数据、任务、效果在一个看板统一呈现', color: '#8B5CF6' },
  { icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>', title: '自动转', desc: '信息变更或指标波动，系统自动触发新一轮优化', color: '#EC4899' },
]

const storyTimeline = [
  { year: '2026年1月', title: 'ModelBuddy魔鲸AI品牌创立', highlight: true },
  { year: '2026年2月', title: '魔鲸GEO，AI生成式引擎优化产品架构搭建完成' },
  { year: '2026年3月', title: 'MiraSeek模镜、MiraMod模豆、MiraMag模法功能开发完毕' },
  { year: '2026年4月', title: '魔鲸Hub，AI协同驾驶舱上线' },
  { year: '2026年5月', title: 'MiraBox魔鲸品牌智库上线' },
  { year: '2026年', title: '未来已来，敬请期待', future: true },
]

const processSteps = [
  { title: '注册与配置', desc: '用户注册，在"品牌智库"输入企业官网URL，一键使用"AI智能预填"功能，快速完成知识库初始化。', time: '1天，一次性', color: '#165DFF' },
  { title: '一键诊断', desc: '点击"开始AI诊断"，系统完成7维分析并生成报告。', time: '5-15分钟，可重复', color: '#10B981' },
  { title: '一键策略', desc: '基于诊断报告生成优化策略列表。', time: '1-5分钟，可重复', color: '#F59E0B' },
  { title: '审批执行', desc: '用户审核策略，点击"一键执行"，生成内容草稿，经二次确认后发布或导出。', time: '时长不定', color: '#8B5CF6' },
  { title: '持续监控与闭环', desc: '系统通过定时任务自动进行轻量诊断，发现指标异常时自动生成优化策略待办。', time: '长期自动', color: '#EC4899' },
]

onMounted(() => {
  initTheme()
  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observer.observe(el)
    })
  }
})
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background: var(--bg-primary, #0a0a0f);
  color: var(--text-primary, #fff);
  padding-top: 64px;
}

.about-content {
  padding-bottom: 80px;
}

/* Hero */
.about-hero {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
}

.hero-bg-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(22, 93, 255, 0.06) 0%, rgba(139, 92, 246, 0.04) 50%, rgba(16, 185, 129, 0.02) 100%);
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}

.hero-glow-1 {
  width: 400px;
  height: 400px;
  background: rgba(22, 93, 255, 0.3);
  top: -100px;
  right: 10%;
}

.hero-glow-2 {
  width: 300px;
  height: 300px;
  background: rgba(139, 92, 246, 0.2);
  bottom: -50px;
  left: 5%;
}

.about-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(22, 93, 255, 0.15);
  border: 1px solid rgba(22, 93, 255, 0.2);
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 500;
  color: #165DFF;
  margin-bottom: 24px;
}

/* Hero Logos */
.hero-logos {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 48px;
  margin-bottom: 32px;
  padding: 24px 32px;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  backdrop-filter: blur(16px);
}

.logo-section {
  flex: 1;
  max-width: 400px;
}

.logo-section-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 16px;
  text-align: center;
}

.logo-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.logo-img {
  width: 56px;
  height: 56px;
  padding: 10px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  transition: all 0.3s ease;
  opacity: 1;
}

.logo-img:hover {
  transform: scale(1.1);
  border-color: rgba(22, 93, 255, 0.4);
  box-shadow: 0 4px 16px rgba(22, 93, 255, 0.2);
}

.logo-divider {
  width: 1px;
  background: linear-gradient(180deg, transparent 0%, var(--border-color) 50%, transparent 100%);
}

.about-hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
}

.about-hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 40px;
}

.hero-stats {
  display: inline-flex;
  align-items: center;
  gap: 32px;
  padding: 20px 40px;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  backdrop-filter: blur(16px);
}

.stat-item {
  text-align: center;
}

.stat-num {
  font-size: 1.5rem;
  font-weight: 700;
  color: #165DFF;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--border-color);
}

/* Section */
.about-section {
  padding: 100px 0;
  position: relative;
}

.about-section.alt-bg {
  background: var(--bg-secondary);
}

.section-bg-effect {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at top right, rgba(22, 93, 255, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.section-bg-effect-2 {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at top left, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.section-bg-effect-3 {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.section-bg-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(22, 93, 255, 0.03) 100%);
  pointer-events: none;
}

.section-bg-gradient-2 {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(236, 72, 153, 0.03) 0%, transparent 100%);
  pointer-events: none;
}

.section-bg-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(22, 93, 255, 0.1) 1px, transparent 1px);
  background-size: 32px 32px;
  opacity: 0.5;
  pointer-events: none;
}

.section-bg-dots-2 {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px);
  background-size: 32px 32px;
  opacity: 0.5;
  pointer-events: none;
}

.section-label {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: #165DFF;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 24px;
}

.section-intro {
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto 48px;
  line-height: 1.7;
}

.section-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.section-grid.reverse {
  direction: rtl;
}

.section-grid.reverse > * {
  direction: ltr;
}

.section-body {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

.section-body p {
  margin-bottom: 16px;
}

.section-body strong {
  color: var(--text-primary);
  font-weight: 600;
}

.highlight-box {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 24px;
  background: rgba(22, 93, 255, 0.08);
  border: 1px solid rgba(22, 93, 255, 0.15);
  border-radius: 16px;
  margin-top: 24px;
}

.highlight-box svg {
  color: #165DFF;
  flex-shrink: 0;
  margin-top: 2px;
}

.highlight-box span {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--text-primary);
}

.highlight-box-accent {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(22, 93, 255, 0.05) 100%);
  border-color: rgba(139, 92, 246, 0.2);
}

.highlight-box-accent svg {
  color: #8B5CF6;
}

/* Brand Card */
.brand-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 48px;
  text-align: center;
  backdrop-filter: blur(16px);
  transition: all 0.3s ease;
}

.brand-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(22, 93, 255, 0.15);
  border-color: rgba(22, 93, 255, 0.3);
}

.brand-icon-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 24px;
}

.brand-icon-ring {
  position: absolute;
  inset: 0;
  border: 2px solid rgba(22, 93, 255, 0.3);
  border-radius: 50%;
  animation: pulse-ring 2s ease-in-out infinite;
}

.brand-icon-inner {
  position: absolute;
  inset: 10px;
  background: linear-gradient(135deg, #165DFF 0%, #8B5CF6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

@keyframes pulse-ring {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.5; }
}

.brand-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.brand-tagline {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.brand-features {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.feature-tag {
  padding: 6px 14px;
  background: rgba(22, 93, 255, 0.1);
  border: 1px solid rgba(22, 93, 255, 0.2);
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  color: #165DFF;
}

/* Business Grid */
.business-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 48px;
}

.business-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 28px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.business-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.business-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.2);
  border-color: var(--accent);
}

.business-card:hover::before {
  opacity: 1;
}

.business-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.business-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  transition: all 0.3s ease;
}

.business-card:hover .business-icon {
  transform: scale(1.05);
}

.step-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 9999px;
  border: 1px solid;
  letter-spacing: 0.05em;
}

.business-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.business-desc {
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.business-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.business-tags span {
  font-size: 11px;
  padding: 4px 10px;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: 9999px;
  color: var(--text-tertiary);
}

/* Positioning Cards */
.positioning-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pos-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.pos-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--accent);
}

.pos-card:hover {
  transform: translateX(4px);
  border-color: var(--accent);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.pos-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.pos-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(22, 93, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
}

.pos-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pos-content {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

.pos-content strong {
  color: var(--text-primary);
}

/* Advantages Grid */
.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 48px;
}

.advantage-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 32px;
  display: flex;
  gap: 24px;
  align-items: flex-start;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.advantage-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: 0 12px 32px rgba(0,0,0,0.15);
}

.advantage-glow {
  position: absolute;
  top: -50%;
  right: -20%;
  width: 200px;
  height: 200px;
  background: var(--accent);
  opacity: 0;
  filter: blur(60px);
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.advantage-card:hover .advantage-glow {
  opacity: 0.1;
}

.advantage-num {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--accent);
  opacity: 0.3;
  line-height: 1;
  flex-shrink: 0;
}

.advantage-content {
  flex: 1;
}

.advantage-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.advantage-desc {
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

/* Milestone Grid */
.milestone-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.milestone-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
}

.milestone-card:hover {
  transform: translateY(-4px);
  border-color: rgba(22, 93, 255, 0.3);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.milestone-card.highlight {
  border-color: rgba(22, 93, 255, 0.4);
  background: linear-gradient(135deg, rgba(22, 93, 255, 0.08) 0%, var(--bg-card) 100%);
}

.milestone-card.highlight:hover {
  border-color: #165DFF;
  box-shadow: 0 8px 24px rgba(22, 93, 255, 0.15);
}

.milestone-card.future {
  border-style: dashed;
  border-color: rgba(139, 92, 246, 0.3);
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, var(--bg-card) 100%);
}

.milestone-card.future:hover {
  border-color: #8B5CF6;
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.15);
}

.milestone-month {
  font-size: 12px;
  font-weight: 600;
  color: #165DFF;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.milestone-card.future .milestone-month {
  color: #8B5CF6;
}

.milestone-title {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.5;
}

.milestone-num {
  position: absolute;
  top: 12px;
  right: 16px;
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  opacity: 0.06;
  line-height: 1;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 48px;
}

.product-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 32px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.product-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--accent) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: 0 12px 32px rgba(0,0,0,0.15);
}

.product-card:hover::before {
  opacity: 0.05;
}

.product-hover-effect {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, var(--accent), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-hover-effect {
  opacity: 0.1;
}

.product-icon-wrapper {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.product-card:hover .product-icon-wrapper {
  background: rgba(22, 93, 255, 0.15);
  transform: scale(1.1);
}

.product-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
}

.product-desc {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text-secondary);
  position: relative;
  z-index: 1;
}

/* Capabilities Showcase */
.capabilities-showcase {
  margin-top: 48px;
}

.capability-highlight {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 32px;
  background: linear-gradient(135deg, rgba(22, 93, 255, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%);
  border: 1px solid rgba(22, 93, 255, 0.2);
  border-radius: 20px;
  margin-bottom: 32px;
}

.cap-icon {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #165DFF 0%, #8B5CF6 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.cap-text {
  flex: 1;
}

.cap-title-lg {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.cap-desc-lg {
  font-size: 1rem;
  color: var(--text-secondary);
}

.capabilities-mini-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.cap-mini-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
}

.cap-mini-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.cap-mini-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  background: rgba(22, 93, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
}

.cap-mini-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.cap-mini-desc {
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Process Timeline */
.process-timeline {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  margin-top: 48px;
}

.process-step-card {
  flex: 1;
  min-width: 200px;
  max-width: 260px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 28px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
}

.process-step-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: 0 12px 32px rgba(0,0,0,0.15);
}

.step-num-circle {
  width: 48px;
  height: 48px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 70%, white) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
}

.step-connector {
  position: absolute;
  right: -36px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  opacity: 0.5;
}

.step-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.step-desc {
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.step-time-badge {
  display: inline-block;
  padding: 6px 12px;
  background: rgba(22, 93, 255, 0.1);
  border: 1px solid rgba(22, 93, 255, 0.2);
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 500;
  color: #165DFF;
}

/* Scroll Animation */
.scroll-animate {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.scroll-animate.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.delay-100 { transition-delay: 0.1s; }
.delay-200 { transition-delay: 0.2s; }
.delay-300 { transition-delay: 0.3s; }

/* Responsive */
@media (max-width: 1024px) {
  .section-grid {
    grid-template-columns: 1fr;
    gap: 48px;
  }
  
  .section-grid.reverse {
    direction: ltr;
  }
  
  .process-timeline {
    flex-direction: column;
    align-items: center;
  }
  
  .process-step-card {
    max-width: 100%;
    width: 100%;
  }
  
  .step-connector {
    display: none;
  }
}

@media (max-width: 768px) {
  .about-hero-title {
    font-size: 2.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 16px;
  }
  
  .stat-divider {
    width: 60px;
    height: 1px;
  }
  
  .advantage-card {
    flex-direction: column;
    gap: 16px;
  }
  
  .advantage-num {
    font-size: 2rem;
  }
  
  .capability-highlight {
    flex-direction: column;
    text-align: center;
  }
}
</style>
