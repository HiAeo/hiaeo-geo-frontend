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

export type DiagnoseStatus = 'pending' | 'running' | 'completed' | 'failed';

@Entity('diagnose_reports')
export class DiagnoseReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  targetUrl: string;

  @Column({ nullable: true })
  targetName: string;

  @Column({ nullable: true })
  targetIndustry: string;

  @Column({ type: 'simple-json', nullable: true })
  seoScore: {
    overall: number;
    technical: number;
    content: number;
    authority: number;
    performance: number;
  };

  @Column({ type: 'simple-json', nullable: true })
  issues: Array<{
    category: string;
    severity: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    recommendation: string;
  }>;

  @Column({ type: 'simple-json', nullable: true })
  aiSearchPresence: {
    score: number;
    coverage: number;
    mentions: number;
    sentiment: string;
  };

  @Column({ default: 'pending' })
  status: DiagnoseStatus;

  @Column({ nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
