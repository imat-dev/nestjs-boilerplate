import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  @Expose()
  lastName: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Exclude()
  dateCreated: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Exclude()
  dateUpdated: Date;
}
