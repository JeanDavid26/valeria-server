import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthenticationController } from './controller/authentication.controller';
import { DrizzleUserRepository } from './provider/drizzle-user.repository';
import { USER_REPOSITORY } from './repository/user.repository';
import { AuthenticationService } from './services/authentication.service';

@Module({
  imports: [
    JwtModule.registerAsync({
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
  ],
  exports: [USER_REPOSITORY],
})
export class AuthenticationModule {}
