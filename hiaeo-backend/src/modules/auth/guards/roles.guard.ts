import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UsersService } from '../../users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('未授权访问');
    }

    // 获取用户完整信息以检查角色
    const fullUser = await this.usersService.findById(user.id);
    
    if (!fullUser) {
      throw new ForbiddenException('用户不存在');
    }

    const hasRole = requiredRoles.includes(fullUser.role || 'user');
    
    if (!hasRole) {
      throw new ForbiddenException('权限不足，需要管理员权限');
    }

    return true;
  }
}
