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

@Entity('strategies')
export class Strategy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  targetUrl: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ type: 'simple-json', nullable: true })
  targetKeywords: string[];

  @Column({ type: 'simple-json', nullable: true })
  competitors: Array<{ name: string; url: string }>;

  @Column({ type: 'simple-json', nullable: true })
  aiPlatforms: string[];

  @Column({ type: 'simple-json', nullable: true })
  contentPlan: {
    topics: Array<{ keyword: string; priority: number; estimatedWords: number }>;
    contentTypes: string[];
    publishingFrequency: string;
  };

  @Column({ type: 'simple-json', nullable: true })
  recommendations: Array<{
    category: string;
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    recommendation: string;
  }>;

  @Column({ default: 'draft' })
  status: 'draft' | 'active' | 'archived';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
