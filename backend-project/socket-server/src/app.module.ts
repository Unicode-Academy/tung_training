import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AppGateway } from './gateway/app/app.gateway';
import { NotificationGateway } from './gateway/notification/notification.gateway';

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService, AppGateway, NotificationGateway],
})
export class AppModule {}
