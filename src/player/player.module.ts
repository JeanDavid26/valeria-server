import { Module } from '@nestjs/common';

import { AuthenticationModule } from 'src/authentication/authentication.module';

import { ProfileController } from './controller/profile.controller';
import { DrizzleProfileRepository } from './providers/drizzle-profile.repository';
import { PROFILE_REPOSITORY } from './repositories/profile.repository';
import { ProfileService } from './services/profile.service';

@Module({
  imports: [AuthenticationModule],
  controllers: [ProfileController],
  providers: [
    ProfileService,
    {
      provide: PROFILE_REPOSITORY,
      useClass: DrizzleProfileRepository,
    },
  ],
})
export class PlayerModule {}
