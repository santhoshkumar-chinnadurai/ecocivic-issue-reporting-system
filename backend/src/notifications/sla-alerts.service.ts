import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Report, ReportStatus, ReportPriority } from '../reports/report.entity';
import { NotificationService } from './notification.service';

@Injectable()
export class SlaAlertsService {
    private readonly logger = new Logger(SlaAlertsService.name);

    constructor(
        @InjectRepository(Report)
        private reportsRepository: Repository<Report>,
        private notificationService: NotificationService,
    ) { }

    // Run every minute for testing/demo purposes. 
    // In production, maybe run every 15 minutes.
    @Cron(CronExpression.EVERY_MINUTE)
    async checkSlaBreaches() {
        this.logger.log('Running SLA Breach Check...');

        const now = new Date();
        const activeReports = await this.reportsRepository.find({
            where: [
                { status: ReportStatus.OPEN },
                { status: ReportStatus.IN_PROGRESS }
            ]
        });

        for (const report of activeReports) {
            const timeSinceCreation = now.getTime() - report.created_at.getTime();
            const hoursSinceCreation = timeSinceCreation / (1000 * 60 * 60);

            let breached = false;
            let expectedHours = 24;

            switch (report.priority) {
                case ReportPriority.CRITICAL:
                    expectedHours = 1;
                    if (hoursSinceCreation > 1) breached = true;
                    break;
                case ReportPriority.HIGH:
                    expectedHours = 4;
                    if (hoursSinceCreation > 4) breached = true;
                    break;
                case ReportPriority.MEDIUM:
                    expectedHours = 24;
                    if (hoursSinceCreation > 24) breached = true;
                    break;
                case ReportPriority.LOW:
                    expectedHours = 72;
                    if (hoursSinceCreation > 72) breached = true;
                    break;
            }

            if (breached) {
                this.logger.warn(`[SLA BREACH ALERT] Report ${report.report_id} (${report.priority}) has breached its SLA of ${expectedHours} hours. Active for ${hoursSinceCreation.toFixed(2)} hours.`);

                // In a real app, notify the department head, the assigned worker, or escalate to Admin.
                if (report.assigned_department) {
                    await this.notificationService.notifyOfficial(report.assigned_department, report.report_id);
                }
            }
        }
    }
}
