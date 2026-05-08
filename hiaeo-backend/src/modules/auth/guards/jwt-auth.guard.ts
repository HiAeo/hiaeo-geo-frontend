import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { UsersService } from '../../users/users.service';

// Token 黑名单（与 AuthService 共享）
export const tokenBlacklist = new Set<string>();

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private usersService: UsersService) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('请先登录');
    }
    
    const token = authHeader.substring(7);
    
    // 检查 Token 是否在黑名单中
    if (tokenBlacklist.has(token)) {
      throw new UnauthorizedException('Token 已失效，请重新登录');
    }
    
    try {
      const secret = process.env.JWT_SECRET || 'your-secret-key';
      const payload = jwt.verify(token, secret) as any;
      // request.user 只包含 id 和 email，实际角色信息从数据库获取
      request.user = { id: payload.sub, email: payload.email };
      return true;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token 已过期，请重新登录');
      }
      throw new UnauthorizedException('Token 无效');
    }
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('请先登录');
    }
    return user;
  }
}
