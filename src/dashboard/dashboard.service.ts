import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farm } from '../farms/entities/farm.entity';
import { PlantedCrop } from '../farms/entities/planted-crop.entity';

export interface DashboardSummary {
  totalFarms: number;
  totalAreaHectares: number;
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
  ) {}

  async getSummary(): Promise<DashboardSummary> {
    const result = await this.farmRepository
      .createQueryBuilder('farm')
      .select([
        'COUNT(farm.id) as totalFarms',
        'SUM(farm.totalAreaHectares) as totalAreaHectares',
      ])
      .getRawOne();

    return {
      totalFarms: parseInt(result.totalFarms) || 0,
      totalAreaHectares: parseFloat(result.totalAreaHectares) || 0,
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
    const totalArea = summary.totalAreaHectares;

    if (totalArea === 0) {
      return [];
    }

    const result = await this.farmRepository
      .createQueryBuilder('farm')
      .select([
        'SUM(farm.arableAreaHectares) as arableArea',
        'SUM(farm.vegetationAreaHectares) as vegetationArea',
      ])
      .getRawOne();

    const arableArea = parseFloat(result.arableArea) || 0;
    const vegetationArea = parseFloat(result.vegetationArea) || 0;

    return [
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
  }
}
