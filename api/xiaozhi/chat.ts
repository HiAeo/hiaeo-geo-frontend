/**
 * Vercel Serverless Function - 小智机器人对话接口 v4
 * 纯知识库驱动 - 所有回答内容来自 knowledge-base.json 或前端传入的自定义知识库
 */

import knowledgeBase from './knowledge-base.json';

// ========== 类型定义 ==========
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

// ========== 获取知识库 ==========
function getKB(customKB?: any): KnowledgeBase {
  if (customKB && Array.isArray(customKB.qaPairs) && customKB.qaPairs.length > 0) {
    return {
      name: customKB.name || knowledgeBase.name,
      version: customKB.version || knowledgeBase.version,
      description: customKB.description || knowledgeBase.description,
      defaultReply: customKB.defaultReply || knowledgeBase.defaultReply,
      qaPairs: customKB.qaPairs,
    };
  }
  return knowledgeBase as KnowledgeBase;
}

// ========== 匹配引擎 ==========
function findBestAnswer(message: string, kb: KnowledgeBase): string {
  const text = message.toLowerCase().trim();

  for (const pair of kb.qaPairs) {
    for (const keyword of pair.keywords) {
      if (text.indexOf(keyword.toLowerCase()) !== -1) {
        return pair.answer;
      }
    }
  }

  return kb.defaultReply;
}

// ========== LLM API（可选增强） ==========
async function callLLMAPI(messages: Array<{role: string; content: string}>): Promise<string> {
  // @ts-ignore
  const apiKey = process.env?.OPENAI_API_KEY || process.env?.LLM_API_KEY;
  if (!apiKey) throw new Error('NO_API_KEY');

  // @ts-ignore
  const apiUrl = process.env?.LLM_API_URL || 'https://api.openai.com/v1/chat/completions';
  // @ts-ignore
  const model = process.env?.LLM_MODEL || 'gpt-3.5-turbo';

  // 构建系统提示词，注入知识库上下文
  const qaContext = kb.qaPairs
    .slice(0, 20)
    .map(p => `关键词: ${p.keywords.join('、')}\n回答: ${p.answer.slice(0, 200)}...`)
    .join('\n\n');

  const systemPrompt = `你是"小智"，360智见的AI智能助手。
以下是你参考的知识库内容：
${qaContext}

请优先基于以上知识库回答。如果知识库中有匹配的内容，直接使用；如果没有相关内容，友好地说明并引导用户。
回答用中文，简洁专业，控制在200字以内。
不要提及任何外部网站或域名。`;

  const resp = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!resp.ok) throw new Error('LLM error: ' + resp.status);

  const data = await resp.json() as any;
  return data.choices && data.choices[0] && data.choices[0].message
    ? data.choices[0].message.content
    : '抱歉，无法获取回复。';
}

// ========== 主入口 ==========
export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body || {};
    const message = body.message;
    const history = body.history;
    const customKB = body.knowledgeBase; // 前端可传入自定义知识库（localStorage中的编辑版本）

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: '缺少 message 参数' });
    }

    // 获取知识库（优先使用前端传入的自定义版本）
    const kb = getKB(customKB);

    // 先用知识库匹配
    let reply = findBestAnswer(message, kb);

    // 如果有 LLM API Key，尝试用 LLM 增强回复
    try {
      // @ts-ignore
      if (process.env?.OPENAI_API_KEY || process.env?.LLM_API_KEY) {
        const messages = [];
        if (Array.isArray(history)) {
          for (const h of history) {
            messages.push({
              role: h.role === 'assistant' ? 'assistant' : 'user',
              content: String(h.content || ''),
            });
          }
        }
        messages.push({ role: 'user' as const, content: message });
        reply = await callLLMAPI(messages);
      }
    } catch (e) {
      // LLM不可用时使用知识库结果（已在上面的findBestAnswer获取）
    }

    return res.status(200).json({ reply, success: true });
  } catch (err) {
    console.error('[XiaoZhi] Error:', err);
    return res.status(500).json({
      reply: '抱歉，服务暂时不可用，请稍后再试。',
      success: false,
    });
  }
}
