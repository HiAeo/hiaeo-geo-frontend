<template>
  <footer style="background:#111827;">
    <div class="max-w-7xl mx-auto px-6">

      <!-- Top: Logo + Slogan -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-12 border-b border-white/10">
        <div class="flex items-center gap-3">
          <img src="/logo.png" alt="HiAeo" class="h-9 w-auto" />
        </div>

        <!-- CTA row -->
        <div class="flex items-center gap-3">
          <button class="px-5 py-2.5 rounded-xl text-sm font-medium bg-white text-gray-900 hover:bg-gray-100 transition-colors">
            免费诊断一次
          </button>
        </div>
      </div>

      <!-- Link columns -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div v-for="col in footerCols" :key="col.title">
          <div class="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">{{ col.title }}</div>
          <div class="space-y-3">
            <a v-for="link in col.links" :key="link"
              href="#"
              class="block text-sm text-white/60 hover:text-white transition-colors">
              {{ link }}
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
        <div class="text-xs text-white/40">
          © 2026 HiAeo. 让AI生成式引擎优化像呼吸一样简单。
        </div>
        <div class="flex items-center gap-5 text-xs text-white/40">
          <a href="#" class="hover:text-white/60 transition-colors">隐私政策</a>
          <span>·</span>
          <a href="#" class="hover:text-white/60 transition-colors">服务条款</a>
          <span>·</span>
          <a href="#" class="hover:text-white/60 transition-colors">ICP备案</a>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup>
const footerCols = [
  {
    title: '产品',
    links: ['模镜 MiraSeek', '模豆 MiraMod', '模法 MiraMag', '魔鲸Hub'],
  },
  {
    title: '资源',
    links: ['帮助中心', 'API文档', '产品更新日志', '案例库'],
  },
  {
    title: '公司',
    links: ['关于我们', '加入团队', '媒体报道', '联系我们'],
  },
  {
    title: '合规',
    links: ['隐私政策', '服务条款', '数据安全', '合规认证'],
  },
]
</script>
