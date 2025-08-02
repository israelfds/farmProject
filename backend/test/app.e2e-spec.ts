import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp, closeTestApp, resetTestDatabase } from './test-app.helper';

describe('AppController (e2e)', () => {
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

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(404); // NestJS returns 404 for root path by default
  });

  it('/api-docs (GET)', () => {
    return request(app.getHttpServer()).get('/api-docs').expect(200);
  });
});
