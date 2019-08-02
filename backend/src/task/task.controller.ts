import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Request,
  SerializeOptions,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Task } from './task.entity';
import { RolesGuard } from '../roles.guard';
import { Roles } from '../roles.decorator';
import { TaskService } from './task.service';
import { ReqUser } from '../auth/auth.dto'
import { Comment } from '../comment/comment.entity'
import { CommentService } from '../comment/comment.service'
import { CreateCommentDto, CreateTaskDto, UpdateTaskDto } from './task.controller.dto'

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(private readonly taskService: TaskService,
              private readonly commentService: CommentService) {}

  @Get()
  findAll(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  @Post()
  create(@Request() req, @Body() body: CreateTaskDto): Promise<Task> {
    return this.taskService.create(body, req.user as ReqUser);
  }

  @Get(':id')
  @SerializeOptions({
    excludePrefixes: ['_']
  })
  async findOne(@Param('id') taskId: string): Promise<Task> {
    return await this.taskService.findOne(taskId)
  }

  @Put(':id')
  async updateOne(
    @Param('id') taskId: string,
    @Body() body: UpdateTaskDto,
  ): Promise<Task> {
    // @ts-ignore - don't trust the client
    if (body.status === 'archived') {
      throw new ForbiddenException('Cannot update task status to archived.')
    }

    return await this.taskService.updateOne(taskId, body);
  }

  @Post(':id/archive')
  @Roles('admin')
  @UseGuards(RolesGuard)
  async archiveOne(@Param('id') taskId: string): Promise<Task> {
    return await this.taskService.archiveOne(taskId);
  }

  @Get(':id/comments')
  async findAllCommentsTask(@Param('taskId') id: string): Promise<Comment[]> {
    const task = await this.taskService.findOne(id)
    return task.comments
  }

  @Post(':id/comments')
  async createCommentForTask(@Request() req, @Param('taskId') taskId: string, @Body() body: CreateCommentDto): Promise<Comment> {
    return this.commentService.createForTask(taskId, body, req.user as ReqUser)
  }

  @Put(':id/assignees/:assigneeId')
  async addAssigneeToTask(@Param('id') taskId, @Param('assigneeId') assigneeId) {
    return this.taskService.addAssigneeToTask(taskId, assigneeId);
  }

  @Delete(':id/assignees/:assigneeId')
  async removeAssigneeFromTask(@Param('id') taskId, @Param('assigneeId') assigneeId) {
    return this.taskService.removeAssigneeFromTask(taskId, assigneeId);
  }
}
