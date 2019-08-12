import { User } from '../user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from '../comment/comment.entity';
import { Exclude } from 'class-transformer';
import { ITask, TaskStatus } from '../../../common/types/common'

@Entity()
export class Task implements ITask {
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
  })
  @JoinTable()
  assignees: User[];

  @OneToMany(() => Comment, comment => comment._task, {
    eager: false,
    onDelete: 'CASCADE',
    lazy: true,
  })
  @Exclude()
  _comments: Promise<Comment[]>;

  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, {
    eager: true,
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
    this.comments = [];
  }
}
