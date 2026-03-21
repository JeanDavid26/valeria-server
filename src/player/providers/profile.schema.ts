import { integer, pgTable, unique, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from 'src/authentication/providers/user.schema';

export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .references(() => users.id)
      .unique()
      .notNull(),
    username: varchar('username', { length: 100 }).notNull(),
    tag: varchar('tag', { length: 4 }).notNull(),
    avatar: varchar('avatar', { length: 500 }),
    level: integer('level').default(1).notNull(),
    description: varchar('description', { length: 1000 }),
  },
  (table) => ({
    uniqueTag: unique().on(table.username, table.tag),
  }),
);
