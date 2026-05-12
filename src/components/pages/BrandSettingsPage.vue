<template>
  <div class="brand-settings">
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">ModelBuddy·会员账户管理</h1>
          <span class="page-subtitle">管理个人信息、品牌资料、通知偏好和安全设置</span>
        </div>
      </div>
    </div>

    <div class="settings-content">
      <div class="settings-nav">
        <button v-for="section in sections" :key="section.id" :class="{ active: activeSection === section.id }" @click="activeSection = section.id">
          {{ section.label }}
        </button>
      </div>

      <div class="settings-panel">
        <!-- Profile Section -->
        <div v-if="activeSection === 'profile'" class="section">
          <h2 class="section-title">个人信息</h2>
          <div class="profile-avatar">
            <div class="avatar-circle">{{ user.nickname?.charAt(0) || 'U' }}</div>
            <button class="upload-btn">更换头像</button>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>昵称</label>
              <input v-model="user.nickname" type="text" placeholder="请输入昵称" />
            </div>
            <div class="form-group">
              <label>邮箱</label>
              <input v-model="user.email" type="email" disabled />
            </div>
            <div class="form-group">
              <label>手机号</label>
              <input v-model="user.phone" type="tel" placeholder="未绑定" />
            </div>
            <div class="form-group">
              <label>公司名称</label>
              <input v-model="user.company" type="text" placeholder="请输入公司名称" />
            </div>
            <div class="form-group">
              <label>所属行业</label>
              <select v-model="user.industry">
                <option value="">请选择行业</option>
                <option value="互联网">互联网</option>
                <option value="金融">金融</option>
                <option value="电商">电商</option>
                <option value="教育">教育</option>
                <option value="医疗">医疗</option>
                <option value="媒体">媒体</option>
                <option value="游戏">游戏</option>
                <option value="旅游">旅游</option>
                <option value="其他">其他</option>
              </select>
            </div>
            <div class="form-group full-width">
              <label>公司网址</label>
              <input v-model="user.website" type="url" placeholder="https://www.example.com" />
            </div>
          </div>
          <button class="btn-save" @click="saveProfile" :disabled="saving">
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </div>

        <!-- Brand Section -->
        <div v-if="activeSection === 'brand'" class="section">
          <h2 class="section-title">品牌信息</h2>
          <p class="section-desc">管理您的品牌基本信息，这些信息将用于诊断分析</p>
          <div class="form-grid">
            <div class="form-group full-width">
              <label>品牌名称</label>
              <input v-model="brand.name" type="text" placeholder="请输入品牌名称" />
            </div>
            <div class="form-group full-width">
              <label>品牌描述</label>
              <textarea v-model="brand.description" rows="4" placeholder="描述品牌特点、定位、愿景..."></textarea>
            </div>
            <div class="form-group full-width">
              <label>品牌网址</label>
              <input v-model="brand.website" type="url" placeholder="https://www.yourbrand.com" />
            </div>
          </div>
          <button class="btn-save" @click="saveBrand" :disabled="saving">
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </div>

        <!-- Notifications Section -->
        <div v-if="activeSection === 'notifications'" class="section">
          <h2 class="section-title">通知设置</h2>
          <p class="section-desc">选择您希望接收的通知类型</p>
          <div class="toggle-list">
            <div class="toggle-item">
              <div>
                <div class="toggle-label">诊断完成通知</div>
                <div class="toggle-desc">当品牌诊断完成后发送通知</div>
              </div>
              <label class="toggle">
                <input type="checkbox" v-model="notifications.diagnoseComplete" />
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="toggle-item">
              <div>
                <div class="toggle-label">积分变动提醒</div>
                <div class="toggle-desc">积分余额变化时通知</div>
              </div>
              <label class="toggle">
                <input type="checkbox" v-model="notifications.creditsChange" />
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="toggle-item">
              <div>
                <div class="toggle-label">竞品动态</div>
                <div class="toggle-desc">竞品有新动态时通知</div>
              </div>
              <label class="toggle">
                <input type="checkbox" v-model="notifications.competitorAlert" />
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="toggle-item">
              <div>
                <div class="toggle-label">策略生成完成</div>
                <div class="toggle-desc">AI策略生成完成时通知</div>
              </div>
              <label class="toggle">
                <input type="checkbox" v-model="notifications.strategyComplete" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Security Section -->
        <div v-if="activeSection === 'security'" class="section">
          <h2 class="section-title">安全设置</h2>
          <div class="security-item">
            <div>
              <div class="toggle-label">修改密码</div>
              <div class="toggle-desc">定期更换密码可以提高账户安全性</div>
            </div>
            <button class="secondary-btn" @click="showPasswordModal = true">修改密码</button>
          </div>
          <div class="security-item">
            <div>
              <div class="toggle-label">两步验证</div>
              <div class="toggle-desc">启用额外安全保护</div>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="security.twoFactor" />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="danger-zone">
            <h3>危险区域</h3>
            <div class="btn-row">
              <button class="danger-btn">导出账户数据</button>
              <button class="danger-btn outline">注销账户</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <div v-if="showPasswordModal" class="modal-overlay" @click.self="showPasswordModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>修改密码</h3>
          <button class="close-btn" @click="showPasswordModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>当前密码</label>
            <input v-model="passwordForm.oldPassword" type="password" placeholder="请输入当前密码" />
          </div>
          <div class="form-group">
            <label>新密码</label>
            <input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码（6位以上）" />
          </div>
          <div class="form-group">
            <label>确认新密码</label>
            <input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="showPasswordModal = false">取消</button>
          <button class="primary-btn" @click="handleChangePassword" :disabled="changingPassword">
            {{ changingPassword ? '修改中...' : '确认修改' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '../../composables/useApi'
import { useTheme } from '../../composables/useTheme'

// 使用全局主题状态
const { theme } = useTheme()

const { getUserProfile, updateUserProfile, changePassword } = useApi()

const activeSection = ref('profile')
const saving = ref(false)
const changingPassword = ref(false)
const showPasswordModal = ref(false)

const sections = [
  { id: 'profile', label: '个人信息' },
  { id: 'brand', label: '品牌管理' },
  { id: 'notifications', label: '通知设置' },
  { id: 'security', label: '安全设置' }
]

const user = ref({
  nickname: '',
  email: '',
  phone: '',
  company: '',
  industry: '',
  website: ''
})

const brand = ref({
  name: '我的品牌',
  description: '',
  website: ''
})

const notifications = ref({
  diagnoseComplete: true,
  creditsChange: true,
  competitorAlert: false,
  strategyComplete: true
})

const security = ref({
  twoFactor: false
})

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 加载用户信息
const loadUserProfile = async () => {
  try {
    const data = await getUserProfile()
    user.value = {
      nickname: data.nickname || '',
      email: data.email || '',
      phone: data.phone || '',
      company: data.company || '',
      industry: data.industry || '',
      website: data.website || ''
    }
    // 更新 brand 信息
    if (data.company) {
      brand.value.name = data.company
    }
    if (data.website) {
      brand.value.website = data.website
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

// 保存个人信息
const saveProfile = async () => {
  if (!user.value.nickname) {
    alert('请输入昵称')
    return
  }
  
  saving.value = true
  try {
    await updateUserProfile({
      nickname: user.value.nickname,
      phone: user.value.phone || undefined,
      company: user.value.company || undefined,
      industry: user.value.industry || undefined,
      website: user.value.website || undefined
    })
    alert('个人信息已保存')
  } catch (error) {
    alert('保存失败: ' + error.message)
  } finally {
    saving.value = false
  }
}

// 保存品牌信息
const saveBrand = async () => {
  saving.value = true
  try {
    // 品牌信息也通过 updateUserProfile 更新
    await updateUserProfile({
      company: brand.value.name,
      website: brand.value.website
    })
    alert('品牌信息已保存')
  } catch (error) {
    alert('保存失败: ' + error.message)
  } finally {
    saving.value = false
  }
}

// 修改密码
const handleChangePassword = async () => {
  if (!passwordForm.value.oldPassword) {
    alert('请输入当前密码')
    return
  }
  if (!passwordForm.value.newPassword) {
    alert('请输入新密码')
    return
  }
  if (passwordForm.value.newPassword.length < 6) {
    alert('新密码至少需要6位')
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('两次输入的新密码不一致')
    return
  }
  
  changingPassword.value = true
  try {
    await changePassword({
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword
    })
    alert('密码修改成功')
    showPasswordModal.value = false
    passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
  } catch (error) {
    alert('修改失败: ' + error.message)
  } finally {
    changingPassword.value = false
  }
}

onMounted(() => {
  loadUserProfile()
})
</script>

<style scoped>
.brand-settings {
  min-height: 100vh;
  padding-bottom: 40px;
  background: var(--bg-primary);
}

/* Header */
.page-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  padding: 16px 24px;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.page-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

/* Settings Content - 上下布局 */
.settings-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* 顶部标签导航 */
.settings-nav {
  display: flex;
  gap: 8px;
  padding: 0 0 20px 0;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 0;
  flex-wrap: wrap;
}

.settings-nav button {
  padding: 10px 20px;
  text-align: center;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.875rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.settings-nav button:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.settings-nav button.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.settings-panel {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 0 0 16px 16px;
  padding: 28px;
  border-top: none;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
  margin: 0;
}

.section-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: -8px 0 0;
}

.profile-avatar {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.upload-btn {
  padding: 8px 14px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.8125rem;
  cursor: pointer;
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.upload-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 10px 14px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.875rem;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: var(--color-primary);
}

.form-group input:disabled {
  opacity: 0.5;
}

.form-group select {
  cursor: pointer;
}

/* Buttons */
.btn-save {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 20px;
  min-width: 80px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-save:hover {
  opacity: 0.9;
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.primary-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-btn:hover {
  opacity: 0.9;
}

.primary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.secondary-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.secondary-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Toggle */
.toggle-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toggle-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--bg-primary);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.toggle-item:hover {
  background: var(--border-color);
}

.toggle-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.toggle-desc {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: var(--border-color);
  border-radius: 12px;
  transition: 0.3s;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}

.toggle input:checked + .toggle-slider {
  background: var(--color-primary);
}

.toggle input:checked + .toggle-slider::before {
  transform: translateX(20px);
}

/* Security */
.security-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--bg-primary);
  border-radius: 10px;
  transition: all 0.2s ease;
  margin-bottom: 8px;
}

.security-item:hover {
  background: var(--border-color);
}

.danger-zone {
  margin-top: 16px;
  padding: 16px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
}

.danger-zone h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-danger);
  margin-bottom: 12px;
}

.danger-zone .btn-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.danger-btn {
  padding: 8px 16px;
  background: rgba(239, 68, 68, 0.15);
  color: var(--color-danger);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.danger-btn:hover {
  background: rgba(239, 68, 68, 0.25);
}

.danger-btn.outline {
  background: transparent;
}

.danger-btn.outline:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  width: 90%;
  max-width: 420px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
}
</style>
