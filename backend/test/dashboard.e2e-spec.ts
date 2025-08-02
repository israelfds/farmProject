import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp, closeTestApp, resetTestDatabase } from './test-app.helper';

describe('DashboardController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  beforeEach(async () => {
    await resetTestDatabase();
  });

  describe('/dashboard/summary (GET)', () => {
    it('should return dashboard summary', () => {
      return request(app.getHttpServer())
        .get('/dashboard/summary')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalFarms');
          expect(res.body).toHaveProperty('totalArea');
          expect(typeof res.body.totalFarms).toBe('number');
          expect(typeof res.body.totalArea).toBe('number');
          expect(typeof res.body.totalProducers).toBe('number');
          expect(typeof res.body.totalCrops).toBe('number');
        });
    });

    it('should return valid numeric values', () => {
      return request(app.getHttpServer())
        .get('/dashboard/summary')
        .expect(200)
        .expect((res) => {
          expect(res.body.totalFarms).toBeGreaterThanOrEqual(0);
          expect(res.body.totalArea).toBeGreaterThanOrEqual(0);
          expect(res.body.totalProducers).toBeGreaterThanOrEqual(0);
          expect(res.body.totalCrops).toBeGreaterThanOrEqual(0);
        });
    });
  });

  describe('/dashboard/farms-by-state (GET)', () => {
    it('should return farms by state', () => {
      return request(app.getHttpServer())
        .get('/dashboard/farms-by-state')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
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
        });
    });
  });

  describe('Dashboard with empty data', () => {
    it('should handle empty database gracefully', () => {
      return request(app.getHttpServer())
        .get('/dashboard/summary')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalFarms');
          expect(res.body).toHaveProperty('totalArea');
        });
    });
  });
});
