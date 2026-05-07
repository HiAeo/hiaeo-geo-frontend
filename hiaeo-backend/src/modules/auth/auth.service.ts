import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

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
