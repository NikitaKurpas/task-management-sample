import { User } from '../user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export type TaskStatus = 'new' | 'in progress' | 'completed' | 'archived';

@Entity()
export class Task {
  @PrimaryColumn()
  id: string;

  @Column({
    enum: ['new', 'in progress', 'completed', 'archived'] as TaskStatus[],
  })
  status: TaskStatus;

  @Column()
  description: string;

  @ManyToMany(() => User, {
    eager: true,
    onDelete: 'CASCADE',
    cascade: false,
  })
  @JoinTable()
  assignees: User[];

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, {
    eager: true,
    cascade: false,
  })
  createdBy: User;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(
    id: string,
    status: TaskStatus,
    description: string,
    createdBy: User,
    assignees: User[],
  ) {
    this.id = id;
    this.status = status;
    this.description = description;
    this.createdBy = createdBy;
    this.assignees = assignees;
  }
}
