import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { RoutingModule } from '../routing/routing.module';
import { NotificationModule } from '../notifications/notification.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Report } from './report.entity';

import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Report]),
        AiModule,
        RoutingModule,
        NotificationModule,
        UsersModule
    ],
    controllers: [ReportsController],
    providers: [ReportsService],
    exports: [ReportsService],
})
export class ReportsModule { }
