import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
// Input component not used in this form
import Button from '../atoms/Button';
import { AddCropDto } from '../../store/types';
import { useTheme } from '../../contexts/ThemeContext';

interface CropFormProps {
  onSubmit: (data: AddCropDto) => void;
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

const Input = styled.input<{ $error?: string; $theme: any }>`
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const schema = yup.object({
  cropName: yup.string().required('Nome da cultura é obrigatório'),
  harvestSeason: yup.string().required('Safra é obrigatória'),
  customCropName: yup.string().when('cropName', {
    is: 'outro',
    then: (schema) => schema.required('Nome da cultura é obrigatório'),
    otherwise: (schema) => schema.optional(),
  }),
}).required();

const CropForm: React.FC<CropFormProps> = ({ 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const { theme } = useTheme();
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<AddCropDto & { customCropName?: string }>({
    resolver: yupResolver(schema),
    defaultValues: {
      cropName: '',
      harvestSeason: '',
      customCropName: '',
    }
  });

  const watchedCropName = watch('cropName');

  const handleFormSubmit = (data: AddCropDto & { customCropName?: string }) => {
    const finalData: AddCropDto = {
      cropName: data.cropName === 'outro' ? data.customCropName! : data.cropName,
      harvestSeason: data.harvestSeason
    };
    onSubmit(finalData);
    reset();
    setShowCustomInput(false);
  };

  const handleCropChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setShowCustomInput(e.target.value === 'outro');
  };

  const currentYear = new Date().getFullYear();
  const harvestSeasons = [
    `${currentYear - 3}/${currentYear - 2}`,
    `${currentYear - 2}/${currentYear - 1}`,
    `${currentYear - 1}/${currentYear}`,
    `${currentYear}/${currentYear + 1}`,
    `${currentYear + 1}/${currentYear + 2}`,
    `${currentYear + 2}/${currentYear + 3}`,
    `${currentYear + 3}/${currentYear + 4}`,
    `${currentYear + 4}/${currentYear + 5}`,
    `${currentYear + 5}/${currentYear + 6}`,
    `${currentYear + 6}/${currentYear + 7}`,
  ];

  const commonCrops = [
    'Soja', 'Milho', 'Arroz', 'Feijão', 'Trigo', 'Café', 'Cana-de-açúcar',
    'Algodão', 'Laranja', 'Uva', 'Banana', 'Manga', 'Abacaxi', 'Tomate',
    'Cebola', 'Batata', 'Cenoura', 'Alface', 'Couve', 'Brócolis'
  ];

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <FormRow>
        <FormGroup>
          <Label $theme={theme}>Nome da Cultura *</Label>
          <Select 
            {...register('cropName')} 
            $error={errors.cropName?.message} 
            $theme={theme}
            onChange={handleCropChange}
          >
            <option value="">Selecione uma cultura</option>
            {commonCrops.map(crop => (
              <option key={crop} value={crop}>{crop}</option>
            ))}
            <option value="outro">Outro (especificar)</option>
          </Select>
          {showCustomInput && (
            <Input
              {...register('customCropName')}
              placeholder="Digite o nome da cultura"
              $error={errors.customCropName?.message}
              $theme={theme}
            />
          )}
        </FormGroup>
        <FormGroup>
          <Label $theme={theme}>Safra *</Label>
          <Select {...register('harvestSeason')} $error={errors.harvestSeason?.message} $theme={theme}>
            <option value="">Selecione a safra</option>
            {harvestSeasons.map(season => (
              <option key={season} value={season}>{season}</option>
            ))}
          </Select>
        </FormGroup>
      </FormRow>

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
          disabled={isLoading}
        >
          {isLoading ? 'Adicionando...' : 'Adicionar Cultura'}
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default CropForm; 