import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum AuditAction {
  // 团队操作
  TEAM_CREATE = 'team:create',
  TEAM_UPDATE = 'team:update',
  TEAM_DELETE = 'team:delete',
  TEAM_INVITE = 'team:invite',
  TEAM_JOIN = 'team:join',
  TEAM_LEAVE = 'team:leave',
  TEAM_REMOVE_MEMBER = 'team:remove_member',
  TEAM_UPDATE_ROLE = 'team:update_role',

  // 诊断操作
  DIAGNOSE_CREATE = 'diagnose:create',
  DIAGNOSE_DELETE = 'diagnose:delete',
  DIAGNOSE_EXPORT = 'diagnose:export',

  // 内容操作
  CONTENT_CREATE = 'content:create',
  CONTENT_UPDATE = 'content:update',
  CONTENT_DELETE = 'content:delete',
  CONTENT_PUBLISH = 'content:publish',

  // 账户操作
  BILLING_VIEW = 'billing:view',
  SETTINGS_UPDATE = 'settings:update',
}

@Entity('audit_logs')
@Index(['teamId', 'createdAt'])
@Index(['userId', 'createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  teamId: string;

  @Column()
  userId: string;

  @Column()
  userEmail: string;

  @Column({ type: 'varchar', length: 50 })
  action: AuditAction;

  @Column({ type: 'json', nullable: true })
  details: Record<string, any>;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ type: 'varchar', length: 20, default: 'success' })
  status: 'success' | 'failed';

  @Column({ nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;
}
