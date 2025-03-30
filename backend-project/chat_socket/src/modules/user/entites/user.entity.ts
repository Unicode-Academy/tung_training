import { Phone } from 'src/modules/phone/entites/phone.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 50,
  })
  name: string;

  @Column('varchar', {
    length: 100,
  })
  email: string;

  @Column('varchar', {
    length: 100,
  })
  password: string;

  @OneToOne(() => Phone, (phone) => phone.user)
  phone: Phone;

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
