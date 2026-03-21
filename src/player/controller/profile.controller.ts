import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { AuthGuard } from 'src/authentication/guards/auth.guard';
import { type JwtPayload } from 'src/authentication/models/jwt-payload.model';
import { RequestUser } from 'src/shared/decorators/request-user.decorator';

import { Profile } from '../models/profile.model';
import { ProfileService } from '../services/profile.service';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { GetProfileParamsDto } from './dtos/get-profile-params.dto';

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username/:tag')
  async getProfile(
    @Param() { username, tag }: GetProfileParamsDto,
  ): Promise<Profile | null> {
    return this.profileService.getProfile(username, tag);
  }

  @Post()
  async createProfile(
    @RequestUser() { sub }: JwtPayload,
    @Body() { username }: CreateProfileDto,
  ): Promise<Profile> {
    return this.profileService.createProfile(sub, username);
  }
}
