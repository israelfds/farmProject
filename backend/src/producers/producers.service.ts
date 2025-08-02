import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producer } from './entities/producer.entity';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';

@Injectable()
export class ProducersService {
  constructor(
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
  ) {}

  async create(createProducerDto: CreateProducerDto): Promise<Producer> {
    // Verificar se já existe um produtor com o mesmo documento
    const existingProducer = await this.producerRepository.findOne({
      where: { document: createProducerDto.document },
    });

    if (existingProducer) {
      throw new ConflictException('Já existe um produtor com este documento');
    }

    const producer = this.producerRepository.create(createProducerDto);
    return await this.producerRepository.save(producer);
  }

  async findAll(): Promise<Producer[]> {
    return await this.producerRepository.find({
      relations: ['farms', 'farms.plantedCrops'],
    });
  }

  async findOne(id: string): Promise<Producer> {
    const producer = await this.producerRepository.findOne({
      where: { id },
      relations: ['farms', 'farms.plantedCrops'],
    });

    if (!producer) {
      throw new NotFoundException(`Produtor com ID ${id} não encontrado`);
    }

    return producer;
  }

  async update(
    id: string,
    updateProducerDto: UpdateProducerDto,
  ): Promise<Producer> {
    const producer = await this.findOne(id);

    // Se estiver atualizando o documento, verificar se já existe outro produtor com o mesmo documento
    if (
      'document' in updateProducerDto &&
      updateProducerDto.document &&
      updateProducerDto.document !== producer.document
    ) {
      const existingProducer = await this.producerRepository.findOne({
        where: { document: updateProducerDto.document },
      });

      if (existingProducer) {
        throw new ConflictException('Já existe um produtor com este documento');
      }
    }

    Object.assign(producer, updateProducerDto);
    return await this.producerRepository.save(producer);
  }

  async remove(id: string): Promise<void> {
    const producer = await this.findOne(id);
    await this.producerRepository.remove(producer);
  }
}
