import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from './../src/common/filters/http-exception.filter';
import { TransformInterceptor } from './../src/common/interceptors/transform.interceptor';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let createdProductId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply global prefix (same as main.ts)
    app.setGlobalPrefix('api');
    
    // Apply global pipes (same as main.ts)
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    
    // Apply global filters and interceptors (same as main.ts)
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/products (POST) - should create a product', () => {
    return request(app.getHttpServer())
      .post('/api/products')
      .send({
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
      })
      .expect(201)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.name).toBe('Test Product');
        expect(response.body.data.price).toBe(99.99);
        createdProductId = response.body.data.id;
      });
  });

  it('/api/products (GET) - should return all products', () => {
    return request(app.getHttpServer())
      .get('/api/products')
      .expect(200)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
      });
  });

  it('/api/products/:id (GET) - should return a product', () => {
    return request(app.getHttpServer())
      .get(`/api/products/${createdProductId}`)
      .expect(200)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(createdProductId);
      });
  });

  it('/api/products/:id (PATCH) - should update a product', () => {
    return request(app.getHttpServer())
      .patch(`/api/products/${createdProductId}`)
      .send({
        name: 'Updated Product',
        price: 149.99,
      })
      .expect(200)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe('Updated Product');
        expect(response.body.data.price).toBe(149.99);
      });
  });

  it('/api/products/:id (DELETE) - should delete a product', () => {
    return request(app.getHttpServer())
      .delete(`/api/products/${createdProductId}`)
      .expect(204);
  });

  it('/api/products (POST) - should fail with invalid data', () => {
    return request(app.getHttpServer())
      .post('/api/products')
      .send({
        name: 'Product',
        // Missing required fields
      })
      .expect(400);
  });

  it('/api/products/:id (GET) - should return 404 for non-existent product', () => {
    return request(app.getHttpServer())
      .get('/api/products/00000000-0000-0000-0000-000000000000')
      .expect(404);
  });
});
