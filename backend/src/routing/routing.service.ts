import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportStatus, ReportPriority } from '../reports/report.entity';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/user.entity';

@Injectable()
export class RoutingService {
    constructor(
        @InjectRepository(Report)
        private reportsRepository: Repository<Report>,
        private usersService: UsersService,
    ) { }

    private readonly CATEGORY_DEPT_MAP: Record<string, string> = {
        'POTHOLE': 'Roads & Bridges',
        'GARBAGE': 'Sanitation',
        'STREET_LIGHT': 'Electrical',
        'WATER_LEAK': 'Water Supply',
        'TRAFFIC_SIGNAL': 'Traffic Management'
    };

    async routeReport(reportId: string) {
        const report = await this.reportsRepository.findOneBy({ report_id: reportId });
        if (!report) return;

        const deptName = this.CATEGORY_DEPT_MAP[report.category] || 'General Administration';
        report.assigned_department = deptName;

        // Smart Worker Allocation (Load Balancing)
        const allUsers = await this.usersService.findAll();
        const workers = allUsers.filter(u => u.role === UserRole.WORKER);

        if (workers.length > 0) {
            let bestWorker = null;
            let minTasks = Infinity;

            for (const worker of workers) {
                const activeTasks = await this.reportsRepository.count({
                    where: { assigned_worker_id: worker.user_id, status: ReportStatus.IN_PROGRESS }
                });

                // For critical priority, we could factor in "skill" if available
                // Here we just use pure load balancing for MVP
                if (activeTasks < minTasks) {
                    minTasks = activeTasks;
                    bestWorker = worker;
                }
            }

            if (bestWorker) {
                report.assigned_worker_id = bestWorker.user_id;
                // report.status = ReportStatus.IN_PROGRESS; // Optional: auto-move to IN_PROGRESS or keep OPEN for manual approval
                console.log(`[ROUTING ENGINE] Smart Allocated ${reportId} to ${bestWorker.email} (Current Load: ${minTasks} tasks)`);
            }
        } else {
            console.log(`[ROUTING ENGINE] Report ${reportId} assigned to Dept: ${deptName}. No workers available.`);
        }

        await this.reportsRepository.save(report);
    }
}
