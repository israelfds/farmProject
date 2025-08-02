import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCropDto {
  @ApiProperty({
    description: 'Nome da cultura plantada',
    example: 'Soja',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Nome da cultura é obrigatório' })
  @MinLength(2, { message: 'Nome da cultura deve ter pelo menos 2 caracteres' })
  @MaxLength(100, {
    message: 'Nome da cultura deve ter no máximo 100 caracteres',
  })
  cropName: string;

  @ApiProperty({
    description: 'Safra/estação da colheita',
    example: 'Safra 2023',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Safra é obrigatória' })
  @MinLength(2, { message: 'Safra deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'Safra deve ter no máximo 100 caracteres' })
  harvestSeason: string;
}
