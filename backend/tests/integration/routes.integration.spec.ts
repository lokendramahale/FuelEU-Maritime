import request from 'supertest';
import { app } from '../../src/app';

describe('routes endpoints', () => {
  it('health and routes list', async () => {
    await request(app).get('/health').expect(200);
    const res = await request(app).get('/routes').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
