import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
}

@Entity()
export class User {
  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: AuthProvider,
    default: AuthProvider.LOCAL,
  })
  @Column()
  provider: AuthProvider;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  providerId: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Exclude()
  dateCreated: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Exclude()
  dateUpdated: Date;
}
