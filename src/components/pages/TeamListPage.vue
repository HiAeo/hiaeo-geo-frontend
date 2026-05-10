<template>
  <div class="team-list-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-info">
        <h1 class="page-title">我的团队</h1>
        <p class="page-subtitle">管理和协作您的团队</p>
      </div>
      <button class="primary-btn" @click="showCreateModal = true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        创建团队
      </button>
    </div>

    <!-- 团队列表 -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <span>加载中...</span>
    </div>

    <div v-else-if="teams.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </div>
      <h3>还没有团队</h3>
      <p>创建或加入一个团队，开始协作</p>
      <button class="primary-btn" @click="showCreateModal = true">创建团队</button>
    </div>

    <div v-else class="teams-grid">
      <div
        v-for="team in teams"
        :key="team.id"
        class="team-card"
        @click="$router.push(`/app/teams/${team.id}`)"
      >
        <div class="team-header">
          <div class="team-logo">
            <img v-if="team.logo" :src="team.logo" :alt="team.name" />
            <span v-else>{{ team.name[0].toUpperCase() }}</span>
          </div>
          <span class="team-role" :class="'role-' + team.role">{{ getRoleName(team.role) }}</span>
        </div>
        <h3 class="team-name">{{ team.name }}</h3>
        <p class="team-description">{{ team.description || '暂无描述' }}</p>
        <div class="team-meta">
          <span class="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
            {{ team.memberCount || '...' }} 成员
          </span>
          <span class="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {{ formatDate(team.createdAt) }}
          </span>
        </div>
        <div class="team-actions" @click.stop>
          <button class="action-btn" @click="$router.push(`/app/teams/${team.id}`)">
            管理
          </button>
          <button v-if="team.role === 'owner'" class="action-btn danger" @click="leaveTeamConfirm(team)">
            删除
          </button>
          <button v-else class="action-btn" @click="leaveTeamConfirm(team)">
            退出
          </button>
        </div>
      </div>

      <!-- 加入团队卡片 -->
      <div class="team-card join-card" @click="showJoinModal = true">
        <div class="join-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
            <line x1="20" y1="8" x2="20" y2="14"/>
            <line x1="23" y1="11" x2="17" y2="11"/>
          </svg>
        </div>
        <span>加入团队</span>
      </div>
    </div>

    <!-- 创建团队弹窗 -->
    <div class="modal-overlay" v-if="showCreateModal" @click.self="showCreateModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>创建团队</h3>
          <button class="close-btn" @click="showCreateModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>团队名称 *</label>
            <input type="text" v-model="createForm.name" placeholder="输入团队名称" />
          </div>
          <div class="form-group">
            <label>团队描述</label>
            <textarea v-model="createForm.description" placeholder="描述团队（选填）" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>可见性</label>
            <div class="radio-group">
              <label class="radio-item">
                <input type="radio" v-model="createForm.visibility" value="private" />
                <span>私有团队</span>
              </label>
              <label class="radio-item">
                <input type="radio" v-model="createForm.visibility" value="public" />
                <span>公开团队</span>
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="showCreateModal = false">取消</button>
          <button class="primary-btn" @click="createTeam" :disabled="creating">
            {{ creating ? '创建中...' : '创建' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 加入团队弹窗 -->
    <div class="modal-overlay" v-if="showJoinModal" @click.self="showJoinModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>加入团队</h3>
          <button class="close-btn" @click="showJoinModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>邀请码 *</label>
            <input type="text" v-model="joinCode" placeholder="输入邀请码或粘贴邀请链接" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="showJoinModal = false">取消</button>
          <button class="primary-btn" @click="joinTeam" :disabled="joining">
            {{ joining ? '加入中...' : '加入' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import teamApi from '@/api/team'
import { ElMessage, ElMessageBox } from 'element-plus'

const teams = ref([])
const loading = ref(false)
const creating = ref(false)
const joining = ref(false)

const showCreateModal = ref(false)
const showJoinModal = ref(false)
const joinCode = ref('')

const createForm = reactive({
  name: '',
  description: '',
  visibility: 'private',
})

const getRoleName = (role) => {
  const names = {
    owner: '所有者',
    admin: '管理员',
    editor: '编辑者',
    viewer: '查看者',
  }
  return names[role] || role
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}

const loadTeams = async () => {
  try {
    loading.value = true
    const res = await teamApi.getTeams()
    teams.value = res.data || []
  } catch (err) {
    ElMessage.error('加载团队列表失败')
  } finally {
    loading.value = false
  }
}

const createTeam = async () => {
  if (!createForm.name.trim()) {
    ElMessage.warning('请输入团队名称')
    return
  }
  try {
    creating.value = true
    const res = await teamApi.createTeam(createForm)
    ElMessage.success('团队创建成功')
    showCreateModal.value = false
    loadTeams()
    // 跳转到团队设置页面
    window.location.href = `/app/teams/${res.data.id}`
  } catch (err) {
    ElMessage.error(err.message || '创建失败')
  } finally {
    creating.value = false
  }
}

const joinTeam = async () => {
  if (!joinCode.value.trim()) {
    ElMessage.warning('请输入邀请码')
    return
  }
  try {
    joining.value = true
    // 从 URL 中提取邀请码
    let code = joinCode.value.trim()
    if (code.includes('/join/')) {
      code = code.split('/join/')[1]
    }
    const res = await teamApi.joinByInviteCode(code)
    ElMessage.success(`成功加入团队 ${res.data.team.name}`)
    showJoinModal.value = false
    joinCode.value = ''
    loadTeams()
  } catch (err) {
    ElMessage.error(err.message || '加入失败')
  } finally {
    joining.value = false
  }
}

const leaveTeamConfirm = async (team) => {
  const isOwner = team.role === 'owner'
  const title = isOwner ? '删除团队' : '退出团队'
  const message = isOwner
    ? `确定要删除团队 "${team.name}" 吗？此操作不可恢复！`
    : `确定要退出团队 "${team.name}" 吗？`

  try {
    await ElMessageBox.confirm(message, title, { type: 'warning' })
    if (isOwner) {
      await teamApi.deleteTeam(team.id)
      ElMessage.success('团队已删除')
    } else {
      await teamApi.leaveTeam(team.id)
      ElMessage.success('已退出团队')
    }
    loadTeams()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error(err.message || '操作失败')
    }
  }
}

onMounted(() => {
  loadTeams()
})
</script>

<style scoped>
.team-list-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.page-subtitle {
  color: var(--text-secondary);
  margin: 4px 0 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: var(--text-secondary);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 60px;
  background: var(--card-bg);
  border-radius: 16px;
}

.empty-icon {
  color: var(--text-tertiary);
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px;
  font-size: 18px;
}

.empty-state p {
  margin: 0 0 24px;
  color: var(--text-secondary);
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.team-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.team-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.team-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.team-logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: 600;
  overflow: hidden;
}

.team-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.team-role {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.role-owner { background: #fef3c7; color: #d97706; }
.role-admin { background: #dbeafe; color: #2563eb; }
.role-editor { background: #d1fae5; color: #059669; }
.role-viewer { background: #f3f4f6; color: #6b7280; }

.team-name {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
}

.team-description {
  margin: 0 0 16px;
  font-size: 14px;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.team-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-tertiary);
}

.team-actions {
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.action-btn {
  flex: 1;
  padding: 8px;
  border: none;
  background: var(--hover-bg);
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
}

.action-btn:hover {
  background: var(--border-color);
}

.action-btn.danger {
  color: #ef4444;
}

.action-btn.danger:hover {
  background: #fef2f2;
}

.join-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  border: 2px dashed var(--border-color);
  background: transparent;
}

.join-card:hover {
  border-color: var(--primary-color);
  background: var(--card-bg);
}

.join-icon {
  color: var(--text-tertiary);
  margin-bottom: 12px;
}

.join-card span {
  font-size: 14px;
  color: var(--text-secondary);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--card-bg);
  border-radius: 16px;
  width: 480px;
  max-width: 90vw;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary);
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  background: var(--input-bg);
  color: var(--text-primary);
}

.radio-group {
  display: flex;
  gap: 24px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
}

.primary-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.primary-btn:hover {
  background: var(--primary-hover);
}

.primary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.secondary-btn {
  padding: 10px 20px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.secondary-btn:hover {
  background: var(--hover-bg);
}
</style>
