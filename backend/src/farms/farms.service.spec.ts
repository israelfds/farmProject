import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FarmsService } from './farms.service';
import { Farm } from './entities/farm.entity';
import { PlantedCrop } from './entities/planted-crop.entity';
import { Producer } from '../producers/entities/producer.entity';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { AddCropDto } from './dto/add-crop.dto';

describe('FarmsService', () => {
  let service: FarmsService;
  let farmRepository: Repository<Farm>;
  let plantedCropRepository: Repository<PlantedCrop>;
  let producerRepository: Repository<Producer>;

  const mockFarmRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockPlantedCropRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockProducerRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmsService,
        {
          provide: getRepositoryToken(Farm),
          useValue: mockFarmRepository,
        },
        {
          provide: getRepositoryToken(PlantedCrop),
          useValue: mockPlantedCropRepository,
        },
        {
          provide: getRepositoryToken(Producer),
          useValue: mockProducerRepository,
        },
      ],
    }).compile();

    service = module.get<FarmsService>(FarmsService);
    farmRepository = module.get<Repository<Farm>>(getRepositoryToken(Farm));
    plantedCropRepository = module.get<Repository<PlantedCrop>>(
      getRepositoryToken(PlantedCrop),
    );
    producerRepository = module.get<Repository<Producer>>(
      getRepositoryToken(Producer),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new farm successfully', async () => {
      const createDto: CreateFarmDto = {
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalAreaHectares: 1000,
        arableAreaHectares: 800,
        vegetationAreaHectares: 200,
        producerId: 'producer-id',
      };

      const producer = { id: 'producer-id', name: 'João Silva' };
      const farm = {
        id: '1',
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProducerRepository.findOne.mockResolvedValue(producer);
      mockFarmRepository.create.mockReturnValue(farm);
      mockFarmRepository.save.mockResolvedValue(farm);

      const result = await service.create(createDto);

      expect(mockProducerRepository.findOne).toHaveBeenCalledWith({
        where: { id: createDto.producerId },
      });
      expect(mockFarmRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockFarmRepository.save).toHaveBeenCalledWith(farm);
      expect(result).toEqual(farm);
    });

    it('should throw BadRequestException when producer not found', async () => {
      const createDto: CreateFarmDto = {
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalAreaHectares: 1000,
        arableAreaHectares: 800,
        vegetationAreaHectares: 200,
        producerId: 'non-existent-producer',
      };

      mockProducerRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockProducerRepository.findOne).toHaveBeenCalledWith({
        where: { id: createDto.producerId },
      });
      expect(mockFarmRepository.create).not.toHaveBeenCalled();
      expect(mockFarmRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when areas sum exceeds total area', async () => {
      const createDto: CreateFarmDto = {
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalAreaHectares: 1000,
        arableAreaHectares: 800,
        vegetationAreaHectares: 300, // 800 + 300 = 1100 > 1000
        producerId: 'producer-id',
      };

      const producer = { id: 'producer-id', name: 'João Silva' };
      mockProducerRepository.findOne.mockResolvedValue(producer);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockProducerRepository.findOne).toHaveBeenCalledWith({
        where: { id: createDto.producerId },
      });
      expect(mockFarmRepository.create).not.toHaveBeenCalled();
      expect(mockFarmRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all farms with relations', async () => {
      const farms = [
        { id: '1', name: 'Fazenda São João', producer: {}, plantedCrops: [] },
        {
          id: '2',
          name: 'Fazenda Santa Maria',
          producer: {},
          plantedCrops: [],
        },
      ];

      mockFarmRepository.find.mockResolvedValue(farms);

      const result = await service.findAll();

      expect(mockFarmRepository.find).toHaveBeenCalledWith({
        relations: ['producer', 'plantedCrops'],
      });
      expect(result).toEqual(farms);
    });
  });

  describe('findOne', () => {
    it('should return a farm by id', async () => {
      const farm = {
        id: '1',
        name: 'Fazenda São João',
        producer: {},
        plantedCrops: [],
      };

      mockFarmRepository.findOne.mockResolvedValue(farm);

      const result = await service.findOne('1');

      expect(mockFarmRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['producer', 'plantedCrops'],
      });
      expect(result).toEqual(farm);
    });

    it('should throw NotFoundException when farm not found', async () => {
      mockFarmRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
      expect(mockFarmRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['producer', 'plantedCrops'],
      });
    });
  });

  describe('update', () => {
    it('should update a farm successfully', async () => {
      const updateDto: UpdateFarmDto = { name: 'Fazenda São João Updated' };
      const existingFarm = {
        id: '1',
        name: 'Fazenda São João',
        totalAreaHectares: 1000,
        arableAreaHectares: 800,
        vegetationAreaHectares: 200,
      };
      const updatedFarm = { ...existingFarm, ...updateDto };

      mockFarmRepository.findOne.mockResolvedValue(existingFarm);
      mockFarmRepository.save.mockResolvedValue(updatedFarm);

      const result = await service.update('1', updateDto);

      expect(mockFarmRepository.save).toHaveBeenCalledWith(updatedFarm);
      expect(result).toEqual(updatedFarm);
    });

    it('should validate areas when updating farm areas', async () => {
      const updateDto: UpdateFarmDto = { totalAreaHectares: 500 };
      const existingFarm = {
        id: '1',
        name: 'Fazenda São João',
        totalAreaHectares: 1000,
        arableAreaHectares: 800,
        vegetationAreaHectares: 200,
      };

      mockFarmRepository.findOne.mockResolvedValue(existingFarm);

      await expect(service.update('1', updateDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockFarmRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('addCrop', () => {
    it('should add a crop to a farm successfully', async () => {
      const addCropDto: AddCropDto = {
        cropName: 'Soja',
        harvestSeason: 'Safra 2023',
      };

      const farm = { id: '1', name: 'Fazenda São João' };
      const crop = { id: '1', ...addCropDto, farmId: farm.id };

      mockFarmRepository.findOne.mockResolvedValue(farm);
      mockPlantedCropRepository.create.mockReturnValue(crop);
      mockPlantedCropRepository.save.mockResolvedValue(crop);

      const result = await service.addCrop('1', addCropDto);

      expect(mockPlantedCropRepository.create).toHaveBeenCalledWith({
        ...addCropDto,
        farmId: farm.id,
      });
      expect(mockPlantedCropRepository.save).toHaveBeenCalledWith(crop);
      expect(result).toEqual(crop);
    });
  });

  describe('removeCrop', () => {
    it('should remove a crop from a farm successfully', async () => {
      const crop = { id: '1', cropName: 'Soja', farmId: '1' };

      mockPlantedCropRepository.findOne.mockResolvedValue(crop);
      mockPlantedCropRepository.remove.mockResolvedValue(crop);

      await service.removeCrop('1', '1');

      expect(mockPlantedCropRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', farmId: '1' },
      });
      expect(mockPlantedCropRepository.remove).toHaveBeenCalledWith(crop);
    });

    it('should throw NotFoundException when crop not found', async () => {
      mockPlantedCropRepository.findOne.mockResolvedValue(null);

      await expect(service.removeCrop('1', '1')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPlantedCropRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', farmId: '1' },
      });
    });
  });
});
