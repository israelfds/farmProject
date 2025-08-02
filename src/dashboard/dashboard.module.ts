import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Farm } from '../farms/entities/farm.entity';
import { PlantedCrop } from '../farms/entities/planted-crop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Farm, PlantedCrop])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
