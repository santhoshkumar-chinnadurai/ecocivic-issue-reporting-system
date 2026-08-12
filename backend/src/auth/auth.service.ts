import { Injectable, OnModuleInit, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async onModuleInit() {
        // Create Admin Accounts
        const adminEmails = ['santhoshkumar@civic.com', 'admin@civic.com'];
        for (const email of adminEmails) {
            const existing = await this.usersRepository.findOneBy({ email });
            if (!existing) {
                const hashedPassword = await bcrypt.hash('admin123', 10);
                const admin = this.usersRepository.create({
                    email,
                    password: hashedPassword,
                    role: UserRole.ADMIN,
                    provider: 'LOCAL',
                });
                await this.usersRepository.save(admin);
                console.log(`Admin Created: ${email} / admin123`);
            }
        }

        // Create Official Accounts
        const officialEmails = ['sivananth@civic.com', 'official@civic.com'];
        for (const email of officialEmails) {
            const existing = await this.usersRepository.findOneBy({ email });
            if (!existing) {
                const hashedPassword = await bcrypt.hash('official123', 10);
                const official = this.usersRepository.create({
                    email,
                    password: hashedPassword,
                    role: UserRole.OFFICIAL,
                    provider: 'LOCAL',
                });
                await this.usersRepository.save(official);
                console.log(`Official Created: ${email} / official123`);
            }
        }

        // Create Citizen Accounts
        const citizenEmails = [{ email: 'suganthan@civic.com', points: 3600 }];
        for (const c of citizenEmails) {
            const existing = await this.usersRepository.findOneBy({ email: c.email });
            if (!existing) {
                const hashedPassword = await bcrypt.hash('citizen123', 10);
                const citizen = this.usersRepository.create({
                    email: c.email,
                    password: hashedPassword,
                    role: UserRole.CITIZEN,
                    points: c.points,
                    provider: 'LOCAL',
                });
                await this.usersRepository.save(citizen);
                console.log(`Citizen Created: ${c.email} / citizen123 (${c.points} XP)`);
            }
        }

        // Create Worker Accounts (Servesh Thangavel as Lead Worker)
        const workerEmails = [
            { email: 'servesh@civic.com', points: 3400 },
            { email: 'worker@civic.com', points: 2100 },
            { email: 'worker2@civic.com', points: 1750 },
            { email: 'worker3@civic.com', points: 1450 },
            { email: 'worker4@civic.com', points: 1200 }
        ];

        for (const w of workerEmails) {
            const existingWorker = await this.usersRepository.findOneBy({ email: w.email });
            if (!existingWorker) {
                console.log(`Creating Worker User (${w.email})...`);
                const hashedPassword = await bcrypt.hash('worker123', 10);
                const worker = this.usersRepository.create({
                    email: w.email,
                    password: hashedPassword,
                    role: UserRole.WORKER,
                    points: w.points,
                    provider: 'LOCAL',
                });
                await this.usersRepository.save(worker);
                console.log(`Worker Created: ${w.email} / worker123 (${w.points} XP)`);
            } else if (w.email === 'servesh@civic.com' || existingWorker.points < w.points) {
                existingWorker.points = w.points;
                await this.usersRepository.save(existingWorker);
            }
        }
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersRepository.findOneBy({ email });
        if (user && await bcrypt.compare(pass, user.password)) {
            if (user.is_banned) {
                throw new UnauthorizedException('user account was banned by admin');
            }
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any, ipAddress?: string) {
        // Track IP and Location
        if (ipAddress && user.user_id) {
            try {
                // If it's a localhost IP from IPv6 mapped to IPv4
                const isLocal = ipAddress === '::1' || ipAddress === '127.0.0.1' || ipAddress.includes('::ffff:127.0.0.1');
                const targetIp = isLocal ? '' : ipAddress; // Empty string auto-detects caller IP for ip-api

                const response = await fetch(`http://ip-api.com/json/${targetIp}`);
                const locationData = await response.json();

                // Fetch real user to save
                const realUser = await this.usersRepository.findOneBy({ user_id: user.user_id });
                if (realUser) {
                    if (locationData && locationData.status === 'success') {
                        realUser.last_ip = (isLocal && locationData.query) ? locationData.query : ipAddress;
                        realUser.last_location = `${locationData.city}, ${locationData.regionName}, ${locationData.country}`;
                    } else if (isLocal) {
                         realUser.last_ip = ipAddress;
                         realUser.last_location = 'Localhost (Dev Environment)';
                    } else {
                         realUser.last_ip = ipAddress;
                         realUser.last_location = 'Unknown';
                    }
                    realUser.last_login_at = new Date();
                    await this.usersRepository.save(realUser);
                }
            } catch (error) {
                console.error("Failed to resolve IP location", error);
            }
        }

        const payload = { email: user.email, sub: user.user_id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user
        };
    }

    async register(data: any) {
        const existing = await this.usersRepository.findOneBy({ email: data.email });
        if (existing) {
            throw new ConflictException('Email already exists');
        }

        if (data.phone) {
            const existingPhone = await this.usersRepository.findOneBy({ phone_number: data.phone });
            if (existingPhone) {
                throw new ConflictException('Phone number already in use');
            }
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = this.usersRepository.create({
            email: data.email,
            password: hashedPassword,
            phone_number: data.phone,
            role: UserRole.CITIZEN,
            provider: 'LOCAL'
        });
        return this.usersRepository.save(user);
    }

    async createAdmin(data: any) {
        const existing = await this.usersRepository.findOneBy({ email: data.email });
        if (existing) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = this.usersRepository.create({
            email: data.email,
            password: hashedPassword,
            phone_number: data.phone,
            role: UserRole.ADMIN,
            provider: 'LOCAL'
        });
        return this.usersRepository.save(user);
    }

    async changePassword(userId: string, oldPass: string, newPass: string) {
        const user = await this.usersRepository.findOneBy({ user_id: userId });
        if (!user) throw new UnauthorizedException();

        const isMatch = await bcrypt.compare(oldPass, user.password);
        if (!isMatch) throw new UnauthorizedException('Incorrect old password');

        user.password = await bcrypt.hash(newPass, 10);
        return this.usersRepository.save(user);
    }

    async loginWithPhone(phoneNumber: string) {
        let user = await this.usersRepository.findOneBy({ phone_number: phoneNumber });
        if (!user) {
            user = this.usersRepository.create({
                phone_number: phoneNumber,
                role: UserRole.CITIZEN
            });
            await this.usersRepository.save(user);
        }
        const payload = { phone: user.phone_number, sub: user.user_id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user
        };
    }
}
