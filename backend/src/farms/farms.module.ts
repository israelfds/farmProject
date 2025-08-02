import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmsService } from './farms.service';
import { FarmsController } from './farms.controller';
import { Farm } from './entities/farm.entity';
import { PlantedCrop } from './entities/planted-crop.entity';
import { Producer } from '../producers/entities/producer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Farm, PlantedCrop, Producer])],
  controllers: [FarmsController],
  providers: [FarmsService],
  exports: [FarmsService],
})
export class FarmsModule {}
