import { Injectable, NotFoundException, Logger, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportStatus, ReportPriority } from './report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { AiService } from '../ai/ai.service';
import { RoutingService } from '../routing/routing.service';
import { NotificationService } from '../notifications/notification.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReportsService {
    private readonly logger = new Logger(ReportsService.name);

    constructor(
        @InjectRepository(Report)
        private reportsRepository: Repository<Report>,
        private aiService: AiService,
        private routingService: RoutingService,
        private notificationService: NotificationService,
        private usersService: UsersService,
    ) { }

    async create(createReportDto: CreateReportDto): Promise<Report> {
        try {
            // 1. AI Validation
            this.logger.log(`Validating image via AI...`);
            const aiAnalysis = await this.aiService.analyzeImage(createReportDto.image_url);
            if (!aiAnalysis.valid) {
                this.logger.warn(`Report rejected by AI: ${aiAnalysis.category}`);
            } else {
                this.logger.log(`AI Confidence: ${aiAnalysis.confidence}`);
            }

            // 1.5 AI Smart Categorization & NLP Priority 
            this.logger.log(`Performing NLP Categorization...`);
            const aiCategorization = await this.aiService.categorizeComplaint(
                createReportDto.description || '',
                createReportDto.category || ''
            );
            this.logger.log(`NLP Category: ${aiCategorization.category}, Priority: ${aiCategorization.priority} (Confidence: ${aiCategorization.confidence})`);

            // 2. Save Report
            const report = this.reportsRepository.create({
                ...createReportDto,
                category: aiCategorization.confidence > 0.8 ? aiCategorization.category : createReportDto.category,
                priority: (createReportDto.priority || aiCategorization.priority) as ReportPriority,
                user_id: createReportDto.userId, // Map camelCase DTO to snake_case Entity
                status: ReportStatus.OPEN,
            });
            const savedReport = await this.reportsRepository.save(report);

            // 3. Automated Routing
            await this.routingService.routeReport(savedReport.report_id);

            // 4. Send Confirmation Notification
            await this.notificationService.sendStatusUpdate(savedReport.user_id, savedReport.report_id, 'OPEN');

            return savedReport;
        } catch (error) {
            this.logger.error(`Failed to create report: ${error.message}`, error.stack);
            throw error;
        }
    }

    async findAll(user: { user_id: string; role: string }): Promise<Report[]> {
        if (user.role === 'ADMIN' || user.role === 'OFFICIAL') {
            return this.reportsRepository.find({ order: { created_at: 'DESC' }, relations: ['assigned_worker'] });
        }
        if (user.role === 'WORKER') {
            return this.reportsRepository.find({
                where: { assigned_worker_id: user.user_id },
                order: { created_at: 'DESC' },
                relations: ['assigned_worker']
            });
        }
        return this.reportsRepository.find({
            where: { user_id: user.user_id },
            order: { created_at: 'DESC' },
            relations: ['assigned_worker']
        });
    }

    async findOne(id: string): Promise<Report> {
        return this.reportsRepository.findOne({
            where: { report_id: id },
            relations: ['user', 'assigned_worker'],
        });
    }

    async findByUser(userId: string): Promise<Report[]> {
        return this.reportsRepository.find({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
        });
    }

    async updateStatus(id: string, status: ReportStatus): Promise<Report> {
        const report = await this.findOne(id);
        if (!report) throw new NotFoundException('Report not found');

        report.status = status;
        const updated = await this.reportsRepository.save(report);

        // Notify User
        await this.notificationService.sendStatusUpdate(report.user_id, report.report_id, status);

        // Blockchain Audit Log Mock
        const crypto = await import('crypto');
        const eventData = JSON.stringify({ report_id: updated.report_id, status: updated.status, timestamp: new Date().toISOString() });
        const hash = crypto.createHash('sha256').update(eventData).digest('hex');
        this.logger.log(`[BLOCKCHAIN AUDIT] Logged status change to ledger. TxHash: 0x${hash}`);

        return updated;
    }

    async remove(id: string, user: { user_id: string; role: string }): Promise<void> {
        const report = await this.findOne(id);
        if (!report) throw new NotFoundException('Report not found');

        // Allow deletion if admin OR if the user is the owner
        if (user.role !== 'ADMIN' && report.user_id !== user.user_id) {
            throw new ForbiddenException('You do not have permission to delete this report');
        }

        await this.reportsRepository.remove(report);
    }

    async assignDepartment(id: string, department: string): Promise<Report> {
        const report = await this.findOne(id);
        if (!report) throw new NotFoundException('Report not found');

        report.assigned_department = department;
        return this.reportsRepository.save(report);
    }

    async assignWorker(id: string, workerId: string): Promise<Report> {
        const report = await this.findOne(id);
        if (!report) throw new NotFoundException('Report not found');

        report.assigned_worker_id = workerId;
        report.status = ReportStatus.IN_PROGRESS; // Auto-update status when assigned
        return this.reportsRepository.save(report);
    }

    async submitProof(id: string, proofImageUrl: string): Promise<Report> {
        const report = await this.findOne(id);
        if (!report) throw new NotFoundException('Report not found');

        report.proof_image_url = proofImageUrl;
        report.status = ReportStatus.RESOLVED; // Worker submits proof -> marked as resolved
        const savedReport = await this.reportsRepository.save(report);

        // Gamification: Award Points to Worker
        if (report.assigned_worker_id) {
            const worker = await this.usersService.findOne(report.assigned_worker_id);
            if (worker) {
                const priorityPoints = {
                    [ReportPriority.LOW]: 10,
                    [ReportPriority.MEDIUM]: 20,
                    [ReportPriority.HIGH]: 50,
                    [ReportPriority.CRITICAL]: 100,
                };
                const pointsEarned = priorityPoints[report.priority] || 10;
                await this.usersService.update(worker.user_id, { points: worker.points + pointsEarned });
                this.logger.log(`[GAMIFICATION] Worker ${worker.email} earned ${pointsEarned} points. Total: ${worker.points + pointsEarned}`);
            }
        }

        // Blockchain Audit Log Mock
        const crypto = await import('crypto');
        const eventData = JSON.stringify({ report_id: savedReport.report_id, status: savedReport.status, proof: proofImageUrl, timestamp: new Date().toISOString() });
        const hash = crypto.createHash('sha256').update(eventData).digest('hex');
        this.logger.log(`[BLOCKCHAIN AUDIT] Logged proof submission to ledger. TxHash: 0x${hash}`);

        return savedReport;
    }
}
