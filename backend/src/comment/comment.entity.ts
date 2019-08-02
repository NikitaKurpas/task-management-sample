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
import { Exclude } from 'class-transformer'

@Entity()
export class Comment {
  @PrimaryColumn()
  id: string;

  @Column()
  text: string;

  @ManyToOne(() => Task, task => task.comments, {
    eager: false,
    lazy: true,
    primary: true,
  })
  @Exclude()
  _task: Task;

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
    this._task = task
    this.createdBy = createdBy
  }
}
