import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { PhoneModule } from '../phone/phone.module';
import { PostsModule } from '../posts/posts.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([User]),
    PhoneModule,
    forwardRef(() => PostsModule),
  ],
  exports: [UserService],
})
export class UserModule {}
