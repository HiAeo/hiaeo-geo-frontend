/**
 * 品牌 GEO 工作流状态管理
 * 管理智库→诊断→策略→执行→监控的流程状态
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export enum ModuleState {
  DRAFT = 'draft',
  READY = 'ready',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export interface WorkflowState {
  knowledge: ModuleState;
  diagnosis: ModuleState;
  strategy: ModuleState;
  execution: ModuleState;
  monitor: ModuleState;
  lastDiagnosisId?: string;
  lastStrategyTaskId?: string;
  lastExecutionId?: string;
  updatedAt?: string;
}

export interface WorkflowSummary {
  overall: number;
  nextAction: string;
  nextModule: string | null;
  canProceed: boolean;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const useWorkflowStore = defineStore('workflow', () => {
  // 状态
  const currentBrandId = ref<string | null>(null);
  const workflowState = ref<WorkflowState | null>(null);
  const summary = ref<WorkflowSummary | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 计算属性
  const knowledgeState = computed(() => workflowState.value?.knowledge || ModuleState.DRAFT);
  const diagnosisState = computed(() => workflowState.value?.diagnosis || ModuleState.DRAFT);
  const strategyState = computed(() => workflowState.value?.strategy || ModuleState.DRAFT);
  const executionState = computed(() => workflowState.value?.execution || ModuleState.DRAFT);
  const monitorState = computed(() => workflowState.value?.monitor || ModuleState.DRAFT);

  const canStartDiagnosis = computed(() => knowledgeState.value === ModuleState.COMPLETED);
  const canGenerateStrategy = computed(() => diagnosisState.value === ModuleState.COMPLETED);
  const canExecute = computed(() => strategyState.value === ModuleState.COMPLETED);
  const canViewMonitor = computed(() => executionState.value === ModuleState.COMPLETED);

  const isAnyProcessing = computed(() => {
    if (!workflowState.value) return false;
    return (
      workflowState.value.knowledge === ModuleState.PROCESSING ||
      workflowState.value.diagnosis === ModuleState.PROCESSING ||
      workflowState.value.strategy === ModuleState.PROCESSING ||
      workflowState.value.execution === ModuleState.PROCESSING
    );
  });

  // Actions
  async function fetchWorkflowState(brandId: string) {
    loading.value = true;
    error.value = null;
    currentBrandId.value = brandId;

    try {
      const response = await axios.get(`${API_BASE}/api/v1/workflow/state/${brandId}`);
      if (response.data.code === 0) {
        workflowState.value = response.data.data.state;
        summary.value = response.data.data.summary;
      }
    } catch (err: any) {
      error.value = err.message || '获取工作流状态失败';
      console.error('fetchWorkflowState error:', err);
    } finally {
      loading.value = false;
    }
  }

  async function initializeWorkflow(brandId: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.post(`${API_BASE}/api/v1/workflow/init/${brandId}`);
      if (response.data.code === 0) {
        workflowState.value = response.data.data;
        await fetchWorkflowState(brandId);
      }
    } catch (err: any) {
      error.value = err.message || '初始化工作流失败';
      console.error('initializeWorkflow error:', err);
    } finally {
      loading.value = false;
    }
  }

  async function updateModuleState(
    module: 'knowledge' | 'diagnosis' | 'strategy' | 'execution' | 'monitor',
    state: ModuleState,
  ) {
    if (!currentBrandId.value) {
      error.value = '未设置品牌ID';
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await axios.put(`${API_BASE}/api/v1/workflow/module/${currentBrandId.value}`, {
        module,
        state,
      });

      if (response.data.code === 0) {
        workflowState.value = response.data.data.state;
        summary.value = response.data.data.summary;
      }
    } catch (err: any) {
      error.value = err.message || '更新模块状态失败';
      console.error('updateModuleState error:', err);
    } finally {
      loading.value = false;
    }
  }

  async function setLastId(
    module: 'diagnosis' | 'strategy' | 'execution',
    lastId: string,
  ) {
    if (!currentBrandId.value) return;

    try {
      const response = await axios.put(`${API_BASE}/api/v1/workflow/last-id/${currentBrandId.value}`, {
        module,
        lastId,
      });

      if (response.data.code === 0) {
        workflowState.value = response.data.data;
      }
    } catch (err) {
      console.error('setLastId error:', err);
    }
  }

  async function checkCanExecute(module: string): Promise<boolean> {
    if (!currentBrandId.value) return false;

    try {
      const response = await axios.get(
        `${API_BASE}/api/v1/workflow/can-execute/${currentBrandId.value}/${module}`,
      );
      return response.data.code === 0 && response.data.data.canExecute;
    } catch (err) {
      console.error('checkCanExecute error:', err);
      return false;
    }
  }

  async function resetWorkflow(fromModule?: string) {
    if (!currentBrandId.value) return;

    loading.value = true;
    error.value = null;

    try {
      const response = await axios.post(`${API_BASE}/api/v1/workflow/reset/${currentBrandId.value}`, {
        fromModule,
      });

      if (response.data.code === 0) {
        workflowState.value = response.data.data;
        summary.value = null;
      }
    } catch (err: any) {
      error.value = err.message || '重置工作流失败';
      console.error('resetWorkflow error:', err);
    } finally {
      loading.value = false;
    }
  }

  // 快捷方法
  async function startKnowledge() {
    await updateModuleState('knowledge', ModuleState.PROCESSING);
  }

  async function completeKnowledge() {
    await updateModuleState('knowledge', ModuleState.COMPLETED);
  }

  async function startDiagnosis() {
    await updateModuleState('diagnosis', ModuleState.PROCESSING);
  }

  async function completeDiagnosis(diagnosisId: string) {
    await setLastId('diagnosis', diagnosisId);
    await updateModuleState('diagnosis', ModuleState.COMPLETED);
  }

  async function startStrategy() {
    await updateModuleState('strategy', ModuleState.PROCESSING);
  }

  async function completeStrategy(strategyTaskId: string) {
    await setLastId('strategy', strategyTaskId);
    await updateModuleState('strategy', ModuleState.COMPLETED);
  }

  async function startExecution() {
    await updateModuleState('execution', ModuleState.PROCESSING);
  }

  async function completeExecution(executionId: string) {
    await setLastId('execution', executionId);
    await updateModuleState('execution', ModuleState.COMPLETED);
  }

  async function setError(module: 'diagnosis' | 'strategy' | 'execution') {
    await updateModuleState(module, ModuleState.ERROR);
  }

  // 状态重置
  function $reset() {
    currentBrandId.value = null;
    workflowState.value = null;
    summary.value = null;
    loading.value = false;
    error.value = null;
  }

  return {
    // State
    currentBrandId,
    workflowState,
    summary,
    loading,
    error,

    // Getters
    knowledgeState,
    diagnosisState,
    strategyState,
    executionState,
    monitorState,
    canStartDiagnosis,
    canGenerateStrategy,
    canExecute,
    canViewMonitor,
    isAnyProcessing,

    // Actions
    fetchWorkflowState,
    initializeWorkflow,
    updateModuleState,
    setLastId,
    checkCanExecute,
    resetWorkflow,

    // Shortcuts
    startKnowledge,
    completeKnowledge,
    startDiagnosis,
    completeDiagnosis,
    startStrategy,
    completeStrategy,
    startExecution,
    completeExecution,
    setError,

    $reset,
  };
});
