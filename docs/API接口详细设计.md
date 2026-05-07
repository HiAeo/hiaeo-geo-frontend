# 魔鲸GEO API接口详细设计

## 1. API规范

### 1.1 基础规范

| 项目 | 规范 |
|------|------|
| 基础URL | `https://api.hiaeo.cn/v1` |
| 协议 | HTTPS |
| 数据格式 | JSON |
| 字符编码 | UTF-8 |
| 认证方式 | Bearer Token (JWT) |

### 1.2 请求规范

```http
POST /v1/auth/login HTTP/1.1
Host: api.hiaeo.cn
Content-Type: application/json
Authorization: Bearer <token>
X-Request-ID: <uuid>
X-Language: zh-CN
```

### 1.3 响应规范

```json
{
  "success": true,
  "code": 0,
  "message": "操作成功",
  "data": {},
  "timestamp": 1707123456789,
  "request_id": "req_abc123"
}
```

### 1.4 错误码规范

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 10001 | 参数错误 |
| 10002 | 签名错误 |
| 20001 | 未授权 |
| 20002 | 登录过期 |
| 20003 | 权限不足 |
| 30001 | 资源不存在 |
| 40001 | 业务错误 |
| 50001 | 服务器错误 |

---

## 2. 认证模块 (Auth)

### 2.1 发送验证码

```
POST /v1/auth/sms/send
```

**请求参数：**
```json
{
  "phone": "13800138000",
  "type": "login | register | reset_password"
}
```

**响应：**
```json
{
  "success": true,
  "code": 0,
  "message": "验证码已发送",
  "data": {
    "expires_in": 300,
    "remain_count": 5
  }
}
```

### 2.2 用户注册

```
POST /v1/auth/register
```

**请求参数：**
```json
{
  "phone": "13800138000",
  "code": "123456",
  "password": "Abc123456",
  "company_name": "示例科技有限公司",
  "company_domain": "https://www.example.com",
  "industry": "科技",
  "utm_source": "baidu",
  "utm_medium": "cpc",
  "utm_campaign": "geo品牌词"
}
```

**响应：**
```json
{
  "success": true,
  "code": 0,
  "message": "注册成功",
  "data": {
    "user_id": "u_abc123",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 7200,
    "user": {
      "id": "u_abc123",
      "phone": "138****8000",
      "company_name": "示例科技有限公司",
      "role": "user"
    }
  }
}
```

### 2.3 用户登录

```
POST /v1/auth/login
```

**请求参数：**
```json
{
  "phone": "13800138000",
  "password": "Abc123456"
}
```

**响应：**
```json
{
  "success": true,
  "code": 0,
  "message": "登录成功",
  "data": {
    "user_id": "u_abc123",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 7200,
    "user": {
      "id": "u_abc123",
      "phone": "138****8000",
      "company_name": "示例科技有限公司",
      "subscription": {
        "package": "professional",
        "expires_at": "2027-01-01T00:00:00Z"
      }
    }
  }
}
```

### 2.4 刷新Token

```
POST /v1/auth/refresh
```

**请求参数：**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**响应：**
```json
{
  "success": true,
  "code": 0,
  "message": "刷新成功",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 7200
  }
}
```

### 2.5 退出登录

```
POST /v1/auth/logout
```

**响应：**
```json
{
  "success": true,
  "code": 0,
  "message": "退出成功"
}
```

### 2.6 获取当前用户信息

```
GET /v1/auth/me
```

**响应：**
```json
{
  "success": true,
  "code": 0,
  "data": {
    "id": "u_abc123",
    "phone": "138****8000",
    "email": "user@example.com",
    "nickname": "张三",
    "avatar_url": "https://cdn.hiaeo.cn/avatar/xxx.jpg",
    "company_name": "示例科技有限公司",
    "company_domain": "https://www.example.com",
    "industry": "科技",
    "role": "user",
    "subscription": {
      "id": "sub_123",
      "package": {
        "code": "professional",
        "name": "专业版",
        "tier": "professional"
      },
      "status": "active",
      "expires_at": "2027-01-01T00:00:00Z",
      "limits": {
        "diagnose_engines": 6,
        "diagnose_questions": 100,
        "content_limit_monthly": 100,
        "competitor_limit": 3
      }
    },
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

## 3. 用户模块 (User)

### 3.1 更新用户信息

```
PUT /v1/users/profile
```

**请求参数：**
```json
{
  "email": "user@example.com",
  "nickname": "张三",
  "avatar_url": "https://cdn.hiaeo.cn/avatar/xxx.jpg"
}
```

**响应：**
```json
{
  "success": true,
  "code": 0,
  "message": "更新成功",
  "data": {
    "id": "u_abc123",
    "email": "user@example.com",
    "nickname": "张三",
    "avatar_url": "https://cdn.hiaeo.cn/avatar/xxx.jpg"
  }
}
```

### 3.2 修改密码

```
PUT /v1/users/password
```

**请求参数：**
```json
{
  "old_password": "OldPass123",
  "new_password": "NewPass123"
}
```

**响应：**
```json
{
  "success": true,
  "code": 0,
  "message": "密码修改成功"
}
```

### 3.3 重置密码

```
POST /v1/users/password/reset
```

**请求参数：**
```json
{
  "phone": "13800138000",
  "code": "123456",
  "new_password": "NewPass123"
}
```

---

## 4. 诊断模块 (Diagnose)

### 4.1 发起诊断

```
POST /v1/diagnose
```

**请求参数：**
```json
{
  "company_name": "示例科技有限公司",
  "company_domain": "https://www.example.com",
  "industry": "科技",
  "competitors": [
    "竞品A",
    "竞品B"
  ],
  "engines": ["deepseek", "doubao", "ernie", "kimi", "tongyi", "zhipu"],
  "question_count": 50,
  "priority": "balanced | speed | depth"
}
```

**响应：**
```json
{
  "success": true,
  "code": 0,
  "message": "诊断任务已创建",
  "data": {
    "report_id": "rpt_abc123",
    "report_no": "DIA20240101000001",
    "status": "pending",
    "estimated_time": 300,
    "progress_url": "/v1/diagnose/rpt_abc123/progress"
  }
}
```

### 4.2 查询诊断进度

```
GET /v1/diagnose/{report_id}/progress
```

**响应：**
```json
{
  "success": true,
  "code": 0,
  "data": {
    "report_id": "rpt_abc123",
    "status": "running",
    "progress": 45,
    "current_step": "正在抓取DeepSeek数据",
    "steps": [
      {"name": "初始化", "status": "completed", "progress": 100},
      {"name": "DeepSeek诊断", "status": "completed", "progress": 100},
      {"name": "豆包诊断", "status": "running", "progress": 50},
      {"name": "文心一言诊断", "status": "pending", "progress": 0},
      {"name": "Kimi诊断", "status": "pending", "progress": 0},
      {"name": "生成报告", "status": "pending", "progress": 0}
    ]
  }
}
```

### 4.3 获取诊断报告

```
GET /v1/diagnose/{report_id}
```

**响应：**
```json
{
  "success": true,
  "code": 0,
  "data": {
    "report_id": "rpt_abc123",
    "report_no": "DIA20240101000001",
    "company_name": "示例科技有限公司",
    "company_domain": "https://www.example.com",
    "overall_score": 58.5,
    "score_trend": 12.3,
    "health_dimensions": [
      {"dimension": "D1", "name": "品牌实体识别", "score": 65, "weight": 15, "benchmark": 70},
      {"dimension": "D2", "name": "产品关联度", "score": 55, "weight": 15, "benchmark": 68},
      {"dimension": "D3", "name": "正面情感占比", "score": 72, "weight": 10, "benchmark": 65},
      {"dimension": "D4", "name": "竞品压制指数", "score": 48, "weight": 15, "benchmark": 55},
      {"dimension": "D5", "name": "内容覆盖度", "score": 52, "weight": 15, "benchmark": 60},
      {"dimension": "D6", "name": "官网引流率", "score": 61, "weight": 15, "benchmark": 58},
      {"dimension": "D7", "name": "更新活跃度", "score": 70, "weight": 15, "benchmark": 62}
    ],
    "competitor_analysis": [
      {"name": "竞品A", "mention_rate": 35.2, "advantages": ["技术领先", "品牌知名度高"], "weaknesses": ["价格较高"]},
      {"name": "竞品B", "mention_rate": 28.7, "advantages": ["价格优势"], "weaknesses": ["功能单一"]}
    ],
    "issue_list": [
      {"severity": "high", "dimension": "D4", "issue": "竞品A提及率是品牌的3倍", "suggestion": "建议增加品牌对比类内容"},
      {"severity": "medium", "dimension": "D2", "issue": "产品核心卖点未被正确识别", "suggestion": "优化官网产品描述语义"}
    ],
    "recommendations": [
      {"priority": 1, "action": "生成品牌FAQ内容", "expected_impact": "+15%", "effort": "low"},
      {"priority": 2, "action": "部署JSON-LD结构化数据", "expected_impact": "+10%", "effort": "medium"},
      {"priority": 3, "action": "发布行业观点文章", "expected_impact": "+8%", "effort": "high"}
    ],
    "status": "completed",
    "created_at": "2024-01-01T10:00:00Z",
    "expires_at": "2024-04-01T10:00:00Z"
  }
}
```

### 4.4 获取诊断报告列表

```
GET /v1/diagnose
```

**查询参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| page | int | 页码，默认1 |
| page_size | int | 每页数量，默认20 |
| status | string | 状态筛选 |
| start_date | string | 开始日期 |
| end_date | string | 结束日期 |

**响应：**
```json
{
  "success": true,
  "code": 0,
  "data": {
    "list": [
      {
        "report_id": "rpt_abc123",
        "report_no": "DIA20240101000001",
        "company_name": "示例科技有限公司",
        "overall_score": 58.5,
        "score_trend": 12.3,
        "status": "completed",
        "engine_count": 6,
        "created_at": "2024-01-01T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "page_size": 20,
      "total": 15,
      "total_pages": 1
    }
  }
}
```

### 4.5 对比报告

```
GET /v1/diagnose/compare
```

**查询参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| report_ids | string | 报告ID，多个用逗号分隔 |

**响应：**
```json
{
  "success": true,
  "code": 0,
  "data": {
    "reports": [
      {"report_id": "rpt_001", "overall_score": 58.5, "created_at": "2024-01-01"},
      {"report_id": "rpt_002", "overall_score": 72.3, "created_at": "2024-02-01"}
    ],
    "trend": [
      {"date": "2024-01-01", "score": 58.5},
      {"date": "2024-02-01", "score": 72.3}
    ],
    "improvements": [
      {"dimension": "D4", "before": 48, "after": 65, "change": "+17"}
    ]
  }
}
```

---

## 5. 策略模块 (Strategy)

### 5.1 生成策略方案

```
POST /v1/strategy/generate
```

**请求参数：**
```json
{
  "report_id": "rpt_abc123",
  "plan_type": "brand_qa | product_desc | industry_view | competitor_compare | news_dynamic",
  "target_engines": ["deepseek", "kimi"],
  "content_style": {
    "tone": "professional | friendly | authoritative",
    "length": "short | medium | long",
    "format": "markdown | json | html"
  },
  "options": {
    "generate_count": 10,
    "include_examples": true
  }
}
```

**响应：**
```json
{
  "success": true,
  "code": 0,
  "message": "策略生成中",
  "data": {
    "plan_id": "plan_abc123",
    "plan_no": "STR20240101000001",
    "status": "generating",
    "estimated_time": 60
  }
}
```

### 5.2 获取策略方案详情

```
GET /v1/strategy/{plan_id}
```

**响应：**
```json
{
  "success": true,
  "code": 0,
  "data": {
    "plan_id": "plan_abc123",
    "plan_no": "STR20240101000001",
    "plan_type": "brand_qa",
    "title": "品牌问答策略方案",
    "summary": "针对DeepSeek和Kimi优化品牌FAQ内容",
    "target_engines": ["deepseek", "kimi"],
    "status": "generated",
    "strategies": [
      {
        "id": "stg_001",
        "question": "示例科技的产品有哪些优势？",
        "answer": "示例科技是一家专注于AI技术的公司...",
        "target_keywords": ["AI技术", "智能产品"],
        "suggested_platform": "官网FAQ",
        "effect_score": 85
      }
    ],
    "usage_guide": "请将以上问答内容发布至官网FAQ页面",
    "created_at": "2024-01-01T10:00:00Z"
  }
}
```

### 5.3 获取策略方案列表

```
GET /v1/strategy
```

**查询参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| page | int | 页码 |
| page_size | int | 每页数量 |
| plan_type | string | 策略类型 |
| status | string | 状态 |
| report_id | string | 关联报告ID |

### 5.4 更新策略方案状态

```
PUT /v1/strategy/{plan_id}/status
```

**请求参数：**
```json
{
  "status": "approved | applied | archived"
}
```

---

## 6. 内容模块 (Content)

### 6.1 生成内容

```
POST /v1/content/generate
```

**请求参数：**
```json
{
  "plan_id": "plan_abc123",
  "strategy_id": "stg_001",
  "content_type": "seo_article | xiaohongshu | qa | json_ld | outer_link_text",
  "title": "示例科技AI产品优势详解",
  "variables": {
    "brand_name": "示例科技",
    "product_name": "智能助手",
    "keywords": ["AI", "智能", "自动化"]
  },
  "options": {
    "target_platform": "官网 | 小红书 | 知乎",
    "word_count": 1000,
    "include_cta": true,
    "include_structured_data": true
  }
}
```

**响应：**
```json
{
  "success": true,
  "code": 0,
  "message": "内容生成中",
  "data": {
    "content_id": "cnt_abc123",
    "content_no": "CNT20240101000001",
    "status": "generating"
  }
}
```

### 6.2 获取生成内容

```
GET /v1/content/{content_id}
```

**响应：**
```json
{
  "success": true,
  "code": 0,
  "data": {
    "content_id": "cnt_abc123",
    "content_no": "CNT20240101000001",
    "content_type": "seo_article",
    "title": "示例科技AI产品优势详解",
    "content_body": "# 示例科技AI产品优势详解\n\n...",
    "meta_info": {
      "keywords": ["AI", "智能助手"],
      "summary": "详细介绍示例科技产品的核心优势",
      "tags": ["AI", "科技", "产品评测"]
    },
    "structured_data": {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "示例科技AI产品优势详解",
      "author": {"@type": "Organization", "name": "示例科技"}
    },
    "status": "generated",
    "usage_tips": "建议发布至官网博客栏目",
    "created_at": "2024-01-01T10:00:00Z"
  }
}
```

### 6.3 复制内容

```
POST /v1/content/{content_id}/copy
```

**响应：**
```json
{
  "success": true,
  "code": 0,
  "data": {
    "content_id": "cnt_new123",
    "content_no": "CNT20240101000002"
  }
}
```

### 6.4 获取内容列表

```
GET /v1/content
```

**查询参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| page | int | 页码 |
| page_size | int | 每页数量 |
| content_type | string | 内容类型 |
| status | string | 状态 |
| plan_id | string | 关联策略ID |

---

## 7. 订阅模块 (Subscription)

### 7.1 获取套餐列表

```
GET /v1/packages
```

**响应：**
```json
{
  "success": true,
  "code": 0,
  "data": [
    {
      "id": "pkg_basic",
      "code": "basic",
      "name": "基础版",
      "tier": "basic",
      "price_monthly": 999.00,
      "price_yearly": 9999.00,
      "features": ["模镜诊断1个引擎", "10篇/月内容生成"],
      "limits": {
        "diagnose_engines": 1,
        "diagnose_questions": 10,
        "content_limit_monthly": 10,
        "competitor_limit": 1
      },
      "is_recommended": false
    },
    {
      "id": "pkg_pro",
      "code": "professional",
      "name": "专业版",
      "tier": "professional",
      "price_monthly": 2999.00,
      "price_yearly": 29999.00,
      "features": ["全量6个引擎", "100篇/月内容生成", "竞品监控"],
      "is_recommended": true
    },
    {
      "id": "pkg_ent",
      "code": "enterprise",
      "name": "企业版",
      "tier": "enterprise",
      "price_monthly": 9999.00,
      "price_yearly": 99999.00,
      "features": ["不限量内容生成", "API对接", "专属顾问"],
      "is_recommended": false
    }
  ]
}
```

### 7.2 获取当前订阅

```
GET /v1/subscription/current
```

**响应：**
```json
{
  "success": true,
  "code": 0,
  "data": {
    "subscription_id": "sub_abc123",
    "package": {
      "code": "professional",
      "name": "专业版"
    },
    "billing_cycle": "yearly",
    "status": "active",
    "started_at": "2024-01-01T00:00:00Z",
    "expires_at": "2025-01-01T00:00:00Z",
    "usage": {
      "diagnose_count_this_month": 3,
      "diagnose_limit": -1,
      "content_count_this_month": 45,
      "content_limit": 100,
      "competitor_count": 2,
      "competitor_limit": 3
    }
  }
}
```

### 7.3 创建订单

```
POST /v1/orders
```

**请求参数：**
```json
{
  "package_id": "pkg_pro",
  "billing_cycle": "monthly | yearly",
  "coupon_code": "NEWYEAR2024"
}
```

**响应：**
```json
{
  "success": true,
  "code": 0,
  "message": "订单创建成功",
  "data": {
    "order_id": "ord_abc123",
    "order_no": "ORD20240101000001",
    "package_name": "专业版",
    "billing_cycle": "yearly",
    "original_amount": 2999.00,
    "discount_amount": 299.90,
    "final_amount": 2699.10,
    "payment_url": "https://pay.hiaeo.cn/toPay?order=ord_abc123"
  }
}
```

### 7.4 订单列表

```
GET /v1/orders
```

### 7.5 试用申请

```
POST /v1/subscription/trial
```

**响应：**
```json
{
  "success": true,
  "code": 0,
  "message": "试用已开通",
  "data": {
    "trial_ends_at": "2024-01-08T00:00:00Z",
    "features": ["模镜完整诊断1次", "Hub基础看板"]
  }
}
```

---

## 8. 通知模块 (Notification)

### 8.1 获取通知列表

```
GET /v1/notifications
```

**查询参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| page | int | 页码 |
| page_size | int | 每页数量 |
| is_read | boolean | 是否已读 |

**响应：**
```json
{
  "success": true,
  "code": 0,
  "data": {
    "list": [
      {
        "id": "notif_001",
        "type": "diagnose_complete",
        "title": "诊断报告已生成",
        "content": "您的诊断报告已生成，综合健康分58.5分",
        "data": {"report_id": "rpt_abc123"},
        "is_read": false,
        "created_at": "2024-01-01T10:00:00Z"
      }
    ],
    "unread_count": 3,
    "pagination": {}
  }
}
```

### 8.2 标记已读

```
PUT /v1/notifications/read
```

**请求参数：**
```json
{
  "notification_ids": ["notif_001", "notif_002"]
}
```

---

## 9. 竞品监控模块 (Competitor)

### 9.1 添加竞品监控

```
POST /v1/competitors
```

**请求参数：**
```json
{
  "competitor_name": "竞品公司",
  "competitor_domain": "https://www.example.com",
  "industry": "科技",
  "keywords": ["竞品产品A", "竞品产品B"],
  "alert_enabled": true,
  "alert_threshold": 10
}
```

### 9.2 获取竞品监控列表

```
GET /v1/competitors
```

### 9.3 获取竞品分析详情

```
GET /v1/competitors/{competitor_id}
```

**响应：**
```json
{
  "success": true,
  "code": 0,
  "data": {
    "competitor_id": "comp_abc123",
    "competitor_name": "竞品公司",
    "mention_stats": {
      "total_mentions": 1250,
      "monthly_trend": "+15%",
      "sentiment": {"positive": 65, "neutral": 25, "negative": 10}
    },
    "mention_history": [
      {"date": "2024-01", "count": 280},
      {"date": "2024-02", "count": 320}
    ],
    "top_keywords": ["竞品产品A", "竞品技术", "竞品服务"],
    "last_updated": "2024-02-01T00:00:00Z"
  }
}
```

---

## 10. 通用接口

### 10.1 文件上传

```
POST /v1/upload
```

**请求参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| file | file | 文件 |
| type | string | 用途类型 avatar/doc/image |

**响应：**
```json
{
  "success": true,
  "code": 0,
  "data": {
    "file_id": "file_abc123",
    "url": "https://cdn.hiaeo.cn/uploads/xxx.jpg",
    "filename": "avatar.jpg",
    "size": 102400,
    "mime_type": "image/jpeg"
  }
}
```

### 10.2 获取AI引擎列表

```
GET /v1/engines
```

**响应：**
```json
{
  "success": true,
  "code": 0,
  "data": [
    {"code": "deepseek", "name": "DeepSeek", "status": "active", "model": "deepseek-chat"},
    {"code": "doubao", "name": "豆包", "status": "active", "model": "doubao-pro"},
    {"code": "ernie", "name": "文心一言", "status": "active", "model": "ernie-4.0"},
    {"code": "kimi", "name": "Kimi", "status": "active", "model": "moonshot-v1-8k"}
  ]
}
```

### 10.3 行业列表

```
GET /v1/industries
```

---

## 11. Webhook接口

### 11.1 支付回调

```
POST /v1/webhooks/payment
```

**请求头：**
```
X-Webhook-Signature: sha256=xxxxx
```

**请求参数：**
```json
{
  "event": "payment.success",
  "order_no": "ORD20240101000001",
  "payment_no": "PAY20240101000001",
  "paid_at": "2024-01-01T10:00:00Z"
}
```

### 11.2 诊断完成回调

```
POST /v1/webhooks/diagnose
```

**请求参数：**
```json
{
  "event": "diagnose.complete",
  "report_id": "rpt_abc123",
  "user_id": "u_abc123"
}
```

---

## 12. 错误响应示例

```json
{
  "success": false,
  "code": 20001,
  "message": "未授权，请先登录",
  "error": {
    "field": "authorization",
    "detail": "Token已过期"
  },
  "timestamp": 1707123456789,
  "request_id": "req_abc123"
}
```
