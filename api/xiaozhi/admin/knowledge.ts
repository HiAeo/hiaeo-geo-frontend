/**
 * 知识库管理接口
 * GET  - 获取当前部署的知识库内容
 * POST - 更新知识库（需配置 BLOB_READ_WRITE_TOKEN 或返回导出数据）
 */

import knowledgeBase from '../knowledge-base.json';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();

  // GET: 返回当前知识库
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      data: {
        name: knowledgeBase.name,
        version: knowledgeBase.version,
        description: knowledgeBase.description,
        defaultReply: knowledgeBase.defaultReply,
        qaPairs: knowledgeBase.qaPairs,
      },
      source: 'deployed', // 标识来源是部署文件
      note: '这是当前线上生效的知识库版本。如需修改，请通过后台编辑后保存。',
    });
  }

  // POST: 更新知识库
  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const { qaPairs, defaultReply } = body;

      if (!Array.isArray(qaPairs)) {
        return res.status(400).json({ success: false, error: 'qaPairs 必须是数组' });
      }

      // 验证每条问答对格式
      for (const pair of qaPairs) {
        if (!pair.id || !Array.isArray(pair.keywords) || !pair.answer) {
          return res.status(400).json({
            success: false,
            error: `问答对 "${pair.id || '(未命名)'}" 格式不正确，需要 id、keywords(数组)、answer`,
          });
        }
      }

      const updatedKb = {
        name: knowledgeBase.name,
        version: knowledgeBase.version,
        description: knowledgeBase.description,
        defaultReply: defaultReply || knowledgeBase.defaultReply,
        qaPairs,
        lastUpdated: new Date().toISOString(),
      };

      // 尝试写入 Vercel Blob（如果配置了 Token）
      // @ts-ignore
      const blobToken = process.env?.BLOB_READ_WRITE_TOKEN;
      if (blobToken) {
        try {
          const { put } = await import('@vercel/blob');
          const blob = await put(
            'xiaozhi/knowledge-base.json',
            JSON.stringify(updatedKb, null, 2),
            { access: 'public', token: blobToken }
          );
          return res.status(200).json({
            success: true,
            message: '知识库已保存到云存储',
            url: blob.url,
          });
        } catch (blobErr) {
          console.error('[KB] Blob write failed:', blobErr);
          // fallback 到返回数据让前端处理
        }
      }

      // 无存储后端时：返回完整数据供前端使用
      // 前端会将此数据存入 localStorage，并在请求时附带
      return res.status(200).json({
        success: true,
        message: '知识库已更新（本地模式）',
        data: updatedKb,
        mode: 'local',
        hint: '当前未配置云端存储。知识库将保存在浏览器本地。如需永久生效，请联系管理员配置 BLOB_READ_WRITE_TOKEN 或重新部署。',
      });
    } catch (err) {
      console.error('[KB] Save error:', err);
      return res.status(500).json({ success: false, error: '保存失败' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
