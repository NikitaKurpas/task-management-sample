import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request, UseGuards
} from '@nestjs/common';
import { Comment } from './comment.entity'
import { TaskService } from '../task/task.service'
import { CommentService } from './comment.service'
import { IsNotEmpty } from 'class-validator'
import { ReqUser } from '../auth/auth.dto'
import { AuthGuard } from '@nestjs/passport'

class CreateTaskDto {
  @IsNotEmpty()
  text: string
}

@Controller('tasks/:taskId/comments')
@UseGuards(AuthGuard('jwt'))
export class TaskCommentController {
  constructor(private readonly taskService: TaskService,
              private readonly commentService: CommentService) {}

  @Get()
  async findAllForTask(@Param('taskId') taskId: string): Promise<Comment[]> {
    const task = await this.taskService.findOne(taskId)

    if (!task) {
      throw new NotFoundException('Task does not exist.')
    }

    return await task.comments
  }

  @Post()
  async createForTask(@Request() req, @Param('taskId') taskId: string, @Body() body: CreateTaskDto): Promise<Comment> {
    let comment = await this.commentService.createForTask(taskId, body, req.user as ReqUser)

    if (!comment) {
      throw new NotFoundException('Task does not exist.')
    }

    return comment
  }
}
