import { DataSource } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { Producer } from '../src/producers/entities/producer.entity';
import { Farm } from '../src/farms/entities/farm.entity';
import { PlantedCrop } from '../src/farms/entities/planted-crop.entity';

// 1. Cria uma única instância do DataSource que será partilhada.
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'farm_producers_test', // É uma boa prática usar um BD de teste
  entities: [Producer, Farm, PlantedCrop],
  synchronize: false, // Nunca use synchronize: true em produção ou testes E2E
});

/**
 * Conecta-se ao banco de dados. Deve ser chamado uma vez no início dos testes.
 */
export async function connectDataSource() {
  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
  } catch (error) {
    console.error('Falha ao conectar ao banco de dados', error);
    process.exit(1);
  }
}

/**
 * Desconecta-se do banco de dados. Deve ser chamado uma vez no final de todos os testes.
 */
export async function disconnectDataSource() {
  try {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  } catch (error) {
    console.error('Falha ao desconectar do banco de dados', error);
  }
}

/**
 * Limpa as tabelas relevantes do banco de dados, mas não desconecta.
 * Versão melhorada com retry e melhor tratamento de erros.
 */
export async function cleanDatabase(app: INestApplication) {
  // Obtém a conexão do TypeORM diretamente da aplicação NestJS
  const dataSource = app.get(DataSource);
  if (!dataSource || !dataSource.isInitialized) {
    throw new Error(
      'DataSource não está disponível ou inicializado na aplicação.',
    );
  }

  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      // Aguardar um pouco antes de tentar limpar
      await new Promise(resolve => setTimeout(resolve, 100));

      // Desabilitar verificações de foreign key temporariamente
      await dataSource.query('SET session_replication_role = replica;');
      
      // Limpar todas as tabelas
      await dataSource.query('TRUNCATE TABLE "planted_crops", "farms", "producers" RESTART IDENTITY CASCADE;');
      
      // Reabilitar verificações de foreign key
      await dataSource.query('SET session_replication_role = DEFAULT;');

      // Aguardar um pouco para garantir que a limpeza foi aplicada
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verificar se as tabelas estão realmente vazias
      const plantedCropsCount = await dataSource.query('SELECT COUNT(*) FROM "planted_crops"');
      const farmsCount = await dataSource.query('SELECT COUNT(*) FROM "farms"');
      const producersCount = await dataSource.query('SELECT COUNT(*) FROM "producers"');

      console.log('✅ Banco de dados limpo com sucesso');
      console.log(`📊 Tabelas vazias: planted_crops=${plantedCropsCount[0].count}, farms=${farmsCount[0].count}, producers=${producersCount[0].count}`);
      
      return; // Sucesso, sair do loop
    } catch (error) {
      retryCount++;
      console.error(`❌ Tentativa ${retryCount} de ${maxRetries} falhou ao limpar o banco de dados:`, error);
      
      if (retryCount >= maxRetries) {
        console.error('❌ Todas as tentativas de limpeza falharam');
        throw error;
      }
      
      // Aguardar antes da próxima tentativa
      await new Promise(resolve => setTimeout(resolve, 500 * retryCount));
    }
  }
}
