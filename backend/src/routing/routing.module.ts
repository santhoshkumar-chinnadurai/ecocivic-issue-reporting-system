import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutingService } from './routing.service';
import { Report } from '../reports/report.entity';

import { UsersModule } from '../users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Report]), UsersModule],
    providers: [RoutingService],
    exports: [RoutingService],
})
export class RoutingModule { }
