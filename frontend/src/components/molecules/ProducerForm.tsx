import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import { Producer, CreateProducerDto, UpdateProducerDto } from '../../store/types';
import { validateCpfCnpj, formatCpfCnpj } from '../../utils/validation';
import { useTheme } from '../../contexts/ThemeContext';

interface ProducerFormProps {
  producer?: Producer;
  onSubmit: (data: CreateProducerDto | UpdateProducerDto) => void;
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

// ErrorMessage component not used - errors are shown in Input component

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const schema = yup.object({
  name: yup.string().required('Nome é obrigatório').min(2, 'Nome deve ter pelo menos 2 caracteres'),
  document: yup.string()
    .required('CPF/CNPJ é obrigatório')
    .test('cpf-cnpj', 'CPF/CNPJ inválido', (value) => {
      if (!value) return false;
      return validateCpfCnpj(value);
    }),
}).required();

const ProducerForm: React.FC<ProducerFormProps> = ({ 
  producer, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const { theme } = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<CreateProducerDto>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: producer?.name || '',
      document: producer?.document || '',
    }
  });

  const documentValue = watch('document');

  // Formata o documento automaticamente
  React.useEffect(() => {
    if (documentValue && documentValue.length > 0) {
      const formatted = formatCpfCnpj(documentValue);
      if (formatted !== documentValue) {
        setValue('document', formatted);
      }
    }
  }, [documentValue, setValue]);

  const handleFormSubmit = (data: CreateProducerDto) => {
    // Remove formatação antes de enviar
    const cleanData = {
      ...data,
      document: data.document.replace(/[^\d]/g, '')
    };
    onSubmit(cleanData);
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <FormRow>
        <FormGroup>
          <Label htmlFor="name" $theme={theme}>Nome do Produtor *</Label>
          <Input
            type="text"
            placeholder="Digite o nome completo"
            {...register('name')}
            error={errors.name?.message}
          />
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label htmlFor="document" $theme={theme}>CPF/CNPJ *</Label>
          <Input
            type="text"
            placeholder="000.000.000-00 ou 00.000.000/0000-00"
            {...register('document')}
            error={errors.document?.message}
          />
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
          {isLoading ? 'Salvando...' : producer ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default ProducerForm; 