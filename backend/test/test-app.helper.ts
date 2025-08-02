import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { cleanDatabase } from './clean-db';
import { useContainer } from 'class-validator';

export class TestAppHelper {
  private static instance: TestAppHelper;
  private app: INestApplication | null = null;
  private isInitializing = false;

  private constructor() {}

  static getInstance(): TestAppHelper {
    if (!TestAppHelper.instance) {
      TestAppHelper.instance = new TestAppHelper();
    }
    return TestAppHelper.instance;
  }

  async createApp(): Promise<INestApplication> {
    // Se já está inicializando, aguardar
    if (this.isInitializing) {
      while (this.isInitializing) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.app!;
    }

    // Se já existe uma instância, retornar
    if (this.app) {
      return this.app;
    }

    this.isInitializing = true;

    try {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      this.app = moduleFixture.createNestApplication();

      // Configurar pipes globais
      this.app.useGlobalPipes(
        new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: true,
        }),
      );

      // Conectar class-validator ao container de DI
      useContainer(this.app.select(AppModule), { fallbackOnErrors: true });

      // Configurar Swagger para testes
      const { SwaggerModule, DocumentBuilder } = await import('@nestjs/swagger');
      const config = new DocumentBuilder()
        .setTitle('API de Gerenciamento de Produtores Rurais')
        .setDescription(
          'API para gerenciamento de produtores rurais, fazendas e culturas plantadas',
        )
        .setVersion('1.0')
        .addTag('Produtores Rurais')
        .addTag('Fazendas')
        .addTag('Dashboard')
        .build();

      const document = SwaggerModule.createDocument(this.app, config);
      SwaggerModule.setup('api-docs', this.app, document);

      await this.app.init();

      // Limpar banco de dados após inicialização
      await cleanDatabase(this.app);

      console.log('✅ Aplicação de teste criada e inicializada');
      return this.app;
    } catch (error) {
      console.error('❌ Erro ao criar aplicação de teste:', error);
      this.app = null;
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }

  async getApp(): Promise<INestApplication> {
    if (!this.app) {
      return this.createApp();
    }
    return this.app;
  }

  async closeApp(): Promise<void> {
    if (this.app) {
      try {
        await this.app.close();
        console.log('✅ Aplicação de teste fechada');
      } catch (error) {
        console.error('❌ Erro ao fechar aplicação de teste:', error);
      } finally {
        this.app = null;
      }
    }
  }

  async resetDatabase(): Promise<void> {
    if (this.app) {
      await cleanDatabase(this.app);
    }
  }
}

// Função helper para criar uma aplicação de teste limpa
export async function createTestApp(): Promise<INestApplication> {
  const helper = TestAppHelper.getInstance();
  return helper.createApp();
}

// Função helper para limpar o banco de dados
export async function resetTestDatabase(): Promise<void> {
  const helper = TestAppHelper.getInstance();
  await helper.resetDatabase();
}

// Função helper para fechar a aplicação
export async function closeTestApp(): Promise<void> {
  const helper = TestAppHelper.getInstance();
  await helper.closeApp();
} 