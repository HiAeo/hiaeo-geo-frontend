import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Team } from './team.entity';

export enum MemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

@Entity('team_members')
export class TeamMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  teamId: string;

  @ManyToOne(() => Team, (team) => team.members)
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', default: MemberRole.VIEWER })
  role: MemberRole;

  @Column({ default: true })
  canManageDiagnose: boolean; // 诊断管理权限

  @Column({ default: false })
  canManageContent: boolean; // 内容管理权限

  @Column({ default: false })
  canManageTeam: boolean; // 团队管理权限

  @Column({ default: false })
  canViewBilling: boolean; // 账单查看权限

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  invitedBy: string;

  @CreateDateColumn()
  joinedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
