import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from './../src/common/filters/http-exception.filter';
import { TransformInterceptor } from './../src/common/interceptors/transform.interceptor';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let createdUserId: string;

  beforeAll(async () => {
    console.log('Starting e2e test: initializing Nest app...');
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
    console.log('Nest app initialized. Ready for requests.');
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/users (POST) - should create a user', () => {
    return request(app.getHttpServer())
      .post('/api/users')
      .send({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+66812345678',
      })
      .expect(201)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.email).toBe('test@example.com');
        createdUserId = response.body.data.id;
      });
  });

  it('/api/users (GET) - should return all users', () => {
    return request(app.getHttpServer())
      .get('/api/users')
      .expect(200)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
      });
  });

  it('/api/users/:id (GET) - should return a user', () => {
    return request(app.getHttpServer())
      .get(`/api/users/${createdUserId}`)
      .expect(200)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(createdUserId);
      });
  });

  it('/api/users/:id (PATCH) - should update a user', () => {
    return request(app.getHttpServer())
      .patch(`/api/users/${createdUserId}`)
      .send({
        firstName: 'Jane',
      })
      .expect(200)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.data.firstName).toBe('Jane');
      });
  });

  it('/api/users/:id (DELETE) - should delete a user', () => {
    return request(app.getHttpServer())
      .delete(`/api/users/${createdUserId}`)
      .expect(204);
  });
});