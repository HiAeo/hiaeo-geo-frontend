<template>
  <div class="join-team-page">
    <div class="join-card">
      <div class="logo">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <h1>加入团队</h1>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <span>验证邀请码...</span>
      </div>

      <div v-else-if="error" class="error-state">
        <div class="error-icon">!</div>
        <h3>邀请无效</h3>
        <p>{{ error }}</p>
        <button class="primary-btn" @click="$router.push('/app/dashboard')">
          返回工作台
        </button>
      </div>

      <div v-else-if="teamInfo" class="team-info">
        <div class="team-logo">
          <img v-if="teamInfo.logo" :src="teamInfo.logo" :alt="teamInfo.name" />
          <span v-else>{{ teamInfo.name[0].toUpperCase() }}</span>
        </div>
        <h2>{{ teamInfo.name }}</h2>
        <p>{{ teamInfo.description || '团队邀请您加入' }}</p>

        <div v-if="alreadyMember" class="already-member">
          <span>您已经是该团队成员</span>
          <button class="primary-btn" @click="$router.push(`/app/teams/${teamInfo.id}`)">
            进入团队
          </button>
        </div>

        <button v-else class="primary-btn full-width" @click="joinTeam" :disabled="joining">
          {{ joining ? '加入中...' : '接受邀请' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import teamApi from '@/api/team'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const joining = ref(false)
const error = ref('')
const teamInfo = ref(null)
const alreadyMember = ref(false)

const joinTeam = async () => {
  try {
    joining.value = true
    const res = await teamApi.joinByInviteCode(route.params.inviteCode)
    ElMessage.success(`成功加入团队 ${res.data.team.name}`)
    router.push(`/app/teams/${res.data.team.id}`)
  } catch (err) {
    ElMessage.error(err.message || '加入失败')
  } finally {
    joining.value = false
  }
}

onMounted(async () => {
  try {
    const res = await teamApi.joinByInviteCode(route.params.inviteCode)
    teamInfo.value = res.data.team
    alreadyMember.value = true // 已经是成员，接口会返回错误码
  } catch (err) {
    if (err.message?.includes('已经是')) {
      // 从错误信息中提取团队ID
      teamInfo.value = { name: '团队', id: err.response?.data?.teamId }
      alreadyMember.value = true
    } else {
      error.value = err.message || '邀请码无效或已过期'
    }
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.join-team-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  padding: 20px;
}

.join-card {
  background: var(--card-bg);
  border-radius: 24px;
  padding: 48px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.logo {
  width: 64px;
  height: 64px;
  margin: 0 auto 24px;
  color: var(--primary-color);
}

h1 {
  margin: 0 0 32px;
  font-size: 24px;
  font-weight: 600;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--text-secondary);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state {
  padding: 20px 0;
}

.error-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: #fef2f2;
  color: #ef4444;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
}

.error-state h3 {
  margin: 0 0 8px;
  font-size: 18px;
}

.error-state p {
  margin: 0 0 24px;
  color: var(--text-secondary);
}

.team-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  font-weight: 600;
  overflow: hidden;
}

.team-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.team-info h2 {
  margin: 0 0 8px;
  font-size: 20px;
}

.team-info p {
  margin: 0 0 32px;
  color: var(--text-secondary);
}

.already-member {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.already-member span {
  color: var(--text-secondary);
}

.primary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 24px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
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

.primary-btn.full-width {
  width: 100%;
}
</style>
