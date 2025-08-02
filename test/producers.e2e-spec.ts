import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
// 1. Importe apenas a função 'cleanDatabase'
import { cleanDatabase } from './clean-db';
import { useContainer } from 'class-validator';

describe('ProducersController (e2e)', () => {
  let app: INestApplication;

  // ANTES DE CADA TESTE: Recria a aplicação e limpa a base de dados
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    // Conecta o class-validator ao container de DI do NestJS
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    await app.init();

    // 2. Limpa a base de dados USANDO a conexão da aplicação recém-criada
    await cleanDatabase(app);
  });

  // DEPOIS DE CADA TESTE: Fecha a instância da aplicação para liberar recursos
  afterEach(async () => {
    await app.close();
  });

  describe('/producers (POST)', () => {
    it('should create a new producer', () => {
      const createProducerDto = {
        name: 'João Silva',
        document: '77602768850', // CPF VÁLIDO
      };

      return request(app.getHttpServer())
        .post('/producers')
        .send(createProducerDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(createProducerDto.name);
        });
    });

    it('should fail to create producer with invalid CPF', () => {
      const createProducerDto = {
        name: 'Documento Inválido',
        document: '11111111111', // CPF inválido (todos os dígitos iguais)
      };

      return request(app.getHttpServer())
        .post('/producers')
        .send(createProducerDto)
        .expect(400);
    });

    it('should fail to create producer with duplicate document', async () => {
      const producerData = {
        name: 'Documento Duplicado',
        document: '31708353194', // CPF VÁLIDO
      };
      await request(app.getHttpServer())
        .post('/producers')
        .send(producerData)
        .expect(201);

      // Tentar criar outro produtor com o mesmo documento
      return request(app.getHttpServer())
        .post('/producers')
        .send({
          name: 'Outro Produtor',
          document: '31708353194', // Mesmo CPF
        })
        .expect(409);
    });
  });

  describe('/producers (GET)', () => {
    it('should return all producers', async () => {
      // Criar um produtor primeiro
      await request(app.getHttpServer())
        .post('/producers')
        .send({
          name: 'Produtor Teste',
          document: '34742784600', // CPF VÁLIDO
        })
        .expect(201);

      return request(app.getHttpServer())
        .get('/producers')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('/producers/:id (GET)', () => {
    it('should return a specific producer', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/producers')
        .send({
          name: 'Produtor Específico',
          document: '55821506255', // CPF VÁLIDO
        })
        .expect(201);
      const producerId = createResponse.body.id;

      return request(app.getHttpServer())
        .get(`/producers/${producerId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(producerId);
        });
    });

    it('should return 400 for invalid UUID', () => {
      return request(app.getHttpServer())
        .get('/producers/invalid-uuid')
        .expect(400);
    });
  });

  describe('/producers/:id (PATCH)', () => {
    it('should update a producer', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/producers')
        .send({
          name: 'Produtor Original',
          document: '85382880328', // CPF VÁLIDO
        })
        .expect(201);
      const producerId = createResponse.body.id;

      const updateProducerDto = {
        name: 'Produtor Atualizado',
      };

      return request(app.getHttpServer())
        .patch(`/producers/${producerId}`)
        .send(updateProducerDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(updateProducerDto.name);
        });
    });

    it('should return 400 for invalid UUID', () => {
      return request(app.getHttpServer())
        .patch('/producers/invalid-uuid')
        .send({ name: 'test' })
        .expect(400);
    });
  });

  describe('/producers/:id (DELETE)', () => {
    it('should delete a producer', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/producers')
        .send({
          name: 'Produtor a ser Deletado',
          document: '38350247363', // CPF VÁLIDO
        })
        .expect(201);
      const producerId = createResponse.body.id;

      return request(app.getHttpServer())
        .delete(`/producers/${producerId}`)
        .expect(204);
    });

    it('should return 400 for invalid UUID', () => {
      return request(app.getHttpServer())
        .delete('/producers/invalid-uuid')
        .expect(400);
    });
  });
});
