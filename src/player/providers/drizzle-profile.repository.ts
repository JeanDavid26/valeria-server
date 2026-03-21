import { Inject, Injectable } from '@nestjs/common';

import { and, eq } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import { DATABASE } from '../../database/database.provider';
import type { Profile } from '../models/profile.model';
import { ProfileRepository } from '../repositories/profile.repository';
import { profiles } from './profile.schema';

@Injectable()
export class DrizzleProfileRepository implements ProfileRepository {
  constructor(@Inject(DATABASE) private readonly db: PostgresJsDatabase) {}

  async create(profile: Partial<Profile>): Promise<Profile> {
    const [result] = await this.db
      .insert(profiles)
      .values(profile as typeof profiles.$inferInsert)
      .returning();

    return result;
  }

  async findByUserId(userId: string): Promise<Profile> {
    const [result] = await this.db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId));

    if (!result) throw new Error('Profile not found');
    return result;
  }

  async findByUsernameAndTag(
    username: string,
    tag: string,
  ): Promise<Profile | null> {
    const [result] = await this.db
      .select()
      .from(profiles)
      .where(and(eq(profiles.username, username), eq(profiles.tag, tag)));

    return result ?? null;
  }
}
