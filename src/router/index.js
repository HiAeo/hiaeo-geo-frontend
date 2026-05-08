import { createRouter, createWebHistory } from 'vue-router'

// 首页占位组件（官网由 App.vue 根组件渲染，此组件不实际渲染内容）
const HomeRoute = { template: '<div></div>' }

const routes = [
  // 首页 /
  {
    path: '/',
    component: HomeRoute,
    meta: { layout: 'none' }
  },

  // 用户工作台 /app/*
  {
    path: '/app',
    component: () => import('../components/layouts/BrandLayout.vue'),
    meta: { requiresAuth: true, portal: 'brand' },
    children: [
      {
        path: 'pricing',
        name: 'brand-pricing',
        component: () => import('../components/PricingPage.vue'),
        meta: { title: '选择套餐' }
      },
      {
        path: '',
        redirect: '/app/hub'
      },
      {
        path: 'hub',
        name: 'brand-hub',
        component: () => import('../components/pages/HubPage.vue'),
        meta: { title: '魔鲸Hub驾驶舱' }
      },
      {
        path: 'mofa',
        name: 'brand-mofa',
        component: () => import('../components/pages/MofaPage.vue'),
        meta: { title: '模法内容生成' }
      },
      {
        path: 'dashboard',
        name: 'brand-dashboard',
        component: () => import('../components/pages/BrandDashboardPage.vue'),
        meta: { title: '品牌仪表盘' }
      },
      {
        path: 'diagnose',
        name: 'brand-diagnose',
        component: () => import('../components/pages/BrandDiagnosePage.vue'),
        meta: { title: '诊断报告' }
      },
      {
        path: 'strategy',
        name: 'brand-strategy',
        component: () => import('../components/StrategyPage.vue'),
        meta: { title: '策略生成' }
      },
      {
        path: 'diagnose/:id',
        name: 'brand-diagnose-detail',
        component: () => import('../components/pages/BrandDiagnoseDetailPage.vue'),
        meta: { title: '报告详情' }
      },
      {
        path: 'credits',
        name: 'brand-credits',
        component: () => import('../components/CreditsPage.vue'),
        meta: { title: '我的积分' }
      },
      {
        path: 'orders',
        name: 'brand-orders',
        component: () => import('../components/OrdersPage.vue'),
        meta: { title: '订单管理' }
      },
      {
        path: 'settings',
        name: 'brand-settings',
        component: () => import('../components/pages/BrandSettingsPage.vue'),
        meta: { title: '账户设置' }
      }
    ]
  },

  // 管理后台 /manage/*
  {
    path: '/manage',
    component: () => import('../components/AdminLayout.vue'),
    meta: { requiresAuth: true, portal: 'admin' },
    children: [
      {
        path: '',
        redirect: '/manage/overview'
      },
      {
        path: 'overview',
        name: 'admin-overview',
        component: () => import('../components/pages/AdminOverviewPage.vue'),
        meta: { title: '运营概览' }
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('../components/pages/AdminUsersPage.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'credits',
        name: 'admin-credits',
        component: () => import('../components/pages/AdminCreditsPage.vue'),
        meta: { title: '积分管理' }
      },
      {
        path: 'diagnose',
        name: 'admin-diagnose',
        component: () => import('../components/pages/AdminDiagnosePage.vue'),
        meta: { title: '诊断管理' }
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: () => import('../components/pages/AdminSettingsPage.vue'),
        meta: { title: '系统设置' }
      }
    ]
  },

  // 404 - 回到首页
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 导航守卫
router.beforeEach((to, from, next) => {
  const userStr = localStorage.getItem('user_info')
  const user = userStr ? JSON.parse(userStr) : null
  const userRole = localStorage.getItem('user_role') || 'brand'

  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)
  const portalMeta = to.matched.find(r => r.meta.portal)

  if (requiresAuth && !user) {
    // 未登录，重定向到首页
    next({ path: '/', query: { redirect: to.fullPath } })
    return
  }

  // 非管理员访问管理后台 -> 跳转用户工作台
  if (portalMeta?.meta?.portal === 'admin' && userRole !== 'admin') {
    next({ path: '/app/dashboard' })
    return
  }

  // 更新页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - HiAeo`
  }

  next()
})

export default router
