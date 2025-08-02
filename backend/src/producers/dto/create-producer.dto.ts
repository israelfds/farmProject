import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsCpfOrCnpj } from '../../common/decorators/is-cpf-or-cnpj.decorator';

export class CreateProducerDto {
  @ApiProperty({
    description: 'Nome do produtor rural',
    example: 'João Silva',
    minLength: 2,
    maxLength: 255,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(255, { message: 'Nome deve ter no máximo 255 caracteres' })
  name: string;

  @ApiProperty({
    description:
      'CPF ou CNPJ do produtor rural. Pode ser enviado com ou sem formatação.',
    examples: {
      cpf: '123.456.789-00',
      cnpj: '11.222.333/0001-44',
      sem_formatacao: '12345678900',
    },
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.replace(/[^\d]/g, '') : value,
  )
  @IsString()
  @IsNotEmpty({ message: 'Documento é obrigatório' })
  @IsCpfOrCnpj({ message: 'Documento deve ser um CPF ou CNPJ válido' })
  document: string;
}
