// src/database/database.provider.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { ConfigService } from '@nestjs/config';

export const DATABASE = Symbol('DATABASE');

export const databaseProvider = {
  provide: DATABASE,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const client = postgres(config.getOrThrow<string>('DATABASE_URL'));
    return drizzle(client);
  },
};
