/**
 * 知识库管理接口
 * GET  - 获取当前部署的知识库内容
 */

// @ts-ignore - JSON import
import kbData from '../knowledge-base.json';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();

  // GET: 返回当前知识库
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      data: {
        name: kbData.name,
        version: kbData.version,
        description: kbData.description,
        defaultReply: kbData.defaultReply,
        qaPairs: kbData.qaPairs,
      },
      source: 'deployed',
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

      for (const pair of qaPairs) {
        if (!pair.id || !Array.isArray(pair.keywords) || !pair.answer) {
          return res.status(400).json({
            success: false,
            error: '问答对格式不正确，需要 id、keywords(数组)、answer',
          });
        }
      }

      const updatedKb = {
        name: kbData.name,
        version: kbData.version,
        description: kbData.description,
        defaultReply: defaultReply || kbData.defaultReply,
        qaPairs,
        lastUpdated: new Date().toISOString(),
      };

      // 尝试写入 Vercel Blob（如果配置了 Token）
      try {
        var blobToken = typeof process !== 'undefined' && process.env ? process.env.BLOB_READ_WRITE_TOKEN : null;
        if (blobToken) {
          var { put } = require('@vercel/blob');
          var blob = await put(
            'xiaozhi/knowledge-base.json',
            JSON.stringify(updatedKb, null, 2),
            { access: 'public', token: blobToken }
          );
          return res.status(200).json({ success: true, message: '已保存到云存储', url: blob.url });
        }
      } catch (blobErr) {
        console.error('[KB] Blob write failed:', blobErr);
      }

      // 无存储后端时返回数据供前端使用
      return res.status(200).json({
        success: true,
        message: '知识库已更新（本地模式）',
        data: updatedKb,
        mode: 'local',
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: '保存失败' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
