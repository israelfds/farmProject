import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Producer } from '../../producers/entities/producer.entity';
import { PlantedCrop } from './planted-crop.entity';

@Entity('farms')
export class Farm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 2 })
  state: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'total_area_hectares',
  })
  totalAreaHectares: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'arable_area_hectares',
  })
  arableAreaHectares: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'vegetation_area_hectares',
  })
  vegetationAreaHectares: number;

  @Column({ type: 'uuid', name: 'producer_id' })
  producerId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Producer, (producer) => producer.farms)
  @JoinColumn({ name: 'producer_id' })
  producer: Producer;

  @OneToMany(() => PlantedCrop, (crop) => crop.farm, { cascade: true })
  plantedCrops: PlantedCrop[];
}
