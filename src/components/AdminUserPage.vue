<template>
  <div class="admin-page" :data-theme="theme">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <button class="back-btn" @click="$emit('back')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
        </button>
        <h1 class="page-title">用户管理</h1>
        <div class="header-actions">
          <!-- Theme Toggle -->
          <button class="theme-toggle-btn" @click="toggleTheme" :title="theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'">
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
          </button>
          <button class="refresh-btn" @click="loadUsers" :class="{ spinning: loading }">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon total">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.totalUsers }}</span>
            <span class="stat-label">总用户数</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.activeUsers }}</span>
            <span class="stat-label">活跃用户</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon pro">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.proUsers }}</span>
            <span class="stat-label">Pro 用户</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon enterprise">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.enterpriseUsers }}</span>
            <span class="stat-label">企业用户</span>
          </div>
        </div>
      </div>
    </div>

    <!-- User Growth Chart -->
    <div class="chart-section">
      <div class="chart-card">
        <div class="chart-header">
          <h3>用户增长趋势</h3>
          <div class="chart-tabs">
            <button 
              :class="{ active: chartPeriod === '7d' }" 
              @click="chartPeriod = '7d'; loadChartData()"
            >近7天</button>
            <button 
              :class="{ active: chartPeriod === '30d' }" 
              @click="chartPeriod = '30d'; loadChartData()"
            >近30天</button>
          </div>
        </div>
        <div class="chart-container" v-if="chartData.length > 0">
          <svg class="chart-svg" :viewBox="`0 0 ${chartWidth} ${chartHeight}`" preserveAspectRatio="none">
            <!-- Grid lines -->
            <line 
              v-for="i in 4" 
              :key="'grid-' + i"
              :x1="padding.left" 
              :y1="padding.top + (chartHeight - padding.top - padding.bottom) * (i - 1) / 3"
              :x2="chartWidth - padding.right" 
              :y2="padding.top + (chartHeight - padding.top - padding.bottom) * (i - 1) / 3"
              class="chart-grid-line"
            />
            <!-- Area fill -->
            <path 
              :d="areaPath" 
              class="chart-area"
            />
            <!-- Line -->
            <path 
              :d="linePath" 
              class="chart-line"
            />
            <!-- Data points -->
            <circle 
              v-for="(point, index) in chartPoints" 
              :key="'point-' + index"
              :cx="point.x" 
              :cy="point.y" 
              r="4"
              class="chart-point"
              @mouseenter="showTooltip(index, $event)"
              @mouseleave="hideTooltip"
            />
          </svg>
          <div class="chart-labels">
            <span v-for="(item, index) in chartData" :key="'label-' + index" class="chart-label">
              {{ formatChartDate(item.date) }}
            </span>
          </div>
        </div>
        <div v-else class="chart-empty">
          <span>暂无趋势数据</span>
        </div>
        <!-- Tooltip -->
        <div 
          v-if="tooltip.visible" 
          class="chart-tooltip"
          :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
        >
          <div class="tooltip-date">{{ tooltip.date }}</div>
          <div class="tooltip-value">新增用户: <strong>{{ tooltip.value }}</strong></div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions-section">
      <button class="quick-action-btn" @click="showExportModal = true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        导出数据
      </button>
      <button class="quick-action-btn" @click="showLogModal = true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        操作日志
      </button>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="search-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input 
          type="text" 
          v-model="filters.search" 
          placeholder="搜索邮箱..."
          @keyup.enter="loadUsers"
        />
      </div>

      <div class="filter-group">
        <select v-model="filters.subscriptionTier" @change="loadUsers">
          <option value="">全部订阅</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>

        <select v-model="filters.isActive" @change="loadUsers">
          <option value="">全部状态</option>
          <option value="true">活跃</option>
          <option value="false">禁用</option>
        </select>
      </div>
    </div>

    <!-- User List -->
    <div class="user-list-section">
      <div class="user-list">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <span>加载中...</span>
        </div>

        <div v-else-if="users.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <line x1="17" y1="11" x2="23" y2="11"/>
          </svg>
          <p>暂无用户数据</p>
        </div>

        <div v-else class="user-table">
          <div class="table-header">
            <div class="col-user">用户</div>
            <div class="col-subscription">订阅</div>
            <div class="col-credits">积分</div>
            <div class="col-status">状态</div>
            <div class="col-actions">操作</div>
          </div>

          <div 
            v-for="user in users" 
            :key="user.id" 
            class="table-row"
            :class="{ inactive: !user.isActive }"
          >
            <div class="col-user">
              <div class="user-avatar">
                {{ getInitial(user) }}
              </div>
              <div class="user-info">
                <span class="user-name">{{ user.nickname || '未设置昵称' }}</span>
                <span class="user-email">{{ user.email }}</span>
              </div>
            </div>

            <div class="col-subscription">
              <span class="subscription-badge" :class="user.subscriptionTier">
                {{ getTierLabel(user.subscriptionTier) }}
              </span>
            </div>

            <div class="col-credits">
              <span class="credits-value">{{ user.credits }}</span>
            </div>

            <div class="col-status">
              <span class="status-badge" :class="{ active: user.isActive }">
                {{ user.isActive ? '活跃' : '禁用' }}
              </span>
            </div>

            <div class="col-actions">
              <button class="action-btn" @click="viewUser(user)" title="查看详情">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
              <button class="action-btn credits-btn" @click="openCreditsModal(user)" title="积分操作">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
              </button>
              <button class="action-btn" @click="editUser(user)" title="编辑">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="action-btn danger" @click="confirmDelete(user)" title="删除">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.total > pagination.limit" class="pagination">
        <button 
          class="page-btn" 
          :disabled="pagination.page <= 1"
          @click="goToPage(pagination.page - 1)"
        >
          上一页
        </button>
        <span class="page-info">
          第 {{ pagination.page }} / {{ totalPages }} 页
        </span>
        <button 
          class="page-btn"
          :disabled="pagination.page >= totalPages"
          @click="goToPage(pagination.page + 1)"
        >
          下一页
        </button>
      </div>
    </div>

    <!-- User Detail Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDetailModal" class="modal-overlay" @click.self="showDetailModal = false">
          <div class="modal-container detail-modal">
            <button class="modal-close" @click="showDetailModal = false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <div class="modal-header">
              <h2>用户详情</h2>
            </div>

            <div class="detail-content" v-if="selectedUser">
              <div class="detail-section">
                <h3>基本信息</h3>
                <div class="detail-grid">
                  <div class="detail-item">
                    <label>用户 ID</label>
                    <span class="mono">{{ selectedUser.id }}</span>
                  </div>
                  <div class="detail-item">
                    <label>邮箱</label>
                    <span>{{ selectedUser.email }}</span>
                  </div>
                  <div class="detail-item">
                    <label>昵称</label>
                    <span>{{ selectedUser.nickname || '-' }}</span>
                  </div>
                  <div class="detail-item">
                    <label>公司</label>
                    <span>{{ selectedUser.company || '-' }}</span>
                  </div>
                  <div class="detail-item">
                    <label>行业</label>
                    <span>{{ selectedUser.industry || '-' }}</span>
                  </div>
                  <div class="detail-item">
                    <label>网站</label>
                    <span>{{ selectedUser.website || '-' }}</span>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <h3>账户信息</h3>
                <div class="detail-grid">
                  <div class="detail-item">
                    <label>订阅等级</label>
                    <span class="subscription-badge" :class="selectedUser.subscriptionTier">
                      {{ getTierLabel(selectedUser.subscriptionTier) }}
                    </span>
                  </div>
                  <div class="detail-item">
                    <label>积分余额</label>
                    <span class="credits-value">{{ selectedUser.credits }}</span>
                  </div>
                  <div class="detail-item">
                    <label>账户状态</label>
                    <span class="status-badge" :class="{ active: selectedUser.isActive }">
                      {{ selectedUser.isActive ? '活跃' : '禁用' }}
                    </span>
                  </div>
                  <div class="detail-item">
                    <label>注册时间</label>
                    <span>{{ formatDate(selectedUser.createdAt) }}</span>
                  </div>
                  <div class="detail-item">
                    <label>最后登录</label>
                    <span>{{ formatDate(selectedUser.lastLoginAt) }}</span>
                  </div>
                </div>
              </div>

              <div class="detail-actions">
                <button class="btn-secondary" @click="editUser(selectedUser)">
                  编辑用户
                </button>
                <button class="btn-credits" @click="openCreditsModal(selectedUser)">
                  积分操作
                </button>
                <button class="btn-danger-outline" @click="confirmDelete(selectedUser)">
                  删除用户
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Edit User Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
          <div class="modal-container edit-modal">
            <button class="modal-close" @click="showEditModal = false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <div class="modal-header">
              <h2>编辑用户</h2>
            </div>

            <form class="edit-form" @submit.prevent="saveUser">
              <div class="form-group">
                <label>昵称</label>
                <input type="text" v-model="editForm.nickname" />
              </div>

              <div class="form-group">
                <label>公司</label>
                <input type="text" v-model="editForm.company" />
              </div>

              <div class="form-group">
                <label>订阅等级</label>
                <select v-model="editForm.subscriptionTier">
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div class="form-group">
                <label>积分</label>
                <input type="number" v-model.number="editForm.credits" min="0" />
              </div>

              <div class="form-group">
                <label>状态</label>
                <select v-model="editForm.isActive">
                  <option :value="true">活跃</option>
                  <option :value="false">禁用</option>
                </select>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-secondary" @click="showEditModal = false">
                  取消
                </button>
                <button type="submit" class="btn-primary" :disabled="saving">
                  {{ saving ? '保存中...' : '保存' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Credits Operation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCreditsModal" class="modal-overlay" @click.self="showCreditsModal = false">
          <div class="modal-container credits-modal">
            <button class="modal-close" @click="showCreditsModal = false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <div class="modal-header">
              <h2>积分操作</h2>
            </div>

            <div class="credits-info" v-if="selectedUser">
              <span class="credits-user">{{ selectedUser.email }}</span>
              <span class="credits-balance">当前积分: <strong>{{ selectedUser.credits }}</strong></span>
            </div>

            <form class="edit-form" @submit.prevent="handleCreditsOperation">
              <div class="form-group">
                <label>操作类型</label>
                <div class="radio-group">
                  <label class="radio-label">
                    <input type="radio" v-model="creditsForm.type" value="add" />
                    <span>充值</span>
                  </label>
                  <label class="radio-label">
                    <input type="radio" v-model="creditsForm.type" value="deduct" />
                    <span>扣除</span>
                  </label>
                </div>
              </div>

              <div class="form-group">
                <label>积分数量</label>
                <input 
                  type="number" 
                  v-model.number="creditsForm.amount" 
                  min="1" 
                  placeholder="请输入积分数量"
                />
                <span class="form-hint">可输入 50, 100, 200, 500 等常用数额</span>
              </div>

              <div class="form-group">
                <label>备注（可选）</label>
                <textarea 
                  v-model="creditsForm.reason" 
                  placeholder="请输入操作原因..."
                  rows="2"
                ></textarea>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-secondary" @click="showCreditsModal = false">
                  取消
                </button>
                <button 
                  type="submit" 
                  class="btn-primary" 
                  :class="{ 'btn-danger': creditsForm.type === 'deduct' }"
                  :disabled="saving || !creditsForm.amount"
                >
                  {{ saving ? '处理中...' : (creditsForm.type === 'add' ? '确认充值' : '确认扣除') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Export Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showExportModal" class="modal-overlay" @click.self="showExportModal = false">
          <div class="modal-container export-modal">
            <button class="modal-close" @click="showExportModal = false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <div class="modal-header">
              <h2>导出用户数据</h2>
            </div>

            <form class="edit-form" @submit.prevent="handleExport">
              <div class="form-group">
                <label>导出格式</label>
                <div class="radio-group">
                  <label class="radio-label">
                    <input type="radio" v-model="exportForm.format" value="csv" />
                    <span>CSV</span>
                  </label>
                  <label class="radio-label">
                    <input type="radio" v-model="exportForm.format" value="json" />
                    <span>JSON</span>
                  </label>
                </div>
              </div>

              <div class="form-group">
                <label>筛选条件</label>
                <div class="export-filters">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="exportForm.includeAll" />
                    <span>导出所有用户</span>
                  </label>
                  <select v-model="exportForm.tier" :disabled="exportForm.includeAll">
                    <option value="">全部订阅</option>
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label>包含字段</label>
                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="exportForm.fields.email" />
                    <span>邮箱</span>
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="exportForm.fields.nickname" />
                    <span>昵称</span>
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="exportForm.fields.subscriptionTier" />
                    <span>订阅</span>
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="exportForm.fields.credits" />
                    <span>积分</span>
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="exportForm.fields.createdAt" />
                    <span>注册时间</span>
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="exportForm.fields.lastLoginAt" />
                    <span>最后登录</span>
                  </label>
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-secondary" @click="showExportModal = false">
                  取消
                </button>
                <button 
                  type="submit" 
                  class="btn-primary" 
                  :disabled="exporting || !hasSelectedFields"
                >
                  {{ exporting ? '导出中...' : '导出数据' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Operation Log Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showLogModal" class="modal-overlay" @click.self="showLogModal = false">
          <div class="modal-container log-modal">
            <button class="modal-close" @click="showLogModal = false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <div class="modal-header">
              <h2>操作日志</h2>
            </div>

            <div class="log-list" v-if="operationLogs.length > 0">
              <div v-for="log in operationLogs" :key="log.id" class="log-item">
                <div class="log-icon" :class="log.type">
                  <svg v-if="log.type === 'edit'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  <svg v-else-if="log.type === 'credits'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                  </svg>
                  <svg v-else-if="log.type === 'delete'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                  <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                </div>
                <div class="log-content">
                  <div class="log-text">{{ log.message }}</div>
                  <div class="log-meta">
                    <span>{{ log.admin }}</span>
                    <span>{{ formatDate(log.time) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="log-empty">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <p>暂无操作记录</p>
            </div>

            <div class="log-footer">
              <button class="btn-secondary" @click="showLogModal = false">关闭</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useApi } from '../composables/useApi'
import { useTheme } from '../composables/useTheme'

// 使用全局主题状态
const { theme } = useTheme()

const props = defineProps({
  theme: {
    type: String,
    default: 'dark'
  }
})

const emit = defineEmits(['back', 'toggle-theme'])

// 主题切换
const toggleTheme = () => {
  emit('toggle-theme')
}

const { 
  getAdminUserList, 
  getAdminStats, 
  getAdminUserById,
  updateAdminUser,
  deleteAdminUser 
} = useApi()

const loading = ref(false)
const saving = ref(false)
const users = ref([])
const stats = ref({
  totalUsers: 0,
  activeUsers: 0,
  freeUsers: 0,
  proUsers: 0,
  enterpriseUsers: 0
})

const filters = reactive({
  search: '',
  subscriptionTier: '',
  isActive: ''
})

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})

const selectedUser = ref(null)
const showDetailModal = ref(false)
const showEditModal = ref(false)
const showCreditsModal = ref(false)
const showExportModal = ref(false)
const showLogModal = ref(false)
const editForm = reactive({
  nickname: '',
  company: '',
  subscriptionTier: 'free',
  credits: 0,
  isActive: true
})

// Credits operation
const creditsForm = reactive({
  type: 'add',
  amount: null,
  reason: ''
})

// Export options
const exportForm = reactive({
  format: 'csv',
  includeAll: true,
  tier: '',
  fields: {
    email: true,
    nickname: true,
    subscriptionTier: true,
    credits: true,
    createdAt: false,
    lastLoginAt: false
  }
})
const exporting = ref(false)

// Operation logs
const operationLogs = ref([
  { id: 1, type: 'edit', message: '编辑用户 free_user@test.com 的订阅等级为 Pro', admin: 'admin@hiaeo.com', time: new Date(Date.now() - 3600000) },
  { id: 2, type: 'credits', message: '为用户 pro_user@test.com 充值 500 积分', admin: 'admin@hiaeo.com', time: new Date(Date.now() - 7200000) },
  { id: 3, type: 'delete', message: '删除用户 deleted_user@test.com', admin: 'admin@hiaeo.com', time: new Date(Date.now() - 86400000) }
])

// Chart data
const chartPeriod = ref('7d')
const chartData = ref([
  { date: '2026-05-02', value: 12 },
  { date: '2026-05-03', value: 18 },
  { date: '2026-05-04', value: 15 },
  { date: '2026-05-05', value: 25 },
  { date: '2026-05-06', value: 22 },
  { date: '2026-05-07', value: 30 },
  { date: '2026-05-08', value: 28 }
])
const chartWidth = 600
const chartHeight = 200
const padding = { top: 20, right: 20, bottom: 30, left: 50 }
const tooltip = reactive({ visible: false, x: 0, y: 0, date: '', value: 0 })

const maxValue = computed(() => Math.max(...chartData.value.map(d => d.value), 1))
const chartPoints = computed(() => {
  const width = chartWidth - padding.left - padding.right
  const height = chartHeight - padding.top - padding.bottom
  return chartData.value.map((d, i) => ({
    x: padding.left + (width / (chartData.value.length - 1)) * i,
    y: padding.top + height - (d.value / maxValue.value) * height
  }))
})
const linePath = computed(() => {
  if (chartPoints.value.length === 0) return ''
  return chartPoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
})
const areaPath = computed(() => {
  if (chartPoints.value.length === 0) return ''
  const bottomY = chartHeight - padding.bottom
  const first = chartPoints.value[0]
  const last = chartPoints.value[chartPoints.value.length - 1]
  return `${linePath.value} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`
})

const loadChartData = () => {
  // In real app, fetch from API
  if (chartPeriod.value === '7d') {
    chartData.value = [
      { date: '2026-05-02', value: 12 },
      { date: '2026-05-03', value: 18 },
      { date: '2026-05-04', value: 15 },
      { date: '2026-05-05', value: 25 },
      { date: '2026-05-06', value: 22 },
      { date: '2026-05-07', value: 30 },
      { date: '2026-05-08', value: 28 }
    ]
  } else {
    chartData.value = [
      { date: '04-09', value: 45 },
      { date: '04-14', value: 52 },
      { date: '04-19', value: 48 },
      { date: '04-24', value: 61 },
      { date: '04-29', value: 55 },
      { date: '05-04', value: 68 },
      { date: '05-09', value: 72 }
    ]
  }
}

const formatChartDate = (date) => {
  return date.slice(5)
}

const showTooltip = (index, event) => {
  const data = chartData.value[index]
  const rect = event.target.getBoundingClientRect()
  tooltip.visible = true
  tooltip.x = rect.left + 10
  tooltip.y = rect.top - 50
  tooltip.date = data.date
  tooltip.value = data.value
}

const hideTooltip = () => {
  tooltip.visible = false
}

const hasSelectedFields = computed(() => {
  return Object.values(exportForm.fields).some(v => v)
})

const totalPages = computed(() => Math.ceil(pagination.total / pagination.limit) || 1)

const loadUsers = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      limit: pagination.limit
    }
    if (filters.search) params.search = filters.search
    if (filters.subscriptionTier) params.subscriptionTier = filters.subscriptionTier
    if (filters.isActive !== '') params.isActive = filters.isActive

    const result = await getAdminUserList(params)
    users.value = result.data
    pagination.total = result.total
  } catch (error) {
    console.error('Failed to load users:', error)
    alert('加载用户列表失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    stats.value = await getAdminStats()
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

const viewUser = async (user) => {
  try {
    selectedUser.value = await getAdminUserById(user.id)
    showDetailModal.value = true
  } catch (error) {
    console.error('Failed to load user detail:', error)
    alert('加载用户详情失败')
  }
}

const editUser = (user) => {
  selectedUser.value = user
  Object.assign(editForm, {
    nickname: user.nickname || '',
    company: user.company || '',
    subscriptionTier: user.subscriptionTier || 'free',
    credits: user.credits || 0,
    isActive: user.isActive !== false
  })
  showDetailModal.value = false
  showEditModal.value = true
}

const saveUser = async () => {
  saving.value = true
  try {
    await updateAdminUser(selectedUser.value.id, editForm)
    alert('保存成功！')
    showEditModal.value = false
    loadUsers()
    loadStats()
  } catch (error) {
    console.error('Failed to save user:', error)
    alert('保存失败: ' + error.message)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (user) => {
  if (confirm(`确定要删除用户 ${user.email} 吗？此操作不可恢复！`)) {
    if (confirm('再次确认：删除后数据将无法恢复！')) {
      handleDelete(user)
    }
  }
}

const handleDelete = async (user) => {
  try {
    await deleteAdminUser(user.id)
    // Add to operation log
    operationLogs.value.unshift({
      id: Date.now(),
      type: 'delete',
      message: `删除用户 ${user.email}`,
      admin: 'admin@hiaeo.com',
      time: new Date()
    })
    alert('用户已删除')
    showDetailModal.value = false
    loadUsers()
    loadStats()
  } catch (error) {
    console.error('Failed to delete user:', error)
    alert('删除失败: ' + error.message)
  }
}

// Credits operations
const openCreditsModal = (user) => {
  selectedUser.value = user
  creditsForm.type = 'add'
  creditsForm.amount = null
  creditsForm.reason = ''
  showCreditsModal.value = true
}

const handleCreditsOperation = async () => {
  if (!creditsForm.amount || creditsForm.amount <= 0) {
    alert('请输入有效的积分数量')
    return
  }
  
  saving.value = true
  try {
    const newCredits = creditsForm.type === 'add' 
      ? selectedUser.value.credits + creditsForm.amount
      : Math.max(0, selectedUser.value.credits - creditsForm.amount)
    
    await updateAdminUser(selectedUser.value.id, { credits: newCredits })
    
    // Add to operation log
    const action = creditsForm.type === 'add' ? '充值' : '扣除'
    operationLogs.value.unshift({
      id: Date.now(),
      type: 'credits',
      message: `为用户 ${selectedUser.value.email} ${action} ${creditsForm.amount} 积分${creditsForm.reason ? '，原因：' + creditsForm.reason : ''}`,
      admin: 'admin@modelbuddy.net',
      time: new Date()
    })
    
    alert(`${action}成功！`)
    showCreditsModal.value = false
    loadUsers()
    loadStats()
  } catch (error) {
    console.error('Credits operation failed:', error)
    alert('操作失败: ' + error.message)
  } finally {
    saving.value = false
  }
}

// Export functions
const handleExport = () => {
  exporting.value = true
  
  try {
    const fields = Object.entries(exportForm.fields)
      .filter(([_, v]) => v)
      .map(([k]) => k)
    
    let data, content, filename, type
    
    if (exportForm.format === 'csv') {
      const header = fields.join(',')
      const rows = users.value.map(u => fields.map(f => {
        const val = u[f]
        return typeof val === 'string' ? `"${val}"` : (val || '')
      }).join(','))
      content = [header, ...rows].join('\n')
      filename = `users_export_${Date.now()}.csv`
      type = 'text/csv'
    } else {
      const exportData = users.value.map(u => {
        const obj = {}
        fields.forEach(f => { obj[f] = u[f] })
        return obj
      })
      content = JSON.stringify(exportData, null, 2)
      filename = `users_export_${Date.now()}.json`
      type = 'application/json'
    }
    
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    
    alert('导出成功！')
    showExportModal.value = false
  } catch (error) {
    console.error('Export failed:', error)
    alert('导出失败: ' + error.message)
  } finally {
    exporting.value = false
  }
}

const goToPage = (page) => {
  pagination.page = page
  loadUsers()
}

const getInitial = (user) => {
  const name = user.nickname || user.email || 'U'
  return name.charAt(0).toUpperCase()
}

const getTierLabel = (tier) => {
  const labels = { free: 'Free', pro: 'Pro', enterprise: 'Enterprise' }
  return labels[tier] || tier
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

onMounted(() => {
  loadUsers()
  loadStats()
})
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  padding-bottom: 40px;
}

/* Header */
.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  padding: 16px 20px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1000px;
  margin: 0 auto;
}

.back-btn,
.refresh-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover,
.refresh-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #ffffff;
}

.refresh-btn.spinning svg {
  animation: spin 1s linear infinite;
}

.theme-toggle-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.theme-toggle-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.page-title {
  font-size: 1.125rem;
  font-weight: 600;
}

/* Stats Section */
.stats-section {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-card {
  background: var(--bg-elevated, rgba(255,255,255,0.03));
  border: 1px solid var(--border-color, rgba(255,255,255,0.1));
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.total {
  background: rgba(99, 102, 241, 0.15);
  color: #4f46e5;
}

.stat-icon.active {
  background: rgba(16, 185, 129, 0.15);
  color: #059669;
}

.stat-icon.pro {
  background: rgba(245, 158, 11, 0.15);
  color: #d97706;
}

.stat-icon.enterprise {
  background: rgba(139, 92, 246, 0.15);
  color: #7c3aed;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Filters */
.filters-section {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px 20px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 200px;
  position: relative;
}

.search-box svg {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
}

.search-box input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.search-box input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.filter-group {
  display: flex;
  gap: 8px;
}

.filter-group select {
  padding: 10px 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
}

.filter-group select:focus {
  outline: none;
  border-color: var(--color-primary);
}

/* User List */
.user-list-section {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.user-list {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
}

.loading-state,
.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: var(--text-secondary);
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

/* Table */
.table-header,
.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 0.8fr 0.8fr 1fr;
  align-items: center;
  padding: 12px 16px;
}

.table-header {
  background: var(--bg-secondary);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border-color);
}

.table-row {
  border-bottom: 1px solid var(--border-color);
  transition: background 0.2s ease;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: var(--bg-primary);
}

.table-row.inactive {
  opacity: 0.6;
}

.col-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary, #6366f1), var(--color-secondary, #8b5cf6));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.75rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.subscription-badge {
  display: inline-flex;
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 6px;
}

.subscription-badge.free {
  background: rgba(107, 114, 128, 0.15);
  color: #6b7280;
}

.subscription-badge.pro {
  background: rgba(245, 158, 11, 0.15);
  color: #d97706;
}

.subscription-badge.enterprise {
  background: rgba(139, 92, 246, 0.15);
  color: #7c3aed;
}

.credits-value {
  font-weight: 600;
  color: var(--color-primary);
}

.status-badge {
  display: inline-flex;
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 6px;
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.status-badge.active {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.col-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--bg-primary);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.action-btn.danger:hover {
  border-color: #dc2626;
  color: #dc2626;
}

.action-btn.credits-btn {
  color: #059669;
}

.action-btn.credits-btn:hover {
  border-color: #059669;
  background: rgba(16, 185, 129, 0.1);
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 20px;
}

.page-btn {
  padding: 8px 16px;
  font-size: 0.875rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #ffffff;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 60px 20px;
  z-index: 1000;
  overflow-y: auto;
}

.modal-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.modal-header {
  margin-bottom: 20px;
}

.modal-header h2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  padding-right: 40px;
}

/* Detail Modal */
.detail-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-section h3 {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item label {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.detail-item span {
  font-size: 0.875rem;
  color: var(--text-primary);
}

.detail-item .mono {
  font-family: monospace;
  font-size: 0.75rem;
}

.detail-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

/* Edit Form */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-group input,
.form-group select {
  padding: 10px 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 0.9375rem;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

/* Buttons */
.btn-primary,
.btn-secondary,
.btn-danger-outline {
  flex: 1;
  padding: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--color-primary);
  border: none;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-hover, #4f46e5);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: var(--bg-elevated);
  border-color: var(--color-primary);
}

.btn-danger-outline {
  background: transparent;
  border: 1px solid #dc2626;
  color: #dc2626;
}

.btn-danger-outline:hover {
  background: #dc2626;
  color: white;
}

/* Modal Animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: translateY(-20px) scale(0.98);
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .table-header,
  .table-row {
    grid-template-columns: 1fr 1fr 0.8fr;
  }

  .col-credits,
  .col-status {
    display: none;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}

/* Chart Section */
.chart-section {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px 20px;
}

.chart-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  position: relative;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-header h3 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
}

.chart-tabs {
  display: flex;
  gap: 4px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  padding: 4px;
  border-radius: 8px;
}

.chart-tabs button {
  padding: 6px 12px;
  font-size: 0.75rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chart-tabs button.active {
  background: var(--color-primary);
  color: white;
}

.chart-container {
  position: relative;
}

.chart-svg {
  width: 100%;
  height: 200px;
}

.chart-grid-line {
  stroke: var(--border-color);
  stroke-width: 1;
  stroke-dasharray: 4;
}

.chart-area {
  fill: rgba(99, 102, 241, 0.15);
}

.chart-line {
  fill: none;
  stroke: var(--color-primary);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.chart-point {
  fill: var(--color-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.chart-point:hover {
  fill: var(--color-primary-hover, #4f46e5);
  r: 6;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  padding: 8px 50px 0;
}

.chart-label {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
}

.chart-empty {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}

.chart-tooltip {
  position: fixed;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.75rem;
  pointer-events: none;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.tooltip-date {
  color: var(--text-secondary);
  margin-bottom: 2px;
}

.tooltip-value {
  color: var(--text-primary);
}

.tooltip-value strong {
  color: var(--color-primary);
}

/* Quick Actions */
.quick-actions-section {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px 20px;
  display: flex;
  gap: 12px;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-action-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #ffffff;
}

/* Credits Modal */
.credits-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--bg-elevated);
  border-radius: 10px;
  margin-bottom: 20px;
}

.credits-user {
  font-size: 0.875rem;
  color: var(--text-primary);
}

.credits-balance {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.credits-balance strong {
  color: var(--color-primary);
  font-size: 1rem;
}

.radio-group {
  display: flex;
  gap: 16px;
}

.radio-label,
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.875rem;
}

.radio-label input,
.checkbox-label input {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary, #6366f1);
}

.form-hint {
  font-size: 0.75rem;
  color: var(--text-tertiary, #6b7280);
  margin-top: 4px;
}

textarea {
  width: 100%;
  padding: 10px 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
}

textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.btn-credits {
  flex: 1;
  padding: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  color: white;
}

.btn-credits:hover {
  background: linear-gradient(135deg, #059669, #047857);
}

.btn-danger {
  background: #ef4444 !important;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626 !important;
}

/* Export Modal */
.export-filters {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

/* Log Modal */
.log-modal {
  max-width: 600px;
}

.log-list {
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.log-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: var(--bg-elevated);
  border-radius: 10px;
}

.log-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.log-icon.edit {
  background: rgba(99, 102, 241, 0.15);
  color: #4f46e5;
}

.log-icon.credits {
  background: rgba(16, 185, 129, 0.15);
  color: #059669;
}

.log-icon.delete {
  background: rgba(239, 68, 68, 0.15);
  color: #dc2626;
}

.log-icon.info {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.log-content {
  flex: 1;
  min-width: 0;
}

.log-text {
  font-size: 0.875rem;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.log-meta {
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.log-empty {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}

.log-empty svg {
  margin-bottom: 12px;
  opacity: 0.5;
}

.log-empty p {
  margin: 0;
}

.log-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
}
</style>
