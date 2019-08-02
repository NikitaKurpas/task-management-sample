import { forwardRef, Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Task } from './task.entity'
import { CommentModule } from '../comment/comment.module'
import { UserModule } from '../user/user.module'

@Module({
  imports: [TypeOrmModule.forFeature([Task]), forwardRef(() => CommentModule), UserModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService]
})
export class TaskModule {}
