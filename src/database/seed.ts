import { seedDatabase } from './seeds/seed';
import dataSource from './data-source';

async function runSeed() {
  try {
    await dataSource.initialize();
    console.log('🔌 Conectado ao banco de dados');

    await seedDatabase(dataSource);

    await dataSource.destroy();
    console.log('🔌 Conexão com banco de dados fechada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  }
}

runSeed();
