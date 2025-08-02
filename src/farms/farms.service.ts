import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farm } from './entities/farm.entity';
import { PlantedCrop } from './entities/planted-crop.entity';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { AddCropDto } from './dto/add-crop.dto';
import { Producer } from '../producers/entities/producer.entity';

@Injectable()
export class FarmsService {
  constructor(
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
    @InjectRepository(PlantedCrop)
    private readonly plantedCropRepository: Repository<PlantedCrop>,
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
  ) {}

  private validateFarmAreas(
    totalArea: number,
    arableArea: number,
    vegetationArea: number,
  ): void {
    if (arableArea + vegetationArea > totalArea) {
      throw new BadRequestException(
        'A soma das áreas agricultável e de vegetação não pode ser maior que a área total.',
      );
    }
  }

  async create(createFarmDto: CreateFarmDto): Promise<Farm> {
    // Verificar se o produtor existe
    const producer = await this.producerRepository.findOne({
      where: { id: createFarmDto.producerId },
    });

    if (!producer) {
      throw new BadRequestException(
        `Produtor com ID ${createFarmDto.producerId} não encontrado`,
      );
    }

    this.validateFarmAreas(
      createFarmDto.totalAreaHectares,
      createFarmDto.arableAreaHectares,
      createFarmDto.vegetationAreaHectares,
    );

    const farm = this.farmRepository.create(createFarmDto);
    return await this.farmRepository.save(farm);
  }

  async findAll(): Promise<Farm[]> {
    return await this.farmRepository.find({
      relations: ['producer', 'plantedCrops'],
    });
  }

  async findOne(id: string): Promise<Farm> {
    const farm = await this.farmRepository.findOne({
      where: { id },
      relations: ['producer', 'plantedCrops'],
    });

    if (!farm) {
      throw new NotFoundException(`Fazenda com ID ${id} não encontrada`);
    }

    return farm;
  }

  async update(id: string, updateFarmDto: UpdateFarmDto): Promise<Farm> {
    const farm = await this.findOne(id);

    // Se estiver atualizando as áreas, validar novamente
    if (
      'totalAreaHectares' in updateFarmDto ||
      'arableAreaHectares' in updateFarmDto ||
      'vegetationAreaHectares' in updateFarmDto
    ) {
      const totalArea =
        updateFarmDto.totalAreaHectares ?? farm.totalAreaHectares;
      const arableArea =
        updateFarmDto.arableAreaHectares ?? farm.arableAreaHectares;
      const vegetationArea =
        updateFarmDto.vegetationAreaHectares ?? farm.vegetationAreaHectares;

      this.validateFarmAreas(totalArea, arableArea, vegetationArea);
    }

    Object.assign(farm, updateFarmDto);
    return await this.farmRepository.save(farm);
  }

  async remove(id: string): Promise<void> {
    const farm = await this.findOne(id);
    await this.farmRepository.remove(farm);
  }

  async addCrop(farmId: string, addCropDto: AddCropDto): Promise<PlantedCrop> {
    const farm = await this.findOne(farmId);

    const crop = this.plantedCropRepository.create({
      ...addCropDto,
      farmId: farm.id,
    });

    return await this.plantedCropRepository.save(crop);
  }

  async removeCrop(farmId: string, cropId: string): Promise<void> {
    const crop = await this.plantedCropRepository.findOne({
      where: { id: cropId, farmId },
    });

    if (!crop) {
      throw new NotFoundException(
        `Cultura com ID ${cropId} não encontrada na fazenda ${farmId}`,
      );
    }

    await this.plantedCropRepository.remove(crop);
  }
}
