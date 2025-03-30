import { Injectable } from '@nestjs/common';
import { Phone } from './entites/phone.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PhoneService {
  constructor(
    @InjectRepository(Phone)
    private phoneRepository: Repository<Phone>,
  ) {}
  create(data: any) {
    return this.phoneRepository.save(data);
  }
}
