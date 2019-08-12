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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles.guard';
import { Roles } from '../roles.decorator';
import { TaskService } from './task.service';
import { ReqUser } from '../auth/auth.dto';
import { CommentService } from '../comment/comment.service';
import {
  CreateCommentDto,
  CreateTaskDto,
  UpdateTaskDto,
} from './task.controller.dto';
import { IComment, ITask } from '../../../common/types/common';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly commentService: CommentService,
  ) {}

  @Get()
  findAll(): Promise<ITask[]> {
    return this.taskService.findAll();
  }

  @Post()
  create(@Request() req, @Body() body: CreateTaskDto): Promise<ITask> {
    return this.taskService.create(body, req.user as ReqUser);
  }

  @Get(':id')
  @SerializeOptions({
    excludePrefixes: ['_'],
  })
  async findOne(@Param('id') taskId: string): Promise<ITask> {
    return await this.taskService.findOne(taskId);
  }

  @Put(':id')
  async updateOne(
    @Request() req,
    @Param('id') taskId: string,
    @Body() body: UpdateTaskDto,
  ): Promise<ITask> {
    // @ts-ignore - don't trust the client
    if (body.status === 'archived') {
      throw new ForbiddenException('Cannot update task status to archived.');
    }

    return await this.taskService.updateOne(taskId, body, req.user as ReqUser);
  }

  @Post(':id/archive')
  @Roles('admin')
  @UseGuards(RolesGuard)
  async archiveOne(@Param('id') taskId: string): Promise<ITask> {
    return await this.taskService.archiveOne(taskId);
  }

  @Get(':id/comments')
  async findAllCommentsTask(@Param('taskId') id: string): Promise<IComment[]> {
    const task = await this.taskService.findOne(id);
    return task.comments;
  }

  @Post(':id/comments')
  async createCommentForTask(
    @Request() req,
    @Param('taskId') taskId: string,
    @Body() body: CreateCommentDto,
  ): Promise<IComment> {
    return this.commentService.createForTask(taskId, body, req.user as ReqUser);
  }

  @Put(':id/assignees/:assigneeId')
  async addAssigneeToTask(
    @Param('id') taskId,
    @Param('assigneeId') assigneeId,
  ): Promise<ITask> {
    return this.taskService.addAssigneeToTask(taskId, assigneeId);
  }

  @Delete(':id/assignees/:assigneeId')
  async removeAssigneeFromTask(
    @Param('id') taskId,
    @Param('assigneeId') assigneeId,
  ): Promise<ITask> {
    return this.taskService.removeAssigneeFromTask(taskId, assigneeId);
  }
}
