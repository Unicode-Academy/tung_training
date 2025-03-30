import { User } from 'src/modules/user/entites/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('phones')
export class Phone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 50,
  })
  phone: string;

  //   @Column('int', {
  //     default: null,
  //   })
  //   user_id: number;

  @OneToOne(() => User, (user) => user.phone, {
    // eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
