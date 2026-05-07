import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('用户')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: '获取当前用户信息' })
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.id);
    const { password, ...result } = user;
    return result;
  }

  @Put('profile')
  @ApiOperation({ summary: '更新用户信息' })
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    const user = await this.usersService.updateProfile(req.user.id, updateProfileDto);
    const { password, ...result } = user;
    return result;
  }
}
