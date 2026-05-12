<template>
  <div class="workflow-nav bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div class="flex items-center justify-between">
      <!-- 进度指示器 -->
      <div class="flex-1 flex items-center">
        <template v-for="(step, index) in steps" :key="step.key">
          <!-- 步骤节点 -->
          <div class="flex items-center">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all"
              :class="getStepClass(step.key)"
            >
              <span v-if="isCompleted(step.key)">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </span>
              <span v-else-if="isProcessing(step.key)" class="animate-pulse">
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              </span>
              <span v-else>{{ index + 1 }}</span>
            </div>

            <!-- 步骤标签 -->
            <div class="ml-2 hidden sm:block">
              <p class="text-sm font-medium" :class="getStepTextClass(step.key)">
                {{ step.label }}
              </p>
              <p class="text-xs text-gray-500" v-if="step.desc">
                {{ step.desc }}
              </p>
            </div>
          </div>

          <!-- 连接线 -->
          <div
            v-if="index < steps.length - 1"
            class="w-8 sm:w-12 h-0.5 mx-2"
            :class="isCompleted(steps[index + 1].key) ? 'bg-green-500' : 'bg-gray-200'"
          />
        </template>
      </div>

      <!-- 进度百分比 -->
      <div class="ml-4 text-right">
        <p class="text-2xl font-bold text-blue-600">{{ overallProgress }}%</p>
        <p class="text-xs text-gray-500">完成进度</p>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="mt-4">
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
          :style="{ width: `${overallProgress}%` }"
        />
      </div>
    </div>

    <!-- 下一步操作 -->
    <div v-if="nextAction" class="mt-4 flex items-center justify-between">
      <div class="flex items-center text-sm text-gray-600">
        <svg class="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
        <span>下一步：<strong class="text-blue-600">{{ nextAction }}</strong></span>
      </div>

      <!-- 快捷按钮 -->
      <button
        v-if="nextModule && canNavigate"
        @click="$emit('navigate', nextModule)"
        class="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
      >
        前往
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="absolute inset-0 bg-white/50 flex items-center justify-center">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useWorkflowStore, ModuleState } from '@/stores/workflow';

const props = defineProps<{
  canNavigate?: boolean;
}>();

defineEmits<{
  navigate: [module: string];
}>();

const workflowStore = useWorkflowStore();

const steps = [
  { key: 'knowledge', label: '品牌智库', desc: '完善品牌信息' },
  { key: 'diagnosis', label: '模镜诊断', desc: 'AI 可见度分析' },
  { key: 'strategy', label: '模豆策略', desc: '生成 GEO 策略' },
  { key: 'execution', label: '模法执行', desc: '内容优化执行' },
  { key: 'monitor', label: '品牌监控', desc: '持续效果追踪' },
];

const overallProgress = computed(() => workflowStore.summary?.overall || 0);
const nextAction = computed(() => workflowStore.summary?.nextAction || null);
const nextModule = computed(() => workflowStore.summary?.nextModule || null);

function getState(key: string): ModuleState {
  return (workflowStore.workflowState as any)?.[key] || ModuleState.DRAFT;
}

function isCompleted(key: string): boolean {
  return getState(key) === ModuleState.COMPLETED;
}

function isProcessing(key: string): boolean {
  return getState(key) === ModuleState.PROCESSING;
}

function getStepClass(key: string): string {
  const state = getState(key);
  if (state === ModuleState.COMPLETED) {
    return 'bg-green-500 text-white';
  }
  if (state === ModuleState.PROCESSING) {
    return 'bg-blue-500 text-white';
  }
  if (state === ModuleState.ERROR) {
    return 'bg-red-500 text-white';
  }
  if (state === ModuleState.READY) {
    return 'bg-blue-100 text-blue-600 ring-2 ring-blue-500';
  }
  return 'bg-gray-100 text-gray-400';
}

function getStepTextClass(key: string): string {
  const state = getState(key);
  if (state === ModuleState.COMPLETED) return 'text-green-600';
  if (state === ModuleState.PROCESSING) return 'text-blue-600';
  if (state === ModuleState.ERROR) return 'text-red-600';
  return 'text-gray-400';
}

const loading = computed(() => workflowStore.loading);
</script>

<style scoped>
.workflow-nav {
  position: relative;
}
</style>
