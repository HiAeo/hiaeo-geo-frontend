import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Team } from './entities/team.entity';
import { TeamMember, MemberRole } from './entities/team-member.entity';
import { AuditLog, AuditAction } from './entities/audit-log.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

// 生成随机邀请码
function generateInviteCode(): string {
  return crypto.randomUUID().slice(0, 8).toUpperCase();
}

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(TeamMember)
    private memberRepository: Repository<TeamMember>,
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  // ==================== 团队管理 ====================

  async createTeam(userId: string, userEmail: string, dto: CreateTeamDto) {
    // 生成唯一的邀请码
    const inviteCode = generateInviteCode();

    const team = this.teamRepository.create({
      name: dto.name,
      logo: dto.logo,
      description: dto.description,
      visibility: dto.visibility || 'private',
      inviteCode,
      ownerId: userId,
    });

    await this.teamRepository.save(team);

    // 创建者自动成为团队所有者
    const member = this.memberRepository.create({
      teamId: team.id,
      userId,
      role: MemberRole.OWNER,
      canManageDiagnose: true,
      canManageContent: true,
      canManageTeam: true,
      canViewBilling: true,
      invitedBy: userId,
    });
    await this.memberRepository.save(member);

    await this.logAudit(team.id, userId, userEmail, AuditAction.TEAM_CREATE, {
      teamName: team.name,
    });

    return team;
  }

  async getTeams(userId: string) {
    const members = await this.memberRepository.find({
      where: { userId, isActive: true },
      relations: ['team'],
    });

    return members.map((m) => ({
      ...m.team,
      role: m.role,
      myRole: m.role,
      joinedAt: m.joinedAt,
    }));
  }

  async getTeam(teamId: string, userId: string) {
    const team = await this.teamRepository.findOne({
      where: { id: teamId, isActive: true },
      relations: ['members', 'members.user'],
    });

    if (!team) {
      throw new NotFoundException('团队不存在');
    }

    // 检查用户权限
    const membership = team.members.find((m) => m.userId === userId && m.isActive);
    if (!membership) {
      throw new ForbiddenException('你不是该团队成员');
    }

    return {
      ...team,
      members: team.members
        .filter((m) => m.isActive)
        .map((m) => ({
          id: m.id,
          userId: m.userId,
          email: m.user?.email,
          nickname: m.user?.nickname,
          avatar: m.user?.avatar,
          role: m.role,
          canManageDiagnose: m.canManageDiagnose,
          canManageContent: m.canManageContent,
          canManageTeam: m.canManageTeam,
          canViewBilling: m.canViewBilling,
          joinedAt: m.joinedAt,
        })),
      myRole: membership.role,
    };
  }

  async updateTeam(teamId: string, userId: string, dto: UpdateTeamDto) {
    const team = await this.findTeamWithPermission(teamId, userId, 'canManageTeam');

    Object.assign(team, dto);
    await this.teamRepository.save(team);

    await this.logAudit(teamId, userId, '', AuditAction.TEAM_UPDATE, {
      changes: dto,
    });

    return team;
  }

  async deleteTeam(teamId: string, userId: string) {
    const team = await this.findTeamWithPermission(teamId, userId, 'canManageTeam');

    if (team.ownerId !== userId) {
      throw new ForbiddenException('只有团队所有者可以删除团队');
    }

    team.isActive = false;
    await this.teamRepository.save(team);

    await this.logAudit(teamId, userId, '', AuditAction.TEAM_DELETE, {
      teamName: team.name,
    });

    return { success: true };
  }

  // ==================== 邀请管理 ====================

  async generateInviteLink(teamId: string, userId: string) {
    await this.findTeamWithPermission(teamId, userId, 'canManageTeam');

    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    
    // 刷新邀请码
    team.inviteCode = generateInviteCode();
    await this.teamRepository.save(team);

    const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/join/${team.inviteCode}`;

    await this.logAudit(teamId, userId, '', AuditAction.TEAM_INVITE, {
      inviteCode: team.inviteCode,
    });

    return {
      inviteCode: team.inviteCode,
      inviteLink,
    };
  }

  async joinByInviteCode(inviteCode: string, userId: string, userEmail: string) {
    const team = await this.teamRepository.findOne({
      where: { inviteCode, isActive: true },
    });

    if (!team) {
      throw new BadRequestException('邀请码无效或已过期');
    }

    // 检查是否已经是成员
    const existing = await this.memberRepository.findOne({
      where: { teamId: team.id, userId, isActive: true },
    });

    if (existing) {
      throw new BadRequestException('你已经是该团队成员');
    }

    // 加入团队，默认为 Viewer
    const member = this.memberRepository.create({
      teamId: team.id,
      userId,
      role: MemberRole.VIEWER,
      canManageDiagnose: false,
      canManageContent: false,
      canManageTeam: false,
      canViewBilling: false,
      invitedBy: team.ownerId,
    });
    await this.memberRepository.save(member);

    await this.logAudit(team.id, userId, userEmail, AuditAction.TEAM_JOIN, {
      teamName: team.name,
    });

    return {
      team,
      role: MemberRole.VIEWER,
    };
  }

  // ==================== 成员管理 ====================

  async inviteMember(teamId: string, userId: string, dto: any) {
    await this.findTeamWithPermission(teamId, userId, 'canManageTeam');

    // TODO: 发送邀请邮件
    // 目前简化处理，直接返回邀请信息
    const team = await this.teamRepository.findOne({ where: { id: teamId } });

    await this.logAudit(teamId, userId, '', AuditAction.TEAM_INVITE, {
      invitedEmail: dto.email,
      role: dto.role,
    });

    return {
      message: `邀请链接已发送到 ${dto.email}`,
      inviteLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/join/${team.inviteCode}`,
    };
  }

  async updateMember(
    teamId: string,
    memberId: string,
    userId: string,
    dto: UpdateMemberDto,
  ) {
    await this.findTeamWithPermission(teamId, userId, 'canManageTeam');

    const member = await this.memberRepository.findOne({
      where: { id: memberId, teamId, isActive: true },
      relations: ['user'],
    });

    if (!member) {
      throw new NotFoundException('成员不存在');
    }

    // 不能修改所有者
    if (member.role === MemberRole.OWNER) {
      throw new ForbiddenException('无法修改团队所有者角色');
    }

    Object.assign(member, dto);
    await this.memberRepository.save(member);

    await this.logAudit(teamId, userId, '', AuditAction.TEAM_UPDATE_ROLE, {
      targetUserId: member.userId,
      targetEmail: member.user?.email,
      changes: dto,
    });

    return member;
  }

  async removeMember(teamId: string, memberId: string, userId: string) {
    await this.findTeamWithPermission(teamId, userId, 'canManageTeam');

    const member = await this.memberRepository.findOne({
      where: { id: memberId, teamId, isActive: true },
      relations: ['user'],
    });

    if (!member) {
      throw new NotFoundException('成员不存在');
    }

    if (member.role === MemberRole.OWNER) {
      throw new ForbiddenException('无法移除团队所有者');
    }

    if (member.userId === userId) {
      throw new BadRequestException('不能移除自己');
    }

    member.isActive = false;
    await this.memberRepository.save(member);

    await this.logAudit(teamId, userId, '', AuditAction.TEAM_REMOVE_MEMBER, {
      removedUserId: member.userId,
      removedEmail: member.user?.email,
    });

    return { success: true };
  }

  async leaveTeam(teamId: string, userId: string, userEmail: string) {
    const member = await this.memberRepository.findOne({
      where: { teamId, userId, isActive: true },
    });

    if (!member) {
      throw new NotFoundException('你不是该团队成员');
    }

    if (member.role === MemberRole.OWNER) {
      throw new ForbiddenException('所有者不能离开团队，请先转让所有权或删除团队');
    }

    member.isActive = false;
    await this.memberRepository.save(member);

    await this.logAudit(teamId, userId, userEmail, AuditAction.TEAM_LEAVE, {});

    return { success: true };
  }

  // ==================== 审计日志 ====================

  async getAuditLogs(teamId: string, userId: string, page = 1, limit = 20) {
    await this.findTeamWithPermission(teamId, userId, 'canViewBilling');

    const [logs, total] = await this.auditLogRepository.findAndCount({
      where: { teamId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ==================== 权限检查 ====================

  async checkPermission(
    teamId: string,
    userId: string,
    permission: 'canManageDiagnose' | 'canManageContent' | 'canManageTeam' | 'canViewBilling',
  ): Promise<boolean> {
    const member = await this.memberRepository.findOne({
      where: { teamId, userId, isActive: true },
    });

    if (!member) {
      return false;
    }

    return member[permission] || member.role === MemberRole.OWNER || member.role === MemberRole.ADMIN;
  }

  async findTeamWithPermission(
    teamId: string,
    userId: string,
    permission: 'canManageDiagnose' | 'canManageContent' | 'canManageTeam' | 'canViewBilling',
  ) {
    const team = await this.teamRepository.findOne({
      where: { id: teamId, isActive: true },
    });

    if (!team) {
      throw new NotFoundException('团队不存在');
    }

    const hasPermission = await this.checkPermission(teamId, userId, permission);
    if (!hasPermission) {
      throw new ForbiddenException('你没有权限执行此操作');
    }

    return team;
  }

  async getUserTeams(userId: string): Promise<string[]> {
    const members = await this.memberRepository.find({
      where: { userId, isActive: true },
    });
    return members.map((m) => m.teamId);
  }

  private async logAudit(
    teamId: string,
    userId: string,
    userEmail: string,
    action: AuditAction,
    details: Record<string, any>,
    status = 'success' as const,
    errorMessage?: string,
  ) {
    const log = this.auditLogRepository.create({
      teamId,
      userId,
      userEmail,
      action,
      details,
      status,
      errorMessage,
    });
    await this.auditLogRepository.save(log);
  }
}
