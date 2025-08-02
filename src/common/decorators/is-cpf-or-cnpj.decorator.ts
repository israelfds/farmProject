// Copie e cole este conteúdo. Ele usa a biblioteca para fazer todo o trabalho.
// Arquivo: src/common/decorators/is-cpf-or-cnpj.decorator.ts

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator'; // 1. Importa as funções da biblioteca

@ValidatorConstraint({ async: false })
export class IsCpfOrCnpjConstraint implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(document: any, _args: ValidationArguments) {
    if (typeof document !== 'string') {
      return false;
    }
    // O valor já chega aqui limpo pelo @Transform do DTO

    // 2. A biblioteca faz toda a validação complexa para nós
    return cpf.isValid(document) || cnpj.isValid(document);
  }

  defaultMessage(_args: ValidationArguments) {
    return `${_args.property} deve ser um CPF ou CNPJ válido`;
  }
}

export function IsCpfOrCnpj(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCpfOrCnpjConstraint,
    });
  };
}
