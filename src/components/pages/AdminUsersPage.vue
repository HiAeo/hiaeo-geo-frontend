<template>
  <div class="admin-users">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">用户管理</h1>
        <div class="header-actions">
          <button class="secondary-btn" @click="showAddModal = true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            添加用户
          </button>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-value">{{ stats.total }}</span>
          <span class="stat-label">总用户</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ stats.free }}</span>
          <span class="stat-label">Free</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ stats.pro }}</span>
          <span class="stat-label">Pro</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ stats.enterprise }}</span>
          <span class="stat-label">Enterprise</span>
        </div>
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="filter-section">
      <div class="search-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input v-model="searchQuery" type="text" placeholder="搜索用户邮箱或昵称..." />
      </div>
      <div class="filter-tabs">
        <button :class="{ active: filter === 'all' }" @click="filter = 'all'">全部</button>
        <button :class="{ active: filter === 'free' }" @click="filter = 'free'">Free</button>
        <button :class="{ active: filter === 'pro' }" @click="filter = 'pro'">Pro</button>
        <button :class="{ active: filter === 'enterprise' }" @click="filter = 'enterprise'">Enterprise</button>
      </div>
    </div>

    <!-- Users Table -->
    <div class="table-section">
      <table class="users-table">
        <thead>
          <tr>
            <th>用户</th>
            <th>订阅</th>
            <th>积分</th>
            <th>诊断次数</th>
            <th>注册时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>
              <div class="user-cell">
                <div class="user-avatar">{{ user.nickname?.charAt(0) || 'U' }}</div>
                <div class="user-info">
                  <span class="user-name">{{ user.nickname || '-' }}</span>
                  <span class="user-email">{{ user.email }}</span>
                </div>
              </div>
            </td>
            <td>
              <span class="tier-badge" :class="'tier-' + user.tier">{{ user.tierLabel }}</span>
            </td>
            <td>{{ formatNumber(user.credits) }}</td>
            <td>{{ user.diagnosisCount }}次</td>
            <td>{{ user.createdAt }}</td>
            <td>
              <span class="status-badge" :class="'status-' + user.status">{{ user.statusLabel }}</span>
            </td>
            <td>
              <div class="action-btns">
                <button class="action-btn" @click="viewUser(user)">查看</button>
                <button class="action-btn" @click="editUser(user)">编辑</button>
                <button class="action-btn danger" @click="deleteUser(user)">删除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const filter = ref('all')
const showAddModal = ref(false)

const stats = ref({ total: 10, free: 3, pro: 4, enterprise: 3 })

const users = ref([
  { id: 1, email: 'emma@example.com', nickname: 'Emma Sun', tier: 'enterprise', tierLabel: 'Enterprise', credits: 25000, diagnosisCount: 15, createdAt: '2026-01-15', status: 'active', statusLabel: '活跃' },
  { id: 2, email: 'henry@example.com', nickname: 'Henry Wu', tier: 'enterprise', tierLabel: 'Enterprise', credits: 18000, diagnosisCount: 12, createdAt: '2026-02-01', status: 'active', statusLabel: '活跃' },
  { id: 3, email: 'alice@example.com', nickname: 'Alice Chen', tier: 'enterprise', tierLabel: 'Enterprise', credits: 15000, diagnosisCount: 10, createdAt: '2026-02-10', status: 'active', statusLabel: '活跃' },
  { id: 4, email: 'jack@example.com', nickname: 'Jack Lin', tier: 'pro', tierLabel: 'Pro', credits: 6200, diagnosisCount: 6, createdAt: '2026-03-05', status: 'active', statusLabel: '活跃' },
  { id: 5, email: 'grace@example.com', nickname: 'Grace Yang', tier: 'pro', tierLabel: 'Pro', credits: 4800, diagnosisCount: 4, createdAt: '2026-03-12', status: 'active', statusLabel: '活跃' },
  { id: 6, email: 'bob@example.com', nickname: 'Bob Wang', tier: 'pro', tierLabel: 'Pro', credits: 3200, diagnosisCount: 3, createdAt: '2026-03-20', status: 'inactive', statusLabel: '不活跃' },
  { id: 7, email: 'ivy@example.com', nickname: 'Ivy Lee', tier: 'free', tierLabel: 'Free', credits: 500, diagnosisCount: 1, createdAt: '2026-04-01', status: 'active', statusLabel: '活跃' },
  { id: 8, email: 'newuser@example.com', nickname: 'New User', tier: 'free', tierLabel: 'Free', credits: 0, diagnosisCount: 0, createdAt: '2026-05-08', status: 'active', statusLabel: '活跃' }
])

const filteredUsers = computed(() => {
  let result = users.value
  if (filter.value !== 'all') result = result.filter(u => u.tier === filter.value)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(u => u.email.toLowerCase().includes(q) || (u.nickname && u.nickname.toLowerCase().includes(q)))
  }
  return result
})

const formatNumber = (n) => n?.toLocaleString() || '0'
const viewUser = (u) => { console.log('view', u) }
const editUser = (u) => { console.log('edit', u) }
const deleteUser = (u) => { if (confirm(`确定删除用户 ${u.email}?`)) console.log('delete', u.id) }
</script>

<style scoped>
.admin-users { min-height: 100vh; padding-bottom: 40px; background: var(--bg-primary); }
.page-header { position: sticky; top: 0; z-index: 50; background: var(--bg-primary); border-bottom: 1px solid var(--border-color); padding: 16px 24px; }
.header-content { display: flex; align-items: center; justify-content: space-between; max-width: 1400px; margin: 0 auto; }
.page-title { font-size: 1.25rem; font-weight: 700; }
.secondary-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: var(--color-primary); color: white; border: none; border-radius: 10px; font-size: 0.875rem; font-weight: 600; cursor: pointer; }

.stats-section { max-width: 1400px; margin: 24px auto 0; padding: 0 24px; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.stat-card { background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; text-align: center; display: flex; flex-direction: column; gap: 4px; }
.stat-value { font-size: 1.5rem; font-weight: 700; }
.stat-label { font-size: 0.8125rem; color: var(--text-secondary); }

.filter-section { max-width: 1400px; margin: 16px auto 0; padding: 0 24px; display: flex; gap: 12px; align-items: center; }
.search-box { flex: 1; display: flex; align-items: center; gap: 10px; background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: 12px; padding: 10px 14px; color: var(--text-secondary); }
.search-box input { flex: 1; background: none; border: none; outline: none; font-size: 0.875rem; color: var(--text-primary); }
.filter-tabs { display: flex; gap: 4px; background: var(--bg-elevated); border: 1px solid var(--border-color); padding: 4px; border-radius: 10px; }
.filter-tabs button { padding: 6px 14px; font-size: 0.8125rem; border: none; background: transparent; color: var(--text-secondary); border-radius: 8px; cursor: pointer; }
.filter-tabs button.active { background: var(--color-primary); color: white; }

.table-section { max-width: 1400px; margin: 16px auto 0; padding: 0 24px 24px; }
.users-table { width: 100%; background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: 16px; border-collapse: separate; border-spacing: 0; overflow: hidden; }
.users-table th { padding: 12px 16px; text-align: left; font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); background: var(--bg-primary); border-bottom: 1px solid var(--border-color); }
.users-table td { padding: 14px 16px; font-size: 0.875rem; border-bottom: 1px solid var(--border-color); color: var(--text-primary); }
.users-table tr:last-child td { border-bottom: none; }
.users-table tr:hover td { background: var(--bg-primary); }

.user-cell { display: flex; align-items: center; gap: 10px; }
.user-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary), #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 0.875rem; font-weight: 600; color: white; flex-shrink: 0; }
.user-info { display: flex; flex-direction: column; gap: 2px; }
.user-name { font-weight: 600; }
.user-email { font-size: 0.75rem; color: var(--text-secondary); }

.tier-badge { display: inline-block; padding: 3px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
.tier-free { background: rgba(107, 114, 128, 0.15); color: #6b7280; }
.tier-pro { background: rgba(245, 158, 11, 0.15); color: #d97706; }
.tier-enterprise { background: rgba(139, 92, 246, 0.15); color: #7c3aed; }

.status-badge { display: inline-block; padding: 3px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
.status-active { background: rgba(16, 185, 129, 0.15); color: #059669; }
.status-inactive { background: rgba(107, 114, 128, 0.15); color: #6b7280; }

.action-btns { display: flex; gap: 4px; }
.action-btn { padding: 5px 10px; border-radius: 6px; font-size: 0.75rem; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); cursor: pointer; transition: all 0.2s; }
.action-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }
.action-btn.danger:hover { border-color: #dc2626; color: #dc2626; }
</style>
