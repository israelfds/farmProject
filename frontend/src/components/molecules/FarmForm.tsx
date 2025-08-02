import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import { Farm, CreateFarmDto, UpdateFarmDto, Producer } from '../../store/types';
import { validateFarmAreas } from '../../utils/validation';
import { useTheme } from '../../contexts/ThemeContext';

interface FarmFormProps {
  farm?: Farm;
  producers: Producer[];
  onSubmit: (data: CreateFarmDto | UpdateFarmDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const Label = styled.label<{ $theme: any }>`
  font-weight: 500;
  color: ${props => props.$theme.colors.text};
  font-size: 14px;
  transition: ${props => props.$theme.transitions.medium};
`;

const Select = styled.select<{ $error?: string; $theme: any }>`
  padding: 12px 16px;
  border: 2px solid ${({ $error, $theme }) => ($error ? $theme.colors.inputError : $theme.colors.inputBorder)};
  border-radius: 8px;
  background-color: ${props => props.$theme.colors.inputBackground};
  color: ${props => props.$theme.colors.text};
  font-size: 16px;
  transition: ${props => props.$theme.transitions.fast};
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${({ $error, $theme }) => ($error ? $theme.colors.inputError : $theme.colors.inputFocus)};
    box-shadow: 0 0 0 3px ${({ $error, $theme }) =>
      $error ? `${$theme.colors.inputError}40` : `${$theme.colors.inputFocus}40`};
  }
`;

const AreaValidationMessage = styled.div<{ isValid: boolean; $theme: any }>`
  font-size: 12px;
  margin-top: 4px;
  color: ${({ isValid, $theme }) => (isValid ? $theme.colors.success : $theme.colors.danger)};
  transition: ${props => props.$theme.transitions.medium};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const schema = yup.object({
  name: yup.string().required('Nome da fazenda é obrigatório').min(2, 'Nome deve ter pelo menos 2 caracteres'),
  city: yup.string().required('Cidade é obrigatória'),
  state: yup.string().required('Estado é obrigatório'),
  totalAreaHectares: yup.number()
    .required('Área total é obrigatória')
    .positive('Área total deve ser maior que zero'),
  arableAreaHectares: yup.number()
    .required('Área agricultável é obrigatória')
    .min(0, 'Área agricultável não pode ser negativa'),
  vegetationAreaHectares: yup.number()
    .required('Área de vegetação é obrigatória')
    .min(0, 'Área de vegetação não pode ser negativa'),
  producerId: yup.string().required('Produtor é obrigatório'),
}).required();

const FarmForm: React.FC<FarmFormProps> = ({ 
  farm, 
  producers, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const { theme } = useTheme();
  const [areaValidation, setAreaValidation] = useState<{ isValid: boolean; message?: string }>({ isValid: true });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<CreateFarmDto>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: farm?.name || '',
      city: farm?.city || '',
      state: farm?.state || '',
      totalAreaHectares: farm?.totalAreaHectares || 0,
      arableAreaHectares: farm?.arableAreaHectares || 0,
      vegetationAreaHectares: farm?.vegetationAreaHectares || 0,
      producerId: farm?.producerId || '',
    }
  });

  const totalArea = watch('totalAreaHectares') || 0;
  const arableArea = watch('arableAreaHectares') || 0;
  const vegetationArea = watch('vegetationAreaHectares') || 0;

  // Validação de áreas em tempo real
  useEffect(() => {
    if (totalArea > 0 || arableArea > 0 || vegetationArea > 0) {
      const validation = validateFarmAreas(totalArea, arableArea, vegetationArea);
      setAreaValidation(validation);
    }
  }, [totalArea, arableArea, vegetationArea]);

  const handleFormSubmit = (data: CreateFarmDto) => {
    if (!areaValidation.isValid) {
      return;
    }
    onSubmit(data);
  };

  const states = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <FormRow>
        <FormGroup>
          <Label $theme={theme}>Nome da Fazenda *</Label>
          <Input
            type="text"
            placeholder="Digite o nome da fazenda"
            {...register('name')}
            error={errors.name?.message}
          />
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label $theme={theme}>Cidade *</Label>
          <Input
            type="text"
            placeholder="Digite a cidade"
            {...register('city')}
            error={errors.city?.message}
          />
        </FormGroup>
        <FormGroup>
          <Label $theme={theme}>Estado *</Label>
          <Select {...register('state')} $error={errors.state?.message} $theme={theme}>
            <option value="">Selecione um estado</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </Select>
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label $theme={theme}>Produtor *</Label>
          <Select {...register('producerId')} $error={errors.producerId?.message} $theme={theme}>
            <option value="">Selecione um produtor</option>
            {producers.map(producer => (
              <option key={producer.id} value={producer.id}>
                {producer.name} - {producer.document}
              </option>
            ))}
          </Select>
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label $theme={theme}>Área Total (hectares) *</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register('totalAreaHectares', { valueAsNumber: true })}
            error={errors.totalAreaHectares?.message}
          />
        </FormGroup>
        <FormGroup>
          <Label $theme={theme}>Área Agricultável (hectares) *</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register('arableAreaHectares', { valueAsNumber: true })}
            error={errors.arableAreaHectares?.message}
          />
        </FormGroup>
        <FormGroup>
          <Label $theme={theme}>Área de Vegetação (hectares) *</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register('vegetationAreaHectares', { valueAsNumber: true })}
            error={errors.vegetationAreaHectares?.message}
          />
        </FormGroup>
      </FormRow>

      {areaValidation.message && (
        <AreaValidationMessage isValid={areaValidation.isValid} $theme={theme}>
          {areaValidation.message}
        </AreaValidationMessage>
      )}

      <ButtonGroup>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || !areaValidation.isValid}
        >
          {isLoading ? 'Salvando...' : farm ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default FarmForm; 