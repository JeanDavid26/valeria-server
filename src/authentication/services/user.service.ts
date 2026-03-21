import { Inject, Injectable } from '@nestjs/common';

import { UserPublic } from '../models/user.model';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async getUser(userId: string): Promise<UserPublic> {
    const user = await this.userRepository.findById(userId);
    return {
      id: user.id,
      email: user.email,
    };
  }
}
