/**
 * Vercel Serverless Function - 小智机器人对话接口
 * 内置知识库 + 智能关键词匹配引擎
 */

// ============ 知识库条目 ============
interface KBEntry {
  id: string;
  keywords: string[][];    // 多组关键词，每组内为 AND 关系，组间为 OR 关系
  reply: string;
  priority: number;        // 越小越优先（1-10）
}

const KB: KBEntry[] = [
  // ---- 定价/收费（最高优先级） ----
  {
    id: 'pricing',
    priority: 1,
    keywords: [
      ['收费', '多少钱', '价格', '费用', '报价', '套餐', '付费', '资费'],
      ['免费', '试用', '体验版'],
      ['收费标准', '价格表', '价目'],
      ['企业版', '专业版', '工具版', '标准版'],
      ['会员', '订阅', '按效果付费', '年费', '月费'],
      ['多少', '钱'], // 必须搭配其他定价词才触发
    ],
    reply: `**360智见定价方案** 💰

我们提供三种版本，满足不同规模企业的需求：

| 版本 | 适用对象 | 核心能力 |
|------|---------|---------|
| 🆓 **体验版** | 初创团队/个人 | 基础诊断 + 月度报告 |
| ⭐ **专业版** | 成长型企业 | 全套GEO工具 + AI策略生成 |
| 🏢 **企业版** | 大型品牌/集团 | 定制方案 + 专属客户成功经理 |

**特色服务模式：**
- ✅ 支持**按效果付费** — 为实际优化成果买单
- ✅ 提供**14天免费试用**，全功能体验
- ✅ 企业版支持**定制化部署**和**私有化方案**

💡 具体价格因功能模块和用量而异，建议您：
1. 先用**体验版**免费了解平台能力
2. 访问 **www.modelbuddy.net** 查看详细方案
3. 或联系销售获取针对您企业的专属报价`,
  },

  // ---- 产品介绍/功能概览 ----
  {
    id: 'product',
    priority: 2,
    keywords: [
      ['介绍', '什么产品', '是什么', '简介', '概述', '概况'],
      ['功能', '能做什么', '有什么', '具备', '包含哪些'],
      ['核心功能', '主要功能', '产品特点'],
      ['模镜', 'miraseek', 'miraseek', '诊断'],
      ['模豆', 'miramod', 'miramod', '策略'],
      ['模法', 'miramag', 'miramag', '内容', '执行'],
      ['魔鲸', 'hub', '驾驶舱', '看板', '数据中'],
      ['360智见', 'platform', '平台', '系统'],
    ],
    reply: `**360智见（ModelBuddy）** 是国内首个面向企业的AI生成式引擎优化（GEO）全闭环SaaS平台。

## 🎯 四大核心模块

### 1️⃣ 模镜 MiraSeek — AI可见度诊断
- 7维度品牌健康评分体系（品牌识别、产品关联、情感分析、竞品压制、内容覆盖、官网引流、更新活跃）
- AI可见度全方位检测与竞品对比

### 2️⃣ 模豆 MiraMod — 智能策略生成
- AI驱动的GEO优化策略自动生成
- 多场景定制化方案 + 效果预测

### 3️⃣ 模法 MiraMag — 内容生成执行
- 自动化GEO友好内容生产
- 多渠道分发管理与效果追踪

### 4️⃣ 魔鲸Hub — 统一管理驾驶舱
- 实时数据看板 + 趋势预警
- 全局ROI评估与决策支持

> 🔗 访问 **www.modelbuddy.net** 开启您的GEO优化之旅！`,
  },

  // ---- GEO概念解释 ----
  {
    id: 'geo-concept',
    priority: 2,
    keywords: [
      ['什么是geo', 'geo是什么', 'geo定义', 'geo概念'],
      ['生成式引擎优化', 'generative engine optimization'],
      ['geo和seo区别', 'seo区别', 'geo vs seo'],
      ['ai搜索优化', 'ai引擎优化', 'ai可见度'],
    ],
    reply: `**GEO（Generative Engine Optimization / 生成式引擎优化）** 🌐

是一种全新的数字营销方法论，目标是让品牌在**AI搜索引擎的直接回答中被推荐和引用**。

## GEO vs 传统SEO

| 维度 | 传统SEO | GEO |
|------|---------|-----|
| 🎯 目标 | 搜索结果页排名 | AI生成的回答中被引用 |
| 📝 手段 | 关键词、外链、技术优化 | 品牌实体建设、结构化内容、权威引用 |
| 📊 衡量 | 排名位置、点击量 | 引用率、推荐率、情感正负 |
| 🤖 场景 | Google/Baidu搜索结果页 | ChatGPT/360AI/Google AI Overview |

**简单理解**：SEO是让用户搜到你，GEO是让**AI推荐你**。随着AI搜索普及，GEO已成为企业数字营销的新必修课。

💡 **360智见**可以帮您一站式完成GEO优化，欢迎了解！`,
  },

  // ---- 如何提升/优化方法 ----
  {
    id: 'optimization',
    priority: 3,
    keywords: [
      ['如何提升', '怎么提升', '怎样提升', '如何提高', '怎么提高'],
      ['如何优化', '怎么优化', '怎样优化', '优化方法', '优化技巧'],
      ['提升可见度', '增加曝光', '提高排名', '被ai推荐'],
      ['怎么做geo', '开始优化', '入手', '第一步'],
      ['best practice', '最佳实践', '方法论'],
    ],
    reply: `**提升AI搜索可见度的核心方法** 🚀

### 1. 品牌实体建设 🏢
- 完善企业基础信息（官网、百科、工商信息一致）
- 统一品牌名称和定位表述，让AI"认识"你
- 在权威平台建立品牌档案

### 2. 内容质量优化 📝
- 创作结构化、事实性强的内容（AI喜欢FAQ、列表、表格格式）
- 围绕用户真实问题创作，而非堆砌关键词
- 保持定期更新，维持活跃度信号

### 3. 权威引用积累 📎
- 获得行业媒体和权威网站的引用/提及
- 参与行业标准制定或白皮书发布
- 发布原创研究和数据报告

### 4. 技术层面 ⚙️
- 使用Schema.org结构化数据标记
- 优化页面语义化和加载速度
- 确保移动端良好体验

> ✨ **好消息**：**360智见**可以自动化完成以上大部分工作！输入网址即可一键开启GEO优化循环 🔄`,
  },

  // ---- 优势/为什么选择 ----
  {
    id: 'advantage',
    priority: 3,
    keywords: [
      ['优势', '优点', '强项', '竞争力', '领先'],
      ['为什么选择', '为啥选', '凭什么', '好在哪里'],
      ['区别', '不同', '差异化', '相比', '对比竞品'],
      ['独特', '创新', '首家', '首创', '唯一'],
    ],
    reply: `**为什么选择360智见？** ⭐

### 核心优势

🔹 **国内首个GEO SaaS平台**
专注中国市场和AI搜索生态，深度适配360AI搜索、百度文心一言等国产AI引擎

🔹 **全闭环自动化**
从诊断→策略→内容→监控，一键串联，80%工作由AI自动完成

🔹 **7维度科学诊断体系**
品牌识别、产品关联、情感分析、竞品压制、内容覆盖、官网引流、更新活跃 — 行业最全面的GEO健康评估模型

🔹 **魔鲸Hub数据中枢**
所有数据汇聚统一看板，实时监控+智能预警+自动优化建议

🔹 **按效果付费模式**
不为承诺买单，只为成果付费，降低企业试错成本

💬 **一句话总结**：360智见让GEO优化像呼吸一样简单 — 输入网址，AI搞定其余。`,
  },

  // ---- 使用流程/入门 ----
  {
    id: 'getting-started',
    priority: 4,
    keywords: [
      ['怎么使用', '如何使用', '使用方法', '操作流程', '使用步骤'],
      ['开始使用', '快速上手', '入门', '新手指南', '教程'],
      ['注册', '登录', '账号', '开通'],
      ['三步', '步骤', '流程', '过程'],
    ],
    reply: `**360智见使用指南 — 三步开启GEO优化** 📋

### 第一步：输入网址 → AI自动填写品牌智库
输入您的官网URL，小智会自动抓取并预填：
- ✅ 企业基础信息
- ✅ 核心业务与产品
- ✅ 品牌定位描述
您只需审核确认即可（AI完成80%填写工作）

### 第二步：一键开启闭环优化
点击"开始优化"，系统自动执行：
1. **模镜诊断** → 7维度健康评分
2. **模豆策略** → AI生成优化方案  
3. **模法执行** → 自动创建并发布内容
4. **魔鲸监控** → 实时追踪效果数据

### 第三步：监控看板 → 自动持续优化
- 📊 实时数据看板展示各项指标
- ⏰ 定时任务自动重新诊断
- 💡 智能推送优化建议

> 🚀 **现在就开始**：访问 **www.modelbuddy.net** ，30秒完成注册！`,
  },

  // ---- 诊断相关 ----
  {
    id: 'diagnosis',
    priority: 4,
    keywords: [
      ['诊断', '体检', '检测', '扫描', '评估', '分析'],
      ['健康分', '评分', '7维度', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7'],
      ['品牌识别', '产品关联', '情感', '竞品', '内容覆盖', '官网引流', '活跃度'],
      ['模镜', 'miraseek'],
    ],
    reply: `**360智见7维度诊断体系** 🔍

我们的AI诊断引擎从以下7个维度评估品牌的GEO健康状况：

| 维度 | 代号 | 权重 | 说明 |
|------|------|------|------|
| 品牌实体识别准确率 | D1 | 15% | AI能否正确识别您的品牌 |
| 产品关联度 | D2 | 15% | AI是否将您的品牌与正确产品关联 |
| 正面情感占比 | D3 | 10% | AI评价的情感倾向是否积极 |
| 竞品压制指数 | D4 | 15% | 相对竞品的推荐表现 |
| 内容覆盖度 | D5 | 15% | 您的内容被AI引用的范围和频率 |
| 官网引流率 | D6 | 15% | 从AI搜索引导至官网的流量效率 |
| 更新活跃度 | D7 | 15% | 内容更新频率和新鲜度 |

每个维度都会给出具体分数和改进建议，帮助您精准定位优化方向。

💡 输入网址即可**免费获取诊断报告** → **www.modelbuddy.net**`,
  },

  // ---- 安全/隐私 ----
  {
    id: 'security',
    priority: 5,
    keywords: [
      ['安全', '隐私', '保密', '数据安全', '信息安全'],
      ['泄露', '保护', '加密', '合规', 'gdpr'],
    ],
    reply: `**数据安全与隐私保障** 🔒

360智见非常重视用户数据安全：

- 🔐 **数据传输加密**：全程SSL/TLS加密传输
- 🛡️ **数据存储安全**：采用企业级数据库加密存储
- 👤 **隐私保护**：您的品牌数据和优化策略严格保密
- 📋 **合规认证**：符合国家网络安全法要求
- 🚫 **不共享**：绝不向第三方透露任何客户数据

如有特殊的安全合规需求（如金融、医疗行业），企业版可提供**定制化安全方案**和**私有化部署**选项。

如有疑虑，欢迎联系我们的安全技术团队详询。`,
  },

  // ---- 合作/代理/渠道 ----
  {
    id: 'partnership',
    priority: 5,
    keywords: [
      ['合作', '代理', '渠道', '加盟', '伙伴'],
      ['成为代理', '渠道合作', '代理商'],
      ['推广', '分销', '联盟', 'affiliat'],
    ],
    reply: `**合作与渠道计划** 🤝

360智见正在寻找优秀的合作伙伴！

### 渠道合作类型
- 🏢 **区域代理**：特定城市的独家代理权
- 📈 **SI合作伙伴**：与系统集成商联合服务大客户
- 🎓 **教育培训合作**：高校/培训机构课程合作
- 📢 **推广联盟**：按成交佣金结算

### 合作权益
- ✅ 丰厚的返佣政策
- ✅ 完整的销售工具包和培训支持
- ✅ 专人对接与技术支援
- ✅ 联合市场推广资源

📩 有意向请发送邮件至 **partner@modelbuddy.net** 或访问 **www.modelbuddy.net** 留言，我们的商务团队会在24小时内与您联系。`,
  },

  // ---- 技术支持/客服 ----
  {
    id: 'support',
    priority: 5,
    keywords: [
      ['客服', '联系', '联系方式', '电话', '邮箱', '微信'],
      ['技术支持', '帮助', '问题反馈', 'bug', '报错', '故障'],
      ['工单', '在线客服', '人工服务'],
    ],
    reply: `**联系我们** 📞

### 客服渠道
- 📧 **邮箱**：support@modelbuddy.net
- 💬 **在线客服**：www.modelbuddy.net 右下角悬浮按钮
- 📱 **工作时间**：周一至周五 9:00-18:00

### 企业版专享
- 🎯 专属客户成功经理 1对1 服务
- ⚡ 优先响应通道（< 2小时）
- 📞 400热线直连技术专家

### 常见问题
大部分问题可以在帮助中心找到答案：
👉 **www.modelbuddy.net/help**

如遇紧急技术故障，请发送邮件注明"紧急"，我们会优先处理。`,
  },
];

// ============ 默认回复 ============
const DEFAULT_REPLY = `感谢您的提问！我是**小智**，360智见的AI智能助手 🤖

我可以帮您解答以下方面的问题：

| 问题类型 | 示例 |
|---------|------|
| 🌐 **GEO概念** | "什么是GEO？""GEO和SEO有什么区别？" |
| 🎯 **产品功能** | "360智见有哪些功能？""介绍一下模镜诊断" |
| 💰 **定价方案** | "怎么收费？""有免费试用吗？" |
| 🚀 **优化方法** | "如何提升AI搜索可见度？""GEO最佳实践" |
| 📋 **使用流程** | "怎么使用？""新手入门指南" |
| 🔍 **诊断体系** | "7维度诊断包括什么？" |
| ⭐ **产品优势** | "为什么选择360智见？" |

您可以随时问我上述任意问题，我会尽力为您解答！

💡 如需更深入的咨询，欢迎访问 **www.modelbuddy.net**`;

// ============ 匹配引擎 ============
function matchKeywords(text: string, keywordGroup: string[]): boolean {
  // 组内所有关键词都必须出现（AND关系）
  return keywordGroup.every(kw => text.includes(kw));
}

function scoreEntry(text: string, entry: KBEntry): number {
  const lower = text.toLowerCase().replace(/[\s？?！!。，,、；;：:\s]+/g, '');

  for (const group of entry.keywords) {
    if (matchKeywords(lower, group.map(k => k.toLowerCase().replace(/[\s？?！!。，,、；;：:\s]+/g, '')))) {
      return entry.priority;
    }
  }
  return -1;
}

function findBestReply(message: string): string {
  const lowerMsg = message.toLowerCase()
    .replace(/[\s？?！!。，,、；;：:\s]+/g, '');

  let bestEntry: KBEntry | null = null;
  let bestScore = Infinity;

  for (const entry of KB) {
    const score = scoreEntry(lowerMsg, entry);
    if (score >= 0 && score < bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  return bestEntry ? bestEntry.reply : DEFAULT_REPLY;
}

// ============ LLM API（可选） ============
async function callLLMAPI(messages: Array<{role: string; content: string}>): Promise<string> {
  // @ts-ignore
  const apiKey = (typeof process !== 'undefined' && process.env?.OPENAI_API_KEY) || (typeof process !== 'undefined' && process.env?.LLM_API_KEY);
  if (!apiKey) throw new Error('NO_API_KEY');

  // @ts-ignore
  const apiUrl = (typeof process !== 'undefined' && process.env?.LLM_API_URL) || 'https://api.openai.com/v1/chat/completions';
  // @ts-ignore
  const model = (typeof process !== 'undefined' && process.env?.LLM_MODEL) || 'gpt-3.5-turbo';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: `你是"小智"，360智见的AI智能助手。用中文简洁友好地回答关于GEO(生成式引擎优化)、360智见产品、AI搜索优化的问题。回答控制在200字以内。` },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) throw new Error(`LLM API error: ${response.status}`);

  const data = await response.json() as any;
  return data.choices?.[0]?.message?.content || '抱歉，无法获取回复。';
}

// ============ 主处理函数 ============
export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { message, history } = req.body as { message?: string; history?: Array<{role: string; content: string}> };

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: '缺少 message 参数' });
    }

    const messages = [
      ...(history || []).map(h => ({ role: h.role === 'assistant' ? 'assistant' as const : 'user' as const, content: h.content })),
      { role: 'user' as const, content: message },
    ];

    let reply: string;

    try {
      reply = await callLLMAPI(messages);
    } catch {
      reply = findBestReply(message);
    }

    return res.status(200).json({ reply, success: true });
  } catch (err) {
    console.error('[XiaoZhi] Error:', err);
    return res.status(500).json({ reply: '抱歉，服务暂时不可用，请稍后再试。', success: false });
  }
}
