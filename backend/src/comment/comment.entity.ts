import { User } from '../user/user.entity';
import { Task } from '../task/task.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryColumn()
  id: string;

  @Column()
  text: string;

  @ManyToOne(() => Task, task => task.comments, {
    eager: true,
    lazy: false,
    primary: true,
  })
  task: Task;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, {
    eager: true,
    lazy: false,
    primary: true,
  })
  createdBy: User;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(id: string, text: string, task: Task, createdBy: User) {
    this.id = id
    this.text = text
    this.task = task
    this.createdBy = createdBy
  }
}
