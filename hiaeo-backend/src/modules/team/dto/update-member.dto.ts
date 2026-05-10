import { IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { MemberRole } from '../entities/team-member.entity';

export class UpdateMemberDto {
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
