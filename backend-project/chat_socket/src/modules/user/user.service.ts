import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { Repository } from 'typeorm';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import { PhoneService } from '../phone/phone.service';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private phoneService: PhoneService,
    @Inject(forwardRef(() => PostsService)) private postService: PostsService,
  ) {}
  findAll() {
    return this.userRepository.find({
      relations: {
        phone: true,
      },
    });
  }

  findOne(id: number, relations: any = {}) {
    return this.userRepository.findOneOrFail({
      where: { id },
      relations,
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

  async createPost(body: any, userId: number) {
    const user = await this.userRepository.findOneByOrFail({ id: userId });
    const post = await this.postService.create({ ...body, user });
    // const post = await this.postService.create({ ...body, user_id: user.id });
    return post;
  }

  async getPosts(userId: number) {
    const { posts } = await this.findOne(userId, { posts: true });
    return posts;
  }
}
