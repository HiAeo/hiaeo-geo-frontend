<template>
  <div class="team-settings">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <button class="back-btn" @click="$router.back()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div class="header-info">
          <h1 class="page-title">{{ team?.name || '团队设置' }}</h1>
          <p class="page-subtitle">管理团队成员、权限和设置</p>
        </div>
      </div>
    </div>

    <!-- Tab 导航 -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-item"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- 成员管理 -->
    <div v-if="activeTab === 'members'" class="tab-content">
      <!-- 邀请成员 -->
      <div class="section invite-section">
        <div class="invite-header">
          <h3>邀请新成员</h3>
          <button class="primary-btn" @click="showInviteModal = true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
            邀请成员
          </button>
        </div>

        <!-- 邀请链接 -->
        <div class="invite-link-box">
          <div class="invite-link-info">
            <span class="invite-label">邀请链接</span>
            <code class="invite-link">{{ inviteLink || '生成中...' }}</code>
          </div>
          <button class="secondary-btn" @click="refreshInviteLink" :disabled="loading">
            {{ loading ? '生成中...' : '刷新链接' }}
          </button>
        </div>
      </div>

      <!-- 成员列表 -->
      <div class="section members-section">
        <h3>团队成员 ({{ members.length }})</h3>
        <div class="members-list">
          <div v-for="member in members" :key="member.id" class="member-item">
            <div class="member-info">
              <div class="member-avatar">
                <img v-if="member.avatar" :src="member.avatar" :alt="member.nickname || member.email" />
                <span v-else>{{ (member.nickname || member.email || '?')[0].toUpperCase() }}</span>
              </div>
              <div class="member-details">
                <span class="member-name">{{ member.nickname || member.email }}</span>
                <span class="member-email">{{ member.email }}</span>
              </div>
            </div>
            <div class="member-role">
              <span class="role-badge" :class="'role-' + member.role">{{ getRoleName(member.role) }}</span>
            </div>
            <div class="member-permissions">
              <span v-if="member.canManageDiagnose" class="perm-tag">诊断</span>
              <span v-if="member.canManageContent" class="perm-tag">内容</span>
              <span v-if="member.canManageTeam" class="perm-tag">管理</span>
              <span v-if="member.canViewBilling" class="perm-tag">账单</span>
            </div>
            <div class="member-actions" v-if="myRole === 'owner' || myRole === 'admin'">
              <button
                v-if="member.role !== 'owner'"
                class="action-btn"
                @click="editMember(member)"
              >
                编辑
              </button>
              <button
                v-if="member.role !== 'owner' && member.userId !== currentUserId"
                class="action-btn danger"
                @click="removeMemberConfirm(member)"
              >
                移除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 权限设置 -->
    <div v-if="activeTab === 'permissions'" class="tab-content">
      <div class="section">
        <h3>权限说明</h3>
        <div class="permissions-grid">
          <div class="permission-card">
            <h4>所有者 (Owner)</h4>
            <p>拥有团队所有权限，可管理团队设置、成员和账单</p>
          </div>
          <div class="permission-card">
            <h4>管理员 (Admin)</h4>
            <p>可管理成员、诊断和内容，但不能删除团队或修改所有者</p>
          </div>
          <div class="permission-card">
            <h4>编辑者 (Editor)</h4>
            <p>可创建和编辑诊断报告、内容，但不能管理团队</p>
          </div>
          <div class="permission-card">
            <h4>查看者 (Viewer)</h4>
            <p>只能查看团队数据和报告，不能进行编辑操作</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 审计日志 -->
    <div v-if="activeTab === 'audit'" class="tab-content">
      <div class="section">
        <h3>操作日志</h3>
        <div class="audit-list">
          <div v-for="log in auditLogs" :key="log.id" class="audit-item">
            <div class="audit-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div class="audit-content">
              <span class="audit-action">{{ getActionName(log.action) }}</span>
              <span class="audit-details">{{ log.userEmail }}</span>
              <span class="audit-time">{{ formatTime(log.createdAt) }}</span>
            </div>
          </div>
          <div v-if="auditLogs.length === 0" class="empty-state">
            暂无操作记录
          </div>
        </div>
      </div>
    </div>

    <!-- 团队信息 -->
    <div v-if="activeTab === 'settings'" class="tab-content">
      <div class="section">
        <h3>基本设置</h3>
        <div class="form-group">
          <label>团队名称</label>
          <input type="text" v-model="teamForm.name" placeholder="输入团队名称" />
        </div>
        <div class="form-group">
          <label>团队描述</label>
          <textarea v-model="teamForm.description" placeholder="描述团队" rows="3"></textarea>
        </div>
        <button class="primary-btn" @click="saveTeamSettings" :disabled="saving">
          {{ saving ? '保存中...' : '保存设置' }}
        </button>
      </div>

      <div class="section danger-zone">
        <h3>危险区域</h3>
        <div class="danger-item">
          <div>
            <h4>删除团队</h4>
            <p>删除后所有数据将无法恢复</p>
          </div>
          <button class="danger-btn" @click="deleteTeamConfirm">删除团队</button>
        </div>
      </div>
    </div>

    <!-- 邀请弹窗 -->
    <div class="modal-overlay" v-if="showInviteModal" @click.self="showInviteModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>邀请新成员</h3>
          <button class="close-btn" @click="showInviteModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>邮箱地址</label>
            <input type="email" v-model="inviteForm.email" placeholder="输入邮箱地址" />
          </div>
          <div class="form-group">
            <label>角色</label>
            <select v-model="inviteForm.role">
              <option value="viewer">查看者</option>
              <option value="editor">编辑者</option>
              <option value="admin">管理员</option>
            </select>
          </div>
          <div class="form-group">
            <label>权限</label>
            <div class="checkbox-group">
              <label class="checkbox-item">
                <input type="checkbox" v-model="inviteForm.canManageDiagnose" />
                <span>诊断管理</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" v-model="inviteForm.canManageContent" />
                <span>内容管理</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" v-model="inviteForm.canManageTeam" />
                <span>团队管理</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" v-model="inviteForm.canViewBilling" />
                <span>账单查看</span>
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="showInviteModal = false">取消</button>
          <button class="primary-btn" @click="inviteNewMember" :disabled="inviting">
            {{ inviting ? '发送中...' : '发送邀请' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 编辑成员弹窗 -->
    <div class="modal-overlay" v-if="showEditModal" @click.self="showEditModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>编辑成员权限</h3>
          <button class="close-btn" @click="showEditModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>角色</label>
            <select v-model="editForm.role">
              <option value="editor">编辑者</option>
              <option value="admin">管理员</option>
              <option value="viewer">查看者</option>
            </select>
          </div>
          <div class="form-group">
            <label>权限</label>
            <div class="checkbox-group">
              <label class="checkbox-item">
                <input type="checkbox" v-model="editForm.canManageDiagnose" />
                <span>诊断管理</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" v-model="editForm.canManageContent" />
                <span>内容管理</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" v-model="editForm.canManageTeam" />
                <span>团队管理</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" v-model="editForm.canViewBilling" />
                <span>账单查看</span>
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="showEditModal = false">取消</button>
          <button class="primary-btn" @click="saveMemberChanges" :disabled="saving">
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import teamApi from '@/api/team'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()

const teamId = computed(() => route.params.id)
const currentUserId = ref('')

const team = ref(null)
const members = ref([])
const auditLogs = ref([])
const inviteLink = ref('')

const activeTab = ref('members')
const loading = ref(false)
const saving = ref(false)
const inviting = ref(false)

const showInviteModal = ref(false)
const showEditModal = ref(false)
const editingMember = ref(null)

const tabs = [
  { id: 'members', name: '成员管理' },
  { id: 'permissions', name: '权限说明' },
  { id: 'audit', name: '操作日志' },
  { id: 'settings', name: '团队设置' },
]

const teamForm = reactive({
  name: '',
  description: '',
})

const inviteForm = reactive({
  email: '',
  role: 'viewer',
  canManageDiagnose: false,
  canManageContent: false,
  canManageTeam: false,
  canViewBilling: false,
})

const editForm = reactive({
  role: 'viewer',
  canManageDiagnose: false,
  canManageContent: false,
  canManageTeam: false,
  canViewBilling: false,
})

const myRole = computed(() => team.value?.myRole)

const loadTeam = async () => {
  try {
    loading.value = true
    const res = await teamApi.getTeam(teamId.value)
    team.value = res.data
    members.value = res.data.members || []
    teamForm.name = res.data.name
    teamForm.description = res.data.description || ''
    
    // 生成邀请链接
    refreshInviteLink()
  } catch (err) {
    ElMessage.error('加载团队信息失败')
    router.push('/app/dashboard')
  } finally {
    loading.value = false
  }
}

const refreshInviteLink = async () => {
  try {
    loading.value = true
    const res = await teamApi.generateInviteLink(teamId.value)
    inviteLink.value = res.data.inviteLink
  } catch (err) {
    ElMessage.error('生成邀请链接失败')
  } finally {
    loading.value = false
  }
}

const inviteNewMember = async () => {
  if (!inviteForm.email) {
    ElMessage.warning('请输入邮箱地址')
    return
  }
  try {
    inviting.value = true
    await teamApi.inviteMember(teamId.value, inviteForm)
    ElMessage.success('邀请已发送')
    showInviteModal.value = false
    inviteForm.email = ''
    inviteForm.role = 'viewer'
    inviteForm.canManageDiagnose = false
    inviteForm.canManageContent = false
    inviteForm.canManageTeam = false
    inviteForm.canViewBilling = false
  } catch (err) {
    ElMessage.error(err.message || '邀请失败')
  } finally {
    inviting.value = false
  }
}

const editMember = (member) => {
  editingMember.value = member
  editForm.role = member.role
  editForm.canManageDiagnose = member.canManageDiagnose
  editForm.canManageContent = member.canManageContent
  editForm.canManageTeam = member.canManageTeam
  editForm.canViewBilling = member.canViewBilling
  showEditModal.value = true
}

const saveMemberChanges = async () => {
  try {
    saving.value = true
    await teamApi.updateMember(teamId.value, editingMember.value.id, editForm)
    ElMessage.success('保存成功')
    showEditModal.value = false
    loadTeam()
  } catch (err) {
    ElMessage.error(err.message || '保存失败')
  } finally {
    saving.value = false
  }
}

const removeMemberConfirm = async (member) => {
  try {
    await ElMessageBox.confirm(
      `确定要移除成员 ${member.email || member.nickname} 吗？`,
      '确认移除',
      { type: 'warning' }
    )
    await teamApi.removeMember(teamId.value, member.id)
    ElMessage.success('已移除成员')
    loadTeam()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error(err.message || '移除失败')
    }
  }
}

const saveTeamSettings = async () => {
  try {
    saving.value = true
    await teamApi.updateTeam(teamId.value, teamForm)
    ElMessage.success('保存成功')
    loadTeam()
  } catch (err) {
    ElMessage.error(err.message || '保存失败')
  } finally {
    saving.value = false
  }
}

const deleteTeamConfirm = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个团队吗？此操作不可恢复！',
      '危险操作',
      { type: 'error', confirmButtonText: '确认删除' }
    )
    await teamApi.deleteTeam(teamId.value)
    ElMessage.success('团队已删除')
    router.push('/app/dashboard')
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error(err.message || '删除失败')
    }
  }
}

const getRoleName = (role) => {
  const names = {
    owner: '所有者',
    admin: '管理员',
    editor: '编辑者',
    viewer: '查看者',
  }
  return names[role] || role
}

const getActionName = (action) => {
  const names = {
    'team:create': '创建团队',
    'team:update': '更新团队',
    'team:delete': '删除团队',
    'team:invite': '邀请成员',
    'team:join': '加入团队',
    'team:leave': '离开团队',
    'team:remove_member': '移除成员',
    'team:update_role': '更新角色',
  }
  return names[action] || action
}

const formatTime = (time) => {
  const date = new Date(time)
  return date.toLocaleString('zh-CN')
}

onMounted(() => {
  // 从 localStorage 获取当前用户ID
  const userInfo = JSON.parse(localStorage.getItem('user') || '{}')
  currentUserId.value = userInfo.id
  loadTeam()
})
</script>

<style scoped>
.team-settings {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: var(--card-bg);
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s;
}

.back-btn:hover {
  background: var(--hover-bg);
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.page-subtitle {
  color: var(--text-secondary);
  margin: 4px 0 0;
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 12px;
}

.tab-item {
  padding: 8px 16px;
  border: none;
  background: none;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}

.tab-item.active {
  background: var(--primary-color);
  color: white;
}

.tab-item:hover:not(.active) {
  background: var(--hover-bg);
}

.section {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.section h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
}

.invite-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.invite-link-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--hover-bg);
  border-radius: 12px;
}

.invite-label {
  font-size: 12px;
  color: var(--text-secondary);
  display: block;
}

.invite-link {
  font-size: 14px;
  color: var(--primary-color);
  word-break: break-all;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--hover-bg);
  border-radius: 12px;
}

.member-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-details {
  display: flex;
  flex-direction: column;
}

.member-name {
  font-weight: 500;
  color: var(--text-primary);
}

.member-email {
  font-size: 12px;
  color: var(--text-secondary);
}

.role-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.role-owner { background: #fef3c7; color: #d97706; }
.role-admin { background: #dbeafe; color: #2563eb; }
.role-editor { background: #d1fae5; color: #059669; }
.role-viewer { background: #f3f4f6; color: #6b7280; }

.member-permissions {
  display: flex;
  gap: 4px;
}

.perm-tag {
  padding: 2px 8px;
  background: var(--card-bg);
  border-radius: 4px;
  font-size: 11px;
  color: var(--text-secondary);
}

.member-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  background: var(--card-bg);
  border-radius: 6px;
  font-size: 12px;
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

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.permission-card {
  padding: 16px;
  background: var(--hover-bg);
  border-radius: 12px;
}

.permission-card h4 {
  margin: 0 0 8px;
  font-size: 14px;
}

.permission-card p {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.audit-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.audit-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: var(--hover-bg);
  border-radius: 8px;
}

.audit-icon {
  color: var(--text-secondary);
}

.audit-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.audit-action {
  font-weight: 500;
  font-size: 14px;
}

.audit-details {
  font-size: 12px;
  color: var(--text-secondary);
}

.audit-time {
  font-size: 11px;
  color: var(--text-tertiary);
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

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
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

.danger-zone {
  border: 1px solid #fecaca;
}

.danger-zone h3 {
  color: #dc2626;
}

.danger-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.danger-item h4 {
  margin: 0 0 4px;
  font-size: 14px;
}

.danger-item p {
  margin: 0;
  font-size: 12px;
  color: var(--text-secondary);
}

.danger-btn {
  padding: 8px 16px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.danger-btn:hover {
  background: #dc2626;
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

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}
</style>
