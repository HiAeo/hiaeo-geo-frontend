/**
 * Vercel Serverless Function - 小智机器人对话接口 v4
 * 纯知识库驱动 - 所有回答内容来自内联知识库
 */

// 内联知识库数据（避免 require/import JSON 在 Serverless 中的兼容问题）
var KB_DATA = {"name":"360智见GEO知识库","version":"2.0.0","defaultReply":"感谢您的提问！我是**小智**，360智见的AI智能助手 🤖\n\n我可以帮您解答以下方面的问题：\n\n| 问题类型 | 示例 |\n|---------|------|\n| 🏢 **产品介绍** | \"360智见是什么？”“有哪些核心模块？” |\n| ⚡ **核心功能** | \"有哪些功能？”“AI可见度诊断怎么做？” |\n| 💰 **收费标准** | \"怎么收费？”“有哪几种方案？” |\n| ⭐ **产品优势** | \"为什么选择360智见？”“和SEO有什么区别？” |\n| 🔧 **使用指南** | \"怎么开始？”“三步操作流程” |\n| 🔒 **数据安全** | \"数据安全吗？”“隐私如何保护？” |\n| 📞 **联系支持** | \"联系方式”“技术咨询” |\n\n您可以随时问我上述任意问题！","qaPairs":[{"id":"pricing","keywords":["收费","多少钱","价格","费用","报价","套餐","付费","资费","怎么卖","售价","收费标准","付费版","要多少钱","刊例价"],"answer":"**360智见GEO收费方案** 💰\n\n## 一、工具版 🔧\n\n> 面向拥有成熟内容团队，寻求高效AI优化工具提效的品牌\n\n**核心权益：**\n- 🤖 **智能内容生产** — 季度1000篇 / 年度4000篇 AI偏好文章生成额度\n- 📚 **核心资产沉淀** — 无限制上传企业知识库（白皮书、手册等）\n- 📊 **数据驱动决策** — 无限制使用关键词裂变与数据监测工具\n- 🚀 **高效分发协同** — 绑定企业自媒体，内容一键同步分发\n\n| 周期 | 刊例价 |\n|------|--------|\n| **季度** | **¥3,299** |\n| **年度** | **¥9,999** |\n\n---\n\n## 二、服务版 👑\n\n> 面向无专门团队或希望一站式获得确定效果的品牌\n\n**核心权益：**\n- 🎯 **专家策略定制** — 分析师人工筛选高价值\"金词\"，定制品牌知识图谱策略\n- ✍️ **AI偏好内容量产** — 不限文章数量，目标\"AI回答排名前三\"\n- 📢 **高权重渠道投放** — 独家高权重三方媒体资源分发\n- ✅ **确定性效果保障** — 3-10个工作日初步达标 + 3个月持续维护\n\n**刊例价一览：**\n\n| 关键词数 | 售卖方式 | 平台数 | 词性 | 刊例价 |\n|---------|---------|-------|------|--------|\n| 1 | 季度 | 1 | 品牌词 | **¥3,000** |\n| 1 | 季度 | 1 | 地区排名词 | **¥4,500** |\n| 1 | 季度 | 1 | 全国排名词 | **¥5,500** |\n| 2 | 季度 | 2 | 品牌词 | **¥4,200** |\n| 2 | 季度 | 2 | 地区排名词 | **¥6,300** |\n| 2 | 季度 | 2 | 全国排名词 | **¥7,700** |\n\n*注：以上为服务版刊例底价，购买服务版需走询价流程，价值较高的关键词按定制化报价下单。*\n\n---\n\n💡 **如何选择？** 有团队选**工具版**自助提效，缺团队选**服务版**全程托管。建议联系销售获取定制方案。"},{"id":"intro","keywords":["什么产品","介绍","简介","概述","概况","是什么","小智是什么","360智见是什么","360智见GEO","ai助手","智能客服"],"answer":"**360智见GEO** — AI生成式引擎优化服务平台 🚀\n\n> 帮助品牌在AI搜索引擎中获得更高可见度和准确曝光\n\n## 两大产品形态\n\n### 🔧 工具版（自助型）\n适合有成熟内容团队的品牌，提供AI内容生成工具和品牌管理后台，自主完成GEO优化。\n\n**核心能力：** AI偏好文章生成 / 知识库管理 / 关键词裂变与监测 / 多平台分发协同\n\n### 👑 服务版（全托管）\n适合无专业团队或希望一站式获得确定效果的品牌，由专业团队全程操盘。\n\n**核心能力：** 专家选词策略 / 不限量AI内容生产 / 高权重渠道投放 / 效果保障承诺\n\n## 售卖价格概览\n| 版本 | 季度价 | 年度价 |\n|------|--------|--------|\n| **工具版** | ¥3,299 | ¥9,999 |\n| **服务版** | ¥3,000起（按关键词数/词性定价，最高¥7,700+） |\n\n💡 详情可提问\"**360智见怎么收费？**\"查看完整报价表"},{"id":"features","keywords":["功能","能做什么","有什么功能","核心功能","主要功能","产品特点","能力","支持什么","可以做什么","360智见功能"],"answer":"**360智见GEO 核心功能一览** ⚡\n\n### 🔧 工具版功能\n\n**1. 智能内容生产**\n- AI偏好文章生成（季度1000篇 / 年度4000篇额度）\n- 生成符合AI搜索引擎偏好的高质量内容\n- 支持批量生产，提升内容产出效率\n\n**2. 核心资产沉淀（知识库）**\n- 无限制上传企业知识素材：白皮书、手册、FAQ等\n- 构建品牌专属的AI信源基石\n- 让AI更准确理解和推荐您的品牌信息\n\n**3. 数据驱动决策**\n- 关键词裂变与数据监测工具\n- 品牌在AI引擎中的可见度追踪\n- 竞品对比分析\n\n**4. 高效分发协同**\n- 绑定企业自媒体账号\n- 内容一键同步分发到多平台\n\n---\n\n### 👑 服务版独有功能\n\n| 功能 | 说明 |\n|------|------|\n| 🎯 **专家策略定制** | 分析师人工筛选\"金词\"，定制知识图谱策略 |\n| ✍️ **不限量AI内容** | 不限文章数量，目标\"AI回答排名前三\" |\n| 📢 **高权重渠道投放** | 独家高权重三方媒体资源分发 |\n| ✅ **效果保障** | 3-10个工作日达标 + 3个月持续维护 |\n\n💡 详情可提问\"**360智见怎么收费？**\"查看完整报价表"},{"id":"knowledge-mgmt","keywords":["知识库","怎么管理","如何配置","如何添加","如何编辑","怎么上传","问答对","设置回答","修改回答","添加知识","更新知识"],"answer":"**知识库管理指南** 📚\n\n### 如何管理问答知识\n\n**第一步：进入后台**\n访问 `/xiaozhi/admin`，输入管理员密码登录\n\n**第二步：编辑知识库**\n在左侧导航选择「**问答知识库**」标签页，你可以：\n- ➕ **新增问答**：填写关键词和对应回答\n- ✏️ **编辑内容**：点击已有条目进行修改\n- 🗑️ **删除条目**：移除不需要的问答\n- ⬆️ **排序调整**：拖拽调整匹配优先级\n\n**第三步：保存生效**\n编辑完成后点击「保存」，新知识立即生效，无需重启\n\n💡 **提示**：关键词越精确，匹配越准确。建议为同一个问题设置多个近义词关键词（如\"收费\"\"价格\"\"多少钱\"）。"},{"id":"integration","keywords":["接入","嵌入","安装","集成","部署","代码","sdk","js代码","iframe","api接口","怎么用","放到网站","嵌入网站","支持哪些平台","微信公众号","钉钉","企业微信","小程序","app"],"answer":"**小智接入指南** 🔌\n\n### 网站嵌入（推荐）\n在您网站的 `</body>` 前添加以下代码：\n\n```html\n<script>\n  (function(){\n    var s=document.createElement('script');\n    s.src='https://www.360zhijiangeo.com/xiaozhi/embed.js';\n    s.async=true;\n    document.head.appendChild(s);\n  })();\n</script>\n```\n\n### 可选配置项\n```html\n<script>\n  window.XIAOZHI_CONFIG = {\n    primaryColor: '#165DFF',   // 主题色\n    title: '小智',             // 机器人名称\n    position: 'right',         // right 或 left\n    welcome: '您好！有什么可以帮您？'\n  };\n</script>\n```\n\n### 支持的平台\n| 平台 | 接入方式 | 状态 |\n|------|---------|------|\n| 🌐 **Web网站** | JS SDK / iframe | ✅ 全部支持 |\n| 📱 **H5移动页** | JS SDK | ✅ 全部支持 |\n| 💬 **微信公众号** | API对接 | 🚧 开发中 |\n| 📦 **钉钉/企微** | Webhook | 🚧 开发中 |\n| 📲 **小程序/App** | REST API | 🚧 开发中 |"},{"id":"advantage","keywords":["优势","优点","强项","为什么选择","为啥选","凭什么","好在哪里","区别于","差异化","领先","相比其他","和其他区别"],"answer":"**为什么选择360智见GEO？** ⭐\n\n### 核心优势\n\n🔹 **双版本灵活选择**\n工具版（¥3299/季起）自助操作 + 服务版（¥3000起）全程托管，适配不同团队规模\n\n🔹 **AI原生内容生成**\n不是传统SEO的关键词堆砌，而是生成符合AI引擎偏好的高质量内容\n\n🔹 **效果可量化追踪**\n关键词裂变监测、品牌可见度数据、排名变化一目了然\n\n🔹 **服务版确定性保障**\n3-10个工作日实现初步达标，提供3个月持续维护周期\n\n🔹 **高权重渠道资源**\n独家高权重三方媒体资源分发，大幅提升内容被AI采信的概率\n\n---\n\n### 工具版 vs 服务版\n| 对比 | 🔧 工具版 | 👑 服务版 |\n|------|---------|----------|\n| 适合对象 | 有成熟内容团队 | 无专业团队 |\n| 内容额度 | 季度1000篇 / 年度4000篇 | 不限数量 |\n| 选词策略 | 自主选词 | 专家人工筛选\"金词\" |\n| 渠道投放 | 自媒体绑定 | 高权重三方媒体 |\n| 效果承诺 | 自助优化 | 达标保证+3月维护 |\n| 起步价 | ¥3,299/季度 | ¥3,000/词/季度 |"},{"id":"security","keywords":["安全吗","数据安全","隐私保护","信息安全","数据泄露","加密","合规","保密","数据存哪里","隐私政策"],"answer":"**数据安全与隐私保障** 🔒\n\n360智见·小智将数据安全视为生命线：\n\n### 安全措施\n- 🔐 **传输加密**：全程 HTTPS/TLS 1.3 加密\n- 🛡️ **存储加密**：数据库AES-256加密存储\n- 👤 **隐私隔离**：不同租户数据严格物理隔离\n- 🚫 **不滥用**：对话数据仅用于服务改进，绝不用于其他用途\n- 📋 **合规认证**：等保三级认证，符合《个人信息保护法》要求\n\n### 数据主权\n- 您的知识库内容和对话记录**100%属于您**\n- 支持一键导出全部数据\n- 支持合同约定数据销毁条款\n\n### 企业级选项\n- ☁️ **私有云部署**：数据不出您的服务器\n- 🏢 **混合部署**：敏感数据本地，AI推理云端\n- 📜 **安全审计日志**：全程操作可追溯\n\n如有特殊安全需求，请联系安全技术团队获取定制方案。"},{"id":"support","keywords":["客服","联系方式","联系电话","邮箱","在线客服","技术支持","帮助中心","问题反馈","报错","故障","人工服务","工单","bug"],"answer":"**联系我们** 📞\n\n### 客服渠道\n- 📧 **邮箱**：xiaozhi-support@360.cn\n- 💬 **在线客服**：页面右下角「联系客服」按钮\n- 📱 **工作时间**：周一至周五 9:00-21:00，周末 10:00-18:00\n\n### 专业技术支持\n- 📖 **帮助文档**\n- 🐛 **问题反馈**：发送邮件至 xiaozhi-support@360.cn\n- 🎬 **视频教程**\n\n### 企业版专享\n- 🎯 专属技术客户经理 1对1 服务\n- ⚡ 优先响应通道（< 30分钟）\n- 🏠 上门实施和培训服务\n- 📞 7×24小时紧急热线\n\n我们承诺：每个问题都会得到回应，每个建议都会被认真对待 ❤️"}]};

// 获取知识库（优先使用前端传入的自定义版本）
function getKB(customKB) {
  if (customKB && Array.isArray(customKB.qaPairs) && customKB.qaPairs.length > 0) {
    return {
      name: customKB.name || KB_DATA.name,
      version: customKB.version || KB_DATA.version,
      defaultReply: customKB.defaultReply || KB_DATA.defaultReply,
      qaPairs: customKB.qaPairs,
    };
  }
  return KB_DATA;
}

// 关键词匹配引擎
function findBestAnswer(message, kb) {
  var text = message.toLowerCase().trim();
  var pairs = kb.qaPairs;

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    var keywords = pair.keywords;
    for (var j = 0; j < keywords.length; j++) {
      if (text.indexOf(keywords[j].toLowerCase()) !== -1) {
        return pair.answer;
      }
    }
  }

  return kb.defaultReply;
}

// LLM API 调用（可选增强）
async function callLLMAPI(messages, kb) {
  try {
    var envApiKey = typeof process !== 'undefined' && process.env ? (process.env.OPENAI_API_KEY || process.env.LLM_API_KEY) : null;
    if (!envApiKey) throw new Error('NO_API_KEY');

    var apiUrl = (typeof process !== 'undefined' && process.env ? process.env.LLM_API_URL : null) || 'https://api.openai.com/v1/chat/completions';
    var model = (typeof process !== 'undefined' && process.env ? process.env.LLM_MODEL : null) || 'gpt-3.5-turbo';

    var qaContext = '';
    var qaPairs = kb.qaPairs;
    for (var i = 0; i < Math.min(qaPairs.length, 20); i++) {
      var p = qaPairs[i];
      qaContext += '关键词: ' + p.keywords.join('、') + '\n回答: ' + p.answer.slice(0, 200) + '...\n\n';
    }

    var systemPrompt = '你是"小智"，360智见的AI智能助手。\n\n参考知识库：\n' + qaContext + '\n请优先基于知识库回答。用中文简洁专业，控制在200字以内。\n不要提及任何外部网站或域名。';

    var resp = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + envApiKey },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!resp.ok) throw new Error('LLM error: ' + resp.status);
    var data = await resp.json();
    return data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : '抱歉，无法获取回复。';
  } catch (e) {
    throw e;
  }
}

// 主入口
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    var body = req.body || {};
    var message = body.message;
    var history = body.history;
    var customKB = body.knowledgeBase;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: '缺少 message 参数' });
    }

    var kb = getKB(customKB);
    var reply = findBestAnswer(message, kb);

    // 如果有 LLM API Key，尝试用 LLM 增强
    try {
      var envApiKey = typeof process !== 'undefined' && process.env
        ? (process.env.OPENAI_API_KEY || process.env.LLM_API_KEY)
        : null;
      if (envApiKey) {
        var messages = [];
        if (Array.isArray(history)) {
          for (var k = 0; k < history.length; k++) {
            messages.push({
              role: history[k].role === 'assistant' ? 'assistant' : 'user',
              content: String(history[k].content || ''),
            });
          }
        }
        messages.push({ role: 'user', content: message });
        reply = await callLLMAPI(messages, kb);
      }
    } catch (llmErr) {
      // LLM不可用时使用知识库结果
    }

    return res.status(200).json({ reply: reply, success: true });
  } catch (err) {
    console.error('[XiaoZhi] Error:', err);
    return res.status(500).json({
      reply: '抱歉，服务暂时不可用，请稍后再试。',
      success: false,
    });
  }
}
