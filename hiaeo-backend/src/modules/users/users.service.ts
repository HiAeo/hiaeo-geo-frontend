import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AdminUpdateUserDto, AdminListUsersDto } from './dto/admin.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('该邮箱已被注册');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { phone } as any });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.usersRepository.update(id, { lastLoginAt: new Date() });
  }

  async updateCredits(id: string, credits: number): Promise<void> {
    await this.usersRepository.update(id, { credits });
  }

  async deductCredits(id: string, amount: number): Promise<boolean> {
    const user = await this.findById(id);
    if (!user || user.credits < amount) {
      return false;
    }
    await this.usersRepository.update(id, { credits: user.credits - amount });
    return true;
  }

  async updateProfile(id: string, data: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, data);
    return this.findById(id);
  }

  async changePassword(id: string, oldPassword: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.findById(id);
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    const isOldPasswordValid = await this.validatePassword(user, oldPassword);
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('原密码错误');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.update(id, { password: hashedNewPassword });

    return { message: '密码修改成功' };
  }

  // ==================== 管理员方法 ====================

  /**
   * 获取用户列表（管理员）
   */
  async listUsers(query: AdminListUsersDto): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const whereConditions: any = {};

    // 搜索条件
    if (query.search) {
      whereConditions.email = Like(`%${query.search}%`);
    }

    // 订阅等级筛选
    if (query.subscriptionTier) {
      whereConditions.subscriptionTier = query.subscriptionTier;
    }

    // 活跃状态筛选
    if (query.isActive !== undefined) {
      whereConditions.isActive = query.isActive;
    }

    const [users, total] = await this.usersRepository.findAndCount({
      where: whereConditions,
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
      select: ['id', 'email', 'nickname', 'avatar', 'subscriptionTier', 'credits', 'company', 'isActive', 'lastLoginAt', 'createdAt']
    });

    return { data: users, total, page, limit };
  }

  /**
   * 获取单个用户详情（管理员）
   */
  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'email', 'nickname', 'avatar', 'subscriptionTier', 'subscriptionExpiresAt', 'credits', 'company', 'industry', 'website', 'isActive', 'lastLoginAt', 'role', 'createdAt', 'updatedAt']
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  /**
   * 更新用户信息（管理员）
   */
  async adminUpdateUser(id: string, updateData: AdminUpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    await this.usersRepository.update(id, updateData);
    return this.getUserById(id);
  }

  /**
   * 删除用户（管理员）
   */
  async deleteUser(id: string): Promise<{ message: string }> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    await this.usersRepository.delete(id);
    return { message: '用户已删除' };
  }

  /**
   * 重置用户密码（管理员）
   */
  async resetPassword(id: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.update(id, { password: hashedPassword });

    return { message: '密码已重置' };
  }

  /**
   * 获取统计数据（管理员）
   */
  async getStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    freeUsers: number;
    proUsers: number;
    enterpriseUsers: number;
  }> {
    const totalUsers = await this.usersRepository.count();
    const activeUsers = await this.usersRepository.count({ where: { isActive: true } });
    const freeUsers = await this.usersRepository.count({ where: { subscriptionTier: 'free' } });
    const proUsers = await this.usersRepository.count({ where: { subscriptionTier: 'pro' } });
    const enterpriseUsers = await this.usersRepository.count({ where: { subscriptionTier: 'enterprise' } });

    return { totalUsers, activeUsers, freeUsers, proUsers, enterpriseUsers };
  }
}
