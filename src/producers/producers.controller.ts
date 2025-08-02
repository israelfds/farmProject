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
import { ProducersService } from './producers.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { Producer } from './entities/producer.entity';
import { UuidValidationPipe } from '../common/pipes/uuid-validation.pipe';

@ApiTags('Produtores Rurais')
@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo produtor rural' })
  @ApiResponse({
    status: 201,
    description: 'Produtor criado com sucesso',
    type: Producer,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe um produtor com este documento',
  })
  async create(
    @Body() createProducerDto: CreateProducerDto,
  ): Promise<Producer> {
    return await this.producersService.create(createProducerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtores rurais' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtores retornada com sucesso',
    type: [Producer],
  })
  async findAll(): Promise<Producer[]> {
    return await this.producersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter dados de um produtor específico' })
  @ApiParam({ name: 'id', description: 'ID do produtor' })
  @ApiResponse({
    status: 200,
    description: 'Produtor encontrado com sucesso',
    type: Producer,
  })
  @ApiResponse({
    status: 404,
    description: 'Produtor não encontrado',
  })
  async findOne(
    @Param('id', UuidValidationPipe) id: string,
  ): Promise<Producer> {
    return await this.producersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de um produtor' })
  @ApiParam({ name: 'id', description: 'ID do produtor' })
  @ApiResponse({
    status: 200,
    description: 'Produtor atualizado com sucesso',
    type: Producer,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Produtor não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe um produtor com este documento',
  })
  async update(
    @Param('id', UuidValidationPipe) id: string,
    @Body() updateProducerDto: UpdateProducerDto,
  ): Promise<Producer> {
    return await this.producersService.update(id, updateProducerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir um produtor' })
  @ApiParam({ name: 'id', description: 'ID do produtor' })
  @ApiResponse({
    status: 204,
    description: 'Produtor excluído com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Produtor não encontrado',
  })
  async remove(@Param('id', UuidValidationPipe) id: string): Promise<void> {
    return await this.producersService.remove(id);
  }
}
