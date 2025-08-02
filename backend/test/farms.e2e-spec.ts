import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp, closeTestApp, resetTestDatabase } from './test-app.helper';

describe('FarmsController (e2e)', () => {
  let app: INestApplication;
  let createdProducerId: string;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  beforeEach(async () => {
    await resetTestDatabase();
    
    // Criar um produtor para usar nos testes de fazenda
    const createProducerDto = {
      name: 'Maria Santos',
      document: '08081185100', // CPF válido
    };

    try {
      const producerResponse = await request(app.getHttpServer())
        .post('/producers')
        .send(createProducerDto)
        .expect(201);

      createdProducerId = producerResponse.body.id;
      
      if (!createdProducerId) {
        throw new Error('Produtor não foi criado corretamente');
      }
      
      console.log(`✅ Produtor criado com ID: ${createdProducerId}`);
    } catch (error) {
      console.error('❌ Erro ao criar produtor para teste:', error);
      throw error;
    }
  });

  describe('/farms (POST)', () => {
    it('should create a new farm', () => {
      const createFarmDto = {
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalAreaHectares: 1000,
        arableAreaHectares: 800,
        vegetationAreaHectares: 200,
        producerId: createdProducerId,
      };

      return request(app.getHttpServer())
        .post('/farms')
        .send(createFarmDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(createFarmDto.name);
          expect(res.body.city).toBe(createFarmDto.city);
          expect(res.body.state).toBe(createFarmDto.state);
          expect(res.body.totalAreaHectares).toBe(
            createFarmDto.totalAreaHectares,
          );
          expect(res.body.arableAreaHectares).toBe(
            createFarmDto.arableAreaHectares,
          );
          expect(res.body.vegetationAreaHectares).toBe(
            createFarmDto.vegetationAreaHectares,
          );
          expect(res.body.producerId).toBe(createdProducerId);
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
        });
    });

    it('should fail to create farm with invalid area sum', () => {
      const createFarmDto = {
        name: 'Fazenda Inválida',
        city: 'São Paulo',
        state: 'SP',
        totalAreaHectares: 1000,
        arableAreaHectares: 800,
        vegetationAreaHectares: 300, // 800 + 300 = 1100 > 1000
        producerId: createdProducerId,
      };

      return request(app.getHttpServer())
        .post('/farms')
        .send(createFarmDto)
        .expect(400);
    });

    it('should fail to create farm with non-existent producer', () => {
      const createFarmDto = {
        name: 'Fazenda Teste',
        city: 'São Paulo',
        state: 'SP',
        totalAreaHectares: 1000,
        arableAreaHectares: 800,
        vegetationAreaHectares: 200,
        producerId: '00000000-0000-0000-0000-000000000000',
      };

      return request(app.getHttpServer())
        .post('/farms')
        .send(createFarmDto)
        .expect(400);
    });
  });

  describe('/farms (GET)', () => {
    it('should return all farms', async () => {
      // Criar uma fazenda primeiro
      const createFarmDto = {
        name: 'Fazenda Teste GET',
        city: 'São Paulo',
        state: 'SP',
        totalAreaHectares: 1000,
        arableAreaHectares: 800,
        vegetationAreaHectares: 200,
        producerId: createdProducerId,
      };

      await request(app.getHttpServer())
        .post('/farms')
        .send(createFarmDto)
        .expect(201);

      return request(app.getHttpServer())
        .get('/farms')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('name');
          expect(res.body[0]).toHaveProperty('city');
          expect(res.body[0]).toHaveProperty('state');
        });
    });
  });

  describe('/farms/:id (GET)', () => {
    it('should return a specific farm', async () => {
      // Criar uma fazenda primeiro
      const createFarmDto = {
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalAreaHectares: 1000,
        arableAreaHectares: 800,
        vegetationAreaHectares: 200,
        producerId: createdProducerId,
      };

      let farmResponse;
      try {
        farmResponse = await request(app.getHttpServer())
          .post('/farms')
          .send(createFarmDto)
          .expect(201);

        const farmId = farmResponse.body.id;
        console.log(`✅ Fazenda criada com ID: ${farmId}`);

        return request(app.getHttpServer())
          .get(`/farms/${farmId}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.id).toBe(farmId);
            expect(res.body.name).toBe('Fazenda São João');
            expect(res.body.city).toBe('São Paulo');
            expect(res.body.state).toBe('SP');
          });
      } catch (error) {
        console.error('❌ Erro ao criar fazenda para teste:', error);
        throw error;
      }
    });

    it('should return 400 for invalid UUID', () => {
      return request(app.getHttpServer())
        .get('/farms/invalid-uuid')
        .expect(400);
    });
  });

  describe('/farms/:id (PATCH)', () => {
    it('should update a farm', async () => {
      // Criar uma fazenda primeiro
      const createFarmDto = {
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalAreaHectares: 1000,
        arableAreaHectares: 800,
        vegetationAreaHectares: 200,
        producerId: createdProducerId,
      };

      let farmResponse;
      try {
        farmResponse = await request(app.getHttpServer())
          .post('/farms')
          .send(createFarmDto)
          .expect(201);

        const farmId = farmResponse.body.id;
        console.log(`✅ Fazenda criada para atualização com ID: ${farmId}`);

        const updateFarmDto = {
          name: 'Fazenda São João Updated',
          city: 'Campinas',
        };

        return request(app.getHttpServer())
          .patch(`/farms/${farmId}`)
          .send(updateFarmDto)
          .expect(200)
          .expect((res) => {
            expect(res.body.id).toBe(farmId);
            expect(res.body.name).toBe(updateFarmDto.name);
            expect(res.body.city).toBe(updateFarmDto.city);
            expect(res.body.state).toBe('SP'); // Não mudou
          });
      } catch (error) {
        console.error('❌ Erro ao criar fazenda para atualização:', error);
        throw error;
      }
    });

    it('should fail to update farm with invalid area sum', async () => {
      // Criar uma fazenda primeiro
      const createFarmDto = {
        name: 'Fazenda Teste',
        city: 'São Paulo',
        state: 'SP',
        totalAreaHectares: 1000,
        arableAreaHectares: 800,
        vegetationAreaHectares: 200,
        producerId: createdProducerId,
      };

      const farmResponse = await request(app.getHttpServer())
        .post('/farms')
        .send(createFarmDto)
        .expect(201);

      const farmId = farmResponse.body.id;

      const updateFarmDto = {
        totalAreaHectares: 500, // Menor que a soma atual (800 + 200 = 1000)
        arableAreaHectares: 400,
        vegetationAreaHectares: 200, // 400 + 200 = 600 > 500
      };

      return request(app.getHttpServer())
        .patch(`/farms/${farmId}`)
        .send(updateFarmDto)
        .expect(400);
    });
  });

  describe('/farms/:farmId/crops (POST)', () => {
    it('should add a crop to a farm', async () => {
      // Criar uma fazenda primeiro
      const createFarmDto = {
        name: 'Fazenda Teste',
        city: 'São Paulo',
        state: 'SP',
        totalAreaHectares: 1000,
        arableAreaHectares: 800,
        vegetationAreaHectares: 200,
        producerId: createdProducerId,
      };

      const farmResponse = await request(app.getHttpServer())
        .post('/farms')
        .send(createFarmDto)
        .expect(201);

      const farmId = farmResponse.body.id;

      const addCropDto = {
        cropName: 'Soja',
        harvestSeason: 'Safra 2023',
      };

      return request(app.getHttpServer())
        .post(`/farms/${farmId}/crops`)
        .send(addCropDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.cropName).toBe(addCropDto.cropName);
          expect(res.body.harvestSeason).toBe(addCropDto.harvestSeason);
          expect(res.body.farmId).toBe(farmId);
        });
    });

    it('should return 400 for invalid UUID when adding crop', () => {
      const addCropDto = {
        cropName: 'Milho',
        harvestSeason: 'Safra 2023',
      };

      return request(app.getHttpServer())
        .post('/farms/invalid-uuid/crops')
        .send(addCropDto)
        .expect(400);
    });
  });

  describe('/farms/:farmId/crops/:cropId (DELETE)', () => {
    it('should remove a crop from a farm', async () => {
      // Criar uma fazenda primeiro
      const createFarmDto = {
        name: 'Fazenda Teste',
        city: 'São Paulo',
        state: 'SP',
        totalAreaHectares: 1000,
        arableAreaHectares: 800,
        vegetationAreaHectares: 200,
        producerId: createdProducerId,
      };

      const farmResponse = await request(app.getHttpServer())
        .post('/farms')
        .send(createFarmDto)
        .expect(201);

      const farmId = farmResponse.body.id;

      // Adicionar uma cultura
      const addCropDto = {
        cropName: 'Soja',
        harvestSeason: 'Safra 2023',
      };

      const cropResponse = await request(app.getHttpServer())
        .post(`/farms/${farmId}/crops`)
        .send(addCropDto)
        .expect(201);

      const cropId = cropResponse.body.id;

      return request(app.getHttpServer())
        .delete(`/farms/${farmId}/crops/${cropId}`)
        .expect(204);
    });

    it('should return 400 for invalid UUID when removing crop', async () => {
      // Criar uma fazenda primeiro
      const createFarmDto = {
        name: 'Fazenda Teste',
        city: 'São Paulo',
        state: 'SP',
        totalAreaHectares: 1000,
        arableAreaHectares: 800,
        vegetationAreaHectares: 200,
        producerId: createdProducerId,
      };

      const farmResponse = await request(app.getHttpServer())
        .post('/farms')
        .send(createFarmDto)
        .expect(201);

      const farmId = farmResponse.body.id;

      return request(app.getHttpServer())
        .delete(`/farms/${farmId}/crops/invalid-uuid`)
        .expect(400);
    });
  });

  describe('/farms/:id (DELETE)', () => {
    it('should delete a farm', async () => {
      // Criar uma fazenda primeiro
      const createFarmDto = {
        name: 'Fazenda a ser Deletada',
        city: 'São Paulo',
        state: 'SP',
        totalAreaHectares: 1000,
        arableAreaHectares: 800,
        vegetationAreaHectares: 200,
        producerId: createdProducerId,
      };

      const farmResponse = await request(app.getHttpServer())
        .post('/farms')
        .send(createFarmDto)
        .expect(201);

      const farmId = farmResponse.body.id;

      return request(app.getHttpServer())
        .delete(`/farms/${farmId}`)
        .expect(204);
    });

    it('should return 400 for invalid UUID when deleting farm', () => {
      return request(app.getHttpServer())
        .delete('/farms/invalid-uuid')
        .expect(400);
    });
  });
});
