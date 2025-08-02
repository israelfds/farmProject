import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProducersService } from './producers.service';
import { Producer } from './entities/producer.entity';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';

describe('ProducersService', () => {
  let service: ProducersService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repository: Repository<Producer>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducersService,
        {
          provide: getRepositoryToken(Producer),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProducersService>(ProducersService);
    repository = module.get<Repository<Producer>>(getRepositoryToken(Producer));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new producer successfully', async () => {
      const createDto: CreateProducerDto = {
        name: 'João Silva',
        document: '123.456.789-00',
      };

      const producer = {
        id: '1',
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(producer);
      mockRepository.save.mockResolvedValue(producer);

      const result = await service.create(createDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { document: createDto.document },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(producer);
      expect(result).toEqual(producer);
    });

    it('should throw ConflictException when document already exists', async () => {
      const createDto: CreateProducerDto = {
        name: 'João Silva',
        document: '123.456.789-00',
      };

      const existingProducer = {
        id: '1',
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(existingProducer);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { document: createDto.document },
      });
    });
  });

  describe('findAll', () => {
    it('should return all producers with relations', async () => {
      const producers = [
        { id: '1', name: 'João Silva', document: '123.456.789-00', farms: [] },
        {
          id: '2',
          name: 'Maria Santos',
          document: '987.654.321-00',
          farms: [],
        },
      ];

      mockRepository.find.mockResolvedValue(producers);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['farms', 'farms.plantedCrops'],
      });
      expect(result).toEqual(producers);
    });
  });

  describe('findOne', () => {
    it('should return a producer by id', async () => {
      const producer = {
        id: '1',
        name: 'João Silva',
        document: '123.456.789-00',
        farms: [],
      };

      mockRepository.findOne.mockResolvedValue(producer);

      const result = await service.findOne('1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['farms', 'farms.plantedCrops'],
      });
      expect(result).toEqual(producer);
    });

    it('should throw NotFoundException when producer not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['farms', 'farms.plantedCrops'],
      });
    });
  });

  describe('update', () => {
    it('should update a producer successfully', async () => {
      const updateDto: UpdateProducerDto = { name: 'João Silva Updated' };
      const existingProducer = {
        id: '1',
        name: 'João Silva',
        document: '123.456.789-00',
      };
      const updatedProducer = { ...existingProducer, ...updateDto };

      mockRepository.findOne.mockResolvedValue(existingProducer);
      mockRepository.save.mockResolvedValue(updatedProducer);

      const result = await service.update('1', updateDto);

      expect(mockRepository.save).toHaveBeenCalledWith(updatedProducer);
      expect(result).toEqual(updatedProducer);
    });

    it('should throw ConflictException when updating to existing document', async () => {
      const updateDto: UpdateProducerDto = { document: '987.654.321-00' };
      const existingProducer = {
        id: '1',
        name: 'João Silva',
        document: '123.456.789-00',
      };
      const conflictingProducer = {
        id: '2',
        name: 'Maria Santos',
        document: '987.654.321-00',
      };

      mockRepository.findOne
        .mockResolvedValueOnce(existingProducer)
        .mockResolvedValueOnce(conflictingProducer);

      await expect(service.update('1', updateDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a producer successfully', async () => {
      const producer = {
        id: '1',
        name: 'João Silva',
        document: '123.456.789-00',
      };

      mockRepository.findOne.mockResolvedValue(producer);
      mockRepository.remove.mockResolvedValue(producer);

      await service.remove('1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['farms', 'farms.plantedCrops'],
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(producer);
    });
  });
});
