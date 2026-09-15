const request = require('supertest');

const app = require('../src/app');

describe('Application', () => {
  test('GET / should return 200', async () => {
    const response = await request(app)
      .get('/');

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Waste Bank API is running...');
  });

  test('GET /health should return 200', async () => {
    const response = await request(app)
      .get('/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.result.status).toBe(200);
    expect(response.body.result.success).toBe(true);
  });
});
