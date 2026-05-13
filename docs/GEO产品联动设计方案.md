# GEO 产品联动设计方案

## 一、总体架构

### 1.1 核心流程
```
品牌智库 → AI诊断 → 策略生成 → 内容发布
   ↓           ↓          ↓          ↓
  必填完成    用户确认   用户确认    用户确认
   ↓           ↓          ↓          ↓
点亮诊断按钮  点亮策略  点亮执行按钮  完成发布
```

### 1.2 状态机设计

每个模块有 3 个关键状态：
- `state`：模块进度状态（DRAFT/READY/PROCESSING/COMPLETED/ERROR）
- `confirmed`：用户是否确认（boolean）
- `dataId`：关联数据ID

```typescript
interface ModuleStatus {
  state: ModuleState;      // DRAFT | READY | PROCESSING | COMPLETED | ERROR
  confirmed: boolean;      // 用户是否确认
  dataId?: string;         // 关联的数据ID
  updatedAt?: string;
}

// BrandWorkflowState 扩展
interface BrandWorkflowState {
  knowledge: ModuleStatus;      // 品牌智库
  diagnosis: ModuleStatus;       // AI诊断报告
  strategy: ModuleStatus;        // GEO优化策略
  execution: ModuleStatus;       // 内容执行
  monitor: ModuleStatus;         // 效果监控
  updatedAt?: string;
}
```

### 1.3 任务队列机制（防过载）

```typescript
class WorkflowTaskQueue {
  private queue: WorkflowTask[] = [];
  private isExecuting = false;
  private currentTask: WorkflowTask | null = null;

  // 添加任务（自动排队，不并行）
  async enqueue(task: WorkflowTask): Promise<TaskResult>;

  // 执行下一个任务
  private async processNext(): Promise<void>;
}
```

## 二、详细流程设计

### 2.1 品牌智库（Knowledge）

**前置条件**：无

**AI 自动填充流程**：
1. 用户输入公司名称
2. 调用企查查 API 获取企业基础信息（模块1）
3. 调用大模型（DeepSeek/豆包）分析并补全其他模块
4. 显示填充进度
5. 用户可修改后保存

**完成条件**：
- 模块1（企业基础信息）：必填项全部填写
- 模块完成度进度条 = 100%
- 点亮"开始 AI 诊断"按钮

**状态变更**：
- 开始填充：`knowledge.state = PROCESSING`
- 填充完成：`knowledge.state = COMPLETED`
- 点亮诊断按钮：`diagnosis.state = READY`

### 2.2 AI 诊断报告（Diagnosis）

**前置条件**：`knowledge.state === COMPLETED`

**诊断流程**：
1. 用户点击"开始 AI 诊断"
2. 显示诊断进度（7维度分析）
3. 诊断完成，显示报告预览
4. **用户确认**诊断报告
5. 点亮"启动 AI 优化建议"按钮

**用户确认机制**：
- 诊断完成后，`diagnosis.confirmed = false`
- 用户可选择：
  - 确认：更新 `diagnosis.confirmed = true`，点亮策略按钮
  - 重新诊断：修改参数，再次诊断

**状态变更**：
- 开始诊断：`diagnosis.state = PROCESSING`
- 诊断完成：`diagnosis.state = COMPLETED`，`diagnosis.dataId = 报告ID`
- 用户确认：`diagnosis.confirmed = true`
- 点亮策略：`strategy.state = READY`

### 2.3 GEO 优化策略（Strategy）

**前置条件**：`diagnosis.state === COMPLETED && diagnosis.confirmed === true`

**策略生成流程**：
1. 用户点击"启动 AI 优化建议"
2. AI 根据诊断报告生成优化策略
3. 显示策略列表（可分类：内容/关键词/竞品/技术）
4. **用户确认**优化策略
5. 点亮"开启 AI GEO 优化执行"按钮

**用户确认机制**：
- 策略生成后，`strategy.confirmed = false`
- 用户可选择：
  - 确认：更新 `strategy.confirmed = true`，点亮执行按钮
  - 调整：修改参数，再次生成

**状态变更**：
- 开始生成：`strategy.state = PROCESSING`
- 生成完成：`strategy.state = COMPLETED`，`strategy.dataId = 策略ID`
- 用户确认：`strategy.confirmed = true`
- 点亮执行：`execution.state = READY`

### 2.4 内容发布（Content/Execution）

**前置条件**：`strategy.state === COMPLETED && strategy.confirmed === true`

**内容发布流程**：
1. 用户点击"开启 AI GEO 优化执行"
2. 第一步：生成文章（基于品牌智库 + 诊断报告 + 策略）
3. 用户确认文章
4. 第二步：发布到目标平台
5. **用户确认**发布
6. 完成闭环

**数据输入**：
- 品牌智库数据：`knowledge.dataId` → 获取完整智库
- 诊断报告：`diagnosis.dataId` → 获取7维度分析
- 优化策略：`strategy.dataId` → 获取待执行策略

**状态变更**：
- 开始执行：`execution.state = PROCESSING`
- 发布完成：`execution.state = COMPLETED`，`execution.dataId = 内容ID`
- 用户确认：`execution.confirmed = true`
- 点亮监控：`monitor.state = READY`

## 三、前端实现方案

### 3.1 状态管理扩展

```typescript
// stores/workflow.ts 扩展

interface ModuleStatus {
  state: ModuleState;
  confirmed: boolean;
  dataId?: string;
  updatedAt?: string;
}

interface WorkflowState {
  knowledge: ModuleStatus;
  diagnosis: ModuleStatus;
  strategy: ModuleStatus;
  execution: ModuleStatus;
  monitor: ModuleStatus;
}

// 计算属性
const canStartDiagnosis = computed(() =>
  knowledge.value.state === ModuleState.COMPLETED
);

const canConfirmDiagnosis = computed(() =>
  diagnosis.value.state === ModuleState.COMPLETED && !diagnosis.value.confirmed
);

const canGenerateStrategy = computed(() =>
  diagnosis.value.state === ModuleState.COMPLETED &&
  diagnosis.value.confirmed === true
);

const canExecute = computed(() =>
  strategy.value.state === ModuleState.COMPLETED &&
  strategy.value.confirmed === true
);
```

### 3.2 任务队列 Hook

```typescript
// composables/useWorkflowTaskQueue.ts

export function useWorkflowTaskQueue() {
  const queue = ref<WorkflowTask[]>([]);
  const isProcessing = ref(false);
  const currentTask = ref<WorkflowTask | null>(null);

  async function enqueue(task: WorkflowTask) {
    // 检查是否已有相同任务在执行
    const existing = queue.value.find(t =>
      t.module === task.module && t.status === 'pending'
    );
    if (existing) {
      return { success: false, message: '任务已在队列中' };
    }

    queue.value.push({ ...task, status: 'pending' });
    return processQueue();
  }

  async function processQueue() {
    if (isProcessing.value) return;
    if (queue.value.length === 0) return;

    isProcessing.value = true;
    const task = queue.value.find(t => t.status === 'pending');
    if (!task) {
      isProcessing.value = false;
      return;
    }

    task.status = 'executing';
    currentTask.value = task;

    try {
      const result = await executeTask(task);
      task.status = 'completed';
      task.result = result;
    } catch (error) {
      task.status = 'failed';
      task.error = error.message;
    } finally {
      isProcessing.value = false;
      currentTask.value = null;
      // 处理下一个任务
      processQueue();
    }
  }

  return { queue, isProcessing, currentTask, enqueue };
}
```

### 3.3 按钮组件设计

```vue
<!-- components/WorkflowButton.vue -->

<template>
  <button
    :class="['workflow-btn', { active: enabled, processing: loading }]"
    :disabled="!enabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="spinner">⟳</span>
    <span v-else-if="!enabled" class="icon">{{ icon }}</span>
    <span v-else class="icon pulse">▶</span>
    {{ label }}
  </button>
</template>

<script setup>
const props = defineProps({
  enabled: Boolean,  // 是否可点击（状态联动）
  loading: Boolean,   // 是否加载中
  icon: String,
  label: String,
});

const emit = defineEmits(['click']);

// 只有 enabled=true 时才能点击
const handleClick = () => {
  if (props.enabled && !props.loading) {
    emit('click');
  }
};
</script>
```

### 3.4 页面联动示例

```vue
<!-- BrandDiagnoseDetailPage.vue -->

<template>
  <div class="diagnosis-page">
    <!-- 诊断报告内容 -->
    <ReportContent :report="report" />

    <!-- 操作按钮区 -->
    <div class="action-bar">
      <!-- 重新诊断（始终可点击） -->
      <WorkflowButton
        icon="🔄"
        label="重新诊断"
        :enabled="true"
        :loading="reDiagnosing"
        @click="handleReDiagnose"
      />

      <!-- 确认诊断（诊断完成后可点击） -->
      <WorkflowButton
        icon="✓"
        label="确认诊断报告"
        :enabled="canConfirm"
        :loading="confirming"
        @click="handleConfirm"
      />

      <!-- 启动策略生成（确认后可点击） -->
      <WorkflowButton
        icon="📋"
        label="启动AI优化建议"
        :enabled="canGenerateStrategy"
        :loading="generating"
        @click="handleGenerateStrategy"
      />
    </div>
  </div>
</template>

<script setup>
import { useWorkflowStore } from '@/stores/workflow';

const workflowStore = useWorkflowStore();

// 诊断完成后可确认
const canConfirm = computed(() =>
  workflowStore.diagnosisState === ModuleState.COMPLETED &&
  !workflowStore.diagnosisConfirmed
);

// 确认后才可生成策略
const canGenerateStrategy = computed(() =>
  workflowStore.diagnosisConfirmed === true
);

const handleConfirm = async () => {
  await workflowStore.confirmDiagnosis(report.value.id);
  // 自动触发 strategy.state = READY
};
</script>
```

## 四、后端实现方案

### 4.1 状态服务扩展

```typescript
// modules/workflow-state/services/state-management.service.ts

@Injectable()
export class StateManagementService {
  // 确认模块
  async confirmModule(
    brandId: string,
    module: ModuleType,
    dataId: string
  ): Promise<WorkflowState> {
    const state = await this.getWorkflowState(brandId);

    // 更新确认状态
    state[module].confirmed = true;
    state[module].dataId = dataId;

    // 自动点亮下一个模块
    await this.enableNextModule(brandId, module, state);

    return this.saveState(brandId, state);
  }

  // 点亮下一个模块
  private async enableNextModule(
    brandId: string,
    currentModule: ModuleType,
    state: WorkflowState
  ) {
    const nextModule = this.getNextModule(currentModule);
    if (nextModule && state[nextModule].state === ModuleState.DRAFT) {
      state[nextModule].state = ModuleState.READY;
    }
  }

  // 检查模块是否可以执行
  async canExecute(brandId: string, module: ModuleType): Promise<boolean> {
    const state = await this.getWorkflowState(brandId);

    switch (module) {
      case 'diagnosis':
        return state.knowledge.state === ModuleState.COMPLETED;
      case 'strategy':
        return state.diagnosis.state === ModuleState.COMPLETED &&
               state.diagnosis.confirmed === true;
      case 'execution':
        return state.strategy.state === ModuleState.COMPLETED &&
               state.strategy.confirmed === true;
      default:
        return false;
    }
  }
}
```

### 4.2 任务队列服务

```typescript
// modules/workflow/services/task-queue.service.ts

@Injectable()
export class TaskQueueService {
  private queues: Map<string, Task[]> = new Map();
  private locks: Map<string, boolean> = new Map();

  async enqueue(brandId: string, task: WorkflowTask): Promise<string> {
    const queue = this.queues.get(brandId) || [];
    const taskId = `${task.module}_${Date.now()}`;

    queue.push({ ...task, id: taskId, status: 'pending' });
    this.queues.set(brandId, queue);

    // 异步处理（不阻塞）
    this.processQueue(brandId);

    return taskId;
  }

  private async processQueue(brandId: string) {
    // 防止同一品牌并行处理
    if (this.locks.get(brandId)) return;
    this.locks.set(brandId, true);

    const queue = this.queues.get(brandId) || [];
    const task = queue.find(t => t.status === 'pending');

    if (!task) {
      this.locks.set(brandId, false);
      return;
    }

    try {
      await this.executeTask(task);
      task.status = 'completed';
    } catch (error) {
      task.status = 'failed';
      task.error = error.message;
    } finally {
      this.locks.set(brandId, false);
      // 处理下一个
      if (queue.some(t => t.status === 'pending')) {
        this.processQueue(brandId);
      }
    }
  }
}
```

## 五、数据流转设计

### 5.1 智库 → 诊断

```typescript
// 诊断时获取智库数据
const diagnosisData = {
  brandId: brand.id,
  brandName: brand.name,
  knowledgeBase: await getKnowledgeBase(brand.id),  // 完整智库
  url: brand.url,
  engine: 'deepseek',
};
```

### 5.2 诊断 → 策略

```typescript
// 策略生成时获取诊断数据
const strategyData = {
  brandId: brand.id,
  diagnosisReport: await getDiagnosisReport(state.diagnosis.dataId),
  dimensionScores: diagnosisReport.dimensionScores,
  issues: diagnosisReport.issues,
  competitorAnalysis: diagnosisReport.competitorAnalysis,
};
```

### 5.3 策略 → 内容

```typescript
// 内容生成时获取完整上下文
const contentData = {
  brandId: brand.id,
  knowledgeBase: await getKnowledgeBase(brand.id),
  diagnosisReport: await getDiagnosisReport(state.diagnosis.dataId),
  optimizationStrategy: await getStrategy(state.strategy.dataId),
  contentType: 'seo_article',  // seo_article | faq | json_ld
};
```

## 六、API 设计

### 6.1 状态管理 API

```
GET    /api/v1/workflow/state/:brandId     # 获取完整工作流状态
POST   /api/v1/workflow/init/:brandId      # 初始化工作流
PATCH  /api/v1/workflow/module/:brandId    # 更新模块状态
POST   /api/v1/workflow/confirm/:brandId   # 确认模块（点亮下一步）
POST   /api/v1/workflow/reset/:brandId     # 重置工作流
```

### 6.2 任务 API

```
POST   /api/v1/workflow/task/enqueue        # 添加任务到队列
GET    /api/v1/workflow/task/status/:taskId # 查询任务状态
```

## 七、监控与告警

### 7.1 任务队列监控

- 队列长度告警：> 5 个任务
- 任务超时告警：> 5 分钟未完成
- 并行任务告警：同一模块多个任务

### 7.2 状态异常监控

- 模块卡在 PROCESSING > 10 分钟
- 确认状态与数据不一致
- 状态流转异常回退

## 八、实现计划

### Phase 1：基础联动（1天）
- [ ] 扩展后端 workflow-state 模块，支持 confirmed 字段
- [ ] 扩展前端 workflow store，支持 confirmed 状态
- [ ] 实现基础的任务队列（单品牌单任务）
- [ ] 页面按钮状态联动

### Phase 2：用户确认机制（1天）
- [ ] 诊断报告确认 UI
- [ ] 策略确认 UI
- [ ] 确认后点亮下一步逻辑

### Phase 3：数据联动（1天）
- [ ] 智库数据传递给诊断
- [ ] 诊断数据传递给策略
- [ ] 策略数据传递给内容生成

### Phase 4：任务队列优化（1天）
- [ ] 多品牌并发控制
- [ ] 任务超时处理
- [ ] 失败重试机制

### Phase 5：UI/UX 优化（1天）
- [ ] 进度可视化
- [ ] 状态提示优化
- [ ] 移动端适配
