import { Controller, Post, Body, UseGuards, Request, Get, Req } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../users/user.entity';
import * as requestIp from 'request-ip';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() body: any, @Req() req: ExpressRequest) {
        const clientIp = requestIp.getClientIp(req);
        if (body.phone) {
            return this.authService.loginWithPhone(body.phone);
        } else if (body.email && body.password) {
            const user = await this.authService.validateUser(body.email, body.password);
            if (!user) {
                return { error: 'Invalid credentials' };
            }
            return this.authService.login(user, clientIp);
        }
        return { error: 'Invalid Request' };
    }

    @Post('register')
    async register(@Body() body: any) {
        return this.authService.register(body);
    }

    @Post('change-password')
    async changePassword(@Body() body: any) {
        return this.authService.changePassword(body.userId, body.oldPassword, body.newPassword);
    }
}
