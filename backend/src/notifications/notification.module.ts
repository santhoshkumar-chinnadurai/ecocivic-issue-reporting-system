import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { SlaAlertsService } from './sla-alerts.service';
import { Report } from '../reports/report.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Report])],
    providers: [NotificationService, SlaAlertsService],
    exports: [NotificationService],
})
export class NotificationModule { }
