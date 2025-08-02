import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { 
  fetchProducers, 
  createProducer, 
  updateProducer, 
  deleteProducer,
  clearError 
} from '../../store/slices/producersSlice';
import { Producer, CreateProducerDto, UpdateProducerDto } from '../../store/types';
import styled from 'styled-components';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import Modal from '../atoms/Modal';
import ProducerForm from '../molecules/ProducerForm';
import { formatCpfCnpj } from '../../utils/validation';
import { useTheme } from '../../contexts/ThemeContext';

const ProducersContainer = styled.div`
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2<{ $theme: any }>`
  margin: 0;
  color: ${props => props.$theme.colors.text};
  font-size: 28px;
  font-weight: 600;
  transition: ${props => props.$theme.transitions.medium};
`;

const ProducersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const ProducerCard = styled(Card)`
  padding: 20px;
`;

const ProducerName = styled.h3<{ $theme: any }>`
  margin: 0 0 12px 0;
  color: ${props => props.$theme.colors.text};
  font-size: 18px;
  font-weight: 600;
  transition: ${props => props.$theme.transitions.medium};
`;

const ProducerInfo = styled.div`
  margin-bottom: 16px;
`;

const InfoLabel = styled.span<{ $theme: any }>`
  font-weight: 500;
  color: ${props => props.$theme.colors.textSecondary};
  font-size: 14px;
  transition: ${props => props.$theme.transitions.medium};
`;

const InfoValue = styled.span<{ $theme: any }>`
  color: ${props => props.$theme.colors.text};
  font-size: 14px;
  margin-left: 8px;
  transition: ${props => props.$theme.transitions.medium};
`;

const CardActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const EmptyState = styled.div<{ $theme: any }>`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.$theme.colors.textSecondary};
  transition: ${props => props.$theme.transitions.medium};
`;

const EmptyStateTitle = styled.h3<{ $theme: any }>`
  margin: 0 0 12px 0;
  color: ${props => props.$theme.colors.text};
  font-size: 20px;
  transition: ${props => props.$theme.transitions.medium};
`;

const EmptyStateText = styled.p<{ $theme: any }>`
  margin: 0 0 24px 0;
  font-size: 16px;
  color: ${props => props.$theme.colors.textSecondary};
  transition: ${props => props.$theme.transitions.medium};
`;

const LoadingState = styled.div<{ $theme: any }>`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.$theme.colors.textSecondary};
  transition: ${props => props.$theme.transitions.medium};
`;

const ErrorMessage = styled.div<{ $theme: any }>`
  background-color: ${props => props.$theme.colors.danger}20;
  color: #c53030;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #fed7d7;
`;

const Producers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { producers, isLoading, error } = useSelector((state: RootState) => state.producers);
  const { theme } = useTheme();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProducer, setEditingProducer] = useState<Producer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchProducers());
  }, [dispatch]);

  const handleCreateProducer = async (data: CreateProducerDto) => {
    setIsSubmitting(true);
    try {
      await dispatch(createProducer(data)).unwrap();
      setIsModalOpen(false);
      setEditingProducer(null);
    } catch (error) {
      console.error('Erro ao criar produtor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProducer = async (data: UpdateProducerDto) => {
    if (!editingProducer) return;
    
    setIsSubmitting(true);
    try {
      await dispatch(updateProducer({ id: editingProducer.id, data })).unwrap();
      setIsModalOpen(false);
      setEditingProducer(null);
    } catch (error) {
      console.error('Erro ao atualizar produtor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProducer = async (producer: Producer) => {
    if (window.confirm(`Tem certeza que deseja excluir o produtor "${producer.name}"?`)) {
      try {
        await dispatch(deleteProducer(producer.id)).unwrap();
      } catch (error) {
        console.error('Erro ao excluir produtor:', error);
      }
    }
  };

  const handleEditProducer = (producer: Producer) => {
    setEditingProducer(producer);
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setEditingProducer(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProducer(null);
    dispatch(clearError());
  };

  const handleFormSubmit = (data: CreateProducerDto | UpdateProducerDto) => {
    if (editingProducer) {
      handleUpdateProducer(data as UpdateProducerDto);
    } else {
      handleCreateProducer(data as CreateProducerDto);
    }
  };

  if (isLoading && producers.length === 0) {
    return (
      <ProducersContainer>
        <LoadingState $theme={theme}>Carregando produtores...</LoadingState>
      </ProducersContainer>
    );
  }

  return (
    <ProducersContainer>
      <Header>
        <Title $theme={theme}>Produtores Rurais</Title>
        <Button variant="primary" onClick={handleOpenCreateModal}>
          + Novo Produtor
        </Button>
      </Header>

      {error && (
        <ErrorMessage $theme={theme}>
          {error}
        </ErrorMessage>
      )}

      {producers.length === 0 ? (
        <EmptyState $theme={theme}>
          <EmptyStateTitle $theme={theme}>Nenhum produtor cadastrado</EmptyStateTitle>
          <EmptyStateText $theme={theme}>
            Comece cadastrando o primeiro produtor rural do sistema.
          </EmptyStateText>
          <Button variant="primary" onClick={handleOpenCreateModal}>
            Cadastrar Primeiro Produtor
          </Button>
        </EmptyState>
      ) : (
        <ProducersGrid>
          {producers.map((producer) => (
            <ProducerCard key={producer.id}>
              <ProducerName $theme={theme}>{producer.name}</ProducerName>
              <ProducerInfo>
                <InfoLabel $theme={theme}>CPF/CNPJ:</InfoLabel>
                <InfoValue $theme={theme}>{formatCpfCnpj(producer.document)}</InfoValue>
              </ProducerInfo>
              <ProducerInfo>
                <InfoLabel $theme={theme}>Fazendas:</InfoLabel>
                <InfoValue $theme={theme}>{producer.farms?.length || 0}</InfoValue>
              </ProducerInfo>
              <CardActions>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => handleEditProducer(producer)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleDeleteProducer(producer)}
                >
                  Excluir
                </Button>
              </CardActions>
            </ProducerCard>
          ))}
        </ProducersGrid>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProducer ? 'Editar Produtor' : 'Novo Produtor'}
        size="medium"
      >
        <ProducerForm
          producer={editingProducer || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
        />
      </Modal>
    </ProducersContainer>
  );
};

export default Producers; 