<template>
  <div class="strategy-page">
    <div class="page-header">
      <h1 class="page-title">策略生成</h1>
      <el-button type="primary" @click="showGenerateDialog = true">
        <el-icon><Plus /></el-icon>
        生成策略
      </el-button>
    </div>

    <!-- 策略列表 -->
    <div class="strategy-list" v-loading="loading">
      <el-empty v-if="!strategies.length && !loading" description="暂无策略" />
      
      <el-card 
        v-for="strategy in strategies" 
        :key="strategy.id" 
        class="strategy-card"
        shadow="hover"
      >
        <template #header>
          <div class="card-header">
            <span class="strategy-title">{{ strategy.title }}</span>
            <el-tag :type="getTypeTagType(strategy.type)">{{ getTypeLabel(strategy.type) }}</el-tag>
          </div>
        </template>
        
        <div class="strategy-content">
          <p class="strategy-description">{{ strategy.description }}</p>
          
          <div class="strategy-meta">
            <span class="meta-item">
              <el-icon><Clock /></el-icon>
              {{ formatDate(strategy.createdAt) }}
            </span>
            <span class="meta-item">
              <el-icon><User /></el-icon>
              {{ strategy.creatorName }}
            </span>
          </div>
        </div>
        
        <template #footer>
          <div class="card-actions">
            <el-button size="small" @click="viewStrategy(strategy)">查看</el-button>
            <el-button size="small" type="primary" @click="applyStrategy(strategy)">应用</el-button>
            <el-dropdown @command="(cmd) => handleCommand(cmd, strategy)">
              <el-button size="small">
                <el-icon><More /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="edit">编辑</el-dropdown-item>
                  <el-dropdown-item command="copy">复制</el-dropdown-item>
                  <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-card>
    </div>

    <!-- 分页 -->
    <div class="pagination-wrapper" v-if="total > 0">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 生成策略对话框 -->
    <el-dialog
      v-model="showGenerateDialog"
      title="生成策略"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="generateFormRef"
        :model="generateForm"
        :rules="generateRules"
        label-width="100px"
      >
        <el-form-item label="策略类型" prop="type">
          <el-select v-model="generateForm.type" placeholder="请选择策略类型">
            <el-option label="FAQ策略" value="faq" />
            <el-option label="产品文案" value="product_copy" />
            <el-option label="竞品对比" value="competitor" />
            <el-option label="新闻动态" value="news" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="品牌" prop="brandId">
          <el-select v-model="generateForm.brandId" placeholder="请选择品牌">
            <el-option
              v-for="brand in brandList"
              :key="brand.id"
              :label="brand.name"
              :value="brand.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="产品" prop="product">
          <el-input v-model="generateForm.product" placeholder="请输入产品名称" />
        </el-form-item>
        
        <el-form-item label="关键词" prop="keywords">
          <el-select
            v-model="generateForm.keywords"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入关键词"
          >
            <el-option
              v-for="keyword in keywordOptions"
              :key="keyword"
              :label="keyword"
              :value="keyword"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="语气风格" prop="tone">
          <el-radio-group v-model="generateForm.tone">
            <el-radio label="professional">专业</el-radio>
            <el-radio label="friendly">友好</el-radio>
            <el-radio label="humorous">幽默</el-radio>
            <el-radio label="authoritative">权威</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="生成数量" prop="count">
          <el-slider v-model="generateForm.count" :min="1" :max="10" show-stops />
        </el-form-item>
        
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="generateForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showGenerateDialog = false">取消</el-button>
        <el-button type="primary" :loading="generating" @click="handleGenerate">
          生成
        </el-button>
      </template>
    </el-dialog>

    <!-- 策略详情对话框 -->
    <el-dialog
      v-model="showDetailDialog"
      title="策略详情"
      width="800px"
    >
      <div v-if="currentStrategy" class="strategy-detail">
        <h3>{{ currentStrategy.title }}</h3>
        <el-divider />
        <div class="detail-content" v-html="currentStrategy.content"></div>
      </div>
      
      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
        <el-button type="primary" @click="copyStrategyContent">复制内容</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Clock, User, More } from '@element-plus/icons-vue'
import { strategyApi } from '@/api/strategy'
import { brandApi } from '@/api/brand'

// 响应式数据
const loading = ref(false)
const generating = ref(false)
const strategies = ref<any[]>([])
const brandList = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框状态
const showGenerateDialog = ref(false)
const showDetailDialog = ref(false)
const currentStrategy = ref<any>(null)

// 表单引用
const generateFormRef = ref<FormInstance>()

// 生成表单
const generateForm = reactive({
  type: 'faq',
  brandId: '',
  product: '',
  keywords: [] as string[],
  tone: 'professional',
  count: 3,
  remark: ''
})

// 表单验证规则
const generateRules: FormRules = {
  type: [{ required: true, message: '请选择策略类型', trigger: 'change' }],
  brandId: [{ required: true, message: '请选择品牌', trigger: 'change' }],
  product: [{ required: true, message: '请输入产品名称', trigger: 'blur' }]
}

// 关键词选项
const keywordOptions = ref(['品质', '服务', '价格', '创新', '环保', '健康'])

// 获取策略列表
const fetchStrategies = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value
    }
    const res = await strategyApi.list(params)
    strategies.value = res.data.list
    total.value = res.data.total
  } catch (error: any) {
    ElMessage.error(error.message || '获取策略列表失败')
  } finally {
    loading.value = false
  }
}

// 获取品牌列表
const fetchBrands = async () => {
  try {
    const res = await brandApi.list()
    brandList.value = res.data
  } catch (error: any) {
    ElMessage.error(error.message || '获取品牌列表失败')
  }
}

// 生成策略
const handleGenerate = async () => {
  if (!generateFormRef.value) return
  
  await generateFormRef.value.validate(async (valid) => {
    if (valid) {
      generating.value = true
      try {
        await strategyApi.generate(generateForm)
        ElMessage.success('策略生成成功')
        showGenerateDialog.value = false
        fetchStrategies()
        // 重置表单
        generateFormRef.value?.resetFields()
      } catch (error: any) {
        ElMessage.error(error.message || '策略生成失败')
      } finally {
        generating.value = false
      }
    }
  })
}

// 查看策略
const viewStrategy = (strategy: any) => {
  currentStrategy.value = strategy
  showDetailDialog.value = true
}

// 应用策略
const applyStrategy = async (strategy: any) => {
  try {
    await strategyApi.execute(strategy.id)
    ElMessage.success('策略应用成功')
    fetchStrategies()
  } catch (error: any) {
    ElMessage.error(error.message || '策略应用失败')
  }
}

// 复制策略内容
const copyStrategyContent = async () => {
  if (!currentStrategy.value) return
  try {
    await navigator.clipboard.writeText(currentStrategy.value.content)
    ElMessage.success('内容已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败')
  }
}

// 操作命令处理
const handleCommand = async (command: string, strategy: any) => {
  switch (command) {
    case 'edit':
      // TODO: 编辑策略
      ElMessage.info('编辑功能开发中')
      break
    case 'copy':
      try {
        await navigator.clipboard.writeText(strategy.content)
        ElMessage.success('内容已复制')
      } catch {
        ElMessage.error('复制失败')
      }
      break
    case 'delete':
      try {
        await ElMessageBox.confirm('确定要删除该策略吗?', '提示', {
          type: 'warning'
        })
        await strategyApi.delete(strategy.id)
        ElMessage.success('删除成功')
        fetchStrategies()
      } catch (error: any) {
        if (error !== 'cancel') {
          ElMessage.error(error.message || '删除失败')
        }
      }
      break
  }
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchStrategies()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchStrategies()
}

// 工具函数
const getTypeTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    faq: 'primary',
    product_copy: 'success',
    competitor: 'warning',
    news: 'info'
  }
  return typeMap[type] || 'info'
}

const getTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    faq: 'FAQ策略',
    product_copy: '产品文案',
    competitor: '竞品对比',
    news: '新闻动态'
  }
  return labelMap[type] || type
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

// 生命周期
onMounted(() => {
  fetchStrategies()
  fetchBrands()
})
</script>

<style scoped lang="scss">
.strategy-page {
  padding: 20px;
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .page-title {
      font-size: 24px;
      font-weight: 600;
      margin: 0;
    }
  }
  
  .strategy-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
    
    .strategy-card {
      transition: transform 0.2s, box-shadow 0.2s;
      
      &:hover {
        transform: translateY(-2px);
      }
      
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .strategy-title {
          font-weight: 600;
          font-size: 16px;
        }
      }
      
      .strategy-content {
        .strategy-description {
          color: #666;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
        
        .strategy-meta {
          display: flex;
          gap: 16px;
          font-size: 12px;
          color: #999;
          
          .meta-item {
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }
      }
      
      .card-actions {
        display: flex;
        gap: 8px;
      }
    }
  }
  
  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
  
  .strategy-detail {
    h3 {
      margin: 0 0 16px;
      font-size: 18px;
    }
    
    .detail-content {
      line-height: 1.8;
      color: #333;
      
      :deep(p) {
        margin-bottom: 12px;
      }
    }
  }
}
</style>
