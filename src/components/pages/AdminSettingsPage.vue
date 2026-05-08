<template>
  <div class="admin-settings">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">系统设置</h1>
      </div>
    </div>

    <div class="settings-content">
      <div class="settings-nav">
        <button v-for="s in sections" :key="s.id" :class="{ active: section === s.id }" @click="section = s.id">
          {{ s.label }}
        </button>
      </div>

      <div class="settings-panel">
        <!-- General Settings -->
        <div v-if="section === 'general'" class="settings-section">
          <h2 class="section-title">通用设置</h2>
          <div class="form-group">
            <label>平台名称</label>
            <input v-model="settings.platformName" type="text" />
          </div>
          <div class="form-group">
            <label>平台 Logo</label>
            <div class="upload-area">
              <div class="upload-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span>点击上传 Logo</span>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>联系邮箱</label>
            <input v-model="settings.contactEmail" type="email" />
          </div>
          <button class="primary-btn" @click="saveGeneral">保存设置</button>
        </div>

        <!-- AI Engines -->
        <div v-if="section === 'engines'" class="settings-section">
          <h2 class="section-title">AI 引擎配置</h2>
          <div v-for="eng in engineSettings" :key="eng.id" class="engine-config-card">
            <div class="engine-config-header">
              <span class="engine-name">{{ eng.name }}</span>
              <label class="toggle">
                <input type="checkbox" v-model="eng.enabled" />
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="engine-config-fields">
              <div class="form-group">
                <label>API Key</label>
                <input v-model="eng.apiKey" type="password" placeholder="sk-..." />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>API Key 2 (可选)</label>
                  <input v-model="eng.apiKey2" type="password" placeholder="sk-..." />
                </div>
                <div class="form-group">
                  <label>API Key 3 (可选)</label>
                  <input v-model="eng.apiKey3" type="password" placeholder="sk-..." />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Base URL</label>
                  <input v-model="eng.baseUrl" type="text" placeholder="https://api.example.com" />
                </div>
                <div class="form-group">
                  <label>模型名称</label>
                  <input v-model="eng.model" type="text" placeholder="gpt-4" />
                </div>
              </div>
            </div>
          </div>
          <button class="primary-btn" @click="saveEngines">保存引擎配置</button>
        </div>

        <!-- Pricing -->
        <div v-if="section === 'pricing'" class="settings-section">
          <h2 class="section-title">套餐与定价</h2>
          <div class="pricing-cards">
            <div v-for="plan in pricingPlans" :key="plan.id" class="pricing-card">
              <div class="plan-name">{{ plan.name }}</div>
              <div class="plan-price">¥{{ plan.price }}<span>/月</span></div>
              <div class="plan-credits">{{ plan.credits }} 积分/月</div>
              <ul class="plan-features">
                <li v-for="f in plan.features" :key="f">{{ f }}</li>
              </ul>
              <button class="secondary-btn small" @click="editPlan(plan)">编辑</button>
            </div>
          </div>
        </div>

        <!-- System -->
        <div v-if="section === 'system'" class="settings-section">
          <h2 class="section-title">系统信息</h2>
          <div class="system-info">
            <div class="info-row"><span>系统版本</span><span>v1.0.0</span></div>
            <div class="info-row"><span>Node.js</span><span>v20.x</span></div>
            <div class="info-row"><span>数据库</span><span>PostgreSQL 15</span></div>
            <div class="info-row"><span>运行时</span><span>NestJS</span></div>
            <div class="info-row"><span>前端框架</span><span>Vue 3</span></div>
          </div>
          <div class="danger-zone">
            <h3>危险操作</h3>
            <button class="danger-btn">重置数据库</button>
            <button class="danger-btn">清除缓存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const section = ref('general')

const sections = [
  { id: 'general', label: '通用设置' },
  { id: 'engines', label: 'AI 引擎' },
  { id: 'pricing', label: '套餐定价' },
  { id: 'system', label: '系统信息' }
]

const settings = ref({
  platformName: '魔鲸 Geo',
  contactEmail: 'admin@hiaeo.com'
})

const engineSettings = ref([
  { id: 'deepseek', name: 'DeepSeek', enabled: true, apiKey: '', apiKey2: '', apiKey3: '', baseUrl: 'https://api.deepseek.com', model: 'deepseek-chat' },
  { id: 'kimi', name: 'Kimi', enabled: true, apiKey: '', apiKey2: '', apiKey3: '', baseUrl: 'https://api.moonshot.cn', model: 'moonshot-v1-8k' },
  { id: 'qwen', name: '通义千问', enabled: false, apiKey: '', apiKey2: '', apiKey3: '', baseUrl: 'https://dashscope.aliyuncs.com', model: 'qwen-turbo' }
])

const pricingPlans = ref([
  { id: 'free', name: 'Free', price: 0, credits: 500, features: ['500 积分/月', '3 次诊断', '基础报告'] },
  { id: 'pro', name: 'Pro', price: 299, credits: 5000, features: ['5000 积分/月', '无限诊断', '详细报告', '竞品分析'] },
  { id: 'enterprise', name: 'Enterprise', price: 999, credits: 20000, features: ['20000 积分/月', '无限诊断', '完整报告', 'API 访问', '专属支持'] }
])

const saveGeneral = () => { alert('通用设置已保存') }
const saveEngines = () => { alert('引擎配置已保存') }
const editPlan = (plan) => { console.log('edit plan', plan.id) }
</script>

<style scoped>
.admin-settings { min-height: 100vh; padding-bottom: 40px; background: var(--bg-primary); }
.page-header { position: sticky; top: 0; z-index: 50; background: var(--bg-primary); border-bottom: 1px solid var(--border-color); padding: 16px 24px; }
.header-content { max-width: 1400px; margin: 0 auto; }
.page-title { font-size: 1.25rem; font-weight: 700; }

.settings-content { max-width: 1200px; margin: 0 auto; padding: 24px; display: grid; grid-template-columns: 220px 1fr; gap: 24px; }
@media (max-width: 768px) { .settings-content { grid-template-columns: 1fr; } }
.settings-nav { display: flex; flex-direction: column; gap: 4px; }
.settings-nav button { padding: 10px 14px; text-align: left; background: transparent; border: none; border-radius: 10px; font-size: 0.875rem; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
.settings-nav button:hover { background: var(--bg-elevated); color: var(--text-primary); }
.settings-nav button.active { background: var(--color-primary); color: white; }

.settings-panel { background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: 16px; padding: 28px; }
.settings-section { display: flex; flex-direction: column; gap: 20px; }
.section-title { font-size: 1rem; font-weight: 700; color: var(--text-primary); padding-bottom: 16px; border-bottom: 1px solid var(--border-color); }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 0.875rem; font-weight: 600; }
.form-group input { padding: 10px 14px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 10px; font-size: 0.875rem; color: var(--text-primary); outline: none; }
.form-group input:focus { border-color: var(--color-primary); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.upload-area { border: 2px dashed var(--border-color); border-radius: 12px; padding: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: border-color 0.2s; }
.upload-area:hover { border-color: var(--color-primary); }
.upload-placeholder { display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--text-secondary); font-size: 0.875rem; }

.engine-config-card { background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; }
.engine-config-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.engine-name { font-size: 0.9375rem; font-weight: 700; color: var(--text-primary); }
.engine-config-fields { display: flex; flex-direction: column; gap: 12px; }

.toggle { position: relative; display: inline-block; width: 44px; height: 24px; }
.toggle input { opacity: 0; width: 0; height: 0; }
.toggle-slider { position: absolute; cursor: pointer; inset: 0; background: var(--border-color); border-radius: 12px; transition: 0.3s; }
.toggle-slider::before { content: ''; position: absolute; height: 18px; width: 18px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.3s; }
.toggle input:checked + .toggle-slider { background: var(--color-primary); }
.toggle input:checked + .toggle-slider::before { transform: translateX(20px); }

.pricing-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.pricing-card { background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
.plan-name { font-size: 1rem; font-weight: 700; color: var(--text-primary); }
.plan-price { font-size: 2rem; font-weight: 900; color: var(--text-primary); }
.plan-price span { font-size: 0.875rem; font-weight: 400; color: var(--text-secondary); }
.plan-credits { font-size: 0.875rem; color: var(--color-primary); }
.plan-features { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
.plan-features li { font-size: 0.8125rem; color: var(--text-secondary); padding-left: 16px; position: relative; }
.plan-features li::before { content: '✓'; position: absolute; left: 0; color: #059669; }
.secondary-btn.small { padding: 8px 12px; background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.8125rem; cursor: pointer; color: var(--text-primary); margin-top: auto; }

.system-info { display: flex; flex-direction: column; gap: 12px; }
.info-row { display: flex; justify-content: space-between; padding: 12px 16px; background: var(--bg-primary); border-radius: 8px; font-size: 0.875rem; }
.info-row span:first-child { color: var(--text-secondary); }
.info-row span:last-child { font-weight: 600; color: var(--text-primary); }

.danger-zone { margin-top: 16px; padding: 16px; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; }
.danger-zone h3 { font-size: 0.875rem; font-weight: 600; color: #dc2626; margin-bottom: 12px; }
.danger-btn { padding: 8px 14px; background: rgba(239, 68, 68, 0.15); color: #dc2626; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; font-size: 0.8125rem; cursor: pointer; margin-right: 8px; }

.primary-btn { padding: 10px 20px; background: var(--color-primary); color: white; border: none; border-radius: 10px; font-size: 0.875rem; font-weight: 600; cursor: pointer; width: fit-content; }
</style>
