import React from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { LandUseData } from '../../store/types';

interface LandUseChartProps {
  data: LandUseData[];
  isLoading: boolean;
}

const ChartContainer = styled.div`
  height: auto;
  min-height: 400px;
  width: 100%;
  overflow: hidden;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
`;

const ChartTitle = styled.h3`
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
`;

const TotalArea = styled.div`
  text-align: right;
`;

const TotalAreaValue = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #3498db;
`;

const TotalAreaLabel = styled.div`
  font-size: 12px;
  color: #7f8c8d;
`;

const ChartWrapper = styled.div`
  position: relative;
  height: 280px;
  width: 100%;
  overflow: hidden;
`;

const LoadingState = styled.div`
  text-align: center;
  padding-top: 120px;
  color: #7f8c8d;
`;

const EmptyState = styled.div`
  text-align: center;
  padding-top: 120px;
  color: #7f8c8d;
`;

const EmptyStateTitle = styled.h4`
  margin: 0 0 8px 0;
  color: #2c3e50;
`;

const EmptyStateText = styled.p`
  margin: 0;
  font-size: 14px;
`;

// Cores específicas para uso do solo
const LAND_USE_COLORS = {
  'Área Agricultável': '#27ae60',
  'Área de Vegetação': '#2ecc71',
  'Área Não Utilizada': '#95a5a6',
  'Área Total': '#3498db'
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        minWidth: '200px'
      }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#2c3e50', fontSize: '14px' }}>
          {data.category}
        </p>
        <div style={{ borderTop: '1px solid #eee', paddingTop: '8px' }}>
          <p style={{ margin: '0 0 4px 0', color: '#7f8c8d', fontSize: '13px' }}>
            <strong>Área:</strong> {data.totalArea?.toLocaleString('pt-BR')} ha
          </p>
          <p style={{ margin: '0 0 4px 0', color: '#7f8c8d', fontSize: '13px' }}>
            <strong>Percentual:</strong> {data.percentage?.toFixed(1)}%
          </p>
          {data.totalArea > 0 && (
            <p style={{ margin: '0 0 4px 0', color: '#7f8c8d', fontSize: '12px' }}>
              {data.totalArea > 1000 
                ? `${(data.totalArea / 1000).toFixed(1)} mil hectares`
                : `${data.totalArea.toFixed(0)} hectares`
              }
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  if (!payload || payload.length === 0) return null;

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      gap: '20px',
      marginTop: '20px'
    }}>
      {payload.map((entry: any, index: number) => (
        <div key={index} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          fontSize: '14px'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            backgroundColor: entry.color,
            borderRadius: '2px'
          }} />
          <span style={{ color: '#2c3e50' }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const LandUseChart: React.FC<LandUseChartProps> = ({ data, isLoading }) => {
  const totalArea = data.reduce((sum, item) => sum + item.totalArea, 0);
  const hasData = data.length > 0 && data.some(item => item.totalArea > 0);
  
  // Calcular eficiência do uso do solo
  const arableArea = data.find(item => item.category === 'Área Agricultável')?.totalArea || 0;
  const vegetationArea = data.find(item => item.category === 'Área de Vegetação')?.totalArea || 0;
  const usedArea = arableArea + vegetationArea;
  const efficiencyPercentage = totalArea > 0 ? (usedArea / totalArea) * 100 : 0;
  
  // Filtrar apenas dados com área > 0 para o gráfico
  const chartData = data.filter(item => item.totalArea > 0);

  if (isLoading) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Uso do Solo</ChartTitle>
        </ChartHeader>
        <LoadingState>Carregando dados de uso do solo...</LoadingState>
      </ChartContainer>
    );
  }

  if (!hasData) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Uso do Solo</ChartTitle>
        </ChartHeader>
        <EmptyState>
          <EmptyStateTitle>Nenhum dado disponível</EmptyStateTitle>
          <EmptyStateText>
            Cadastre fazendas para visualizar o uso do solo
          </EmptyStateText>
        </EmptyState>
      </ChartContainer>
    );
  }

  // Se não há dados para o gráfico mas há área total, mostrar mensagem
  if (chartData.length === 0 && totalArea > 0) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Uso do Solo</ChartTitle>
          <TotalArea>
            <TotalAreaValue>
              {totalArea.toLocaleString('pt-BR')} ha
            </TotalAreaValue>
            <TotalAreaLabel>Área Total</TotalAreaLabel>
          </TotalArea>
        </ChartHeader>
        <EmptyState>
          <EmptyStateTitle>Área não categorizada</EmptyStateTitle>
          <EmptyStateText>
            As fazendas cadastradas não possuem áreas agricultável ou de vegetação definidas
          </EmptyStateText>
        </EmptyState>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Uso do Solo</ChartTitle>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center', minWidth: '80px' }}>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: 'bold', 
              color: efficiencyPercentage >= 80 ? '#27ae60' : efficiencyPercentage >= 60 ? '#f39c12' : '#e74c3c'
            }}>
              {efficiencyPercentage.toFixed(1)}%
            </div>
            <div style={{ fontSize: '11px', color: '#7f8c8d' }}>
              Eficiência
            </div>
            <div style={{ 
              fontSize: '9px', 
              color: efficiencyPercentage >= 80 ? '#27ae60' : efficiencyPercentage >= 60 ? '#f39c12' : '#e74c3c',
              fontWeight: 'bold'
            }}>
              {efficiencyPercentage >= 80 ? 'Excelente' : efficiencyPercentage >= 60 ? 'Boa' : 'Baixa'}
            </div>
          </div>
          <TotalArea>
            <TotalAreaValue>
              {totalArea.toLocaleString('pt-BR')} ha
            </TotalAreaValue>
            <TotalAreaLabel>Área Total</TotalAreaLabel>
          </TotalArea>
        </div>
      </ChartHeader>
      
      <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ category, percentage }) => 
                `${category}\n${percentage?.toFixed(1)}%`
              }
              outerRadius={80}
              innerRadius={30}
              fill="#8884d8"
              dataKey="totalArea"
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={LAND_USE_COLORS[entry.category as keyof typeof LAND_USE_COLORS] || '#95a5a6'} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Estatísticas detalhadas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
        gap: '12px',
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        {data.map((item, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: LAND_USE_COLORS[item.category as keyof typeof LAND_USE_COLORS] || '#95a5a6'
            }}>
              {item.totalArea.toLocaleString('pt-BR')} ha
            </div>
            <div style={{ fontSize: '11px', color: '#7f8c8d', marginTop: '3px' }}>
              {item.category}
            </div>
            <div style={{ fontSize: '12px', color: '#2c3e50', marginTop: '2px' }}>
              {item.percentage?.toFixed(1)}%
            </div>
          </div>
        ))}
        
        {/* Mostrar área total se diferente da soma */}
        {totalArea > 0 && (
          <div style={{ textAlign: 'center', gridColumn: '1 / -1', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #dee2e6' }}>
            <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
              Área Total: {totalArea.toLocaleString('pt-BR')} ha
            </div>
          </div>
        )}
      </div>
    </ChartContainer>
  );
};

export default LandUseChart; 