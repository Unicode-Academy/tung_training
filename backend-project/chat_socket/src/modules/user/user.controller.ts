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

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: number) {
    const user = await this.userService.findOne(id);
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
}
