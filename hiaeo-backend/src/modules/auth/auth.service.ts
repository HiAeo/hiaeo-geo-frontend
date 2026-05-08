import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SendSmsDto } from './dto/send-sms.dto';
import { tokenBlacklist } from './guards/jwt-auth.guard';

// 开发环境模拟验证码存储
const devSmsCodes = new Map<string, { code: string; expiresAt: number }>();

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto as any);
    const token = this.generateToken(user);
    return {
      user: this.sanitizeUser(user),
      ...token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      user,
      loginDto.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    await this.usersService.updateLastLogin(user.id);
    const token = this.generateToken(user);
    return {
      user: this.sanitizeUser(user),
      ...token,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken);
      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('用户不存在');
      }

      const token = this.generateToken(user);
      return {
        user: this.sanitizeUser(user),
        ...token,
      };
    } catch (error) {
      throw new UnauthorizedException('Token 已过期，请重新登录');
    }
  }

  async logout(token: string) {
    tokenBlacklist.add(token);
    return { message: '退出登录成功' };
  }

  isTokenBlacklisted(token: string): boolean {
    return tokenBlacklist.has(token);
  }

  /**
   * 发送短信验证码（开发环境模拟）
   * 固定验证码: 123456
   */
  async sendSmsCode(sendSmsDto: SendSmsDto): Promise<{ message: string; expiresIn: number }> {
    const { phone, type = 'register' } = sendSmsDto;

    // 开发环境：固定验证码 123456
    const code = '123456';
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5分钟过期

    devSmsCodes.set(phone, { code, expiresAt });

    console.log(`[开发环境] 短信验证码已发送至 ${phone}，验证码: ${code}，类型: ${type}`);

    return {
      message: '验证码已发送',
      expiresIn: 300, // 5分钟
    };
  }

  /**
   * 验证短信验证码
   */
  async verifySmsCode(phone: string, code: string): Promise<{ valid: boolean; user?: any }> {
    const record = devSmsCodes.get(phone);

    if (!record) {
      return { valid: false };
    }

    if (Date.now() > record.expiresAt) {
      devSmsCodes.delete(phone);
      return { valid: false };
    }

    if (record.code !== code) {
      return { valid: false };
    }

    // 验证成功，删除验证码
    devSmsCodes.delete(phone);

    // 查找或创建用户（手机号登录场景）
    let user = await this.usersService.findByPhone(phone);
    if (!user) {
      // 可以选择自动创建用户或返回无效
      return { valid: false, user: undefined };
    }

    const token = this.generateToken(user);
    return {
      valid: true,
      user: {
        ...this.sanitizeUser(user),
        ...token,
      },
    };
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    };
  }

  private sanitizeUser(user: any) {
    const { password, ...result } = user;
    return result;
  }
}
