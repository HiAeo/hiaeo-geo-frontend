import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { TeamMember } from './entities/team-member.entity';
import { AuditLog } from './entities/audit-log.entity';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Team, TeamMember, AuditLog])],
  controllers: [TeamController],
  providers: [TeamService, JwtAuthGuard],
  exports: [TeamService],
})
export class TeamModule {}
