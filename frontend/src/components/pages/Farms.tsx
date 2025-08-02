import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { 
  fetchFarms, 
  createFarm, 
  updateFarm, 
  deleteFarm,
  addCropToFarm,
  removeCropFromFarm,
  clearError 
} from '../../store/slices/farmsSlice';
import { fetchProducers } from '../../store/slices/producersSlice';
import { Farm, CreateFarmDto, UpdateFarmDto, AddCropDto } from '../../store/types';
import styled from 'styled-components';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import Modal from '../atoms/Modal';
import FarmForm from '../molecules/FarmForm';
import CropForm from '../molecules/CropForm';
import { useTheme } from '../../contexts/ThemeContext';

const FarmsContainer = styled.div`
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

const FarmsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
`;

const FarmCard = styled(Card)`
  padding: 20px;
`;

const FarmName = styled.h3<{ $theme: any }>`
  margin: 0 0 12px 0;
  color: ${props => props.$theme.colors.text};
  font-size: 18px;
  font-weight: 600;
  transition: ${props => props.$theme.transitions.medium};
`;

const FarmInfo = styled.div`
  margin-bottom: 12px;
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

const AreasSection = styled.div<{ $theme: any }>`
  background-color: ${props => props.$theme.colors.backgroundSecondary};
  padding: 12px;
  border-radius: 6px;
  margin: 16px 0;
  transition: ${props => props.$theme.transitions.medium};
`;

const AreasTitle = styled.h4<{ $theme: any }>`
  margin: 0 0 8px 0;
  color: ${props => props.$theme.colors.text};
  font-size: 14px;
  font-weight: 600;
  transition: ${props => props.$theme.transitions.medium};
`;

const AreasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const AreaItem = styled.div`
  text-align: center;
`;

const AreaValue = styled.div<{ $theme: any }>`
  font-weight: 600;
  color: ${props => props.$theme.colors.primary};
  font-size: 16px;
  transition: ${props => props.$theme.transitions.medium};
`;

const AreaLabel = styled.div<{ $theme: any }>`
  font-size: 12px;
  color: ${props => props.$theme.colors.textSecondary};
  transition: ${props => props.$theme.transitions.medium};
`;

const CropsSection = styled.div`
  margin: 16px 0;
`;

const CropsTitle = styled.h4<{ $theme: any }>`
  margin: 0 0 8px 0;
  color: ${props => props.$theme.colors.text};
  font-size: 14px;
  font-weight: 600;
  transition: ${props => props.$theme.transitions.medium};
`;

const CropsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const CropTag = styled.span<{ $theme: any }>`
  background-color: ${props => props.$theme.colors.success}20;
  color: ${props => props.$theme.colors.success};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: ${props => props.$theme.transitions.medium};
`;

const RemoveCropButton = styled.button<{ $theme: any }>`
  background: none;
  border: none;
  color: ${props => props.$theme.colors.danger};
  cursor: pointer;
  font-size: 12px;
  padding: 0;
  margin-left: 4px;
  transition: ${props => props.$theme.transitions.fast};
  
  &:hover {
    color: ${props => props.$theme.colors.danger};
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;
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
  color: ${props => props.$theme.colors.danger};
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid ${props => props.$theme.colors.danger}40;
  transition: ${props => props.$theme.transitions.medium};
`;

const Farms: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { farms, isLoading, error } = useSelector((state: RootState) => state.farms);
  const { producers } = useSelector((state: RootState) => state.producers);
  const { theme } = useTheme();
  
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [selectedFarmForCrop, setSelectedFarmForCrop] = useState<Farm | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchFarms());
    dispatch(fetchProducers());
  }, [dispatch]);

  const handleCreateFarm = async (data: CreateFarmDto) => {
    setIsSubmitting(true);
    try {
      await dispatch(createFarm(data)).unwrap();
      setIsFarmModalOpen(false);
      setEditingFarm(null);
    } catch (error) {
      console.error('Erro ao criar fazenda:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateFarm = async (data: UpdateFarmDto) => {
    if (!editingFarm) return;
    
    setIsSubmitting(true);
    try {
      await dispatch(updateFarm({ id: editingFarm.id, data })).unwrap();
      setIsFarmModalOpen(false);
      setEditingFarm(null);
    } catch (error) {
      console.error('Erro ao atualizar fazenda:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFarm = async (farm: Farm) => {
    if (window.confirm(`Tem certeza que deseja excluir a fazenda "${farm.name}"?`)) {
      try {
        await dispatch(deleteFarm(farm.id)).unwrap();
      } catch (error) {
        console.error('Erro ao excluir fazenda:', error);
      }
    }
  };

  const handleAddCrop = async (data: AddCropDto) => {
    if (!selectedFarmForCrop) return;
    
    setIsSubmitting(true);
    try {
      await dispatch(addCropToFarm({ farmId: selectedFarmForCrop.id, data })).unwrap();
      setIsCropModalOpen(false);
      setSelectedFarmForCrop(null);
    } catch (error) {
      console.error('Erro ao adicionar cultura:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveCrop = async (farmId: string, cropId: string) => {
    if (window.confirm('Tem certeza que deseja remover esta cultura?')) {
      try {
        await dispatch(removeCropFromFarm({ farmId, cropId })).unwrap();
      } catch (error) {
        console.error('Erro ao remover cultura:', error);
      }
    }
  };

  const handleEditFarm = (farm: Farm) => {
    setEditingFarm(farm);
    setIsFarmModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setEditingFarm(null);
    setIsFarmModalOpen(true);
  };

  const handleOpenCropModal = (farm: Farm) => {
    setSelectedFarmForCrop(farm);
    setIsCropModalOpen(true);
  };

  const handleCloseFarmModal = () => {
    setIsFarmModalOpen(false);
    setEditingFarm(null);
    dispatch(clearError());
  };

  const handleCloseCropModal = () => {
    setIsCropModalOpen(false);
    setSelectedFarmForCrop(null);
  };

  const handleFarmFormSubmit = (data: CreateFarmDto | UpdateFarmDto) => {
    if (editingFarm) {
      handleUpdateFarm(data as UpdateFarmDto);
    } else {
      handleCreateFarm(data as CreateFarmDto);
    }
  };

  const getProducerName = (producerId: string) => {
    const producer = producers.find(p => p.id === producerId);
    return producer ? producer.name : 'Produtor não encontrado';
  };

  if (isLoading && farms.length === 0) {
    return (
      <FarmsContainer>
        <LoadingState $theme={theme}>Carregando fazendas...</LoadingState>
      </FarmsContainer>
    );
  }

  return (
    <FarmsContainer>
      <Header>
        <Title $theme={theme}>Fazendas</Title>
        <Button variant="primary" onClick={handleOpenCreateModal}>
          + Nova Fazenda
        </Button>
      </Header>

      {error && (
        <ErrorMessage $theme={theme}>
          {error}
        </ErrorMessage>
      )}

      {farms.length === 0 ? (
        <EmptyState $theme={theme}>
          <EmptyStateTitle $theme={theme}>Nenhuma fazenda cadastrada</EmptyStateTitle>
          <EmptyStateText $theme={theme}>
            Comece cadastrando a primeira fazenda do sistema.
          </EmptyStateText>
          <Button variant="primary" onClick={handleOpenCreateModal}>
            Cadastrar Primeira Fazenda
          </Button>
        </EmptyState>
      ) : (
        <FarmsGrid>
          {farms.map((farm) => (
            <FarmCard key={farm.id}>
              <FarmName $theme={theme}>{farm.name}</FarmName>
              <FarmInfo>
                <InfoLabel $theme={theme}>Localização:</InfoLabel>
                <InfoValue $theme={theme}>{farm.city} - {farm.state}</InfoValue>
              </FarmInfo>
              <FarmInfo>
                <InfoLabel $theme={theme}>Produtor:</InfoLabel>
                <InfoValue $theme={theme}>{getProducerName(farm.producerId)}</InfoValue>
              </FarmInfo>

              <AreasSection $theme={theme}>
                <AreasTitle $theme={theme}>Áreas (hectares)</AreasTitle>
                <AreasGrid>
                  <AreaItem>
                    <AreaValue $theme={theme}>{farm.totalAreaHectares}</AreaValue>
                    <AreaLabel $theme={theme}>Total</AreaLabel>
                  </AreaItem>
                  <AreaItem>
                    <AreaValue $theme={theme}>{farm.arableAreaHectares}</AreaValue>
                    <AreaLabel $theme={theme}>Agricultável</AreaLabel>
                  </AreaItem>
                  <AreaItem>
                    <AreaValue $theme={theme}>{farm.vegetationAreaHectares}</AreaValue>
                    <AreaLabel $theme={theme}>Vegetação</AreaLabel>
                  </AreaItem>
                </AreasGrid>
              </AreasSection>

              <CropsSection>
                <CropsTitle $theme={theme}>
                  Culturas Plantadas ({farm.plantedCrops?.length || 0})
                </CropsTitle>
                {farm.plantedCrops && farm.plantedCrops.length > 0 ? (
                  <CropsList>
                    {farm.plantedCrops.map((crop) => (
                      <CropTag key={crop.id} $theme={theme}>
                        {crop.cropName} ({crop.harvestSeason})
                        <RemoveCropButton
                          $theme={theme}
                          onClick={() => handleRemoveCrop(farm.id, crop.id)}
                          title="Remover cultura"
                        >
                          ×
                        </RemoveCropButton>
                      </CropTag>
                    ))}
                  </CropsList>
                ) : (
                  <div style={{ color: '#7f8c8d', fontStyle: 'italic' }}>
                    Nenhuma cultura plantada
                  </div>
                )}
                <div style={{ marginTop: '8px' }}>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handleOpenCropModal(farm)}
                  >
                    + Adicionar Cultura
                  </Button>
                </div>
              </CropsSection>

              <CardActions>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => handleEditFarm(farm)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleDeleteFarm(farm)}
                >
                  Excluir
                </Button>
              </CardActions>
            </FarmCard>
          ))}
        </FarmsGrid>
      )}

      <Modal
        isOpen={isFarmModalOpen}
        onClose={handleCloseFarmModal}
        title={editingFarm ? 'Editar Fazenda' : 'Nova Fazenda'}
        size="large"
      >
        <FarmForm
          farm={editingFarm || undefined}
          producers={producers}
          onSubmit={handleFarmFormSubmit}
          onCancel={handleCloseFarmModal}
          isLoading={isSubmitting}
        />
      </Modal>

      <Modal
        isOpen={isCropModalOpen}
        onClose={handleCloseCropModal}
        title="Adicionar Cultura"
        size="medium"
      >
        <CropForm
          onSubmit={handleAddCrop}
          onCancel={handleCloseCropModal}
          isLoading={isSubmitting}
        />
      </Modal>
    </FarmsContainer>
  );
};

export default Farms; 