import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from './repository/user.repository';
import { DrizzleUserRepository } from './provider/drizzle-user.repository';
import { AuthenticationController } from './controller/authentication.controller';
import { AuthenticationService } from './services/authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
