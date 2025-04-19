import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { Repository } from 'typeorm';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import { PhoneService } from '../phone/phone.service';
import { PostsService } from '../posts/posts.service';
import { RoomService } from '../room/room.service';
import Hash from 'src/utils/hashing';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private phoneService: PhoneService,
    @Inject(forwardRef(() => PostsService)) private postService: PostsService,
    private roomService: RoomService,
  ) {}
  findAll() {
    return this.userRepository.find({
      relations: {
        phone: true,
      },
    });
  }

  async findOne(id: number, relations: any = {}) {
    const user = await this.userRepository.findOneOrFail({
      where: { id },
      relations,
    });
    delete user.password;
    return user;
  }

  async create(body: CreateUserDto) {
    body.password = Hash.make(body.password);
    // const { phone: phoneValue, ...userData } = body;
    const user = await this.userRepository.save(body);
    // const phone = await this.phoneService.create({ phone: phoneValue, user });
    return user;
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

  async createRoom(userId: number, body: any) {
    const user = await this.findOne(userId);
    const room = await this.roomService.create({ ...body, users: [user] });
    return room;
  }

  async assignRoom(userId: number, body: any) {
    const user = await this.findOne(userId);
    const rooms = await this.roomService.getRoomsByIds(body);
    user.rooms = rooms;
    return this.userRepository.save(user);
  }
  async getRooms(userId: number) {
    return this.findOne(userId, {
      rooms: true,
    });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }
}
