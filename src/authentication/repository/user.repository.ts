import { User } from '../models/user.model';

export interface UserRepository {
  list(): Promise<User[]>;
  findById(id: string): Promise<User>;
  upsert(user: Partial<User>): Promise<User>;
  delete(id: string): void;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
