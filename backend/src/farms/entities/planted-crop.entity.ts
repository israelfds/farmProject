import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Farm } from './farm.entity';

@Entity('planted_crops')
export class PlantedCrop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, name: 'crop_name' })
  cropName: string;

  @Column({ type: 'varchar', length: 100, name: 'harvest_season' })
  harvestSeason: string;

  @Column({ type: 'uuid', name: 'farm_id' })
  farmId: string;

  @ManyToOne(() => Farm, (farm) => farm.plantedCrops)
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;
}
