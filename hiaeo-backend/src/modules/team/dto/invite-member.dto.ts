import { IsEmail, IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { MemberRole } from '../entities/team-member.entity';

export class InviteMemberDto {
  @IsEmail()
  email: string;

  @IsEnum(MemberRole)
  @IsOptional()
  role?: MemberRole;

  @IsBoolean()
  @IsOptional()
  canManageDiagnose?: boolean;

  @IsBoolean()
  @IsOptional()
  canManageContent?: boolean;

  @IsBoolean()
  @IsOptional()
  canManageTeam?: boolean;

  @IsBoolean()
  @IsOptional()
  canViewBilling?: boolean;
}
