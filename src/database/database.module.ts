// src/database/database.module.ts
import { Global, Module } from '@nestjs/common';
import { databaseProvider, DATABASE } from './database.provider';

@Global()
@Module({
  providers: [databaseProvider],
  exports: [DATABASE],
})
export class DatabaseModule {}
