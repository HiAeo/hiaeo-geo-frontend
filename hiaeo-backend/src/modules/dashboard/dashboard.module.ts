import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { DiagnoseReport } from '../diagnose/entities/diagnose.entity';
import { Strategy } from '../strategy/entities/strategy.entity';
import { Content } from '../content/entities/content.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DiagnoseReport, Strategy, Content])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
