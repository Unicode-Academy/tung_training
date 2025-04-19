import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}
  create(data: any) {
    return this.roomRepository.save(data);
  }

  async getRoomsByIds(ids: number[]) {
    // return this.roomRepository.findByIds(ids);
    const rooms = await Promise.all(
      ids.map((id: number) => this.roomRepository.findOneBy({ id })),
    );
    return rooms;
  }
}
