<template>
  <div class="admin-layout" :data-theme="theme">
    <!-- Expand button when sidebar is collapsed -->
    <div v-if="sidebarCollapsed" class="expand-btn" @click="sidebarCollapsed = false" title="展开侧边栏">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </div>

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span v-if="!sidebarCollapsed" class="logo-text">魔鲸 Geo 管理后台</span>
        </div>
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path v-if="sidebarCollapsed" d="M9 18l6-6-6-6"/>
            <path v-else d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        <router-link 
          v-for="item in adminNavItems" 
          :key="item.id"
          :to="item.path"
          class="nav-item"
          :class="{ active: $route.path === item.path || $route.path.startsWith(item.path + '/') }"
          :title="item.label"
        >
          <component :is="item.icon" />
          <span v-if="!sidebarCollapsed" class="nav-label">{{ item.label }}</span>
          <span v-if="item.badge && !sidebarCollapsed" class="nav-badge">{{ item.badge }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button class="nav-item" @click="toggleTheme">
          <svg v-if="theme === 'dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          <span v-if="!sidebarCollapsed" class="nav-label">{{ theme === 'dark' ? '浅色模式' : '深色模式' }}</span>
        </button>
        <button class="nav-item" @click="handleLogout">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span v-if="!sidebarCollapsed" class="nav-label">退出登录</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  theme: {
    type: String,
    default: 'dark'
  }
})

const emit = defineEmits(['toggle-theme', 'back'])
const router = useRouter()

const handleLogout = () => {
  localStorage.removeItem('user_info')
  localStorage.removeItem('user_role')
  router.push('/')
}

const sidebarCollapsed = ref(false)
const activeTab = ref('dashboard')

// Icon components
const DashboardIcon = {
  render() {
    return h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
      h('rect', { x: 3, y: 3, width: 7, height: 9, rx: 1 }),
      h('rect', { x: 14, y: 3, width: 7, height: 5, rx: 1 }),
      h('rect', { x: 14, y: 12, width: 7, height: 9, rx: 1 }),
      h('rect', { x: 3, y: 16, width: 7, height: 5, rx: 1 })
    ])
  }
}

const UsersIcon = {
  render() {
    return h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
      h('path', { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' }),
      h('circle', { cx: 9, cy: 7, r: 4 }),
      h('path', { d: 'M23 21v-2a4 4 0 0 0-3-3.87' }),
      h('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' })
    ])
  }
}

const CreditsIcon = {
  render() {
    return h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
      h('circle', { cx: 12, cy: 12, r: 10 }),
      h('line', { x1: 12, y1: 8, x2: 12, y2: 16 }),
      h('line', { x1: 8, y1: 12, x2: 16, y2: 12 })
    ])
  }
}

const DiagnoseIcon = {
  render() {
    return h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
      h('path', { d: 'M9 11l3 3L22 4' }),
      h('path', { d: 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' })
    ])
  }
}

const SettingsIcon = {
  render() {
    return h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
      h('circle', { cx: 12, cy: 12, r: 3 }),
      h('path', { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' })
    ])
  }
}

const adminNavItems = [
  { id: 'overview', label: '运营概览', path: '/manage/overview', icon: DashboardIcon },
  { id: 'diagnose', label: '诊断管理', path: '/manage/diagnose', icon: DiagnoseIcon },
  { id: 'users', label: '用户管理', path: '/manage/users', icon: UsersIcon },
  { id: 'credits', label: '积分管理', path: '/manage/credits', icon: CreditsIcon },
  { id: 'settings', label: '系统设置', path: '/manage/settings', icon: SettingsIcon }
]

const toggleTheme = () => {
  emit('toggle-theme')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-primary);
}

/* Expand button */
.expand-btn {
  position: fixed;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  cursor: pointer;
  z-index: 200;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.expand-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #ffffff;
  transform: translateY(-50%) scale(1.05);
}

[data-theme="light"] .expand-btn {
  background: #ffffff;
  border-color: #d1d5db;
  color: #4f46e5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

[data-theme="light"] .expand-btn:hover {
  background: #4f46e5;
  border-color: #4f46e5;
  color: #ffffff;
}

/* Sidebar */
.sidebar {
  width: 240px;
  background: var(--bg-elevated);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-primary);
}

.logo-text {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
}

.collapse-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.collapse-btn:hover {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.sidebar.collapsed .collapse-btn {
  display: none;
}

.sidebar-nav {
  flex: 1;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}

.sidebar-footer {
  padding: 12px 8px;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-size: 0.875rem;
  width: 100%;
}

.nav-item:hover {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.nav-item.active,
.sidebar-nav .nav-item.router-link-active {
  background: var(--color-primary);
  color: #ffffff;
}

.sidebar-nav .nav-item.router-link-exact-active {
  background: var(--color-primary);
  color: #ffffff;
}

.nav-label {
  white-space: nowrap;
}

.nav-badge {
  margin-left: auto;
  padding: 2px 8px;
  font-size: 0.6875rem;
  font-weight: 600;
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border-radius: 10px;
}

.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 10px;
}

.sidebar.collapsed .nav-label,
.sidebar.collapsed .nav-badge {
  display: none;
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 240px;
  transition: margin-left 0.3s ease;
  min-height: 100vh;
}

.sidebar.collapsed ~ .main-content {
  margin-left: 64px;
}

.tab-content {
  padding: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 64px;
  }
  
  .sidebar .logo-text,
  .sidebar .nav-label,
  .sidebar .nav-badge,
  .sidebar .collapse-btn {
    display: none;
  }
  
  .sidebar .nav-item {
    justify-content: center;
    padding: 10px;
  }
  
  .main-content {
    margin-left: 64px;
  }
}
</style>
