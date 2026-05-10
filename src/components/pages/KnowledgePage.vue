<template>
  <div class="knowledge-page" :data-theme="theme">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">{{ $t('knowledge.title') }}</h1>
          <span class="page-subtitle">{{ $t('knowledge.subtitle') }}</span>
          <div class="brand-tag" v-if="knowledgeData?.version">
            <span class="report-count">{{ $t('knowledge.version') }} {{ knowledgeData.version }}</span>
            <span class="last-update">{{ $t('knowledge.lastUpdate') }}: {{ formatDate(knowledgeData.updatedAt) }}</span>
          </div>
        </div>
        <div class="header-actions">
          <!-- 语言切换 -->
          <el-dropdown @command="handleLocaleChange" trigger="click">
            <button class="secondary-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              {{ currentLocaleName }}
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="zh-CN">简体中文</el-dropdown-item>
                <el-dropdown-item command="en-US">English</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <button class="secondary-btn" @click="showHistory = true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {{ $t('knowledge.versionHistory') }}
          </button>
          <button class="primary-btn" @click="saveKnowledge" :disabled="saving">
            <svg v-if="!saving" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            <span v-if="saving" class="spinner"></span>
            {{ saving ? $t('knowledge.saving') : $t('knowledge.saveKnowledge') }}
          </button>
        </div>
      </div>
    </div>

    <!-- AI智能填写区域 -->
    <div class="ai-fill-section">
      <div class="ai-fill-card">
        <div class="ai-fill-header">
          <div class="ai-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div class="ai-fill-title">
            <h3>AI智能填写</h3>
            <p>输入您的企业官网，一键自动填充品牌信息</p>
          </div>
        </div>
        <div class="ai-fill-form">
          <div class="url-input-group">
            <input 
              v-model="aiUrl" 
              type="url" 
              placeholder="请输入企业官网地址，如：https://www.example.com"
              @keyup.enter="startAiFill"
            />
            <button class="ai-fill-btn" @click="startAiFill" :disabled="aiFilling || !aiUrl">
              <span v-if="aiFilling" class="spinner"></span>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              {{ aiFilling ? '智能分析中...' : '开始AI填写' }}
            </button>
          </div>
          <div class="ai-fill-progress" v-if="aiFilling">
            <div class="progress-steps">
              <div class="step" :class="{ active: aiFillStep >= 1, completed: aiFillStep > 1 }">
                <span class="step-dot"></span>
                <span class="step-text">正在访问网站</span>
              </div>
              <div class="step" :class="{ active: aiFillStep >= 2, completed: aiFillStep > 2 }">
                <span class="step-dot"></span>
                <span class="step-text">提取企业信息</span>
              </div>
              <div class="step" :class="{ active: aiFillStep >= 3, completed: aiFillStep > 3 }">
                <span class="step-dot"></span>
                <span class="step-text">匹配附件资料</span>
              </div>
              <div class="step" :class="{ active: aiFillStep >= 4, completed: aiFillStep > 4 }">
                <span class="step-dot"></span>
                <span class="step-text">填充表单内容</span>
              </div>
            </div>
          </div>
          <div class="ai-fill-result" v-if="aiFillResult">
            <div class="result-badge" :class="aiFillResult.status">
              <svg v-if="aiFillResult.status === 'success'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {{ aiFillResult.message }}
            </div>
            <div class="result-stats" v-if="aiFillResult.stats">
              <span>已填充 {{ aiFillResult.stats.fields }} 个字段</span>
              <span>已匹配 {{ aiFillResult.stats.files }} 个附件</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 知识库表单 -->
    <div class="knowledge-content">
      <!-- 模块一：企业基础信息 -->
      <div class="section-card" :class="{ completed: isSectionCompleted('basicInfo') }">
        <div class="section-header" @click="toggleSection('basicInfo')">
          <div class="section-title-row">
            <span class="section-number">一</span>
            <h3 class="section-title">{{ $t('knowledge.modules.basicInfo.title') }}</h3>
            <span class="required-tag">{{ $t('knowledge.modules.basicInfo.required') }}</span>
          </div>
          <svg class="expand-icon" :class="{ expanded: expandedSections.basicInfo }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
        <div class="section-body" v-show="expandedSections.basicInfo">
          <div class="form-grid">
            <div class="form-group">
              <label>{{ $t('knowledge.modules.basicInfo.companyName') }} <span class="required">*</span></label>
              <input v-model="form.basicInfo.companyName" type="text" :placeholder="$t('knowledge.placeholders.enterCompanyName')" />
            </div>
            <div class="form-group">
              <label>{{ $t('knowledge.modules.basicInfo.companyShortName') }} <span class="required">*</span></label>
              <input v-model="form.basicInfo.companyShortName" type="text" :placeholder="$t('knowledge.placeholders.enterBrandName')" />
            </div>
            <div class="form-group">
              <label>{{ $t('knowledge.modules.basicInfo.industry') }} <span class="required">*</span></label>
              <input v-model="form.basicInfo.industry" type="text" :placeholder="$t('knowledge.placeholders.enterIndustry')" />
            </div>
            <div class="form-group">
              <label>{{ $t('knowledge.modules.basicInfo.companyRegion') }} <span class="required">*</span></label>
              <input v-model="form.basicInfo.companyRegion" type="text" :placeholder="$t('knowledge.placeholders.enterRegion')" />
            </div>
            <div class="form-group">
              <label>{{ $t('knowledge.modules.basicInfo.mainBizArea') }} <span class="required">*</span></label>
              <input v-model="form.basicInfo.mainBizArea" type="text" :placeholder="$t('knowledge.placeholders.enterBizArea')" />
            </div>
            <div class="form-group">
              <label>{{ $t('knowledge.modules.basicInfo.bizModel') }} <span class="required">*</span></label>
              <div class="checkbox-group">
                <label v-for="opt in bizModelOptions" :key="opt">
                  <input type="checkbox" :value="opt" v-model="form.basicInfo.bizModel" />
                  {{ getBizModelLabel(opt) }}
                </label>
              </div>
            </div>
            <div class="form-group">
              <label>{{ $t('knowledge.modules.basicInfo.companyScale') }}</label>
              <input v-model="form.basicInfo.companyScale" type="text" :placeholder="$t('knowledge.placeholders.enterScale')" />
            </div>
            <div class="form-group">
              <label>{{ $t('knowledge.modules.basicInfo.website') }} <span class="required">*</span></label>
              <input v-model="form.basicInfo.website" type="url" :placeholder="$t('knowledge.placeholders.enterWebsite')" />
            </div>
            <div class="form-group full-width">
              <label>{{ $t('knowledge.modules.basicInfo.socialMedia') }}</label>
              <textarea v-model="form.basicInfo.socialMedia" rows="2" :placeholder="$t('knowledge.placeholders.enterSocialMedia')"></textarea>
            </div>
            <div class="form-group">
              <label>{{ $t('knowledge.modules.basicInfo.contactName') }} <span class="required">*</span></label>
              <input v-model="form.basicInfo.contactName" type="text" :placeholder="$t('knowledge.placeholders.enterContactName')" />
            </div>
            <div class="form-group">
              <label>{{ $t('knowledge.modules.basicInfo.contactPhone') }} <span class="required">*</span></label>
              <input v-model="form.basicInfo.contactPhone" type="tel" :placeholder="$t('knowledge.placeholders.enterContactPhone')" />
            </div>
            <div class="form-group">
              <label>{{ $t('knowledge.modules.basicInfo.contactEmail') }}</label>
              <input v-model="form.basicInfo.contactEmail" type="email" :placeholder="$t('knowledge.placeholders.enterContactEmail')" />
            </div>
          </div>
        </div>
      </div>

      <!-- 模块二：核心业务与定位 -->
      <div class="section-card" :class="{ completed: isSectionCompleted('bizPositioning') }">
        <div class="section-header" @click="toggleSection('bizPositioning')">
          <div class="section-title-row">
            <span class="section-number">二</span>
            <h3 class="section-title">{{ $t('knowledge.modules.bizPositioning.title') }}</h3>
            <span class="required-tag">{{ $t('knowledge.modules.bizPositioning.required') }}</span>
          </div>
          <svg class="expand-icon" :class="{ expanded: expandedSections.bizPositioning }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
        <div class="section-body" v-show="expandedSections.bizPositioning">
          <div class="form-grid">
            <div class="form-group full-width">
              <label>{{ $t('knowledge.modules.bizPositioning.coreBizIntro') }} <span class="required">*</span></label>
              <input v-model="form.bizPositioning.coreBizIntro" type="text" :placeholder="$t('knowledge.placeholders.enterCoreBiz')" />
            </div>
            <div class="form-group full-width">
              <label>{{ $t('knowledge.modules.bizPositioning.targetCustomer') }} <span class="required">*</span></label>
              <textarea v-model="form.bizPositioning.targetCustomer" rows="2" :placeholder="$t('knowledge.placeholders.enterTargetCustomer')"></textarea>
            </div>
            <div class="form-group full-width">
              <label>{{ $t('knowledge.modules.bizPositioning.customerPainPoint') }} <span class="required">*</span></label>
              <textarea v-model="form.bizPositioning.customerPainPoint" rows="3" :placeholder="$t('knowledge.placeholders.enterPainPoint')"></textarea>
            </div>
            <div class="form-group full-width">
              <label>{{ $t('knowledge.modules.bizPositioning.differentialAdvantage') }} <span class="required">*</span></label>
              <textarea v-model="form.bizPositioning.differentialAdvantage" rows="3" :placeholder="$t('knowledge.placeholders.enterAdvantage')"></textarea>
            </div>
            <div class="form-group full-width">
              <label>{{ $t('knowledge.modules.bizPositioning.forbiddenBiz') }}</label>
              <textarea v-model="form.bizPositioning.forbiddenBiz" rows="2" :placeholder="$t('knowledge.placeholders.enterForbidden')"></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- 模块三：产品与服务详情 -->
      <div class="section-card" :class="{ completed: isSectionCompleted('productService') }">
        <div class="section-header" @click="toggleSection('productService')">
          <div class="section-title-row">
            <span class="section-number">三</span>
            <h3 class="section-title">{{ $t('knowledge.modules.productService.title') }}</h3>
            <span class="required-tag">{{ $t('knowledge.modules.productService.required') }}</span>
          </div>
          <svg class="expand-icon" :class="{ expanded: expandedSections.productService }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
        <div class="section-body" v-show="expandedSections.productService">
          <div class="form-grid">
            <div class="form-group full-width">
              <label>{{ $t('knowledge.modules.productService.productServiceList') }} <span class="required">*</span></label>
              <div class="table-input">
                <div class="table-header">
                  <span>{{ $t('knowledge.modules.productService.productName') }}</span>
                  <span>{{ $t('knowledge.modules.productService.productDesc') }}</span>
                  <span>{{ $t('common.buttons.delete') }}</span>
                </div>
                <div v-for="(item, idx) in form.productService.productServiceList" :key="idx" class="table-row">
                  <input v-model="item.productName" type="text" :placeholder="$t('knowledge.placeholders.enterProductName')" />
                  <input v-model="item.productDesc" type="text" :placeholder="$t('knowledge.placeholders.enterProductDesc')" />
                  <button class="remove-btn" @click="removeProduct(idx)">{{ $t('knowledge.fileUpload.remove') }}</button>
                </div>
                <button class="add-row-btn" @click="addProduct">+ {{ $t('knowledge.modules.productService.addProduct') }}</button>
              </div>
            </div>
            <div class="form-group full-width">
              <label>{{ $t('knowledge.modules.productService.productSellPoint') }} <span class="required">*</span></label>
              <textarea v-model="form.productService.productSellPoint" rows="4" :placeholder="$t('knowledge.placeholders.enterSellPoint')"></textarea>
            </div>
            <div class="form-group full-width">
              <label>{{ $t('knowledge.modules.productService.serviceDetails') }} <span class="required">*</span></label>
              <textarea v-model="form.productService.serviceDetails" rows="3" :placeholder="$t('knowledge.placeholders.enterServiceDetails')"></textarea>
            </div>
            <div class="form-group full-width">
              <label>{{ $t('knowledge.modules.productService.coreKeywords') }}</label>
              <div class="tag-input">
                <span v-for="(tag, idx) in form.productService.coreKeywords" :key="idx" class="tag">
                  {{ tag }}
                  <span class="tag-remove" @click="removeKeyword(idx)">&times;</span>
                </span>
                <input 
                  v-model="newKeyword" 
                  type="text" 
                  :placeholder="$t('knowledge.placeholders.enterKeyword')" 
                  @keydown.enter.prevent="addKeyword"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 模块四：竞品与市场信息 -->
      <div class="section-card optional" :class="{ completed: isSectionCompleted('competitorMarket') }">
        <div class="section-header" @click="toggleSection('competitorMarket')">
          <div class="section-title-row">
            <span class="section-number">四</span>
            <h3 class="section-title">{{ $t('knowledge.modules.competitorMarket.title') }}</h3>
            <span class="optional-tag">{{ $t('knowledge.modules.competitorMarket.optional') }}</span>
          </div>
          <svg class="expand-icon" :class="{ expanded: expandedSections.competitorMarket }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
        <div class="section-body" v-show="expandedSections.competitorMarket">
          <div class="form-grid">
            <div class="form-group full-width">
              <label>{{ $t('knowledge.modules.competitorMarket.competitors') }}</label>
              <div class="table-input">
                <div class="table-header">
                  <span>{{ $t('knowledge.modules.competitorMarket.competitorName') }}</span>
                  <span>{{ $t('knowledge.modules.competitorMarket.competitorWebsite') }}</span>
                  <span>{{ $t('common.buttons.delete') }}</span>
                </div>
                <div v-for="(comp, idx) in form.competitorMarket.competitors" :key="idx" class="table-row">
                  <input v-model="comp.competitorName" type="text" :placeholder="$t('knowledge.placeholders.enterCompetitorName')" />
                  <input v-model="comp.competitorWebsite" type="url" :placeholder="$t('knowledge.placeholders.enterCompetitorUrl')" />
                  <button class="remove-btn" @click="removeCompetitor(idx)">{{ $t('knowledge.fileUpload.remove') }}</button>
                </div>
                <button class="add-row-btn" @click="addCompetitor">+ {{ $t('knowledge.modules.competitorMarket.addCompetitor') }}</button>
              </div>
            </div>
            <div class="form-group full-width">
              <label>{{ $t('knowledge.modules.competitorMarket.competitorAdvDisadv') }}</label>
              <textarea v-model="form.competitorMarket.competitorAdvDisadv" rows="3" :placeholder="$t('knowledge.placeholders.enterCompetitorAnalysis')"></textarea>
            </div>
            <div class="form-group full-width">
              <label>{{ $t('knowledge.modules.competitorMarket.marketGap') }}</label>
              <textarea v-model="form.competitorMarket.marketGap" rows="3" :placeholder="$t('knowledge.placeholders.enterMarketGap')"></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- 模块五：GEO推广目标 -->
      <div class="section-card" :class="{ completed: isSectionCompleted('geoGoals') }">
        <div class="section-header" @click="toggleSection('geoGoals')">
          <div class="section-title-row">
            <span class="section-number">五</span>
            <h3 class="section-title">{{ $t('knowledge.modules.geoGoals.title') }}</h3>
            <span class="required-tag">{{ $t('knowledge.modules.geoGoals.required') }}</span>
          </div>
          <svg class="expand-icon" :class="{ expanded: expandedSections.geoGoals }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
        <div class="section-body" v-show="expandedSections.geoGoals">
          <div class="form-grid">
            <div class="form-group full-width">
              <label>{{ $t('knowledge.modules.geoGoals.promotionGoals') }} <span class="required">*</span></label>
              <div class="checkbox-group">
                <label v-for="opt in promotionGoalOptions" :key="opt">
                  <input type="checkbox" :value="opt" v-model="form.geoGoals.promotionGoals" />
                  {{ getPromotionGoalLabel(opt) }}
                </label>
              </div>
            </div>
            <div class="form-group">
              <label>{{ $t('knowledge.modules.geoGoals.keyPromotionArea') }} <span class="required">*</span></label>
              <input v-model="form.geoGoals.keyPromotionArea" type="text" :placeholder="$t('knowledge.placeholders.enterPromotionArea')" />
            </div>
            <div class="form-group">
              <label>{{ $t('knowledge.modules.geoGoals.forbiddenPromotionArea') }}</label>
              <input v-model="form.geoGoals.forbiddenPromotionArea" type="text" :placeholder="$t('knowledge.placeholders.enterForbiddenArea')" />
            </div>
            <div class="form-group full-width">
              <label>{{ $t('knowledge.modules.geoGoals.keywordDirection') }} <span class="required">*</span></label>
              <div class="checkbox-group">
                <label v-for="opt in keywordDirectionOptions" :key="opt">
                  <input type="checkbox" :value="opt" v-model="form.geoGoals.keywordDirection" />
                  {{ getKeywordDirectionLabel(opt) }}
                </label>
              </div>
            </div>
            <div class="form-group full-width">
              <label>{{ $t('knowledge.modules.geoGoals.budgetAndRhythm') }}</label>
              <textarea v-model="form.geoGoals.budgetAndRhythm" rows="2" :placeholder="$t('knowledge.placeholders.enterBudget')"></textarea>
            </div>
            <div class="form-group full-width">
              <label>{{ $t('knowledge.modules.geoGoals.expectedEffect') }}</label>
              <textarea v-model="form.geoGoals.expectedEffect" rows="2" :placeholder="$t('knowledge.placeholders.enterExpectedEffect')"></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- 模块六：资料上传区 -->
      <div class="section-card optional" :class="{ completed: isSectionCompleted('fileIndex') }">
        <div class="section-header" @click="toggleSection('fileIndex')">
          <div class="section-title-row">
            <span class="section-number">六</span>
            <h3 class="section-title">{{ $t('knowledge.modules.fileIndex.title') }}</h3>
            <span class="optional-tag">{{ $t('knowledge.modules.fileIndex.optional') }}</span>
          </div>
          <svg class="expand-icon" :class="{ expanded: expandedSections.fileIndex }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
        <div class="section-body" v-show="expandedSections.fileIndex">
          <p class="section-tip">{{ $t('knowledge.modules.fileIndex.tip') }}</p>
          <div class="file-upload-grid">
            <div class="file-upload-item">
              <h4>{{ $t('knowledge.modules.fileIndex.certFiles') }}</h4>
              <p class="file-desc">{{ $t('knowledge.modules.fileIndex.certFilesDesc') }}</p>
              <div class="file-upload-area" @click="openFilePicker('certFiles')" @dragover.prevent @drop.prevent="handleFileDrop($event, 'certFiles')">
                <input type="file" ref="certFilesInput" @change="handleFileSelect($event, 'certFiles')" accept=".pdf,.doc,.docx,.jpg,.png" multiple hidden />
                <div class="upload-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span>{{ $t('knowledge.fileUpload.clickOrDrag') }}</span>
                </div>
              </div>
              <div class="file-list" v-if="uploadedFiles.certFiles?.length">
                <div v-for="(file, idx) in uploadedFiles.certFiles" :key="idx" class="file-item">
                  <span class="file-name">{{ file.name }}</span>
                  <button class="file-remove" @click="removeFile('certFiles', idx)">&times;</button>
                </div>
              </div>
            </div>
            <div class="file-upload-item">
              <h4>{{ $t('knowledge.modules.fileIndex.productFiles') }}</h4>
              <p class="file-desc">{{ $t('knowledge.modules.fileIndex.productFilesDesc') }}</p>
              <div class="file-upload-area" @click="openFilePicker('productFiles')">
                <input type="file" ref="productFilesInput" @change="handleFileSelect($event, 'productFiles')" accept=".pdf,.doc,.docx" multiple hidden />
                <div class="upload-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span>{{ $t('knowledge.fileUpload.clickOrDrag') }}</span>
                </div>
              </div>
            </div>
            <div class="file-upload-item">
              <h4>{{ $t('knowledge.modules.fileIndex.serviceFiles') }}</h4>
              <p class="file-desc">{{ $t('knowledge.modules.fileIndex.serviceFilesDesc') }}</p>
              <div class="file-upload-area" @click="openFilePicker('serviceFiles')">
                <input type="file" ref="serviceFilesInput" @change="handleFileSelect($event, 'serviceFiles')" accept=".pdf,.doc,.docx" multiple hidden />
                <div class="upload-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span>{{ $t('knowledge.fileUpload.clickOrDrag') }}</span>
                </div>
              </div>
            </div>
            <div class="file-upload-item">
              <h4>{{ $t('knowledge.modules.fileIndex.caseFiles') }}</h4>
              <p class="file-desc">{{ $t('knowledge.modules.fileIndex.caseFilesDesc') }}</p>
              <div class="file-upload-area" @click="openFilePicker('caseFiles')">
                <input type="file" ref="caseFilesInput" @change="handleFileSelect($event, 'caseFiles')" accept=".pdf,.doc,.docx,.jpg,.png,.mp4" multiple hidden />
                <div class="upload-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span>{{ $t('knowledge.fileUpload.clickOrDrag') }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group full-width" style="margin-top: 20px;">
            <label>{{ $t('knowledge.modules.fileIndex.fileRemark') }}</label>
            <textarea v-model="form.fileIndex.fileRemark" rows="2" :placeholder="$t('knowledge.placeholders.enterFileRemark')"></textarea>
          </div>
        </div>
      </div>

      <!-- 模块七：补充信息 -->
      <div class="section-card optional" :class="{ completed: isSectionCompleted('supplement') }">
        <div class="section-header" @click="toggleSection('supplement')">
          <div class="section-title-row">
            <span class="section-number">七</span>
            <h3 class="section-title">{{ $t('knowledge.modules.supplement.title') }}</h3>
            <span class="optional-tag">{{ $t('knowledge.modules.supplement.optional') }}</span>
          </div>
          <svg class="expand-icon" :class="{ expanded: expandedSections.supplement }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
        <div class="section-body" v-show="expandedSections.supplement">
          <div class="form-grid">
            <div class="form-group full-width">
              <label>{{ $t('knowledge.modules.supplement.brandForbiddenWords') }}</label>
              <textarea v-model="form.supplement.brandForbiddenWords" rows="2" :placeholder="$t('knowledge.placeholders.enterForbiddenWords')"></textarea>
            </div>
            <div class="form-group full-width">
              <label>{{ $t('knowledge.modules.supplement.complianceRequirements') }}</label>
              <textarea v-model="form.supplement.complianceRequirements" rows="2" :placeholder="$t('knowledge.placeholders.enterCompliance')"></textarea>
            </div>
            <div class="form-group full-width">
              <label>{{ $t('knowledge.modules.supplement.previousPromotion') }}</label>
              <textarea v-model="form.supplement.previousPromotion" rows="3" :placeholder="$t('knowledge.placeholders.enterPromotionHistory')"></textarea>
            </div>
            <div class="form-group full-width">
              <label>{{ $t('knowledge.modules.supplement.specialRequirements') }}</label>
              <textarea v-model="form.supplement.specialRequirements" rows="3" :placeholder="$t('knowledge.placeholders.enterSpecialRequirements')"></textarea>
            </div>
            <div class="form-group full-width">
              <label>{{ $t('knowledge.modules.supplement.versionRemark') }}</label>
              <input v-model="form.supplement.versionRemark" type="text" :placeholder="$t('knowledge.placeholders.enterVersionRemark')" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部保存按钮 -->
    <div class="bottom-actions">
      <button class="primary-btn large" @click="saveKnowledge" :disabled="saving">
        <svg v-if="!saving" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
          <polyline points="17 21 17 13 7 13 7 21"/>
          <polyline points="7 3 7 8 15 8"/>
        </svg>
        <span v-if="saving" class="spinner"></span>
        {{ saving ? $t('knowledge.saving') : $t('knowledge.saveKnowledge') }}
      </button>
    </div>

    <!-- Toast 提示 -->
    <div class="toast" :class="{ show: toast.show }">
      {{ toast.message }}
    </div>

    <!-- 版本历史弹窗 -->
    <div class="modal-overlay" v-if="showHistory" @click.self="showHistory = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3>{{ $t('knowledge.versionHistory') }}</h3>
          <button class="close-btn" @click="showHistory = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="history-list">
            <div v-if="knowledgeData?.version" class="history-item">
              <div class="history-version">{{ $t('knowledge.version') }} {{ knowledgeData.version }}</div>
              <div class="history-time">{{ formatDate(knowledgeData.updatedAt) }}</div>
              <div class="history-remark">{{ knowledgeData.supplement?.versionRemark || $t('knowledge.history.noRemark') }}</div>
            </div>
            <div v-else class="empty-state">{{ $t('knowledge.history.noRecords') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from '../../composables/useTheme'
import { getKnowledgeBase, updateKnowledgeBase, uploadFile, getEnhancedFieldSuggestion, extractFromUrl } from '@/api/knowledge'
import { setLocale, getLocale, supportedLocales } from '@/i18n'


const { t } = useI18n()
const { theme } = useTheme()

// 表单数据
const form = reactive({
  basicInfo: {
    companyName: '',
    companyShortName: '',
    industry: '',
    companyRegion: '',
    mainBizArea: '',
    bizModel: [],
    companyScale: '',
    website: '',
    socialMedia: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  },
  bizPositioning: {
    coreBizIntro: '',
    targetCustomer: '',
    customerPainPoint: '',
    differentialAdvantage: '',
    forbiddenBiz: '',
  },
  productService: {
    productServiceList: [],
    productSellPoint: '',
    serviceDetails: '',
    coreKeywords: [],
  },
  competitorMarket: {
    competitors: [],
    competitorAdvDisadv: '',
    marketGap: '',
  },
  geoGoals: {
    promotionGoals: [],
    keyPromotionArea: '',
    forbiddenPromotionArea: '',
    keywordDirection: [],
    budgetAndRhythm: '',
    expectedEffect: '',
  },
  fileIndex: {
    fileRemark: '',
  },
  supplement: {
    brandForbiddenWords: '',
    complianceRequirements: '',
    previousPromotion: '',
    specialRequirements: '',
    versionRemark: '',
  },
})

// 已上传文件列表
const uploadedFiles = reactive({
  certFiles: [],
  productFiles: [],
  serviceFiles: [],
  caseFiles: [],
  marketingFiles: [],
})

// 选项配置
const bizModelOptions = ['B2B', 'B2C', 'localService', 'franchise']
const promotionGoalOptions = ['leads', 'exposure', 'inquiry', 'franchise', 'recruit']
const keywordDirectionOptions = ['local', 'regional', 'longTail']


function getBizModelLabel(opt) {
  return t('knowledge.bizModels.' + opt) || opt
}

function getPromotionGoalLabel(opt) {
  return t('knowledge.promotionGoals.' + opt) || opt
}

function getKeywordDirectionLabel(opt) {
  return t('knowledge.keywordDirections.' + opt) || opt
}

// AI填写相关状态
const aiFilling = ref(false)
const aiFillStep = ref(0)
const aiUrl = ref('')
const aiFillResult = ref(null)

// 其他状态
const saving = ref(false)
const aiLoading = ref(false)
const newKeyword = ref('')
const showHistory = ref(false)
const knowledgeData = ref(null)
const currentLocale = ref(getLocale())

const currentLocaleName = computed(() => {
  const locale = supportedLocales.find(l => l.code === currentLocale.value)
  return locale ? locale.name : '简体中文'
})

function handleLocaleChange(locale) {
  setLocale(locale)
  currentLocale.value = locale
}

const toast = reactive({
  show: false,
  message: '',
})

// 展开状态
const expandedSections = reactive({
  basicInfo: true,
  bizPositioning: false,
  productService: false,
  competitorMarket: false,
  geoGoals: false,
  fileIndex: false,
  supplement: false,
})

// 计算进度
const completedSections = computed(() => {
  let count = 0
  if (isSectionCompleted('basicInfo')) count++
  if (isSectionCompleted('bizPositioning')) count++
  if (isSectionCompleted('productService')) count++
  if (isSectionCompleted('competitorMarket')) count++
  if (isSectionCompleted('geoGoals')) count++
  if (isSectionCompleted('fileIndex')) count++
  if (isSectionCompleted('supplement')) count++
  return count
})

const progressPercent = computed(() => Math.round((completedSections.value / 7) * 100))

// 检查模块是否已完成
function isSectionCompleted(section) {
  switch (section) {
    case 'basicInfo':
      return form.basicInfo.companyName && form.basicInfo.website
    case 'bizPositioning':
      return form.bizPositioning.coreBizIntro && form.bizPositioning.targetCustomer
    case 'productService':
      return form.productService.productSellPoint
    case 'competitorMarket':
      return form.competitorMarket.competitors?.length > 0 || form.competitorMarket.competitorAdvDisadv
    case 'geoGoals':
      return form.geoGoals.promotionGoals?.length > 0 && form.geoGoals.keyPromotionArea
    case 'fileIndex':
      return uploadedFiles.certFiles?.length > 0 || uploadedFiles.productFiles?.length > 0
    case 'supplement':
      return form.supplement.brandForbiddenWords || form.supplement.specialRequirements
    default:
      return false
  }
}

// 展开/收起模块
function toggleSection(section) {
  expandedSections[section] = !expandedSections[section]
}

// 产品列表操作
function addProduct() {
  form.productService.productServiceList.push({ productName: '', productDesc: '' })
}

function removeProduct(idx) {
  form.productService.productServiceList.splice(idx, 1)
}

// 竞品列表操作
function addCompetitor() {
  form.competitorMarket.competitors.push({ competitorName: '', competitorWebsite: '' })
}

function removeCompetitor(idx) {
  form.competitorMarket.competitors.splice(idx, 1)
}

// 关键词操作
function addKeyword() {
  if (newKeyword.value && !form.productService.coreKeywords.includes(newKeyword.value)) {
    form.productService.coreKeywords.push(newKeyword.value)
    newKeyword.value = ''
  }
}

function removeKeyword(idx) {
  form.productService.coreKeywords.splice(idx, 1)
}

// 文件上传
function openFilePicker(module) {
  const inputMap = {
    certFiles: 'certFilesInput',
    productFiles: 'productFilesInput',
    serviceFiles: 'serviceFilesInput',
    caseFiles: 'caseFilesInput',
    marketingFiles: 'marketingFilesInput',
  }
  const ref = inputMap[module]
  if (ref) {
    const input = document.querySelector(`[ref="${ref}"]`)
    if (input) input.click()
  }
}

function handleFileSelect(event, module) {
  const files = Array.from(event.target.files)
  if (!uploadedFiles[module]) {
    uploadedFiles[module] = []
  }
  files.forEach(file => {
    uploadedFiles[module].push({
      name: file.name,
      size: file.size,
      file: file,
    })
  })
}

function handleFileDrop(event, module) {
  const files = Array.from(event.dataTransfer.files)
  if (!uploadedFiles[module]) {
    uploadedFiles[module] = []
  }
  files.forEach(file => {
    uploadedFiles[module].push({
      name: file.name,
      size: file.size,
      file: file,
    })
  })
}

function removeFile(module, idx) {
  uploadedFiles[module].splice(idx, 1)
}

// AI智能建议
async function triggerAiSuggest(field, url) {
  if (!url) {
    showToast(t('knowledge.ai.urlRequired'), 'warning')
    return
  }
  aiLoading.value = true
  try {
    // Phase 4: 调用增强的AI建议接口
    const result = await getEnhancedFieldSuggestion(field, { website: url })
    if (result?.data) {
      showToast(t('knowledge.ai.suggestionGenerated'), 'success')
      if (result.data.suggestion) {
        console.log('AI建议:', result.data)
      }
    }
  } catch (error) {
    console.error('AI建议获取失败:', error)
    showToast(t('knowledge.ai.suggestionFailed'), 'error')
  } finally {
    aiLoading.value = false
  }
}

// AI智能填写主函数 - 一键填充所有可用信息
async function startAiFill() {
  if (!aiUrl.value) {
    showToast(t('knowledge.ai.urlRequired'), 'warning')
    return
  }

  // 确保URL格式正确
  let url = aiUrl.value
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
    aiUrl.value = url
  }

  aiFilling.value = true
  aiFillStep.value = 1
  aiFillResult.value = null

  let fieldsFilled = 0
  let filesMatched = 0

  try {
    // 步骤1: 访问网站并提取信息
    aiFillStep.value = 1
    await new Promise(resolve => setTimeout(resolve, 500))

    const extractResult = await extractFromUrl(url, 'all')

    if (extractResult?.data) {
      const extracted = extractResult.data

      // 步骤2: 提取企业基本信息
      aiFillStep.value = 2
      await new Promise(resolve => setTimeout(resolve, 500))

      // 自动填充表单字段
      if (extracted.companyName) {
        form.basicInfo.companyName = extracted.companyName
        fieldsFilled++
      }
      if (extracted.companyShortName) {
        form.basicInfo.companyShortName = extracted.companyShortName
        fieldsFilled++
      }
      if (extracted.industry) {
        form.basicInfo.industry = extracted.industry
        fieldsFilled++
      }
      if (extracted.companyRegion) {
        form.basicInfo.companyRegion = extracted.companyRegion
        fieldsFilled++
      }
      if (extracted.mainBizArea) {
        form.basicInfo.mainBizArea = extracted.mainBizArea
        fieldsFilled++
      }
      if (extracted.companyScale) {
        form.basicInfo.companyScale = extracted.companyScale
        fieldsFilled++
      }
      if (extracted.website) {
        form.basicInfo.website = extracted.website
      }
      if (extracted.socialMedia) {
        form.basicInfo.socialMedia = extracted.socialMedia
        fieldsFilled++
      }
      if (extracted.contactName) {
        form.basicInfo.contactName = extracted.contactName
        fieldsFilled++
      }
      if (extracted.contactPhone) {
        form.basicInfo.contactPhone = extracted.contactPhone
        fieldsFilled++
      }
      if (extracted.contactEmail) {
        form.basicInfo.contactEmail = extracted.contactEmail
        fieldsFilled++
      }

      // 填充核心业务与定位
      if (extracted.coreBizIntro) {
        form.bizPositioning.coreBizIntro = extracted.coreBizIntro
        fieldsFilled++
      }
      if (extracted.targetCustomer) {
        form.bizPositioning.targetCustomer = extracted.targetCustomer
        fieldsFilled++
      }
      if (extracted.customerPainPoint) {
        form.bizPositioning.customerPainPoint = extracted.customerPainPoint
        fieldsFilled++
      }
      if (extracted.differentialAdvantage) {
        form.bizPositioning.differentialAdvantage = extracted.differentialAdvantage
        fieldsFilled++
      }
      if (extracted.forbiddenBiz) {
        form.bizPositioning.forbiddenBiz = extracted.forbiddenBiz
        fieldsFilled++
      }

      // 填充产品与服务
      if (extracted.productServiceList && extracted.productServiceList.length > 0) {
        form.productService.productServiceList = extracted.productServiceList
        fieldsFilled++
      }
      if (extracted.productSellPoint) {
        form.productService.productSellPoint = extracted.productSellPoint
        fieldsFilled++
      }
      if (extracted.serviceDetails) {
        form.productService.serviceDetails = extracted.serviceDetails
        fieldsFilled++
      }
      if (extracted.coreKeywords && extracted.coreKeywords.length > 0) {
        form.productService.coreKeywords = extracted.coreKeywords
        fieldsFilled++
      }

      // 填充竞品信息
      if (extracted.competitors && extracted.competitors.length > 0) {
        form.competitorMarket.competitors = extracted.competitors
        fieldsFilled++
      }
      if (extracted.competitorAdvDisadv) {
        form.competitorMarket.competitorAdvDisadv = extracted.competitorAdvDisadv
        fieldsFilled++
      }
      if (extracted.marketGap) {
        form.competitorMarket.marketGap = extracted.marketGap
        fieldsFilled++
      }

      // 填充GEO目标
      if (extracted.promotionGoals && extracted.promotionGoals.length > 0) {
        form.geoGoals.promotionGoals = extracted.promotionGoals
        fieldsFilled++
      }
      if (extracted.keyPromotionArea) {
        form.geoGoals.keyPromotionArea = extracted.keyPromotionArea
        fieldsFilled++
      }
      if (extracted.forbiddenPromotionArea) {
        form.geoGoals.forbiddenPromotionArea = extracted.forbiddenPromotionArea
        fieldsFilled++
      }
      if (extracted.keywordDirection && extracted.keywordDirection.length > 0) {
        form.geoGoals.keywordDirection = extracted.keywordDirection
        fieldsFilled++
      }
      if (extracted.budgetAndRhythm) {
        form.geoGoals.budgetAndRhythm = extracted.budgetAndRhythm
        fieldsFilled++
      }
      if (extracted.expectedEffect) {
        form.geoGoals.expectedEffect = extracted.expectedEffect
        fieldsFilled++
      }

      // 步骤3: 匹配附件
      aiFillStep.value = 3
      await new Promise(resolve => setTimeout(resolve, 500))

      if (extracted.files && extracted.files.length > 0) {
        for (const file of extracted.files) {
          if (file.type === 'cert') {
            uploadedFiles.certFiles.push({ name: file.name, url: file.url })
            filesMatched++
          } else if (file.type === 'product') {
            uploadedFiles.productFiles.push({ name: file.name, url: file.url })
            filesMatched++
          } else if (file.type === 'service') {
            uploadedFiles.serviceFiles.push({ name: file.name, url: file.url })
            filesMatched++
          } else if (file.type === 'case') {
            uploadedFiles.caseFiles.push({ name: file.name, url: file.url })
            filesMatched++
          }
        }
      }

      // 填充附件备注
      if (extracted.fileRemark) {
        form.fileIndex.fileRemark = extracted.fileRemark
      }

      // 填充补充信息
      if (extracted.brandForbiddenWords) {
        form.supplement.brandForbiddenWords = extracted.brandForbiddenWords
        fieldsFilled++
      }
      if (extracted.complianceRequirements) {
        form.supplement.complianceRequirements = extracted.complianceRequirements
        fieldsFilled++
      }
      if (extracted.previousPromotion) {
        form.supplement.previousPromotion = extracted.previousPromotion
        fieldsFilled++
      }
      if (extracted.specialRequirements) {
        form.supplement.specialRequirements = extracted.specialRequirements
        fieldsFilled++
      }

      // 步骤4: 完成
      aiFillStep.value = 4
      await new Promise(resolve => setTimeout(resolve, 500))

      aiFillResult.value = {
        status: 'success',
        message: fieldsFilled > 0 ? 'AI填写完成，请检查并修正内容' : '未找到更多可填充信息，请手动填写',
        stats: {
          fields: fieldsFilled,
          files: filesMatched
        }
      }

      showToast('AI智能填写完成，已填充 ' + fieldsFilled + ' 个字段', 'success')

      // 展开所有模块让用户检查
      Object.keys(expandedSections).forEach(key => {
        expandedSections[key] = true
      })

    } else {
      aiFillResult.value = {
        status: 'warning',
        message: '未能从网站提取到信息，请手动填写',
        stats: null
      }
      showToast(t('knowledge.ai.suggestionFailed'), 'warning')
    }

  } catch (error) {
    console.error('AI填写失败:', error)
    aiFillResult.value = {
      status: 'error',
      message: 'AI填写失败：' + (error.message || '网络错误'),
      stats: null
    }
    showToast('AI填写失败，请稍后重试或手动填写', 'error')
  } finally {
    aiFilling.value = false
    aiFillStep.value = 0
  }
}

// 从URL提取信息并智能填充
async function extractFromUrlAndFill(field, url) {
  if (!url) {
    showToast(t('knowledge.ai.urlRequired'), 'warning')
    return
  }
  aiLoading.value = true
  try {
    const result = await extractFromUrl(url, field)
    if (result?.data) {
      const { extracted, confidence } = result.data
      if (confidence > 0.7 && extracted) {
        // 高置信度时自动填充
        applyFieldValue(field, extracted)
        showToast(`已自动填充${field}，置信度${(confidence * 100).toFixed(0)}%`, 'success')
      } else {
        // 低置信度时提示用户确认
        showToast(t('knowledge.ai.suggestionGenerated'), 'info')
        console.log('提取结果:', result.data)
      }
    }
  } catch (error) {
    console.error('URL信息提取失败:', error)
    showToast(t('knowledge.ai.suggestionFailed'), 'error')
  } finally {
    aiLoading.value = false
  }
}

// 应用字段值到表单
function applyFieldValue(field, value) {
  const fieldMapping = {
    companyName: 'basicInfo.companyName',
    companyShortName: 'basicInfo.companyShortName',
    industry: 'basicInfo.industry',
    coreBizIntro: 'bizPositioning.coreBizIntro',
    targetCustomer: 'bizPositioning.targetCustomer',
  }
  
  const formPath = fieldMapping[field]
  if (formPath) {
    const parts = formPath.split('.')
    if (parts.length === 2) {
      form[parts[0]][parts[1]] = value
    }
  }
}

// 保存知识库
async function saveKnowledge() {
  saving.value = true
  try {
    // 上传文件
    for (const [module, files] of Object.entries(uploadedFiles)) {
      if (files && files.length > 0) {
        for (const fileItem of files) {
          if (fileItem.file) {
            await uploadFile(fileItem.file, module)
          }
        }
      }
    }

    // 保存表单数据
    await updateKnowledgeBase(form)
    showToast(t('knowledge.toast.saveSuccess'))
    
    // 刷新数据
    await loadKnowledge()
  } catch (error) {
    showToast(t('knowledge.toast.saveFailed'), 'error')
  } finally {
    saving.value = false
  }
}

// 加载知识库数据
async function loadKnowledge() {
  try {
    const res = await getKnowledgeBase()
    if (res.data) {
      knowledgeData.value = res.data
      const data = res.data
      
      // 填充表单
      if (data.basicInfo) Object.assign(form.basicInfo, data.basicInfo)
      if (data.bizPositioning) Object.assign(form.bizPositioning, data.bizPositioning)
      if (data.productService) Object.assign(form.productService, data.productService)
      if (data.competitorMarket) Object.assign(form.competitorMarket, data.competitorMarket)
      if (data.geoGoals) Object.assign(form.geoGoals, data.geoGoals)
      if (data.fileIndex) Object.assign(form.fileIndex, data.fileIndex)
      if (data.supplement) Object.assign(form.supplement, data.supplement)
      
      // 填充已上传文件
      if (data.fileIndex) {
        for (const [module, files] of Object.entries(data.fileIndex)) {
          if (module !== 'fileRemark' && Array.isArray(files)) {
            uploadedFiles[module] = files.map(f => ({ name: f.name, url: f.url }))
          }
        }
      }
    }
  } catch (error) {
    console.error(t('knowledge.toast.loadFailed'), error)
  }
}

// Toast提示
function showToast(message, type = 'success') {
  toast.message = message
  toast.show = true
  setTimeout(() => { toast.show = false }, 3000)
}

// 格式化日期
function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 初始化
onMounted(() => {
  loadKnowledge()
})
</script>

<style scoped>
.knowledge-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-bottom: 40px;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1600px;
  margin: 0 auto;
  gap: 20px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.page-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.brand-tag {
  display: flex;
  align-items: center;
  gap: 8px;
}

.report-count {
  font-size: 0.75rem;
  color: var(--color-primary);
  background: rgba(99, 102, 241, 0.12);
  padding: 2px 8px;
  border-radius: 4px;
}

.last-update {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.header-actions {
  display: flex;
  gap: 8px;
}

/* Buttons */
.primary-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.primary-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.primary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.primary-btn.large {
  padding: 14px 48px;
  font-size: 16px;
}

.secondary-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.secondary-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* AI智能填写区域 */
.ai-fill-section {
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px;
}

.ai-fill-card {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.08));
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 20px;
  padding: 28px;
}

.ai-fill-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
}

.ai-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  border-radius: 14px;
  color: white;
  flex-shrink: 0;
}

.ai-fill-title h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px;
}

.ai-fill-title p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.ai-fill-form {
  background: var(--bg-elevated);
  border-radius: 16px;
  padding: 24px;
}

.url-input-group {
  display: flex;
  gap: 12px;
}

.url-input-group input {
  flex: 1;
  padding: 14px 18px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.2s;
}

.url-input-group input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.url-input-group input::placeholder {
  color: var(--text-secondary);
}

.ai-fill-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
  white-space: nowrap;
}

.ai-fill-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
}

.ai-fill-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* AI填写进度 */
.ai-fill-progress {
  margin-top: 24px;
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: 12px;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.progress-steps::before {
  content: '';
  position: absolute;
  top: 12px;
  left: 24px;
  right: 24px;
  height: 2px;
  background: var(--border-color);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.step-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--bg-elevated);
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.step.active .step-dot {
  background: var(--color-primary);
  border-color: var(--color-primary);
  animation: pulse 1.5s infinite;
}

.step.completed .step-dot {
  background: var(--color-success);
  border-color: var(--color-success);
}

.step.completed .step-dot::after {
  content: '';
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}

.step-text {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  transition: color 0.3s;
}

.step.active .step-text,
.step.completed .step-text {
  color: var(--text-primary);
  font-weight: 500;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(99, 102, 241, 0); }
}

/* AI填写结果 */
.ai-fill-result {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
}

.result-badge.success {
  background: rgba(34, 197, 94, 0.12);
  color: var(--color-success);
}

.result-badge.warning {
  background: rgba(234, 179, 8, 0.12);
  color: #ca8a04;
}

.result-badge.error {
  background: rgba(239, 68, 68, 0.12);
  color: var(--color-danger);
}

.result-stats {
  display: flex;
  gap: 16px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.result-stats span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.result-stats span::before {
  content: '';
  width: 6px;
  height: 6px;
  background: var(--color-primary);
  border-radius: 50%;
}

/* 进度指示器 */
.progress-indicator {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 24px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.progress-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
  white-space: nowrap;
  min-width: 100px;
}

/* 知识库内容区域 */
.knowledge-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 24px 24px;
}

/* 区块卡片 */
.section-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  margin-bottom: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.section-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
}

.section-card.completed {
  border-left: 3px solid var(--color-success);
}

.section-card.optional {
  border-left: 3px solid var(--border-color);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  cursor: pointer;
  user-select: none;
}

.section-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-number {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 600;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.required-tag {
  font-size: 12px;
  color: var(--color-danger);
  background: rgba(239, 68, 68, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
}

.optional-tag {
  font-size: 12px;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: 2px 8px;
  border-radius: 10px;
}

.expand-icon {
  color: var(--text-secondary);
  transition: transform 0.2s ease;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.section-body {
  padding: 0 24px 24px;
}

.section-tip {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 16px;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

/* 表单网格 */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
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
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.form-group .required {
  color: var(--color-danger);
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 10px 14px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* 复选框组 */
.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-weight: normal;
  font-size: 14px;
  color: var(--text-primary);
}

.checkbox-group input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary);
}

/* 输入+按钮组合 */
.input-with-action {
  display: flex;
  gap: 8px;
}

.input-with-action input {
  flex: 1;
}

.ai-btn {
  padding: 10px 16px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.ai-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
}

.ai-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 表格输入 */
.table-input {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 80px;
  gap: 8px;
  padding: 10px 12px;
  background: var(--bg-secondary);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 80px;
  gap: 8px;
  padding: 8px 12px;
  border-top: 1px solid var(--border-color);
  align-items: center;
}

.table-row input {
  padding: 8px 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 13px;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.table-row input:focus {
  border-color: var(--color-primary);
  outline: none;
}

.remove-btn {
  padding: 6px 12px;
  background: none;
  border: 1px solid var(--color-danger);
  color: var(--color-danger);
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: var(--color-danger);
  color: white;
}

.add-row-btn {
  width: 100%;
  padding: 10px;
  background: none;
  border: none;
  border-top: 1px solid var(--border-color);
  color: var(--color-primary);
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.add-row-btn:hover {
  background: var(--bg-secondary);
}

/* 标签输入 */
.tag-input {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  min-height: 44px;
  background: var(--bg-primary);
}

.tag-input .tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--color-primary);
  color: white;
  border-radius: 16px;
  font-size: 13px;
}

.tag-input .tag-remove {
  cursor: pointer;
  opacity: 0.7;
  font-size: 14px;
}

.tag-input .tag-remove:hover {
  opacity: 1;
}

.tag-input input {
  flex: 1;
  min-width: 120px;
  border: none;
  padding: 4px;
  font-size: 14px;
  background: transparent;
  color: var(--text-primary);
}

.tag-input input:focus {
  outline: none;
}

/* 文件上传 */
.file-upload-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.file-upload-item h4 {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--text-primary);
}

.file-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0 0 12px;
}

.file-upload-area {
  padding: 24px;
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.file-upload-area:hover {
  border-color: var(--color-primary);
  background: var(--bg-secondary);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
}

.upload-placeholder svg {
  opacity: 0.5;
}

.file-list {
  margin-top: 8px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  background: var(--bg-secondary);
  border-radius: 6px;
  margin-bottom: 4px;
  font-size: 13px;
}

.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-primary);
}

.file-remove {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 16px;
  transition: color 0.2s;
}

.file-remove:hover {
  color: var(--color-danger);
}

/* 底部保存按钮 */
.bottom-actions {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 24px 24px;
  text-align: center;
  margin-top: 24px;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  padding: 12px 24px;
  background: var(--text-primary);
  color: var(--bg-primary);
  border-radius: 8px;
  font-size: 14px;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 1000;
}

.toast.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: var(--shadow-card);
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
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.modal-body {
  padding: 20px 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.history-item {
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
  margin-bottom: 12px;
}

.history-version {
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 4px;
}

.history-time {
  font-size: 13px;
  color: var(--text-secondary);
}

.history-remark {
  margin-top: 8px;
  font-size: 14px;
  color: var(--text-primary);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px;
  color: var(--text-secondary);
  text-align: center;
}

/* Loading spinner */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 响应式 */
@media (max-width: 1024px) {
  .file-upload-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .ai-diagnosis-panel {
    position: static;
    float: none;
    width: 100%;
    margin-bottom: 24px;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    flex-wrap: wrap;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .file-upload-grid {
    grid-template-columns: 1fr;
  }
  
  .progress-card {
    flex-direction: column;
    align-items: stretch;
  }
  
  .progress-text {
    text-align: center;
  }
}

/* Light theme specific styles */
[data-theme="light"] .section-card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

[data-theme="light"] .progress-card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

[data-theme="light"] .modal-container {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

[data-theme="light"] .ai-btn {
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.25);
}

[data-theme="light"] .ai-btn:hover {
  box-shadow: 0 6px 16px rgba(22, 93, 255, 0.35);
}
</style>
