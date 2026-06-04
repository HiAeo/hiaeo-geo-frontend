/**
 * Vercel Serverless Function - 小智机器人对话接口
 * 内置知识库 + 智能关键词匹配引擎 v3（稳定版）
 */

// ========== 知识库 ==========
interface KBRule {
  keys: string[];   // 任一命中即匹配（OR关系）
  reply: string;
}

// 按优先级排列的规则列表（先匹配先生效）
const RULES: KBRule[] = [
  // ---- P1: 定价/收费 ----
  {
    keys: ['收费', '多少钱', '价格', '费用', '报价', '套餐', '付费', '资费', '免费试用', '免费吗', '体验版怎么', '工具版', '企业版怎么', '专业版怎么', '会员费', '订阅费', '年费', '月费', '按效果付费'],
    reply: '**360智见定价方案** 💰\n\n我们提供三种版本，满足不同规模企业的需求：\n\n| 版本 | 适用对象 | 核心能力 |\n|------|---------|---------|\n| 🆓 **体验版** | 初创团队/个人 | 基础诊断 + 月度报告 |\n| ⭐ **专业版** | 成长型企业 | 全套GEO工具 + AI策略生成 |\n| 🏢 **企业版** | 大型品牌/集团 | 定制方案 + 专属客户成功经理 |\n\n**特色服务模式：**\n- ✅ 支持**按效果付费** — 为实际优化成果买单\n- ✅ 提供**14天免费试用**，全功能体验\n- ✅ 企业版支持**定制化部署**和**私有化方案**\n\n💡 具体价格因功能模块和用量而异，建议您先用**体验版**免费了解平台能力，访问 **www.modelbuddy.net** 或联系销售获取专属报价。',
  },

  // ---- P2: GEO概念 ----
  {
    keys: ['什么是geo', 'geo是什么', 'geo定义', 'geo概念', '生成式引擎优化', 'generative engine optimization', 'geo和seo区别', 'geo vs seo', 'geo与seo', 'ai搜索优化', 'ai引擎优化', 'ai可见度'],
    reply: '**GEO（Generative Engine Optimization / 生成式引擎优化）** 🌐\n\n是一种全新的数字营销方法论，目标是让品牌在**AI搜索引擎的直接回答中被推荐和引用**。\n\n## GEO vs 传统SEO\n\n| 维度 | 传统SEO | GEO |\n|------|---------|-----|\n| 🎯 目标 | 搜索结果页排名 | AI生成的回答中被引用 |\n| 📝 手段 | 关键词、外链、技术优化 | 品牌实体建设、结构化内容、权威引用 |\n| 📊 衡量 | 排名位置、点击量 | 引用率、推荐率、情感正负 |\n| 🤖 场景 | Google/Baidu搜索结果页 | ChatGPT/360AI/Google AI Overview |\n\n**简单理解**：SEO是让用户搜到你，GEO是让**AI推荐你**。随着AI搜索普及，GEO已成为企业数字营销的新必修课。\n\n💡 **360智见**可以帮您一站式完成GEO优化！',
  },

  // ---- P2: 产品功能 ----
  {
    keys: ['什么产品', '产品介绍', '产品简介', '产品概述', '产品概况', '有哪些功能', '什么功能', '核心功能', '主要功能', '产品特点', '模镜', 'miraseek', '模豆', 'miramod', '模法', 'miramag', '魔鲸hub', '驾驶舱', '数据中枢', '四大模块', '4大模块', '360智见平台', '360智见系统'],
    reply: '**360智见（ModelBuddy）** 是国内首个面向企业的AI生成式引擎优化（GEO）全闭环SaaS平台。\n\n## 🎯 四大核心模块\n\n### 1️⃣ 模镜 MiraSeek — AI可见度诊断\n- 7维度品牌健康评分体系\n- AI可见度全方位检测与竞品对比\n\n### 2️⃣ 模豆 MiraMod — 智能策略生成\n- AI驱动的GEO优化策略自动生成\n- 多场景定制化方案 + 效果预测\n\n### 3️⃣ 模法 MiraMag — 内容生成执行\n- 自动化GEO友好内容生产\n- 多渠道分发管理与效果追踪\n\n### 4️⃣ 魔鲸Hub — 统一管理驾驶舱\n- 实时数据看板 + 趋势预警\n- 全局ROI评估与决策支持\n\n> 🔗 访问 **www.modelbuddy.net** 开启您的GEO优化之旅！',
  },

  // ---- P3: 优化方法 ----
  {
    keys: ['如何提升', '怎么提升', '如何提高', '怎么提高', '如何优化', '怎么优化', '优化方法', '优化技巧', '最佳实践', 'best practice', '提升可见度', '提高可见度', '提升ai搜索', '被ai推荐', '增加曝光', '怎么做geo', '开始优化', '入手geo'],
    reply: '**提升AI搜索可见度的核心方法** 🚀\n\n### 1. 品牌实体建设 🏢\n- 完善企业基础信息（官网、百科、工商信息一致）\n- 统一品牌名称和定位表述，让AI"认识"你\n- 在权威平台建立品牌档案\n\n### 2. 内容质量优化 📝\n- 创作结构化、事实性强的内容（FAQ、列表、表格格式）\n- 围绕用户真实问题创作\n- 保持定期更新，维持活跃度信号\n\n### 3. 权威引用积累 📎\n- 获得行业媒体和权威网站的引用/提及\n- 参与行业标准制定或白皮书发布\n\n### 4. 技术层面 ⚙️\n- Schema.org结构化数据标记\n- 语义化HTML + 快速加载\n\n> ✨ **360智见**可以自动化完成以上大部分工作！输入网址即可一键开启 🔄',
  },

  // ---- P3: 产品优势 ----
  {
    keys: ['优势', '优点', '强项', '竞争力', '为什么选择', '为啥选', '凭什么', '好在哪里', '区别于', '差异化', '独特之处', '首家', '首创', '领先'],
    reply: '**为什么选择360智见？** ⭐\n\n### 核心优势\n\n🔹 **国内首个GEO SaaS平台**\n专注中国市场和AI搜索生态，深度适配360AI搜索、百度文心一言等国产AI引擎\n\n🔹 **全闭环自动化**\n从诊断→策略→内容→监控，一键串联，80%工作由AI自动完成\n\n🔹 **7维度科学诊断体系**\n行业最全面的GEO健康评估模型（品牌识别、产品关联、情感分析、竞品压制、内容覆盖、官网引流、更新活跃）\n\n🔹 **魔鲸Hub数据中枢**\n所有数据汇聚统一看板，实时监控+智能预警+自动优化建议\n\n🔹 **按效果付费模式**\n不为承诺买单，只为成果付费\n\n💬 **一句话总结**：360智见让GEO优化像呼吸一样简单 — 输入网址，AI搞定其余。',
  },

  // ---- P4: 使用流程 ----
  {
    keys: ['怎么使用', '如何使用', '使用方法', '操作流程', '使用步骤', '快速上手', '入门指南', '新手教程', '三步', '使用教程', '注册开通', '从哪开始'],
    reply: '**360智见使用指南 — 三步开启GEO优化** 📋\n\n### 第一步：输入网址 → AI自动填写品牌智库\n输入官网URL，小智自动抓取并预填80%信息，您只需审核确认\n\n### 第二步：一键开启闭环优化\n1. **模镜诊断** → 7维度健康评分\n2. **模豆策略** → AI生成优化方案\n3. **模法执行** → 自动创建并发布内容\n4. **魔鲸监控** → 实时追踪效果数据\n\n### 第三步：监控看板 → 自动持续优化\n- 📊 实时数据看板\n- ⏰ 定时任务自动重新诊断\n- 💡 智能推送优化建议\n\n> 🚀 现在就开始：访问 **www.modelbuddy.net** ，30秒完成注册！',
  },

  // ---- P4: 诊断体系 ----
  {
    keys: ['诊断体系', '7维度', '七维度', '健康分', 'd1 ', 'd2 ', 'd3 ', 'd4 ', 'd5 ', 'd6 ', 'd7 ', '品牌识别准确率', '产品关联度', '正面情感', '竞品压制', '内容覆盖度', '官网引流率', '更新活跃度', '体检品牌', '扫描品牌'],
    reply: '**360智见7维度诊断体系** 🔍\n\n我们的AI诊断引擎从以下7个维度评估品牌GEO健康状况：\n\n| 维度 | 代号 | 权重 | 说明 |\n|------|------|------|------|\n| 品牌实体识别准确率 | D1 | 15% | AI能否正确识别您的品牌 |\n| 产品关联度 | D2 | 15% | AI是否将品牌与正确产品关联 |\n| 正面情感占比 | D3 | 10% | AI评价的情感倾向是否积极 |\n| 竞品压制指数 | D4 | 15% | 相对竞品的推荐表现 |\n| 内容覆盖度 | D5 | 15% | 内容被AI引用的范围频率 |\n| 官网引流率 | D6 | 15% | 从AI搜索引导至官网的效率 |\n| 更新活跃度 | D7 | 15% | 内容更新频率和新鲜度 |\n\n每个维度给出具体分数+改进建议。输入网址即可**免费获取诊断报告** → **www.modelbuddy.net**',
  },

  // ---- P5: 安全隐私 ----
  {
    keys: ['安全吗', '数据安全', '隐私保护', '信息安全', '数据泄露', '加密', '合规', 'gdpr', '保密'],
    reply: '**数据安全与隐私保障** 🔒\n\n360智见非常重视用户数据安全：\n\n- 🔐 **传输加密**：全程SSL/TLS加密\n- 🛡️ **存储安全**：企业级数据库加密存储\n- 👤 **隐私保护**：品牌数据和策略严格保密\n- 📋 **合规认证**：符合国家网络安全法要求\n- 🚫 **不共享**：绝不向第三方透露任何客户数据\n\n金融、医疗等特殊行业可提供**定制化安全方案**和**私有化部署**。如有疑虑请联系安全技术团队详询。',
  },

  // ---- P5: 合作代理 ----
  {
    keys: ['合作', '代理商', '渠道合作', '加盟', '伙伴计划', '推广联盟', '分销', '成为代理'],
    reply: '**合作与渠道计划** 🤝\n\n### 合作类型\n- 🏢 **区域代理**：特定城市独家代理权\n- 📈 **SI合作伙伴**：联合服务大客户\n- 🎓 **教育培训合作**：高校课程合作\n- 📢 **推广联盟**：按成交佣金结算\n\n### 合作权益\n✅ 丰厚返佣政策 | ✅ 销售工具包+培训 | ✅ 专人对接 | ✅ 联合推广资源\n\n📩 有意向请发送邮件至 **partner@modelbuddy.net** 或访问 **www.modelbuddy.net** 留言，商务团队24小时内联系您。',
  },

  // ---- P5: 联系支持 ----
  {
    keys: ['客服', '联系方式', '联系电话', '邮箱', '在线客服', '技术支持', '帮助中心', '问题反馈', '报错', '故障', '人工服务', '工单'],
    reply: '**联系我们** 📞\n\n### 客服渠道\n- 📧 **邮箱**：support@modelbuddy.net\n- 💬 **在线客服**：www.modelbuddy.net 右下角悬浮按钮\n- 📱 **工作时间**：周一至周五 9:00-18:00\n\n### 企业版专享\n- 🎯 专属客户成功经理 1对1 服务\n- ⚡ 优先响应通道（< 2小时）\n- 📞 400热线直连技术专家\n\n👉 帮助中心：**www.modelbuddy.net/help**\n\n紧急问题请发送邮件注明"紧急"，我们会优先处理。',
  },
];

// ========== 默认回复 ==========
const DEFAULT_REPLY = [
  '感谢您的提问！我是**小智**，360智见的AI智能助手 🤖',
  '',
  '我可以帮您解答以下方面的问题：',
  '',
  '| 问题类型 | 示例 |',
  '|---------|------|',
  '| 🌐 **GEO概念** | "什么是GEO？""GEO和SEO有什么区别？" |',
  '| 🎯 **产品功能** | "360智见有哪些功能？""介绍一下模镜" |',
  '| 💰 **定价方案** | "怎么收费？""有免费试用吗？" |',
  '| 🚀 **优化方法** | "如何提升AI搜索可见度？" |',
  '| 📋 **使用流程** | "怎么使用？" |',
  '| 🔍 **诊断体系** | "7维度包括什么？" |',
  '',
  '您可以随时问我上述任意问题！',
  '',
  '💡 如需更深入的咨询，欢迎访问 **www.modelbuddy.net**',
].join('\n');

// ========== 匹配引擎 ===========
function findBestReply(message: string): string {
  const text = message.toLowerCase().trim();

  for (const rule of RULES) {
    for (const key of rule.keys) {
      if (text.indexOf(key.toLowerCase()) !== -1) {
        return rule.reply;
      }
    }
  }

  return DEFAULT_REPLY;
}

// ========== LLM API（可选） ==========
async function callLLMAPI(messages: Array<{role: string; content: string}>): Promise<string> {
  // @ts-ignore
  const apiKey = process.env?.OPENAI_API_KEY || process.env?.LLM_API_KEY;
  if (!apiKey) throw new Error('NO_API_KEY');

  // @ts-ignore
  const apiUrl = process.env?.LLM_API_URL || 'https://api.openai.com/v1/chat/completions';
  // @ts-ignore
  const model = process.env?.LLM_MODEL || 'gpt-3.5-turbo';

  const resp = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: '你是"小智"，360智见的AI智能助手。用中文简洁友好地回答关于GEO(生成式引擎优化)、360智见产品、AI搜索优化的问题。回答控制在200字以内。' },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!resp.ok) throw new Error('LLM error: ' + resp.status);

  const data = await resp.json() as any;
  return data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : '抱歉，无法获取回复。';
}

// ========== 主入口 ==========
export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body || {};
    const message = body.message;
    const history = body.history;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: '缺少 message 参数' });
    }

    const messages = [];
    if (Array.isArray(history)) {
      for (const h of history) {
        messages.push({
          role: h.role === 'assistant' ? 'assistant' : 'user',
          content: String(h.content || ''),
        });
      }
    }
    messages.push({ role: 'user', content: message });

    var reply = '';

    try {
      reply = await callLLMAPI(messages);
    } catch (e) {
      reply = findBestReply(message);
    }

    return res.status(200).json({ reply: reply, success: true });
  } catch (err) {
    return res.status(500).json({ reply: '抱歉，服务暂时不可用，请稍后再试。', success: false });
  }
}
