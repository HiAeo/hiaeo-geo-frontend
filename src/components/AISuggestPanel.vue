<template>
  <div class="ai-suggest-panel">
    <!-- URL 输入区域 -->
    <div class="url-input-section bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
      <div class="flex items-center gap-3">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
              </svg>
              AI 智能预填
            </span>
          </label>
          <input
            v-model="urlInput"
            type="text"
            placeholder="请输入官网URL，如：www.example.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :disabled="loading"
          />
        </div>
        <button
          @click="handleFetch"
          :disabled="!urlInput.trim() || loading"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ loading ? '分析中...' : '开始分析' }}
        </button>
      </div>
      <p class="text-xs text-gray-500 mt-2">
        输入官网 URL，AI 将自动抓取并填充品牌信息
      </p>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div class="flex items-start">
        <svg class="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- 建议展示区域 -->
    <div v-if="suggestion && !loading" class="suggestion-panel">
      <!-- 概览 -->
      <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">AI 分析完成</p>
            <p class="text-xs text-green-600 mt-1">
              已从 {{ urlInput }} 提取到 {{ filledCount }} 项信息，请检查并采纳建议
            </p>
          </div>
        </div>
      </div>

      <!-- 建议内容 -->
      <div class="space-y-4">
        <!-- 基础信息 -->
        <div v-if="hasBasicInfo" class="bg-white border border-gray-200 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-medium text-gray-800 flex items-center">
              <span class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs mr-2">1</span>
              企业基础信息
            </h4>
            <button
              @click="applyBasicInfo"
              class="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              全部采纳
            </button>
          </div>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div v-if="suggestion.basicInfo.companyName">
              <span class="text-gray-500">公司名称：</span>
              <span class="text-gray-800">{{ suggestion.basicInfo.companyName }}</span>
            </div>
            <div v-if="suggestion.basicInfo.industry">
              <span class="text-gray-500">行业：</span>
              <span class="text-gray-800">{{ getIndustryLabel(suggestion.basicInfo.industry) }}</span>
            </div>
            <div v-if="suggestion.basicInfo.companyRegion">
              <span class="text-gray-500">地区：</span>
              <span class="text-gray-800">{{ suggestion.basicInfo.companyRegion }}</span>
            </div>
            <div v-if="suggestion.basicInfo.website">
              <span class="text-gray-500">官网：</span>
              <span class="text-gray-800">{{ suggestion.basicInfo.website }}</span>
            </div>
          </div>
        </div>

        <!-- 业务定位 -->
        <div v-if="hasBizPositioning" class="bg-white border border-gray-200 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-medium text-gray-800 flex items-center">
              <span class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs mr-2">2</span>
              核心业务定位
            </h4>
            <button
              @click="applyBizPositioning"
              class="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              全部采纳
            </button>
          </div>
          <div class="space-y-3 text-sm">
            <div v-if="suggestion.bizPositioning.coreBizIntro">
              <span class="text-gray-500 block mb-1">核心业务介绍：</span>
              <p class="text-gray-800 bg-gray-50 rounded p-2">{{ suggestion.bizPositioning.coreBizIntro }}</p>
            </div>
            <div v-if="suggestion.bizPositioning.targetCustomer">
              <span class="text-gray-500 block mb-1">目标客户：</span>
              <p class="text-gray-800">{{ suggestion.bizPositioning.targetCustomer }}</p>
            </div>
          </div>
        </div>

        <!-- 产品服务 -->
        <div v-if="hasProductService" class="bg-white border border-gray-200 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-medium text-gray-800 flex items-center">
              <span class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs mr-2">3</span>
              产品与服务
            </h4>
            <button
              @click="applyProductService"
              class="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              全部采纳
            </button>
          </div>
          <div class="space-y-3 text-sm">
            <div v-if="suggestion.productService.productSellPoint">
              <span class="text-gray-500 block mb-1">产品卖点：</span>
              <p class="text-gray-800">{{ suggestion.productService.productSellPoint }}</p>
            </div>
            <div v-if="suggestion.productService.coreKeywords?.length">
              <span class="text-gray-500 block mb-1">核心关键词：</span>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="keyword in suggestion.productService.coreKeywords"
                  :key="keyword"
                  class="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                >
                  {{ keyword }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 原始数据 -->
      <div v-if="showRawData" class="mt-4">
        <button
          @click="showRawData = !showRawData"
          class="text-sm text-gray-500 hover:text-gray-700 flex items-center"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
          查看原始抓取数据
        </button>
        <div v-if="showRawData" class="mt-2 bg-gray-50 rounded-lg p-4 text-xs font-mono overflow-auto max-h-64">
          <pre>{{ JSON.stringify(suggestion.raw, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { getAISuggestion, type AISuggestion } from '@/api/workflow';

const emit = defineEmits<{
  apply: [data: Partial<AISuggestion>];
}>();

const urlInput = ref('');
const loading = ref(false);
const error = ref('');
const suggestion = ref<AISuggestion | null>(null);
const showRawData = ref(false);

const hasBasicInfo = computed(() => {
  return suggestion.value?.basicInfo && Object.keys(suggestion.value.basicInfo).length > 0;
});

const hasBizPositioning = computed(() => {
  return suggestion.value?.bizPositioning && Object.keys(suggestion.value.bizPositioning).length > 0;
});

const hasProductService = computed(() => {
  return suggestion.value?.productService && Object.keys(suggestion.value.productService).length > 0;
});

const filledCount = computed(() => {
  if (!suggestion.value) return 0;
  let count = 0;
  if (hasBasicInfo.value) count++;
  if (hasBizPositioning.value) count++;
  if (hasProductService.value) count++;
  return count;
});

async function handleFetch() {
  if (!urlInput.value.trim()) return;

  loading.value = true;
  error.value = '';

  try {
    const result = await getAISuggestion(urlInput.value);

    if (result.code === 0) {
      suggestion.value = result.data;
    } else {
      error.value = result.message || '分析失败，请检查URL是否正确';
    }
  } catch (err: any) {
    error.value = err.message || '网络错误，请稍后重试';
  } finally {
    loading.value = false;
  }
}

function applyBasicInfo() {
  if (suggestion.value?.basicInfo) {
    emit('apply', { basicInfo: suggestion.value.basicInfo });
  }
}

function applyBizPositioning() {
  if (suggestion.value?.bizPositioning) {
    emit('apply', { bizPositioning: suggestion.value.bizPositioning });
  }
}

function applyProductService() {
  if (suggestion.value?.productService) {
    emit('apply', { productService: suggestion.value.productService });
  }
}

function getIndustryLabel(industry: string): string {
  const labels: Record<string, string> = {
    technology: '科技/技术',
    ecommerce: '电商/零售',
    education: '教育/培训',
    healthcare: '医疗/健康',
    finance: '金融/银行',
    food: '餐饮/食品',
    real_estate: '房地产/装修',
    other: '其他',
  };
  return labels[industry] || industry;
}
</script>
