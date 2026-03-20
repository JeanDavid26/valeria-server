import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DATABASE } from '../../database/database.provider';
import { User } from '../models/user.model';
import { UserRepository } from '../repository/user.repository';
import { users } from './user.schema';

@Injectable()
export class DrizzleUserRepository implements UserRepository {
  constructor(@Inject(DATABASE) private readonly db: PostgresJsDatabase) {}

  async list(): Promise<User[]> {
    return this.db.select().from(users);
  }

  async findById(id: string): Promise<User> {
    const [result] = await this.db.select().from(users).where(eq(users.id, id));

    if (!result) throw new Error('User not found');
    return result;
  }

  async findByEmail(email: string): Promise<User> {
    const [result] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!result) throw new Error('User not found');
    return result;
  }

  async upsert(user: Partial<User>): Promise<User> {
    const [result] = await this.db
      .insert(users)
      .values(user as typeof users.$inferInsert)
      .onConflictDoUpdate({
        target: users.id,
        set: user as typeof users.$inferInsert,
      })
      .returning();

    return result;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(users).where(eq(users.id, id));
  }
}
