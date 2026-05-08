import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { DiagnoseModule } from './modules/diagnose/diagnose.module';
import { StrategyModule } from './modules/strategy/strategy.module';
import { ContentModule } from './modules/content/content.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AiModule } from './modules/ai/ai.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(databaseConfig()),
    AuthModule,
    UsersModule,
    DashboardModule,
    DiagnoseModule,
    StrategyModule,
    ContentModule,
    SettingsModule,
    AiModule,
    SubscriptionModule,
    OrderModule,
  ],
})
export class AppModule {}
