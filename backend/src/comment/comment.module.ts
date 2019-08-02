import { Module } from '@nestjs/common';
import { TaskCommentController } from './task-comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Task } from '../task/task.entity'
import { Comment } from './comment.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Task, Comment])],
  controllers: [TaskCommentController],
  providers: [CommentService],
  exports: [CommentService]
})
export class CommentModule {}
