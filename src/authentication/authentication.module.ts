import { Module } from '@nestjs/common';
import { ControllerController } from './controller/authentication.controller';

@Module({
  controllers: [ControllerController],
})
export class AuthenticationModule {}
