import { Knex } from 'knex';
import * as dotenv from 'dotenv';

dotenv.config();

interface KnexConfig {
  [key: string]: Knex.Config;
}

const config: KnexConfig = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'postgres',
    },
    migrations: {
      directory: './migrations',
      extension: 'ts',
      tableName: 'knex_migrations',
    },
    pool: {
      min: 2,
      max: 10,
    },
    debug: false,
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    migrations: {
      directory: './migrations',
      extension: 'ts',
      tableName: 'knex_migrations',
    },
    pool: {
      min: 5,
      max: 30,
    },
    acquireConnectionTimeout: 10000,
  },
};

export default config;
