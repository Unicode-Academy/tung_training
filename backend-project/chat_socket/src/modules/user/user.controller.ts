import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';

@Controller({
  path: 'users',
  version: '1',
}) // URL: /users/2
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: number) {
    const user = await this.userService.findOne(id, {
      phone: true,
    });
    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }
    return user;
  }

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }
  @Put(':id')
  async update(@Body() body: UpdateUserDto, @Param('id') id: number) {
    const user = await this.userService.update(body, id);
    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }
    return user;
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const user = await this.userService.delete(id);
    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }
    return user;
  }

  @Post(':id/posts')
  createPost(@Param('id') userId: number, @Body() body: any) {
    return this.userService.createPost(body, userId);
  }

  @Get(':id/posts')
  async getPosts(@Param('id') userId: number) {
    const posts = await this.userService.getPosts(userId);
    if (!posts.length) {
      throw new NotFoundException('Không có post');
    }
    return posts;
  }
}
