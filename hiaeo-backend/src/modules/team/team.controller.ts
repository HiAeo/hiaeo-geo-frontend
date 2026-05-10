import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  // ==================== 团队管理 ====================

  @Post()
  async createTeam(@Req() req: Request, @Body() dto: CreateTeamDto) {
    const userId = (req.user as any).id;
    const userEmail = (req.user as any).email;
    return this.teamService.createTeam(userId, userEmail, dto);
  }

  @Get()
  async getTeams(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.teamService.getTeams(userId);
  }

  @Get(':id')
  async getTeam(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).id;
    return this.teamService.getTeam(id, userId);
  }

  @Put(':id')
  async updateTeam(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateTeamDto,
  ) {
    const userId = (req.user as any).id;
    return this.teamService.updateTeam(id, userId, dto);
  }

  @Delete(':id')
  async deleteTeam(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).id;
    return this.teamService.deleteTeam(id, userId);
  }

  // ==================== 邀请管理 ====================

  @Post(':id/invite')
  async generateInviteLink(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).id;
    return this.teamService.generateInviteLink(id, userId);
  }

  @Post('join/:inviteCode')
  async joinByInviteCode(@Req() req: Request, @Param('inviteCode') inviteCode: string) {
    const userId = (req.user as any).id;
    const userEmail = (req.user as any).email;
    return this.teamService.joinByInviteCode(inviteCode, userId, userEmail);
  }

  // ==================== 成员管理 ====================

  @Post(':id/members/invite')
  async inviteMember(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: InviteMemberDto,
  ) {
    const userId = (req.user as any).id;
    return this.teamService.inviteMember(id, userId, dto);
  }

  @Put(':id/members/:memberId')
  async updateMember(
    @Req() req: Request,
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body() dto: UpdateMemberDto,
  ) {
    const userId = (req.user as any).id;
    return this.teamService.updateMember(id, memberId, userId, dto);
  }

  @Delete(':id/members/:memberId')
  async removeMember(
    @Req() req: Request,
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    const userId = (req.user as any).id;
    return this.teamService.removeMember(id, memberId, userId);
  }

  @Post(':id/leave')
  async leaveTeam(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).id;
    const userEmail = (req.user as any).email;
    return this.teamService.leaveTeam(id, userId, userEmail);
  }

  // ==================== 审计日志 ====================

  @Get(':id/audit-logs')
  async getAuditLogs(
    @Req() req: Request,
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = (req.user as any).id;
    return this.teamService.getAuditLogs(
      id,
      userId,
      parseInt(page || '1'),
      parseInt(limit || '20'),
    );
  }
}
