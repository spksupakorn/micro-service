import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from './../src/common/filters/http-exception.filter';
import { TransformInterceptor } from './../src/common/interceptors/transform.interceptor';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;
  let createdOrderId: string;

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

  it('/api/orders (POST) - should create an order', () => {
    return request(app.getHttpServer())
      .post('/api/orders')
      .send({
        userId: '123e4567-e89b-12d3-a456-426614174000',
        productId: '123e4567-e89b-12d3-a456-426614174001',
        quantity: 2,
        totalAmount: 199.98,
        shippingAddress: '123 Main St, City, Country',
      })
      .expect(201)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.userId).toBe('123e4567-e89b-12d3-a456-426614174000');
        expect(response.body.data.quantity).toBe(2);
        createdOrderId = response.body.data.id;
      });
  });

  it('/api/orders (GET) - should return all orders', () => {
    return request(app.getHttpServer())
      .get('/api/orders')
      .expect(200)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
      });
  });

  it('/api/orders/:id (GET) - should return an order', () => {
    return request(app.getHttpServer())
      .get(`/api/orders/${createdOrderId}`)
      .expect(200)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(createdOrderId);
      });
  });

  it('/api/orders/:id (PATCH) - should update an order', () => {
    return request(app.getHttpServer())
      .patch(`/api/orders/${createdOrderId}`)
      .send({
        status: 'delivered',
        quantity: 3,
      })
      .expect(200)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.data.status).toBe('delivered');
        expect(response.body.data.quantity).toBe(3);
      });
  });

  it('/api/orders/:id (DELETE) - should delete an order', () => {
    return request(app.getHttpServer())
      .delete(`/api/orders/${createdOrderId}`)
      .expect(204);
  });

  it('/api/orders (POST) - should fail with invalid data', () => {
    return request(app.getHttpServer())
      .post('/api/orders')
      .send({
        userId: 'invalid-uuid',
        // Missing required fields
      })
      .expect(400);
  });

  it('/api/orders/:id (GET) - should return 404 for non-existent order', () => {
    return request(app.getHttpServer())
      .get('/api/orders/00000000-0000-0000-0000-000000000000')
      .expect(404);
  });
});
