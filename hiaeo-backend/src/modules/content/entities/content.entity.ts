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
import { Strategy } from '../../strategy/entities/strategy.entity';

export type ContentStatus = 'draft' | 'generating' | 'published' | 'scheduled';

@Entity('contents')
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  strategyId: string;

  @ManyToOne(() => Strategy, { nullable: true })
  @JoinColumn({ name: 'strategyId' })
  strategy: Strategy;

  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ nullable: true })
  metaDescription: string;

  @Column({ nullable: true })
  featuredImage: string;

  @Column({ type: 'simple-json', nullable: true })
  keywords: string[];

  @Column({ nullable: true })
  category: string;

  @Column({ default: 'draft' })
  status: ContentStatus;

  @Column({ nullable: true })
  publishedAt: Date;

  @Column({ nullable: true })
  scheduledAt: Date;

  @Column({ type: 'simple-json', nullable: true })
  seoAnalysis: {
    seoScore: number;
    readabilityScore: number;
    keywordDensity: Record<string, number>;
    suggestions: string[];
  };

  @Column({ type: 'simple-json', nullable: true })
  aiPlatforms: Array<{
    platform: string;
    published: boolean;
    publishedAt?: Date;
    url?: string;
  }>;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
