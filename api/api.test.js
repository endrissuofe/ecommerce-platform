const request = require('supertest');
const app = require('./server');

describe('E-commerce API', () => {
  test('GET /health should return OK status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body.status).toBe('OK');
  });

  test('GET /api/products should return products list', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('POST /api/products should create a new product', async () => {
    const newProduct = {
      name: 'Test Product',
      price: 29.99,
      category: 'Test'
    };

    const response = await request(app)
      .post('/api/products')
      .send(newProduct)
      .expect(201);

    expect(response.body.name).toBe(newProduct.name);
    expect(response.body.price).toBe(newProduct.price);
  });

  test('POST /api/users/register should create a new user', async () => {
    const newUser = {
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/users/register')
      .send(newUser)
      .expect(201);

    expect(response.body.email).toBe(newUser.email);
    expect(response.body.password).toBeUndefined();
  });
});
