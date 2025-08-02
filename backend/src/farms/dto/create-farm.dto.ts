import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumber,
  Min,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFarmDto {
  @ApiProperty({
    description: 'Nome da fazenda',
    example: 'Fazenda São João',
    minLength: 2,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: 'Nome da fazenda é obrigatório' })
  @MinLength(2, { message: 'Nome da fazenda deve ter pelo menos 2 caracteres' })
  @MaxLength(255, {
    message: 'Nome da fazenda deve ter no máximo 255 caracteres',
  })
  name: string;

  @ApiProperty({
    description: 'Cidade da fazenda',
    example: 'São Paulo',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  @MinLength(2, { message: 'Cidade deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'Cidade deve ter no máximo 100 caracteres' })
  city: string;

  @ApiProperty({
    description: 'Estado da fazenda (sigla)',
    example: 'SP',
    minLength: 2,
    maxLength: 2,
  })
  @IsString()
  @IsNotEmpty({ message: 'Estado é obrigatório' })
  @MinLength(2, { message: 'Estado deve ter 2 caracteres' })
  @MaxLength(2, { message: 'Estado deve ter 2 caracteres' })
  state: string;

  @ApiProperty({
    description: 'Área total da fazenda em hectares',
    example: 1000.5,
    minimum: 0,
  })
  @IsNumber({}, { message: 'Área total deve ser um número' })
  @Min(0, { message: 'Área total deve ser maior ou igual a 0' })
  totalAreaHectares: number;

  @ApiProperty({
    description: 'Área agricultável da fazenda em hectares',
    example: 800.3,
    minimum: 0,
  })
  @IsNumber({}, { message: 'Área agricultável deve ser um número' })
  @Min(0, { message: 'Área agricultável deve ser maior ou igual a 0' })
  arableAreaHectares: number;

  @ApiProperty({
    description: 'Área de vegetação da fazenda em hectares',
    example: 200.2,
    minimum: 0,
  })
  @IsNumber({}, { message: 'Área de vegetação deve ser um número' })
  @Min(0, { message: 'Área de vegetação deve ser maior ou igual a 0' })
  vegetationAreaHectares: number;

  @ApiProperty({
    description: 'ID do produtor rural',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4, { message: 'ID do produtor deve ser um UUID válido' })
  @IsNotEmpty({ message: 'ID do produtor é obrigatório' })
  producerId: string;
}
