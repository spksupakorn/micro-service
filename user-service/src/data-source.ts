// import { DataSource } from 'typeorm';
// import { User } from './users/entities/user.entity';
// import * as dotenv from 'dotenv';
// dotenv.config();

// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.DB_PORT, 10) || 5432,
//   username: process.env.DB_USERNAME || 'userservice',
//   password: process.env.DB_PASSWORD || 'userpass123',
//   database: process.env.DB_DATABASE || 'userdb',
//   entities: [User],
//   synchronize: false,
//   migrations: ['src/migrations/*.ts'],
// });
