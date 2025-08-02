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
 */
export async function cleanDatabase(app: INestApplication) {
  // Obtém a conexão do TypeORM diretamente da aplicação NestJS
  const dataSource = app.get(DataSource);
  if (!dataSource || !dataSource.isInitialized) {
    throw new Error(
      'DataSource não está disponível ou inicializado na aplicação.',
    );
  }

  try {
    // Usar DELETE em vez de TRUNCATE para evitar deadlocks
    // Deletar na ordem correta para respeitar as foreign keys
    // Primeiro deletar as culturas plantadas (dependem de fazendas)
    await dataSource.query('DELETE FROM "planted_crops";');
    // Depois deletar as fazendas (dependem de produtores)
    await dataSource.query('DELETE FROM "farms";');
    // Por último deletar os produtores
    await dataSource.query('DELETE FROM "producers";');

    // Resetar as sequências (apenas se existirem)
    try {
      await dataSource.query(
        'ALTER SEQUENCE IF EXISTS "producers_id_seq" RESTART WITH 1;',
      );
      await dataSource.query(
        'ALTER SEQUENCE IF EXISTS "farms_id_seq" RESTART WITH 1;',
      );
      await dataSource.query(
        'ALTER SEQUENCE IF EXISTS "planted_crops_id_seq" RESTART WITH 1;',
      );
    } catch (seqError) {
      // Ignorar erros de sequência (podem não existir)
    }

    console.log('✅ Banco de dados limpo com sucesso');
  } catch (error) {
    console.error('❌ Erro ao limpar o banco de dados:', error);
    // Não rethrow o erro para não quebrar os testes
  }
}
