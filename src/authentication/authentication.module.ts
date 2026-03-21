import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthenticationController } from './controller/authentication.controller';
import { DrizzleUserRepository } from './providers/drizzle-user.repository';
import { USER_REPOSITORY } from './repositories/user.repository';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: DrizzleUserRepository,
    },
    AuthenticationService,
    UserService,
  ],
  exports: [UserService],
})
export class AuthenticationModule {}
