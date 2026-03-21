import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { DatabaseModule } from './database/database.module';
import { PlayerModule } from './player/player.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    AuthenticationModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PlayerModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
