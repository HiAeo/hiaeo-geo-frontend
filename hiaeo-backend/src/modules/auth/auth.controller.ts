import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SendSmsDto } from './dto/send-sms.dto';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: '刷新 Token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: '退出登录' })
  async logout(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('无效的 Token');
    }
    const token = authHeader.substring(7);
    return this.authService.logout(token);
  }

  @Post('sms/send')
  @ApiOperation({ summary: '发送短信验证码' })
  async sendSms(@Body() sendSmsDto: SendSmsDto) {
    return this.authService.sendSmsCode(sendSmsDto);
  }

  @Post('sms/verify')
  @ApiOperation({ summary: '验证短信验证码' })
  async verifySms(@Body() body: { phone: string; code: string }) {
    return this.authService.verifySmsCode(body.phone, body.code);
  }
}
