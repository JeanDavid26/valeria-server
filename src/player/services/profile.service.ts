import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { UserService } from 'src/authentication/services/user.service';

import { Profile } from '../models/profile.model';
import {
  PROFILE_REPOSITORY,
  type ProfileRepository,
} from '../repositories/profile.repository';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userService: UserService,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async getProfile(username: string, tag: string): Promise<Profile | null> {
    const profile = await this.profileRepository.findByUsernameAndTag(
      username,
      tag,
    );

    return profile;
  }

  async createProfile(userId: string, username: string): Promise<Profile> {
    const tag = await this.generateUniqueTag(username);
    return this.profileRepository.create({ userId, username, tag });
  }

  private async generateUniqueTag(username: string): Promise<string> {
    const maxAttempts = 10;

    for (let i = 0; i < maxAttempts; i++) {
      const tag = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
      const exists = await this.profileRepository.findByUsernameAndTag(
        username,
        tag,
      );
      if (!exists) return tag;
    }

    throw new ConflictException(
      'Unable to generate unique tag, try another username',
    );
  }
}
