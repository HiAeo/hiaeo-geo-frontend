<template>
  <footer class="footer-section">
    <div class="max-w-7xl mx-auto px-6">

      <!-- Top: Logo + Slogan -->
      <div class="footer-top">
        <div class="footer-brand">
          <a href="/" class="flex items-center gap-2 group cursor-pointer mb-4">
            <img :src="theme === 'dark' ? '/logo-header.png' : '/logo-footer.png'" alt="MiraMod" class="footer-logo" />
            <span class="alpha-badge footer-alpha">Alpha</span>
          </a>
          <p class="text-sm footer-slogan mb-6 max-w-xs">
            让AI生成式引擎优化像呼吸一样简单。<br />
            国内首个 GEO 全闭环 SaaS 平台。
          </p>
          <div class="footer-social">
            <a href="#" class="social-link" aria-label="微信">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.87c-.217-.01-.43-.012-.65-.012h.144zm-2.08 2.52c.536 0 .97.44.97.983a.976.976 0 01-.97.983.976.976 0 01-.97-.983c0-.542.434-.983.97-.983zm4.857 0c.536 0 .97.44.97.983a.976.976 0 01-.97.983.976.976 0 01-.97-.983c0-.542.434-.983.97-.983z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="X">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Link columns -->
        <div class="footer-links">
          <div v-for="col in footerCols" :key="col.title" class="footer-col">
            <h4 class="footer-col-title">{{ col.title }}</h4>
            <div class="space-y-2">
              <router-link v-for="link in col.links" :key="link.text"
                :to="link.path || '#'"
                class="footer-link">
                {{ link.text }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom -->
      <div class="footer-bottom">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center">
          <div class="text-xs sm:text-sm footer-copyright">
            © 2026 ModelBuddy. 让AI生成式引擎优化像呼吸一样简单。
          </div>
          <div class="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm footer-legal flex-wrap justify-center">
            <a href="#" class="footer-legal-link">隐私政策</a>
            <span>·</span>
            <a href="#" class="footer-legal-link">服务条款</a>
            <span>·</span>
            <a href="#" class="footer-legal-link">ICP备案</a>
          </div>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup>
const props = defineProps({
  theme: {
    type: String,
    default: 'dark'
  }
})

const footerCols = [
  {
    title: '产品',
    links: [
      { text: '模镜 MiraSeek', path: '/app/diagnose' },
      { text: '模豆 MiraMod', path: '/app/strategy' },
      { text: '模法 MiraMag', path: '/app/publish' },
      { text: '魔鲸Hub', path: '/app/hub' },
    ],
  },
  {
    title: '资源',
    links: [
      { text: '帮助中心', path: null },
      { text: 'API文档', path: null },
      { text: '产品更新日志', path: null },
      { text: '案例库', path: null },
    ],
  },
  {
    title: '公司',
    links: [
      { text: '关于我们', path: '/about' },
      { text: '加入团队', path: null },
      { text: '媒体报道', path: null },
      { text: '联系我们', path: null },
    ],
  },
  {
    title: '合规',
    links: [
      { text: '隐私政策', path: null },
      { text: '服务条款', path: null },
      { text: '数据安全', path: null },
      { text: '合规认证', path: null },
    ],
  },
]
</script>

<style scoped>
.footer-section {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
}

.footer-top {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 60px;
  padding: 60px 0 48px;
}

@media (max-width: 768px) {
  .footer-top {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 40px 0 32px;
  }
}

@media (max-width: 480px) {
  .footer-top {
    padding: 32px 0 24px;
  }
}

.footer-brand {
  display: flex;
  flex-direction: column;
}

.footer-logo {
  height: 42px;
  width: auto;
  transition: transform 0.3s ease;
}

.group:hover .footer-logo {
  transform: scale(1.08);
}

.footer-alpha {
  background: var(--bg-glass);
  color: var(--text-secondary);
}

.footer-slogan {
  color: var(--text-tertiary);
}

.footer-social {
  display: flex;
  gap: 12px;
}

.social-link {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.social-link:hover {
  background: rgba(22, 93, 255, 0.15);
  border-color: rgba(22, 93, 255, 0.3);
  color: #165DFF;
  transform: translateY(-2px);
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

@media (max-width: 768px) {
  .footer-links {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }
}

@media (max-width: 480px) {
  .footer-links {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

.footer-col-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.footer-link {
  display: block;
  font-size: 13px;
  color: var(--text-tertiary);
  transition: all 0.2s ease;
  padding: 4px 0;
}

.footer-link:hover {
  color: var(--text-primary);
  transform: translateX(4px);
}

.footer-bottom {
  padding: 24px 0;
  border-top: 1px solid var(--border-color);
}

.footer-copyright {
  color: var(--text-tertiary);
}

.footer-legal {
  color: var(--text-tertiary);
}

.footer-legal-link {
  color: var(--text-tertiary);
  transition: all 0.2s ease;
}

.footer-legal-link:hover {
  color: var(--text-secondary);
}
</style>
