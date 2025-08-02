import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farm } from '../farms/entities/farm.entity';
import { PlantedCrop } from '../farms/entities/planted-crop.entity';
import { Producer } from '../producers/entities/producer.entity';

export interface DashboardSummary {
  totalProducers: number;
  totalFarms: number;
  totalArea: number;
  totalCrops: number;
}

export interface FarmsByState {
  state: string;
  count: number;
  totalArea: number;
}

export interface CropsData {
  cropName: string;
  count: number;
  totalArea: number;
}

export interface LandUseData {
  category: string;
  totalArea: number;
  percentage: number;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
    @InjectRepository(PlantedCrop)
    private readonly plantedCropRepository: Repository<PlantedCrop>,
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
  ) {}

  async getSummary(): Promise<DashboardSummary> {
    const [farmsResult, producersResult, cropsResult] = await Promise.all([
      this.farmRepository
        .createQueryBuilder('farm')
        .select([
          'COUNT(farm.id) as totalFarms',
          'SUM(farm.totalAreaHectares) as totalAreaHectares',
        ])
        .getRawOne(),
      this.producerRepository
        .createQueryBuilder('producer')
        .select('COUNT(producer.id) as totalProducers')
        .getRawOne(),
      this.plantedCropRepository
        .createQueryBuilder('crop')
        .select('COUNT(crop.id) as totalCrops')
        .getRawOne(),
    ]);

    return {
      totalProducers: parseInt(producersResult.totalproducers) || 0,
      totalFarms: parseInt(farmsResult.totalfarms) || 0,
      totalArea: parseFloat(farmsResult.totalareahectares) || 0,
      totalCrops: parseInt(cropsResult.totalcrops) || 0,
    };
  }

  async getFarmsByState(): Promise<FarmsByState[]> {
    const result = await this.farmRepository
      .createQueryBuilder('farm')
      .select([
        'farm.state as state',
        'COUNT(farm.id) as count',
        'SUM(farm.totalAreaHectares) as totalArea',
      ])
      .groupBy('farm.state')
      .orderBy('count', 'DESC')
      .getRawMany();

    return result.map((item) => ({
      state: item.state,
      count: parseInt(item.count),
      totalArea: parseFloat(item.totalarea),
    }));
  }

  async getCropsData(): Promise<CropsData[]> {
    const result = await this.plantedCropRepository
      .createQueryBuilder('crop')
      .leftJoin('crop.farm', 'farm')
      .select([
        'crop.cropName as cropName',
        'COUNT(crop.id) as count',
        'SUM(farm.totalAreaHectares) as totalArea',
      ])
      .groupBy('crop.cropName')
      .orderBy('count', 'DESC')
      .getRawMany();

    return result.map((item) => ({
      cropName: item.cropname,
      count: parseInt(item.count),
      totalArea: parseFloat(item.totalarea),
    }));
  }

  async getLandUseData(): Promise<LandUseData[]> {
    const summary = await this.getSummary();
    const totalArea = summary.totalArea;

    if (totalArea === 0) {
      return [];
    }

    // Buscar todas as fazendas e calcular manualmente para evitar problemas de concatenação
    const farms = await this.farmRepository.find({
      select: ['arableAreaHectares', 'vegetationAreaHectares']
    });

    const arableArea = farms.reduce((sum, farm) => sum + Number(farm.arableAreaHectares), 0);
    const vegetationArea = farms.reduce((sum, farm) => sum + Number(farm.vegetationAreaHectares), 0);
    const unusedArea = Math.max(0, totalArea - arableArea - vegetationArea);

    const landUseData = [
      {
        category: 'Área Agricultável',
        totalArea: arableArea,
        percentage: (arableArea / totalArea) * 100,
      },
      {
        category: 'Área de Vegetação',
        totalArea: vegetationArea,
        percentage: (vegetationArea / totalArea) * 100,
      },
    ];

    // Adicionar área não utilizada se houver
    if (unusedArea > 0) {
      landUseData.push({
        category: 'Área Não Utilizada',
        totalArea: unusedArea,
        percentage: (unusedArea / totalArea) * 100,
      });
    }

    return landUseData;
  }
}
