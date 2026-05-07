import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnoseReport } from './entities/diagnose.entity';
import { DiagnoseService } from './diagnose.service';
import { DiagnoseController } from './diagnose.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([DiagnoseReport]), AiModule],
  controllers: [DiagnoseController],
  providers: [DiagnoseService],
  exports: [DiagnoseService],
})
export class DiagnoseModule {}
