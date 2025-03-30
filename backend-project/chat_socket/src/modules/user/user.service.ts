import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { Repository } from 'typeorm';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import { PhoneService } from '../phone/phone.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private phoneService: PhoneService,
  ) {}
  findAll() {
    return this.userRepository.find({
      relations: {
        phone: true,
      },
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: {
        phone: true,
      },
    });
  }

  async create(body: CreateUserDto & { phone?: string }) {
    const { phone: phoneValue, ...userData } = body;
    const user = await this.userRepository.save(userData);
    const phone = await this.phoneService.create({ phone: phoneValue, user });

    // return this.userRepository.save(userData);
  }

  async update(userData: UpdateUserDto, id: number) {
    const user = await this.findOne(id);
    if (!user) {
      return null;
    }
    await this.userRepository.update(id, userData);
    return user;
  }

  async delete(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      return null;
    }
    await this.userRepository.delete(id);
    return user;
  }
}
