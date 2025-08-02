import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FarmsService } from './farms.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { AddCropDto } from './dto/add-crop.dto';
import { Farm } from './entities/farm.entity';
import { PlantedCrop } from './entities/planted-crop.entity';
import { UuidValidationPipe } from '../common/pipes/uuid-validation.pipe';

@ApiTags('Fazendas')
@Controller('farms')
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar uma nova fazenda' })
  @ApiResponse({
    status: 201,
    description: 'Fazenda criada com sucesso',
    type: Farm,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou soma das áreas inválida',
  })
  async create(@Body() createFarmDto: CreateFarmDto): Promise<Farm> {
    return await this.farmsService.create(createFarmDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as fazendas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de fazendas retornada com sucesso',
    type: [Farm],
  })
  async findAll(): Promise<Farm[]> {
    return await this.farmsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter dados de uma fazenda específica' })
  @ApiParam({ name: 'id', description: 'ID da fazenda' })
  @ApiResponse({
    status: 200,
    description: 'Fazenda encontrada com sucesso',
    type: Farm,
  })
  @ApiResponse({
    status: 404,
    description: 'Fazenda não encontrada',
  })
  async findOne(@Param('id', UuidValidationPipe) id: string): Promise<Farm> {
    return await this.farmsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de uma fazenda' })
  @ApiParam({ name: 'id', description: 'ID da fazenda' })
  @ApiResponse({
    status: 200,
    description: 'Fazenda atualizada com sucesso',
    type: Farm,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou soma das áreas inválida',
  })
  @ApiResponse({
    status: 404,
    description: 'Fazenda não encontrada',
  })
  async update(
    @Param('id', UuidValidationPipe) id: string,
    @Body() updateFarmDto: UpdateFarmDto,
  ): Promise<Farm> {
    return await this.farmsService.update(id, updateFarmDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir uma fazenda' })
  @ApiParam({ name: 'id', description: 'ID da fazenda' })
  @ApiResponse({
    status: 204,
    description: 'Fazenda excluída com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Fazenda não encontrada',
  })
  async remove(@Param('id', UuidValidationPipe) id: string): Promise<void> {
    return await this.farmsService.remove(id);
  }

  @Post(':farmId/crops')
  @ApiOperation({ summary: 'Adicionar uma nova cultura a uma fazenda' })
  @ApiParam({ name: 'farmId', description: 'ID da fazenda' })
  @ApiResponse({
    status: 201,
    description: 'Cultura adicionada com sucesso',
    type: PlantedCrop,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Fazenda não encontrada',
  })
  async addCrop(
    @Param('farmId', UuidValidationPipe) farmId: string,
    @Body() addCropDto: AddCropDto,
  ): Promise<PlantedCrop> {
    return await this.farmsService.addCrop(farmId, addCropDto);
  }

  @Delete(':farmId/crops/:cropId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover uma cultura de uma fazenda' })
  @ApiParam({ name: 'farmId', description: 'ID da fazenda' })
  @ApiParam({ name: 'cropId', description: 'ID da cultura' })
  @ApiResponse({
    status: 204,
    description: 'Cultura removida com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Fazenda ou cultura não encontrada',
  })
  async removeCrop(
    @Param('farmId', UuidValidationPipe) farmId: string,
    @Param('cropId', UuidValidationPipe) cropId: string,
  ): Promise<void> {
    return await this.farmsService.removeCrop(farmId, cropId);
  }
}
