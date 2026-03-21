import { Profile } from '../models/profile.model';

export interface ProfileRepository {
  create(profile: Partial<Profile>): Promise<Profile>;
  findByUserId(userId: string): Promise<Profile>;
  findByUsernameAndTag(username: string, tag: string): Promise<Profile | null>;
}
export const PROFILE_REPOSITORY = Symbol('PROFILE_REPOSITORY');
