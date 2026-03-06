import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

export enum ReportStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    APPROVED = 'APPROVED',
    RESOLVED = 'RESOLVED',
    REJECTED = 'REJECTED',
}

export enum ReportPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL',
}

@Entity('reports')
export class Report {
    @PrimaryGeneratedColumn('uuid')
    report_id: string;

    @Column()
    user_id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    category: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({
        type: 'simple-enum',
        enum: ReportPriority,
        default: ReportPriority.MEDIUM,
    })
    priority: ReportPriority;

    @Column({ nullable: true })
    location: string;

    @Column({ type: 'text' })
    image_url: string;

    @Column('decimal', { precision: 9, scale: 6 })
    latitude: number;

    @Column('decimal', { precision: 9, scale: 6 })
    longitude: number;

    @Column({ type: 'int', nullable: true })
    ward_id: number;

    @Column({
        type: 'simple-enum',
        enum: ReportStatus,
        default: ReportStatus.OPEN,
    })
    status: ReportStatus;

    @Column({ nullable: true })
    assigned_department: string;

    @Column({ nullable: true })
    assigned_worker_id: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'assigned_worker_id' })
    assigned_worker: User;

    @Column({ type: 'text', nullable: true })
    proof_image_url: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
