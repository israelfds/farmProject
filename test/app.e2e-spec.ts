import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

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

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(404); // NestJS returns 404 for root path by default
  });

  it('/api-docs (GET)', () => {
    return request(app.getHttpServer()).get('/api-docs').expect(200);
  });
});
