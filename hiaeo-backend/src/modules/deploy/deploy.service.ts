import { Injectable } from '@nestjs/common';
import { CreateDeployDto } from './dto/create-deploy.dto';

export interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  supportedTypes: string[];
}

export interface DeployRecord {
  id: number;
  platform: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  contentId: number;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

@Injectable()
export class DeployService {
  private platforms: Platform[] = [
    {
      id: 'wechat-miniprogram',
      name: '微信小程序',
      icon: 'wechat',
      color: '#07C160',
      description: '发布到微信小程序平台',
      supportedTypes: ['strategy', 'diagnose'],
    },
    {
      id: 'web',
      name: 'Web 应用',
      icon: 'globe',
      color: '#4F46E5',
      description: '发布为响应式 Web 应用',
      supportedTypes: ['strategy', 'diagnose', 'content'],
    },
    {
      id: 'app',
      name: '移动应用',
      icon: 'smartphone',
      color: '#F59E0B',
      description: '发布为 iOS/Android 原生应用',
      supportedTypes: ['strategy'],
    },
  ];

  async getPlatforms() {
    return {
      code: 0,
      message: 'success',
      data: this.platforms,
    };
  }

  async getHistory(userId: number, page = 1, limit = 20) {
    // TODO: 实际从数据库查询
    return {
      code: 0,
      message: 'success',
      data: {
        list: [],
        total: 0,
        page,
        limit,
      },
    };
  }

  async deploy(userId: number, dto: CreateDeployDto) {
    // TODO: 实现实际的发布逻辑
    return {
      code: 0,
      message: '发布任务已创建',
      data: {
        id: Date.now(),
        platform: dto.platform,
        status: 'pending',
        createdAt: new Date(),
      },
    };
  }

  async getDeploy(id: number) {
    return {
      code: 0,
      message: 'success',
      data: null,
    };
  }
}
