import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchDashboardSummary } from '../../store/slices/dashboardSlice';
import { dashboardService } from '../../services/dashboardService';
import Card from '../atoms/Card';
import styled from 'styled-components';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import LandUseChart from '../molecules/LandUseChart';
import { useTheme } from '../../contexts/ThemeContext';

const DashboardContainer = styled.div`
  padding: 24px;
`;

const DashboardTitle = styled.h2<{ $theme: any }>`
  margin: 0 0 24px 0;
  color: ${props => props.$theme.colors.text};
  font-size: 28px;
  font-weight: 600;
  transition: ${props => props.$theme.transitions.medium};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: 24px;
`;

const StatValue = styled.div<{ $theme: any }>`
  font-size: 36px;
  font-weight: bold;
  color: ${props => props.$theme.colors.primary};
  margin-bottom: 8px;
  transition: ${props => props.$theme.transitions.medium};
`;

const StatLabel = styled.div<{ $theme: any }>`
  font-size: 16px;
  color: ${props => props.$theme.colors.textSecondary};
  font-weight: 500;
  transition: ${props => props.$theme.transitions.medium};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 24px;
`;

const ChartCard = styled(Card)`
  padding: 20px;
  overflow: hidden;
`;

const ChartTitle = styled.h3<{ $theme: any }>`
  margin: 0 0 20px 0;
  color: ${props => props.$theme.colors.text};
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  transition: ${props => props.$theme.transitions.medium};
`;

const ChartContainer = styled.div`
  height: 300px;
  width: 100%;
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

// Cores para os gráficos
const COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#e67e22'];

interface ChartData {
  name: string;
  value: number;
  percentage?: number;
  hectares?: number;
}

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { summary, isLoading, error } = useSelector((state: RootState) => state.dashboard);
  const { theme } = useTheme();
  
  const [farmsByState, setFarmsByState] = useState<ChartData[]>([]);
  const [cropsData, setCropsData] = useState<ChartData[]>([]);
  const [landUseData, setLandUseData] = useState<any[]>([]);
  const [chartsLoading, setChartsLoading] = useState(true);

  const loadChartData = async () => {
    setChartsLoading(true);
    try {
      const [farmsByStateRes, cropsRes, landUseRes] = await Promise.all([
        dashboardService.getFarmsByState(),
        dashboardService.getCropsData(),
        dashboardService.getLandUseData()
      ]);

      setFarmsByState(farmsByStateRes.map(item => ({
        name: item.state,
        value: item.count,
        percentage: ((item.count / (summary?.totalFarms || 1)) * 100) || 0
      })));

      setCropsData(cropsRes.map(item => ({
        name: item.cropName,
        value: item.count,
        percentage: ((item.count / (summary?.totalCrops || 1)) * 100) || 0
      })));

      // Dados de uso do solo - agora o backend já retorna os dados corretos
      if (landUseRes && landUseRes.length > 0) {
        setLandUseData(landUseRes);
      } else {
        // Dados mock para demonstração quando não há dados
        setLandUseData([
          {
            category: 'Área Agricultável',
            totalArea: 0,
            percentage: 0
          },
          {
            category: 'Área de Vegetação',
            totalArea: 0,
            percentage: 0
          }
        ]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados dos gráficos:', error);
    } finally {
      setChartsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchDashboardSummary());
    loadChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{`${label}`}</p>
          <p style={{ margin: 0, color: '#888' }}>
            {`Quantidade: ${payload[0].value}`}
          </p>
          {payload[0].payload.percentage && (
            <p style={{ margin: 0, color: '#888' }}>
              {`${payload[0].payload.percentage.toFixed(1)}%`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <DashboardContainer>
        <LoadingState $theme={theme}>Carregando dashboard...</LoadingState>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardTitle $theme={theme}>Dashboard</DashboardTitle>

      {error && (
        <ErrorMessage $theme={theme}>
          {error}
        </ErrorMessage>
      )}

      <StatsGrid>
        <StatCard>
          <StatValue $theme={theme}>{summary?.totalFarms || 0}</StatValue>
          <StatLabel $theme={theme}>Total de Fazendas</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue $theme={theme}>{summary?.totalProducers || 0}</StatValue>
          <StatLabel $theme={theme}>Total de Produtores</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue $theme={theme}>{summary?.totalArea || 0} ha</StatValue>
          <StatLabel $theme={theme}>Área Total</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue $theme={theme}>{summary?.totalCrops || 0}</StatValue>
          <StatLabel $theme={theme}>Total de Culturas</StatLabel>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle $theme={theme}>Fazendas por Estado</ChartTitle>
          <ChartContainer>
            {chartsLoading ? (
              <div style={{ textAlign: 'center', paddingTop: '120px' }}>
                Carregando...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={farmsByState}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} (${percentage?.toFixed(1)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {farmsByState.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle $theme={theme}>Culturas Plantadas</ChartTitle>
          <ChartContainer>
            {chartsLoading ? (
              <div style={{ textAlign: 'center', paddingTop: '120px' }}>
                Carregando...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cropsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} (${percentage?.toFixed(1)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {cropsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartContainer>
        </ChartCard>

        <ChartCard>
          <LandUseChart data={landUseData} isLoading={chartsLoading} />
        </ChartCard>
      </ChartsGrid>
    </DashboardContainer>
  );
};

export default Dashboard; 