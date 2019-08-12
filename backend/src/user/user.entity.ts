import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { IUser, UserRole } from '../../../common/types/common'

@Entity()
export class User implements IUser {
  @PrimaryColumn()
  id: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  @Exclude()
  passwordHash: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ enum: ['user', 'administrator'] as UserRole[] })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  constructor(
    id: string,
    email: string,
    passwordHash: string,
    name: string | undefined,
    role: UserRole,
  ) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.name = name;
    this.role = role;
  }
}
