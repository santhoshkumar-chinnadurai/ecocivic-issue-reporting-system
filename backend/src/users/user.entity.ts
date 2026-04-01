import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum UserRole {
    CITIZEN = 'CITIZEN',
    ADMIN = 'ADMIN',
    OFFICIAL = 'OFFICIAL',
    WORKER = 'WORKER',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    user_id: string;

    @Column({ unique: true, nullable: true })
    phone_number: string;

    @Column({ nullable: true, unique: true })
    email: string;

    @Column({ nullable: true }) // Hashed password
    password: string;

    @Column({ default: 'LOCAL' }) // LOCAL, GOOGLE, APPLE
    provider: string;

    @Column({
        type: 'simple-enum',
        enum: UserRole,
        default: UserRole.CITIZEN,
    })
    role: UserRole;

    @Column({ nullable: true })
    fcm_token: string;

    @Column({ default: 0 })
    points: number;

    @Column({ nullable: true })
    last_ip: string;

    @Column({ nullable: true })
    last_location: string;

    @Column({ nullable: true })
    last_login_at: Date;

    @Column({ default: false })
    is_banned: boolean;

    @Column({ nullable: true })
    ban_reason: string;

    @CreateDateColumn()
    created_at: Date;
}
