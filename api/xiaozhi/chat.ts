/**
 * Vercel Serverless Function - 小智机器人对话接口 v4
 * 纯知识库驱动 - 所有回答内容来自 knowledge-base.json
 */

// @ts-ignore
var kbData = require('./knowledge-base.json');

interface QAPair {
  id: string;
  keywords: string[];
  answer: string;
}

interface KnowledgeBase {
  name: string;
  version: string;
  description: string;
  defaultReply: string;
  qaPairs: QAPair[];
}

// 获取知识库（优先使用前端传入的自定义版本）
function getKB(customKB?: any): KnowledgeBase {
  if (customKB && Array.isArray(customKB.qaPairs) && customKB.qaPairs.length > 0) {
    return {
      name: customKB.name || kbData.name,
      version: customKB.version || kbData.version,
      description: customKB.description || kbData.description,
      defaultReply: customKB.defaultReply || kbData.defaultReply,
      qaPairs: customKB.qaPairs,
    };
  }
  return kbData as KnowledgeBase;
}

// 关键词匹配引擎
function findBestAnswer(message: string, kb: KnowledgeBase): string {
  var text = message.toLowerCase().trim();

  for (var i = 0; i < kb.qaPairs.length; i++) {
    var pair = kb.qaPairs[i];
    for (var j = 0; j < pair.keywords.length; j++) {
      if (text.indexOf(pair.keywords[j].toLowerCase()) !== -1) {
        return pair.answer;
      }
    }
  }

  return kb.defaultReply;
}

// LLM API 调用（可选增强）
async function callLLMAPI(messages: Array<{role: string; content: string}>, kb: KnowledgeBase): Promise<string> {
  var apiKey = (typeof process !== 'undefined' && process.env ? process.env.OPENAI_API_KEY : null)
            || (typeof process !== 'undefined' && process.env ? process.env.LLM_API_KEY : null);

  if (!apiKey) throw new Error('NO_API_KEY');

  var apiUrl = (typeof process !== 'undefined' && process.env ? process.env.LLM_API_URL : null) || 'https://api.openai.com/v1/chat/completions';
  var model = (typeof process !== 'undefined' && process.env ? process.env.LLM_MODEL : null) || 'gpt-3.5-turbo';

  var qaContext = '';
  for (var i = 0; i < Math.min(kb.qaPairs.length, 20); i++) {
    var p = kb.qaPairs[i];
    qaContext += '关键词: ' + p.keywords.join('、') + '\n回答: ' + p.answer.slice(0, 200) + '...\n\n';
  }

  var systemPrompt = '你是"小智"，360智见的AI智能助手。\n\n以下是你参考的知识库内容：\n' + qaContext + '\n请优先基于以上知识库回答。如果知识库中有匹配的内容，直接使用；如果没有相关内容，友好地说明并引导用户。\n回答用中文，简洁专业，控制在200字以内。\n不要提及任何外部网站或域名。';

  var resp = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
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

  var data = await resp.json() as any;
  return data.choices && data.choices[0] && data.choices[0].message
    ? data.choices[0].message.content
    : '抱歉，无法获取回复。';
}

// 主入口
export default async function handler(req: any, res: any) {
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
      var envApiKey = (typeof process !== 'undefined' && process.env ? process.env.OPENAI_API_KEY : null)
                     || (typeof process !== 'undefined' && process.env ? process.env.LLM_API_KEY : null);
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
    } catch (e) {
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
