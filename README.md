## NestJS Microservices Project

This project contains three microservices built with NestJS:
- **User Service** - Manages user data
- **Product Service** - Manages product data
- **Order Service** - Manages order data

## Tech Stack

- NestJS
- TypeORM
- PostgreSQL
- Docker & Docker Compose
- Swagger for API documentation
- Class Validator & Class Transformer
- Jest for testing

## Getting Started

### Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for each service:

```bash
cd user-service && npm install
cd ../product-service && npm install
cd ../order-service && npm install
```

### Running with Docker

```bash
# Start all services with databases
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Running Locally

Each service can be run independently:

```bash
# User Service (Port 3001)
cd user-service
npm run start:dev

# Product Service (Port 3002)
cd product-service
npm run start:dev

# Order Service (Port 3003)
cd order-service
npm run start:dev
```

## API Documentation

Once services are running, access Swagger UI:

- User Service: http://localhost:3001/api/docs
- Product Service: http://localhost:3002/api/docs
- Order Service: http://localhost:3003/api/docs

## API Endpoints

### User Service (Port 3001)

- `POST /api/users` - Create user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Product Service (Port 3002)

- `POST /api/products` - Create product
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Order Service (Port 3003)

- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Testing Overview

### Unit Tests
รันด้วยคำสั่ง:
```
npm run test
```
ทดสอบฟังก์ชัน/เมธอดแต่ละตัวแบบแยกส่วน (mock dependencies)
ไฟล์: `*.spec.ts`

### E2E Tests
รันด้วยคำสั่ง:
```
npm run test:e2e
```
ทดสอบระบบจริงผ่าน HTTP (API endpoints, database จริง)
ไฟล์: `*.e2e-spec.ts`

### Test Coverage
รันด้วยคำสั่ง:
```
npm run test:cov
```
ดูรายงานว่า code ถูกทดสอบกี่เปอร์เซ็นต์ (coverage)
ไฟล์รายงาน: ในโฟลเดอร์ `coverage/`

| ประเภท | ความเร็ว | ใช้ Database | ทดสอบอะไร | ไฟล์ |
|--------|---------|--------------|-----------|------|
| **Unit** | ⚡ เร็วมาก | ❌ ไม่ใช้ (mock) | Function/Method แต่ละตัว | `*.spec.ts` |
| **E2E** | 🐢 ช้ากว่า | ✅ ใช้จริง | ระบบทั้งหมด (API endpoints) | `*.e2e-spec.ts` |
| **Coverage** | ⚡ เร็วมาก | ❌ ไม่ใช้ (mock) | วัด % code ที่ถูกทดสอบ | Report ใน `coverage/` |

**Best Practice:**
1. เขียน Unit tests เยอะ ๆ (เร็ว, ทดสอบ logic แต่ละส่วน)
2. เขียน E2E tests สำหรับ critical flows (ทดสอบระบบจริง)
3. รัน Coverage เพื่อดูว่ามี code ส่วนไหนยังไม่ได้ทดสอบ
เป้าหมายที่ดี: Coverage > 80%

## Environment Variables

Each service requires a `.env` file. See `.env.example` in each service directory.

## Architecture

Each microservice follows clean architecture principles:

```
src/
├── main.ts              # Application entry point
├── app.module.ts        # Root module
├── [entity]/
│   ├── entities/        # Database entities
│   ├── dto/            # Data Transfer Objects
│   ├── [entity].controller.ts
│   ├── [entity].service.ts
│   └── [entity].module.ts
├── common/             # Shared utilities
│   ├── filters/        # Exception filters
│   ├── interceptors/   # Response interceptors
│   └── pipes/          # Validation pipes
└── config/             # Configuration files
```

## Best Practices Implemented

- ✅ Modular architecture with separation of concerns
- ✅ DTOs for request validation
- ✅ Custom exception filters
- ✅ Response transformation interceptors
- ✅ Swagger API documentation
- ✅ Environment-based configuration
- ✅ Database migrations
- ✅ Unit and E2E testing
- ✅ Docker containerization
- ✅ Error handling and logging
- ✅ Type safety with TypeScript

## Comment

data-source.ts ไม่จำเป็น สำหรับการรันแอปพลิเคชัน NestJS ปกติ เพราะ:
การรันแอป (npm run start:dev):

ใช้ AppModule ที่มี TypeOrmModule.forRootAsync() อยู่แล้ว

TypeORM จะสร้าง DataSource อัตโนมัติจาก config ใน app.module.ts

ไม่ต้องใช้ data-source.ts เลย

data-source.ts จำเป็นเฉพาะเมื่อ:

รันคำสั่ง TypeORM CLI เช่น:

npm run migration:generate -- -d src/data-source.ts src/migrations/CreateUser

npm run migration:run -- -d src/data-source.ts

npm run migration:revert -- -d src/data-source.ts

ถ้าคุณไม่ใช้ migration หรือใช้ synchronize: true อยู่แล้ว (ตารางสร้างอัตโนมัติ) คุณไม่จำเป็นต้องมีไฟล์นี้เลย

สรุป:
ใช้ synchronize: true (development) → ไม่ต้องมี data-source.ts

ใช้ migration (production) → ต้องมี data-source.ts สำหรับรัน migration เท่านั้น

คุณสามารถลบไฟล์ data-source.ts ได้ถ้าไม่ใช้ migration!