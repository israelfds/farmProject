import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  DashboardService,
  DashboardSummary,
  FarmsByState,
  CropsData,
  LandUseData,
} from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Obter resumo geral das fazendas' })
  @ApiResponse({
    status: 200,
    description: 'Resumo retornado com sucesso',
    schema: {
      type: 'object',
      properties: {
        totalFarms: { type: 'number', example: 150 },
        totalAreaHectares: { type: 'number', example: 25000.5 },
      },
    },
  })
  async getSummary(): Promise<DashboardSummary> {
    return await this.dashboardService.getSummary();
  }

  @Get('farms-by-state')
  @ApiOperation({ summary: 'Obter dados de fazendas por estado' })
  @ApiResponse({
    status: 200,
    description: 'Dados por estado retornados com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          state: { type: 'string', example: 'SP' },
          count: { type: 'number', example: 45 },
          totalArea: { type: 'number', example: 8500.2 },
        },
      },
    },
  })
  async getFarmsByState(): Promise<FarmsByState[]> {
    return await this.dashboardService.getFarmsByState();
  }

  @Get('crops')
  @ApiOperation({ summary: 'Obter dados de culturas plantadas' })
  @ApiResponse({
    status: 200,
    description: 'Dados de culturas retornados com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          cropName: { type: 'string', example: 'Soja' },
          count: { type: 'number', example: 80 },
          totalArea: { type: 'number', example: 12000.5 },
        },
      },
    },
  })
  async getCropsData(): Promise<CropsData[]> {
    return await this.dashboardService.getCropsData();
  }

  @Get('land-use')
  @ApiOperation({ summary: 'Obter dados de uso do solo' })
  @ApiResponse({
    status: 200,
    description: 'Dados de uso do solo retornados com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          category: { type: 'string', example: 'Área Agricultável' },
          totalArea: { type: 'number', example: 18000.3 },
          percentage: { type: 'number', example: 72.0 },
        },
      },
    },
  })
  async getLandUseData(): Promise<LandUseData[]> {
    return await this.dashboardService.getLandUseData();
  }


}
