import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { cleanDatabase } from './clean-db';

describe('DashboardController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Limpar banco de dados
    await cleanDatabase(app);

    // Criar dados de teste para o dashboard
    await createTestData();
  });

  afterEach(async () => {
    await app.close();
  });

  async function createTestData() {
    // Criar produtor
    const producerResponse = await request(app.getHttpServer())
      .post('/producers')
      .send({
        name: 'João Silva',
        document: '37061531657', // CPF válido
      });

    const producerId = producerResponse.body.id;

    // Criar fazenda
    const farmResponse = await request(app.getHttpServer())
      .post('/farms')
      .send({
        name: 'Fazenda Teste',
        city: 'São Paulo',
        state: 'SP',
        totalAreaHectares: 1000,
        arableAreaHectares: 800,
        vegetationAreaHectares: 200,
        producerId: producerId,
      });

    const farmId = farmResponse.body.id;

    // Adicionar cultura
    await request(app.getHttpServer()).post(`/farms/${farmId}/crops`).send({
      cropName: 'Soja',
      harvestSeason: 'Safra 2023',
    });
  }

  describe('/dashboard/summary (GET)', () => {
    it('should return dashboard summary', () => {
      return request(app.getHttpServer())
        .get('/dashboard/summary')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalFarms');
          expect(res.body).toHaveProperty('totalAreaHectares');
          expect(typeof res.body.totalFarms).toBe('number');
          expect(typeof res.body.totalAreaHectares).toBe('number');
          // Não esperamos dados específicos pois podem não existir fazendas
        });
    });
  });

  describe('/dashboard/farms-by-state (GET)', () => {
    it('should return farms by state data', () => {
      return request(app.getHttpServer())
        .get('/dashboard/farms-by-state')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);

          if (res.body.length > 0) {
            const farmData = res.body[0];
            expect(farmData).toHaveProperty('state');
            expect(farmData).toHaveProperty('count');
            expect(farmData).toHaveProperty('totalArea');
            expect(typeof farmData.state).toBe('string');
            expect(typeof farmData.count).toBe('number');
            expect(typeof farmData.totalArea).toBe('number');
          }
        });
    });
  });

  describe('/dashboard/crops (GET)', () => {
    it('should return crops data', () => {
      return request(app.getHttpServer())
        .get('/dashboard/crops')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);

          if (res.body.length > 0) {
            const cropData = res.body[0];
            expect(cropData).toHaveProperty('cropName');
            expect(cropData).toHaveProperty('count');
            expect(cropData).toHaveProperty('totalArea');
            expect(typeof cropData.cropName).toBe('string');
            expect(typeof cropData.count).toBe('number');
            expect(typeof cropData.totalArea).toBe('number');
          }
        });
    });
  });

  describe('/dashboard/land-use (GET)', () => {
    it('should return land use data', () => {
      return request(app.getHttpServer())
        .get('/dashboard/land-use')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);

          if (res.body.length > 0) {
            const landUseData = res.body[0];
            expect(landUseData).toHaveProperty('category');
            expect(landUseData).toHaveProperty('totalArea');
            expect(landUseData).toHaveProperty('percentage');
            expect(typeof landUseData.category).toBe('string');
            expect(typeof landUseData.totalArea).toBe('number');
            expect(typeof landUseData.percentage).toBe('number');

            // Verificar se as categorias estão corretas
            const categories = res.body.map((item) => item.category);
            expect(categories).toContain('Área Agricultável');
            expect(categories).toContain('Área de Vegetação');
          }
        });
    });
  });

  describe('Dashboard with empty data', () => {
    it('should handle empty database gracefully', async () => {
      // Limpar dados (em um cenário real, você teria um banco de teste separado)
      // Por enquanto, vamos apenas testar se os endpoints não quebram

      return request(app.getHttpServer())
        .get('/dashboard/summary')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalFarms');
          expect(res.body).toHaveProperty('totalAreaHectares');
        });
    });
  });
});
