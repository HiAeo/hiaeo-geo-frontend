/**
 * 知识库管理接口
 * GET  - 获取当前部署的知识库内容
 */

// 内联知识库数据（与 chat.ts 保持一致）
var KB_DATA = {"name":"360智见小智知识库","version":"1.0.0","defaultReply":"感谢您的提问！我是**小智**，360智见的AI智能助手 🤖\n\n我可以帮您解答以下方面的问题：\n\n| 问题类型 | 示例 |\n|---------|------|\n| 🤖 **小智介绍** | \"小智是什么？\" |\n| 💰 **收费标准** | \"怎么收费？\" |\n| 🔧 **功能说明** | \"知识库怎么管理？\" |\n| ⚡ **接入方式** | \"怎么嵌入网站？\" |\n| 📞 **联系支持** | \"联系方式\" |","qaPairs":[{"id":"pricing","keywords":["收费","多少钱","价格","费用","报价","套餐","付费","资费","免费试用","免费吗","体验版","标准版","高级版"],"answer":"**360智见·小智能收费方案** 💰\n\n| 版本 | 适用对象 | 核心能力 |\n|------|---------|----------|\n| 🆓 **体验版** | 个人用户/试用 | 基础对话+预设知识库（免费） |\n| ⭐ **标准版** | 小型团队 | 自定义知识库+访客统计+样式定制 |\n| 🚀 **专业版** | 企业客户 | 无限知识库+API接口+多坐席+高级分析 |\n\n- ✅ 体验版完全免费\n- ✅ 所有版本14天全功能试用\n- ✅ 专业版支持私有化部署和定制开发"},{"id":"intro","keywords":["介绍","简介","是什么","小智是什么","ai助手","智能客服","聊天机器人"],"answer":"**360智见·小智** 是一款企业级AI智能对话机器人 🤖\n\n- 🧠 基于360大模型驱动的自然语言理解\n- 📚 知识库驱动，管理员可自定义问答内容\n- 🎨 多场景适配：网站嵌入/独立页面/API接入\n- 📊 实时对话统计与热门问题分析"},{"id":"features","keywords":["功能","能做什么","有什么功能","核心功能","能力","支持什么","可以做什么"],"answer":"**小智核心功能：**\n1. 📚 知识库管理 — 自定义问答/TXT PDF导入/URL抓取\n2. 🗣️ 智能对话 — 意图识别/模糊匹配/多轮对话\n3. 🎨 外观定制 — 主题色/头像名称/欢迎语配置\n4. 📈 数据统计 — 对话量趋势/热门问题Top10/满意度追踪\n5. 🔌 接入方式 — JS SDK(3行代码)/iframe/REST API"},{"id":"integration","keywords":["接入","嵌入","安装","集成","部署","sdk","js代码","iframe","api接口","怎么用","支持哪些平台"],"answer":"**小智接入指南：**\n\n网站嵌入（推荐）：在 `</body>` 前添加 JS SDK 即可，3行代码搞定。\n\n支持平台：Web网站 ✅ / H5移动页 ✅ / 微信公众号 🚧开发中 / 钉钉企微 🚧开发中 / 小程序App 🚧开发中"},{"id":"advantage","keywords":["优势","优点","为什么选择","好在哪里","区别于","领先","比其他好在哪里"],"answer":"**为什么选择小智：**\n🔹 360大模型驱动，中文理解领先\n🔹 开箱即用，5分钟部署\n🔹 知识库自主可控\n🔹 数据安全加密，支持私有化部署\n🔹 体验版永久免费，付费版仅传统客服系统1/10"},{"id":"security","keywords":["安全吗","数据安全","隐私保护","加密","合规","保密"],"answer":"**安全保障：**\n🔐 HTTPS/TLS 1.3 传输加密\n🛡️ AES-256 存储加密\n👤 租户数据物理隔离\n📋 等保三级认证，符合《个人信息保护法》\n☁️ 支持私有云部署选项"},{"id":"support","keywords":["客服","联系方式","邮箱","技术支持","帮助中心","报错","故障"],"answer":"**联系我们：**\n📧 邮箱: xiaozhi-support@360.cn\n💬 在线客服: 页面右下角按钮\n📱 工作时间: 周一至周五 9:00-21:00, 周末 10:00-18:00\n企业版专享: 1对1技术经理 / <30分钟响应 / 7×24紧急热线"}]};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      data: KB_DATA,
      source: 'deployed',
    });
  }

  if (req.method === 'POST') {
    try {
      var body = req.body || {};
      var qaPairs = body.qaPairs;
      var defaultReply = body.defaultReply;

      if (!Array.isArray(qaPairs)) {
        return res.status(400).json({ success: false, error: 'qaPairs 必须是数组' });
      }

      for (var i = 0; i < qaPairs.length; i++) {
        var pair = qaPairs[i];
        if (!pair.id || !Array.isArray(pair.keywords) || !pair.answer) {
          return res.status(400).json({ success: false, error: '格式错误: 需要 id, keywords(数组), answer' });
        }
      }

      var updatedKb = {
        name: KB_DATA.name,
        version: KB_DATA.version,
        description: KB_DATA.description || '',
        defaultReply: defaultReply || KB_DATA.defaultReply,
        qaPairs: qaPairs,
        lastUpdated: new Date().toISOString(),
      };

      return res.status(200).json({
        success: true,
        message: '已更新',
        data: updatedKb,
        mode: 'local',
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: String(err) });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
