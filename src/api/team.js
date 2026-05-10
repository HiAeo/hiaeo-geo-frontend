import request from './request'

/**
 * 团队管理 API
 */
const teamApi = {
  // 获取用户的所有团队
  getTeams: () => request('/teams'),

  // 获取团队详情
  getTeam: (teamId) => request(`/teams/${teamId}`),

  // 创建团队
  createTeam: (data) => request('/teams', { method: 'POST', body: JSON.stringify(data) }),

  // 更新团队
  updateTeam: (teamId, data) => request(`/teams/${teamId}`, { method: 'PUT', body: JSON.stringify(data) }),

  // 删除团队
  deleteTeam: (teamId) => request(`/teams/${teamId}`, { method: 'DELETE' }),

  // 获取团队成员列表
  getMembers: (teamId) => request(`/teams/${teamId}/members`),

  // 邀请成员
  inviteMember: (teamId, data) => request(`/teams/${teamId}/invite`, { method: 'POST', body: JSON.stringify(data) }),

  // 更新成员角色
  updateMember: (teamId, memberId, data) => request(`/teams/${teamId}/members/${memberId}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // 移除成员
  removeMember: (teamId, memberId) => request(`/teams/${teamId}/members/${memberId}`, { method: 'DELETE' }),

  // 生成邀请链接
  createInviteLink: (teamId) => request(`/teams/${teamId}/invite-link`, { method: 'POST' }),

  // 验证邀请码
  validateInvite: (inviteCode) => request(`/teams/invite/${inviteCode}`),

  // 加入团队
  joinTeam: (inviteCode) => request(`/teams/invite/${inviteCode}/accept`, { method: 'POST' }),

  // 退出团队
  leaveTeam: (teamId) => request(`/teams/${teamId}/leave`, { method: 'POST' }),

  // 获取审计日志
  getAuditLogs: (teamId, params) => request(`/teams/${teamId}/audit-logs`, { params }),

  // 获取当前用户的团队列表
  getMyTeams: () => request('/teams/my'),
}

export default teamApi
