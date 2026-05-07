import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: 'free' })
  subscriptionTier: 'free' | 'pro' | 'enterprise';

  @Column({ nullable: true })
  subscriptionExpiresAt: Date;

  @Column({ default: 0 })
  credits: number;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  website: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
