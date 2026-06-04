/**
 * Vercel Serverless Function - 小智机器人对话接口
 * 直接调用 LLM API，绕过 NestJS 后端（Serverless 不兼容原生模块）
 */

// 360智见小智系统提示词
const SYSTEM_PROMPT = `你是"小智"，360智见的AI智能助手。你的职责是帮助用户解答关于以下领域的问题：

1. **GEO（生成式引擎优化）**：解释GEO概念、最佳实践、与SEO的区别
   - GEO是Generative Engine Optimization的缩写，指优化品牌在AI搜索引擎（如ChatGPT搜索、Google AI Overview、360AI搜索等）中的可见度和表现
   - 与传统SEO不同，GEO关注的是AI生成的回答而非链接排名

2. **360智见产品功能**：
   - 智能诊断：分析品牌在AI搜索中的可见度
   - 策略生成：基于AI的GEO优化策略建议
   - 内容执行：自动生成和发布优化内容
   - 数据监控：实时追踪GEO效果指标

3. **AI搜索优化建议**：
   - 品牌实体建设：确保AI能正确识别和理解品牌
   - 内容质量：创作对AI友好的结构化内容
   - 引用和数据：获得权威来源的引用和提及
   - 更新频率：保持内容新鲜度和活跃度

回答要求：
- 用中文回答，语言简洁友好，像一位专业的顾问
- 如果问题超出你的知识范围，诚实说明并引导到相关方向
- 不要提及任何其他竞品或产品名称
- 保持专业但平易近人的语气
- 回答长度控制在200字以内，重点突出`;

// 内置知识库 - 当无API key时使用
const KNOWLEDGE_BASE: Record<string, string> = {
  '什么是geo': `**GEO（生成式引擎优化）** 是 Generative Engine Optimization 的缩写，是一种全新的数字营销方法论。

与传统SEO关注"链接排名"不同，**GEO专注于优化品牌在AI搜索引擎（如ChatGPT、360AI搜索、Google AI Overview等）中的可见度和推荐率**。

核心差异：
| 维度 | 传统SEO | GEO |
|------|---------|-----|
| 目标 | 搜索引擎结果页排名 | AI生成的直接回答中被引用/推荐 |
| 手段 | 关键词、外链、技术优化 | 品牌实体建设、结构化内容、权威引用 |
| 衡量 | 排名位置、流量 | 引用率、推荐率、情感正负 |`,

  '360智见': `**360智见** 是360公司推出的AI驱动的生成式引擎优化平台，帮助企业提升在AI搜索时代的品牌可见度。

## 核心功能模块

1. **智能诊断（MiraSeek）**
   - 7维度品牌健康评分体系
   - AI可见度全方位检测
   - 竞品对比分析

2. **策略生成（MiraMod）**
   - AI驱动GEO策略定制
   - 多场景优化方案
   - 效果预测模拟

3. **内容执行（MiraMag）**
   - 自动化内容生产
   - 多渠道分发管理
   - 效果追踪闭环

4. **数据监控（Hub驾驶舱）**
   - 实时数据看板
   - 趋势分析与预警
   - ROI效果评估`,

  '如何提升': `**提升品牌在AI搜索中可见度的关键方法：**

### 1. 品牌实体建设
- 完善企业基础信息（官网、百科、工商信息）
- 统一品牌名称、描述和定位表述
- 在权威平台建立品牌档案

### 2. 内容优化
- 创作结构化、事实性强的内容
- 使用AI容易理解的格式（FAQ、列表、表格）
- 定期更新保持活跃度

### 3. 权威引用
- 获得行业媒体和权威网站的引用
- 参与行业标准制定
- 发布原创研究和报告

### 4. 技术层面
- 使用Schema.org结构化数据标记
- 优化页面语义化HTML
- 提升网站加载速度和移动体验

> 💡 **360智见**可以帮您自动化完成以上大部分工作，一键开启GEO优化之旅。`,

  '定价': `**360智见提供灵活的定价方案：**

| 版本 | 适用对象 | 核心能力 |
|------|---------|---------|
| **体验版** | 初创团队/个人 | 基础诊断+月度报告 |
| **专业版** | 成长型企业 | 全套工具+策略生成 |
| **企业版** | 大型品牌/集团 | 定制方案+专属服务 |

具体价格请访问 **www.360zhijiangeo.com** 或联系销售获取最新报价。

我们同时也支持**按效果付费**的服务模式——您只需为实际达成的优化成果买单。`,

  'default': `感谢您的提问！作为360智见的AI智能助手，我主要可以帮助您解答以下方面的问题：

🔍 **GEO（生成式引擎优化）** — 什么是GEO？如何做？
🎯 **品牌可见度** — 如何让AI搜索优先推荐您的品牌？
📊 **360智见功能** — 产品介绍、使用方法、最佳实践
💡 **优化策略** — 针对您行业的定制化建议

您可以尝试问我：
- "什么是GEO？"
- "如何提升品牌AI搜索可见度？"  
- "360智见有哪些功能？"

如需更深入的咨询，欢迎访问 **www.360zhijiangeo.com** 或联系我们的专业顾问。`,
};

function findBuiltInReply(message: string): string {
  const lowerMsg = message.toLowerCase();
  for (const [key, reply] of Object.entries(KNOWLEDGE_BASE)) {
    if (key === 'default') continue;
    if (lowerMsg.includes(key) || lowerMsg.includes(key.replace(/\s/g, ''))) {
      return reply;
    }
  }
  if (lowerMsg.includes('geo') || lowerMsg.includes('生成式') || lowerMsg.includes('ai搜索')) {
    return KNOWLEDGE_BASE['什么是geo'];
  }
  if (lowerMsg.includes('功能') || lowerMsg.includes('能做什么') || lowerMsg.includes('产品')) {
    return KNOWLEDGE_BASE['360智见'];
  }
  if (lowerMsg.includes('提升') || lowerMsg.includes('优化') || lowerMsg.includes('怎么') || lowerMsg.includes('如何')) {
    return KNOWLEDGE_BASE['如何提升'];
  }
  if (lowerMsg.includes('价格') || lowerMsg.includes('费用') || lowerMsg.includes('收费') || lowerMsg.includes('多少钱')) {
    return KNOWLEDGE_BASE['定价'];
  }
  return KNOWLEDGE_BASE['default'];
}

async function callLLMAPI(messages: Array<{role: string; content: string}>): Promise<string> {
  // @ts-ignore - Vercel provides process.env
  const apiKey = (typeof process !== 'undefined' && process.env?.OPENAI_API_KEY) || (typeof process !== 'undefined' && process.env?.LLM_API_KEY);
  
  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  // @ts-ignore
  const apiUrl = (typeof process !== 'undefined' && process.env?.LLM_API_URL) || 'https://api.openai.com/v1/chat/completions';
  // @ts-ignore
  const model = (typeof process !== 'undefined' && process.env?.LLM_MODEL) || 'gpt-3.5-turbo';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error(`LLM API error: ${response.status}`);
  }

  const data = await response.json() as any;
  return data.choices?.[0]?.message?.content || '抱歉，无法获取回复。';
}

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body as { message?: string; history?: Array<{role: string; content: string}> };

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: '缺少 message 参数' });
    }

    const messages = [
      ...(history || []).map(h => ({
        role: h.role === 'assistant' ? 'assistant' : 'user',
        content: h.content,
      })),
      { role: 'user', content: message },
    ];

    let reply: string;

    try {
      reply = await callLLMAPI(messages);
    } catch (err) {
      console.log('[XiaoZhi] LLM API unavailable, using built-in knowledge:', err);
      reply = findBuiltInReply(message);
    }

    return res.status(200).json({ reply, success: true });
  } catch (err) {
    console.error('[XiaoZhi] Error:', err);
    return res.status(500).json({ 
      reply: '抱歉，服务暂时不可用，请稍后再试。', 
      success: false 
    });
  }
}
