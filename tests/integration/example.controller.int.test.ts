import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import Example from '../../src/models/Example';

describe('Example Controller Integration', () => {
  let server: any;

  beforeAll(async () => {
    // Use the same server as in setup.ts
    // @ts-ignore
    server = global.server || app.listen(0);
  });

  afterAll(async () => {
    await Example.deleteMany({});
    if (server && server.close) server.close();
  });

  afterEach(async () => {
    await Example.deleteMany({});
  });

  describe('POST /api/examples', () => {
    it('should create a new example item', async () => {
      const exampleData = {
        name: 'Test Item',
        description: 'A test item',
        price: 99.99,
        metadata: { category: 'electronics' },
      };
      const res = await request(server)
        .post('/api/examples')
        .send(exampleData)
        .expect(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.name).toBe('Test Item');
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(server)
        .post('/api/examples')
        .send({})
        .expect(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Missing required fields/);
    });
  });

  describe('GET /api/examples', () => {
    it('should return a list of example items', async () => {
      await Example.create({
        name: 'Item 1',
        description: 'First',
        price: 10,
        metadata: { category: 'books' },
      });
      await Example.create({
        name: 'Item 2',
        description: 'Second',
        price: 20,
        metadata: { category: 'electronics' },
      });
      const res = await request(server)
        .get('/api/examples')
        .expect(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });
  });
}); 