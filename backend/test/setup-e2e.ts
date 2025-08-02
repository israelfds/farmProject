import { DataSource } from 'typeorm';
import { Producer } from '../src/producers/entities/producer.entity';
import { Farm } from '../src/farms/entities/farm.entity';
import { PlantedCrop } from '../src/farms/entities/planted-crop.entity';

// Configuração global para testes E2E
beforeAll(async () => {
  // Aguardar um pouco para garantir que o banco esteja pronto
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('🚀 Iniciando testes E2E...');
});

afterAll(async () => {
  console.log('✅ Testes E2E finalizados');
});

// Configuração global do Jest
jest.setTimeout(30000);

// Função global para limpeza de banco
global.cleanTestDatabase = async (dataSource: DataSource) => {
  try {
    // Desabilitar verificações de foreign key temporariamente
    await dataSource.query('SET session_replication_role = replica;');
    
    // Limpar todas as tabelas
    await dataSource.query('TRUNCATE TABLE "planted_crops", "farms", "producers" RESTART IDENTITY CASCADE;');
    
    // Reabilitar verificações de foreign key
    await dataSource.query('SET session_replication_role = DEFAULT;');

    // Verificar se as tabelas estão realmente vazias
    const plantedCropsCount = await dataSource.query('SELECT COUNT(*) FROM "planted_crops"');
    const farmsCount = await dataSource.query('SELECT COUNT(*) FROM "farms"');
    const producersCount = await dataSource.query('SELECT COUNT(*) FROM "producers"');

    console.log('✅ Banco de dados limpo com sucesso');
    console.log(`📊 Tabelas vazias: planted_crops=${plantedCropsCount[0].count}, farms=${farmsCount[0].count}, producers=${producersCount[0].count}`);
  } catch (error) {
    console.error('❌ Erro ao limpar o banco de dados:', error);
    throw error;
  }
}; 