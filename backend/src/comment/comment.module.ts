import { Module } from '@nestjs/common';
import { TaskCommentController } from './task-comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Task } from '../task/task.entity'
import { Comment } from './comment.entity'
import { CommentController } from './comment.controller'
import { TaskModule } from '../task/task.module'
import { TaskService } from '../task/task.service'

@Module({
  imports: [TypeOrmModule.forFeature([Task, Comment]), TaskModule],
  controllers: [TaskCommentController, CommentController],
  providers: [CommentService, TaskService],
  exports: [CommentService]
})
export class CommentModule {}
